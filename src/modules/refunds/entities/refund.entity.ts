import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { RefundStatus } from '../../../common/types';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity('refunds')
@Index(['transactionId'])
@Index(['externalRefundId'])
@Index(['status'])
export class Refund {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'transaction_id' })
  transactionId!: string;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'transaction_id' })
  transaction!: Transaction;

  @Column({ name: 'external_refund_id', nullable: true })
  externalRefundId!: string | null;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: number;

  @Column({
    type: 'enum',
    enum: RefundStatus,
    default: RefundStatus.PENDING,
  })
  status!: RefundStatus;

  @Column({ type: 'text', nullable: true })
  reason!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;

  @Column({ name: 'gateway_response', type: 'jsonb', nullable: true })
  gatewayResponse!: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processedAt!: Date | null;
}
