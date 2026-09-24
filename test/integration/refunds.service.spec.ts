import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Refund } from '../../src/modules/refunds/entities/refund.entity';
import { Transaction } from '../../src/modules/transactions/entities/transaction.entity';
import { RefundsService } from '../../src/modules/refunds/refunds.service';
import { GatewayService } from '../../src/gateways/gateway.service';
import { AuditService } from '../../src/modules/audit/audit.service';
import { GatewayType, TransactionStatus, RefundStatus } from '../../src/common/types';
import { canonicalRefundGatewayResponse, canonicalRefundRequest } from '../fixtures/requests';
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

describe('RefundsService integration', () => {
  let refundRepository: MockRepository<Refund>;
  let gatewayService: jest.Mocked<Pick<GatewayService, 'createRefund'>>;
  let auditService: jest.Mocked<Pick<AuditService, 'recordEntry'>>;
  let connection: { createQueryRunner: jest.Mock };
  let queryRunner: ReturnType<typeof buildMockQueryRunner>['qr'];
  let manager: ReturnType<typeof buildMockQueryRunner>['manager'];
  let service: RefundsService;

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

  const completedTransaction = {
    id: 'txn-001',
    externalId: 'pi_test_001',
    gateway: GatewayType.STRIPE,
    amount: 125.5,
    refundedAmount: 0,
    status: TransactionStatus.COMPLETED,
  } as unknown as Transaction;

  it('creates a partial refund and updates transaction state plus audit trail', async () => {
    manager.findOne.mockImplementation((entity) => {
      if (entity === Transaction) return Promise.resolve(completedTransaction);
      return Promise.resolve(null);
    });
    gatewayService.createRefund.mockResolvedValue(canonicalRefundGatewayResponse);
    manager.create.mockImplementation((_, entity) => ({ ...entity }) as Refund);
    manager.save.mockImplementation(async (entity: unknown) => ({
      ...(entity as object),
      id: 'refund-001',
    }) as Refund);

    const refund = await service.createRefund(canonicalRefundRequest);

    expect(refund).toEqual(
      expect.objectContaining({
        id: 'refund-001',
        amount: canonicalRefundRequest.amount,
        status: RefundStatus.COMPLETED,
      }),
    );
    expect(gatewayService.createRefund).toHaveBeenCalledWith(
      GatewayType.STRIPE,
      'pi_test_001',
      50,
      'operator_requested_partial_refund',
      'refund:txn-001:50',
    );
    expect(queryRunner.commitTransaction).toHaveBeenCalled();
    expect(auditService.recordEntry).toHaveBeenCalled();
  });

  it('rejects refunds for transactions that are not completed', async () => {
    manager.findOne.mockResolvedValue({ ...completedTransaction, status: TransactionStatus.PENDING });

    await expect(service.createRefund(canonicalRefundRequest)).rejects.toBeInstanceOf(BadRequestException);
    expect(gatewayService.createRefund).not.toHaveBeenCalled();
    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
  });
});
