// Typed localStorage helpers. All app state that needs to survive a refresh
// goes through here so it's easy to wipe via the "Khôi phục dữ liệu demo"
// button in Admin → Cấu hình.

export const STORAGE_KEYS = {
  role: "cnm.role",
  session: "cnm-session-v1",
  cart: "cnm-cart-v1",
  followedStalls: "cnm.followedStalls",
  orders: "cnm.orders",
  vendorAvailability: "cnm.vendorProductAvailability",
  driverOnline: "cnm.driverOnline",
  appSettings: "cnm.appSettings",
  addresses: "cnm.addresses",
  vendorStall: "cnm.vendorStall",
  driverProfile: "cnm.driverProfile",
  cartDraftNote: "cnm.cartDraftNote",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const loadJSON = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
};

export const saveJSON = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(`cnm:${key}`));
  } catch {
    /* ignore quota errors in demo */
  }
};

export const removeKey = (key: string) => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
  window.dispatchEvent(new Event(`cnm:${key}`));
};

export const resetAllDemoData = () => {
  if (typeof window === "undefined") return;
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  window.dispatchEvent(new Event("cnm:reset"));
};
