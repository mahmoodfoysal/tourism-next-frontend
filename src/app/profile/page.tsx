"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setUser } from "@/store/slices/authSlice";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { axiosPublic } from "@/hooks/useAxiosPublic";
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

import PrivateRoutes from "@/routes/PrivateRoutes";

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
}

const ProfilePage = () => {
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
          axiosSecure.get(`/api/tourism/get-booking-list/${user.email}`),
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
          showError(
            "Identity Retrieval Failed",
            "We could not synchronize your profile data with the central hub. Your current session may be restricted.",
          );
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
      "Are you sure you want to synchronize these changes with your premium identity?",
      "Synchronize",
      "Keep Current",
    );

    if (!isConfirmed.isConfirmed) return;

    showProcessing(
      "Synchronizing Profile",
      "Updating your premium travel identity...",
    );

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

      await axiosSecure.post("/api/tourism/insert-update-user-list", dataToSubmit);

      dispatch(
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: profileData.full_name,
          photoURL: profileData.photo_url,
        }),
      );

      setTimeout(() => {
        showSuccess(
          "Profile Updated",
          "Your information and security settings have been synchronized successfully.",
        );
        setIsEditModalOpen(false);
        setNewPassword("");
      }, 500);
    } catch (error: unknown) {
      console.error("Update error:", error);
      const err = error as Error;
      showError(
        "Update Failed",
        err.message || "Could not save your changes. Please try again.",
      );
    }
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: "🎯" },
    { id: "security", label: "Security & Login", icon: "🔐" },
    { id: "wishlist", label: "Wishlist", icon: "💖" },
    { id: "coupon", label: "Coupon", icon: "🎉" },
  ];

  const stats = [
    {
      label: "TOTAL ORDERS",
      value: pendingItems.length,
      icon: "📦",
      color: "text-orange-500",
    },
    {
      label: "ACTIVE TRACKING",
      value: pendingItems.filter((p) => p.order_id).length,
      icon: "🚚",
      color: "text-blue-500",
    },
    { label: "COUPON", value: 3, icon: "✨", color: "text-yellow-500" },
    { label: "WISHLIST", value: 0, icon: "❤️", color: "text-red-500" },
  ];

  return (
    <PrivateRoutes>
      <main className="min-h-screen bg-[#0a0f1c] text-white font-sans selection:bg-primary/30 pb-20">
        {/* Header Section */}
        <div className="relative pt-20 pb-16 px-6 lg:px-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -mr-96 -mt-96 animate-pulse"></div>
          <div className="relative flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto">
            {/* Avatar Area */}
            <div className="relative group">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-[6px] border-primary/20 p-2 relative">
                <div className="w-full h-full rounded-full border-[6px] border-white/10 p-1 relative overflow-hidden">
                  <Image
                    src={profileImg}
                    alt={profileData.full_name}
                    width={224}
                    height={224}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700"
                    onError={() => {
                      setProfileImg("https://i.ibb.co/5GzXkwq/user.png");
                    }}
                  />
                </div>
                <button className="absolute bottom-4 right-4 w-12 h-12 bg-white text-[#0a0f1c] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all border-4 border-[#0a0f1c]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="text-center md:text-left space-y-4">
              <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-tight drop-shadow-2xl">
                {profileData.full_name.split(" ")[0]}
                <br />
                <span className="text-white/90">
                  {profileData.full_name.split(" ").slice(1).join(" ")}
                </span>
              </h1>
              <p className="text-xs font-black uppercase tracking-[0.6em] text-white/40 flex items-center justify-center md:justify-start gap-3">
                MEMBER <span className="w-1 h-1 rounded-full bg-primary"></span>{" "}
                SINCE 2026
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-2xl backdrop-blur-md">
                  <span className="text-sm font-bold text-white/60 lowercase">
                    {profileData.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 px-6 py-2.5 rounded-2xl backdrop-blur-md">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    Verified Account
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-6 lg:px-20 -mt-8 relative z-10">
          <div className="max-w-7xl mx-auto bg-[#12192c]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-1 shadow-2xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="p-8 flex flex-col items-center justify-center gap-4 group hover:bg-white/5 transition-colors duration-500 first:rounded-l-[2.4rem] last:rounded-r-[2.4rem]"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                    {stat.label}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className="text-4xl font-black tabular-nums tracking-tighter">
                      {stat.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-20 flex flex-col lg:flex-row gap-12">
          {/* Sidebar Nav */}
          <div className="lg:w-80 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-6 p-6 rounded-[2rem] transition-all duration-500 group relative overflow-hidden ${
                  activeTab === item.id
                    ? "bg-white text-[#0a0f1c] shadow-2xl scale-105 z-10"
                    : "bg-[#12192c] text-white/40 hover:bg-[#1a233a] hover:text-white/80"
                }`}
              >
                {activeTab === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
                )}
                <span
                  className={`text-2xl transition-transform duration-500 ${activeTab === item.id ? "scale-110" : "group-hover:scale-110"}`}
                >
                  {item.icon}
                </span>
                <span className="text-[11px] font-black uppercase tracking-[0.25em] relative">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-[#12192c]/50 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-10 md:p-16 shadow-2xl min-h-[600px] animate-in fade-in slide-in-from-right-10 duration-1000">
              {activeTab === "overview" && (
                <div className="space-y-16">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="space-y-3">
                      <h2 className="text-4xl font-black uppercase tracking-tight">
                        Account{" "}
                        <span className="text-primary italic">Overview</span>
                      </h2>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                        Your personal account information and status
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="btn btn-primary h-14 px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
                    >
                      Edit Profile
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3 p-8 bg-[#0a0f1c]/50 rounded-[2.5rem] border border-white/5 group hover:border-primary/20 transition-all duration-500">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-xl">
                          👤
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">
                          Full Name
                        </p>
                      </div>
                      <p className="text-2xl font-black">
                        {profileData.full_name}
                      </p>
                    </div>

                    <div className="space-y-3 p-8 bg-[#0a0f1c]/50 rounded-[2.5rem] border border-white/5 group hover:border-blue-500/20 transition-all duration-500">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-xl">
                          📧
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">
                          Email Address
                        </p>
                      </div>
                      <p className="text-2xl font-black truncate">
                        {profileData.email}
                      </p>
                    </div>

                    <div className="space-y-3 p-8 bg-[#0a0f1c]/50 rounded-[2.5rem] border border-white/5 group hover:border-green-500/20 transition-all duration-500">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-xl">
                          📱
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">
                          Phone Number
                        </p>
                      </div>
                      <p className="text-2xl font-black">
                        {profileData.phone_no || "Not Linked"}
                      </p>
                    </div>

                    <div className="space-y-3 p-8 bg-[#0a0f1c]/50 rounded-[2.5rem] border border-white/5 group hover:border-yellow-500/20 transition-all duration-500">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-xl">
                          🛂
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">
                          Passport Serial
                        </p>
                      </div>
                      <p className="text-2xl font-black">
                        {profileData.passport_no || "Scan Required"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
                  <div className="space-y-3">
                    <h2 className="text-4xl font-black uppercase tracking-tight">
                      Security{" "}
                      <span className="text-primary italic">& Access</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                      Manage your digital credentials and secure keys
                    </p>
                  </div>

                  <div className="p-10 bg-[#0a0f1c]/50 rounded-[3rem] border border-white/5 space-y-10">
                    <div className="space-y-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                        Modify Password
                      </p>
                      <input
                        type="password"
                        placeholder="Enter new secure key"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#12192c] border border-white/5 rounded-2xl h-16 px-8 font-bold focus:border-primary/40 transition-all outline-none"
                      />
                    </div>
                    <button
                      onClick={handleUpdateProfile}
                      className="btn btn-primary px-12 h-16 rounded-2xl font-black uppercase tracking-widest text-xs"
                    >
                      Update Security Credentials
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "wishlist" && (
                <div className="flex flex-col items-center justify-center text-center space-y-8 py-20 animate-in zoom-in-95 duration-700">
                  <div className="w-32 h-32 bg-pink-500/10 rounded-full flex items-center justify-center text-5xl">
                    💖
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black uppercase italic">
                      Wishlist Empty
                    </h3>
                    <p className="text-sm font-medium text-white/20">
                      Save your favorite expeditions to track availability and
                      price changes.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/packages")}
                    className="btn btn-ghost border-white/10 h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                  >
                    Explore Packages
                  </button>
                </div>
              )}

              {activeTab === "coupon" && (
                <div className="flex flex-col items-center justify-center text-center space-y-8 py-20 animate-in zoom-in-95 duration-700">
                  <div className="w-32 h-32 bg-yellow-500/10 rounded-full flex items-center justify-center text-5xl">
                    🎉
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black uppercase italic">
                      No Active Coupons
                    </h3>
                    <p className="text-sm font-medium text-white/20">
                      Complete more voyages to unlock exclusive elite discounts.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/my-bookings")}
                    className="btn btn-ghost border-white/10 h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                  >
                    View Booking History
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* EDIT MODAL */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div
              className="absolute inset-0 bg-[#0a0f1c]/90 backdrop-blur-2xl"
              onClick={() => setIsEditModalOpen(false)}
            ></div>

            <div className="bg-[#12192c] w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="h-2 bg-primary w-full"></div>

              <div className="p-12 space-y-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white">
                      Modify{" "}
                      <span className="text-primary italic">Identity</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                      Update your global travel credentials
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all"
                  >
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
                        strokeWidth="2.5"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form className="space-y-8" onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">
                        Full Legal Name
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={profileData.full_name}
                        onChange={handleInputChange}
                        className="w-full bg-[#0a0f1c] border border-white/5 rounded-2xl h-14 px-6 font-bold focus:border-primary/40 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">
                        Phone Identity
                      </label>
                      <input
                        type="text"
                        name="phone_no"
                        value={profileData.phone_no}
                        onChange={handleInputChange}
                        className="w-full bg-[#0a0f1c] border border-white/5 rounded-2xl h-14 px-6 font-bold focus:border-primary/40 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">
                        Passport Serial
                      </label>
                      <input
                        type="text"
                        name="passport_no"
                        value={profileData.passport_no}
                        onChange={handleInputChange}
                        className="w-full bg-[#0a0f1c] border border-white/5 rounded-2xl h-14 px-6 font-bold focus:border-primary/40 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">
                        Avatar URL
                      </label>
                      <input
                        type="text"
                        name="photo_url"
                        value={profileData.photo_url}
                        onChange={handleInputChange}
                        className="w-full bg-[#0a0f1c] border border-white/5 rounded-2xl h-14 px-6 font-bold focus:border-primary/40 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn btn-primary h-16 rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-primary/20"
                  >
                    Synchronize Credentials
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </PrivateRoutes>
  );
};

export default ProfilePage;
