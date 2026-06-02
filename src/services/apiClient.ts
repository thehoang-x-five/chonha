// Mock API client. Same surface as a real fetch/axios wrapper so the only
// future swap is the body of these methods.
//
// TODO(real backend): point baseURL at the deployed API gateway and replace
// the mock implementations with real fetch() calls. The service-layer
// signatures and the rest of the app stay unchanged.

export const API_BASE_URL = "/api"; // TODO: replace with real baseURL

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status = 500, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "ApiError";
  }
}

const wait = (ms = 200) => new Promise((r) => setTimeout(r, ms));
const delay = () => wait(150 + Math.random() * 250);

type Handler<TInput, TOutput> = (path: string, body?: TInput) => Promise<TOutput>;

// Registry pattern: services register their mock responders here.
// When migrating to a real backend, delete the registry and have each
// method below issue a real fetch().
type RouteKey = `${"GET" | "POST" | "PUT" | "PATCH" | "DELETE"} ${string}`;
const handlers = new Map<RouteKey, Handler<unknown, unknown>>();

export const registerMock = <TInput = unknown, TOutput = unknown>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  pattern: string,
  handler: Handler<TInput, TOutput>,
) => {
  handlers.set(`${method} ${pattern}` as RouteKey, handler as Handler<unknown, unknown>);
};

const match = (method: string, path: string) => {
  for (const [key, handler] of handlers) {
    const [m, pattern] = key.split(" ");
    if (m !== method) continue;
    const re = new RegExp("^" + pattern.replace(/:[a-zA-Z]+/g, "([^/]+)") + "$");
    const matched = path.match(re);
    if (matched) return { handler, params: matched.slice(1) };
  }
  return null;
};

async function call<T>(method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", path: string, body?: unknown): Promise<T> {
  await delay();
  const found = match(method, path);
  if (!found) throw new ApiError(`No mock handler for ${method} ${path}`, 404, "MOCK_NOT_FOUND");
  try {
    return (await found.handler(path, body)) as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    const msg = e instanceof Error ? e.message : "Lỗi không xác định";
    throw new ApiError(msg, 500);
  }
}

export const apiClient = {
  get: <T>(path: string) => call<T>("GET", path),
  post: <T>(path: string, body?: unknown) => call<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => call<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => call<T>("PATCH", path, body),
  delete: <T>(path: string) => call<T>("DELETE", path),
};
