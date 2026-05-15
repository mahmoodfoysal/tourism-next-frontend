"use client";

import React, { useState, useEffect } from "react";
import CommonHeader from "@/components/shared/CommonHeader/CommonHeader";
import Image from "next/image";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import Pagination from "@/components/pages/Pagination";
import SkeletonCard from "@/components/pages/SkeletonCard";

interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  poster_image: string;
  location?: string;
  more_image?: string[];
}

const GalleryPage = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [animate, setAnimate] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Lightbox State
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const response = await axiosPublic.get(
          "/api/tourism/get-galary-photo-list",
        );
        if (response.data?.list_data) {
          setItems(response.data.list_data);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = Array.from(
    new Set(items.map((item) => item.category)),
  ).filter(Boolean);

  // Filter Logic
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location &&
        item.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(item.category);
    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(false);
    }, 0);
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, [currentPage, searchQuery, selectedCategories]);

  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 0);
  }, [searchQuery, selectedCategories]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const isFilterActive = searchQuery !== "" || selectedCategories.length > 0;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
  };

  return (
    <main className="min-h-screen bg-base-100">
      <CommonHeader
        title="Travel Gallery"
        subtitle="Visual stories from around the globe captured by our global community of travelers."
      />

      <section className="pb-20">
        <div className="route-container">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full btn btn-secondary h-14 rounded-2xl flex items-center justify-between px-6 shadow-xl shadow-secondary/20"
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
                <span className="font-black uppercase tracking-widest text-[11px]">
                  Filter Gallery
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
            {/* Sidebar Filters - Matched with Packages Style */}
            <aside
              className={`w-full lg:w-80 shrink-0 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}
            >
              {/* Search Card */}
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-base-content">
                    Find Story
                  </h3>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search title, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input input-ghost w-full h-12 rounded-2xl bg-base-200/50 border-transparent focus:bg-base-100 focus:border-secondary/20 px-6 font-medium placeholder:text-base-content/30"
                  />
                </div>
              </div>

              {/* Category Filter Card */}
              {categories.length > 0 && (
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
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-base-content">
                        Categories
                      </h3>
                    </div>
                    {selectedCategories.length > 0 && (
                      <button
                        onClick={() => setSelectedCategories([])}
                        className="text-[10px] font-black uppercase text-primary hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 ${
                          selectedCategories.includes(cat)
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-base-200/50 text-base-content/50 hover:bg-base-200 border border-transparent"
                        }`}
                      >
                        <span>{cat}</span>
                        {selectedCategories.includes(cat) && (
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
              )}

              {/* Submission Prompt */}
              {/* <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary to-secondary text-white shadow-2xl shadow-primary/20 hidden lg:block overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="text-lg font-black uppercase leading-tight mb-2">
                  Join the Story
                </h4>
                <p className="text-[10px] font-medium text-white/70 leading-relaxed mb-6">
                  Contribute your experiences to our global traveler community.
                </p>
                <button className="w-full py-3 rounded-xl bg-white text-primary text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                  Submit Now
                </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            </div> */}
            </aside>

            {/* Main Gallery Area */}
            <div className="flex-1 space-y-12">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-base-content/50 font-bold">
                    Showing{" "}
                    <span className="text-base-content">
                      {indexOfFirstItem + 1}-
                      {Math.min(indexOfLastItem, filteredItems.length)}
                    </span>{" "}
                    of{" "}
                    <span className="text-base-content">
                      {filteredItems.length}
                    </span>{" "}
                    stories
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px]">
                {loading ? (
                  <SkeletonCard></SkeletonCard>
                ) : currentItems.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-40 text-center gap-4">
                    <p className="text-base-content/30 font-black uppercase tracking-widest">
                      No matching stories found
                    </p>
                    <button
                      onClick={resetFilters}
                      className="text-primary text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  currentItems.map((item, idx) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        setSelectedPhoto(item);
                        setActiveImage(item.poster_image);
                      }}
                      className={`group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-base-200 shadow-xl transition-all duration-700 cursor-pointer ${
                        animate
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-10"
                      }`}
                      style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                      <Image
                        src={item.poster_image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        unoptimized
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute bottom-10 left-10 right-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 rounded-lg bg-primary text-white text-[8px] font-black uppercase tracking-widest">
                              {item.category}
                            </span>
                            {item.location && (
                              <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                {item.location}
                              </span>
                            )}
                          </div>
                          <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-4">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-10">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && activeImage && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors p-2 z-[120]"
            onClick={() => setSelectedPhoto(null)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div
            className="max-w-5xl w-full flex flex-col gap-4 md:gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image Display Area */}
            <div className="relative aspect-[4/3] md:aspect-video w-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-white/5">
              <Image
                src={activeImage}
                alt={selectedPhoto.title}
                fill
                className="object-contain transition-all duration-700 animate-in fade-in zoom-in-95"
                priority
                unoptimized
              />

              {/* Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-black/90 to-transparent">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 md:px-3 py-1 rounded-lg bg-primary text-white text-[7px] md:text-[8px] font-black uppercase tracking-widest">
                    {selectedPhoto.category}
                  </span>
                  {selectedPhoto.location && (
                    <span className="text-white/60 text-[8px] md:text-[9px] font-bold uppercase tracking-widest">
                      {selectedPhoto.location}
                    </span>
                  )}
                </div>
                <h3 className="text-white text-xl md:text-3xl font-black uppercase tracking-tight">
                  {selectedPhoto.title}
                </h3>
              </div>
            </div>

            {/* Thumbnails Navigation */}
            {(selectedPhoto.more_image?.length ?? 0) > 0 && (
              <div className="flex gap-3 md:gap-4 overflow-x-auto custom-scrollbar-none pb-4 -mb-4 justify-start md:justify-center px-4">
                {/* Poster Thumbnail */}
                <button
                  onClick={() => setActiveImage(selectedPhoto.poster_image)}
                  className={`relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    activeImage === selectedPhoto.poster_image
                      ? "border-primary scale-110 shadow-lg shadow-primary/20"
                      : "border-white/10 opacity-50 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <Image
                    src={selectedPhoto.poster_image}
                    alt="Cover"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>

                {/* Additional Images */}
                {selectedPhoto.more_image?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImage === img
                        ? "border-primary scale-110 shadow-lg shadow-primary/20"
                        : "border-white/10 opacity-50 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default GalleryPage;
