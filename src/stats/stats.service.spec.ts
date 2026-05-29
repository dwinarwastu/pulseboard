import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { NotificationEvent } from 'src/common/entities/notification-event.entity';

const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  getRawMany: jest.fn().mockResolvedValue([
    { channel: 'email', total: '10', sent: '8', failed: '1', pending: '1' },
    { channel: 'whatsapp', total: '5', sent: '4', failed: '1', pending: '0' },
  ]),
};

const mockRepository = {
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

describe('StatsService', () => {
  let service: StatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        {
          provide: getRepositoryToken(NotificationEvent),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStats', () => {
    it('should return stats per channel', async () => {
      const result = await service.getStats();

      expect(result.channels).toHaveLength(2);
      expect(result.totalEvents).toBe(15);
    });

    it('should correctly parse channel stats', async () => {
      const result = await service.getStats();
      const emailStats = result.channels.find((c) => c.channel === 'email');

      expect(emailStats).toBeDefined();
      expect(emailStats?.total).toBe(10);
      expect(emailStats?.sent).toBe(8);
      expect(emailStats?.failed).toBe(1);
      expect(emailStats?.pending).toBe(1);
    });
  });
});
