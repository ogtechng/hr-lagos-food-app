# Dashboard Layouts

## Shell

The admin shell uses:

- Dark compact left navigation.
- Light neutral content canvas.
- Topbar with sidebar trigger, search affordance, and utility actions.
- Content constrained to a readable max width.

Public pages must not use admin shell styling.

## Sidebar

Sidebar rules:

- Dark teal-green background.
- Active item has visible green accent and higher contrast.
- Inactive icons/text are muted but readable.
- Group labels are subtle.
- Collapse state must remain usable with icon tooltips.
- Bottom area can hold support/logout/account controls.

## Topbar

Topbar rules:

- Keep it calm and utilitarian.
- Use a central or left search affordance when useful.
- Keep utility icons on the right.
- Do not duplicate page hero content in the topbar.

## Dashboard Home

Dashboard home should use:

- A full dark command banner with brand context, date/greeting, search affordance, utility icons, page tabs, and primary actions.
- A metric strip or summary band, not oversized cards.
- A chart band using custom admin chart colors for hiring pipeline and workload balance.
- A wide primary data panel for recent applications or active review work.
- A right-side operations panel inspired by an assistant/copilot surface.

The right-side panel is not an AI feature by default. It is a review/insight panel showing pending actions, bottlenecks, shortcuts, and useful status notes.

## List Pages

List pages should use:

- Compact dark page header based on the dashboard banner language, but without the dashboard tab/search/greeting structure.
- Filter/search panel.
- Table panel.
- Optional stats strip only when it improves decision making.

Avoid dashboard-sized command banners and decorative sections on CRUD list pages.

## Charts

- Charts should be custom-built with CSS/SVG/HTML when simple counts are enough; do not add a chart package unless the data complexity requires it.
- Use `--admin-chart-blue`, `--admin-chart-green`, `--admin-chart-red`, and `--admin-chart-lemon` for chart fills.
- Charts must include visible labels and values, not color-only meaning.
- Keep chart panels data-dense, with crisp borders and neutral shadcn-style surfaces.

## Responsive Behavior

- Mobile admin collapses to a single column.
- Tables may scroll horizontally but page chrome must not overflow.
- Side panels stack below primary content on tablet/mobile.
- Search and filter controls wrap predictably.
