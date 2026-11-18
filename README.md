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

## Deploy on Railway (class demo)

Use [Railway](https://railway.com) so everyone shares one always-on Node server (needed for live multiplayer).

1. Push this repo to GitHub (or create the repo from Cursor’s **Create repo** pill).
2. Open [railway.com/new](https://railway.com/new) → sign up → **Deploy from GitHub repo** → pick this project.
3. Railway should detect Next.js. Set:
   - **Build command:** `npm run build`
   - **Start command:** `npm run start`
4. Click **Deploy**. When it’s green, open the service → **Settings** → **Networking** → **Generate domain**.
5. Player URL = that domain (e.g. `https://bunch-production-xxxx.up.railway.app`).
6. Projector = same domain + `/live`.
7. Make a QR code that points at the **player URL** (code stays `BUNCH`).

Session state is stored on the server disk under `.data/`. One Railway service = one shared classroom room.

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
