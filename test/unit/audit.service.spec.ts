import { AuditLog } from '../../src/modules/audit/entities/audit-log.entity';
import { AuditService } from '../../src/modules/audit/audit.service';
import { AuditActionType, AuditEntityType, GatewayType } from '../../src/common/types';
import { createMockRepository, MockRepository } from '../helpers/mock-repository';

describe('AuditService', () => {
  let service: AuditService;
  let auditLogRepository: MockRepository<AuditLog>;

  beforeEach(() => {
    auditLogRepository = createMockRepository<AuditLog>();
    service = new AuditService(auditLogRepository as never);
  });

  describe('recordEntry', () => {
    it('creates and saves an audit log entry', async () => {
      const input = {
        entityType: AuditEntityType.TRANSACTION,
        entityId: 'txn-1',
        action: AuditActionType.TRANSACTION_CREATED,
        transactionId: 'txn-1',
        gateway: GatewayType.STRIPE,
        previousStatus: null,
        nextStatus: 'pending',
        source: 'transactions.createPayment',
        metadata: { amount: 100 },
      };

      const savedLog = { id: 'audit-1', ...input } as unknown as AuditLog;
      auditLogRepository.create.mockReturnValue(savedLog);
      auditLogRepository.save.mockResolvedValue(savedLog);

      const result = await service.recordEntry(input);

      expect(result.id).toBe('audit-1');
      expect(auditLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          entityType: AuditEntityType.TRANSACTION,
          entityId: 'txn-1',
          action: AuditActionType.TRANSACTION_CREATED,
        }),
      );
    });

    it('defaults null values for optional fields', async () => {
      const input = {
        entityType: AuditEntityType.WEBHOOK_EVENT,
        entityId: 'wh-1',
        action: AuditActionType.WEBHOOK_REPLAY_ATTEMPTED,
      };

      auditLogRepository.create.mockReturnValue({ id: 'audit-2' } as AuditLog);
      auditLogRepository.save.mockResolvedValue({ id: 'audit-2' } as AuditLog);

      await service.recordEntry(input);

      expect(auditLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionId: null,
          refundId: null,
          webhookEventId: null,
          gateway: null,
          previousStatus: null,
          nextStatus: null,
          source: 'system',
          metadata: null,
        }),
      );
    });

    it('records refund audit entries', async () => {
      const input = {
        entityType: AuditEntityType.REFUND,
        entityId: 'refund-1',
        action: AuditActionType.REFUND_CREATED,
        transactionId: 'txn-1',
        refundId: 'refund-1',
        gateway: GatewayType.STRIPE,
        nextStatus: 'pending',
        source: 'refunds.createRefund',
      };

      auditLogRepository.create.mockReturnValue({ id: 'audit-3' } as AuditLog);
      auditLogRepository.save.mockResolvedValue({ id: 'audit-3' } as AuditLog);

      const result = await service.recordEntry(input);

      expect(result.id).toBe('audit-3');
      expect(auditLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          entityType: AuditEntityType.REFUND,
          action: AuditActionType.REFUND_CREATED,
        }),
      );
    });
  });
});
