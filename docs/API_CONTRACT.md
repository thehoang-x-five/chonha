# API Contract – Chợ Nhà Mình

Tài liệu này mô tả hợp đồng API giữa frontend (hiện đang dùng mock) và backend thật trong tương lai.
Mỗi module liệt kê: mục đích, hàm service hiện tại ở frontend, HTTP method & endpoint đề xuất, payload request/response, các trường hợp lỗi và ghi chú cho backend developer.

**Quy ước chung**

- Base URL đề xuất: `/api/v1`
- Auth: Bearer JWT trong header `Authorization: Bearer <token>` (trừ các endpoint công khai).
- Mọi response thành công gói trong `{ "data": ... }`. Lỗi gói trong `{ "error": { "code": string, "message": string } }`.
- Mọi message lỗi hiển thị cho người dùng đều bằng tiếng Việt.
- Tiền tệ: số nguyên VND (không thập phân).
- Thời gian: ISO 8601 UTC.
- Phân trang: `?page=1&pageSize=20`, response thêm `meta: { page, pageSize, total }`.

---

## 1. Authentication

Mục đích: Đăng nhập bằng số điện thoại + OTP, lấy session và role hiện tại.

### requestOtp(phone)
- Frontend: `authService.requestOtp(phone)`
- API: `POST /api/v1/auth/otp/request`
- Request:
  ```json
  { "phone": "0909123456" }
  ```
- Response:
  ```json
  { "data": { "ok": true, "expiresInSec": 60 } }
  ```
- Lỗi:
  - `400 INVALID_PHONE`: Số điện thoại không hợp lệ
  - `429 RATE_LIMITED`: Gửi OTP quá nhiều lần, vui lòng thử lại sau
- Notes: Rate-limit theo số điện thoại + IP. Gửi OTP qua SMS gateway (Twilio/eSMS).

### verifyOtp(phone, code, role)
- Frontend: `authService.verifyOtp(phone, code, role)`
- API: `POST /api/v1/auth/otp/verify`
- Request:
  ```json
  { "phone": "0909123456", "code": "1234", "role": "customer" }
  ```
- Response:
  ```json
  {
    "data": {
      "token": "jwt...",
      "refreshToken": "...",
      "user": { "id": "u_1", "name": "Chị Mai", "phone": "0909123456", "role": "customer" }
    }
  }
  ```
- Lỗi:
  - `400 INVALID_OTP`: Mã OTP không đúng
  - `410 OTP_EXPIRED`: Mã OTP đã hết hạn
- Notes: Role cho phép: `customer | vendor | driver | admin`. Nếu user chưa có hồ sơ vai trò, tự động tạo profile mặc định.

### getCurrentSession() / getCurrentUser()
- Frontend: `authService.getCurrentSession()`, `authService.getCurrentUser()`
- API: `GET /api/v1/auth/me`
- Response:
  ```json
  { "data": { "user": { "id": "u_1", "role": "customer", "name": "..." } } }
  ```
- Lỗi: `401 UNAUTHENTICATED`

### updateProfile(patch)
- API: `PATCH /api/v1/auth/me`
- Request: partial user (`name`, `email`, `avatar`).
- Response: user object.

### logout()
- API: `POST /api/v1/auth/logout`
- Notes: Thu hồi refresh token phía server.

### Address book
- `GET /api/v1/users/me/addresses` → list
- `POST /api/v1/users/me/addresses` → tạo, body `{ label, fullName, phone, address, isDefault? }`
- `PATCH /api/v1/users/me/addresses/:id` → cập nhật
- `DELETE /api/v1/users/me/addresses/:id`
- Notes: Chỉ một địa chỉ `isDefault=true` mỗi user.

---

## 2. Users

Mục đích: Quản trị người dùng (dành cho Admin).

- `GET /api/v1/admin/users?role=&q=&page=` – danh sách user.
- `GET /api/v1/admin/users/:id` – chi tiết.
- `PATCH /api/v1/admin/users/:id` – cập nhật trạng thái (`active|suspended`).
- Lỗi: `403 FORBIDDEN` nếu không phải admin.
- Notes: Mock hiện tại nằm ở `mockUsers`; chưa có hàm public phía customer ngoài `authService.updateProfile`.

---

## 3. Markets

Mục đích: Danh sách chợ + tìm kiếm.

### getMarkets()
- Frontend: `marketService.getMarkets()`
- API: `GET /api/v1/markets`
- Response:
  ```json
  {
    "data": [
      { "id": "m_1", "name": "Chợ Tân Mỹ", "address": "Q.7, TP.HCM", "status": "open", "rating": 4.8, "image": "..." }
    ],
    "meta": { "page": 1, "pageSize": 20, "total": 12 }
  }
  ```
- Lỗi: `500 INTERNAL`: Không tải được danh sách chợ.
- Notes: Hỗ trợ `?q=`, `?district=`, phân trang.

### getMarketById(id)
- API: `GET /api/v1/markets/:id`
- Lỗi: `404 NOT_FOUND` – Không tìm thấy chợ.

### searchMarkets(keyword)
- API: `GET /api/v1/markets?q=<keyword>` (gộp vào endpoint list).

---

## 4. Stalls

Mục đích: Sạp trong chợ, follow/unfollow, mở/đóng, duyệt.

### getStallsByMarket(marketId)
- API: `GET /api/v1/markets/:marketId/stalls`
- Response: mảng stall `{ id, marketId, name, category, rating, isOpen, isFollowed, approvalStatus }`.

### getStallById(id)
- API: `GET /api/v1/stalls/:id`

### followStall / unfollowStall
- `POST /api/v1/stalls/:id/follow`
- `POST /api/v1/stalls/:id/unfollow`
- Lỗi: `401` nếu chưa đăng nhập.

### listFollowed()
- API: `GET /api/v1/users/me/followed-stalls`

### setStallOpen(id, isOpen) – vendor
- API: `PATCH /api/v1/vendor/stalls/:id` body `{ "isOpen": true }`
- Lỗi: `403` nếu không phải chủ sạp.

### updateStall(id, patch) – vendor
- API: `PATCH /api/v1/vendor/stalls/:id`

### suspendStall(id) – admin
- API: `POST /api/v1/admin/stalls/:id/suspend`
- Notes: Đặt `approvalStatus=rejected`, `isOpen=false`. Phát notification cho chủ sạp.

### Stall approval workflow (admin)
- `GET /api/v1/admin/stalls?status=pending`
- `POST /api/v1/admin/stalls/:id/approve`
- `POST /api/v1/admin/stalls/:id/reject` body `{ "reason": "..." }`

---

## 5. Products

Mục đích: Sản phẩm theo sạp, tìm kiếm, vendor CRUD.

### getProductsByStall(stallId)
- API: `GET /api/v1/stalls/:stallId/products`

### getProductById(id)
- API: `GET /api/v1/products/:id`
- Lỗi: `404` Không tìm thấy sản phẩm.

### getAllProducts() / searchProducts(q)
- API: `GET /api/v1/products?q=&category=&marketId=&page=`

### toggleAvailability(id, isAvailable) – vendor
- API: `PATCH /api/v1/vendor/products/:id/availability` body `{ "isAvailable": true }`

### updatePrice(id, price) – vendor
- API: `PATCH /api/v1/vendor/products/:id/price` body `{ "price": 35000 }`
- Lỗi: `400 INVALID_PRICE`: Giá phải lớn hơn 0.

### createProduct(input) – vendor
- API: `POST /api/v1/vendor/products` body `{ stallId, name, category, price, unit, image, preparationOptions[] }`

### updateProduct(id, patch) / deleteProduct(id) – vendor
- `PATCH /api/v1/vendor/products/:id`
- `DELETE /api/v1/vendor/products/:id`
- Lỗi: `403` nếu sản phẩm không thuộc sạp của vendor.

Notes backend:
- Cần index `name`, `category`, `marketId` cho search.
- Khi `isAvailable=false`, vẫn cho phép xem nhưng chặn add to cart.

---

## 6. Cart

Mục đích: Giỏ hàng phía customer. Mỗi đơn chỉ trong 1 chợ.

### getCart()
- Frontend: `cartService.getCart()`
- API: `GET /api/v1/cart`
- Response:
  ```json
  {
    "data": {
      "marketId": "m_1",
      "items": [
        { "id": "ci_1", "productId": "p_1", "stallId": "s_1", "marketId": "m_1", "qty": 2, "prep": "Làm sạch", "note": "" }
      ],
      "subtotal": 120000, "deliveryFee": 18000, "serviceFee": 5000, "discount": 0, "total": 143000
    }
  }
  ```

### addToCart(productId, qty, prep?, note?)
- API: `POST /api/v1/cart/items`
- Lỗi:
  - `404 PRODUCT_NOT_FOUND`
  - `400 OUT_OF_STOCK`: Sản phẩm đã hết hàng
  - `400 DIFFERENT_MARKET`: Mỗi đơn chỉ hỗ trợ mua trong cùng một chợ.

### updateCartItem(productId, qty) / removeCartItem(productId)
- `PATCH /api/v1/cart/items/:productId`
- `DELETE /api/v1/cart/items/:productId`

### clearCart()
- `DELETE /api/v1/cart`

Notes: Tính phí (deliveryFee, serviceFee) ở backend để tránh giả mạo phía client. Áp dụng promotion code sau này: `POST /api/v1/cart/promo`.

---

## 7. Orders

Mục đích: Đặt đơn, theo dõi, hủy, đặt lại.

### createOrder(payload) – customer
- Frontend: `orderService.createOrder(...)`
- API: `POST /api/v1/orders`
- Request:
  ```json
  {
    "marketId": "m_1",
    "items": [{ "productId": "p_1", "qty": 2, "prep": "Làm sạch" }],
    "addressId": "addr_1",
    "paymentMethod": "cod",
    "note": ""
  }
  ```
- Response: order object + `paymentIntent` (nếu cần).
- Lỗi: `400 EMPTY_CART`, `400 INVALID_ADDRESS`, `409 STALL_CLOSED`.

### listOrders(filter)
- API: `GET /api/v1/orders?role=customer|vendor|driver&status=&page=`

### getOrderById(id)
- API: `GET /api/v1/orders/:id`
- Lỗi: `404`, `403`.

### advanceStatus(id, nextStatus) – demo helper
- API thật sẽ không có 1 endpoint generic; thay bằng các action role-based:
  - Vendor: `POST /api/v1/vendor/orders/:id/accept | reject | ready`
  - Driver: `POST /api/v1/driver/orders/:id/pickup | deliver`
  - Admin: `POST /api/v1/admin/orders/:id/force-status` body `{ status }`
- Notes: Backend enforce state machine: `pending → accepted → preparing → ready_for_pickup → picked_up → delivering → delivered`. Mọi chuyển trạng thái không hợp lệ trả `409 INVALID_TRANSITION`.

### cancelOrder(id, reason)
- API: `POST /api/v1/orders/:id/cancel` body `{ "reason": "..." }`
- Lỗi: `409 NOT_CANCELABLE` nếu đã giao.

### reorder(id)
- API: `POST /api/v1/orders/:id/reorder` → trả về cart mới.

---

## 8. Delivery

Mục đích: Theo dõi vị trí tài xế, xác nhận pickup theo sạp, OTP giao hàng.

### getTripByOrder(orderId)
- API: `GET /api/v1/delivery/trips?orderId=...`
- Response: `{ id, orderId, driverId, status, pickups: [{stallId, pickedUp}], dropoff: {lat,lng}, otp? }`

### confirmStallPickup(tripId, stallId) – driver
- API: `POST /api/v1/driver/trips/:tripId/pickups/:stallId/confirm`
- Lỗi: `409 ALREADY_PICKED`.

### validateDeliveryOtp(tripId, code) – driver
- API: `POST /api/v1/driver/trips/:tripId/deliver` body `{ "otp": "1234" }`
- Lỗi: `400 INVALID_OTP`: Mã OTP không đúng.

### reportIssue(tripId, payload) – driver
- API: `POST /api/v1/driver/trips/:tripId/issues` body `{ "type": "customer_unreachable|damaged|other", "note": "" }`

Notes: Cần realtime (websocket / SSE) cho khách theo dõi vị trí: `GET /api/v1/delivery/trips/:id/stream`.

---

## 9. Drivers

Mục đích: Quản lý tài xế, online/offline, hồ sơ, duyệt.

### setOnline(isOnline) – driver
- API: `POST /api/v1/driver/me/online` body `{ "isOnline": true }`

### getMyTrips() / getEarnings()
- `GET /api/v1/driver/me/trips?status=`
- `GET /api/v1/driver/me/earnings?from=&to=`

### listDrivers() – admin
- `GET /api/v1/admin/drivers?status=&q=`

### Driver verification workflow (admin)
- `GET /api/v1/admin/drivers?status=pending_verification`
- `POST /api/v1/admin/drivers/:id/verify`
- `POST /api/v1/admin/drivers/:id/reject` body `{ "reason": "..." }`
- Notes: Hồ sơ cần CCCD, GPLX, đăng ký xe – upload qua `POST /api/v1/driver/me/documents` (multipart).

---

## 10. Payments

Mục đích: Tạo giao dịch thanh toán (mock COD/MoMo/VNPay).

### createMockPayment(orderId, method, amount)
- API: `POST /api/v1/payments`
- Request: `{ "orderId": "o_1", "method": "cod|momo|vnpay|zalopay", "amount": 143000 }`
- Response: `{ data: { id, status: "pending|paid", redirectUrl? } }`
- Lỗi: `400 INVALID_AMOUNT`, `404 ORDER_NOT_FOUND`.

### getPaymentStatus(id)
- API: `GET /api/v1/payments/:id`

### refundMockPayment(id) – admin
- API: `POST /api/v1/admin/payments/:id/refund`

Notes backend:
- Webhook từ cổng thanh toán: `POST /api/v1/payments/webhook/:provider`. Verify chữ ký, cập nhật trạng thái.
- Không bao giờ tin amount từ client – luôn re-derive từ order.

---

## 11. Notifications

Mục đích: Thông báo cho từng user.

### listForUser(userId)
- API: `GET /api/v1/users/me/notifications?unread=true&page=`

### markRead(id) / markAllRead()
- `POST /api/v1/users/me/notifications/:id/read`
- `POST /api/v1/users/me/notifications/read-all`

Notes: Hỗ trợ push (FCM/APNs) khi tích hợp Capacitor sau này. Đăng ký device token: `POST /api/v1/users/me/devices`.

---

## 12. Admin Dashboard

Mục đích: Thống kê tổng quan.

### getDashboardStats()
- API: `GET /api/v1/admin/dashboard?range=today|7d|30d`
- Response:
  ```json
  {
    "data": {
      "orders": { "total": 320, "delta": 0.12 },
      "revenue": { "total": 45200000, "delta": 0.08 },
      "activeStalls": 84,
      "onlineDrivers": 22,
      "deliveryIssues": 3,
      "revenueByMarket": [{ "marketId": "m_1", "name": "Chợ Tân Mỹ", "revenue": 12000000 }],
      "orderVolume": [{ "date": "2026-06-01", "count": 40 }],
      "deliveryPerformance": { "onTimeRate": 0.93, "avgMinutes": 28 }
    }
  }
  ```
- Lỗi: `403` nếu không phải admin.

### Dispatch board
- `GET /api/v1/admin/dispatch/waiting-orders`
- `GET /api/v1/admin/dispatch/available-drivers`
- `POST /api/v1/admin/dispatch/assign` body `{ orderId, driverId }`
- `GET /api/v1/admin/dispatch/score?orderId=&driverId=` → `{ distance, workload, rating, vehicle, total }` (giải thích matching score).

---

## 13. Reports

Mục đích: Báo cáo cho admin.

- `GET /api/v1/admin/reports/revenue?from=&to=&groupBy=day|market|stall`
- `GET /api/v1/admin/reports/orders?from=&to=&status=`
- `GET /api/v1/admin/reports/drivers?from=&to=`
- `GET /api/v1/admin/reports/export?type=revenue&format=csv` → trả file CSV.
- Lỗi: `403`, `400 INVALID_RANGE`.

Notes: Cache theo `from|to|groupBy`. CSV streaming khi dataset lớn.

---

## 14. Settings

Mục đích: Cấu hình hệ thống (phí dịch vụ, phí giao, bán kính, v.v.).

### getSettings() / saveSettings(patch)
- `GET /api/v1/admin/settings`
- `PATCH /api/v1/admin/settings`
- Body ví dụ:
  ```json
  {
    "serviceFee": 5000,
    "deliveryBaseFee": 18000,
    "maxDeliveryRadiusKm": 5,
    "otpCodeLength": 4,
    "supportPhone": "1900xxxx"
  }
  ```
- Lỗi: `403`, `400 VALIDATION_ERROR`.

### Reset demo data
- Chỉ tồn tại ở môi trường mock; backend thật KHÔNG implement endpoint này.

---

## Phụ lục: Mã lỗi chuẩn

| HTTP | code                | Thông điệp tiếng Việt mặc định           |
|------|---------------------|-------------------------------------------|
| 400  | VALIDATION_ERROR    | Dữ liệu không hợp lệ                      |
| 401  | UNAUTHENTICATED     | Anh/chị vui lòng đăng nhập                |
| 403  | FORBIDDEN           | Anh/chị không có quyền thực hiện thao tác |
| 404  | NOT_FOUND           | Không tìm thấy dữ liệu                    |
| 409  | CONFLICT            | Thao tác không hợp lệ ở trạng thái hiện tại |
| 410  | EXPIRED             | Phiên/đối tượng đã hết hạn                |
| 429  | RATE_LIMITED        | Thao tác quá nhanh, vui lòng thử lại sau  |
| 500  | INTERNAL            | Hệ thống đang bận, vui lòng thử lại        |
