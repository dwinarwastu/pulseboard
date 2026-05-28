import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { StatsResponseDto } from './dto/stats.dto';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({ summary: 'Get notification stats per channel' })
  async getStats(): Promise<StatsResponseDto> {
    return this.statsService.getStats();
  }
}
