"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase.init";
import { setUser } from "@/store/slices/authSlice";
import { axiosSecure } from "@/hooks/useAxiosSecure";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch JWT Token on session restoration/auth change
        try {
          const tokenResponse = await axiosSecure.post('/get-token', {
            email: user.email
          });
          
          if (tokenResponse.data.token) {
            sessionStorage.setItem("token", tokenResponse.data.token);
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
        }

        store.dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }));
      } else {
        sessionStorage.removeItem("token");
        store.dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
