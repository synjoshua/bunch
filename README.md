# bunch

Class prototype for **bunch** — a co-op food game for friend squads.

People join the same table code, get matched into groups of about four, log real plates toward protein goals, drop recipes in a shared kitchen quest, and chat at the table. Consistency unlocks grocery gift-card loot.

Built for a live classroom demo (~50 people at once).

## Run locally

```bash
npm install
npm run build
npm run start
```

For local iteration you can use `npm run dev` instead.

- Player app: [http://127.0.0.1:43123](http://127.0.0.1:43123)
- Projector / audience board: [http://127.0.0.1:43123/live](http://127.0.0.1:43123/live)

## Class demo flow

1. Put `/live` on the projector with session code `BUNCH` (or your own code).
2. Everyone opens the player app, enters a name, and uses the same code.
3. bunch places people into squads of ~4 as they join.
4. Each person logs a meal (optionally share to Recipe Relay).
5. Squad home and the live board update together every couple of seconds.
6. If a squad is short a few people, tap **Fill open seats with demo friends**.

## What is simulated

Shared in-room session state (file-backed on the server), fake meal photos/protein estimates, fixed rank tiers, and sample gift-card amounts. No real accounts, nutrition API, payments, or sponsors.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS.
