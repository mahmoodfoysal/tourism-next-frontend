"use client";

import React, { useEffect, useState, use } from "react";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import Image from "next/image";
import Link from "next/link";
import CommonHeader from "@/components/shared/CommonHeader/CommonHeader";
import DataVoid from "@/components/pages/DataVoid";
import SkeletonDetails from "@/components/pages/SkeletonDetails";
import { GuideInfo } from "@/components/pages/GuideCard";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const GuideDetailsPage = ({ params }: PageProps) => {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [guide, setGuide] = useState<GuideInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await axiosPublic.get(
          `/api/tourism/get-guide-list/${id}`,
        );
        const data = response.data?.details_data;
        setGuide(data);
      } catch (error) {
        console.error("Error fetching guide details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <SkeletonDetails />;
  if (!guide) return <DataVoid />;

  return (
    <main className="min-h-screen bg-base-100">
      <CommonHeader
        title="Guide"
        highlightText="Profile"
        subtitle={guide.name}
      />

      <section className="pb-24">
        <div className="route-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Content (2/3) */}
            <div className="lg:col-span-2 space-y-12">
              {/* Profile Overview - Split Layout */}
              <div className="flex flex-col md:flex-row bg-base-100 rounded-[3rem] overflow-hidden shadow-2xl border border-base-content/5 group">
                {/* Image Section */}
                <div className="md:w-[45%] relative h-[600px] bg-base-300">
                  <Image
                    src={guide.image}
                    alt={guide.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:hidden"></div>
                </div>

                {/* Info Section */}
                <div className="md:w-[55%] p-8 md:p-14 flex flex-col justify-center bg-gradient-to-br from-base-100 to-base-200/50 relative">
                  <div className="space-y-8">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="bg-primary/10 text-primary px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-primary/20">
                          {guide.specialty}
                        </span>
                        <span className="bg-secondary/10 text-secondary px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-secondary/20">
                          {guide.experience}+ Years Exp
                        </span>
                      </div>
                      <h1 className="text-4xl md:text-6xl font-black text-base-content tracking-tight leading-tight mb-4">
                        {guide.name}
                      </h1>
                      <div className="flex items-center gap-3 text-base-content/40 font-black uppercase tracking-[0.2em] text-xs">
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
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                          </svg>
                        </div>
                        {guide.destination}
                      </div>
                    </div>

                    <div className="flex items-center gap-8 py-8 border-y border-base-content/5">
                      <div className="text-center md:text-left">
                        <div className="text-4xl font-black text-primary tracking-tighter">
                          {guide.rating}
                        </div>
                        <div className="text-[10px] font-black text-base-content/30 uppercase tracking-[0.2em] mt-1">
                          Global Rating
                        </div>
                      </div>
                      <div className="w-px h-12 bg-base-content/10"></div>
                      <div className="text-center md:text-left">
                        <div className="text-4xl font-black text-secondary tracking-tighter">
                          {guide.details.totalTours}
                        </div>
                        <div className="text-[10px] font-black text-base-content/30 uppercase tracking-[0.2em] mt-1">
                          Completed Tours
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                      {guide.benefits.slice(0, 3).map((benefit, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-base-200 border border-base-content/5 text-[10px] font-bold text-base-content/60 uppercase tracking-widest"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Biography & History */}
              <div className="space-y-8 px-4 md:px-0">
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl font-black text-base-content tracking-tight">
                    Professional <span className="text-primary">Biography</span>
                  </h2>
                  <p className="text-lg text-base-content/70 leading-relaxed font-medium italic">
                    {guide.details.bio}
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-base-content tracking-tight">
                    Full <span className="text-secondary">History</span>
                  </h3>
                  <div className="prose prose-lg text-base-content/60 max-w-none">
                    <p className="leading-relaxed">
                      {guide.details.longDescription}
                    </p>
                  </div>
                </div>

                {/* Academic & Professional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                  <div className="bg-base-200/50 p-8 rounded-[2.5rem] border border-base-content/5 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
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
                          strokeWidth="2.5"
                          d="M12 14l9-5-9-5-9 5 9 5z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-base-content/40 mb-1">
                        Education
                      </h4>
                      <p className="text-lg font-black text-base-content">
                        {guide.details.education}
                      </p>
                    </div>
                  </div>

                  <div className="bg-base-200/50 p-8 rounded-[2.5rem] border border-base-content/5 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
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
                          strokeWidth="2.5"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-base-content/40 mb-1">
                        Certifications
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {guide.details.certificates.map((cert, i) => (
                          <span
                            key={i}
                            className="text-xs font-bold text-base-content/70 bg-base-300/50 px-3 py-1 rounded-lg italic"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar (1/3) */}
            <div className="space-y-8">
              <div className="sticky top-28 space-y-8">
                {/* Guide Quick Stats Card */}
                <div className="bg-base-100 rounded-[3rem] border border-base-content/5 p-10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>

                  <div className="relative space-y-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black uppercase tracking-widest text-base-content/30">
                        Member Since
                      </span>
                      <span className="text-xl font-black text-primary tracking-tight">
                        {guide.details.joinedDate}
                      </span>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between py-4 border-b border-base-content/5">
                        <span className="text-sm font-bold text-base-content/50 uppercase tracking-widest">
                          Languages
                        </span>
                        <span className="text-sm font-black text-base-content">
                          {guide.languages.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-4 border-b border-base-content/5">
                        <span className="text-sm font-bold text-base-content/50 uppercase tracking-widest">
                          Tour Type
                        </span>
                        <span className="text-sm font-black text-base-content">
                          {guide.tour_type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-4">
                        <span className="text-sm font-bold text-base-content/50 uppercase tracking-widest">
                          Response Time
                        </span>
                        <span className="text-sm font-black text-green-500">
                          Under 1 Hour
                        </span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button className="btn btn-primary w-full h-16 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
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
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        Message Guide
                      </button>
                    </div>

                    <p className="text-center text-[10px] font-bold text-base-content/30 uppercase tracking-[0.2em]">
                      Secure booking via AuraTrip
                    </p>
                  </div>
                </div>

                {/* Benefits / Badges Sidebar */}
                <div className="bg-base-200/30 rounded-[3rem] p-10 border border-base-content/5 space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-base-content/40">
                    Verified Benefits
                  </h3>
                  <div className="space-y-4">
                    {guide.benefits.map((benefit, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 bg-base-100 rounded-2xl border border-base-content/5 shadow-sm"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="font-bold text-sm text-base-content/70">
                          {benefit}
                        </span>
                      </div>
                    ))}
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

export default GuideDetailsPage;
