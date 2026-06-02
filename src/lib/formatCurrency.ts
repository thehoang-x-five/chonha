export const formatCurrency = (amount: number): string =>
  `${amount.toLocaleString("vi-VN")} đ`;

export const formatCurrencyShort = (amount: number): string => {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}tr`;
  if (amount >= 1_000) return `${Math.round(amount / 1_000)}k`;
  return String(amount);
};
