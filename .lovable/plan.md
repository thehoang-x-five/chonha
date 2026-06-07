# UI Bug Fix + Missing Screens Plan — Chợ Nhà Mình

The request covers ~50+ screens, design-system cleanup, responsive fixes, and a "no dead UI" sweep across 4 roles. That's far too much to ship reliably in a single pass without regressions. I'll break it into **5 focused phases**, each independently shippable, and stop after each so you can review before I continue.

## Guardrails (apply to every phase)

- Keep architecture: UI → hooks → services → mocks. No UI imports mock data.
- All copy in Vietnamese. Every button wired (real action, mock service, toast, or `notifyTodo`).
- Mobile-first; verify at 360 / 390 / 430 / 768 / 1024px.
- Reuse existing tokens in `src/styles.css`. No hardcoded colors in components.
- Don't delete existing routes/features.

## Phase 1 — Design system + shared UI primitives

Build the reusable shells everything else depends on, so later phases stay consistent.

- `PageShell`, `MobilePageHeader` (safe-area aware), `StickyBottomCTA` (safe-bottom + padding helper for content above it)
- `SectionTitle`, `EmptyState`, `LoadingSkeleton`, `ErrorState`
- `ConfirmDialog`, `ActionSheet`
- `ResponsiveTable` (cards on mobile, table on ≥md)
- `SearchFilterBar`, `StatCard`, `NotificationBell`, `SafeAreaContainer`
- Audit `styles.css` tokens (primary/secondary/cream/border/success/warning/error/info), unify radius + shadow scales, retire ad-hoc colors found in components.

## Phase 2 — Responsive + layout bug sweep

Run through every existing route at the 5 breakpoints and fix:

- Content hidden behind bottom nav → standardize `pb-nav` usage.
- Header / sticky CTA safe-area padding.
- Cart totals sticky bar; tracking map placeholder height capped on mobile.
- Admin sidebar → drawer on `<md`; tables → cards on mobile.
- Overflow text, tap-target sizing, modal max-height on small screens.
- Vendor screens: bump font + button size, simplify per-screen actions.

## Phase 3 — Customer missing screens & wiring

New routes (only the ones missing today):

- `customer.search.tsx` (grouped: Chợ / Gian hàng / Sản phẩm)
- `customer.category.$slug.tsx` (products across stalls in selected market)
- `customer.addresses.tsx` (add/edit/delete/default via `authService` address API already in place)
- `customer.vouchers.tsx` (available / used / expired tabs — new `voucherService` + mocks)
- `customer.notifications.tsx` (uses existing `notificationService`)
- `customer.support.tsx` (FAQ accordion + mock chat button)
- `customer.profile.edit.tsx`
- `customer.orders.$id.rate.tsx` (rate market + stall + driver, mock submit)
- Wire every dead button on existing customer screens.

## Phase 4 — Vendor + Driver missing screens & wiring

Vendor new:
- `vendor.inventory-alerts.tsx`, `vendor.messages.tsx`, `vendor.notifications.tsx`, `vendor.support.tsx`, `vendor.onboarding.tsx`
- Quick-edit price modal, bulk availability toggle, replace-item suggestion modal, "ready for pickup" action, driver pickup status panel inside order detail.

Driver new:
- `driver.trips.$id.pickup.tsx` (per-stall checklist), `driver.notifications.tsx`, `driver.support.tsx`, `driver.issues.tsx`
- Issue-report modal with the 4 preset reasons, OTP confirm screen polish, call/chat customer mock buttons, earnings auto-bump after complete.

## Phase 5 — Admin missing screens + final polish

New admin routes:
- `admin.vouchers.tsx`, `admin.notifications.tsx`, `admin.tickets.tsx`, `admin.users.tsx`, `admin.audit-log.tsx`
- Add search/filter/pagination to existing tables; confirmation modals on destructive actions; mobile drawer nav for admin shell.
- Final "no dead UI" sweep: grep every `onClick` / `<button>` / `<Link>` and ensure each has a handler or `notifyTodo`.
- Fix the current React #418 hydration warning surfaced on `/customer/cart`.

## What I need from you

This is a big body of work. Two questions before I start:

1. **Phasing**: ship phases 1→5 sequentially with a checkpoint after each, OR fold phases 1+2 (foundations + bug sweep) into one delivery and pause there? I recommend the latter — it gives you a visible quality jump fastest.
2. **Scope trim**: any screens above you'd like to **defer** (e.g. audit log, voucher wallet, vendor onboarding) so I can focus on the highest-value flows first?

Once you answer I'll execute. If you just say "go", I'll do phases 1+2 together, then stop for review.