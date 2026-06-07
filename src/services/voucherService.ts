import { mockVouchers } from "@/mocks/mockVouchers";
import type { Voucher } from "@/types/voucher.types";

const wait = (ms = 120) => new Promise((r) => setTimeout(r, ms));

let store: Voucher[] = mockVouchers.map((v) => ({ ...v }));

export const voucherService = {
  async list(): Promise<Voucher[]> {
    await wait();
    return store.map((v) => ({ ...v }));
  },
  async validate(code: string): Promise<Voucher> {
    await wait();
    const v = store.find(
      (x) => x.code.toLowerCase() === code.trim().toLowerCase() && x.status === "available",
    );
    if (!v) throw new Error("Mã khuyến mãi không hợp lệ hoặc đã hết hạn");
    return v;
  },
  async create(input: Omit<Voucher, "id">): Promise<Voucher> {
    await wait();
    const v: Voucher = { ...input, id: `v-${Date.now()}` };
    store = [v, ...store];
    return v;
  },
  async setStatus(id: string, status: Voucher["status"]): Promise<Voucher> {
    await wait();
    const v = store.find((x) => x.id === id);
    if (!v) throw new Error("Không tìm thấy voucher");
    v.status = status;
    return v;
  },
};
