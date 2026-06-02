export const formatDate = (iso: string): string => {
  try { return new Date(iso).toLocaleDateString("vi-VN"); } catch { return iso; }
};

export const formatDateTime = (iso: string): string => {
  try { return new Date(iso).toLocaleString("vi-VN"); } catch { return iso; }
};

export const formatTime = (iso: string): string => {
  try {
    return new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  } catch { return iso; }
};

export const relativeTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "vừa xong";
  if (min < 60) return `${min} phút trước`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} giờ trước`;
  return formatDate(iso);
};
