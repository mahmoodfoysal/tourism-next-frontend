"use client";

import axios, { AxiosInstance } from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutUser, setUser } from "@/store/slices/authSlice";
import { showError } from "@/components/pages/Alert";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase.init";
import { AppDispatch } from "@/store";

export const axiosSecure: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TOURISM_URL,
});

const useAxiosSecure = (): AxiosInstance => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Request Interceptor to add Authorization header
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
          config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor to handle authentication errors
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          // Clear credentials
          sessionStorage.removeItem("token");
          
          try {
            await signOut(auth);
            dispatch(logoutUser());
            dispatch(setUser(null));
            
            showError(
              "Session Expired",
              "Your session has expired. Please log in again."
            );
            
            router.push("/");
          } catch (err) {
            console.error("Sign out error:", err);
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [dispatch, router]);

  return axiosSecure;
};

export default useAxiosSecure;
