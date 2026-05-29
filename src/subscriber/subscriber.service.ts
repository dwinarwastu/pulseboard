import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Redis from 'ioredis';
import { REDIS_SUBSCRIBER } from 'src/redis/redis.constants';
import { NotificationEvent } from 'src/common/entities/notification-event.entity';
import { EventType } from 'src/common/enums/event-type.enum';

@Injectable()
export class SubscriberService implements OnModuleInit {
  private readonly logger = new Logger(SubscriberService.name);

  constructor(
    @Inject(REDIS_SUBSCRIBER) private readonly redisSubscriber: Redis,
    @InjectRepository(NotificationEvent)
    private readonly notificationEventRepository: Repository<NotificationEvent>,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  onModuleInit() {
    const channel =
      this.configService.get<string>('NOTIHUB_REDIS_CHANNEL') ??
      'notihub:events';

    void this.redisSubscriber.subscribe(channel);

    this.redisSubscriber.on('message', (_, message) => {
      try {
        const event = JSON.parse(message) as {
          logId: string;
          channel: string;
          eventType: string;
          recipient: string;
          metadata?: Record<string, unknown>;
        };

        void this.handleEvent(event);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        this.logger.error(`Failed to parse event: ${msg}`);
      }
    });

    this.logger.log(`Subscribed to Redis channel: ${channel}`);
  }

  private async handleEvent(event: {
    logId: string;
    channel: string;
    eventType: string;
    recipient: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    const notificationEvent = this.notificationEventRepository.create({
      logId: event.logId,
      channel: event.channel as any,
      eventType: event.eventType as EventType,
      recipient: event.recipient,
      metadata: event.metadata,
    });

    await this.notificationEventRepository.save(notificationEvent);

    this.eventEmitter.emit('notification.event', notificationEvent);

    this.logger.log(`Event saved: ${event.eventType} for ${event.recipient}`);
  }
}
