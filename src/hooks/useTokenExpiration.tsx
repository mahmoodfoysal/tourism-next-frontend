"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setUser } from "@/store/slices/authSlice";
import { clearAdminInfo } from "@/store/slices/adminSlice";
import { parseJwt } from "@/utils/jwt";
import { showError } from "@/components/pages/Alert";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store";

export const useTokenExpiration = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkToken = () => {
      const token = sessionStorage.getItem("token");
      if (token) {
        const decoded = parseJwt(token);
        if (decoded && decoded.exp) {
          const currentTime = Date.now() / 1000;
          const timeUntilExpiration = decoded.exp - currentTime;

          if (timeUntilExpiration <= 0) {
            // Token has already expired
            handleLogout();
          } else {
            // Set a timeout to log out when the token expires
            timeoutId = setTimeout(() => {
              handleLogout();
            }, timeUntilExpiration * 1000);
          }
        }
      }
    };

    const handleLogout = async () => {
      sessionStorage.removeItem("token");
      try {
        await dispatch(logoutUser()).unwrap();
        dispatch(setUser(null));
        dispatch(clearAdminInfo());
        showError(
          "Session Expired",
          "Your session has expired. Please log in again."
        );
        router.push("/");
      } catch (err) {
        console.error("Auto logout error:", err);
      }
    };

    checkToken();

    // Check token periodically as a fallback, e.g., if token changed in another tab (though sessionStorage is per tab)
    // or just checking every minute
    const intervalId = setInterval(() => {
      clearTimeout(timeoutId);
      checkToken();
    }, 60000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [dispatch, router, user]);
};
