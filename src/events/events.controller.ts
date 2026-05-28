import { Controller, Get, Query, Sse } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Observable, map } from 'rxjs';
import { EventsService } from './events.service';
import { NotificationEvent } from 'src/common/entities/notification-event.entity';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Sse('stream')
  @ApiOperation({ summary: 'SSE stream — receive live notification events' })
  stream(): Observable<MessageEvent> {
    return this.eventsService.getEventStream().pipe(
      map(
        (event) =>
          ({
            data: JSON.stringify(event),
            type: event.type,
          }) as MessageEvent,
      ),
    );
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent notification events' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRecent(
    @Query('limit') limit?: number,
  ): Promise<NotificationEvent[]> {
    return this.eventsService.getRecentEvents(limit ? Number(limit) : 20);
  }
}
