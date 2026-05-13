"use client";

import React, { useEffect, useState } from "react";
import PopularCard from "../pages/PopularCard";
import SkeletonCard from "../pages/SkeletonCard";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import Link from "next/link";

interface Destination {
  _id: string | number;
  pop_id: string | number;
  image: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  badge: string;
  shortDescription: string;
  longDescription: string;
  moreImage: string[];
  status: number;
  discount: string;
  itinerary: { day: number; title: string; activities: string[] }[];
  bestTimeToVisit: string;
  nearbyAttractions: string[];
}

const PopularDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosPublic.get("/api/tourism/get-popular-dest-list");
        const data = response.data?.list_data;
        const result = Array.isArray(data) ? data : data?.data || [];
        const shuffled = [...result]
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setDestinations(shuffled);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setError("We could not retrieve the tactical details for this voyage. Please check your connection and retry.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <section className="py-24 bg-base-100">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">
              Global Hotspots
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight mb-6">
              Popular <span className="text-primary">Destinations</span>
            </h2>
            <p className="text-lg text-base-content/60 leading-relaxed">
              Discover our handpicked collection of the worlds most sought-after
              travel spots, from serene beaches to majestic mountains.
            </p>
          </div>
          <Link
            href="/destinations"
            className="btn btn-primary rounded-2xl px-8 h-14 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px] hidden md:flex items-center"
          >
            Explore All Places
          </Link>
        </div>

        {/* Destinations Grid */}
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-base-200/50 rounded-[3rem] border border-dashed border-base-content/20 text-center px-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-error mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-xl font-black text-base-content mb-2">
              Connection Interrupted
            </h3>
            <p className="text-base-content/60 max-w-md leading-relaxed">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-outline btn-primary mt-8 rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px]"
            >
              Retry Connection
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {destinations.map((dest) => (
              <PopularCard key={dest.pop_id || dest._id} info={dest} />
            ))}
          </div>
        )}

        {/* Mobile View All Bottom CTA */}
        <div className="mt-12 text-center md:hidden">
          <Link
            href="/destinations"
            className="btn btn-primary w-full rounded-2xl h-14 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px]"
          >
            Explore All Places
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
