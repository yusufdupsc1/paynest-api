import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Refund } from '../../src/modules/refunds/entities/refund.entity';
import { Transaction } from '../../src/modules/transactions/entities/transaction.entity';
import { RefundsService } from '../../src/modules/refunds/refunds.service';
import { GatewayService } from '../../src/gateways/gateway.service';
import { AuditService } from '../../src/modules/audit/audit.service';
import { GatewayType, TransactionStatus, RefundStatus } from '../../src/common/types';
import { createMockRepository, MockRepository } from '../helpers/mock-repository';

function buildMockQueryRunner() {
  const manager = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const qr = {
    connect: jest.fn().mockResolvedValue(undefined),
    startTransaction: jest.fn().mockResolvedValue(undefined),
    commitTransaction: jest.fn().mockResolvedValue(undefined),
    rollbackTransaction: jest.fn().mockResolvedValue(undefined),
    release: jest.fn().mockResolvedValue(undefined),
    manager,
  };
  return { qr, manager };
}

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 'txn-1',
    externalId: 'ext-123',
    gateway: GatewayType.STRIPE,
    amount: 100,
    refundedAmount: 0,
    status: TransactionStatus.COMPLETED,
    gatewayResponse: null,
    metadata: null,
    ...overrides,
  } as unknown as Transaction;
}

describe('RefundsService', () => {
  let service: RefundsService;
  let refundRepository: MockRepository<Refund>;
  let gatewayService: jest.Mocked<Pick<GatewayService, 'createRefund'>>;
  let auditService: jest.Mocked<Pick<AuditService, 'recordEntry'>>;
  let connection: { createQueryRunner: jest.Mock };
  let queryRunner: ReturnType<typeof buildMockQueryRunner>['qr'];
  let manager: ReturnType<typeof buildMockQueryRunner>['manager'];

  beforeEach(() => {
    refundRepository = createMockRepository<Refund>();
    gatewayService = { createRefund: jest.fn() };
    auditService = { recordEntry: jest.fn().mockResolvedValue({ id: 'audit-1' } as never) };

    const built = buildMockQueryRunner();
    queryRunner = built.qr;
    manager = built.manager;
    connection = { createQueryRunner: jest.fn().mockReturnValue(queryRunner) };

    service = new RefundsService(
      refundRepository as unknown as Repository<Refund>,
      connection as never,
      gatewayService as never,
      auditService as never,
    );
  });

  describe('createRefund', () => {
    it('creates a full refund and updates transaction status', async () => {
      manager.findOne.mockImplementation((entity) => {
        if (entity === Transaction) return Promise.resolve(makeTransaction());
        return Promise.resolve(null);
      });
      gatewayService.createRefund.mockResolvedValue({
        success: true,
        externalRefundId: 'ref-123',
        status: RefundStatus.COMPLETED,
      });

      const savedRefund = {
        id: 'refund-1',
        transactionId: 'txn-1',
        amount: 100,
        status: RefundStatus.COMPLETED,
        externalRefundId: 'ref-123',
        processedAt: new Date(),
        gatewayResponse: null,
      } as Refund;

      manager.create.mockReturnValue(savedRefund as never);
      manager.save.mockResolvedValue(savedRefund as never);

      const result = await service.createRefund({ transactionId: 'txn-1', amount: 100, reason: 'x' });

      expect(result.id).toBe('refund-1');
      expect(gatewayService.createRefund).toHaveBeenCalledWith(
        GatewayType.STRIPE,
        'ext-123',
        100,
        'x',
        'refund:txn-1:100',
      );
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(auditService.recordEntry).toHaveBeenCalled();
    });

    it('creates a partial refund and marks transaction PARTIALLY_REFUNDED', async () => {
      manager.findOne.mockImplementation((entity) => {
        if (entity === Transaction) return Promise.resolve(makeTransaction({ refundedAmount: 40 }));
        return Promise.resolve(null);
      });
      gatewayService.createRefund.mockResolvedValue({
        success: true,
        externalRefundId: 'ref-456',
        status: RefundStatus.COMPLETED,
      });

      const savedRefund = { id: 'refund-2', amount: 50, status: RefundStatus.COMPLETED } as Refund;
      manager.create.mockReturnValue(savedRefund as never);
      manager.save.mockResolvedValue(savedRefund as never);

      const result = await service.createRefund({ transactionId: 'txn-1', amount: 50 });

      expect(result.id).toBe('refund-2');
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('throws NotFoundException when transaction not found', async () => {
      manager.findOne.mockResolvedValue(null);

      await expect(service.createRefund({ transactionId: 'missing', amount: 50 })).rejects.toThrow(NotFoundException);
      expect(gatewayService.createRefund).not.toHaveBeenCalled();
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('throws BadRequestException when transaction is not completed', async () => {
      manager.findOne.mockResolvedValue(makeTransaction({ status: TransactionStatus.PENDING }));

      await expect(service.createRefund({ transactionId: 'txn-1', amount: 50 })).rejects.toThrow(BadRequestException);
      expect(gatewayService.createRefund).not.toHaveBeenCalled();
    });

    it('throws BadRequestException when refund amount exceeds available', async () => {
      manager.findOne.mockResolvedValue(makeTransaction({ amount: 100, refundedAmount: 80 }));

      await expect(service.createRefund({ transactionId: 'txn-1', amount: 50 })).rejects.toThrow(BadRequestException);
      expect(gatewayService.createRefund).not.toHaveBeenCalled();
    });

    it('rolls back and throws on gateway failure', async () => {
      manager.findOne.mockResolvedValue(makeTransaction());
      gatewayService.createRefund.mockResolvedValue({
        success: false,
        status: RefundStatus.FAILED,
        message: 'gateway error',
      });

      await expect(service.createRefund({ transactionId: 'txn-1', amount: 50 })).rejects.toThrow(BadRequestException);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
    });

    it('reuses an existing same-amount refund without calling the gateway', async () => {
      manager.findOne.mockImplementation((entity) => {
        if (entity === Transaction) return Promise.resolve(makeTransaction());
        return Promise.resolve({ id: 'refund-existing', amount: 50 } as Refund);
      });

      const result = await service.createRefund({ transactionId: 'txn-1', amount: 50 });

      expect(result.id).toBe('refund-existing');
      expect(gatewayService.createRefund).not.toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });
  });
});
