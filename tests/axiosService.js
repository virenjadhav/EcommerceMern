const axios = require("axios");

const BASE_URL = process.env.BACKEND_URL || `http://localhost:5000`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lies within 2xx causes this function to trigger
    //   return response.data; // Return only the data part of the response
    return response;
  },
  (error) => {
    // Any status codes outside 2xx cause this function to trigger
    if (error.response) {
      // The request was made and the server responded with a status code
      const err = new Error(error.response.data.message || "Request failed");
      err.status = error.response.status;
      err.data = error.response.data;
      throw err;
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response received from server");
    } else {
      // Something happened in setting up the request
      throw new Error("Error setting up request: " + error.message);
    }
  }
);

// Service methods
const axiosService = {
  get: async (url, config = {}) => {
    try {
      return await axiosInstance.get(url, config);
    } catch (error) {
      console.error("GET Request Error:", error.message);
      throw error;
    }
  },

  post: async (url, data, config = {}) => {
    try {
      return await axiosInstance.post(url, data, config);
    } catch (error) {
      console.error("POST Request Error:", error.message);
      throw error;
    }
  },

  put: async (url, data, config = {}) => {
    try {
      return await axiosInstance.put(url, data, config);
    } catch (error) {
      console.error("PUT Request Error:", error.message);
      throw error;
    }
  },

  delete: async (url, config = {}) => {
    try {
      return await axiosInstance.delete(url, config);
    } catch (error) {
      console.error("DELETE Request Error:", error.message);
      throw error;
    }
  },
};

module.exports = axiosService;
