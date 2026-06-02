export const isValidPhone = (phone: string): boolean => /^0\d{8,10}$/.test(phone.trim());

export const isValidOtp = (code: string): boolean => /^\d{4,6}$/.test(code.trim());

export const isValidPrice = (price: number): boolean => Number.isFinite(price) && price > 0;

export const isNonEmpty = (s: string | undefined | null): boolean => !!s && s.trim().length > 0;
