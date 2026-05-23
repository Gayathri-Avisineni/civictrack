import axios from "axios";

const API = axios.create({
  baseURL: "https://civictrack-mlhg.onrender.com/api/",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("SENDING TOKEN:", token); // 👈 add this

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;