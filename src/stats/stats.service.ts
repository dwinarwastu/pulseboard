import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEvent } from 'src/common/entities/notification-event.entity';
import { StatsResponseDto, ChannelStatsDto } from './dto/stats.dto';
import { EventType } from 'src/common/enums/event-type.enum';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(NotificationEvent)
    private readonly notificationEventRepository: Repository<NotificationEvent>,
  ) {}

  async getStats(): Promise<StatsResponseDto> {
    const results = await this.notificationEventRepository
      .createQueryBuilder('event')
      .select('event.channel', 'channel')
      .addSelect('COUNT(*)', 'total')
      .addSelect(
        `SUM(CASE WHEN event.eventType = '${EventType.SENT}' THEN 1 ELSE 0 END)`,
        'sent',
      )
      .addSelect(
        `SUM(CASE WHEN event.eventType = '${EventType.FAILED}' THEN 1 ELSE 0 END)`,
        'failed',
      )
      .addSelect(
        `SUM(CASE WHEN event.eventType = '${EventType.PENDING}' THEN 1 ELSE 0 END)`,
        'pending',
      )
      .groupBy('event.channel')
      .getRawMany<{
        channel: string;
        total: string;
        sent: string;
        failed: string;
        pending: string;
      }>();

    const channels: ChannelStatsDto[] = results.map((r) => ({
      channel: r.channel,
      total: parseInt(r.total),
      sent: parseInt(r.sent),
      failed: parseInt(r.failed),
      pending: parseInt(r.pending),
    }));

    const totalEvents = channels.reduce((sum, c) => sum + c.total, 0);

    return { channels, totalEvents };
  }
}
