"use client";

import React, { useState, useEffect } from "react";
import CommonHeader from "@/components/shared/CommonHeader/CommonHeader";
import GuideCard, { GuideInfo } from "@/components/pages/GuideCard";
import DataVoid from "@/components/pages/DataVoid";
import Pagination from "@/components/pages/Pagination";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import SkeletonCard from "@/components/pages/SkeletonCard";

const TourGuidesPage = () => {
  const [guides, setGuides] = useState<GuideInfo[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<GuideInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    [],
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedExps, setSelectedExps] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Sorting
  const [sortBy, setSortBy] = useState("Recommended");

  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      try {
        const response = await axiosPublic.get("/api/tourism/get-guide-list");
        const data = response.data?.list_data || [];
        setGuides(data);
        setFilteredGuides(data);
      } catch (error) {
        console.error("Error fetching guides:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, []);

  // Filter Options
  const destinations = [...new Set(guides.map((g) => g.destination))];
  const tourTypes = [...new Set(guides.map((g) => g.tour_type))];
  const allLanguages = [...new Set(guides.flatMap((g) => g.languages))];
  const experienceLevels = ["0-5 Years", "5-10 Years", "10+ Years"];
  const ratingLevels = ["4.5+", "4.8+", "5.0"];

  useEffect(() => {
    let filtered = guides.filter((pkg) => pkg.status === 1);

    if (searchQuery) {
      filtered = filtered.filter(
        (g) =>
          g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.specialty.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedDestinations.length > 0) {
      filtered = filtered.filter((g) =>
        selectedDestinations.includes(g.destination),
      );
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((g) => selectedTypes.includes(g.tour_type));
    }

    if (selectedLanguages.length > 0) {
      filtered = filtered.filter((g) =>
        g.languages.some((lang) => selectedLanguages.includes(lang)),
      );
    }

    if (selectedRatings.length > 0) {
      filtered = filtered.filter((g) => {
        return selectedRatings.some((rate) => {
          const minRating = parseFloat(rate.replace("+", ""));
          return g.rating >= minRating;
        });
      });
    }

    if (selectedExps.length > 0) {
      filtered = filtered.filter((g) => {
        return selectedExps.some((exp) => {
          if (exp === "0-5 Years") return g.experience <= 5;
          if (exp === "5-10 Years")
            return g.experience > 5 && g.experience <= 10;
          if (exp === "10+ Years") return g.experience > 10;
          return false;
        });
      });
    }

    // Sort Logic
    if (sortBy === "Rating: High to Low") {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Experience: High to Low") {
      filtered = [...filtered].sort((a, b) => b.experience - a.experience);
    } else if (sortBy === "Experience: Low to High") {
      filtered = [...filtered].sort((a, b) => a.experience - b.experience);
    }

    setTimeout(() => {
      setFilteredGuides(filtered);
      setCurrentPage(1);
    }, 0);
  }, [
    searchQuery,
    selectedDestinations,
    selectedTypes,
    selectedLanguages,
    selectedRatings,
    selectedExps,
    sortBy,
    guides,
  ]);

  const toggleFilter = (
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) => {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value));
    } else {
      setter([...current, value]);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDestinations([]);
    setSelectedTypes([]);
    setSelectedLanguages([]);
    setSelectedRatings([]);
    setSelectedExps([]);
    setSortBy("Recommended");
  };

  const isFilterActive =
    searchQuery !== "" ||
    selectedDestinations.length > 0 ||
    selectedTypes.length > 0 ||
    selectedLanguages.length > 0 ||
    selectedRatings.length > 0 ||
    selectedExps.length > 0;

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGuides.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGuides.length / itemsPerPage);

  return (
    <main className="min-h-screen bg-base-100">
      <CommonHeader
        title="Meet Our"
        highlightText="Expert Guides"
        subtitle="Travel with local professionals who turn every destination into an unforgettable story."
      />

      <section className="pb-24">
        <div className="route-container">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary w-full rounded-2xl flex items-center justify-between px-6 shadow-lg shadow-secondary/20 h-14"
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
                  Filter Guides
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

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <aside
              className={`w-full lg:w-80 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
            >
              <div className="sticky top-28 space-y-6">
                {/* Search */}
                <div className="bg-base-100 rounded-[2.5rem] border border-base-content/5 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <h3 className="text-sm font-black uppercase tracking-widest text-base-content mb-6 flex items-center gap-3">
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    Search Guide
                  </h3>
                  <input
                    type="text"
                    placeholder="Name or specialty..."
                    className="input input-ghost w-full rounded-2xl bg-base-200/50 border-transparent focus:bg-base-100 focus:border-secondary/20 px-6 font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Destination Filter */}
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-base-content">
                        Destination
                      </h3>
                    </div>
                    {selectedDestinations.length > 0 && (
                      <button
                        onClick={() => setSelectedDestinations([])}
                        className="text-[10px] font-black uppercase text-primary hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {destinations.map((dest) => (
                      <button
                        key={dest}
                        onClick={() =>
                          toggleFilter(
                            selectedDestinations,
                            setSelectedDestinations,
                            dest,
                          )
                        }
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 ${
                          selectedDestinations.includes(dest)
                            ? "bg-accent/10 text-accent border border-accent/20"
                            : "bg-base-200/50 text-base-content/50 hover:bg-base-200 border border-transparent"
                        }`}
                      >
                        <span>{dest}</span>
                        {selectedDestinations.includes(dest) && (
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

                {/* Tour Type Filter */}
                <div className="bg-base-100 rounded-[2.5rem] border border-base-content/5 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
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
                            d="M9 20l-5.447-2.724A2 2 0 013 15.483V8.517a2 2 0 011.553-1.943L9 5m6 15l5.447-2.724A2 2 0 0121 15.483V8.517a2 2 0 01-1.553-1.943L15 5m-6 15V5m6 15V5"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-base-content">
                        Tour Type
                      </h3>
                    </div>
                    {selectedTypes.length > 0 && (
                      <button
                        onClick={() => setSelectedTypes([])}
                        className="text-[10px] font-black uppercase text-primary hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {tourTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          toggleFilter(selectedTypes, setSelectedTypes, type)
                        }
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 ${
                          selectedTypes.includes(type)
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-base-200/50 text-base-content/50 hover:bg-base-200 border border-transparent"
                        }`}
                      >
                        <span>{type}</span>
                        {selectedTypes.includes(type) && (
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

                {/* Language Filter */}
                <div className="bg-base-100 rounded-[2.5rem] border border-base-content/5 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
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
                            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-base-content">
                        Language
                      </h3>
                    </div>
                    {selectedLanguages.length > 0 && (
                      <button
                        onClick={() => setSelectedLanguages([])}
                        className="text-[10px] font-black uppercase text-primary hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {allLanguages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() =>
                          toggleFilter(
                            selectedLanguages,
                            setSelectedLanguages,
                            lang,
                          )
                        }
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 ${
                          selectedLanguages.includes(lang)
                            ? "bg-secondary/10 text-secondary border border-secondary/20"
                            : "bg-base-200/50 text-base-content/50 hover:bg-base-200 border border-transparent"
                        }`}
                      >
                        <span>{lang}</span>
                        {selectedLanguages.includes(lang) && (
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

                {/* Rating Filter */}
                <div className="bg-base-100 rounded-[2.5rem] border border-base-content/5 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
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
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-base-content">
                        Rating
                      </h3>
                    </div>
                    {selectedRatings.length > 0 && (
                      <button
                        onClick={() => setSelectedRatings([])}
                        className="text-[10px] font-black uppercase text-primary hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {ratingLevels.map((rate) => (
                      <button
                        key={rate}
                        onClick={() =>
                          toggleFilter(
                            selectedRatings,
                            setSelectedRatings,
                            rate,
                          )
                        }
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 ${
                          selectedRatings.includes(rate)
                            ? "bg-warning/10 text-warning border border-warning/20"
                            : "bg-base-200/50 text-base-content/50 hover:bg-base-200 border border-transparent"
                        }`}
                      >
                        <span>{rate}</span>
                        {selectedRatings.includes(rate) && (
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

                {/* Experience Filter */}
                <div className="bg-base-100 rounded-[2.5rem] border border-base-content/5 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-info/10 flex items-center justify-center text-info">
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
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-base-content">
                        Experience
                      </h3>
                    </div>
                    {selectedExps.length > 0 && (
                      <button
                        onClick={() => setSelectedExps([])}
                        className="text-[10px] font-black uppercase text-primary hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {experienceLevels.map((exp) => (
                      <button
                        key={exp}
                        onClick={() =>
                          toggleFilter(selectedExps, setSelectedExps, exp)
                        }
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 ${
                          selectedExps.includes(exp)
                            ? "bg-info/10 text-info border border-info/20"
                            : "bg-base-200/50 text-base-content/50 hover:bg-base-200 border border-transparent"
                        }`}
                      >
                        <span>{exp}</span>
                        {selectedExps.includes(exp) && (
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
                      {Math.min(indexOfLastItem, filteredGuides.length)}
                    </span>{" "}
                    of{" "}
                    <span className="text-base-content">
                      {filteredGuides.length}
                    </span>{" "}
                    professionals
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
                  <div className="flex items-center gap-2 px-4 py-2 bg-base-100 border border-base-content/10 rounded-2xl shadow-sm focus-within:border-secondary/30 transition-all w-60">
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
                        Recommended
                      </option>
                      <option className="bg-base-100 text-base-content">
                        Rating: High to Low
                      </option>
                      <option className="bg-base-100 text-base-content">
                        Experience: High to Low
                      </option>
                      <option className="bg-base-100 text-base-content">
                        Experience: Low to High
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {[...Array(8)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : filteredGuides.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {currentItems.map((guide) => (
                      <GuideCard key={guide._id} guide={guide} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-16">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        paginate={(p) => {
                          setCurrentPage(p);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-base-200/50 rounded-[3rem] p-20">
                  <DataVoid onReset={resetFilters} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TourGuidesPage;
