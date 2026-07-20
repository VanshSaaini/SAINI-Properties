// src/api.js or src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    'Content-Type': 'application/json',
    'bypass-tunnel-reminder': 'true'
  }
});

// Auth endpoints
export const register = (user) => API.post("/auth/register", user);
export const login = (credentials) => API.post("/auth/login", credentials);

// Inquiries endpoint
export const sendInquiry = (inquiryData) => API.post("/api/inquiries", inquiryData);

export default API;