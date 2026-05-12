"use client";

import React, { useEffect, useState, use } from "react";
import tourismApi from "@/api/tourismApi";
import Image from "next/image";
import CommonHeader from "@/components/shared/CommonHeader/CommonHeader";
import DataVoid from "@/components/pages/DataVoid";
import SkeletonDetails from "@/components/pages/SkeletonDetails";

interface BlogDetails {
  _id: string | number;
  id: string | number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  authorImage: string;
  category: string;
  status: number;
  readingTime: string;
  tags: string[];
  content: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const BlogDetailsPage = ({ params }: PageProps) => {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [blog, setBlog] = useState<BlogDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      setLoading(true);
      try {
        const data = await tourismApi.getBlogDetails(id);
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetails();
  }, [id]);

  if (loading) return <SkeletonDetails />;

  if (!blog) return <DataVoid />;

  return (
    <main className="min-h-screen bg-base-100">
      <CommonHeader
        title="Travel"
        highlightText="Insights"
        subtitle={blog.title}
      />

      <article className="pb-24">
        <div className="route-container">
          <div className="max-w-4xl mx-auto">
            {/* Blog Hero Image */}
            <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl mb-12">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-10 left-10 right-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-primary px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                    {blog.category}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
                    {blog.readingTime}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  {blog.title}
                </h1>
              </div>
            </div>

            {/* Author & Meta Section */}
            <div className="flex flex-wrap items-center justify-between gap-8 py-8 border-b border-base-content/5 mb-12">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-primary/20">
                  <Image
                    src={
                      blog.authorImage ||
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100"
                    }
                    alt={blog.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-black text-base-content leading-none mb-1">
                    {blog.author}
                  </h4>
                  <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest">
                    Travel Writer
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-base-content/30 mb-1">
                    Published On
                  </span>
                  <span className="text-sm font-black text-base-content">
                    {blog.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="prose prose-lg max-w-none text-base-content/70 leading-relaxed space-y-8">
              <p className="text-xl font-medium text-base-content/80 leading-relaxed italic border-l-4 border-primary pl-8 py-4 bg-primary/5 rounded-r-3xl">
                {blog.excerpt}
              </p>
              
              <div 
                className="blog-content space-y-6"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            {/* Tags Section */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-base-content/5">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-widest text-base-content/30">
                    Related Tags:
                  </span>
                  {blog.tags.map((tag, i) => (
                    <span 
                      key={i}
                      className="px-4 py-2 bg-base-200 rounded-xl text-xs font-bold text-base-content/60 hover:bg-primary hover:text-white transition-all cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </main>
  );
};

export default BlogDetailsPage;
