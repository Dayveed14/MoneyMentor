import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiFetch } from "../config/api";
import { AUTH_EVENT, clearSession, getToken, getUser, isAdmin, saveSession } from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser);

  // Stay in sync with log in / log out anywhere (this tab or another tab)
  useEffect(() => {
    const sync = () => setUser(getUser());
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // On first load, confirm a saved login is still valid and refresh name/role
  useEffect(() => {
    if (!getToken()) return;
    apiFetch("api/me.php")
      .then((res) => {
        if (res.success && res.user) {
          const stored = getUser();
          if (!stored || stored.name !== res.user.name || stored.role !== res.user.role) {
            saveSession(res.user, getToken(), Boolean(localStorage.getItem("token")));
          }
        }
      })
      .catch(() => {}); // offline or server asleep: keep the local session for now
  }, []);

  const login = useCallback((u, token, remember) => saveSession(u, token, remember), []);
  const logout = useCallback(() => clearSession(true), []);

  return (
    <AuthContext.Provider value={{ user, isAdmin: isAdmin(user), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
