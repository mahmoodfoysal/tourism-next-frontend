"use client";

import React, { useState } from "react";
import useAxiosPublic from "@/hooks/useAxiosPublic";

const AIDescriptionGenerator = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const axiosPublic = useAxiosPublic();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !price || isLoading) return;

    setIsLoading(true);
    try {
      const response = await axiosPublic.post(
        "/api/gemini/generate-description",
        {
          title,
          category,
          price,
        },
      );

      if (response.data && response.data.description) {
        setDescription(response.data.description);
      }
    } catch (error) {
      console.error("Error generating description:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-[2.5rem] bg-base-200/50 border border-base-content/5 backdrop-blur-xl shadow-2xl shadow-primary/5 transition-all duration-500 hover:shadow-primary/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div>
          <h4 className="text-xl font-black text-base-content leading-tight">
            AI Description <br />
            <span className="text-primary">Generator</span>
          </h4>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
            Package Title
          </label>
          <input
            type="text"
            placeholder="e.g. Bali Paradise Tour"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-base-100 border border-base-content/5 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g. Luxury"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-base-100 border border-base-content/5 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
              Price ($)
            </label>
            <input
              type="number"
              placeholder="e.g. 500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-base-100 border border-base-content/5 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !title || !category || !price}
          className="btn btn-primary w-full rounded-2xl h-14 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <>
              <span className="font-black tracking-widest uppercase text-xs">
                Generate Magic
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </>
          )}
        </button>
      </form>

      {description && (
        <div className="mt-8 pt-8 border-t border-base-content/5 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-primary">
              Generated Result
            </h5>
            <button
              onClick={() => {
                navigator.clipboard.writeText(description);
                // Optionally show a toast
              }}
              className="btn btn-ghost btn-xs rounded-lg text-primary hover:bg-primary/10 font-bold"
            >
              Copy Text
            </button>
          </div>
          <div className="p-5 rounded-2xl bg-base-100 border border-base-content/5 text-sm text-base-content/70 leading-relaxed font-medium max-h-48 overflow-y-auto custom-scrollbar">
            {description}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDescriptionGenerator;
