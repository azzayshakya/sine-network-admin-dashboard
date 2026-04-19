import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 🔐 Attach token automatically
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // ❌ Handle global errors
// API.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/"; // redirect to login
//     }
//     return Promise.reject(err);
//   },
// );

export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

export const getQueries = async () => {
  const res = await API.get("/query");
  return res.data;
};

export const getInterest = async () => {
  const res = await API.get("/interest");
  return res.data;
};

export default API;
