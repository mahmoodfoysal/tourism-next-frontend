"use client";

import React, { useEffect, useState, use } from "react";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setBookingPackage } from "@/store/slices/bookingSlice";
import CommonHeader from "@/components/shared/CommonHeader/CommonHeader";
import DataVoid from "@/components/pages/DataVoid";
import SkeletonDetails from "@/components/pages/SkeletonDetails";

interface PackageDetails {
  _id: string | number;
  package_id: string | number;
  title: string;
  location: string;
  duration: string;
  category: string;
  status: number;
  is_popular: number;
  image: string;
  moreImage: string[];
  price: number;
  originalPrice: number;
  rating: number;
  badge: string;
  features: string[];
  discount: string;
  shortDescription: string;
  longDescription: string;
  bestTimeToVisit: string;
  nearbyAttractions: string[];
  itinerary: { day: number; title: string; activities: string[] }[];
  tour_date: string;
  modifiedAt: string;
  user_info: string;
  // Policy & Inclusions
  inclusions?: string[];
  exclusions?: string[];
  cancellationPolicy?: string;
  termsAndConditions?: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const PackageDetailsPage = ({ params }: PageProps) => {
  const dispatch = useDispatch();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [details, setDetails] = useState<PackageDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await axiosPublic.get(
          `/api/tourism/get-package-list/${id}`,
        );
        const data = response.data?.details_data;
        setDetails(data);
        if (data?.image) setActiveImage(data.image);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <SkeletonDetails></SkeletonDetails>;

  if (!details) return <DataVoid />;

  return (
    <main className="min-h-screen bg-base-100">
      <CommonHeader
        title="Package"
        highlightText="Details"
        subtitle={details.title}
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
                    alt={details.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
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

              {/* Title & Badges Section */}
              <div className="px-4 md:px-0 py-8 border-b border-base-content/5">
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border border-primary/20">
                    {details.duration}
                  </span>
                  <span className="bg-accent/10 text-accent px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border border-accent/20">
                    {details.discount}
                  </span>
                  <span className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border border-secondary/20">
                    {details.category}
                  </span>
                  {details.badge && (
                    <span className="bg-orange-500/10 text-orange-500 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border border-orange-500/20">
                      {details.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <h1 className="text-4xl md:text-6xl font-black text-base-content tracking-tight leading-tight">
                    {details.title}
                  </h1>
                  <div className="flex items-center gap-4 bg-base-200/50 p-4 rounded-3xl border border-base-content/5 shrink-0">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-base-content/30 tracking-widest">
                        Rating
                      </span>
                      <div className="flex items-center gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-amber-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-lg font-black text-base-content">
                          {details.rating}
                        </span>
                      </div>
                    </div>
                    <div className="w-px h-10 bg-base-content/10 mx-2"></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-base-content/30 tracking-widest">
                        Departure
                      </span>
                      <span className="text-sm font-black text-base-content uppercase">
                        {details.tour_date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description & Features */}
              <div className="space-y-8 px-4 md:px-0">
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl font-black text-base-content tracking-tight">
                    About This <span className="text-primary">Experience</span>
                  </h2>
                  <div className="flex items-center gap-2 text-base-content/40 font-bold uppercase tracking-widest text-xs">
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {details.location}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-lg text-base-content/60 leading-relaxed italic border-l-4 border-primary/20 pl-6 py-2">
                      {details.shortDescription}
                    </p>
                    <p className="text-lg text-base-content/60 leading-relaxed">
                      {details.longDescription}
                    </p>
                  </div>

                  {/* Key Info Card */}
                  <div className="bg-base-200/30 rounded-[2.5rem] p-8 border border-base-content/5 space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-base-content/40">
                      Travel Wisdom
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
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
                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-base-content/30 tracking-widest mb-1">
                            Best Time to Visit
                          </p>
                          <p className="font-bold text-base-content">
                            {details.bestTimeToVisit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
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
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-base-content/30 tracking-widest mb-1">
                            Nearby Attractions
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {details.nearbyAttractions?.map((attr, idx) => (
                              <span
                                key={idx}
                                className="bg-base-100 px-3 py-1 rounded-lg text-xs font-bold text-base-content/60 border border-base-content/5"
                              >
                                {attr}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                  {details.features?.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 bg-base-200/50 p-6 rounded-3xl border border-base-content/5 group hover:bg-primary/5 hover:border-primary/20 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
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
                      <span className="font-bold text-base-content/70 group-hover:text-base-content transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Meta Footer */}
                <div className="mt-12 pt-8 border-t border-base-content/5 flex flex-col md:flex-row justify-between items-center gap-6 px-4 md:px-0">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-base-content/30">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Last Updated:{" "}
                    {new Date(details.modifiedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Itinerary Section */}
              {details.itinerary && details.itinerary.length > 0 && (
                <div className="space-y-8 pt-12">
                  <h2 className="text-3xl font-black text-base-content tracking-tight px-4 md:px-0">
                    Your <span className="text-secondary">Itinerary</span>
                  </h2>
                  <div className="space-y-4 px-4 md:px-0">
                    {details.itinerary.map((item, i) => (
                      <div
                        key={i}
                        className="collapse collapse-arrow bg-base-100 border border-base-content/5 rounded-3xl hover:border-secondary/20 transition-all shadow-sm"
                      >
                        <input type="checkbox" />
                        <div className="collapse-title flex items-center gap-6 p-6">
                          <div className="w-16 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-black shrink-0 text-sm">
                            Day {item.day}
                          </div>
                          <span className="text-xl font-black text-base-content">
                            {item.title}
                          </span>
                        </div>
                        <div className="collapse-content px-6 pb-6">
                          <ul className="space-y-2 pl-22">
                            {item.activities.map((activity, idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-3 text-base-content/60 font-medium"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary/40"></div>
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

              {/* Inclusions & Exclusions */}
              {(details.inclusions || details.exclusions) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-base-content/5">
                  {details.inclusions && details.inclusions.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-black text-base-content flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        What is Included
                      </h3>
                      <ul className="space-y-3">
                        {details.inclusions.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 text-sm font-bold text-base-content/60"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500/40"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {details.exclusions && details.exclusions.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-black text-base-content flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-error/10 flex items-center justify-center text-error">
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                        What is Excluded
                      </h3>
                      <ul className="space-y-3">
                        {details.exclusions.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 text-sm font-bold text-base-content/40"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-error/20"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Policies Section */}
              {(details.cancellationPolicy || details.termsAndConditions) && (
                <div className="pt-12 border-t border-base-content/5 space-y-8">
                  <h3 className="text-2xl font-black text-base-content tracking-tight">
                    Booking <span className="text-primary">Policies</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    {details.cancellationPolicy && (
                      <div className="collapse collapse-plus bg-base-200/30 rounded-[2rem] border border-base-content/5">
                        <input type="checkbox" />
                        <div className="collapse-title text-sm font-black uppercase tracking-widest p-6">
                          Cancellation Policy
                        </div>
                        <div className="collapse-content px-6 pb-6 text-sm text-base-content/60 leading-relaxed font-medium">
                          {details.cancellationPolicy}
                        </div>
                      </div>
                    )}
                    {details.termsAndConditions && (
                      <div className="collapse collapse-plus bg-base-200/30 rounded-[2rem] border border-base-content/5">
                        <input type="checkbox" />
                        <div className="collapse-title text-sm font-black uppercase tracking-widest p-6">
                          Terms & Conditions
                        </div>
                        <div className="collapse-content px-6 pb-6 text-sm text-base-content/60 leading-relaxed font-medium">
                          {details.termsAndConditions}
                        </div>
                      </div>
                    )}
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
                        Price starts from
                      </span>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-primary tracking-tighter">
                          ${details.price}
                        </span>
                        <span className="text-sm font-bold text-base-content/40 mb-1.5">
                          / person
                        </span>
                      </div>
                      {details.originalPrice && (
                        <span className="text-sm font-bold text-base-content/30 line-through">
                          ${details.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Link
                        href={`/booking?packageId=${details._id || details.package_id}`}
                        onClick={() => dispatch(setBookingPackage(details))}
                        className="btn btn-primary w-full h-16 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center"
                      >
                        Book This Trip
                      </Link>
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
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-base-content/60">
                          Availability
                        </span>
                        <span className="text-sm font-black text-green-500 uppercase tracking-wider">
                          Instant Booking
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

export default PackageDetailsPage;
