import { getToken, clearSession } from "../utils/auth";

// Base URL of the PHP API (Render). Override with VITE_API_URL in .env.local.
export const API_BASE = (
  import.meta.env.VITE_API_URL || "https://moneymentor-api.onrender.com"
).replace(/\/+$/, "");

/** Build a full URL to a backend path, e.g. apiUrl("api/login.php"). */
export const apiUrl = (path = "") => `${API_BASE}/${path.replace(/^\/+/, "")}`;

/**
 * fetch() wrapper that:
 *  - sends the login token (Authorization: Bearer …) when there is one
 *  - always resolves to parsed JSON, or throws an Error with a readable message
 *  - logs the user out locally if the server says the token is no longer valid
 */
export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };
  if (token && !headers.Authorization) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(apiUrl(path), { ...options, headers });
  } catch {
    throw new Error("Network error. Check your connection and try again.");
  }

  if (response.status === 401 && token) clearSession();

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      response.ok
        ? "The server sent an unexpected response. Please try again."
        : `Server error (${response.status}). Please try again later.`
    );
  }
}

/** POST a JSON body. */
export const apiPost = (path, body) =>
  apiFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
