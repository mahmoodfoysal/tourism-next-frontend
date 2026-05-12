import React from "react";

const SkeletonDetails = () => {
  return (
    <div className="min-h-screen bg-base-100 p-20">
      <div className="animate-pulse space-y-8">
        <div className="h-64 bg-base-300 rounded-[3rem]"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-10 bg-base-300 rounded-xl w-1/2"></div>
            <div className="h-4 bg-base-200 rounded-xl w-full"></div>
            <div className="h-4 bg-base-200 rounded-xl w-full"></div>
            <div className="h-4 bg-base-200 rounded-xl w-3/4"></div>
          </div>
          <div className="h-96 bg-base-300 rounded-[3rem]"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonDetails;
