"use client";

import React, { useEffect, useState } from "react";
import PackageCard from "../pages/PackageCard";
import tourismApi from "@/api/tourismApi";

interface TourPackage {
  _id: string | number;
  package_id: string | number;
  image: string;
  title: string;
  duration: string;
  discount: string;
  location: string;
  features: string[];
  originalPrice: number | string;
  price: number | string;
}

const TourPackage = () => {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await tourismApi.getTourPackages();
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
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-xs uppercase tracking-widest mb-4">
            Exclusive Deals
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight mb-6">
            Amazing <span className="text-secondary">Tour Packages</span>
          </h2>
          <p className="text-lg text-base-content/60 leading-relaxed">
            Choose from our curated selection of all-inclusive packages designed
            to provide the ultimate travel experience without any hassle.
          </p>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-secondary"></span>
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

        {/* View All Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-base-content/50 font-medium mb-6 italic">
            Want something different? We can create a custom package for you!
          </p>
          <button className="btn btn-outline border-base-content/10 rounded-2xl px-12 hover:bg-secondary hover:border-secondary transition-all duration-300">
            Explore All Packages
          </button>
        </div>
      </div>
    </section>
  );
};

export default TourPackage;
