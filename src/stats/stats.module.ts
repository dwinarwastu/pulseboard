import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { NotificationEvent } from 'src/common/entities/notification-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEvent])],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
