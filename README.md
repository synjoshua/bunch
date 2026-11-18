# nori

Class prototype for **nori** — social nutrition and accountability for friend squads.

People join the same session code, get auto-matched into groups of about four, log meals toward personal protein goals, and help finish a shared weekly quest. Consistency drives squad rank and a sample end-of-season gift-card reward.

Built for a live classroom demo (~50 people at once).

## Run locally

```bash
npm install
npm run dev
```

- Player app: [http://127.0.0.1:43123](http://127.0.0.1:43123)
- Projector / audience board: [http://127.0.0.1:43123/live](http://127.0.0.1:43123/live)

## Class demo flow

1. Put `/live` on the projector with session code `NORI` (or your own code).
2. Everyone opens the player app, enters a name, and uses the same code.
3. nori places people into squads of ~4 as they join.
4. Each person logs a meal (optionally share to Recipe Relay).
5. Squad home and the live board update together every couple of seconds.
6. If a squad is short a few people, tap **Fill open seats with demo friends**.

## What is simulated

Shared in-room session state (file-backed on the server), fake meal photos/protein estimates, fixed rank tiers, and sample gift-card amounts. No real accounts, nutrition API, payments, or sponsors.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS.
