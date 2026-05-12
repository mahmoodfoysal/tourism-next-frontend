"use client";

import React, { useEffect, useState } from "react";

/**
 * Utility function to calculate the time difference between a given date and now.
 * @param createdAt - The date to compare (string, number, or Date object)
 * @returns A human-readable string representing the time elapsed.
 */
export const timeCount = (createdAt: string | number | Date): string => {
  if (!createdAt) return "N/A";
  
  const now = new Date();
  const createdDate = new Date(createdAt);
  
  // Handle invalid dates
  if (isNaN(createdDate.getTime())) return "Invalid date";
  
  const diff = now.getTime() - createdDate.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  return `${days} days ago`;
};

/**
 * React Component to display live updating "time ago" text.
 */
interface TimeAgoProps {
  createdAt: string | number | Date;
}

export const TimeAgo: React.FC<TimeAgoProps> = ({ createdAt }) => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const result = timeCount(createdAt);
      setTime(result);
    };

    update(); // Initial call
    const interval = setInterval(update, 60000); // Update every 1 minute

    return () => clearInterval(interval);
  }, [createdAt]);

  return <span>{time}</span>;
};
