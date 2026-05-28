import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';

@Module({
  providers: [SubscriberService]
})
export class SubscriberModule {}
