# HR Portal Dashboard Design System

This design system applies to the authenticated admin dashboard only. Public routes under `app/(public)` must not inherit dashboard layout, color, density, or interaction changes unless a task explicitly asks for public-page work.

## Product Direction

The admin should feel like a calm operational command center for HR teams: dense enough for repeated daily work, polished enough to feel trustworthy, and restrained enough that data remains the first thing users see.

The visual reference is a modern SaaS workspace with:

- A deep-green compact left rail with lemon text/accent.
- A light neutral application canvas.
- Table-first information architecture.
- A restrained deep-green action system with lemon reserved for sidebar text and important contrast moments.
- A right-side operational panel for context, review queues, and next actions.

## Non-Negotiables

- Build the actual workflow surface first, not a marketing page.
- Keep admin and public visual systems isolated.
- Prefer dense, readable tables and panels over decorative cards.
- Use soft boxy corners, not full pill shapes, except for tiny status dots or avatars.
- Every dropdown, popover, dialog, menu, table, and form must include complete states.
- Do not assume missing component behavior. Ask clarifying questions when scope, data, actions, or states are ambiguous.

## Required Reading Order

Before building or modifying admin UI, read:

1. `visual-language.md`
2. `component-rules.md`
3. `dashboard-layouts.md`
4. `ai-build-rules.md`

## Implementation Boundary

Admin styling should be scoped through admin shell classes, shared admin components, or admin route components. Avoid broad global CSS changes that alter the public site.
