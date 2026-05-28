import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriberService } from './subscriber.service';
import { RedisModule } from 'src/redis/redis.module';
import { NotificationEvent } from 'src/common/entities/notification-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEvent]), RedisModule],
  providers: [SubscriberService],
  exports: [SubscriberService],
})
export class SubscriberModule {}
