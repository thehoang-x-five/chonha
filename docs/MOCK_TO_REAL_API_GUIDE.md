# Hướng dẫn chuyển từ Mock sang Real API

Tài liệu này mô tả cách thay thế lớp mock hiện tại bằng API thật mà **không phải sửa UI**.
Kiến trúc đang dùng: **UI components → hooks (`src/hooks/*`) → services (`src/services/*`) → apiClient → mock registry / mock data (`src/mocks/*`)**.

> Quy tắc vàng: UI **không bao giờ** import trực tiếp từ `src/mocks/*`. Mọi dữ liệu đi qua hooks/services.

---

## 1. Vị trí các tầng

| Tầng              | Thư mục                | Vai trò                                                  |
|-------------------|------------------------|-----------------------------------------------------------|
| Kiểu dữ liệu      | `src/types/*`          | Định nghĩa interface dùng chung cho cả mock & real API.  |
| Mock data         | `src/mocks/*`          | Seed dữ liệu giả + override lưu vào localStorage.        |
| API client        | `src/services/apiClient.ts` | Gọi `mock registry` (hiện tại) – sẽ đổi sang `fetch`. |
| Services          | `src/services/*Service.ts`  | Hàm nghiệp vụ public (vd `marketService.getMarkets()`). |
| Hooks             | `src/hooks/use*.ts`    | Bọc service, quản lý loading/error/state.                 |
| UI                | `src/routes/*`, `src/components/*` | Chỉ gọi hooks.                              |
| Shim cũ           | `src/lib/mock-data.ts` | Re-export tạm cho route chưa migrate xong. Sẽ bỏ dần.    |

---

## 2. Cần đổi gì khi có backend thật?

**CHỈ đổi 1 file**: `src/services/apiClient.ts` – chuyển từ "gọi mock registry" sang "gọi `fetch` HTTP thật".

**Có thể đổi từng service** nếu muốn migrate dần (vd `marketService` thật, các service còn lại vẫn mock).

**KHÔNG đổi**:

- `src/types/*` (giữ nguyên interface).
- `src/hooks/*` (vẫn gọi service như cũ).
- `src/routes/*`, `src/components/*` (UI giữ nguyên).
- `src/mocks/*` (có thể xoá sau khi tất cả service đã chuyển sang real API, nhưng giữ trong giai đoạn chuyển tiếp để fallback/dev offline).

---

## 3. Ví dụ chuyển đổi

### 3.1. Đổi `apiClient` sang `fetch`

Hiện tại (`src/services/apiClient.ts`) đang dispatch sang mock registry.
Thay bằng:

```ts
// src/services/apiClient.ts (PHIÊN BẢN REAL API – TODO khi backend sẵn sàng)
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = localStorage.getItem("cnm.token");
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(json?.error?.message ?? "Lỗi hệ thống", res.status, json?.error?.code);
  }
  return json.data as T;
}

export const apiClient = {
  get:    <T>(p: string)            => request<T>("GET", p),
  post:   <T>(p: string, b?: any)   => request<T>("POST", p, b),
  patch:  <T>(p: string, b?: any)   => request<T>("PATCH", p, b),
  delete: <T>(p: string)            => request<T>("DELETE", p),
};

export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) { super(message); }
}
```

Sau bước này, **mọi service đã viết theo pattern `apiClient.get("/markets")` tự động chạy với backend thật**. Không cần sửa hooks/UI.

### 3.2. Đổi một service cụ thể (nếu chưa qua apiClient)

Ví dụ `cartService` hiện đọc/ghi `localStorage` trực tiếp. Khi có backend:

```ts
// TRƯỚC – đọc localStorage
async getCart() {
  return compute(read());
}

// SAU – gọi backend (TODO: BACKEND)
async getCart(): Promise<Cart> {
  return apiClient.get<Cart>("/cart");
}

async addToCart(productId: string, qty = 1, prep?: string, note?: string): Promise<Cart> {
  return apiClient.post<Cart>("/cart/items", { productId, qty, prep, note });
}
```

UI vẫn gọi `useCart()` như cũ – không đổi gì.

### 3.3. Thay axios thay vì fetch (tuỳ chọn)

```ts
import axios from "axios";
const http = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });
http.interceptors.request.use((c) => {
  const token = localStorage.getItem("cnm.token");
  if (token) c.headers.Authorization = `Bearer ${token}`;
  return c;
});
// rồi bọc lại apiClient.get = (p) => http.get(p).then(r => r.data.data) ...
```

---

## 4. Checklist khi migrate từng module

- [ ] Backend đã expose endpoint khớp `docs/API_CONTRACT.md`.
- [ ] Thêm `VITE_API_BASE_URL` vào `.env`.
- [ ] Cập nhật `apiClient.ts` (1 lần) HOẶC sửa service cụ thể.
- [ ] Xoá `registerMock(...)` tương ứng trong service đã chuyển.
- [ ] Chạy thử: login → đặt đơn → vendor xử lý → driver giao → admin theo dõi.
- [ ] Khi tất cả service đã real, xoá `src/mocks/*` và `src/lib/mock-data.ts`.

---

## 5. TODO comments chuẩn

Khi viết code mock tạm, thêm comment để dễ tìm:

```ts
// TODO(BACKEND): thay bằng apiClient.get("/markets") khi backend sẵn sàng.
```

Tìm nhanh bằng `rg "TODO\(BACKEND\)"`.

---

## 6. Lưu ý quan trọng

- **KHÔNG xoá mock ngay** – giữ để dev offline và demo.
- **KHÔNG sửa UI** chỉ để phục vụ backend; nếu phải sửa, nghĩa là service chưa đúng abstraction.
- **Giữ message lỗi tiếng Việt** trong `ApiError` để UI hiển thị trực tiếp.
- **Session/token**: chuyển từ `cnm.session` (object) sang `cnm.token` (JWT string) khi tích hợp auth thật; cập nhật `authService` tương ứng, các hook khác không đổi.
