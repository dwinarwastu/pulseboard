import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { StatsModule } from './stats/stats.module';
import { SubscriberModule } from './subscriber/subscriber.module';

@Module({
  imports: [EventsModule, StatsModule, SubscriberModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
