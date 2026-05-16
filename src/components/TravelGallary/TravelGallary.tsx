"use client";

import React, { useEffect, useState } from "react";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import SkeletonCard from "../pages/SkeletonCard";
import Link from "next/link";

interface Photo {
  _id: string;
  title: string;
  poster_image: string;
  more_image?: string[];
  category?: string;
  status: number;
}

const TravelGallary = () => {
  const [photos, setPhotos] = useState<(Photo & { span: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axiosPublic.get(
          "/api/tourism/get-galary-photo-list",
        );
        const listData = response.data?.list_data.filter(
          (pkg: Photo) => pkg.status === 1,
        );

        // Randomize and take exactly 7
        const shuffled = [...listData].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 7);

        // Pre-defined high-end mosaic spans for exactly 7 items
        const spans = [
          "col-span-1 row-span-1", // Item 1
          "col-span-1 lg:col-span-2 row-span-1 lg:row-span-2", // Item 2 (Large Hero)
          "col-span-1 row-span-1", // Item 3
          "col-span-1 row-span-1", // Item 4
          "col-span-1 row-span-1", // Item 5
          "col-span-1 lg:col-span-2 row-span-1", // Item 6 (Wide)
          "col-span-1 lg:col-span-2 row-span-1", // Item 7
        ];

        const photosWithSpans = selected.map((photo, index) => ({
          ...photo,
          span: spans[index] || "col-span-1 row-span-1",
        }));

        setPhotos(photosWithSpans);
      } catch (error) {
        console.error("Error fetching gallery photos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Initialize activeImage when a photo is selected
  useEffect(() => {
    if (selectedPhoto) {
      setTimeout(() => {
        setActiveImage(selectedPhoto.poster_image);
      }, 0);
    } else {
      setTimeout(() => {
        setActiveImage(null);
      }, 0);
    }
  }, [selectedPhoto]);

  return (
    <section className="py-24 bg-base-200/50">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">
              Visual Journey
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight mb-6">
              Travel <span className="text-primary">Gallery</span>
            </h2>
            <p className="text-lg text-base-content/60 leading-relaxed">
              Explore the beauty of the world through our lens. A collection of
              unforgettable moments from our travelers.
            </p>
          </div>
          <Link
            href="/gallery"
            className="btn btn-primary rounded-2xl px-8 h-14 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px] hidden md:flex items-center"
          >
            View All Photos
          </Link>
        </div>

        {/* Mosaic Grid */}
        {loading ? (
          <SkeletonCard></SkeletonCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[250px]">
            {photos.map((photo) => (
              <div
                key={photo._id}
                onClick={() => setSelectedPhoto(photo)}
                className={`group relative overflow-hidden rounded-[2rem] shadow-xl cursor-pointer ${photo.span}`}
              >
                <img
                  src={photo.poster_image}
                  alt={photo.title || "Gallery Photo"}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {photo.category || "Travel"}
                  </span>
                  <h3 className="text-white text-xl font-black transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    {photo.title || "Unforgettable Moments"}
                  </h3>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white">
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
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedPhoto && activeImage && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors p-2 z-50"
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
              className="max-w-5xl w-full flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Poster Display Area */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl group/main bg-white/5">
                <img
                  src={activeImage}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain transition-all duration-700 animate-in fade-in zoom-in-95"
                />

                {/* Image Meta Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparen hidden md:block">
                  <h3 className="text-white text-base md:text-3xl font-black uppercase tracking-tight">
                    {selectedPhoto.title}
                  </h3>
                </div>
              </div>

              {/* Thumbnails Row */}
              <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4 -mb-4 justify-center">
                {/* Poster Thumbnail */}
                <button
                  onClick={() => setActiveImage(selectedPhoto.poster_image)}
                  className={`relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    activeImage === selectedPhoto.poster_image
                      ? "border-primary scale-110 shadow-lg shadow-primary/20"
                      : "border-white/10 opacity-50 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <img
                    src={selectedPhoto.poster_image}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </button>

                {/* More Images Thumbnails */}
                {selectedPhoto.more_image?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImage === img
                        ? "border-primary scale-110 shadow-lg shadow-primary/20"
                        : "border-white/10 opacity-50 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TravelGallary;
