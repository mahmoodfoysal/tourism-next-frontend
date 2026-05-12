"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import SkeletonCard from "../pages/SkeletonCard";
import tourismApi from "@/api/tourismApi";
import Link from "next/link";

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
        const data = await tourismApi.getTravelBlogs();
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
              <div
                key={blog.id || blog._id}
                className="group flex flex-col bg-base-100 rounded-[2.5rem] overflow-hidden border border-base-content/5 shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-primary px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                      {blog.category}
                    </span>
                  </div>
                  <div className="absolute top-6 right-6">
                    <span className="glass-effect px-3 py-1 rounded-lg text-[10px] font-bold text-white border-white/20">
                      {blog.readingTime}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full relative overflow-hidden border border-primary/20">
                        <Image
                          src={
                            blog.authorImage ||
                            `https://ui-avatars.com/api/?name=${blog.author}&background=random`
                          }
                          alt={blog.author}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-bold text-base-content/70">
                        {blog.author}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-base-content/40">
                      {blog.date}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-base-content mb-4 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-base-content/60 leading-relaxed mb-8 flex-1 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {blog.tags?.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold text-primary/60 bg-primary/5 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-base-content/5 mt-auto">
                    <Link 
                      href={`/blogs/details/${blog._id}`}
                      className="flex items-center gap-2 text-primary font-black group-hover:gap-4 transition-all"
                    >
                      Read Full Article
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
                          strokeWidth="3"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TravelBlogs;
