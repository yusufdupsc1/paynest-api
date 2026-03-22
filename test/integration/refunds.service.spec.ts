import { BadRequestException } from '@nestjs/common';
import { AuditService } from '../../src/modules/audit/audit.service';
import { Refund } from '../../src/modules/refunds/entities/refund.entity';
import { RefundsService } from '../../src/modules/refunds/refunds.service';
import { TransactionsService } from '../../src/modules/transactions/transactions.service';
import { GatewayService } from '../../src/gateways/gateway.service';
import { RefundStatus, TransactionStatus } from '../../src/common/types';
import { canonicalRefundGatewayResponse, canonicalRefundRequest } from '../fixtures/requests';
import { createMockRepository, MockRepository } from '../helpers/mock-repository';
import { completedTransactionProjection } from '../fixtures/webhooks';

describe('RefundsService integration', () => {
  let refundRepository: MockRepository<Refund>;
  let transactionsService: jest.Mocked<
    Pick<TransactionsService, 'findOne' | 'updateRefundAmount' | 'updateStatus'>
  >;
  let gatewayService: jest.Mocked<Pick<GatewayService, 'createRefund'>>;
  let auditService: jest.Mocked<Pick<AuditService, 'recordEntry'>>;
  let service: RefundsService;

  beforeEach(() => {
    refundRepository = createMockRepository<Refund>();
    transactionsService = {
      findOne: jest.fn(),
      updateRefundAmount: jest.fn(),
      updateStatus: jest.fn(),
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

  it('creates a partial refund and updates transaction state plus audit trail', async () => {
    transactionsService.findOne.mockResolvedValue({
      ...completedTransactionProjection,
      status: TransactionStatus.COMPLETED,
      refundedAmount: 0,
    } as never);
    gatewayService.createRefund.mockResolvedValue(canonicalRefundGatewayResponse);
    refundRepository.create.mockImplementation((entity) => ({ ...entity }) as Refund);
    refundRepository.save.mockImplementation(async (refund) => ({
      id: 'refund-001',
      createdAt: new Date('2026-03-21T12:05:00.000Z'),
      metadata: null,
      ...refund,
    }) as Refund);

    const refund = await service.createRefund(canonicalRefundRequest);

    expect(refund).toEqual(
      expect.objectContaining({
        id: 'refund-001',
        amount: canonicalRefundRequest.amount,
        status: RefundStatus.COMPLETED,
      }),
    );
    expect(transactionsService.updateRefundAmount).toHaveBeenCalledWith('txn-001', 50);
    expect(transactionsService.updateStatus).toHaveBeenCalledWith(
      'txn-001',
      TransactionStatus.PARTIALLY_REFUNDED,
      undefined,
      'refunds.createRefund',
      expect.objectContaining({
        refundId: 'refund-001',
        refundAmount: 50,
        refundStatus: RefundStatus.COMPLETED,
      }),
    );
    expect(auditService.recordEntry).toHaveBeenCalledTimes(2);
  });

  it('rejects refunds for transactions that are not completed', async () => {
    transactionsService.findOne.mockResolvedValue({
      ...completedTransactionProjection,
      status: TransactionStatus.PENDING,
    } as never);

    await expect(service.createRefund(canonicalRefundRequest)).rejects.toBeInstanceOf(BadRequestException);
    expect(gatewayService.createRefund).not.toHaveBeenCalled();
  });
});
