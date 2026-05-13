"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { logoutUser, setUser } from "@/store/slices/authSlice";
import {
  showSuccess,
  showError,
  showProcessing,
  closeAlert,
} from "@/components/pages/Alert";
import { useRouter, usePathname } from "next/navigation";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Initialize theme from local storage or default to dark
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTimeout(() => {
      setTheme(savedTheme);
    }, 0);
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    showProcessing("Signing Out", "Ending your session safely...");
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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Destinations", href: "/destinations" },
    { name: "Packages", href: "/packages" },
    { name: "Blogs", href: "/blogs" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-base-100/90 backdrop-blur-2xl border-b border-base-content/10 shadow-lg"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="navbar w-[95%] lg:w-[85%] mx-auto px-4 sm:px-0 min-h-[4rem]">
          {/* Mobile Menu Button */}
          <div className="navbar-start">
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="btn btn-ghost btn-circle hover:bg-primary/10 transition-colors"
                aria-label="Open Navigation Menu"
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
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </button>
            </div>

            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2 text-2xl font-black tracking-tighter"
            >
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
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
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-base-content to-base-content/70">
                Aura<span className="text-primary">Trip</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal gap-2 p-0">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`px-4 py-2 text-[15px] font-semibold transition-all duration-300 relative group ${
                        isActive
                          ? "text-primary"
                          : "text-base-content/70 hover:text-primary hover:bg-primary/5"
                      } rounded-full`}
                    >
                      {link.name}
                      <span
                        className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                          isActive ? "w-1/2" : "w-0 group-hover:w-1/2"
                        }`}
                      ></span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* CTA & Theme Toggle */}
          <div className="navbar-end gap-2 md:gap-4">
            {/* Theme Toggle Button */}
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

            {user ? (
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar online shadow-primary/20 shadow-md"
                >
                  <div className="w-10 h-10 rounded-full relative overflow-hidden">
                    <img
                      src={
                        user.photoURL ||
                        `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=random`
                      }
                      alt="profile"
                      className="w-10 h-10 object-cover rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=random`;
                      }}
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-content/5 glass-effect"
                >
                  <li className="px-4 py-2 border-b border-base-content/10 mb-2">
                    <span className="font-bold block p-0">
                      {user.displayName || "Explorer"}
                    </span>
                    <span className="text-[10px] text-base-content/60 truncate p-0">
                      {user.email}
                    </span>
                  </li>
                  <li>
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link href="/my-bookings">Booking History</Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-red-500 font-bold hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex btn btn-ghost hover:bg-base-content/5 rounded-full px-6 font-bold"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Side Drawer */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        ></div>

        {/* Drawer Content */}
        <div
          className={`absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-base-100 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-6 border-b border-base-200 flex items-center justify-between">
            <span className="text-xl font-bold">Menu</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="btn btn-ghost btn-circle btn-sm"
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
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {user && (
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl mb-4">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-xl relative overflow-hidden">
                    <img
                      src={
                        user.photoURL ||
                        `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=random`
                      }
                      alt="profile"
                      className="w-12 h-12 object-cover rounded-xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=random`;
                      }}
                    />
                  </div>
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold truncate">
                    {user.displayName || "Explorer"}
                  </h3>
                  <p className="text-xs text-base-content/60 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            )}
            <ul className="menu menu-lg gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-lg font-semibold py-3 px-4 rounded-xl transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "hover:text-primary"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="p-6 border-t border-base-200 space-y-3">
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="btn btn-outline btn-error btn-block rounded-xl font-bold h-12"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="btn btn-outline btn-block rounded-xl font-bold h-12"
              >
                Login
              </Link>
            )}
            <Link
              href="/booking"
              onClick={() => setIsMenuOpen(false)}
              className="btn btn-primary btn-block rounded-xl font-bold h-12"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
