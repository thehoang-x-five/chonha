import type { OrderStatus, PaymentMethod } from "@/types/order.types";
import type { UserRole } from "@/types/user.types";

export const APP_NAME = "Chợ Nhà Mình";
export const APP_TAGLINE = "Đi chợ tươi mỗi ngày – mua đúng sạp quen";
export const SUPPORT_HOTLINE = "1900 1234";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  preparing: "Đang chuẩn bị",
  ready_for_pickup: "Sẵn sàng giao cho tài xế",
  finding_driver: "Đang tìm tài xế",
  driver_assigned: "Đã có tài xế",
  picking: "Tài xế đang lấy hàng",
  picking_up: "Tài xế đang lấy hàng",
  delivering: "Đang giao hàng",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cod: "Tiền mặt khi nhận hàng",
  momo: "Ví MoMo",
  vnpay: "VNPay",
  card: "Thẻ ngân hàng",
};

export const ROLE_LABEL: Record<UserRole, string> = {
  customer: "Khách hàng",
  vendor: "Chủ gian hàng",
  driver: "Tài xế",
  admin: "Quản trị viên",
};

export const FEATURE_COMING_SOON_TOAST =
  "Tính năng này sẽ được kết nối API ở phiên bản sau.";
export const ROLE_FORBIDDEN_TOAST =
  "Anh/chị chưa có quyền truy cập khu vực này.";
