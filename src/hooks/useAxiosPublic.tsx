import axios, { AxiosInstance } from "axios";

export const axiosPublic: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TOURISM_URL,
});

const useAxiosPublic = (): AxiosInstance => {
  return axiosPublic;
};

export default useAxiosPublic;
