import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 🌐 Public API (No Token)
 * Use for login, signup, public routes
 */
export const publicAPI = axios.create({
  baseURL: BASE_URL,
  //   withCredentials: true,
});

/**
 * 🔐 Private API (With Token from localStorage)
 */
export const privateAPI = axios.create({
  baseURL: BASE_URL,
  //   withCredentials: true,
});

privateAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

privateAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 👉 OPTIONAL: Refresh token logic (if you have refresh token API)
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) throw new Error("No refresh token");

        const res = await publicAPI.post("/auth/refresh", {
          refreshToken,
        });

        const newToken = res.data.accessToken;

        localStorage.setItem("token", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return privateAPI(originalRequest);
      } catch (err) {
        console.log("api error", err);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
