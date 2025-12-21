import axios from "axios";
import { linkedinConfig } from "../config/linkedin";

export const linkedinClient = axios.create({
  baseURL: linkedinConfig.baseURL,
  headers: {
    Authorization: `Bearer ${linkedinConfig.accessToken}`,
    "Linkedin-Version": "202511",
    "X-Restli-Protocol-Version": "2.0.0",
  },
});

// Add request interceptor to log the actual URL being called
linkedinClient.interceptors.request.use(
  (config) => {
    if (config.params && config.url) {
      // Build URL manually to see exact format
      const params = new URLSearchParams();
      Object.entries(config.params).forEach(([key, value]) => {
        params.append(key, String(value));
      });
      const queryString = params.toString();
      const fullUrl = `${config.baseURL}${config.url}?${queryString}`;
      console.log("LinkedIn API Request URL:", fullUrl);
      console.log("Request params:", config.params);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to log errors with full details
linkedinClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("LinkedIn API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          params: error.config?.params,
        },
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error("LinkedIn API No Response:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("LinkedIn API Request Setup Error:", error.message);
    }
    return Promise.reject(error);
  }
);
