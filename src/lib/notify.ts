import { toast } from "sonner";
import { FEATURE_COMING_SOON_TOAST } from "./constants";

/** For buttons that aren't wired to a real action yet. */
export const notifyTodo = (label?: string) =>
  toast(label ? `${label}: ${FEATURE_COMING_SOON_TOAST}` : FEATURE_COMING_SOON_TOAST);

export const notifySuccess = (msg: string, description?: string) =>
  toast.success(msg, description ? { description } : undefined);

export const notifyError = (msg: string) => toast.error(msg);
