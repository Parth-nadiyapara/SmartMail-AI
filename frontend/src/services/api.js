/**
 * Centralized API client for SmartMail AI.
 *
 * Every request to the Node.js backend goes through here so that:
 * - the base URL lives in one place (VITE_API_URL)
 * - credentials: "include" is never forgotten (session-cookie auth)
 * - the backend's consistent { success, message, data, timestamp }
 *   envelope is unwrapped in one place
 * - backend error messages/status codes are normalized into a
 *   single ApiError shape the UI can branch on
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (networkError) {
    throw new ApiError(
      "Can't reach the SmartMail AI server. Check your connection and try again.",
      0,
      "NETWORK_ERROR"
    );
  }

  let body = null;

  try {
    body = await response.json();
  } catch {
    // Non-JSON response (e.g. a proxy error page). Fall through
    // and let the status-based branches below build a message.
  }

  if (!response.ok) {
    const message =
      body?.message ||
      (response.status === 401
        ? "Your Google session has expired. Please sign in again."
        : response.status === 404
        ? "That resource couldn't be found."
        : response.status === 429
        ? "Daily AI limit reached."
        : response.status >= 500
        ? "Something went wrong on our end. Please try again."
        : "Something went wrong.");

    throw new ApiError(message, response.status, body?.code);
  }

  // Backend envelope: { success, message, data, timestamp }
  return body?.data ?? null;
}

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, payload) =>
    request(path, {
      method: "POST",
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
    }),
};
