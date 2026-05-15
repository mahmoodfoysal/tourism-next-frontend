"use client";

import React, { useEffect, useState } from "react";
import PackageCard from "../pages/PackageCard";
import SkeletonCard from "../pages/SkeletonCard";
import Link from "next/link";
import { PackageInfo } from "@/app/page";

interface PopularDestinationsProps {
  packageList: PackageInfo[];
  loading: boolean;
}

const PopularDestinations = ({
  packageList,
  loading,
}: PopularDestinationsProps) => {
  const [displayPackages, setDisplayPackages] = useState<PackageInfo[]>([]);

  useEffect(() => {
    if (packageList && packageList.length > 0) {
      // Filter for popular and active items
      const filtered = packageList.filter(
        (pkg) => pkg.is_popular === 1 && pkg.status === 1
      );
      
      // Shuffle and take 4 random items for the homepage
      const shuffled = [...filtered]
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
        
      setTimeout(() => {
        setDisplayPackages(shuffled);
      }, 0);
    }
  }, [packageList]);

  return (
    <section className="py-24 bg-base-100">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">
              Premium Choice
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight mb-6">
              Popular <span className="text-primary">Packages</span>
            </h2>
            <p className="text-lg text-base-content/60 leading-relaxed">
              Experience the best of world travel with our most-loved, 
              all-inclusive packages designed for unforgettable adventures.
            </p>
          </div>
          <Link
            href="/packages?type=popular"
            className="btn btn-primary rounded-2xl px-8 h-14 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px] hidden md:flex items-center"
          >
            Explore All Places
          </Link>
        </div>

        {/* Destinations Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayPackages.map((item, index) => (
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
            href="/packages?type=popular"
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
