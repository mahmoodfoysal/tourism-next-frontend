"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setUser } from "@/store/slices/authSlice";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import {
  showSuccess,
  showError,
  showProcessing,
  showConfirmation,
} from "@/components/pages/Alert";
import { auth } from "@/firebase/firebase.init";
import { updateProfile, updatePassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface ProfileData {
  full_name: string;
  email: string;
  phone_no: string;
  address: string;
  passport_no: string;
  photo_url: string;
  _id: string | null;
  user_info: string;
}

interface PendingItem {
  id?: string;
  _id?: string;
  title?: string;
  package_name?: string;
  price?: number;
  total_price?: number;
  order_id?: string;
  grand_total?: number;
  createdAt?: string;
  order_status?: string;
}

const DashboardProfilePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);

  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: user?.displayName || "",
    email: user?.email || "",
    phone_no: "",
    address: "",
    passport_no: "",
    photo_url: user?.photoURL || "",
    _id: null,
    user_info: user?.email || "",
  });

  const [profileImg, setProfileImg] = useState<string>(
    profileData.photo_url || "https://i.ibb.co/5GzXkwq/user.png",
  );

  useEffect(() => {
    setTimeout(() => {
      setProfileImg(
        profileData.photo_url || "https://i.ibb.co/5GzXkwq/user.png",
      );
    }, 0);
  }, [profileData.photo_url]);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setProfileData((prev) => ({
          ...prev,
          full_name: user.displayName || prev.full_name,
          email: user.email || prev.email,
          photo_url: user.photoURL || prev.photo_url,
          user_info: user.email || prev.user_info,
        }));
      }, 500);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        const [profileRes, pendingRes] = await Promise.all([
          axiosSecure.get(`/api/tourism/get-user-list/${user.email}`),
          axiosSecure.get(`/api/tourism/get-booking-list`),
        ]);

        const profile = profileRes.data?.list_data;
        const pending = pendingRes.data?.list_data;

        if (profile && Array.isArray(profile) && profile.length > 0) {
          const userData = profile[0];
          setProfileData({
            full_name: userData.full_name || user.displayName || "",
            email: userData.email || user.email || "",
            phone_no: userData.phone_no || "",
            address: userData.address || "",
            user_info: user?.email || "",
            passport_no: userData.passport_no || "",
            photo_url: userData.photo_url || user.photoURL || "",
            _id: userData._id || null,
          });
        } else if (profile && !Array.isArray(profile)) {
          setProfileData({
            full_name: profile.full_name || user.displayName || "",
            email: profile.email || user.email || "",
            phone_no: profile.phone_no || "",
            address: profile.address || "",
            user_info: user?.email || "",
            passport_no: profile.passport_no || "",
            photo_url: profile.photo_url || user.photoURL || "",
            _id: profile._id || null,
          });
        }

        if (pending) {
          setPendingItems(pending);
        }
      } catch (error: unknown) {
        const err = error as AxiosError;
        if (err.response?.status !== 404) {
          console.error("Error fetching profile data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, axiosSecure]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const isConfirmed = await showConfirmation(
      "Confirm Transformation",
      "Are you sure you want to synchronize these changes?",
      "Synchronize",
      "Keep Current",
    );

    if (!isConfirmed.isConfirmed) return;

    showProcessing("Synchronizing Profile", "Updating your identity...");

    try {
      const dataToSubmit: Record<string, string | number | null> = {
        ...profileData,
        phone_no: profileData.phone_no ? Number(profileData.phone_no) : 0,
      };

      if (profileData._id) {
        dataToSubmit._id = profileData._id;
      }

      await updateProfile(currentUser, {
        displayName: profileData.full_name,
        photoURL: profileData.photo_url,
      });

      if (newPassword) {
        await updatePassword(currentUser, newPassword);
      }

      await axiosSecure.post(
        "/api/tourism/insert-update-user-list",
        dataToSubmit,
      );

      dispatch(
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: profileData.full_name,
          photoURL: profileData.photo_url,
        }),
      );

      setTimeout(() => {
        showSuccess("Profile Updated", "Success!");
        setIsEditModalOpen(false);
        setNewPassword("");
      }, 500);
    } catch (error: unknown) {
      console.error("Update error:", error);
      showError("Update Failed", "Error saving changes.");
    }
  };

  if (loading) {
    return (
      <div className="h-96 bg-base-300/50 rounded-[3rem] animate-pulse"></div>
    );
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Profile Card */}
        <div className="lg:w-1/3 space-y-8">
          <div className="bg-base-200/50 rounded-[3rem] p-10 border border-base-content/5 text-center relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-32 h-32 mx-auto rounded-full border-4 border-primary/20 p-1 mb-6 relative overflow-hidden">
                <Image
                  src={profileImg}
                  alt="Profile"
                  fill
                  className="object-cover rounded-full group-hover:scale-110 transition-transform duration-700"
                  onError={() =>
                    setProfileImg("https://i.ibb.co/5GzXkwq/user.png")
                  }
                />
              </div>
              <h3 className="text-2xl font-black text-base-content tracking-tight">
                {profileData.full_name}
              </h3>
              <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest mt-1">
                {profileData.email}
              </p>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="btn btn-primary btn-sm rounded-xl px-6 mt-8 h-10 font-black uppercase tracking-widest text-[9px]"
              >
                Edit Profile
              </button>
            </div>
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
          </div>

          <div className="bg-base-200/50 rounded-[3rem] p-8 border border-base-content/5">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-base-content/30 mb-6">
              Verification Status
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-base-content/60">
                  Email
                </span>
                <span className="badge badge-success badge-outline text-[9px] font-black uppercase">
                  Verified
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-base-content/60">
                  Identity
                </span>
                <span className="badge badge-warning badge-outline text-[9px] font-black uppercase">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex-1 space-y-12">
          {/* Global Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-base-200/50 rounded-[2.5rem] p-8 border border-base-content/5 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-2">
                  Total Sells Revenue
                </p>
                <h4 className="text-3xl font-black text-primary tracking-tighter">
                  $
                  {pendingItems
                    .reduce((acc, item) => acc + (item.grand_total || 0), 0)
                    .toLocaleString()}
                </h4>
              </div>
              <div className="absolute -right-4 -bottom-4 text-4xl opacity-5 group-hover:scale-110 transition-transform">
                💰
              </div>
            </div>

            <div className="bg-base-200/50 rounded-[2.5rem] p-8 border border-base-content/5 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-2">
                  Total Orders
                </p>
                <h4 className="text-3xl font-black text-base-content tracking-tighter">
                  {pendingItems.length}
                </h4>
              </div>
              <div className="absolute -right-4 -bottom-4 text-4xl opacity-5 group-hover:scale-110 transition-transform">
                📦
              </div>
            </div>

            <div className="bg-base-200/50 rounded-[2.5rem] p-8 border border-base-content/5 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-2">
                  Pending Orders
                </p>
                <h4 className="text-3xl font-black text-warning tracking-tighter">
                  {
                    pendingItems.filter((item) => item.order_status === "P")
                      .length
                  }
                </h4>
              </div>
              <div className="absolute -right-4 -bottom-4 text-4xl opacity-5 group-hover:scale-110 transition-transform">
                ⏳
              </div>
            </div>
          </div>

          <div className="bg-base-200/30 rounded-[3rem] p-12 border border-base-content/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-black text-base-content tracking-tight uppercase">
                Account Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "Full Name", value: profileData.full_name },
                { label: "Email", value: profileData.email },
                { label: "Phone", value: profileData.phone_no || "Not set" },
                {
                  label: "Passport",
                  value: profileData.passport_no || "Not set",
                },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-base-content/30">
                    {item.label}
                  </p>
                  <p className="text-sm font-bold text-base-content">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-base-200/30 rounded-[3rem] p-12 border border-base-content/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-black text-base-content tracking-tight uppercase">
                Security Settings
              </h3>
            </div>

            <div className="space-y-6 max-w-md">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 ml-4">
                  Update Password
                </label>
                <input
                  type="password"
                  placeholder="New secure password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input input-bordered w-full rounded-2xl bg-base-100/50 border-base-content/5"
                />
              </div>
              <button
                onClick={handleUpdateProfile}
                className="btn btn-primary rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px]"
              >
                Save Security Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-base-300/90 backdrop-blur-2xl"
            onClick={() => setIsEditModalOpen(false)}
          ></div>
          <div className="bg-base-100 w-full max-w-xl rounded-[3rem] border border-base-content/10 relative overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="h-2 bg-primary w-full"></div>
            <div className="p-12">
              <h2 className="text-3xl font-black text-base-content tracking-tight uppercase mb-8">
                Edit Profile
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <input
                  type="text"
                  name="full_name"
                  value={profileData.full_name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="input input-bordered w-full rounded-2xl"
                />
                <input
                  type="text"
                  name="phone_no"
                  value={profileData.phone_no}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="input input-bordered w-full rounded-2xl"
                />
                <input
                  type="text"
                  name="passport_no"
                  value={profileData.passport_no}
                  onChange={handleInputChange}
                  placeholder="Passport"
                  className="input input-bordered w-full rounded-2xl"
                />
                <input
                  type="text"
                  name="photo_url"
                  value={profileData.photo_url}
                  onChange={handleInputChange}
                  placeholder="Photo URL"
                  className="input input-bordered w-full rounded-2xl"
                />
                <button
                  type="submit"
                  className="btn btn-primary w-full h-16 rounded-2xl font-black uppercase tracking-widest"
                >
                  Update Identity
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardProfilePage;
