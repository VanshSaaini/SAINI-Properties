import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Authentication
export const register = (user) => API.post("/auth/register", user);
export const login = (credentials) => API.post("/auth/login", credentials);

// Inquiry
export const sendInquiry = (data) => API.post("/api/inquiries", data);

export default API;