import { RefundsController } from '../../src/modules/refunds/refunds.controller';
import { RefundsService } from '../../src/modules/refunds/refunds.service';
import { Refund } from '../../src/modules/refunds/entities/refund.entity';
import { RefundStatus } from '../../src/common/types';

describe('RefundsController', () => {
  let controller: RefundsController;
  let refundsService: jest.Mocked<RefundsService>;

  beforeEach(() => {
    refundsService = {
      createRefund: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      getRefundStats: jest.fn(),
    } as unknown as jest.Mocked<RefundsService>;

    controller = new RefundsController(refundsService);
  });

  describe('createRefund', () => {
    it('creates refund and returns success', async () => {
      refundsService.createRefund.mockResolvedValue({
        id: 'refund-1',
        status: RefundStatus.COMPLETED,
      } as Refund);

      const result = await controller.createRefund({
        transactionId: 'txn-1',
        amount: 50,
        reason: 'test',
      });

      expect(result.success).toBe(true);
      expect(result.refund.id).toBe('refund-1');
    });

    it('returns success false for failed refunds', async () => {
      refundsService.createRefund.mockResolvedValue({
        id: 'refund-2',
        status: RefundStatus.FAILED,
      } as Refund);

      const result = await controller.createRefund({
        transactionId: 'txn-1',
        amount: 50,
      });

      expect(result.success).toBe(false);
    });
  });

  describe('listRefunds', () => {
    it('returns paginated refunds', async () => {
      refundsService.findAll.mockResolvedValue({
        data: [{ id: 'refund-1' }] as Refund[],
        total: 1,
        page: 1,
        limit: 20,
      });

      const result = await controller.listRefunds();

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('getRefundStats', () => {
    it('returns refund statistics', async () => {
      refundsService.getRefundStats.mockResolvedValue({
        totalRefunds: 5,
        totalAmount: 500,
        pendingRefunds: 1,
        byGateway: {},
      });

      const result = await controller.getRefundStats();

      expect(result.totalRefunds).toBe(5);
    });
  });

  describe('getRefund', () => {
    it('returns refund by id', async () => {
      refundsService.findOne.mockResolvedValue({
        id: 'refund-1',
      } as Refund);

      const result = await controller.getRefund('refund-1');

      expect(result.id).toBe('refund-1');
    });

    it('throws NotFoundException when not found', async () => {
      refundsService.findOne.mockResolvedValue(null);

      await expect(controller.getRefund('nonexistent')).rejects.toThrow(
        'Refund nonexistent not found',
      );
    });
  });
});
