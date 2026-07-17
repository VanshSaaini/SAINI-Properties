import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/auth" // Must strictly align with your @RequestMapping
});

export const register = (user) => API.post("/register", user);
export const login = (credentials) => API.post("/login", credentials);

export default API;