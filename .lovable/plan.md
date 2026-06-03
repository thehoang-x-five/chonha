
# Complete Frontend Interactions — Chợ Nhà Mình

Goal: make every button, toggle, filter and form across all four roles do something real (mock action / modal / navigation / toast), persist demo state in localStorage, and keep the existing **UI → hooks → services → mocks** architecture intact. No real backend, payments, maps or auth.

## 1. Foundations (do first)

- **`src/lib/storage.ts`** — typed `loadJSON / saveJSON` wrappers with namespaced keys: `cnm.role`, `cnm.user`, `cnm.cart`, `cnm.followedStalls`, `cnm.orders`, `cnm.vendorProductAvailability`, `cnm.driverOnline`, `cnm.appSettings`, `cnm.addresses`, `cnm.vendorStall`, `cnm.driverProfile`. Each store has a default-seed + `reset()`.
- **Seed bootstrap**: services hydrate their in-memory arrays from localStorage on first import; mutations call `save()`. This keeps refreshes from wiping demo progress.
- **`src/lib/validators.ts`** — extend with `vnPhone`, `price`, `qty`, `address`, `otp`, `requiredText`, returning `{ ok, message }` with Vietnamese messages.
- **Global toast contract**: helper `notifyTodo(label)` → `toast.info(`${label} sẽ được kết nối API ở phiên bản sau.`)` for not-yet-wired actions.

## 2. Service-layer additions

Round out the existing services so every UI need has a method:

- `cartService`: `addToCart` (with cross-market guard returning `CROSS_MARKET` error), `forceReplaceCart`, `updateQty`, `removeItem`, `clearCart`, `applyVoucher`.
- `orderService`: `createOrder`, `getOrdersByCustomer`, `getOrderById`, `cancelOrder`, `advanceStatus` (demo "next status" button), `reorder(orderId)` (returns items, applies cross-market rule).
- `stallService`: `followStall / unfollowStall / isFollowed / listFollowed`, `setStallOpen`, `updateStall`, plus admin `approveStall / rejectStall / suspendStall`.
- `productService`: `toggleAvailability`, `updatePrice`, `createProduct`, `updateProduct`, `deleteProduct`, `searchProducts`.
- `deliveryService`: `getAvailableTripForDriver`, `declineTrip`, `confirmPickup(orderId, stallId)`, `advanceTripStatus`, `confirmDelivery(otp)` validates `"1234"`, `reportIssue(type)`.
- `adminService`: `listMarkets / createMarket / updateMarket / toggleMarket / disableMarket`, `listStalls(filter)`, `listProducts`, `hideProduct`, `listOrders(filter)`, `forceStatus`, `assignDriver`, `refund`, `listDrivers`, `verifyDriver`, `suspendDriver`, `dispatch.listWaitingOrders`, `dispatch.listAvailableDrivers`, `dispatch.score(order, driver)` (mock: distance + workload + rating + vehicle), `recomputeMatches`, `getSettings / saveSettings`, `resetDemoData()`.
- `authService`: `getCurrentUser`, `updateProfile`, `listAddresses / addAddress / updateAddress / deleteAddress`, `logout()` clears `cnm.role` + `cnm.user` and navigates to `/`.

## 3. Hooks

Add/extend: `useFavorites`, `useAddresses`, `useVendorOrders`, `useVendorProducts`, `useVendorStall`, `useDriverTrip`, `useAdminMarkets`, `useAdminStalls`, `useAdminProducts`, `useAdminOrders`, `useAdminDrivers`, `useDispatch`, `useAppSettings`. Each returns `{ data, loading, error, refetch, ...mutations }` and calls services only.

## 4. Customer pages

- **home**: wire search input (debounced) against `productService.search + marketService.search + stallService.search`; category chips filter products; card links use `<Link>` with proper params.
- **markets.$id**: stall category filter + in-market stall search; favorite toggle via `useFavorites`; "Chợ đang đóng cửa" banner when `market.isOpen === false`.
- **stalls.$id**: product category filter; availability badge driven by `product.available`; follow/unfollow; call/message → `notifyTodo`.
- **products.$id**: already mostly built — replace direct `cart.add` with `cartService.addToCart`; on `CROSS_MARKET` error open `<AlertDialog>` with the two options; note saved to local draft (`cnm.cartDraftNote`).
- **cart**: qty +/-, remove, clear (confirm dialog), voucher input (`MOCK10` = 10% off), grouping by stall, disabled checkout when empty.
- **checkout** (new route `customer.checkout.tsx`): address select from `useAddresses`, delivery note, time slot, payment method radios; Confirm → `orderService.createOrder` → `cartService.clearCart` → navigate to `/customer/orders/$id/tracking`.
- **orders.$id.tracking**: status from service; "Mô phỏng bước tiếp theo" demo button calls `advanceStatus`; timeline + driver card + per-stall pickup checklist reactive; Cancel allowed when status ∈ {placed, accepted, preparing}; Support button opens modal.
- **favorites**: list from `useFavorites`, remove, "Đặt lại" from last order, navigate.
- **orders.index**: tab filtering already there; add "Đặt lại" button on completed orders calling `reorder`.
- **profile**: edit form (name/phone/email) with validators; address CRUD; logout.

## 5. Vendor pages

- **dashboard**: KPIs derived from `useVendorOrders`; urgent-order card links to detail; quick availability toggles call `productService.toggleAvailability`.
- **orders**: status filter tabs; accept / reject (reason modal); call button toast; row → detail.
- **orders.$id**: enforce workflow `accepted → preparing → ready_for_pickup → handed_to_driver`; disabled buttons outside current step; show notes, prep, replacement preference; "Báo hết hàng" modal selects an item and calls `productService.toggleAvailability(false)` + adds order note.
- **products**: search/filter/toggle/quick-price modal/edit/delete/add (route `vendor.products.new.tsx`). Forms validated.
- **revenue**: today/week/month filter computes from mock orders; chart via recharts; export → toast.
- **profile** (My Stall): edit fields, open/close toggle, save via `stallService.updateStall`.

## 6. Driver pages

- **home**: online/offline switch persists; when online surfaces `getAvailableTripForDriver` mock; accept → `/driver/trips/$id`; decline hides + toast; map placeholder shows status text.
- **trips.$id**: state machine `heading_to_market → picking_up → all_picked → delivering → delivered`; per-stall confirm buttons; "Đã lấy đủ hàng" enabled only when all stalls confirmed; call-stall toast; issue modal with 3 reasons; delivery step has call/chat toast + OTP input validating `1234` (validator message Vietnamese); on complete → success screen → back to home.
- **trips**: history list from `deliveryService.listTrips(driverId)`, day/week/month filter, detail modal.
- **earnings**: aggregate from mock trips.
- **profile**: edit fields incl. vehicle, logout.

## 7. Admin pages

- **dashboard**: KPIs + charts from `useAdminDashboard`; clicking a KPI navigates to filtered table via search params.
- **markets**: search, add modal, edit modal, open/close toggle, disable confirm.
- **stalls**: filters, approve/reject(reason)/suspend(reason), detail dialog.
- **products** (new route `admin.products.tsx` already exists): search/filter/hide/unhide/detail dialog.
- **orders**: filters, detail dialog, manual status with confirm, assign/reassign driver, refund mock action.
- **drivers**: filters, verify, suspend(reason), detail dialog.
- **dispatch**: waiting orders + available drivers + matching score (`0.4*distance + 0.25*workload + 0.2*rating + 0.15*vehicleFit`), per-card assign/reassign, "Mô phỏng matching" recomputes scores, empty state when no drivers.
- **reports**: date range / market / stall filters drive chart data; export CSV → toast.
- **settings**: form for delivery fee, service fee, commission, hotline, voucher; validators; save toast; **"Khôi phục dữ liệu demo"** button calls `resetDemoData()` then `window.location.reload()`.

## 8. Cross-cutting

- **Mobile-friendly modals** use existing `Dialog`/`AlertDialog`/`Drawer` shadcn primitives.
- **Page transitions** already provided by `MobileShell`'s `page-enter` keyed on route — unchanged.
- **Vietnamese strings** sourced from `lib/constants.ts` (extend with any new statuses).
- **No UI file imports `@/mocks/*` or `@/lib/mock-data`** — only through services/hooks. The compatibility shim stays only for currently-migrated legacy pages, and is removed from any page touched in this pass.

## 9. Out of scope

- Real auth / payment / maps / push.
- Real driver matching algorithm beyond the weighted mock score.
- TanStack Query introduction.
- Component re-bucketing into role folders or moving routes under `src/app/routes/`.

## Acceptance check

Manual smoke run after build:
1. Pick "Khách hàng" → search → add to cart → checkout → tracking → simulate next step until delivered.
2. Switch to "Chủ sạp" → accept the order created above → advance to handed-to-driver.
3. Switch to "Tài xế" → go online → accept trip → confirm each stall → deliver with OTP `1234`.
4. Switch to "Quản trị" → see the completed order in dashboard, approve a pending stall, run "Mô phỏng matching" in dispatch, save settings, "Khôi phục dữ liệu demo".

Given the breadth (≈40 route files + new services/hooks/storage), the work will land as several large parallel batches in a single pass; you should expect a long build with many file writes.
