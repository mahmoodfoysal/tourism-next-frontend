import React from "react";
import Link from "next/link";

interface BlogInfo {
  _id: string | number;
  id: string | number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  authorImage?: string;
  category: string;
  readingTime: string;
  tags: string[];
}

interface BlogCardProps {
  info: BlogInfo;
}

const BlogCard: React.FC<BlogCardProps> = ({ info }) => {
  return (
    <div className="group flex flex-col bg-base-100 rounded-[2.5rem] overflow-hidden border border-base-content/5 shadow-xl hover:shadow-2xl transition-all duration-500">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Link
          href={`/blogs/details/${info._id}`}
          className="block w-full h-full"
        >
          <img
            src={info.image}
            alt={info.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        <div className="absolute top-6 left-6">
          <span className="bg-primary/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20">
            {info.category}
          </span>
        </div>
        <div className="absolute top-6 right-6">
          <span className="glass-effect px-3 py-1 rounded-lg text-[10px] font-bold text-white border-white/20">
            {info.readingTime}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full relative overflow-hidden border border-primary/20 shrink-0">
              <img
                src={
                  info.authorImage ||
                  `https://ui-avatars.com/api/?name=${info.author}&background=random`
                }
                alt={info.author}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[12px] font-bold text-base-content/70 truncate max-w-[100px]">
              {info.author}
            </span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-base-content/30">
            {info.date}
          </span>
        </div>

        <h3 className="text-lg font-black text-base-content mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2">
          {info.title}
        </h3>

        <p className="text-[13px] text-base-content/50 leading-relaxed mb-6 flex-1 line-clamp-3">
          {info.excerpt}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {info.tags?.map((tag: string, i: number) => (
            <span
              key={i}
              className="text-[9px] font-black uppercase tracking-wider text-primary/60 bg-primary/5 px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="pt-5 border-t border-base-content/5 mt-auto">
          <Link 
            href={`/blogs/details/${info._id}`}
            className="flex items-center gap-2 text-primary text-[12px] font-black uppercase tracking-widest group-hover:gap-3 transition-all"
          >
            Read Article
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
                strokeWidth="3"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
