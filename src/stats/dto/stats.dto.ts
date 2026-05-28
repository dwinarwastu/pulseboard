import { ApiProperty } from '@nestjs/swagger';

export class ChannelStatsDto {
  @ApiProperty({ example: 'email' })
  channel: string;

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 80 })
  sent: number;

  @ApiProperty({ example: 10 })
  failed: number;

  @ApiProperty({ example: 10 })
  pending: number;
}

export class StatsResponseDto {
  @ApiProperty({ type: [ChannelStatsDto] })
  channels: ChannelStatsDto[];

  @ApiProperty({ example: 300 })
  totalEvents: number;
}
