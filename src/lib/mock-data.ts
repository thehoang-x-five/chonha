export type Category = "Cá & Hải sản" | "Thịt" | "Rau củ" | "Trái cây" | "Gia vị" | "Đồ khô";

export interface Market {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  deliveryFeeFrom: number;
  status: "open" | "closing" | "closed";
  rating: number;
  openingHours: string;
  stallCount: number;
  cover: string;
}

export interface Stall {
  id: string;
  marketId: string;
  name: string;
  owner: string;
  specialty: string;
  rating: number;
  yearsActive: number;
  category: Category;
  open: boolean;
  cover: string;
  avatar: string;
  badges: string[];
}

export interface Product {
  id: string;
  stallId: string;
  name: string;
  price: number;
  unit: string;
  category: Category;
  image: string;
  inStock: boolean;
  freshNote?: string;
  prepOptions?: string[];
}

export interface Order {
  id: string;
  code: string;
  customer: string;
  customerPhone: string;
  address: string;
  marketId: string;
  items: { productId: string; stallId: string; qty: number; note?: string }[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  status: "confirmed" | "preparing" | "finding_driver" | "picking" | "delivering" | "completed" | "cancelled";
  createdAt: string;
  driverId?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  rating: number;
  trips: number;
  online: boolean;
  area: string;
  avatar: string;
}

export const markets: Market[] = [
  { id: "m1", name: "Chợ Tân Mỹ", address: "Đường số 17, Tân Phú, Quận 7", distanceKm: 1.2, deliveryFeeFrom: 18000, status: "open", rating: 4.8, openingHours: "5:00 – 19:00", stallCount: 86, cover: "🏪" },
  { id: "m2", name: "Chợ Phước Long", address: "Phước Long B, Quận 7", distanceKm: 2.7, deliveryFeeFrom: 22000, status: "open", rating: 4.6, openingHours: "5:30 – 18:30", stallCount: 64, cover: "🏬" },
  { id: "m3", name: "Chợ Tân Quy", address: "Tân Quy, Quận 7", distanceKm: 3.1, deliveryFeeFrom: 25000, status: "closing", rating: 4.5, openingHours: "5:00 – 17:00", stallCount: 52, cover: "🛖" },
];

export const stalls: Stall[] = [
  { id: "s1", marketId: "m1", name: "Sạp Cá Cô Lan", owner: "Cô Lan", specialty: "Cá biển & hải sản tươi", rating: 4.9, yearsActive: 18, category: "Cá & Hải sản", open: true, cover: "🐟", avatar: "👩‍🦳", badges: ["Đồ tươi sáng nay", "Sơ chế miễn phí", "Được yêu thích"] },
  { id: "s2", marketId: "m1", name: "Sạp Rau Dì Hoa", owner: "Dì Hoa", specialty: "Rau sạch mỗi sáng", rating: 4.8, yearsActive: 12, category: "Rau củ", open: true, cover: "🥬", avatar: "👩", badges: ["Rau sạch", "Giao nhanh"] },
  { id: "s3", marketId: "m1", name: "Sạp Thịt Chú Minh", owner: "Chú Minh", specialty: "Thịt heo tươi mỗi sáng", rating: 4.7, yearsActive: 22, category: "Thịt", open: true, cover: "🥩", avatar: "👨‍🦳", badges: ["Thịt nóng", "Heo nuôi sạch"] },
  { id: "s4", marketId: "m1", name: "Trái Cây Cô Hạnh", owner: "Cô Hạnh", specialty: "Trái cây theo mùa", rating: 4.9, yearsActive: 9, category: "Trái cây", open: true, cover: "🍎", avatar: "👩", badges: ["Trái cây mùa"] },
  { id: "s5", marketId: "m2", name: "Sạp Hải Sản Anh Tư", owner: "Anh Tư", specialty: "Tôm cua sống", rating: 4.6, yearsActive: 7, category: "Cá & Hải sản", open: true, cover: "🦐", avatar: "👨", badges: ["Sống bơi"] },
  { id: "s6", marketId: "m2", name: "Gia Vị Bà Sáu", owner: "Bà Sáu", specialty: "Gia vị truyền thống", rating: 4.7, yearsActive: 30, category: "Gia vị", open: true, cover: "🌶️", avatar: "👵", badges: ["Lâu năm"] },
  { id: "s7", marketId: "m3", name: "Sạp Rau Cô Bảy", owner: "Cô Bảy", specialty: "Rau Đà Lạt", rating: 4.5, yearsActive: 15, category: "Rau củ", open: true, cover: "🥕", avatar: "👩", badges: ["Rau Đà Lạt"] },
  { id: "s8", marketId: "m3", name: "Đồ Khô Chú Tâm", owner: "Chú Tâm", specialty: "Đồ khô, mắm muối", rating: 4.4, yearsActive: 20, category: "Đồ khô", open: false, cover: "🍚", avatar: "👨", badges: [] },
];

export const products: Product[] = [
  // Stall 1 - Cá Cô Lan
  { id: "p1", stallId: "s1", name: "Cá thu tươi", price: 145000, unit: "kg", category: "Cá & Hải sản", image: "🐟", inStock: true, freshNote: "Hàng về lúc 5:30 sáng hôm nay", prepOptions: ["Để nguyên con", "Làm sạch", "Cắt khúc", "Bỏ đầu"] },
  { id: "p2", stallId: "s1", name: "Cá diêu hồng", price: 72000, unit: "kg", category: "Cá & Hải sản", image: "🐠", inStock: true, freshNote: "Cá sống", prepOptions: ["Để nguyên con", "Làm sạch", "Cắt khúc"] },
  { id: "p3", stallId: "s1", name: "Tôm sú loại 1", price: 260000, unit: "kg", category: "Cá & Hải sản", image: "🦐", inStock: true, freshNote: "Tôm sống", prepOptions: ["Để nguyên", "Bóc vỏ"] },
  { id: "p4", stallId: "s1", name: "Mực ống tươi", price: 210000, unit: "kg", category: "Cá & Hải sản", image: "🦑", inStock: true, prepOptions: ["Để nguyên", "Làm sạch"] },
  { id: "p5", stallId: "s1", name: "Cá basa cắt khúc", price: 85000, unit: "kg", category: "Cá & Hải sản", image: "🐟", inStock: true },
  // Stall 2 - Rau Dì Hoa
  { id: "p6", stallId: "s2", name: "Rau muống", price: 12000, unit: "bó", category: "Rau củ", image: "🥬", inStock: true },
  { id: "p7", stallId: "s2", name: "Cải ngọt", price: 15000, unit: "bó", category: "Rau củ", image: "🥬", inStock: true },
  { id: "p8", stallId: "s2", name: "Cà chua", price: 25000, unit: "kg", category: "Rau củ", image: "🍅", inStock: true },
  { id: "p9", stallId: "s2", name: "Hành lá", price: 8000, unit: "bó", category: "Rau củ", image: "🌿", inStock: true },
  { id: "p10", stallId: "s2", name: "Xà lách", price: 20000, unit: "kg", category: "Rau củ", image: "🥗", inStock: true },
  // Stall 3 - Thịt Chú Minh
  { id: "p11", stallId: "s3", name: "Ba chỉ heo", price: 175000, unit: "kg", category: "Thịt", image: "🥓", inStock: true },
  { id: "p12", stallId: "s3", name: "Sườn non", price: 195000, unit: "kg", category: "Thịt", image: "🍖", inStock: true },
  { id: "p13", stallId: "s3", name: "Thịt nạc vai", price: 165000, unit: "kg", category: "Thịt", image: "🥩", inStock: true },
  { id: "p14", stallId: "s3", name: "Xương ống", price: 90000, unit: "kg", category: "Thịt", image: "🦴", inStock: false },
  // Stall 4 - Trái Cây Cô Hạnh
  { id: "p15", stallId: "s4", name: "Xoài cát Hoà Lộc", price: 65000, unit: "kg", category: "Trái cây", image: "🥭", inStock: true },
  { id: "p16", stallId: "s4", name: "Cam sành", price: 38000, unit: "kg", category: "Trái cây", image: "🍊", inStock: true },
  { id: "p17", stallId: "s4", name: "Chuối già", price: 22000, unit: "kg", category: "Trái cây", image: "🍌", inStock: true },
  { id: "p18", stallId: "s4", name: "Dưa hấu", price: 18000, unit: "kg", category: "Trái cây", image: "🍉", inStock: true },
  // Stall 5
  { id: "p19", stallId: "s5", name: "Cua biển sống", price: 380000, unit: "kg", category: "Cá & Hải sản", image: "🦀", inStock: true },
  { id: "p20", stallId: "s5", name: "Tôm thẻ", price: 180000, unit: "kg", category: "Cá & Hải sản", image: "🦐", inStock: true },
  // Stall 6
  { id: "p21", stallId: "s6", name: "Ớt hiểm", price: 60000, unit: "kg", category: "Gia vị", image: "🌶️", inStock: true },
  { id: "p22", stallId: "s6", name: "Tỏi", price: 70000, unit: "kg", category: "Gia vị", image: "🧄", inStock: true },
  // Stall 7
  { id: "p23", stallId: "s7", name: "Cà rốt Đà Lạt", price: 28000, unit: "kg", category: "Rau củ", image: "🥕", inStock: true },
  { id: "p24", stallId: "s7", name: "Khoai tây", price: 32000, unit: "kg", category: "Rau củ", image: "🥔", inStock: true },
  // Stall 8
  { id: "p25", stallId: "s8", name: "Nước mắm Phú Quốc", price: 95000, unit: "chai", category: "Đồ khô", image: "🍶", inStock: false },
];

export const orders: Order[] = [
  { id: "o1", code: "CNM-2410001", customer: "Chị Mai", customerPhone: "0909123456", address: "112 Nguyễn Thị Thập, Q.7", marketId: "m1",
    items: [{ productId: "p1", stallId: "s1", qty: 1 }, { productId: "p6", stallId: "s2", qty: 2 }],
    subtotal: 169000, deliveryFee: 18000, serviceFee: 5000, total: 192000, status: "delivering", createdAt: "2024-10-21T07:30:00", driverId: "d1" },
  { id: "o2", code: "CNM-2410002", customer: "Anh Tuấn", customerPhone: "0912345678", address: "Sunrise City, Q.7", marketId: "m1",
    items: [{ productId: "p11", stallId: "s3", qty: 0.5 }], subtotal: 87500, deliveryFee: 18000, serviceFee: 5000, total: 110500, status: "preparing", createdAt: "2024-10-21T08:00:00" },
  { id: "o3", code: "CNM-2410003", customer: "Cô Hương", customerPhone: "0938112233", address: "Phú Mỹ Hưng, Q.7", marketId: "m2",
    items: [{ productId: "p19", stallId: "s5", qty: 1 }], subtotal: 380000, deliveryFee: 22000, serviceFee: 5000, total: 407000, status: "completed", createdAt: "2024-10-20T16:00:00" },
  { id: "o4", code: "CNM-2410004", customer: "Anh Hải", customerPhone: "0901999888", address: "Riverside, Q.7", marketId: "m1",
    items: [{ productId: "p3", stallId: "s1", qty: 0.5 }, { productId: "p8", stallId: "s2", qty: 1 }, { productId: "p12", stallId: "s3", qty: 1 }],
    subtotal: 350000, deliveryFee: 18000, serviceFee: 5000, total: 373000, status: "finding_driver", createdAt: "2024-10-21T08:15:00" },
  { id: "o5", code: "CNM-2410005", customer: "Chị Linh", customerPhone: "0977222111", address: "Era Town, Q.7", marketId: "m1",
    items: [{ productId: "p15", stallId: "s4", qty: 2 }], subtotal: 130000, deliveryFee: 18000, serviceFee: 5000, total: 153000, status: "confirmed", createdAt: "2024-10-21T08:20:00" },
  { id: "o6", code: "CNM-2409999", customer: "Anh Phúc", customerPhone: "0933444555", address: "Hoàng Anh Gia Lai, Q.7", marketId: "m2",
    items: [{ productId: "p20", stallId: "s5", qty: 1 }], subtotal: 180000, deliveryFee: 22000, serviceFee: 5000, total: 207000, status: "cancelled", createdAt: "2024-10-19T11:00:00" },
];

export const drivers: Driver[] = [
  { id: "d1", name: "Anh Hùng", phone: "0908111222", vehicle: "Honda Wave", plate: "59X2-123.45", rating: 4.9, trips: 1280, online: true, area: "Quận 7", avatar: "👨" },
  { id: "d2", name: "Anh Quân", phone: "0908333444", vehicle: "Yamaha Sirius", plate: "59X1-987.65", rating: 4.8, trips: 980, online: true, area: "Quận 7", avatar: "👨" },
  { id: "d3", name: "Anh Bình", phone: "0908555666", vehicle: "Honda Vision", plate: "59X3-555.66", rating: 4.7, trips: 760, online: false, area: "Quận 7", avatar: "👨" },
  { id: "d4", name: "Chị Hà", phone: "0908777888", vehicle: "Honda Lead", plate: "59X4-777.88", rating: 4.9, trips: 1450, online: true, area: "Quận 4", avatar: "👩" },
  { id: "d5", name: "Anh Sơn", phone: "0908999000", vehicle: "Yamaha Janus", plate: "59X5-111.22", rating: 4.6, trips: 540, online: false, area: "Quận 7", avatar: "👨" },
];

export const categories: { name: Category; emoji: string }[] = [
  { name: "Cá & Hải sản", emoji: "🐟" },
  { name: "Thịt", emoji: "🥩" },
  { name: "Rau củ", emoji: "🥬" },
  { name: "Trái cây", emoji: "🍎" },
  { name: "Gia vị", emoji: "🌶️" },
  { name: "Đồ khô", emoji: "🍚" },
];

export const formatVnd = (n: number) => `${n.toLocaleString("vi-VN")} đ`;

export const getStall = (id: string) => stalls.find(s => s.id === id);
export const getMarket = (id: string) => markets.find(m => m.id === id);
export const getProduct = (id: string) => products.find(p => p.id === id);
export const getDriver = (id?: string) => drivers.find(d => d.id === id);
export const getProductsByStall = (stallId: string) => products.filter(p => p.stallId === stallId);
export const getStallsByMarket = (marketId: string) => stalls.filter(s => s.marketId === marketId);
