"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import SkeletonCard from "../pages/SkeletonCard";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import Link from "next/link";
import BlogCard from "../pages/BlogCard";

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

const TravelBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosPublic.get("/api/tourism/get-blog-list");
        const data = response.data?.list_data;
        // Handle both direct array and nested data object
        const result = Array.isArray(data) ? data : data?.data || [];
        // Shuffle and take 4 random items
        const shuffled = [...result]
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setBlogs(shuffled);
      } catch (error) {
        console.error("Error fetching travel blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="py-24 bg-base-200/30">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">
              Latest Articles
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight mb-6">
              Travel <span className="text-primary">Insights</span>
            </h2>
            <p className="text-lg text-base-content/60 leading-relaxed">
              Stay updated with the latest travel trends, hidden gems, and
              expert advice from our professional explorers.
            </p>
          </div>
          <Link
            href="/blogs"
            className="btn btn-primary rounded-2xl px-8 h-14 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px] hidden md:flex items-center"
          >
            Explore All Blogs
          </Link>
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} info={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TravelBlogs;
