import { Refund } from '../../src/modules/refunds/entities/refund.entity';
import { Transaction } from '../../src/modules/transactions/entities/transaction.entity';
import { RefundsService } from '../../src/modules/refunds/refunds.service';
import { TransactionsService } from '../../src/modules/transactions/transactions.service';
import { GatewayService } from '../../src/gateways/gateway.service';
import { AuditService } from '../../src/modules/audit/audit.service';
import { GatewayType, TransactionStatus, RefundStatus } from '../../src/common/types';
import { createMockRepository, MockRepository } from '../helpers/mock-repository';

describe('RefundsService', () => {
  let service: RefundsService;
  let refundRepository: MockRepository<Refund>;
  let transactionsService: jest.Mocked<Pick<TransactionsService, 'findOne' | 'updateStatus' | 'updateRefundAmount'>>;
  let gatewayService: jest.Mocked<Pick<GatewayService, 'createRefund'>>;
  let auditService: jest.Mocked<Pick<AuditService, 'recordEntry'>>;

  beforeEach(() => {
    refundRepository = createMockRepository<Refund>();
    transactionsService = {
      findOne: jest.fn(),
      updateStatus: jest.fn(),
      updateRefundAmount: jest.fn(),
    };
    gatewayService = {
      createRefund: jest.fn(),
    };
    auditService = {
      recordEntry: jest.fn(),
    };

    service = new RefundsService(
      refundRepository as never,
      transactionsService as never,
      gatewayService as never,
      auditService as never,
    );
  });

  describe('createRefund', () => {
    const completedTransaction = {
      id: 'txn-1',
      externalId: 'ext-123',
      gateway: GatewayType.STRIPE,
      amount: 100,
      refundedAmount: 0,
      status: TransactionStatus.COMPLETED,
    } as Transaction;

    it('creates a full refund successfully', async () => {
      transactionsService.findOne.mockResolvedValue(completedTransaction);
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
      } as Refund;

      refundRepository.create.mockReturnValue(savedRefund);
      refundRepository.save.mockResolvedValue(savedRefund);
      auditService.recordEntry.mockResolvedValue({ id: 'audit-1' } as never);
      transactionsService.updateRefundAmount.mockResolvedValue(undefined);
      transactionsService.updateStatus.mockResolvedValue(completedTransaction);

      const result = await service.createRefund({
        transactionId: 'txn-1',
        amount: 100,
        reason: 'customer request',
      });

      expect(result.id).toBe('refund-1');
      expect(transactionsService.updateStatus).toHaveBeenCalledWith(
        'txn-1',
        TransactionStatus.REFUNDED,
        undefined,
        'refunds.createRefund',
        expect.any(Object),
      );
    });

    it('creates a partial refund successfully', async () => {
      transactionsService.findOne.mockResolvedValue(completedTransaction);
      gatewayService.createRefund.mockResolvedValue({
        success: true,
        externalRefundId: 'ref-456',
        status: RefundStatus.COMPLETED,
      });

      const savedRefund = {
        id: 'refund-2',
        transactionId: 'txn-1',
        amount: 50,
        status: RefundStatus.COMPLETED,
      } as Refund;

      refundRepository.create.mockReturnValue(savedRefund);
      refundRepository.save.mockResolvedValue(savedRefund);
      auditService.recordEntry.mockResolvedValue({ id: 'audit-2' } as never);

      await service.createRefund({
        transactionId: 'txn-1',
        amount: 50,
      });

      expect(transactionsService.updateStatus).toHaveBeenCalledWith(
        'txn-1',
        TransactionStatus.PARTIALLY_REFUNDED,
        undefined,
        'refunds.createRefund',
        expect.any(Object),
      );
    });

    it('throws NotFoundException when transaction not found', async () => {
      transactionsService.findOne.mockResolvedValue(null);

      await expect(
        service.createRefund({ transactionId: 'nonexistent', amount: 50 }),
      ).rejects.toThrow('Transaction nonexistent not found');
    });

    it('throws BadRequestException for non-completed transaction', async () => {
      transactionsService.findOne.mockResolvedValue({
        ...completedTransaction,
        status: TransactionStatus.PENDING,
      } as Transaction);

      await expect(
        service.createRefund({ transactionId: 'txn-1', amount: 50 }),
      ).rejects.toThrow('Only completed transactions can be refunded');
    });

    it('throws BadRequestException when refund exceeds available amount', async () => {
      transactionsService.findOne.mockResolvedValue({
        ...completedTransaction,
        refundedAmount: 80,
      } as Transaction);

      await expect(
        service.createRefund({ transactionId: 'txn-1', amount: 50 }),
      ).rejects.toThrow('Refund amount exceeds available amount: 20');
    });

    it('creates pending refund when gateway returns pending status', async () => {
      transactionsService.findOne.mockResolvedValue(completedTransaction);
      gatewayService.createRefund.mockResolvedValue({
        success: true,
        externalRefundId: 'ref-pending',
        status: RefundStatus.PENDING,
      });

      const savedRefund = {
        id: 'refund-3',
        amount: 50,
        status: RefundStatus.PENDING,
      } as Refund;

      refundRepository.create.mockReturnValue(savedRefund);
      refundRepository.save.mockResolvedValue(savedRefund);
      auditService.recordEntry.mockResolvedValue({ id: 'audit-3' } as never);

      const result = await service.createRefund({
        transactionId: 'txn-1',
        amount: 50,
      });

      expect(result.status).toBe(RefundStatus.PENDING);
    });
  });

  describe('findAll', () => {
    it('returns paginated refunds', async () => {
      const refunds = [{ id: 'refund-1' }] as Refund[];
      refundRepository.findAndCount.mockResolvedValue([refunds, 1]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: refunds,
        total: 1,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('findOne', () => {
    it('returns refund by id with transaction relation', async () => {
      const refund = { id: 'refund-1', transaction: { id: 'txn-1' } } as Refund;
      refundRepository.findOne.mockResolvedValue(refund);

      const result = await service.findOne('refund-1');

      expect(result).toEqual(refund);
    });

    it('returns null when not found', async () => {
      refundRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getRefundStats', () => {
    it('aggregates refund statistics', async () => {
      const mockStats = [
        { gateway: 'stripe', count: '3', totalAmount: '150.00' },
        { gateway: 'paypal', count: '2', totalAmount: '100.00' },
      ];

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockStats),
      };

      (refundRepository as unknown as { createQueryBuilder: jest.Mock }).createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      refundRepository.count.mockResolvedValue(1);

      const result = await service.getRefundStats();

      expect(result.totalRefunds).toBe(5);
      expect(result.totalAmount).toBe(250);
      expect(result.pendingRefunds).toBe(1);
      expect(result.byGateway['stripe']).toEqual({
        count: 3,
        amount: 150,
      });
    });
  });
});
