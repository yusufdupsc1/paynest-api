import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';
import { GatewayType } from '../../../common/types';

@Entity('analytics_daily')
@Index(['date', 'gateway'], { unique: true })
@Index(['date'])
export class AnalyticsDaily {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'date' })
  date!: Date;

  @Column({
    type: 'enum',
    enum: GatewayType,
    nullable: true,
  })
  gateway!: GatewayType | null;

  @Column({ name: 'total_transactions', default: 0 })
  totalTransactions!: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount!: number;

  @Column({ name: 'total_refunds', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalRefunds!: number;

  @Column({ name: 'net_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  netAmount!: number;

  @Column({ name: 'failed_transactions', default: 0 })
  failedTransactions!: number;

  @Column({ name: 'pending_transactions', default: 0 })
  pendingTransactions!: number;
}
