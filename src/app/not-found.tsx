import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <main className="min-h-screen bg-base-100 flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Large 404 Text */}
        <div className="relative inline-block mb-8">
          <h1 className="text-[12rem] md:text-[18rem] font-black text-base-content/5 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-32 md:w-48 md:h-48 bg-base-100 rounded-[3rem] shadow-2xl border border-base-content/5 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 md:h-24 md:w-24 text-primary animate-bounce duration-[2000ms]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight">
            Lost in <span className="text-primary">Adventure?</span>
          </h2>
          <p className="text-base-content/50 text-lg font-medium max-w-md mx-auto leading-relaxed">
            The page you are looking for seems to have drifted off the map. Lets
            get you back on track to your next destination.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="btn btn-primary btn-lg rounded-3xl px-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all w-full sm:w-auto"
            >
              Back to Home
            </Link>
            <Link
              href="/destinations"
              className="btn btn-ghost btn-lg rounded-3xl px-12 font-black uppercase tracking-widest border border-base-content/10 w-full sm:w-auto"
            >
              Explore Trips
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle Footer Quote */}
      <p className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.5em] text-base-content/20">
        Not all who wander are lost, but this page is.
      </p>
    </main>
  );
};

export default NotFound;
