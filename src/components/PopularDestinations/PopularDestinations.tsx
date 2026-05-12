"use client";

import React, { useEffect, useState } from "react";
import PopularCard from "../pages/PopularCard";
import tourismApi from "@/api/tourismApi";
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

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await tourismApi.getPopularDestinations();
        // Handle both direct array and nested data object
        const result = Array.isArray(data) ? data : data?.data || [];
        // Shuffle and take 4 random items
        const shuffled = [...result]
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setDestinations(shuffled);
      } catch (error) {
        console.error("Error fetching destinations:", error);
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">
              Global Hotspots
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight">
              Popular <span className="text-primary">Destinations</span>
            </h2>
            <p className="mt-4 text-lg text-base-content/60 leading-relaxed">
              Discover our handpicked collection of the worlds most sought-after
              travel spots, from serene beaches to majestic mountains.
            </p>
          </div>
          <Link
            href="/destinations"
            className="btn btn-outline border-base-content/10 hover:bg-primary hover:border-primary px-8 rounded-2xl hidden md:flex transition-all duration-300 font-bold"
          >
            View All Places
          </Link>
        </div>

        {/* Destinations Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {destinations.map((dest) => (
              <PopularCard key={dest.pop_id || dest._id} info={dest} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularDestinations;
