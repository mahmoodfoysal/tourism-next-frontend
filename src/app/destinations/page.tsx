"use client";

import React, { useEffect, useState } from "react";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import PopularCard from "@/components/pages/PopularCard";
import CommonHeader from "@/components/shared/CommonHeader/CommonHeader";
import DataVoid from "@/components/pages/DataVoid";

import Pagination from "@/components/pages/Pagination";
import SkeletonCard from "@/components/pages/SkeletonCard";

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

const DestinationsPage = () => {
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<
    Destination[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Responsive Filter Toggle
  const [showFilters, setShowFilters] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Featured");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchAll = async () => {
      console.log("🚀 DestinationsPage: Initiating API call...");
      setLoading(true);
      try {
        const response = await axiosPublic.get(
          "/api/tourism/get-popular-dest-list",
        );
        const data = response.data?.list_data;
        console.log(
          "✅ DestinationsPage: API call successful, data received:",
          data,
        );
        const result = Array.isArray(data) ? data : data?.data || [];
        setAllDestinations(result);
        setFilteredDestinations(result);
      } catch (error) {
        console.error("❌ DestinationsPage: API call failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Filter Logic
  useEffect(() => {
    let filtered = allDestinations;

    // Search filter (searches name, location, descriptions, badge, and itinerary)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (dest) =>
          dest.name.toLowerCase().includes(query) ||
          dest.location.toLowerCase().includes(query) ||
          dest.shortDescription.toLowerCase().includes(query) ||
          dest.longDescription.toLowerCase().includes(query) ||
          dest.badge.toLowerCase().includes(query) ||
          dest.bestTimeToVisit.toLowerCase().includes(query) ||
          dest.nearbyAttractions.some((attr) =>
            attr.toLowerCase().includes(query),
          ),
      );
    }

    // Price filter
    filtered = filtered.filter((dest) => dest.price <= priceRange);

    // Badge filter (multi-select)
    if (selectedBadges.length > 0) {
      filtered = filtered.filter((dest) => selectedBadges.includes(dest.badge));
    }

    // Sort Logic
    const sorted = [...filtered];
    if (sortBy === "Price: Low to High") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Top Rated") {
      sorted.sort((a, b) => b.rating - a.rating);
    }

    setTimeout(() => {
      setFilteredDestinations(sorted);
      setCurrentPage(1);
    }, 0);
  }, [searchQuery, priceRange, selectedBadges, sortBy, allDestinations]);

  // Toggle helper
  const toggleBadge = (badge: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge],
    );
  };

  const badges = [...new Set(allDestinations.map((d) => d.badge))];

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDestinations.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isFilterActive =
    searchQuery !== "" ||
    priceRange !== 5000 ||
    selectedBadges.length > 0 ||
    sortBy !== "Featured";

  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange(5000);
    setSelectedBadges([]);
    setSortBy("Featured");
  };

  return (
    <main className="min-h-screen bg-base-100">
      <CommonHeader
        title="Explore All"
        highlightText="Destinations"
        subtitle="Browse through our entire collection of world-class destinations and find your next adventure."
      />

      <section className="pb-12">
        <div className="route-container">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-primary w-full rounded-2xl flex items-center justify-between px-6 shadow-lg shadow-primary/20 h-14"
            >
              <span className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                <span className="font-black uppercase tracking-widest text-xs">
                  Filter Destinations
                </span>
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Filters */}
            <aside
              className={`w-full lg:w-80 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
            >
              <div className="sticky top-28 space-y-6">
                {/* Search Card */}
                <div className="bg-base-100 rounded-[2.5rem] border border-base-content/5 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-base-content">
                      Quick Search
                    </h3>
                  </div>

                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Destination, activity..."
                      className="input input-ghost w-full rounded-2xl bg-base-200/50 border-transparent focus:bg-base-100 focus:border-primary/20 px-6 font-medium placeholder:text-base-content/30"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Price Range Card */}
                <div className="bg-base-100 rounded-[2.5rem] border border-base-content/5 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-base-content">
                      Price Limit
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <input
                      type="range"
                      min="500"
                      max="5000"
                      step="100"
                      className="range range-primary range-xs"
                      value={priceRange}
                      onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    />
                    <div className="flex justify-between items-center bg-base-200/50 px-4 py-3 rounded-2xl">
                      <span className="text-[10px] font-black uppercase text-base-content/30 tracking-wider">
                        Budget
                      </span>
                      <span className="text-lg font-black text-primary">
                        ${priceRange}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Categories Card */}
                <div className="bg-base-100 rounded-[2.5rem] border border-base-content/5 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-base-content">
                        Categories
                      </h3>
                    </div>
                    {selectedBadges.length > 0 && (
                      <button
                        onClick={() => setSelectedBadges([])}
                        className="text-[10px] font-black uppercase text-primary hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div
                    className={`flex flex-col gap-2 ${badges.length > 4 ? "max-h-[200px] overflow-y-auto pr-2 custom-scrollbar" : ""}`}
                  >
                    {badges.map((badge) => (
                      <button
                        key={badge}
                        onClick={() => toggleBadge(badge)}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 ${
                          selectedBadges.includes(badge)
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-base-200/50 text-base-content/50 hover:bg-base-200 border border-transparent"
                        }`}
                      >
                        <span>{badge}</span>
                        {selectedBadges.includes(badge) && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Content Grid */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 px-2 gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-base-content/50 font-bold">
                    Showing{" "}
                    <span className="text-base-content">
                      {indexOfFirstItem + 1}-
                      {Math.min(indexOfLastItem, filteredDestinations.length)}
                    </span>{" "}
                    of{" "}
                    <span className="text-base-content">
                      {filteredDestinations.length}
                    </span>{" "}
                    destinations
                  </p>
                  {isFilterActive && (
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors group"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 transition-transform group-hover:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Reset All Filters
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-base-100 border border-base-content/10 rounded-2xl shadow-sm focus-within:border-primary/30 transition-all w-60">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-base-content/30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                      />
                    </svg>
                    <span className="text-[10px] font-black uppercase text-base-content/40 tracking-widest whitespace-nowrap border-r border-base-content/10 pr-3 mr-1">
                      Sort
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="select select-ghost select-sm h-auto min-h-0 border-none focus:bg-transparent focus:outline-none font-bold text-sm text-base-content pl-1 pr-8 bg-none flex-1 w-full"
                    >
                      <option className="bg-base-100 text-base-content">
                        Featured
                      </option>
                      <option className="bg-base-100 text-base-content">
                        Price: Low to High
                      </option>
                      <option className="bg-base-100 text-base-content">
                        Price: High to Low
                      </option>
                      <option className="bg-base-100 text-base-content">
                        Top Rated
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : currentItems.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {currentItems.map((dest) => (
                      <PopularCard key={dest.pop_id || dest._id} info={dest} />
                    ))}
                  </div>

                  {/* Ultra-Modern Floating Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      paginate={paginate}
                    />
                  )}
                </>
              ) : (
                <DataVoid
                  onReset={() => {
                    setSearchQuery("");
                    setPriceRange(5000);
                    setSelectedBadges([]);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DestinationsPage;
