import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // IMPORTANTE: enviar cookies en cada petición
});

// Variable para evitar múltiples refresh simultáneos
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Request interceptor: agregar token de autorización
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete config.headers["Authorization"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: manejar renovación automática de token
axiosInstance.interceptors.response.use(
  (response) => {
    // Actualizar última actividad en respuestas exitosas
    try {
      localStorage.setItem("habitora-last-activity", String(Date.now()));
    } catch {}
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no es el endpoint de refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/api/auth/refresh" &&
      originalRequest.url !== "/api/auth/login"
    ) {
      if (isRefreshing) {
        // Si ya hay un refresh en proceso, encolar esta petición
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Reintentar con el nuevo token
            const token = useAuthStore.getState().token;
            if (token) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Intentar renovar el token
        const response = await axiosInstance.post("/api/auth/refresh", null, {
          headers: { "X-CSRF-Token": "auto-refresh" },
        });

        const newAccessToken = response.data.accessToken;
        useAuthStore.getState().setToken(newAccessToken);

        // Procesar la cola de peticiones pendientes
        processQueue(null);

        // Reintentar la petición original con el nuevo token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, hacer logout
        processQueue(refreshError);
        useAuthStore.getState().logout();
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;