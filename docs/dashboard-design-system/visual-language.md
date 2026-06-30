# Visual Language

## Color System

Admin UI uses scoped design-system variables declared on `.admin-scope`. Do not scatter fresh hex values through components.

- Canvas uses `--admin-canvas`: shadcn-style neutral gray/white, never a full green wash and never creamy brand neutrals.
- Panels use `--admin-panel`: clean white for data surfaces.
- Muted panel zones use `--admin-panel-muted`: shadcn neutral table headers, stat interiors, and quiet filter areas.
- Borders use `--admin-border`: shadcn neutral border tone.
- Body text uses `--admin-text`; supporting text uses `--admin-muted`, both based on shadcn neutral shades.
- Primary actions, active navigation, progress bars, and high-value accents use `--admin-primary`.
- Strong hover/pressed primary states use `--admin-primary-strong`.
- Sidebar text and special high-contrast accents use `--admin-lemon`.
- Soft primary callouts use `--admin-primary-soft`; soft lemon highlights use `--admin-lemon-soft`.
- Success, warning, and danger states may use their semantic badge colors, but should remain small and purposeful.

Use color to direct attention, not to decorate large areas. A page should usually read as neutral first, deep green second, lemon third.

## Token Rules

- Prefer scoped admin variable classes such as `bg-[var(--admin-panel)]`, `bg-[var(--admin-canvas)]`, `text-[var(--admin-primary)]`, `text-[var(--admin-lemon)]`, and `border-[var(--admin-border)]`.
- For subtle accents, use the named soft tokens first, especially `--admin-primary-soft` and `--admin-lemon-soft`.
- Do not add hardcoded hex colors inside routine component class names.
- If a new color is absolutely required, add it once to `.admin-scope`, document its role here, and explain why existing admin/status tokens cannot cover the need.

## Typography

- Dashboard UI must use sans-serif typography.
- Page titles are compact and work-focused, not hero-scale.
- Numbers should be easy to scan; use tabular or steady-width styling where helpful.
- Table text should be 13-14px with strong row rhythm.
- Labels should be short, uppercase only when they act as metadata.

## Shape And Radius

- Default admin radius: `8px`.
- Large panels: `10px` or `12px` only when the panel is prominent.
- Avoid `rounded-full` for buttons, inputs, filter chips, table containers, cards, and panels.
- Full circles are allowed for status dots, avatars, and small icon badges only.

## Spacing And Density

- Admin surfaces should feel efficient, not sparse.
- Use `p-4` to `p-5` for panels.
- Use row heights around `44px` to `56px` for tables.
- Prefer dividers and whitespace over nested cards.
- Avoid cards inside cards. Use sections, panels, or divided rows.

## Iconography

- Use `lucide-react` icons already available in the project.
- Icons should support commands and status, not replace labels when the action is unclear.
- Icon-only buttons require tooltips or visible context.
- Sidebar icons should be consistent size and stroke weight.
