import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { IsNumber, IsString, Min, IsOptional } from 'class-validator';
import { Refund } from './entities/refund.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { GatewayService } from '../../gateways/gateway.service';
import {
  AuditActionType,
  AuditEntityType,
  RefundStatus,
  TransactionStatus,
} from '../../common/types';
import { AuditService } from '../audit/audit.service';

export class CreateRefundDto {
  @IsString()
  transactionId!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}

@Injectable()
export class RefundsService {
  private readonly logger = new Logger(RefundsService.name);

  constructor(
    @InjectRepository(Refund)
    private readonly refundRepository: Repository<Refund>,
    private readonly connection: Connection,
    private readonly gatewayService: GatewayService,
    private readonly auditService: AuditService,
  ) {}

  async createRefund(dto: CreateRefundDto): Promise<Refund> {
    const idempotencyKey = dto.idempotencyKey || `refund:${dto.transactionId}:${dto.amount}`;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await queryRunner.manager.findOne(Transaction, {
        where: { id: dto.transactionId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!transaction) {
        throw new NotFoundException(`Transaction ${dto.transactionId} not found`);
      }

      if (transaction.status !== TransactionStatus.COMPLETED) {
        throw new BadRequestException('Only completed transactions can be refunded');
      }

      const transactionAmount = Number(transaction.amount);
      const alreadyRefunded = Number(transaction.refundedAmount);
      const availableAmount = transactionAmount - alreadyRefunded;
      if (dto.amount > availableAmount) {
        throw new BadRequestException(`Refund amount exceeds available amount: ${availableAmount}`);
      }

      const existingRefund = await queryRunner.manager.findOne(Refund, {
        where: { transactionId: transaction.id },
      });
      if (existingRefund && existingRefund.amount === dto.amount) {
        this.logger.log(`Refund already present for transaction ${transaction.id}, skipping gateway call`);
        await queryRunner.commitTransaction();
        return existingRefund;
      }

      const response = await this.gatewayService.createRefund(
        transaction.gateway,
        transaction.externalId ?? '',
        dto.amount,
        dto.reason,
        idempotencyKey,
      );

      if (!response.success) {
        throw new BadRequestException(response.message || 'Gateway refund failed');
      }

      const refund = queryRunner.manager.create(Refund, {
        transactionId: transaction.id,
        externalRefundId: response.externalRefundId ?? null,
        amount: dto.amount,
        status: response.status === RefundStatus.COMPLETED ? RefundStatus.COMPLETED : RefundStatus.PENDING,
        reason: dto.reason ?? null,
        processedAt: response.status === RefundStatus.COMPLETED ? new Date() : null,
      });

      const savedRefund = await queryRunner.manager.save(refund);

      const newRefundedAmount = alreadyRefunded + dto.amount;
      transaction.refundedAmount = newRefundedAmount as unknown as number;
      if (newRefundedAmount >= transactionAmount) {
        transaction.status = TransactionStatus.REFUNDED;
      } else {
        transaction.status = TransactionStatus.PARTIALLY_REFUNDED;
      }
      transaction.gatewayResponse = {
        ...(transaction.gatewayResponse ?? {}),
        lastRefundId: savedRefund.id,
      };
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();

      const nextRefundStatus = savedRefund.status;

      await this.auditService.recordEntry({
        entityType: AuditEntityType.REFUND,
        entityId: savedRefund.id,
        transactionId: transaction.id,
        refundId: savedRefund.id,
        gateway: transaction.gateway,
        action: AuditActionType.REFUND_CREATED,
        previousStatus: null,
        nextStatus: nextRefundStatus,
        source: 'refunds.createRefund',
        metadata: {
          amount: savedRefund.amount,
          reason: savedRefund.reason,
          externalRefundId: savedRefund.externalRefundId,
          idempotencyKey,
        },
      });

      if (nextRefundStatus !== RefundStatus.PENDING) {
        await this.auditService.recordEntry({
          entityType: AuditEntityType.REFUND,
          entityId: savedRefund.id,
          transactionId: transaction.id,
          refundId: savedRefund.id,
          gateway: transaction.gateway,
          action: AuditActionType.REFUND_STATUS_CHANGED,
          previousStatus: RefundStatus.PENDING,
          nextStatus: nextRefundStatus,
          source: 'refunds.createRefund',
          metadata: {
            amount: savedRefund.amount,
            externalRefundId: savedRefund.externalRefundId,
            gatewayResponse: savedRefund.gatewayResponse,
          },
        });

        await this.auditService.recordEntry({
          entityType: AuditEntityType.TRANSACTION,
          entityId: transaction.id,
          transactionId: transaction.id,
          gateway: transaction.gateway,
          action: AuditActionType.TRANSACTION_STATUS_CHANGED,
          previousStatus: TransactionStatus.COMPLETED,
          nextStatus: transaction.status,
          source: 'refunds.createRefund',
          metadata: {
            refundId: savedRefund.id,
            refundAmount: savedRefund.amount,
            refundStatus: savedRefund.status,
          },
        });
      }

      return savedRefund;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Refund creation failed for transaction ${dto.transactionId}`, error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Refund[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.refundRepository.findAndCount({
      relations: ['transaction'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Refund | null> {
    return this.refundRepository.findOne({ where: { id }, relations: ['transaction'] });
  }

  async getRefundStats(): Promise<{
    totalRefunds: number;
    totalAmount: number;
    pendingRefunds: number;
    byGateway: Record<string, { count: number; amount: number }>;
  }> {
    const stats = await this.refundRepository
      .createQueryBuilder('r')
      .select('t.gateway', 'gateway')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(r.amount)', 'totalAmount')
      .innerJoin('r.transaction', 't')
      .groupBy('t.gateway')
      .getRawMany();

    const pendingCount = await this.refundRepository.count({ where: { status: RefundStatus.PENDING } });

    const result = {
      totalRefunds: 0,
      totalAmount: 0,
      pendingRefunds: pendingCount,
      byGateway: {} as Record<string, { count: number; amount: number }>,
    };

    for (const stat of stats) {
      result.totalRefunds += parseInt(stat.count, 10);
      result.totalAmount += parseFloat(stat.totalAmount) || 0;
      result.byGateway[stat.gateway] = {
        count: parseInt(stat.count, 10),
        amount: parseFloat(stat.totalAmount) || 0,
      };
    }

    return result;
  }
}
