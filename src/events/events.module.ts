import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { NotificationEvent } from 'src/common/entities/notification-event.entity';
import { SubscriberModule } from 'src/subscriber/subscriber.module';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEvent]), SubscriberModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
