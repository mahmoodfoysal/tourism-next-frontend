"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import ComponentLoader from "@/components/pages/ComponentLoader";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import React from "react";
import Forbidden from "@/components/pages/Forbidden";

const SuperAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const { isAdmin, adminData: storedAdminData } = useSelector(
    (state: RootState) => state.admin,
  );
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const [isSuperVerified, setIsSuperVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifySuperAdmin = async () => {
      if (!loading) {
        if (!user) {
          router.push("/login");
          setVerifying(false);
          return;
        }

        // 1. Check local store first for efficiency
        if (
          storedAdminData &&
          storedAdminData.email === user.email &&
          storedAdminData.role_id === 200
        ) {
          setIsSuperVerified(true);
          setVerifying(false);
          return;
        }

        // 2. If not in store or not verified, check if we even qualify for a check
        if (!isAdmin) {
          setVerifying(false);
          return;
        }

        try {
          // 3. Backend Manifest Verification
          const response = await axiosSecure.get(
            `/admin/get-admin-list/${user.email}`,
          );
          const adminData = response.data;

          if (
            adminData &&
            adminData.email === user.email &&
            adminData.role_id === 200
          ) {
            setIsSuperVerified(true);
          }
        } catch (error) {
          console.error("SuperAdmin Verification Failed:", error);
        } finally {
          setVerifying(false);
        }
      }
    };

    verifySuperAdmin();
  }, [user, loading, isAdmin, storedAdminData, router, axiosSecure]);

  if (loading || verifying) {
    return <ComponentLoader></ComponentLoader>;
  }

  if (user && isAdmin && isSuperVerified) {
    return <>{children}</>;
  }

  // If loading and verifying are done, and we reach here, it means access is forbidden
  if (!loading && !verifying) {
    return <Forbidden />;
  }

  return null;
};

export default SuperAdmin;
