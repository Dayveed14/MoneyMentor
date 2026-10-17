// Small helpers so auth storage lives in one place.
// "Remember me" → localStorage (survives browser restarts)
// otherwise    → sessionStorage (cleared when the tab is closed)

const USER_KEY = "user";
const TOKEN_KEY = "token";

function read(key) {
  try {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function getUser() {
  const raw = read(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null; // corrupted value — treat as logged out
  }
}

export const getToken = () => read(TOKEN_KEY);

export const isAdmin = (user) => user?.role === "admin";

// Lets the rest of the app (navigation, dashboards) react to log in / log out
export const AUTH_EVENT = "mm-auth-change";
const announce = () => window.dispatchEvent(new Event(AUTH_EVENT));

function wipe() {
  [localStorage, sessionStorage].forEach((store) => {
    store.removeItem(USER_KEY);
    store.removeItem(TOKEN_KEY);
  });
}

// True after the user chose to log out (vs. an expired token), so protected
// pages send them home instead of to the login page.
let manualLogout = false;
export const loggedOutManually = () => manualLogout;

export function saveSession(user, token, remember = false) {
  manualLogout = false;
  wipe();
  const store = remember ? localStorage : sessionStorage;
  store.setItem(USER_KEY, JSON.stringify(user));
  store.setItem(TOKEN_KEY, token);
  announce();
}

/** Update the stored user (e.g. after a name change) without touching the token. */
export function updateStoredUser(user) {
  const store = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
  store.setItem(USER_KEY, JSON.stringify(user));
  announce();
}

export function clearSession(manual = false) {
  manualLogout = manual;
  wipe();
  announce();
}
