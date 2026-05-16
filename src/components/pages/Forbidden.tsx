"use client";

import React from "react";
import Link from "next/link";

const Forbidden = () => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-error/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Animated Icon Container */}
        <div className="mb-10 inline-flex relative group">
          <div className="absolute inset-0 bg-error/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
          <div className="relative w-32 h-32 bg-base-100 border-4 border-error/20 rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-error/10 to-transparent"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-error animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 15v2m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Error Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-7xl font-black text-base-content tracking-tighter uppercase leading-none opacity-10 select-none">
              403
            </h1>
            <h2 className="text-4xl font-black text-base-content tracking-tighter uppercase leading-none">
              Clearance <span className="text-error italic">Denied</span>
            </h2>
          </div>

          <div className="flex justify-center">
            <div className="h-1 w-20 bg-error/20 rounded-full"></div>
          </div>

          <p className="text-base-content/50 font-bold max-w-md mx-auto text-sm leading-relaxed uppercase tracking-widest">
            Your current administrative credentials do not possess the required
            clearance level to access this sector.
          </p>

          <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="btn btn-error btn-outline h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] group shadow-xl shadow-error/10 border-2"
            >
              Return to Surface
            </Link>
            <Link
              href="/contact"
              className="btn btn-ghost h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] text-base-content/40 hover:text-base-content"
            >
              Request Access
            </Link>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="mt-20 flex items-center justify-center gap-6 opacity-30">
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">
              Protocol
            </span>
            <span className="text-[10px] font-bold">SEC-403</span>
          </div>
          <div className="w-px h-8 bg-base-content/20"></div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">
              Origin
            </span>
            <span className="text-[10px] font-bold uppercase">
              Restricted Sector
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
