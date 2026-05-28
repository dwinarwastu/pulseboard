import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { EventType } from '../enums/event-type.enum';

export enum NotificationChannel {
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  PUSH = 'push',
}

@Entity('notification_events')
export class NotificationEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  logId: string; // reference ke NotificationLog di Notihub

  @Column({ type: 'enum', enum: NotificationChannel })
  channel: NotificationChannel;

  @Column({ type: 'enum', enum: EventType })
  eventType: EventType;

  @Column()
  recipient: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;
}
