"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import ComponentLoader from "@/components/pages/ComponentLoader";

const PrivateRoutes = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <ComponentLoader></ComponentLoader>;
  }

  if (user) {
    return <>{children}</>;
  }

  return null;
};

export default PrivateRoutes;
