import axios from "axios";

const BaseURL = import.meta.env.VITE_BACKEND_URL   || "http://localhost:5000/api/v1";
// const BaseURL = "http://localhost:5000/api/v1";

const axiosService = axios.create({
  baseURL: BaseURL,
  withCredentials: true,
  timeout: 10000, // timeout (ms)
  headers: {
    "Content-Type": "application/json",
    // allow cross origin site]
  },
});

// add token to request by interceptors
axiosService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// handle response by interceptors
axiosService.interceptors.response.use(
  (response) => {
    return response.data; // only return data from response (not the full response)
  },
  (error) => {
    if (error.response?.status === 401) {
      // window.location.href = "/auth/login"; // redirect to login page if user is not authenticate
    }
    return Promise.reject(error);
  }
);

export default axiosService;
