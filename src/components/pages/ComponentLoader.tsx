import React from "react";

const ComponentLoader = () => {
  return (
    <div className="flex flex-col justify-center items-center py-50 space-y-10">
      <div className="relative">
        {/* Pulsing Rings */}
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150"></div>
        <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping delay-300 scale-125"></div>

        {/* Main Icon Container */}
        <div className="relative w-24 h-24 bg-base-100 rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-base-content/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-primary animate-bounce duration-1000"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2 text-center">
        <h3 className="text-3xl font-black text-base-content tracking-tighter uppercase italic">
          Loading
        </h3>
        <p className="text-lg font-black text-primary uppercase tracking-widest">
          Please Wait
        </p>
        <p className="text-sm font-medium text-base-content/40 max-w-[250px] pt-2">
          Page is loading, please wait...
        </p>
      </div>
    </div>
  );
};

export default ComponentLoader;
