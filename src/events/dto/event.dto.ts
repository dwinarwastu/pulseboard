import { ApiProperty } from '@nestjs/swagger';
import { EventType } from 'src/common/enums/event-type.enum';
import { NotificationChannel } from 'src/common/entities/notification-event.entity';

export class EventDto {
  @ApiProperty({ example: 'uuid-123' })
  logId: string;

  @ApiProperty({ enum: NotificationChannel })
  channel: NotificationChannel;

  @ApiProperty({ enum: EventType })
  eventType: EventType;

  @ApiProperty({ example: 'user@example.com' })
  recipient: string;

  @ApiProperty({ example: {} })
  metadata: Record<string, unknown>;

  @ApiProperty()
  createdAt: Date;
}
