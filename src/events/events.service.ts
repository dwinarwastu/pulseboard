import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { Subject } from 'rxjs';
import { NotificationEvent } from 'src/common/entities/notification-event.entity';
import { SseEvent } from 'src/common/interfaces/sse-event.interface';

@Injectable()
export class EventsService {
  private readonly eventSubject = new Subject<SseEvent>();

  constructor(
    @InjectRepository(NotificationEvent)
    private readonly notificationEventRepository: Repository<NotificationEvent>,
  ) {}

  getEventStream() {
    return this.eventSubject.asObservable();
  }

  @OnEvent('notification.event')
  handleNotificationEvent(event: NotificationEvent): void {
    this.eventSubject.next({
      type: event.eventType,
      data: {
        logId: event.logId,
        channel: event.channel,
        recipient: event.recipient,
        metadata: event.metadata,
      },
      timestamp: event.createdAt,
    });
  }

  async getRecentEvents(limit = 20): Promise<NotificationEvent[]> {
    return this.notificationEventRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
