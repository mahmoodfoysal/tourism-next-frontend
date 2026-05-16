"use client";

import React, { useState, useEffect } from "react";
import CommonHeader from "@/components/shared/CommonHeader/CommonHeader";
import Link from "next/link";
import { axiosPublic } from "@/hooks/useAxiosPublic";

const AboutPage = () => {
  const [avgRating, setAvgRating] = useState(4.9);
  const [reviewCount, setReviewCount] = useState(10000);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosPublic.get("/api/tourism/get-review-list");
        const data = response.data?.list_data;
        const result = Array.isArray(data) ? data : data?.data || [];

        if (result.length > 0) {
          const totalRating = result.reduce(
            (acc: number, rev: any) => acc + (rev.rating || 0),
            0,
          );
          const avg = totalRating / result.length;
          setAvgRating(Number(avg.toFixed(1)));
          setReviewCount(result.length);
        }
      } catch (error) {
        console.error("Error fetching reviews for About page:", error);
      }
    };
    fetchReviews();
  }, []);

  const stats = [
    { label: "Years Experience", value: "4+", color: "primary" },
    {
      label: "Happy Travelers",
      value:
        reviewCount > 1000
          ? `${(reviewCount / 1000).toFixed(1)}k+`
          : `${reviewCount}K+`,
      color: "secondary",
    },
    { label: "Destinations", value: "50+", color: "accent" },
    { label: "Local Guides", value: "150+", color: "primary" },
  ];

  const values = [
    {
      title: "Integrity First",
      description:
        "We believe in honest pricing and authentic experiences without hidden agendas.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: "Expert Curation",
      description:
        "Every itinerary is hand-picked and tested by our travel experts to ensure excellence.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
    },
    {
      title: "Sustainability",
      description:
        "We are committed to eco-friendly travel that supports and preserves local communities.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2 2 2 0 012 2v.654M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-base-100">
      <CommonHeader
        title="Our"
        highlightText="Legacy"
        subtitle="Crafting unforgettable stories since 2012, one destination at a time."
      />

      {/* Story Section */}
      <section className="pb-10">
        <div className="route-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000"
                alt="Our Story"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 flex items-center gap-4 bg-white/20 backdrop-blur-xl p-6 rounded-3xl border border-white/20">
                <div className="text-4xl font-black text-white">4</div>
                <div className="text-xs font-black uppercase tracking-widest text-white/80 leading-tight">
                  Years of <br /> Excellence
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest">
                Our Genesis
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight leading-tight">
                We Do not Just Plan Trips, We{" "}
                <span className="text-primary">Create Memories</span>
              </h2>
              <p className="text-lg text-base-content/60 leading-relaxed">
                Founded in 2012 by a group of passionate explorers, Aura Trip
                was born out of a desire to bring authenticity back to travel.
                We realized that the world was becoming over-commercialized, and
                the true soul of destinations was being lost.
              </p>
              <p className="text-lg text-base-content/60 leading-relaxed">
                Today, we stand as a beacon for responsible, immersive, and
                high-impact travel. Our team traverses the globe to find the
                hidden paths, the local flavors, and the untold stories that
                make every journey unique.
              </p>

              <div className="grid grid-cols-2 gap-8 pt-8">
                {stats.map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className={`text-3xl font-black text-${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-base-content/40">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Pattern Section */}
      <section className="py-10 bg-base-200/50">
        <div className="route-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                Core Beliefs
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight mb-6">
                What Drives <span className="text-primary">Our Passion</span>
              </h2>
              <p className="text-lg text-base-content/60 leading-relaxed">
                Our values are the compass that guides every itinerary we build
                and every relationship we nurture with local partners.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((value, i) => (
              <div
                key={i}
                className="bg-base-100 p-10 rounded-[3rem] border border-base-content/5 shadow-xl hover:shadow-2xl transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-xl font-black text-base-content mb-4">
                  {value.title}
                </h3>
                <p className="text-base-content/60 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Premium Founder Spotlight */}
      <section className="py-10 bg-base-200/30 overflow-hidden">
        <div className="route-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left: Artistic Portrait */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700"></div>

              <div className="relative z-10">
                <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border-8 border-base-100 relative group">
                  <img
                    src="https://i.ibb.co.com/0RHQVcLS/Gemini-Generated-Image-4avo104avo104avo.png"
                    alt="Foysal Mahmood Picture"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
                </div>

                {/* Decorative Element */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary rounded-[2rem] -z-10 rotate-12"></div>
              </div>
            </div>

            {/* Right: Visionary Narrative */}
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-xs uppercase tracking-widest">
                  The Visionary
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-base-content tracking-tighter leading-tight">
                  Driving the <br />
                  <span className="text-secondary">Future of Travel</span>
                </h2>
              </div>

              <div className="relative">
                <span className="absolute -top-10 -left-8 text-9xl text-base-content/5 font-serif"></span>
                <p className="text-2xl font-medium text-base-content/80 leading-relaxed italic relative z-10">
                  Travel is not just about seeing new places; it is about
                  returning with a new perspective. Our mission at Aura Trip is
                  to bridge the gap between curiosity and discovery.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div>
                  <h4 className="text-3xl font-black text-base-content tracking-tight">
                    Foysal Mahmood
                  </h4>
                  <p className="text-sm font-black uppercase tracking-widest text-secondary">
                    CEO & Founder
                  </p>
                </div>

                <div className="flex gap-6">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-base-content">
                      4+
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-base-content/40">
                      Years Exp
                    </span>
                  </div>
                  <div className="w-px h-10 bg-base-content/10"></div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-base-content">
                      142
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-base-content/40">
                      Expeditions
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() =>
                    window.open("https://foysalmahmood.netlify.app/", "_blank")
                  }
                  className="group flex items-center gap-4 text-sm font-black uppercase tracking-widest text-base-content hover:text-secondary transition-colors cursor-pointer"
                >
                  <span>Founders Full Story</span>
                  <div className="w-12 h-12 rounded-full border border-base-content/20 flex items-center justify-center group-hover:border-secondary group-hover:translate-x-2 transition-all">
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
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Immersive Design */}
      <section className="py-24 relative overflow-hidden">
        <div className="route-container">
          <div className="relative rounded-[4rem] min-h-[600px] flex items-center justify-center overflow-hidden shadow-2xl">
            {/* Background Image with Parallax-like feel */}
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000"
              alt="Adventure Background"
              className="w-full h-full object-cover"
            />

            {/* Tactical Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>

            <div className="relative z-10 w-full px-12 md:px-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="text-left space-y-8">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-[0.2em]">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  Start Your Journey
                </div>

                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1]">
                  Ready to Start Your <br />
                  <span className="text-primary">Next Story?</span>
                </h2>

                <p className="text-xl text-white/70 font-medium max-w-xl leading-relaxed">
                  Join 50,000+ elite explorers who have discovered the worlds
                  most hidden gems with our curated expeditions.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                  <Link
                    href="/packages"
                    className="btn btn-primary btn-lg rounded-2xl px-10 h-16 font-black uppercase tracking-widest shadow-xl shadow-primary/30 w-full sm:w-auto"
                  >
                    View Packages
                  </Link>
                  <Link
                    href="/destinations"
                    className="btn btn-ghost btn-lg text-white border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 rounded-2xl px-10 h-16 font-black uppercase tracking-widest w-full sm:w-auto"
                  >
                    Explore Places
                  </Link>
                </div>
              </div>

              {/* Decorative "Badge" or Social Proof */}
              <div className="hidden lg:flex justify-end">
                <div className="w-64 h-64 rounded-full border border-white/10 flex items-center justify-center relative p-8 backdrop-blur-3xl bg-white/5">
                  <div className="absolute inset-0 rounded-full border-t-2 border-primary/50 animate-spin duration-[10s]"></div>
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-black text-white">
                      {avgRating}/5
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/60">
                      Explorer Rating
                    </div>
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg
                          key={s}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-primary"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
