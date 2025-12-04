import { create } from "zustand";
import api from "../api/api";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  // Acción de registro
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/register", userData);
      set({ user: res.data.user, token: res.data.token, loading: false });
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      set({
        error: err.response?.data?.error || err.response?.data?.errors || err.message,
        loading: false,
      });
      throw err;
    }
  },

  // Acción de login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/login", { email, password });
      set({ user: res.data.user, token: res.data.token, loading: false });
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      set({
        error: err.response?.data?.error || err.response?.data?.message || "Error al iniciar sesión",
        loading: false,
      });
      throw err;
    }
  },

  // Acción para cerrar sesión
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  // Intentar login automático si hay token
  tryAutoLogin: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    set({ loading: true });
    try {
      // Ajusta este endpoint según tu backend (ej: /auth/me o /auth/profile)
      const res = await api.get("/auth/me");
      set({ user: res.data, token, loading: false });
    } catch (err) {
      console.error("Token inválido o expirado", err);
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false });
    }
  },

  // Acción de recuperación de contraseña
  resetPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await api.post("/auth/forgot-password", { email });
      set({ loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error al enviar el correo",
        loading: false,
      });
      return false;
    }
  },
}));
