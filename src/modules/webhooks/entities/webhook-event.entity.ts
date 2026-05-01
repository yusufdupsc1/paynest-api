import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import {
  GatewayType,
  WebhookProcessingStatus,
  WebhookSignatureStatus,
} from '../../../common/types';

@Entity('webhook_events')
@Index(['gateway', 'eventId'], { unique: true })
@Index(['status'])
@Index(['normalizedEventKey'])
@Index(['nextRetryAt'])
@Index(['createdAt'])
export class WebhookEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: GatewayType,
  })
  gateway!: GatewayType;

  @Column({ name: 'event_id', length: 512 })
  eventId!: string;

  @Column({ name: 'event_type' })
  eventType!: string;

  @Column({
    name: 'normalized_event_key',
    type: 'varchar',
    nullable: true,
    length: 512,
  })
  normalizedEventKey!: string | null;

  @Column({ type: 'jsonb' })
  payload!: Record<string, unknown>;

  @Column({ name: 'raw_body', type: 'text', nullable: true })
  rawBody!: string | null;

  @Column({ name: 'headers', type: 'jsonb', nullable: true })
  headers!: Record<string, string> | null;

  @Column({
    type: 'varchar',
    length: 50,
    default: WebhookProcessingStatus.RECEIVED,
  })
  status!: WebhookProcessingStatus;

  @Column({
    name: 'signature_status',
    type: 'varchar',
    length: 50,
    default: WebhookSignatureStatus.PENDING,
  })
  signatureStatus!: WebhookSignatureStatus;

  @Column({ name: 'signature_valid', type: 'boolean', nullable: true })
  signatureValid!: boolean | null;

  @Column({ name: 'duplicate_of_event_id', type: 'varchar', nullable: true, length: 512 })
  duplicateOfEventId!: string | null;

  @Column({ name: 'received_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  receivedAt!: Date;

  @Column({ name: 'processing_started_at', type: 'timestamp', nullable: true })
  processingStartedAt!: Date | null;

  @Column({ name: 'first_processed_at', type: 'timestamp', nullable: true })
  firstProcessedAt!: Date | null;

  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processedAt!: Date | null;

  @Column({ name: 'retry_count', default: 0 })
  retryCount!: number;

  @Column({ name: 'next_retry_at', type: 'timestamp', nullable: true })
  nextRetryAt!: Date | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage!: string | null;

  @Column({ name: 'replay_count', default: 0 })
  replayCount!: number;

  @Column({ name: 'last_replay_at', type: 'timestamp', nullable: true })
  lastReplayAt!: Date | null;

  @Column({ name: 'last_replay_reason', type: 'text', nullable: true })
  lastReplayReason!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
