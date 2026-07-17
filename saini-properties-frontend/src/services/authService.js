import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api"
});

export const register = (user) =>
    API.post("/auth/register", user);

export const login = (credentials) =>
    API.post("/auth/login", credentials);

export default API;