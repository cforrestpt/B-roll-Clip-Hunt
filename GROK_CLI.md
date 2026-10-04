# B-Roll Finder — source for Grok CLI

Web app for talking-head + b-roll editors (reels).

## What it does

1. **Input** — paste a Notion/CSV table (spoken text + B-roll options 1/2/3) or a raw script.
2. **Map columns** — assign Spoken, Time, Option 1/2/3. Delete unused sections on Options.
3. **Find clips** — search Pexels + Pixabay (video first, stills as backup) and YouTube (links only).
4. **Vertical-first** — portrait 9:16 for reels, landscape fills if vertical is thin.
5. **Timeline** — pick clips and download them. YouTube is open-in-browser only.

API keys (Pexels, Pixabay, YouTube Data API) are entered in Settings and stored in **this browser’s localStorage only**.

## Stack

React 19 + TypeScript + Vite 8 + TanStack Start/Router + Tailwind v4 + Zustand + shadcn/Radix.

Dev server: `npm run dev` → `0.0.0.0:8080`

## Run locally

```bash
npm install
npm run dev
```

```bash
npm run typecheck
npm run build
```

## App source (the product)

| Path | Role |
|---|---|
| `src/lib/broll/types.ts` | Chunk / clip / settings types |
| `src/lib/broll/chunker.ts` | Script → 5–10s chunks + option helpers |
| `src/lib/broll/import-table.ts` | Notion/CSV/markdown table parse + column map |
| `src/lib/broll/stock-api.ts` | Server functions: Pexels, Pixabay, YouTube, download proxy |
| `src/lib/broll/store.ts` | Zustand store (keys persist; searches do not) |
| `src/lib/broll/download.ts` | Client download via CORS then server proxy |
| `src/lib/broll/samples.ts` | Sample scripts |
| `src/components/broll/AppShell.tsx` | Shell + steps |
| `src/components/broll/SettingsPanel.tsx` | API keys + search prefs |
| `src/components/broll/steps/ScriptStep.tsx` | Input + mapping |
| `src/components/broll/steps/ChunksStep.tsx` | Options + delete sections |
| `src/components/broll/steps/FindStep.tsx` | Search UI, chips, filters |
| `src/components/broll/steps/TimelineStep.tsx` | Timeline + downloads |
| `src/routes/index.tsx` | Home route |
| `src/routes/__root.tsx` | Root layout |
| `src/styles.css` | Design tokens |
| `vite.config.ts` | Host `0.0.0.0:8080`; nitro only on `build` |

## Behaviour notes (do not regress)

- Search uses **one active query** at a time (option chips set query + search).
- Clear previous results as soon as a search starts.
- Drop clips with no thumbnail / preview / download URL (no empty cards).
- Prefer **vertical** stock; landscape is fallback.
- YouTube = search + outbound link, never download.
- `startup.sh` must stay idempotent and bind `0.0.0.0:8080`.
