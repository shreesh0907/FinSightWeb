import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = async (email, password) => {
    const res = await apiRequest("/auth/login", "POST", { email, password });

    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setToken(res.token);
    setUser(res.data.user);

    return res;
  };

  const register = async (name, email, password) => {
    const res = await apiRequest("/auth/register", "POST", {
      name,
      email,
      password,
    });

    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setToken(res.token);
    setUser(res.data.user);

    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);