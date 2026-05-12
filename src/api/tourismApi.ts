import { axiosPublic } from "@/hooks/useAxiosPublic";

/**
 * Tourism API Service
 * Centralized place for all tourism-related API calls.
 */

// Helper to simulate network delay for testing loading states (optional)
const withDelay = <T>(promise: Promise<T>, ms: number = 1000): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      promise.then(resolve).catch(reject);
    }, ms);
  });
};

export const tourismApi = {
  /**
   * Fetch all popular destinations
   */
  getPopularDestinations: async () => {
    const response = await axiosPublic.get(
      "/api/popular-dest/get-popular-dest-list",
    );
    return response.data?.list_data;
  },

  /**
   * Fetch all tour packages
   */
  getTourPackages: async () => {
    const response = await axiosPublic.get(
      "/api/package-dest/get-package-list",
    );
    return response.data?.list_data;
  },

  /**
   * Fetch all travel blogs
   */
  getTravelBlogs: async () => {
    const response = await axiosPublic.get("/api/tourism/get-blog-list");
    return response.data?.list_data;
  },

  /**
   * Fetch all customer reviews
   */
  getReviewList: async () => {
    const response = await axiosPublic.get("/api/tourism/get-review-list");
    return response.data?.list_data;
  },
};

export default tourismApi;
