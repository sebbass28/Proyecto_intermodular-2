import { create } from "zustand";
import api from "../api/api";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  // REGISTER
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/register", userData);
      const { token, user } = res.data;
      set({ user, token, loading: false });
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
    } catch (err) {
      set({
        error:
          err.response?.data?.error ||
          err.response?.data?.errors ||
          err.message,
        loading: false,
      });
      throw err;
    }
  },

  // RESET PASSWORD
  resetPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await api.post("/auth/forgot-password", { email });
      set({ loading: false });
      return true; // Success
    } catch (err) {
      set({
        error: err.response?.data?.errors || err.message,
        loading: false,
      });
      return false;
    }
  },

  // LOGIN
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;
      set({ user, token, loading: false });
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
    } catch (err) {
      set({
        error: err.response?.data?.error || err.response?.data?.errors || err.message,
        loading: false,
      });
      throw err;
    }
  },

  // LOGOUT
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },

  // AUTO-LOGIN
  tryAutoLogin: () => {
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("auth_user");
    if (token && user) {
      set({ token, user: JSON.parse(user) });
    }
  },
}));
