import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import apiClient from "../services/api";

export const useAuth = () => {
  const { isLoggedIn, user, logout, setUser, setTokens } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    useAuthStore.getState().hydrateFromStorage();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const { accessToken, refreshToken, user } = response.data;

      setTokens(accessToken, refreshToken);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, user };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => {
    try {
      const response = await apiClient.post("/auth/register", {
        name,
        email,
        password,
        phone,
      });
      const { accessToken, refreshToken, user } = response.data;

      setTokens(accessToken, refreshToken);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, user };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAdmin = () => {
    return isLoggedIn && user?.roles.includes("admin");
  };

  return {
    isLoggedIn,
    user,
    login,
    register,
    logout: handleLogout,
    isAdmin,
  };
};
