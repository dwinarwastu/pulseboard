import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { StatsModule } from './stats/stats.module';
import { SubscriberModule } from './subscriber/subscriber.module';
import { NotificationEvent } from './common/entities/notification-event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        entities: [NotificationEvent],
        synchronize: config.get('NODE_ENV') !== 'production',
      }),
    }),
    EventsModule,
    StatsModule,
    SubscriberModule,
  ],
})
export class AppModule {}
