import { Injectable, Logger, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, SelectQueryBuilder } from 'typeorm';
import { randomUUID } from 'crypto';
import { IsEnum, IsNumber, IsString, Min, IsOptional, IsObject } from 'class-validator';
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

export class CreatePaymentDto {
  @IsEnum(GatewayType)
  gateway!: GatewayType;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  currency!: string;

  @IsObject()
  customer!: PaymentCustomer;

  @IsString()
  @IsOptional()
  idempotencyKey?: string;

  @IsObject()
  @IsOptional()
  metadata?: PaymentMetadata;

  @IsString()
  @IsOptional()
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

  private applyDateFilters(
    queryBuilder: SelectQueryBuilder<Transaction>,
    filters?: Pick<TransactionFilters, 'startDate' | 'endDate'>,
  ): SelectQueryBuilder<Transaction> {
    if (filters?.startDate) {
      queryBuilder.andWhere('t.created_at >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters?.endDate) {
      queryBuilder.andWhere('t.created_at <= :endDate', {
        endDate: filters.endDate,
      });
    }

    return queryBuilder;
  }

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly gatewayService: GatewayService,
    private readonly idempotencyService: IdempotencyService,
    private readonly auditService: AuditService,
  ) {}

  async createPayment(dto: CreatePaymentDto): Promise<Transaction> {
    if (!dto.idempotencyKey) {
      throw new BadRequestException('idempotencyKey is required');
    }
    const idempotencyKey = dto.idempotencyKey;

    const lockToken = randomUUID();
    const lockKey = `idempotency:${idempotencyKey}`;

    const acquired = await this.idempotencyService.acquireLock(lockKey, lockToken);
    if (!acquired) {
      const inFlight = await this.findByIdempotencyKey(idempotencyKey);
      if (inFlight) {
        return inFlight;
      }
      throw new ConflictException(
        `A payment request for idempotency key ${idempotencyKey} is already in progress. Retry shortly.`,
      );
    }

    try {
      const alreadyPersisted = await this.findByIdempotencyKey(idempotencyKey);
      if (alreadyPersisted) {
        return alreadyPersisted;
      }

      const response = await this.gatewayService.createPayment(
        dto.gateway,
        dto.amount,
        dto.currency,
        dto.customer,
        idempotencyKey,
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
        idempotencyKey: idempotencyKey,
        paymentUrl: response.paymentUrl,
        returnUrl: dto.returnUrl,
      });

      let savedTransaction: Transaction;
      try {
        savedTransaction = await this.transactionRepository.save(transaction);
      } catch (error) {
        if (this.isUniqueViolation(error)) {
          const concurrent = await this.findByIdempotencyKey(idempotencyKey);
          if (concurrent) {
            return concurrent;
          }
        }
        throw error;
      }

      await this.idempotencyService.storeMapping(idempotencyKey, savedTransaction.id);

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
    } finally {
      await this.idempotencyService.releaseLock(lockKey, lockToken);
    }
  }

  private isUniqueViolation(error: unknown): boolean {
    if (!error) return false;
    if (error instanceof Error && 'code' in error) {
      const code = (error as { code: unknown }).code;
      return code === '23505' || code === 'ER_DUP_ENTRY';
    }
    return false;
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<Transaction | null> {
    return this.transactionRepository.findOne({ where: { idempotencyKey } });
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

  async getTransactionStats(
    filters?: Pick<TransactionFilters, 'startDate' | 'endDate'>,
  ): Promise<{
    totalTransactions: number;
    totalAmount: number;
    totalRefunded: number;
    byGateway: Record<string, { count: number; amount: number; refundedAmount: number }>;
    byStatus: Record<string, number>;
  }> {
    const statsQuery = this.transactionRepository
      .createQueryBuilder('t')
      .select('t.gateway', 'gateway')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(t.amount)', 'totalAmount')
      .addSelect('SUM(t.refundedAmount)', 'totalRefunded')
      .groupBy('t.gateway');

    this.applyDateFilters(statsQuery, filters);

    const statusQuery = this.transactionRepository
      .createQueryBuilder('t')
      .select('t.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('t.status');

    this.applyDateFilters(statusQuery, filters);

    const [stats, byStatusStats] = await Promise.all([
      statsQuery.getRawMany(),
      statusQuery.getRawMany(),
    ]);

    const result = {
      totalTransactions: 0,
      totalAmount: 0,
      totalRefunded: 0,
      byGateway: {} as Record<string, { count: number; amount: number; refundedAmount: number }>,
      byStatus: {} as Record<string, number>,
    };

    for (const stat of stats) {
      result.totalTransactions += parseInt(stat.count, 10);
      result.totalAmount += parseFloat(stat.totalAmount) || 0;
      result.totalRefunded += parseFloat(stat.totalRefunded) || 0;
      result.byGateway[stat.gateway] = {
        count: parseInt(stat.count, 10),
        amount: parseFloat(stat.totalAmount) || 0,
        refundedAmount: parseFloat(stat.totalRefunded) || 0,
      };
    }

    for (const stat of byStatusStats) {
      result.byStatus[stat.status] = parseInt(stat.count, 10);
    }

    return result;
  }
}
