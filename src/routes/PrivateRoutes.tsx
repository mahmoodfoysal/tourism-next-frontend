"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";

const PrivateRoutes = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  return null;
};

export default PrivateRoutes;
