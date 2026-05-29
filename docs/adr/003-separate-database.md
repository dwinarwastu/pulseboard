# ADR 003: Separate Database from Notihub

## Status
Accepted

## Context
Pulseboard needs to store notification events for historical queries and stats.
Option considered: share Notihub's PostgreSQL database or maintain a separate one.

## Decision
Maintain a separate PostgreSQL database.

## Reasons
- **Service independence** — Pulseboard can be deployed, scaled, and maintained independently
- **No coupling** — schema changes in Notihub don't affect Pulseboard
- **Clear ownership** — each service owns its own data
- **Resilience** — Notihub DB outage doesn't affect Pulseboard and vice versa

## Consequences
- Data duplication — notification events exist in both Notihub (notification_logs) and Pulseboard (notification_events)
- Acceptable trade-off for service independence
