export type StallCategory =
  | "Cá & Hải sản"
  | "Thịt"
  | "Rau củ"
  | "Trái cây"
  | "Gia vị"
  | "Đồ khô";

export type StallApprovalStatus = "pending" | "approved" | "rejected";

export interface Stall {
  id: string;
  marketId: string;
  name: string;
  ownerName: string;
  category: StallCategory;
  description: string;
  rating: number;
  isOpen: boolean;
  isFollowed: boolean;
  imageUrl?: string;
  cover: string;
  avatar: string;
  yearsInMarket: number;
  badges: string[];
  approvalStatus?: StallApprovalStatus;
  /** @deprecated legacy alias for `ownerName` — kept for not-yet-migrated UI */
  owner?: string;
  /** @deprecated legacy alias for `isOpen` */
  open?: boolean;
  /** @deprecated legacy alias for `description` */
  specialty?: string;
  /** @deprecated legacy alias for `yearsInMarket` */
  yearsActive?: number;
}
