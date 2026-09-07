import { api, API_BASE_URL } from "./api";

/**
 * Sends the browser to the backend's Google OAuth entry point.
 * The backend owns the entire OAuth handshake; React never touches
 * Google client IDs, secrets, or tokens.
 */
export function redirectToGoogleLogin() {
  window.location.href = `${API_BASE_URL}/api/v1/auth/google`;
}

/**
 * Returns the authenticated user, or null if there is no active session.
 * A 401 is an expected, non-error outcome here (logged out), not a
 * failure to surface to the UI.
 */
export async function getCurrentUser() {
  try {
    return await api.get("/api/v1/auth/me");
  } catch (error) {
    if (error.status === 401) return null;
    throw error;
  }
}

export async function logout() {
  return api.post("/api/v1/auth/logout");
}
