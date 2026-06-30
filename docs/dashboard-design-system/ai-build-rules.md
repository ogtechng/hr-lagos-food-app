# AI Build Rules For Admin UI

## Before Building

If a requested admin component is ambiguous, ask clarifying questions before implementation. Do not assume:

- What data the component should display.
- Which actions are allowed.
- Whether an action is destructive.
- Which statuses exist.
- Whether a dropdown supports single-select, multi-select, search, or async loading.
- Whether the component is used on public pages.

## Required Questions For Ambiguous Components

Ask about:

- Primary user goal.
- Required data fields.
- Required actions.
- Empty/loading/error states.
- Permission or role constraints.
- Mobile behavior.
- Whether the component should be reusable or page-specific.

## Construction Rules

- Start from existing shared primitives.
- Keep server components by default.
- Move to client components only for state, browser APIs, menus, dialogs, or mutation triggers.
- Keep backend/data access in the established route/service/repository layers.
- Do not introduce new UI libraries unless the user explicitly approves.

## Quality Gate

Before finishing admin UI work, verify:

- Page works at desktop and mobile widths.
- No overlapping text.
- No uncontrolled horizontal page overflow.
- All actions have visible feedback.
- Public routes are unaffected.
- `npm run typecheck`, `npm run lint`, and `npm run build` pass when feasible.
