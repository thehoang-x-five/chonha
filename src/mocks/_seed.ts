// Single source of truth for seed data. UI code MUST NOT import this directly.
// Only files inside src/mocks/ and src/services/ may read from here.
// `src/lib/mock-data.ts` is a compatibility re-export and counts as part of
// the mocks layer for the purposes of the "no UI imports mock data" rule.

import type { Market } from "@/types/market.types";
import type { Stall, StallCategory } from "@/types/stall.types";
import type { Product } from "@/types/product.types";
import type { Order } from "@/types/order.types";
import type { Driver } from "@/types/delivery.types";
import type { User } from "@/types/user.types";
import type { Payment } from "@/types/payment.types";
import type { AppNotification } from "@/types/notification.types";

export const seedMarkets: Market[] = [
  { id: "m1", name: "Chợ Tân Mỹ", address: "Đường số 17, Tân Phú, Quận 7", distanceKm: 1.2, deliveryFeeFrom: 18000, status: "open", rating: 4.8, openingHours: "5:00 – 19:00", stallCount: 86, cover: "🏪" },
  { id: "m2", name: "Chợ Phước Long", address: "Phước Long B, Quận 7", distanceKm: 2.7, deliveryFeeFrom: 22000, status: "open", rating: 4.6, openingHours: "5:30 – 18:30", stallCount: 64, cover: "🏬" },
  { id: "m3", name: "Chợ Tân Quy", address: "Tân Quy, Quận 7", distanceKm: 3.1, deliveryFeeFrom: 25000, status: "closing", rating: 4.5, openingHours: "5:00 – 17:00", stallCount: 52, cover: "🛖" },
];

// Stalls include both new (`ownerName`, `isOpen`, `isFollowed`) and legacy
// (`owner`, `open`, `specialty`, `yearsActive`) field names so existing pages
// and the new service layer can both read from this single object.
type StallSeed = Stall & {
  owner: string;
  open: boolean;
  specialty: string;
  yearsActive: number;
};

export const seedStalls: StallSeed[] = [
  { id: "s1", marketId: "m1", name: "Sạp Cá Cô Lan", ownerName: "Cô Lan", owner: "Cô Lan", category: "Cá & Hải sản", description: "Cá biển & hải sản tươi", specialty: "Cá biển & hải sản tươi", rating: 4.9, yearsInMarket: 18, yearsActive: 18, isOpen: true, open: true, isFollowed: true, cover: "🐟", avatar: "👩‍🦳", badges: ["Đồ tươi sáng nay", "Sơ chế miễn phí", "Được yêu thích"], approvalStatus: "approved" },
  { id: "s2", marketId: "m1", name: "Sạp Rau Dì Hoa", ownerName: "Dì Hoa", owner: "Dì Hoa", category: "Rau củ", description: "Rau sạch mỗi sáng", specialty: "Rau sạch mỗi sáng", rating: 4.8, yearsInMarket: 12, yearsActive: 12, isOpen: true, open: true, isFollowed: true, cover: "🥬", avatar: "👩", badges: ["Rau sạch", "Giao nhanh"], approvalStatus: "approved" },
  { id: "s3", marketId: "m1", name: "Sạp Thịt Chú Minh", ownerName: "Chú Minh", owner: "Chú Minh", category: "Thịt", description: "Thịt heo tươi mỗi sáng", specialty: "Thịt heo tươi mỗi sáng", rating: 4.7, yearsInMarket: 22, yearsActive: 22, isOpen: true, open: true, isFollowed: false, cover: "🥩", avatar: "👨‍🦳", badges: ["Thịt nóng", "Heo nuôi sạch"], approvalStatus: "approved" },
  { id: "s4", marketId: "m1", name: "Trái Cây Cô Hạnh", ownerName: "Cô Hạnh", owner: "Cô Hạnh", category: "Trái cây", description: "Trái cây theo mùa", specialty: "Trái cây theo mùa", rating: 4.9, yearsInMarket: 9, yearsActive: 9, isOpen: true, open: true, isFollowed: false, cover: "🍎", avatar: "👩", badges: ["Trái cây mùa"], approvalStatus: "approved" },
  { id: "s5", marketId: "m2", name: "Sạp Hải Sản Anh Tư", ownerName: "Anh Tư", owner: "Anh Tư", category: "Cá & Hải sản", description: "Tôm cua sống", specialty: "Tôm cua sống", rating: 4.6, yearsInMarket: 7, yearsActive: 7, isOpen: true, open: true, isFollowed: false, cover: "🦐", avatar: "👨", badges: ["Sống bơi"], approvalStatus: "approved" },
  { id: "s6", marketId: "m2", name: "Gia Vị Bà Sáu", ownerName: "Bà Sáu", owner: "Bà Sáu", category: "Gia vị", description: "Gia vị truyền thống", specialty: "Gia vị truyền thống", rating: 4.7, yearsInMarket: 30, yearsActive: 30, isOpen: true, open: true, isFollowed: false, cover: "🌶️", avatar: "👵", badges: ["Lâu năm"], approvalStatus: "approved" },
  { id: "s7", marketId: "m3", name: "Sạp Rau Cô Bảy", ownerName: "Cô Bảy", owner: "Cô Bảy", category: "Rau củ", description: "Rau Đà Lạt", specialty: "Rau Đà Lạt", rating: 4.5, yearsInMarket: 15, yearsActive: 15, isOpen: true, open: true, isFollowed: false, cover: "🥕", avatar: "👩", badges: ["Rau Đà Lạt"], approvalStatus: "approved" },
  { id: "s8", marketId: "m3", name: "Đồ Khô Chú Tâm", ownerName: "Chú Tâm", owner: "Chú Tâm", category: "Đồ khô", description: "Đồ khô, mắm muối", specialty: "Đồ khô, mắm muối", rating: 4.4, yearsInMarket: 20, yearsActive: 20, isOpen: false, open: false, isFollowed: false, cover: "🍚", avatar: "👨", badges: [], approvalStatus: "pending" },
  { id: "s9", marketId: "m1", name: "Sạp Đậu Hũ Cô Năm", ownerName: "Cô Năm", owner: "Cô Năm", category: "Đồ khô", description: "Đậu hũ nóng mỗi sáng", specialty: "Đậu hũ nóng mỗi sáng", rating: 4.6, yearsInMarket: 11, yearsActive: 11, isOpen: true, open: true, isFollowed: false, cover: "🍱", avatar: "👩", badges: ["Mới đăng ký"], approvalStatus: "pending" },
];

// Products include both legacy (`inStock`, `freshNote`, `prepOptions`) and new
// (`isAvailable`, `freshnessNote`, `preparationOptions`, `marketId`) field names.
type ProductSeed = Product & {
  inStock: boolean;
  freshNote?: string;
  prepOptions?: string[];
};

const mk = (
  id: string,
  stallId: string,
  name: string,
  price: number,
  unit: string,
  category: StallCategory,
  image: string,
  inStock: boolean,
  freshNote?: string,
  prep?: string[],
): ProductSeed => {
  const stall = seedStalls.find((s) => s.id === stallId)!;
  return {
    id,
    stallId,
    marketId: stall.marketId,
    name,
    category,
    price,
    unit,
    image,
    isAvailable: inStock,
    inStock,
    freshnessNote: freshNote,
    freshNote,
    preparationOptions: prep ?? [],
    prepOptions: prep,
  };
};

export const seedProducts: ProductSeed[] = [
  mk("p1", "s1", "Cá thu tươi", 145000, "kg", "Cá & Hải sản", "🐟", true, "Hàng về lúc 5:30 sáng hôm nay", ["Để nguyên con", "Làm sạch", "Cắt khúc", "Bỏ đầu"]),
  mk("p2", "s1", "Cá diêu hồng", 72000, "kg", "Cá & Hải sản", "🐠", true, "Cá sống", ["Để nguyên con", "Làm sạch", "Cắt khúc"]),
  mk("p3", "s1", "Tôm sú loại 1", 260000, "kg", "Cá & Hải sản", "🦐", true, "Tôm sống", ["Để nguyên", "Bóc vỏ"]),
  mk("p4", "s1", "Mực ống tươi", 210000, "kg", "Cá & Hải sản", "🦑", true, undefined, ["Để nguyên", "Làm sạch"]),
  mk("p5", "s1", "Cá basa cắt khúc", 85000, "kg", "Cá & Hải sản", "🐟", true),
  mk("p6", "s2", "Rau muống", 12000, "bó", "Rau củ", "🥬", true),
  mk("p7", "s2", "Cải ngọt", 15000, "bó", "Rau củ", "🥬", true),
  mk("p8", "s2", "Cà chua", 25000, "kg", "Rau củ", "🍅", true),
  mk("p9", "s2", "Hành lá", 8000, "bó", "Rau củ", "🌿", true),
  mk("p10", "s2", "Xà lách", 20000, "kg", "Rau củ", "🥗", true),
  mk("p11", "s3", "Ba chỉ heo", 175000, "kg", "Thịt", "🥓", true),
  mk("p12", "s3", "Sườn non", 195000, "kg", "Thịt", "🍖", true),
  mk("p13", "s3", "Thịt nạc vai", 165000, "kg", "Thịt", "🥩", true),
  mk("p14", "s3", "Xương ống", 90000, "kg", "Thịt", "🦴", false),
  mk("p15", "s4", "Xoài cát Hoà Lộc", 65000, "kg", "Trái cây", "🥭", true),
  mk("p16", "s4", "Cam sành", 38000, "kg", "Trái cây", "🍊", true),
  mk("p17", "s4", "Chuối già", 22000, "kg", "Trái cây", "🍌", true),
  mk("p18", "s4", "Dưa hấu", 18000, "kg", "Trái cây", "🍉", true),
  mk("p19", "s5", "Cua biển sống", 380000, "kg", "Cá & Hải sản", "🦀", true),
  mk("p20", "s5", "Tôm thẻ", 180000, "kg", "Cá & Hải sản", "🦐", true),
  mk("p21", "s6", "Ớt hiểm", 60000, "kg", "Gia vị", "🌶️", true),
  mk("p22", "s6", "Tỏi", 70000, "kg", "Gia vị", "🧄", true),
  mk("p23", "s7", "Cà rốt Đà Lạt", 28000, "kg", "Rau củ", "🥕", true),
  mk("p24", "s7", "Khoai tây", 32000, "kg", "Rau củ", "🥔", true),
  mk("p25", "s8", "Nước mắm Phú Quốc", 95000, "chai", "Đồ khô", "🍶", false),
];

type DriverSeed = Driver;

export const seedDrivers: DriverSeed[] = [
  { id: "d1", name: "Anh Hùng", phone: "0908111222", vehicleType: "Xe máy", vehiclePlate: "59X2-123.45", vehicle: "Honda Wave", plate: "59X2-123.45", rating: 4.9, trips: 1280, isOnline: true, online: true, area: "Quận 7", avatar: "👨", verificationStatus: "verified" },
  { id: "d2", name: "Anh Quân", phone: "0908333444", vehicleType: "Xe máy", vehiclePlate: "59X1-987.65", vehicle: "Yamaha Sirius", plate: "59X1-987.65", rating: 4.8, trips: 980, isOnline: true, online: true, area: "Quận 7", avatar: "👨", verificationStatus: "verified" },
  { id: "d3", name: "Anh Bình", phone: "0908555666", vehicleType: "Xe máy", vehiclePlate: "59X3-555.66", vehicle: "Honda Vision", plate: "59X3-555.66", rating: 4.7, trips: 760, isOnline: false, online: false, area: "Quận 7", avatar: "👨", verificationStatus: "verified" },
  { id: "d4", name: "Chị Hà", phone: "0908777888", vehicleType: "Xe máy", vehiclePlate: "59X4-777.88", vehicle: "Honda Lead", plate: "59X4-777.88", rating: 4.9, trips: 1450, isOnline: true, online: true, area: "Quận 4", avatar: "👩", verificationStatus: "verified" },
  { id: "d5", name: "Anh Sơn", phone: "0908999000", vehicleType: "Xe máy", vehiclePlate: "59X5-111.22", vehicle: "Yamaha Janus", plate: "59X5-111.22", rating: 4.6, trips: 540, isOnline: false, online: false, area: "Quận 7", avatar: "👨", verificationStatus: "pending" },
];

type OrderSeed = Order & { customer: string; customerPhone: string; address: string };

const ts = (iso: string) => iso;

const buildOrder = (
  o: Omit<OrderSeed, "stallIds" | "deliveryAddress" | "customerId" | "paymentMethod" | "paymentStatus" | "timeline">,
): OrderSeed => ({
  ...o,
  customerId: "u-customer",
  stallIds: Array.from(new Set(o.items.map((i) => i.stallId))),
  deliveryAddress: o.address,
  paymentMethod: "cod",
  paymentStatus: o.status === "completed" ? "paid" : "pending",
  timeline: [
    { status: "confirmed", at: o.createdAt, note: "Đơn được xác nhận" },
  ],
});

export const seedOrders: OrderSeed[] = [
  buildOrder({ id: "o1", code: "CNM-2410001", customer: "Chị Mai", customerPhone: "0909123456", address: "112 Nguyễn Thị Thập, Q.7", marketId: "m1", items: [{ productId: "p1", stallId: "s1", qty: 1 }, { productId: "p6", stallId: "s2", qty: 2 }], subtotal: 169000, deliveryFee: 18000, serviceFee: 5000, total: 192000, status: "delivering", createdAt: ts("2024-10-21T07:30:00"), driverId: "d1" }),
  buildOrder({ id: "o2", code: "CNM-2410002", customer: "Anh Tuấn", customerPhone: "0912345678", address: "Sunrise City, Q.7", marketId: "m1", items: [{ productId: "p11", stallId: "s3", qty: 0.5 }], subtotal: 87500, deliveryFee: 18000, serviceFee: 5000, total: 110500, status: "preparing", createdAt: ts("2024-10-21T08:00:00") }),
  buildOrder({ id: "o3", code: "CNM-2410003", customer: "Cô Hương", customerPhone: "0938112233", address: "Phú Mỹ Hưng, Q.7", marketId: "m2", items: [{ productId: "p19", stallId: "s5", qty: 1 }], subtotal: 380000, deliveryFee: 22000, serviceFee: 5000, total: 407000, status: "completed", createdAt: ts("2024-10-20T16:00:00") }),
  buildOrder({ id: "o4", code: "CNM-2410004", customer: "Anh Hải", customerPhone: "0901999888", address: "Riverside, Q.7", marketId: "m1", items: [{ productId: "p3", stallId: "s1", qty: 0.5 }, { productId: "p8", stallId: "s2", qty: 1 }, { productId: "p12", stallId: "s3", qty: 1 }], subtotal: 350000, deliveryFee: 18000, serviceFee: 5000, total: 373000, status: "finding_driver", createdAt: ts("2024-10-21T08:15:00") }),
  buildOrder({ id: "o5", code: "CNM-2410005", customer: "Chị Linh", customerPhone: "0977222111", address: "Era Town, Q.7", marketId: "m1", items: [{ productId: "p15", stallId: "s4", qty: 2 }], subtotal: 130000, deliveryFee: 18000, serviceFee: 5000, total: 153000, status: "confirmed", createdAt: ts("2024-10-21T08:20:00") }),
  buildOrder({ id: "o6", code: "CNM-2409999", customer: "Anh Phúc", customerPhone: "0933444555", address: "Hoàng Anh Gia Lai, Q.7", marketId: "m2", items: [{ productId: "p20", stallId: "s5", qty: 1 }], subtotal: 180000, deliveryFee: 22000, serviceFee: 5000, total: 207000, status: "cancelled", createdAt: ts("2024-10-19T11:00:00") }),
];

export const seedUsers: User[] = [
  { id: "u-customer", name: "Chị Mai", phone: "0909123456", role: "customer", status: "active", avatarUrl: "👩" },
  { id: "u-vendor", name: "Cô Lan", phone: "0908000111", role: "vendor", status: "active", avatarUrl: "👩‍🦳" },
  { id: "u-driver", name: "Anh Hùng", phone: "0908111222", role: "driver", status: "active", avatarUrl: "👨" },
  { id: "u-admin", name: "Quản trị viên", phone: "0900000000", role: "admin", status: "active", avatarUrl: "🛡️" },
];

export const seedPayments: Payment[] = [
  { id: "pay-1", orderId: "o3", method: "momo", amount: 407000, status: "paid", createdAt: ts("2024-10-20T16:05:00") },
  { id: "pay-2", orderId: "o1", method: "cod", amount: 192000, status: "pending", createdAt: ts("2024-10-21T07:30:00") },
];

export const seedNotifications: AppNotification[] = [
  { id: "n1", userId: "u-customer", title: "Đơn của bạn đang giao", message: "Tài xế Anh Hùng đã rời chợ và đang tới nơi.", type: "delivery", isRead: false, createdAt: ts("2024-10-21T08:00:00") },
  { id: "n2", userId: "u-customer", title: "Ưu đãi mới", message: "Giảm 30k cho đơn đầu tiên trong tuần này.", type: "promo", isRead: false, createdAt: ts("2024-10-20T09:00:00") },
  { id: "n3", userId: "u-vendor", title: "Có đơn mới", message: "Bạn có 1 đơn cần xác nhận trong 2 phút.", type: "order", isRead: false, createdAt: ts("2024-10-21T08:05:00") },
];

export const seedCategories: { name: StallCategory; emoji: string }[] = [
  { name: "Cá & Hải sản", emoji: "🐟" },
  { name: "Thịt", emoji: "🥩" },
  { name: "Rau củ", emoji: "🥬" },
  { name: "Trái cây", emoji: "🍎" },
  { name: "Gia vị", emoji: "🌶️" },
  { name: "Đồ khô", emoji: "🍚" },
];
