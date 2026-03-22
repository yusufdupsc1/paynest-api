import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { AuditActionType, AuditEntityType, GatewayType } from '../../../common/types';

@Entity('audit_logs')
@Index(['entityType', 'entityId'])
@Index(['transactionId'])
@Index(['refundId'])
@Index(['webhookEventId'])
@Index(['createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'entity_type',
    type: 'enum',
    enum: AuditEntityType,
  })
  entityType!: AuditEntityType;

  @Column({ name: 'entity_id' })
  entityId!: string;

  @Column({
    type: 'enum',
    enum: AuditActionType,
  })
  action!: AuditActionType;

  @Column({ name: 'transaction_id', type: 'uuid', nullable: true })
  transactionId!: string | null;

  @Column({ name: 'refund_id', type: 'uuid', nullable: true })
  refundId!: string | null;

  @Column({ name: 'webhook_event_id', type: 'uuid', nullable: true })
  webhookEventId!: string | null;

  @Column({
    type: 'enum',
    enum: GatewayType,
    nullable: true,
  })
  gateway!: GatewayType | null;

  @Column({ name: 'previous_status', nullable: true, length: 100 })
  previousStatus!: string | null;

  @Column({ name: 'next_status', nullable: true, length: 100 })
  nextStatus!: string | null;

  @Column({ type: 'varchar', length: 100, default: 'system' })
  source!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
