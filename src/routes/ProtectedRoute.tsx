"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import ComponentLoader from "@/components/pages/ComponentLoader";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const { isAdmin } = useSelector((state: RootState) => state.admin);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!isAdmin) {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <ComponentLoader></ComponentLoader>;
  }

  if (user && isAdmin) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;
