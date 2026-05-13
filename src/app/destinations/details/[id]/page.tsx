"use client";

import React, { useEffect, useState, use } from "react";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import Image from "next/image";
import CommonHeader from "@/components/shared/CommonHeader/CommonHeader";
import DataVoid from "@/components/pages/DataVoid";
import SkeletonDetails from "@/components/pages/SkeletonDetails";

interface DestinationDetails {
  _id: string | number;
  pop_id: string | number;
  name: string;
  location: string;
  image: string;
  moreImage: string[];
  price: number;
  rating: number;
  badge: string;
  shortDescription: string;
  longDescription: string;
  discount: string;
  itinerary: { day: number; title: string; activities: string[] }[];
  bestTimeToVisit: string;
  nearbyAttractions: string[];
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const DestinationDetailsPage = ({ params }: PageProps) => {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [details, setDetails] = useState<DestinationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await axiosPublic.get(`/api/tourism/get-popular-dest-list/${id}`);
        const data = response.data?.details_data;
        setDetails(data);
        if (data?.image) setActiveImage(data.image);
      } catch (error) {
        console.error("Error fetching destination details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <SkeletonDetails />;

  if (!details) return <DataVoid />;

  return (
    <main className="min-h-screen bg-base-100">
      <CommonHeader
        title="Destination"
        highlightText="Discovery"
        subtitle={details.name}
      />

      <section className="pb-24">
        <div className="route-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Content (2/3) */}
            <div className="lg:col-span-2 space-y-12">
              {/* Image Gallery Hero */}
              <div className="space-y-6">
                <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl group bg-base-300">
                  <Image
                    src={activeImage || details.image}
                    alt={details.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Overlay Info */}
                  <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-primary px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-lg">
                          {details.badge}
                        </span>
                        <span className="bg-accent px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-lg">
                          {details.discount}
                        </span>
                      </div>
                      <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        {details.name}
                      </h1>
                    </div>
                    <div className="flex items-center gap-1.5 glass-effect px-5 py-2.5 rounded-2xl text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-lg font-black">{details.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Thumbnails Row */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                  {[details.image, ...details.moreImage].map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-28 h-20 rounded-2xl overflow-hidden shrink-0 border-4 transition-all duration-300 ${
                        activeImage === img
                          ? "border-primary scale-105 shadow-lg"
                          : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <Image
                        src={img}
                        alt="thumbnail"
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Description & Features */}
              <div className="space-y-8 px-4 md:px-0">
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl font-black text-base-content tracking-tight">
                    Explore <span className="text-primary">{details.location}</span>
                  </h2>
                </div>

                <p className="text-lg text-base-content/60 leading-relaxed">
                  {details.longDescription || details.shortDescription}
                </p>
              </div>

              {/* Itinerary Section */}
              {details.itinerary && details.itinerary.length > 0 && (
                <div className="space-y-8 pt-12">
                  <h2 className="text-3xl font-black text-base-content tracking-tight px-4 md:px-0">
                    Recommended <span className="text-secondary">Plan</span>
                  </h2>
                  <div className="space-y-4 px-4 md:px-0">
                    {details.itinerary.map((item, i) => (
                      <div
                        key={i}
                        className="collapse collapse-arrow bg-base-100 border border-base-content/5 rounded-3xl hover:border-secondary/20 transition-all shadow-sm"
                      >
                        <input type="checkbox" />
                        <div className="collapse-title flex items-center gap-6 p-6">
                          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-black shrink-0">
                            {item.day}
                          </div>
                          <span className="text-xl font-black text-base-content">
                            {item.title}
                          </span>
                        </div>
                        <div className="collapse-content px-6 pb-6">
                          <ul className="space-y-3 pl-14">
                            {item.activities?.map((activity, j) => (
                              <li
                                key={j}
                                className="flex items-center gap-3 text-base-content/60 font-medium before:content-[''] before:w-1.5 before:h-1.5 before:bg-secondary/40 before:rounded-full"
                              >
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar (1/3) */}
            <div className="space-y-8">
              <div className="sticky top-28 space-y-8">
                {/* Booking Card */}
                <div className="bg-base-100 rounded-[3rem] border border-base-content/5 p-10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>

                  <div className="relative">
                    <div className="flex flex-col gap-1 mb-8">
                      <span className="text-xs font-black uppercase tracking-widest text-base-content/30">
                        Average Price from
                      </span>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-primary tracking-tighter">
                          ${details.price}
                        </span>
                        <span className="text-sm font-bold text-base-content/40 mb-1.5">
                          / person
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button className="btn btn-primary w-full h-16 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                        Plan My Trip
                      </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-base-content/5 space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-base-content/60">
                          Best Time
                        </span>
                        <span className="text-sm font-black text-primary uppercase tracking-wider">
                          {details.bestTimeToVisit || "Year Round"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nearby Attractions */}
                {details.nearbyAttractions &&
                  details.nearbyAttractions.length > 0 && (
                    <div className="bg-base-100 rounded-[3rem] border border-base-content/5 p-10 shadow-xl">
                      <h3 className="text-xl font-black text-base-content mb-6 flex items-center gap-3">
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
                        Nearby Places
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {details.nearbyAttractions.map((place, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-base-200 rounded-xl text-xs font-bold text-base-content/60"
                          >
                            {place}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DestinationDetailsPage;
