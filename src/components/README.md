# Components — logical organization

TanStack file-based routing requires routes under `src/routes/`, so the
physical layout below is intentional. The *logical* grouping is documented
here so a contributor can find things quickly without moving files (which
would break every import).

```
common/    Cross-role primitives (RoleGuard, status badges, shells, cards)
           → app-shell.tsx, admin-shell.tsx, bottom-nav.tsx, cards.tsx,
             order-timeline.tsx, status-badge.tsx, admin-ui.tsx,
             common/RoleGuard.tsx
customer/  (rendered in src/routes/customer.*) — see cards.tsx variants
vendor/    vendor.tsx
driver/    (rendered in src/routes/driver.*)
admin/     admin-ui.tsx, admin-shell.tsx
ui/        shadcn/ui primitives — do not edit by hand
```

## Pages still using the legacy `@/lib/mock-data` import (compatibility shim)

These pages are functional but pending migration to hooks + services. The
shim makes their imports go through `src/mocks/*`, so the "UI never reads
raw seed data" rule still holds at the module-boundary level.

- `src/routes/vendor.products.new.tsx`
- `src/routes/vendor.revenue.tsx`
- `src/routes/vendor.profile.tsx`
- `src/routes/driver.profile.tsx`
- `src/routes/admin.products.tsx`
- `src/routes/admin.reports.tsx`
- `src/routes/admin.settings.tsx`

When a real backend is wired up, only the bodies of the methods in
`src/services/*` need to change — UI pages stay the same.
