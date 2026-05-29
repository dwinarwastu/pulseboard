# Pulseboard

> Real-time notification event dashboard — built to complement Notihub.

Built with **NestJS**, **Redis Pub/Sub**, **SSE (Server-Sent Events)**, and **PostgreSQL**. Subscribes to notification events from Notihub and streams them to connected clients in real-time.

![CI](https://github.com/dwinarwastu/pulseboard/actions/workflows/ci.yml/badge.svg)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS |
| Real-time | Server-Sent Events (SSE) |
| Message Bus | Redis Pub/Sub |
| Database | PostgreSQL + TypeORM |
| Containerization | Docker + Docker Compose |

---

## How It Works

1. **Notihub publishes** — every time a notification status changes (`sent` / `failed`), Notihub publishes an event to a Redis Pub/Sub channel
2. **Pulseboard subscribes** — on startup, Pulseboard subscribes to the same Redis channel
3. **Persist** — incoming events are saved to PostgreSQL for historical queries
4. **Stream** — connected SSE clients receive events in real-time via `GET /events/stream`
5. **Stats** — aggregate stats (total, sent, failed, pending per channel) are queryable via `GET /stats`

Each service is independent — Pulseboard doesn't share a database with Notihub, only communicating through Redis Pub/Sub.

---

## Project Structure

```
src/
├── events/           # SSE endpoint, stream events to clients
├── stats/            # Aggregate stats per channel
├── subscriber/       # Redis Pub/Sub subscriber
├── redis/            # Redis client provider
└── common/
    ├── entities/
    ├── enums/
    └── interfaces/
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- Docker & Docker Compose
- Notihub running and publishing events to Redis

### Run with Docker

```bash
cp .env.example .env
# fill in your credentials
docker compose up -d
```

### Run locally

```bash
npm install
npm run start:dev
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port (default: `5432`) |
| `DB_USER` | PostgreSQL user |
| `DB_PASS` | PostgreSQL password |
| `DB_NAME` | PostgreSQL database name |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port (default: `6379`) |
| `NOTIHUB_REDIS_CHANNEL` | Redis channel to subscribe to (default: `notihub:events`) |

---

## API Reference

### SSE Stream

```
GET /events/stream
```

Connect to this endpoint to receive real-time notification events. Keeps the connection open and pushes events as they arrive.

**Example event — sent**

```
event: sent
id: 1
data: {"type":"sent","data":{"logId":"fdbd81ab-...","channel":"email","recipient":"test@example.com","metadata":{"subject":"Test"}},"timestamp":"2026-05-29T01:06:36.308Z"}
```

**Example event — failed**

```
event: failed
id: 2
data: {"type":"failed","data":{"logId":"dde8b717-...","channel":"email","recipient":"test@example.com"},"timestamp":"2026-05-29T01:02:15.653Z"}
```

---

### Recent Events

```
GET /events/recent?limit=20
```

Returns the most recent notification events from PostgreSQL.

| Query | Type | Required | Description |
|---|---|---|---|
| `limit` | `number` | No | Number of events to return (default: `20`) |

---

### Stats

```
GET /stats
```

Returns aggregate stats per channel.

**Response**

```json
{
  "channels": [
    {
      "channel": "email",
      "total": 100,
      "sent": 80,
      "failed": 15,
      "pending": 5
    }
  ],
  "totalEvents": 100
}
```

---

## Event Types

| Type | Description |
|---|---|
| `sent` | Notification successfully delivered |
| `failed` | Notification delivery failed |
| `pending` | Notification queued, waiting to be processed |
| `processing` | Worker picked up the job |

---

## Integration with Notihub

Pulseboard is designed to work alongside [Notihub](https://github.com/dwinarwastu/notihub). To enable the integration, add this to Notihub's `.env`:

```env
PULSEBOARD_REDIS_CHANNEL=notihub:events
```

Make sure both services point to the same Redis instance.

---

## Architecture Decisions

See [docs/adr](./docs/adr) for architecture decision records explaining the key design choices behind this service.
