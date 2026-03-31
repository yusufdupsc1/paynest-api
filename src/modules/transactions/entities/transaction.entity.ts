import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { TransactionStatus, GatewayType } from '../../../common/types';

@Entity('transactions')
@Index(['idempotencyKey'], { unique: true })
@Index(['externalId', 'gateway'])
@Index(['status'])
@Index(['createdAt'])
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'external_id', type: 'varchar', nullable: true })
  externalId!: string | null;

  @Column({
    type: 'enum',
    enum: GatewayType,
    default: GatewayType.STRIPE,
  })
  gateway!: GatewayType;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: number;

  @Column({ length: 3, default: 'USD' })
  currency!: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status!: TransactionStatus;

  @Column({ name: 'customer_email', type: 'varchar', nullable: true })
  customerEmail!: string | null;

  @Column({ name: 'customer_phone', type: 'varchar', nullable: true })
  customerPhone!: string | null;

  @Column({ name: 'customer_name', type: 'varchar', nullable: true })
  customerName!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;

  @Column({ name: 'gateway_response', type: 'jsonb', nullable: true })
  gatewayResponse!: Record<string, unknown> | null;

  @Column({ name: 'idempotency_key', unique: true })
  idempotencyKey!: string;

  @Column({ name: 'payment_url', type: 'varchar', nullable: true })
  paymentUrl!: string | null;

  @Column({ name: 'return_url', type: 'varchar', nullable: true })
  returnUrl!: string | null;

  @Column({ name: 'refunded_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  refundedAmount!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
