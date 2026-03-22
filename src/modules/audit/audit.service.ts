import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditActionType, AuditEntityType, GatewayType } from '../../common/types';

interface RecordAuditEntryInput {
  entityType: AuditEntityType;
  entityId: string;
  action: AuditActionType;
  transactionId?: string | null;
  refundId?: string | null;
  webhookEventId?: string | null;
  gateway?: GatewayType | null;
  previousStatus?: string | null;
  nextStatus?: string | null;
  source?: string;
  metadata?: Record<string, unknown> | null;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async recordEntry(input: RecordAuditEntryInput): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      transactionId: input.transactionId ?? null,
      refundId: input.refundId ?? null,
      webhookEventId: input.webhookEventId ?? null,
      gateway: input.gateway ?? null,
      previousStatus: input.previousStatus ?? null,
      nextStatus: input.nextStatus ?? null,
      source: input.source ?? 'system',
      metadata: input.metadata ?? null,
    });

    return this.auditLogRepository.save(auditLog);
  }
}
