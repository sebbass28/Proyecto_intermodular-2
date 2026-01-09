import { create } from "zustand";
import api from "../api/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  tempToken: null,
  is2FARequired: false,

  // Acción de Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.data.require2FA) {
        set({
          tempToken: res.data.tempToken,
          is2FARequired: true,
          loading: false,
        });
        return { require2FA: true };
      }

      set({ user: res.data.user, token: res.data.token, loading: false });
      localStorage.setItem("token", res.data.token);
      if (res.data.sessionId)
        localStorage.setItem("current_session_id", res.data.sessionId);
      return { success: true };
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error al iniciar sesión",
        loading: false,
      });
      return { success: false, error: err.response?.data?.error };
    }
  },

  verifyLogin2FA: async (code) => {
    const tempToken = get().tempToken;
    set({ loading: true, error: null });

    try {
      const res = await api.post("/auth/2fa/verify-login", { tempToken, code });

      set({
        user: res.data.user,
        token: res.data.token,
        tempToken: null,
        is2FARequired: false,
        loading: false,
      });
      localStorage.setItem("token", res.data.token);
      if (res.data.sessionId)
        localStorage.setItem("current_session_id", res.data.sessionId);
      return { success: true };
    } catch (err) {
      set({
        error: err.response?.data?.error || "Código incorrecto",
        loading: false,
      });
      return { success: false, error: err.response?.data?.error };
    }
  },

  // Acción de Logout
  logout: async () => {
    try {
      // Intentar cerrar en backend también para borrar sesión
      const token = localStorage.getItem("token"); // Note: usually refresh token is needed but simple logout cleans local
      // For backend we would likely need refresh token from somewhere if we store it.
      // Ignoring backend call failure to ensure UI logout.
      await api
        .post("/auth/logout", { refreshToken: "placeholder" })
        .catch(() => {});
    } catch (e) {}

    localStorage.removeItem("token");
    localStorage.removeItem("current_session_id");
    set({ user: null, token: null, tempToken: null, is2FARequired: false });
  },

  // 2FA Management
  setup2FA: async () => {
    try {
      const res = await api.post("/auth/2fa/setup");
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  confirm2FA: async (code) => {
    try {
      const res = await api.post("/auth/2fa/confirm", { code });
      // Update local user state
      set((state) => ({
        user: { ...state.user, two_factor_enabled: true },
      }));
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  disable2FA: async () => {
    try {
      await api.post("/auth/2fa/disable");
      set((state) => ({
        user: { ...state.user, two_factor_enabled: false },
      }));
      return true;
    } catch (err) {
      throw err;
    }
  },

  // Sessions Management
  getSessions: async () => {
    try {
      const res = await api.get("/auth/sessions");
      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  revokeSession: async (sessionId) => {
    try {
      await api.delete(`/auth/sessions/${sessionId}`);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  // Cambiar contraseña
  changePassword: async (currentPassword, newPassword) => {
    try {
      const token = get().token;
      await api.post(
        "/auth/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true };
    } catch (error) {
      console.error("Change password error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Error al cambiar la contraseña",
      };
    }
  },

  // Acción de registro
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/register", userData);
      set({ user: res.data.user, token: res.data.token, loading: false });
      localStorage.setItem("token", res.data.token);
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
    set({ user: null, token: null });
  },

  // Intentar login automático si hay token
  tryAutoLogin: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    set({ loading: true });
    try {
      // Ajusta este endpoint según el backend
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
        error:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Error al enviar el correo",
        loading: false,
      });
      return false;
    }
  },

  // Acción para confirmar nueva contraseña
  confirmPasswordReset: async (token, newPassword) => {
    set({ loading: true, error: null });
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      set({ loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error al restablecer contraseña",
        loading: false,
      });
      return false;
    }
  },

  // Acción para subir avatar
  uploadAvatar: async (formData) => {
    set({ loading: true, error: null });
    try {
      // Necesitamos configurar el header para multipart/form-data
      const res = await api.post("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Actualizamos el usuario con la nueva info (que incluirá avatar_url)
      set((state) => ({
        user: { ...state.user, ...res.data.user },
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error al subir la imagen",
        loading: false,
      });
      return false;
    }
  },
  // Acción para actualizar perfil completo
  deleteAccount: async () => {
    set({ loading: true, error: null });
    try {
      await api.delete("/users/me");
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error al eliminar cuenta",
        loading: false,
      });
      return false;
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    const currentUser = get().user;
    if (!currentUser) return false;

    try {
      const res = await api.put(`/users/${currentUser.id}`, profileData);
      set((state) => ({
        user: { ...state.user, ...res.data.user },
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error al actualizar perfil",
        loading: false,
      });
      return false;
    }
  },
}));
