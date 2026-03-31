import { Transaction } from '../../src/modules/transactions/entities/transaction.entity';
import { TransactionsService } from '../../src/modules/transactions/transactions.service';
import { GatewayService } from '../../src/gateways/gateway.service';
import { IdempotencyService } from '../../src/modules/transactions/idempotency.service';
import { AuditService } from '../../src/modules/audit/audit.service';
import { GatewayType, TransactionStatus } from '../../src/common/types';
import { createMockRepository, MockRepository } from '../helpers/mock-repository';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionRepository: MockRepository<Transaction>;
  let gatewayService: jest.Mocked<Pick<GatewayService, 'createPayment'>>;
  let idempotencyService: jest.Mocked<Pick<IdempotencyService, 'checkAndStore' | 'store'>>;
  let auditService: jest.Mocked<Pick<AuditService, 'recordEntry'>>;

  beforeEach(() => {
    transactionRepository = createMockRepository<Transaction>();
    gatewayService = {
      createPayment: jest.fn(),
    };
    idempotencyService = {
      checkAndStore: jest.fn(),
      store: jest.fn(),
    };
    auditService = {
      recordEntry: jest.fn(),
    };

    service = new TransactionsService(
      transactionRepository as never,
      gatewayService as never,
      idempotencyService as never,
      auditService as never,
    );
  });

  describe('createPayment', () => {
    const paymentDto = {
      gateway: GatewayType.STRIPE,
      amount: 100,
      currency: 'USD',
      customer: { email: 'test@test.com', phone: '+1234567890' },
      idempotencyKey: 'idem-key-1',
    };

    it('creates a new transaction when no idempotency match', async () => {
      idempotencyService.checkAndStore.mockResolvedValue(null);
      gatewayService.createPayment.mockResolvedValue({
        success: true,
        externalId: 'ext-123',
        gateway: GatewayType.STRIPE,
        status: TransactionStatus.PENDING,
        paymentUrl: 'https://pay.stripe.com/session',
      });

      const savedTransaction = {
        id: 'txn-1',
        externalId: 'ext-123',
        gateway: GatewayType.STRIPE,
        amount: 100,
        currency: 'USD',
        status: TransactionStatus.PENDING,
        idempotencyKey: 'idem-key-1',
      } as Transaction;

      transactionRepository.create.mockReturnValue(savedTransaction);
      transactionRepository.save.mockResolvedValue(savedTransaction);
      auditService.recordEntry.mockResolvedValue({ id: 'audit-1' } as never);

      const result = await service.createPayment(paymentDto);

      expect(result.id).toBe('txn-1');
      expect(gatewayService.createPayment).toHaveBeenCalledWith(
        GatewayType.STRIPE,
        100,
        'USD',
        { email: 'test@test.com', phone: '+1234567890' },
        'idem-key-1',
        undefined,
        undefined,
      );
      expect(idempotencyService.store).toHaveBeenCalledWith('idem-key-1', 'txn-1');
      expect(auditService.recordEntry).toHaveBeenCalled();
    });

    it('returns existing transaction on idempotency match', async () => {
      const existingTxn = {
        id: 'txn-existing',
        idempotencyKey: 'idem-key-1',
        status: TransactionStatus.COMPLETED,
      } as Transaction;

      idempotencyService.checkAndStore.mockResolvedValue('txn-existing');
      transactionRepository.findOne.mockResolvedValue(existingTxn);

      const result = await service.createPayment(paymentDto);

      expect(result.id).toBe('txn-existing');
      expect(gatewayService.createPayment).not.toHaveBeenCalled();
    });

    it('creates transaction when idempotency key returns missing transaction id', async () => {
      idempotencyService.checkAndStore.mockResolvedValue('txn-missing');
      transactionRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'txn-new' } as Transaction);
      gatewayService.createPayment.mockResolvedValue({
        success: true,
        externalId: 'ext-456',
        gateway: GatewayType.STRIPE,
        status: TransactionStatus.PENDING,
      });

      transactionRepository.create.mockReturnValue({ id: 'txn-new' } as Transaction);
      transactionRepository.save.mockResolvedValue({ id: 'txn-new' } as Transaction);
      auditService.recordEntry.mockResolvedValue({ id: 'audit-2' } as never);

      const result = await service.createPayment(paymentDto);

      expect(result.id).toBe('txn-new');
      expect(gatewayService.createPayment).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns paginated transactions with filters', async () => {
      const transactions = [{ id: 'txn-1', gateway: GatewayType.STRIPE }] as Transaction[];
      transactionRepository.findAndCount.mockResolvedValue([transactions, 1]);

      const result = await service.findAll({ gateway: GatewayType.STRIPE }, 1, 10);

      expect(result).toEqual({
        data: transactions,
        total: 1,
        page: 1,
        limit: 10,
      });
      expect(transactionRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { gateway: GatewayType.STRIPE },
          skip: 0,
          take: 10,
        }),
      );
    });

    it('applies status filter', async () => {
      transactionRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ status: TransactionStatus.COMPLETED }, 2, 5);

      expect(transactionRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: TransactionStatus.COMPLETED },
          skip: 5,
          take: 5,
        }),
      );
    });

    it('applies customer email filter', async () => {
      transactionRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ customerEmail: 'test@test.com' }, 1, 20);

      expect(transactionRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { customerEmail: 'test@test.com' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('returns transaction by id', async () => {
      const txn = { id: 'txn-1' } as Transaction;
      transactionRepository.findOne.mockResolvedValue(txn);

      const result = await service.findOne('txn-1');

      expect(result).toEqual(txn);
    });

    it('returns null when not found', async () => {
      transactionRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findByExternalId', () => {
    it('returns transaction by external id and gateway', async () => {
      const txn = { id: 'txn-1', externalId: 'ext-123', gateway: GatewayType.STRIPE } as Transaction;
      transactionRepository.findOne.mockResolvedValue(txn);

      const result = await service.findByExternalId('ext-123', GatewayType.STRIPE);

      expect(result).toEqual(txn);
      expect(transactionRepository.findOne).toHaveBeenCalledWith({
        where: { externalId: 'ext-123', gateway: GatewayType.STRIPE },
      });
    });
  });

  describe('updateStatus', () => {
    it('updates transaction status and records audit', async () => {
      const txn = {
        id: 'txn-1',
        status: TransactionStatus.PENDING,
        gateway: GatewayType.STRIPE,
      } as Transaction;

      transactionRepository.findOne.mockResolvedValue(txn);
      transactionRepository.save.mockResolvedValue({
        ...txn,
        status: TransactionStatus.COMPLETED,
      } as Transaction);
      auditService.recordEntry.mockResolvedValue({ id: 'audit-1' } as never);

      const result = await service.updateStatus('txn-1', TransactionStatus.COMPLETED);

      expect(result?.status).toBe(TransactionStatus.COMPLETED);
      expect(auditService.recordEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          previousStatus: TransactionStatus.PENDING,
          nextStatus: TransactionStatus.COMPLETED,
        }),
      );
    });

    it('returns null when transaction not found', async () => {
      transactionRepository.findOne.mockResolvedValue(null);

      const result = await service.updateStatus('nonexistent', TransactionStatus.COMPLETED);

      expect(result).toBeNull();
      expect(transactionRepository.save).not.toHaveBeenCalled();
    });

    it('does not record audit when status unchanged', async () => {
      const txn = {
        id: 'txn-1',
        status: TransactionStatus.COMPLETED,
        gateway: GatewayType.STRIPE,
      } as Transaction;

      transactionRepository.findOne.mockResolvedValue(txn);
      transactionRepository.save.mockResolvedValue(txn);

      await service.updateStatus('txn-1', TransactionStatus.COMPLETED);

      expect(auditService.recordEntry).not.toHaveBeenCalled();
    });
  });

  describe('getTransactionStats', () => {
    it('aggregates transaction statistics correctly', async () => {
      const mockStats = [
        { gateway: 'stripe', count: '5', totalAmount: '500.00', totalRefunded: '50.00' },
        { gateway: 'paypal', count: '3', totalAmount: '300.00', totalRefunded: '0' },
      ];

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockStats),
      };

      (transactionRepository as unknown as { createQueryBuilder: jest.Mock }).createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);

      const result = await service.getTransactionStats();

      expect(result.totalTransactions).toBe(8);
      expect(result.totalAmount).toBe(800);
      expect(result.totalRefunded).toBe(50);
      expect(result.byGateway['stripe']).toEqual({
        count: 5,
        amount: 500,
        refundedAmount: 50,
      });
    });
  });

  describe('updateRefundAmount', () => {
    it('increments refunded amount', async () => {
      transactionRepository.increment.mockResolvedValue(undefined as never);

      await service.updateRefundAmount('txn-1', 25);

      expect(transactionRepository.increment).toHaveBeenCalledWith(
        { id: 'txn-1' },
        'refundedAmount',
        25,
      );
    });
  });
});
