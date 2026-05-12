"use client";

import React, { useEffect, useState } from "react";
import tourismApi from "@/api/tourismApi";
import BlogCard from "@/components/pages/BlogCard";
import CommonHeader from "@/components/shared/CommonHeader/CommonHeader";
import DataVoid from "@/components/pages/DataVoid";

import Pagination from "@/components/pages/Pagination";
import SkeletonCard from "@/components/pages/SkeletonCard";

interface Blog {
  _id: string | number;
  id: string | number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  authorImage?: string;
  category: string;
  status: number;
  readingTime: string;
  tags: string[];
  content: string;
}

const BlogsPage = () => {
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Responsive Filter Toggle
  const [showFilters, setShowFilters] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedReadingTimes, setSelectedReadingTimes] = useState<string[]>(
    [],
  );
  const [sortBy, setSortBy] = useState("Latest");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchAll = async () => {
      console.log("🚀 BlogsPage: Initiating API call...");
      setLoading(true);
      try {
        const data = await tourismApi.getTravelBlogs();
        console.log("✅ BlogsPage: API call successful, data received:", data);
        const result = Array.isArray(data) ? data : data?.data || [];
        setAllBlogs(result);
        setFilteredBlogs(result);
      } catch (error) {
        console.error("❌ BlogsPage: API call failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Filter Logic
  useEffect(() => {
    let filtered = allBlogs;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          blog.excerpt.toLowerCase().includes(query) ||
          blog.content.toLowerCase().includes(query) ||
          blog.author.toLowerCase().includes(query) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Category filter (multi-select)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((blog) =>
        selectedCategories.includes(blog.category),
      );
    }

    // Reading Time filter (multi-select)
    if (selectedReadingTimes.length > 0) {
      filtered = filtered.filter((blog) =>
        selectedReadingTimes.includes(blog.readingTime),
      );
    }

    // Sort Logic
    const sorted = [...filtered];
    if (sortBy === "Oldest") {
      sorted.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    } else {
      // Latest (default)
      sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }

    setTimeout(() => {
      setFilteredBlogs(sorted);
      setCurrentPage(1);
    }, 0);
  }, [searchQuery, selectedCategories, selectedReadingTimes, sortBy, allBlogs]);

  // Toggle helpers
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const toggleReadingTime = (time: string) => {
    setSelectedReadingTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    );
  };

  const categories = [...new Set(allBlogs.map((b) => b.category))];
  const readingTimes = [...new Set(allBlogs.map((b) => b.readingTime))];

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isFilterActive =
    searchQuery !== "" ||
    selectedCategories.length > 0 ||
    selectedReadingTimes.length > 0 ||
    sortBy !== "Latest";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedReadingTimes([]);
    setSortBy("Latest");
  };

  return (
    <main className="min-h-screen bg-base-100">
      <CommonHeader
        title="Travel"
        highlightText="Insights"
        subtitle="Stay updated with the latest travel trends, hidden gems, and expert advice from our professional explorers."
      />

      <section className="pb-12">
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
                  Filter Blogs
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
                      Search Articles
                    </h3>
                  </div>

                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Keywords, topics..."
                      className="input input-ghost w-full rounded-2xl bg-base-200/50 border-transparent focus:bg-base-100 focus:border-secondary/20 px-6 font-medium placeholder:text-base-content/30"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Categories Card */}
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

                  <div
                    className={`flex flex-col gap-2 ${categories.length > 4 ? "max-h-[200px] overflow-y-auto pr-2 custom-scrollbar" : ""}`}
                  >
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

                {/* Reading Time Card */}
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-base-content">
                        Read Time
                      </h3>
                    </div>
                    {selectedReadingTimes.length > 0 && (
                      <button
                        onClick={() => setSelectedReadingTimes([])}
                        className="text-[10px] font-black uppercase text-primary hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div
                    className={`flex flex-col gap-2 ${readingTimes.length > 4 ? "max-h-[200px] overflow-y-auto pr-2 custom-scrollbar" : ""}`}
                  >
                    {readingTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => toggleReadingTime(time)}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 ${
                          selectedReadingTimes.includes(time)
                            ? "bg-accent/10 text-accent border border-accent/20"
                            : "bg-base-200/50 text-base-content/50 hover:bg-base-200 border border-transparent"
                        }`}
                      >
                        <span>{time}</span>
                        {selectedReadingTimes.includes(time) && (
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
                      {Math.min(indexOfLastItem, filteredBlogs.length)}
                    </span>{" "}
                    of{" "}
                    <span className="text-base-content">
                      {filteredBlogs.length}
                    </span>{" "}
                    articles
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
                        Latest
                      </option>
                      <option className="bg-base-100 text-base-content">
                        Oldest
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {loading ? (
                <SkeletonCard />
              ) : currentItems.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {currentItems.map((blog) => (
                      <BlogCard key={blog.id || blog._id} info={blog} />
                    ))}
                  </div>

                  {/* Pagination */}
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
                    setSelectedCategories([]);
                    setSelectedReadingTimes([]);
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

export default BlogsPage;
