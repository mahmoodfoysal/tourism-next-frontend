"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PrivateRoutes from "@/routes/PrivateRoutes";
import AdminRoute from "@/routes/AdminRoute";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isAdmin } = useSelector((state: RootState) => state.admin);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    {
      name: "Overview",
      path: "/dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      name: "Make Admin",
      path: "/dashboard/make-admin",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      name: "My Bookings",
      path: "/dashboard/my-bookings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      name: "Profile Settings",
      path: "/dashboard/profile",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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
      ),
    },
  ];

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-base-100 dark:bg-[#0a0f1c] transition-colors duration-500">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "w-80" : "w-24"
          } bg-base-200/50 dark:bg-base-300/30 backdrop-blur-xl border-r border-base-content/5 transition-all duration-500 ease-in-out relative flex flex-col z-50`}
        >
          {/* Sidebar Header */}
          <div className="p-8 flex items-center justify-between">
            <Link
              href="/"
              className={`flex items-center gap-3 ${!isSidebarOpen && "justify-center w-full"}`}
            >
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-black text-xl">A</span>
              </div>
              {isSidebarOpen && (
                <span className="text-xl font-black tracking-tighter text-base-content uppercase">
                  Aura<span className="text-primary">Trip</span>
                </span>
              )}
            </Link>
          </div>

          {/* User Preview */}
          <div
            className={`px-6 mb-10 ${!isSidebarOpen && "flex justify-center"}`}
          >
            <div
              className={`p-4 rounded-3xl bg-base-100 dark:bg-white/5 border border-base-content/5 flex items-center gap-4 ${!isSidebarOpen && "p-2"}`}
            >
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary/20 shrink-0">
                <Image
                  src={
                    user?.photoURL ||
                    `https://ui-avatars.com/api/?name=${user?.displayName || "User"}&background=random`
                  }
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              {isSidebarOpen && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black text-base-content truncate">
                    {user?.displayName || "Explorer"}
                  </span>
                  <span className="text-[10px] font-bold text-base-content/40 truncate">
                    {user?.email}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-2">
            {menuItems
              .filter((item) => {
                if (item.name === "Admin" && !isAdmin) return false;
                return true;
              })
              .map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center gap-4 px-4 h-14 rounded-2xl transition-all duration-300 group ${
                      isActive
                        ? "bg-primary text-white shadow-xl shadow-primary/20"
                        : "text-base-content/50 hover:bg-primary/5 hover:text-primary"
                    } ${!isSidebarOpen && "justify-center px-0"}`}
                  >
                    <div
                      className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-primary/60 group-hover:text-primary"}`}
                    >
                      {item.icon}
                    </div>
                    {isSidebarOpen && (
                      <span className="text-sm font-black uppercase tracking-widest leading-none">
                        {item.name}
                      </span>
                    )}
                  </Link>
                );
              })}
          </nav>

          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-4 top-24 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform duration-500 ${!isSidebarOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Bottom Branding */}
          {isSidebarOpen && (
            <div className="p-8">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-primary to-accent text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="text-sm font-black uppercase tracking-widest mb-1">
                    Go Premium
                  </h4>
                  <p className="text-[10px] font-bold text-white/70 mb-4">
                    Unlock exclusive luxury destinations
                  </p>
                  <button className="w-full py-2 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/30 hover:bg-white hover:text-primary transition-all">
                    Upgrade Now
                  </button>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Area (Outlet) */}
        <main className="flex-1 flex flex-col min-w-0 bg-base-100 dark:bg-[#0a0f1c]">
          {/* Dashboard Header */}
          <header className="h-24 px-8 flex items-center justify-between border-b border-base-content/5 sticky top-0 bg-base-100/80 dark:bg-[#0a0f1c]/80 backdrop-blur-xl z-40">
            <div>
              <h2 className="text-2xl font-black text-base-content tracking-tight uppercase">
                {menuItems.find((item) => item.path === pathname)?.name ||
                  "Dashboard"}
              </h2>
              <p className="text-xs font-bold text-base-content/40 tracking-widest uppercase">
                Welcome back, {user?.displayName?.split(" ")[0] || "Traveler"}
              </p>
            </div>

            <div className="flex items-center gap-6">
              {/* Search Placeholder */}
              <div className="hidden md:flex items-center gap-3 px-6 h-12 rounded-2xl bg-base-200/50 border border-base-content/5 text-base-content/40 w-80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-sm font-bold">
                  Search destinations...
                </span>
              </div>

              {/* Notifications */}
              <button className="relative w-12 h-12 rounded-2xl bg-base-200/50 border border-base-content/5 flex items-center justify-center text-base-content/60 hover:text-primary transition-colors">
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-error rounded-full border-2 border-base-100"></span>
              </button>
            </div>
          </header>

          {/* Content Outlet */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
};

export default DashboardLayout;
