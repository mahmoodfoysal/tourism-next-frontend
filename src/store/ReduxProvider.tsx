"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase.init";
import { setUser } from "@/store/slices/authSlice";
import { setAdminInfo, clearAdminInfo } from "@/store/slices/adminSlice";
import { axiosSecure } from "@/hooks/useAxiosSecure";
import { axiosPublic } from "@/hooks/useAxiosPublic";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch JWT Token on session restoration/auth change
        try {
          const tokenResponse = await axiosPublic.post('/get-token', {
            email: user.email
          });
          
          if (tokenResponse.data.token) {
            sessionStorage.setItem("token", tokenResponse.data.token);
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
        }

        // Check if Admin
        let isAdmin = false;
        let adminData = null;
        try {
          const token = sessionStorage.getItem("token");
          const adminRes = await axiosSecure.get(`/admin/get-admin-list/${user.email}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (adminRes.data && adminRes.data.admin === true && adminRes.data.email === user.email) {
            isAdmin = true;
            adminData = adminRes.data;
          }
        } catch (error) {
          console.error("Admin check failed:", error);
        }

        // Set Admin Info in separate slice
        store.dispatch(setAdminInfo({ isAdmin, adminData }));

        store.dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }));
      } else {
        sessionStorage.removeItem("token");
        store.dispatch(setUser(null));
        store.dispatch(clearAdminInfo());
      }
    });

    return () => unsubscribe();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
