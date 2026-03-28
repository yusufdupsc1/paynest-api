import { AnalyticsService } from '../../src/modules/analytics/analytics.service';
import { GatewayType, TransactionStatus } from '../../src/common/types';

describe('AnalyticsService integration', () => {
  it('forwards date filters into transaction stats and preserves filtered status and refund breakdowns', async () => {
    const analyticsRepository = {};
    const transactionsService = {
      getTransactionStats: jest.fn().mockResolvedValue({
        totalTransactions: 2,
        totalAmount: 300,
        totalRefunded: 50,
        byGateway: {
          [GatewayType.STRIPE]: {
            count: 2,
            amount: 300,
            refundedAmount: 50,
          },
        },
        byStatus: {
          [TransactionStatus.COMPLETED]: 1,
          [TransactionStatus.PARTIALLY_REFUNDED]: 1,
        },
      }),
    };

    const service = new AnalyticsService(
      analyticsRepository as never,
      transactionsService as never,
    );

    const startDate = new Date('2026-03-01T00:00:00.000Z');
    const endDate = new Date('2026-03-31T23:59:59.999Z');

    const summary = await service.getSummary(startDate, endDate);
    const byGateway = await service.getByGateway(startDate, endDate);

    expect(transactionsService.getTransactionStats).toHaveBeenNthCalledWith(1, {
      startDate,
      endDate,
    });
    expect(transactionsService.getTransactionStats).toHaveBeenNthCalledWith(2, {
      startDate,
      endDate,
    });
    expect(summary).toEqual({
      totalTransactions: 2,
      totalAmount: 300,
      totalRefunds: 50,
      netAmount: 250,
      successRate: 83.33,
      byGateway: {
        [GatewayType.STRIPE]: {
          count: 2,
          amount: 300,
        },
      },
      byStatus: {
        [TransactionStatus.COMPLETED]: 1,
        [TransactionStatus.PARTIALLY_REFUNDED]: 1,
      },
    });
    expect(byGateway).toEqual([
      {
        gateway: GatewayType.STRIPE,
        totalTransactions: 2,
        totalAmount: 300,
        totalRefunds: 50,
        netAmount: 250,
      },
    ]);
  });
});
