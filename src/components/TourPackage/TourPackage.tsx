"use client";

import React, { useEffect, useState } from "react";
import PackageCard from "../pages/PackageCard";
import SkeletonCard from "../pages/SkeletonCard";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import Link from "next/link";

interface TourPackage {
  _id: string | number;
  package_id: string | number;
  image: string;
  title: string;
  duration: string;
  category: string;
  discount: number | string;
  location: string;
  features: string[];
  originalPrice: number;
  price: number;
}

const TourPackage = () => {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axiosPublic.get("/api/tourism/get-package-list");
        const data = response.data?.list_data;
        // Handle both direct array and nested data object
        const result = Array.isArray(data) ? data : data?.data || [];
        // Shuffle and take 4 random items
        const shuffled = [...result]
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setPackages(shuffled);
      } catch (error) {
        console.error("Error fetching tour packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <section className="py-24 bg-base-200/30">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">
              Premium Experiences
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight mb-6">
              Amazing <span className="text-primary">Tour Packages</span>
            </h2>
            <p className="text-lg text-base-content/60 leading-relaxed">
              Discover our most sought-after adventures, hand-picked for their 
              exceptional value and unforgettable experiences across the globe.
            </p>
          </div>
          <Link 
            href="/packages"
            className="btn btn-primary rounded-2xl px-8 h-14 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px] hidden md:flex items-center"
          >
            Explore All Packages
          </Link>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {packages.map((item, index) => (
              <PackageCard
                key={item.package_id || item._id || index}
                info={item}
              />
            ))}
          </div>
        )}

        {/* Mobile View All Bottom CTA */}
        <div className="mt-12 text-center md:hidden">
          <Link 
            href="/packages"
            className="btn btn-primary w-full rounded-2xl h-14 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px]"
          >
            Explore All Packages
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TourPackage;
