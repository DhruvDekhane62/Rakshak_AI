# Rakshak AI — Crime Intelligence Platform

A full-stack AI-powered crime intelligence platform for the Karnataka State Police. Combines conversational AI, criminal network analysis, crime pattern analytics, hotspot detection, offender profiling, and predictive forecasting in a single dark-themed investigator interface.

## Run & Operate

- `pnpm --filter @workspace/rakshak-ai run dev` — run the frontend (port assigned by workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, Recharts, Wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle DB schema (firs, accused, chat, alerts)
- `artifacts/api-server/src/routes/` — Express route handlers (dashboard, chat, firs, accused, network, analytics, hotspots, forecasting, alerts)
- `artifacts/rakshak-ai/src/pages/` — Frontend pages

## Product

Rakshak AI is a crime intelligence platform for investigators, analysts, supervisors, and policymakers with:
1. **AI Conversational Assistant** — natural language chat interface for querying crime data
2. **Criminal Network Analysis** — interactive force-directed graph of accused/victim/location links
3. **Crime Pattern Analytics** — trend charts, district breakdowns, modus operandi analysis
4. **Crime Hotspot Detection** — Karnataka district map with intensity-coded crime hotspots
5. **FIR Management** — searchable FIR list with AI summaries and similar case finder
6. **Offender Profiling** — risk scoring (0–100) with behavioral profiling and network links
7. **Sociological Insights** — demographics, age groups, education vs. crime correlation
8. **Crime Forecasting** — AI-driven predictions with probability scores and risk areas
9. **Smart Alerts** — repeat offender, gang activity, crime spike, and serial pattern alerts
10. **Role-Based Access** — Investigator, Analyst, Supervisor, Policy Maker, Admin roles

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any OpenAPI spec change, re-run `pnpm --filter @workspace/api-spec run codegen` before touching routes or frontend
- Run `pnpm run typecheck:libs` after any `lib/*` change before checking artifact packages
- Analytics endpoints use synthetic trend data layered on top of real DB counts — real data is used for totals and groupings
- Hotspot and forecasting data are static fixtures (real ML model integration is the next step)
