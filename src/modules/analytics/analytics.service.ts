import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AnalyticsDaily } from './entities/analytics-daily.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { GatewayType, TransactionStatus } from '../../common/types';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectRepository(AnalyticsDaily)
    private readonly analyticsRepository: Repository<AnalyticsDaily>,
    private readonly transactionsService: TransactionsService,
  ) {}

  async getSummary(startDate?: Date, endDate?: Date): Promise<{
    totalTransactions: number;
    totalAmount: number;
    totalRefunds: number;
    netAmount: number;
    successRate: number;
    byGateway: Record<string, { count: number; amount: number }>;
    byStatus: Record<string, number>;
  }> {
    const stats = await this.transactionsService.getTransactionStats({ startDate, endDate });
    const totalTransactions = stats.totalTransactions;
    const successRate = totalTransactions > 0 && stats.totalAmount > 0
      ? ((stats.totalAmount - stats.totalRefunded) / stats.totalAmount) * 100
      : 0;

    const byGateway = Object.fromEntries(
      Object.entries(stats.byGateway).map(([gateway, data]) => [
        gateway,
        {
          count: data.count,
          amount: data.amount,
        },
      ]),
    );

    return {
      totalTransactions,
      totalAmount: stats.totalAmount,
      totalRefunds: stats.totalRefunded,
      netAmount: stats.totalAmount - stats.totalRefunded,
      successRate: Math.round(successRate * 100) / 100,
      byGateway,
      byStatus: stats.byStatus,
    };
  }

  async getByGateway(startDate?: Date, endDate?: Date): Promise<{
    gateway: string;
    totalTransactions: number;
    totalAmount: number;
    totalRefunds: number;
    netAmount: number;
  }[]> {
    const results: { gateway: string; totalTransactions: number; totalAmount: number; totalRefunds: number; netAmount: number }[] = [];

    const stats = await this.transactionsService.getTransactionStats({ startDate, endDate });

    for (const [gateway, data] of Object.entries(stats.byGateway)) {
      results.push({
        gateway,
        totalTransactions: data.count,
        totalAmount: data.amount,
        totalRefunds: data.refundedAmount,
        netAmount: data.amount - data.refundedAmount,
      });
    }

    return results;
  }

  async getTrends(days: number = 30): Promise<{
    date: string;
    transactions: number;
    amount: number;
    refunds: number;
  }[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analytics = await this.analyticsRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC' },
    });

    return analytics.map((a) => ({
      date: a.date.toISOString().split('T')[0],
      transactions: a.totalTransactions,
      amount: parseFloat(a.totalAmount as unknown as string),
      refunds: parseFloat(a.totalRefunds as unknown as string),
    }));
  }

  async getRefundAnalytics(): Promise<{
    totalRefunds: number;
    totalAmount: number;
    pendingRefunds: number;
    byGateway: Record<string, { count: number; amount: number }>;
  }> {
    const stats = await this.analyticsRepository
      .createQueryBuilder('a')
      .select('a.gateway', 'gateway')
      .addSelect('SUM(a.total_refunds)', 'totalRefunds')
      .addSelect('COUNT(*)', 'count')
      .where('a.total_refunds > 0')
      .groupBy('a.gateway')
      .getRawMany();

    const byGateway: Record<string, { count: number; amount: number }> = {};
    let totalRefunds = 0;
    let totalAmount = 0;

    for (const stat of stats) {
      const amount = parseFloat(stat.totalRefunds) || 0;
      byGateway[stat.gateway] = {
        count: parseInt(stat.count, 10),
        amount,
      };
      totalRefunds += parseInt(stat.count, 10);
      totalAmount += amount;
    }

    return { totalRefunds, totalAmount, pendingRefunds: 0, byGateway };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async aggregateDailyStats(): Promise<void> {
    this.logger.log('Aggregating daily transaction stats...');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const transactions = await this.transactionsService['transactionRepository']
      .createQueryBuilder('t')
      .where('t.created_at >= :startDate', { startDate: yesterday })
      .andWhere('t.created_at < :endDate', { endDate: today })
      .getMany();

    const gatewayStats: Record<string, { transactions: number; amount: number; refunds: number }> = {};

    for (const tx of transactions) {
      if (!gatewayStats[tx.gateway]) {
        gatewayStats[tx.gateway] = { transactions: 0, amount: 0, refunds: 0 };
      }
      gatewayStats[tx.gateway].transactions++;
      gatewayStats[tx.gateway].amount += parseFloat(tx.amount as unknown as string);
      if (tx.status === TransactionStatus.REFUNDED || tx.status === TransactionStatus.PARTIALLY_REFUNDED) {
        gatewayStats[tx.gateway].refunds += parseFloat(tx.refundedAmount as unknown as string);
      }
    }

    for (const [gateway, stats] of Object.entries(gatewayStats)) {
      const analytics = this.analyticsRepository.create({
        date: yesterday,
        gateway: gateway as GatewayType,
        totalTransactions: stats.transactions,
        totalAmount: stats.amount,
        totalRefunds: stats.refunds,
        netAmount: stats.amount - stats.refunds,
      });

      await this.analyticsRepository.save(analytics);
    }

    this.logger.log('Daily aggregation completed');
  }
}
