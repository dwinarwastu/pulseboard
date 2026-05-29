# ADR 001: SSE over WebSocket

## Status
Accepted

## Context
Pulseboard needs to push real-time events to connected clients.
Two options considered: WebSocket and Server-Sent Events (SSE).

## Decision
Use SSE.

## Reasons
- **One-way communication** — dashboard only needs to receive events from server, not send back. WebSocket is bidirectional which is overkill here.
- **Built-in browser support** — SSE works natively in browsers without extra libraries
- **Auto-reconnect** — SSE handles reconnection automatically, WebSocket requires manual implementation
- **HTTP-based** — SSE works over standard HTTP, no protocol upgrade needed. Easier to proxy and load balance.
- **NestJS native support** — `@Sse()` decorator built-in, no extra package needed

## When to reconsider
If clients need to send data back to the server (e.g. acknowledge events, filter subscriptions), migrate to WebSocket.

## Consequences
- SSE is HTTP/1.1 — browser limit of 6 concurrent connections per domain. Mitigate with HTTP/2.
- Acceptable for a dashboard use case
