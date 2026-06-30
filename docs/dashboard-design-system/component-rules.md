# Component Rules

## Buttons

- Primary actions: deep green or accent green, rectangular with `8px` radius.
- Secondary actions: neutral background with border.
- Destructive actions: soft red surface by default, stronger color only for final confirmation.
- Table row actions should use a compact `Actions` menu trigger with icon and label.
- Avoid plain text-only action buttons in tables.

## Inputs And Selects

- Labels sit above inputs.
- Inputs use soft boxy corners, thin borders, and neutral backgrounds.
- Heights:
  - Dense filters: `32px`
  - Standard forms: `40px`
  - Search bars: `40px` to `44px`
- Selects must include a placeholder state, empty state when no options exist, and disabled state when dependent data is unavailable.

## Dropdown Menus

Each dropdown must include:

- Clear trigger label or icon+label.
- At least one grouping label when more than two actions exist.
- Disabled states for unavailable actions.
- Destructive action styling separated from normal actions.
- Keyboard/focus states inherited from the Base UI primitives.

Dropdown content should be aligned to the trigger and should not feel like floating raw text.

## Popovers And Side Panels

- Use side panels for contextual review queues, summaries, or assistant-style operational guidance.
- A popover must include a title or clear trigger context.
- Popovers should never hide critical form validation.
- Long content belongs in a drawer/dialog/side panel, not a tiny popover.

## Dialogs And Alert Dialogs

Every modal flow must define:

- Title.
- Short consequence statement.
- Primary action.
- Cancel action.
- Loading/pending state.
- Error handling path.

Destructive flows must use `AlertDialog` and must not execute immediately from a table row without confirmation.

## Tables

Tables are primary admin surfaces.

Required behavior:

- Search/filter controls above the table.
- Sortable headers where supported.
- Pagination with visible count.
- Designed row actions menu.
- Empty state that suggests the next action.
- No hidden critical data in hover-only UI.

Column design:

- First column should identify the record.
- Status columns use badges.
- Numeric/date columns should align consistently.
- Action column should be narrow and visually consistent.

## Loading, Empty, And Error States

- Loading states should match the layout shape, preferably skeleton rows/panels.
- Empty states should be compact inside data panels.
- Error states should be explicit and recoverable.
- Avoid generic spinners in full-page admin views unless the whole route is waiting on auth.
