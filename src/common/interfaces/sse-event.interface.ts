export interface SseEvent {
  type: string;
  data: Record<string, unknown>;
  timestamp: Date;
}
