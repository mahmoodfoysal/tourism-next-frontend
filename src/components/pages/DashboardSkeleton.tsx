"use client";

const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-20 bg-base-200/50 rounded-3xl animate-pulse"></div>
      <div className="h-96 bg-base-200/50 rounded-3xl animate-pulse"></div>
    </div>
  );
};

export default DashboardSkeleton;
