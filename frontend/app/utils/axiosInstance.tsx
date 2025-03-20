import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Invalid token format:", (error as Error).message);
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response) {
      console.error(
        "Response Error:",
        error.response.data?.message || "An error occurred"
      );
    } else if (error.request) {
      console.error("No Response from Server:", error.message);
    } else {
      console.error("Unexpected Error:", error.message);
    }

    // Provide a cleaner error to the frontend
    return Promise.reject(
      error.response?.data?.message || "Something went wrong, please try again."
    );
  }
);

export default axiosInstance;
