import axios from "axios";
import { auth } from "@/lib/firebase";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  // remove default Content-Type
});

api.interceptors.request.use(
  async (config) => {
    const user = auth?.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Dynamic content type
    if (config.data instanceof FormData) {
      // Let browser set multipart/form-data with boundary automatically
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;