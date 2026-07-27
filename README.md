# Vinyl Archive

A polished Next.js CRUD portfolio demo — browse, inspect, create, edit, and delete vinyl records with session-scoped in-memory data.

## Stack

- **Next.js** (App Router) + TypeScript
- **Server Actions** + REST **API routes**
- **Zod** validation
- In-memory store keyed by browser tab session (`sessionStorage`)

## Features

- Dashboard list with subset columns; detail pages use slug routes (`/details/[id]`)
- Inline edit on the detail page with save/cancel and success toast
- Create flow at `/new` — save navigates to the new detail page
- Animated delete (fade + slide + shrink)
- Keyboard-accessible interactions and form validation

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Each browser tab gets its own session and a fresh seed catalog. Closing the tab (or opening a new one) restores the defaults.

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/vinyls` | List records |
| `POST` | `/api/vinyls` | Create record |
| `GET` | `/api/vinyls/[id]` | Get one |
| `PUT` | `/api/vinyls/[id]` | Update |
| `DELETE` | `/api/vinyls/[id]` | Delete |

All requests require header `x-session-id`.

## Scripts

```bash
pnpm dev      # development server
pnpm build    # production build
pnpm start    # start production server
pnpm lint     # eslint
```
