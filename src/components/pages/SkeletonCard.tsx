import React from "react";

const SkeletonCard = () => {
  return (
    <div className="bg-base-100 rounded-[2.5rem] overflow-hidden border border-base-content/5 shadow-xl flex flex-col h-full animate-pulse">
      {/* Image Container Skeleton */}
      <div className="relative h-64 bg-base-300"></div>

      {/* Content Skeleton */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <div className="h-6 bg-base-300 rounded-lg w-3/4 mb-3"></div>

        {/* Features Grid Skeleton */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-base-200 shrink-0"></div>
              <div className="h-3 bg-base-200 rounded w-full"></div>
            </div>
          ))}
        </div>

        {/* Footer Skeleton */}
        <div className="mt-auto pt-5 border-t border-base-content/5">
          <div className="flex flex-col gap-1 mb-4">
            <div className="h-3 bg-base-200 rounded w-12"></div>
            <div className="h-7 bg-base-300 rounded w-20"></div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex gap-2">
            <div className="flex-[1.5] h-10 bg-base-300 rounded-xl"></div>
            <div className="flex-1 h-10 bg-base-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
