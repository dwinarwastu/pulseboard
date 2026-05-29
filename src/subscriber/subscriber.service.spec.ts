import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SubscriberService } from './subscriber.service';
import {
  NotificationEvent,
  NotificationChannel,
} from 'src/common/entities/notification-event.entity';
import { REDIS_SUBSCRIBER } from 'src/redis/redis.constants';
import { EventType } from 'src/common/enums/event-type.enum';

const mockRedisSubscriber = {
  subscribe: jest.fn().mockResolvedValue(1),
  on: jest.fn(),
};

const mockRepository = {
  create: jest.fn().mockReturnValue({
    id: 'uuid',
    logId: 'log-uuid',
    channel: NotificationChannel.EMAIL,
    eventType: EventType.SENT,
    recipient: 'test@example.com',
    createdAt: new Date(),
  }),
  save: jest.fn().mockResolvedValue({}),
};

const mockEventEmitter = {
  emit: jest.fn(),
};

describe('SubscriberService', () => {
  let service: SubscriberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriberService,
        {
          provide: REDIS_SUBSCRIBER,
          useValue: mockRedisSubscriber,
        },
        {
          provide: getRepositoryToken(NotificationEvent),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('notihub:events'),
          },
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<SubscriberService>(SubscriberService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should subscribe to Redis channel on init', () => {
    service.onModuleInit();
    expect(mockRedisSubscriber.subscribe).toHaveBeenCalledWith(
      'notihub:events',
    );
  });

  it('should register message handler on init', () => {
    service.onModuleInit();
    expect(mockRedisSubscriber.on).toHaveBeenCalledWith(
      'message',
      expect.any(Function),
    );
  });
});
