import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL 
    ? `${import.meta.env.VITE_API_BASE_URL}/auth` 
    : "http://localhost:8080/auth", // Fixed: Added comma and removed trailing backslash
  headers: {
    'Content-Type': 'application/json',
    'bypass-tunnel-reminder': 'true'
  }
});

export const register = (user) => API.post("/register", user);
export const login = (credentials) => API.post("/login", credentials);

export default API;