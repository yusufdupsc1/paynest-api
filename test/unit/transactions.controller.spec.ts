import { TransactionsController } from '../../src/modules/transactions/transactions.controller';
import { TransactionsService } from '../../src/modules/transactions/transactions.service';
import { Transaction } from '../../src/modules/transactions/entities/transaction.entity';
import { GatewayType, TransactionStatus } from '../../src/common/types';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionsService: jest.Mocked<TransactionsService>;

  beforeEach(() => {
    transactionsService = {
      createPayment: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      getTransactionStats: jest.fn(),
    } as unknown as jest.Mocked<TransactionsService>;

    controller = new TransactionsController(transactionsService);
  });

  describe('initiatePayment', () => {
    it('creates payment and returns success', async () => {
      const transaction = {
        id: 'txn-1',
        status: TransactionStatus.PENDING,
        paymentUrl: 'https://pay.stripe.com/session',
      } as Transaction;

      transactionsService.createPayment.mockResolvedValue(transaction);

      const result = await controller.initiatePayment(
        {
          gateway: GatewayType.STRIPE,
          amount: 100,
          currency: 'USD',
          customer: { email: 'test@test.com', phone: '+1234567890' },
          idempotencyKey: '',
        },
        'idem-key-1',
      );

      expect(result.success).toBe(true);
      expect(result.transaction.id).toBe('txn-1');
      expect(result.paymentUrl).toBe('https://pay.stripe.com/session');
    });

    it('returns success false for failed transactions', async () => {
      transactionsService.createPayment.mockResolvedValue({
        id: 'txn-2',
        status: TransactionStatus.FAILED,
      } as Transaction);

      const result = await controller.initiatePayment(
        {
          gateway: GatewayType.STRIPE,
          amount: 100,
          currency: 'USD',
          customer: { email: 'test@test.com', phone: '+1234567890' },
          idempotencyKey: '',
        },
        'idem-key-2',
      );

      expect(result.success).toBe(false);
    });

    it('throws BadRequestException when idempotency key missing', async () => {
      await expect(
        controller.initiatePayment(
          {
            gateway: GatewayType.STRIPE,
            amount: 100,
            currency: 'USD',
            customer: { email: 'test@test.com', phone: '+1234567890' },
            idempotencyKey: '',
          },
          '',
        ),
      ).rejects.toThrow('idempotency-key header is required');
    });
  });

  describe('listTransactions', () => {
    it('returns paginated transactions', async () => {
      const transactions = [{ id: 'txn-1' }] as Transaction[];
      transactionsService.findAll.mockResolvedValue({
        data: transactions,
        total: 1,
        page: 1,
        limit: 20,
      });

      const result = await controller.listTransactions();

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('applies query filters', async () => {
      transactionsService.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      await controller.listTransactions(1, 10, GatewayType.STRIPE, TransactionStatus.COMPLETED);

      expect(transactionsService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: GatewayType.STRIPE,
          status: TransactionStatus.COMPLETED,
        }),
        1,
        10,
      );
    });
  });

  describe('getTransaction', () => {
    it('returns transaction by id', async () => {
      const txn = { id: 'txn-1' } as Transaction;
      transactionsService.findOne.mockResolvedValue(txn);

      const result = await controller.getTransaction('txn-1');

      expect(result.id).toBe('txn-1');
    });

    it('throws NotFoundException when not found', async () => {
      transactionsService.findOne.mockResolvedValue(null);

      await expect(controller.getTransaction('nonexistent')).rejects.toThrow(
        'Transaction nonexistent not found',
      );
    });
  });

  describe('getStats', () => {
    it('returns transaction statistics', async () => {
      transactionsService.getTransactionStats.mockResolvedValue({
        totalTransactions: 10,
        totalAmount: 1000,
        totalRefunded: 100,
        byGateway: {},
        byStatus: {},
      });

      const result = await controller.getStats();

      expect(result.totalTransactions).toBe(10);
      expect(result.totalAmount).toBe(1000);
    });
  });
});
