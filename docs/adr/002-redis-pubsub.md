# ADR 002: Redis Pub/Sub for Inter-Service Communication

## Status
Accepted

## Context
Pulseboard needs to receive events from Notihub in real-time.
Options considered: shared database polling, HTTP webhook, and Redis Pub/Sub.

## Decision
Use Redis Pub/Sub.

## Reasons
- **Decoupled** — Notihub and Pulseboard don't share a database or know about each other's internals
- **Low latency** — events arrive in milliseconds after publish
- **Simple** — no additional infrastructure needed, Redis is already used by Notihub for BullMQ
- **Fire and forget** — Notihub doesn't need to wait for Pulseboard to acknowledge

## Alternatives considered
- **Shared database polling** — high latency, adds load to Notihub's DB, tight coupling
- **HTTP webhook** — Notihub needs to know Pulseboard's URL, tight coupling, retry complexity

## Consequences
- No message persistence — if Pulseboard is down when Notihub publishes, events are lost
- Acceptable for a dashboard use case — missing a few events is not critical
- For guaranteed delivery, consider Redis Streams or BullMQ instead
