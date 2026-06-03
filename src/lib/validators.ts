// Vietnamese-localised validators returning {ok, message}.

export type ValidationResult = { ok: true } | { ok: false; message: string };

export const isValidPhone = (phone: string): boolean => /^0\d{8,10}$/.test(phone.trim());
export const isValidOtp = (code: string): boolean => /^\d{4,6}$/.test(code.trim());
export const isValidPrice = (price: number): boolean => Number.isFinite(price) && price > 0;
export const isNonEmpty = (s: string | undefined | null): boolean => !!s && s.trim().length > 0;

export const validatePhone = (phone: string): ValidationResult =>
  isValidPhone(phone) ? { ok: true } : { ok: false, message: "Số điện thoại phải bắt đầu bằng 0 và đủ 9–11 số." };

export const validateOtp = (code: string, expected = "1234"): ValidationResult => {
  if (!/^\d{4}$/.test(code)) return { ok: false, message: "Mã OTP gồm 4 chữ số." };
  if (code !== expected) return { ok: false, message: "Mã OTP chưa đúng, vui lòng kiểm tra lại." };
  return { ok: true };
};

export const validatePrice = (price: number): ValidationResult => {
  if (!Number.isFinite(price) || price <= 0) return { ok: false, message: "Vui lòng nhập giá hợp lệ." };
  if (price < 1000) return { ok: false, message: "Giá tối thiểu 1.000 đ." };
  if (price > 100_000_000) return { ok: false, message: "Giá tối đa 100 triệu." };
  return { ok: true };
};

export const validateQty = (qty: number): ValidationResult => {
  if (!Number.isFinite(qty) || qty <= 0) return { ok: false, message: "Số lượng phải lớn hơn 0." };
  if (qty > 999) return { ok: false, message: "Số lượng quá lớn." };
  return { ok: true };
};

export const validateAddress = (addr: string): ValidationResult => {
  if (!isNonEmpty(addr)) return { ok: false, message: "Vui lòng nhập địa chỉ giao hàng." };
  if (addr.trim().length < 8) return { ok: false, message: "Địa chỉ quá ngắn, vui lòng nhập chi tiết hơn." };
  return { ok: true };
};

export const validateRequired = (value: string, fieldLabel = "Trường này"): ValidationResult =>
  isNonEmpty(value) ? { ok: true } : { ok: false, message: `${fieldLabel} không được để trống.` };

export const validatePercent = (n: number): ValidationResult => {
  if (!Number.isFinite(n) || n < 0 || n > 100) return { ok: false, message: "Giá trị phải từ 0 đến 100%." };
  return { ok: true };
};
