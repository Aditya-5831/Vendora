import axios from "axios";

export const apiRequest = axios.create({
    baseURL: process.env.API_URL,
    withCredentials: true
})