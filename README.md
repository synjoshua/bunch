# bunch

Class prototype for **bunch** — a co-op food game. Slogan: **eat better as a bunch**.

People join the same code, get matched into bunches of about four, log real plates toward protein goals, share meals, and chat together. Hit goals as a bunch to climb to Gold and redeem grocery gift-card loot.

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
3. Everyone lands in the waiting room while bunches of ~4 fill.
4. Host taps **Start demo** on `/live`.
5. Each person logs a meal (and can share with their bunch).
6. Bunch home and the live board update together every couple of seconds.

## AI meal macros

After someone picks a food photo, bunch calls `/api/analyze-meal` to estimate name + protein/carbs/fat/calories, then protein is added to their daily goal on save.

- Set `OPENAI_API_KEY` in Railway (Variables) for real vision AI.
- Without a key, a **demo estimate** still fills macros so class demos never block.

## What is simulated

Shared in-room session state (file-backed on the server), AI/demo macro estimates (not a clinical nutrition API), fixed rank tiers, and sample gift-card amounts. Meal photos come from each person’s **camera roll**. No real accounts, payments, or sponsors.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS.
