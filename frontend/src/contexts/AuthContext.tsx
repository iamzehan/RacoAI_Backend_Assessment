import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { api, type User } from "../api";

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: async () => ({ userId: "", email: "" }),
  logout: async () => undefined,
  setUser: () => undefined
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    JSON.parse(localStorage.getItem("raco_user") ?? "null")
  );

  const value = useMemo(
    () => ({
      user,
      setUser: (next: User | null) => {
        if (next) localStorage.setItem("raco_user", JSON.stringify(next));
        else localStorage.removeItem("raco_user");
        setUser(next);
      },
      login: async (email: string, password: string) => {
        const result = await api.login(email, password);
        if (result.accessToken) {
          localStorage.setItem("raco_access_token", result.accessToken);
        }
        const nextUser: User = {
          userId: result.userId,
          email: result.email,
          role: result.role
        };
        localStorage.setItem("raco_user", JSON.stringify(nextUser));
        setUser(nextUser);
        return nextUser;
      },
      logout: async () => {
        void api.logout();
        localStorage.removeItem("raco_access_token");
        localStorage.removeItem("raco_user");
        setUser(null);
      }
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
