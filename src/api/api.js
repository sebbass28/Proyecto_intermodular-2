import axios from "axios";

const api = axios.create({
  baseURL: "https://backend2-7u6r.onrender.com/api", // tu backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export default api;
