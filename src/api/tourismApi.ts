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
      "/api/tourism/get-popular-dest-list",
    );
    return response.data?.list_data;
  },

  /**
   * Fetch all tour packages
   */
  getTourPackages: async () => {
    const response = await axiosPublic.get("/api/tourism/get-package-list");
    return response.data?.list_data;
  },

  /**
   * Fetch package/destination details by ID
   */
  getPackageDetails: async (id: string | number) => {
    const response = await axiosPublic.get(
      `/api/tourism/get-package-list/${id}`,
    );
    return response.data?.details_data;
  },

  /**
   * Fetch destination details by ID
   */
  getDestinationDetails: async (id: string | number) => {
    const response = await axiosPublic.get(
      `/api/tourism/get-popular-dest-list/${id}`,
    );
    return response.data?.details_data;
  },

  /**
   * Fetch all travel blogs
   */
  getTravelBlogs: async () => {
    const response = await axiosPublic.get("/api/tourism/get-blog-list");
    return response.data?.list_data;
  },

  /**
   * Fetch blog details by ID
   */
  getBlogDetails: async (id: string | number) => {
    const response = await axiosPublic.get(`/api/tourism/get-blog-list/${id}`);
    return response.data?.details_data;
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
