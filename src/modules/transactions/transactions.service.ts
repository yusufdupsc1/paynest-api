import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { GatewayService } from '../../gateways/gateway.service';
import { IdempotencyService } from './idempotency.service';
import {
  AuditActionType,
  AuditEntityType,
  GatewayType,
  TransactionStatus,
  PaymentCustomer,
  PaymentMetadata,
} from '../../common/types';
import { AuditService } from '../audit/audit.service';

export interface CreatePaymentDto {
  gateway: GatewayType;
  amount: number;
  currency: string;
  customer: PaymentCustomer;
  idempotencyKey: string;
  metadata?: PaymentMetadata;
  returnUrl?: string;
}

export interface TransactionFilters {
  gateway?: GatewayType;
  status?: TransactionStatus;
  customerEmail?: string;
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly gatewayService: GatewayService,
    private readonly idempotencyService: IdempotencyService,
    private readonly auditService: AuditService,
  ) {}

  async createPayment(dto: CreatePaymentDto): Promise<Transaction> {
    const existingTransactionId = await this.idempotencyService.checkAndStore(
      dto.idempotencyKey,
    );

    if (existingTransactionId) {
      this.logger.log(`Returning existing transaction for idempotency key: ${dto.idempotencyKey}`);
      const existingTransaction = await this.findOne(existingTransactionId);
      if (existingTransaction) {
        return existingTransaction;
      }
    }

    const response = await this.gatewayService.createPayment(
      dto.gateway,
      dto.amount,
      dto.currency,
      dto.customer,
      dto.idempotencyKey,
      dto.metadata,
      dto.returnUrl,
    );

    const transaction = this.transactionRepository.create({
      externalId: response.externalId,
      gateway: dto.gateway,
      amount: dto.amount,
      currency: dto.currency,
      status: response.status,
      customerEmail: dto.customer.email,
      customerPhone: dto.customer.phone,
      customerName: dto.customer.name,
      metadata: dto.metadata,
      gatewayResponse: response.gatewayResponse as Record<string, unknown>,
      idempotencyKey: dto.idempotencyKey,
      paymentUrl: response.paymentUrl,
      returnUrl: dto.returnUrl,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);
    await this.idempotencyService.store(dto.idempotencyKey, savedTransaction.id);

    await this.auditService.recordEntry({
      entityType: AuditEntityType.TRANSACTION,
      entityId: savedTransaction.id,
      transactionId: savedTransaction.id,
      gateway: savedTransaction.gateway,
      action: AuditActionType.TRANSACTION_CREATED,
      previousStatus: null,
      nextStatus: savedTransaction.status,
      source: 'transactions.createPayment',
      metadata: {
        externalId: savedTransaction.externalId,
        amount: savedTransaction.amount,
        currency: savedTransaction.currency,
        idempotencyKey: savedTransaction.idempotencyKey,
      },
    });

    return savedTransaction;
  }

  async findAll(
    filters: TransactionFilters,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Transaction[]; total: number; page: number; limit: number }> {
    const where: FindOptionsWhere<Transaction> = {};

    if (filters.gateway) where.gateway = filters.gateway;
    if (filters.status) where.status = filters.status;
    if (filters.customerEmail) where.customerEmail = filters.customerEmail;

    const [data, total] = await this.transactionRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Transaction | null> {
    return this.transactionRepository.findOne({ where: { id } });
  }

  async findByExternalId(externalId: string, gateway: GatewayType): Promise<Transaction | null> {
    return this.transactionRepository.findOne({ where: { externalId, gateway } });
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    gatewayResponse?: Record<string, unknown>,
    source: string = 'transactions.updateStatus',
    metadata?: Record<string, unknown>,
  ): Promise<Transaction | null> {
    const transaction = await this.findOne(id);
    if (!transaction) return null;

    const previousStatus = transaction.status;

    transaction.status = status;
    if (gatewayResponse) transaction.gatewayResponse = gatewayResponse;

    const savedTransaction = await this.transactionRepository.save(transaction);

    if (previousStatus !== status) {
      await this.auditService.recordEntry({
        entityType: AuditEntityType.TRANSACTION,
        entityId: savedTransaction.id,
        transactionId: savedTransaction.id,
        gateway: savedTransaction.gateway,
        action: AuditActionType.TRANSACTION_STATUS_CHANGED,
        previousStatus,
        nextStatus: status,
        source,
        metadata: {
          ...(metadata || {}),
          gatewayResponse,
        },
      });
    }

    return savedTransaction;
  }

  async updateRefundAmount(id: string, refundedAmount: number): Promise<void> {
    await this.transactionRepository.increment({ id }, 'refundedAmount', refundedAmount);
  }

  async getTransactionStats(): Promise<{
    totalTransactions: number;
    totalAmount: number;
    totalRefunded: number;
    byGateway: Record<string, { count: number; amount: number }>;
  }> {
    const stats = await this.transactionRepository
      .createQueryBuilder('t')
      .select('t.gateway', 'gateway')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(t.amount)', 'totalAmount')
      .addSelect('SUM(t.refundedAmount)', 'totalRefunded')
      .groupBy('t.gateway')
      .getRawMany();

    const result = {
      totalTransactions: 0,
      totalAmount: 0,
      totalRefunded: 0,
      byGateway: {} as Record<string, { count: number; amount: number }>,
    };

    for (const stat of stats) {
      result.totalTransactions += parseInt(stat.count, 10);
      result.totalAmount += parseFloat(stat.totalAmount) || 0;
      result.totalRefunded += parseFloat(stat.totalRefunded) || 0;
      result.byGateway[stat.gateway] = {
        count: parseInt(stat.count, 10),
        amount: parseFloat(stat.totalAmount) || 0,
      };
    }

    return result;
  }
}
