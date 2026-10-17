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

export function saveSession(user, token, remember = false) {
  clearSession();
  const store = remember ? localStorage : sessionStorage;
  store.setItem(USER_KEY, JSON.stringify(user));
  store.setItem(TOKEN_KEY, token);
}

export function clearSession() {
  [localStorage, sessionStorage].forEach((store) => {
    store.removeItem(USER_KEY);
    store.removeItem(TOKEN_KEY);
  });
}
