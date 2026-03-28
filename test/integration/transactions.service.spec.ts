import { GatewayType, TransactionStatus } from "../../src/common/types";
import { TransactionsService } from "../../src/modules/transactions/transactions.service";

function createQueryBuilderMock(rows: unknown[]) {
  return {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue(rows),
  };
}

describe("TransactionsService integration", () => {
  it("applies date filters when aggregating transaction stats", async () => {
    const gatewayStatsBuilder = createQueryBuilderMock([
      {
        gateway: GatewayType.STRIPE,
        count: "2",
        totalAmount: "300",
        totalRefunded: "50",
      },
    ]);
    const statusStatsBuilder = createQueryBuilderMock([
      { status: TransactionStatus.COMPLETED, count: "1" },
      { status: TransactionStatus.PARTIALLY_REFUNDED, count: "1" },
    ]);
    const transactionRepository = {
      createQueryBuilder: jest
        .fn()
        .mockReturnValueOnce(gatewayStatsBuilder)
        .mockReturnValueOnce(statusStatsBuilder),
    };

    const service = new TransactionsService(
      transactionRepository as never,
      {} as never,
      {} as never,
      {} as never,
    );

    const startDate = new Date("2026-03-01T00:00:00.000Z");
    const endDate = new Date("2026-03-31T23:59:59.999Z");

    const result = await service.getTransactionStats({ startDate, endDate });

    expect(gatewayStatsBuilder.andWhere).toHaveBeenNthCalledWith(
      1,
      "t.created_at >= :startDate",
      {
        startDate,
      },
    );
    expect(gatewayStatsBuilder.andWhere).toHaveBeenNthCalledWith(
      2,
      "t.created_at <= :endDate",
      {
        endDate,
      },
    );
    expect(statusStatsBuilder.andWhere).toHaveBeenNthCalledWith(
      1,
      "t.created_at >= :startDate",
      {
        startDate,
      },
    );
    expect(statusStatsBuilder.andWhere).toHaveBeenNthCalledWith(
      2,
      "t.created_at <= :endDate",
      {
        endDate,
      },
    );
    expect(result).toEqual({
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
    });
  });
});
