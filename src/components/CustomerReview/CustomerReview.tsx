"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import SkeletonCard from "../pages/SkeletonCard";

interface Review {
  _id?: string;
  id: string | number;
  full_name: string;
  email?: string;
  image_url: string;
  rating: number;
  comment: string;
  package_id?: string;
  tour_place: string;
  role?: string;
  status?: number;
}

const CustomerReview = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosPublic.get("/api/tourism/get-review-list");
        const data = response.data?.list_data;
        // Handle both direct array and nested data object
        const result = Array.isArray(data) ? data : data?.data || [];
        setReviews(result);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const itemWidth =
      scrollContainer.querySelector(".review-card")?.clientWidth || 300;
    const scrollAmount =
      direction === "left" ? -(itemWidth + 32) : itemWidth + 32;

    if (
      direction === "right" &&
      scrollContainer.scrollLeft >=
        scrollContainer.scrollWidth - scrollContainer.clientWidth - 50
    ) {
      scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction === "left" && scrollContainer.scrollLeft <= 10) {
      scrollContainer.scrollTo({
        left: scrollContainer.scrollWidth,
        behavior: "smooth",
      });
    } else {
      scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || loading || reviews.length === 0) return;

    const interval = setInterval(() => {
      scroll("right");
    }, 5000);

    return () => clearInterval(interval);
  }, [loading, reviews.length]);

  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviewsCount).toFixed(1)
    : "0.0";

  const recommendations = reviews.filter((r) => (r.rating || 0) >= 4).length;
  const recommendationRate = totalReviewsCount > 0
    ? Math.round((recommendations / totalReviewsCount) * 100)
    : 0;

  return (
    <section className="py-24 bg-base-100">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight mb-6">
              What Our <span className="text-primary">Travelers Say</span>
            </h2>
            <p className="text-lg text-base-content/60 leading-relaxed">
              Do not just take our word for it. Read about the unforgettable
              journeys and experiences shared by our global community of
              adventurers.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-4">
            <button
              onClick={() => scroll("left")}
              className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-white transition-all shadow-lg border border-base-content/5 group"
              aria-label="Previous review"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 transition-transform group-active:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-white transition-all shadow-lg border border-base-content/5 group"
              aria-label="Next review"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 transition-transform group-active:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <SkeletonCard></SkeletonCard>
        ) : (
          <div className="relative group/slider">
            <div
              ref={scrollRef}
              className="flex gap-8 overflow-x-auto custom-scrollbar scroll-smooth snap-x snap-mandatory pb-10 -mb-10"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id || review._id}
                  className="review-card flex-none w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] snap-start relative group"
                >
                  {/* Quote Icon Background */}
                  <div className="absolute -top-4 -right-4 text-primary opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-24 w-24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11M3.01704 21L3.01704 18C3.01704 16.8954 3.91243 16 5.01704 16H8.01704C8.56933 16 9.01704 15.5523 9.01704 15V9C9.01704 8.44772 8.56933 8 8.01704 8H4.01704C3.46476 8 3.01704 8.44772 3.01704 9V11" />
                    </svg>
                  </div>

                  <div className="bg-base-200/50 p-8 rounded-[2.5rem] border border-base-content/5 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                    {/* Stars */}
                    <div className="flex items-center gap-1 text-accent mb-6">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 ${i < review.rating ? "fill-current" : "opacity-20"}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-base-content/80 text-lg italic leading-relaxed mb-8 flex-1">
                      {review.comment}
                    </p>

                    {/* User Info */}
                    <div className="flex items-center gap-4 pt-6 border-t border-base-content/5">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg relative">
                        <Image
                          src={
                            review.image_url ||
                            `https://ui-avatars.com/api/?name=${review.full_name}&background=random`
                          }
                          alt={review.full_name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div>
                        <h4 className="font-black text-base-content">
                          {review.full_name}
                        </h4>
                        <div className="text-sm text-base-content/50 font-bold uppercase tracking-wider">
                          {review.role || "Traveler"}
                        </div>
                        <div className="flex items-center gap-1 text-primary text-[10px] font-bold mt-1 uppercase">
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
                              strokeWidth="3"
                              d="M9 12l2 2 4-4"
                            />
                          </svg>
                          {review.tour_place}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Stats */}
        <div className="mt-20 py-12 rounded-[3rem] bg-gradient-to-r from-primary/10 via-base-200 to-secondary/10 border border-base-content/5 flex flex-wrap justify-around gap-10 items-center px-8 text-center">
          <div>
            <div className="text-4xl font-black text-primary mb-1">
              {averageRating}/5
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-base-content/50">
              Average Rating
            </div>
          </div>
          <div className="w-px h-12 bg-base-content/10 hidden md:block"></div>
          <div>
            <div className="text-4xl font-black text-secondary mb-1">
              {totalReviewsCount > 1000
                ? `${(totalReviewsCount / 1000).toFixed(1)}k+`
                : `${totalReviewsCount}+`}
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-base-content/50">
              Verified Reviews
            </div>
          </div>
          <div className="w-px h-12 bg-base-content/10 hidden md:block"></div>
          <div>
            <div className="text-4xl font-black text-accent mb-1">
              {recommendationRate}%
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-base-content/50">
              Recommendation Rate
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReview;
