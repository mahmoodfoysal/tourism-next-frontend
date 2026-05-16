"use client";

import React, { useState } from "react";
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { logoutUser, setUser } from "@/store/slices/authSlice";
import { useRouter, usePathname } from "next/navigation";
import {
  showSuccess,
  showError,
  showProcessing,
  closeAlert,
} from "@/components/pages/Alert";
import Image from "next/image";
import ProtectedRoute from "@/routes/ProtectedRoute";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isAdmin } = useSelector((state: RootState) => state.admin);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (name: string) => {
    setExpandedMenus((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = async () => {
    showProcessing("Signing Out", "Ending your administrative session...");
    const result = await dispatch(logoutUser());
    closeAlert();
    if (logoutUser.fulfilled.match(result)) {
      dispatch(setUser(null));
      showSuccess("Logged Out", "You have been signed out successfully.");
      router.push("/");
    } else {
      showError("Logout Failed", "Something went wrong. Please try again.");
    }
  };

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
      name: "Manage Admin",
      path: "/dashboard/manage-admin",
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      name: "Manage Packages",
      path: "/dashboard/manage-package",
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
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      name: "Manage Blogs",
      path: "/dashboard/manage-blog",
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
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      name: "Manage Guides",
      path: "/dashboard/manage-guide",
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
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      name: "Manage Coupons",
      path: "/dashboard/manage-coupon",
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
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
      ),
    },
    {
      name: "Manage Reviews",
      path: "/dashboard/manage-review",
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
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
    {
      name: "Manage Galary",
      path: "/dashboard/manage-galary",
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
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      name: "Manage Bookings",
      path: "/dashboard/manage-bookings",
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
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      subItems: [
        { name: "Processing", path: "/dashboard/manage-bookings/processing" },
        { name: "Booking", path: "/dashboard/manage-bookings/booking" },
        { name: "Completed", path: "/dashboard/manage-bookings/completed" },
        { name: "Rejection", path: "/dashboard/manage-bookings/rejection" },
      ],
    },
  ];

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-base-100 dark:bg-[#0a0f1c] transition-colors duration-500">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "w-80" : "w-24"
          } bg-base-200/50 dark:bg-base-300/30 backdrop-blur-xl border-r border-base-content/5 transition-all duration-500 ease-in-out relative flex flex-col z-50 print:hidden`}
        >
          {/* Sidebar Header */}
          <div className="px-8 py-4 flex items-center justify-between">
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
            className={`px-6 mb-8 ${!isSidebarOpen && "flex justify-center"}`}
          >
            <div
              className={`p-3 rounded-3xl bg-base-100 dark:bg-white/5 border border-base-content/5 flex items-center gap-4 ${!isSidebarOpen && "p-2"}`}
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
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            {menuItems
              .filter((item: any) => {
                if (item.name === "Admin" && !isAdmin) return false;
                return true;
              })
              .map((item: any) => {
                const isActive = pathname === item.path;
                const isExpanded = expandedMenus.includes(item.name);
                const hasSubItems = item.subItems && item.subItems.length > 0;

                return (
                  <div key={item.name} className="space-y-1">
                    {hasSubItems ? (
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={`w-full flex items-center justify-between px-4 h-14 rounded-2xl transition-all duration-300 group ${
                          pathname.startsWith(item.path)
                            ? "bg-primary/10 text-primary"
                            : "text-base-content/50 hover:bg-primary/5 hover:text-primary"
                        } ${!isSidebarOpen && "justify-center px-0"}`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${pathname.startsWith(item.path) ? "text-primary" : "text-primary/60 group-hover:text-primary"}`}
                          >
                            {item.icon}
                          </div>
                          {isSidebarOpen && (
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                              {item.name}
                            </span>
                          )}
                        </div>
                        {isSidebarOpen && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </button>
                    ) : (
                      <Link
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
                          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                            {item.name}
                          </span>
                        )}
                      </Link>
                    )}

                    {/* Sub Items */}
                    {hasSubItems && isExpanded && isSidebarOpen && (
                      <div className="pl-12 space-y-1 animate-in slide-in-from-top-2 duration-300">
                        {item.subItems.map((sub: any) => {
                          const isSubActive = pathname === sub.path;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.path}
                              className={`flex items-center h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-200 ${
                                isSubActive
                                  ? "text-primary bg-primary/5"
                                  : "text-base-content/40 hover:text-primary hover:bg-primary/5"
                              }`}
                            >
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 mt-auto border-t border-base-content/5 space-y-2">
            <Link
              href="/"
              className={`flex items-center gap-4 px-4 h-11 rounded-xl text-base-content/50 hover:bg-primary/5 hover:text-primary transition-all duration-300 ${!isSidebarOpen && "justify-center px-0"}`}
            >
              <div className="shrink-0 transition-transform group-hover:scale-110">
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              {isSidebarOpen && (
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Back to Home
                </span>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-4 px-4 h-11 rounded-xl text-error/60 hover:bg-error/5 hover:text-error transition-all duration-300 w-full ${!isSidebarOpen && "justify-center px-0"}`}
            >
              <div className="shrink-0 transition-transform group-hover:scale-110">
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              {isSidebarOpen && (
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Logout System
                </span>
              )}
            </button>
          </div>

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
        </aside>

        {/* Main Content Area (Outlet) */}
        <main className="flex-1 flex flex-col min-w-0 bg-base-100 dark:bg-[#0a0f1c]">
          {/* Dashboard Header */}
          <header className="h-20 px-8 flex items-center justify-between border-b border-base-content/5 sticky top-0 bg-base-100/80 dark:bg-[#0a0f1c]/80 backdrop-blur-xl z-40 print:hidden">
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
              {/* <div className="hidden md:flex items-center gap-3 px-6 h-12 rounded-2xl bg-base-200/50 border border-base-content/5 text-base-content/40 w-80">
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
              </div> */}

              {/* theme */}
              <button
                onClick={toggleTheme}
                className="btn btn-ghost btn-circle hover:bg-base-content/10 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === "light" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-slate-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                    />
                  </svg>
                )}
              </button>

              {/* Notifications */}
              {/* <button className="relative w-12 h-12 rounded-2xl bg-base-200/50 border border-base-content/5 flex items-center justify-center text-base-content/60 hover:text-primary transition-colors">
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
              </button> */}
            </div>
          </header>

          {/* Content Outlet */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
