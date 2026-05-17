import axios, { AxiosInstance } from "axios";

export const axiosPublic: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TOURISM_URL,
});

axiosPublic.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // If we don't have config or we've already retried 5 times, reject the error
    if (!config || (config._retryCount && config._retryCount >= 5)) {
      return Promise.reject(error);
    }

    // Initialize retry count if it doesn't exist
    config._retryCount = config._retryCount || 0;

    // Check if error is network error or 5xx server error (Render cold start usually returns 502/503/504 or network error)
    const isNetworkError = !error.response;
    const isServerError = error.response && error.response.status >= 500;

    if (isNetworkError || isServerError) {
      config._retryCount += 1;

      // Exponential backoff or static delay. Render can take ~50s to wake up.
      // 5 retries with 10s delay each = 50s total waiting time max.
      const delay = 10000;

      console.log(`Render cold start likely. Retry attempt ${config._retryCount} after ${delay}ms...`);

      await new Promise((resolve) => setTimeout(resolve, delay));

      return axiosPublic(config);
    }

    return Promise.reject(error);
  }
);

const useAxiosPublic = (): AxiosInstance => {
  return axiosPublic;
};

export default useAxiosPublic;
