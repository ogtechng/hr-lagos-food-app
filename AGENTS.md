# AGENTS.md — HR Portal Project Guide

## Project Overview

HR Portal for My Lagos Food App. Feature-based Next.js App Router project with Drizzle ORM, Supabase auth, and shadcn/ui.

## Tech Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- shadcn/ui components, tw-animate-css
- Drizzle ORM + PostgreSQL / Supabase
- Zod validation, Zustand (client UI state), TanStack Query (server state)
- Supabase Auth (SSR patterns)

## Project Layout

The project does **not** use a `src/` directory — everything is at the repo root
(`app/`, `components/`, `config/`, `context/`, `features/`, `hooks/`, `lib/`,
`stores/`, `types/`). The `@/*` alias maps to `./*`.

## Architecture Rules

1. **Feature-based structure** — Each domain (jobs, applications, reports, auth, entities, emails) lives in `features/<name>/` with `components/`, `services/`, `hooks/`, `schemas/`, `types/`, `data/`, `index.ts`.
2. **Server-first rendering** — Use Server Components by default. Move to client only when interactivity is required.
3. **API-route data layer (under `app/api/`):**
   - `app/api/v1/<resource>/route.ts` — HTTP handlers (auth checks + Zod validation)
   - `app/api/_services/` — Business logic (orchestration, rules)
   - `app/api/_repositories/` — Data access (Drizzle queries)
   - `app/api/_schemas/` — Zod schemas shared by routes and feature services
4. **Client data access** — Feature `services/` (`core_api.ts`/`write_api.ts`) wrap the Axios client; feature `hooks/` wrap those services in TanStack Query (`useQuery`/`useMutation`). No `"use server"` actions for CRUD — mutations go through React Query hooks → `/api/v1`. (Auth is the one exception: `features/auth/actions/` keeps Supabase SSR session handling server-side.)
5. **Server-side reads in pages** use `lib/server-api-client.ts` (`createServerApiClient()`) + the same feature `services/`.
6. **Database schema** — Drizzle schema in `app/api/_db/schema/`. Migrations in `app/api/_db/migrations/`.
7. **Validation** — Zod schemas in `app/api/_schemas/`. Routes validate input before calling services.

## Naming Conventions

- Files: `kebab-case.ts` for utilities, `kebab-case.tsx` for components
- Components: PascalCase
- Functions/variables: camelCase
- Database tables: snake_case
- Types/interfaces: PascalCase with descriptive names

## CLI Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run typecheck    # TypeScript check
npm run format       # Prettier format
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run migrations
npm run db:push      # Push schema (dev only)
```

## State Management

- Zustand for client-side UI state (sidebar, modals, app UI)
- Server state via Server Components (SSR reads) and TanStack Query hooks (client reads/mutations)
- No Redux or tRPC

## Styling

- Tailwind CSS v4 with @theme directive
- shadcn/ui components with CSS variables
- `tw-animate-css` for animations
- `cn()` utility from `@/lib/utils` for class merging
- Before admin/dashboard UI work, read `docs/dashboard-design-system/README.md` and follow its linked rules. These rules are admin-only and must not drift into public pages.

## Path Aliases

- `@/*` → `./*`
- `@/components/ui` → shadcn components
- `@/lib/utils` → utility functions
- `@/config/apiClient` → browser Axios client + `useApi()` hook
- `@/context/query-provider` → TanStack Query provider
- `@/lib/supabase` → Supabase clients
- `@/app/api/_db` → database connection & schema

---

## Strict Architecture Rules

### Architecture Flow

```
UI (Page / Client Component)
  → Feature hook (TanStack Query)  ─┐
  → Server Component (SSR read)     ─┤→ Feature service (Axios)
                                      → Route Handler (/api/v1, auth + Zod)
                                        → Service (business logic)
                                          → Repository (Drizzle queries)
                                            → Database
```

### Enforcement Rules

1. **Pages compose feature components only.** Never inline business logic or database access in a page file.
2. **UI components must never query the database.** Data access goes through feature hooks (TanStack Query) or Server Components — never raw DB calls in a rendered component.
3. **Business logic must not live inside pages or components.** Extract to `app/api/_services/`.
4. **Database queries must live in repositories.** Use the `app/api/_repositories/` layer exclusively. Never call Drizzle directly from routes or services.
5. **Email logic must live in the email service** (`app/api/_services/emails/`).
6. **Upload logic must live in the upload service** (`app/api/_services/upload/cv-upload.service.ts`).
7. **Do not introduce a second architecture.** No tRPC, no Redux, no Prisma, no custom API frameworks.
8. **Do not add duplicate patterns.** If a pattern exists (e.g., Zod validation in actions), reuse it instead of inventing a new one.
9. **Never install packages without checking `package.json` first.** Verify the package isn't already installed.
10. **Never guess package versions.** Always let npm resolve versions, or check the existing version range in `package.json`.
11. **Always inspect files before changing them.** Read the current content before editing — never overwrite blindly.

### Component Architecture

- Prefer **dumb/presentational components** that receive data via props.
- A component becomes a **Server Component** by default. Only add `"use client"` when interactivity (state, effects, event handlers, browser APIs) is required.
- Feature components live in their feature folder (e.g., `features/jobs/components/`).
- Shared components live in `components/shared/`.
- Layout components (sidebar, header, shell) live in `components/layout/`.

### State Management Rules

- **Zustand only for real client UI state** — sidebar open/closed, modal visibility, active tab. Not for server data.
- **Server state** (jobs, applications, users) must be fetched via Server Components or TanStack Query hooks — never cached in Zustand.
- Do not introduce Redux, Context for global state, or any other state library.

### Security Rules

1. **Validate all inputs with Zod.** Every Route Handler must validate its input against a Zod schema before processing.
2. **Protect admin routes server-side.** Every admin route handler calls `requireAdmin()` — client hooks never carry the trust boundary.
3. **Validate authorization on every admin mutation.** Each `/api/v1` route that mutates data verifies the user's role via `requireAdmin()`.
4. **Never expose service role keys to the client.** `SUPABASE_SERVICE_ROLE_KEY` is server-only via `app/api/_supabase/service-role.ts`.
5. **Never trust uploaded files.** Always validate file type, size, and content.
6. **Only allow PDF, DOC, DOCX uploads** for CVs/resumes. Reject everything else.
7. **Validate file size, extension, and MIME type** server-side before processing.
8. **Never interpolate user input into raw SQL.** Always use Drizzle's parameterized queries.
9. **Never use `dangerouslySetInnerHTML`** in any component.
10. **Return safe errors only.** Never leak stack traces, database errors, or internal state to the client. Map errors to user-friendly messages.
