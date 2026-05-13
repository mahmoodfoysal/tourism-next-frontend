"use client";

import React, { useState, useEffect, useMemo } from "react";
import CommonHeader from "@/components/shared/CommonHeader/CommonHeader";
import Image from "next/image";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useRouter } from "next/navigation";
import {
  showError,
  showConfirmation,
  showProcessing,
  showSuccess,
  closeAlert,
} from "@/components/pages/Alert";

interface BookingItem {
  _id: string;
  order_id: string;
  full_name: string;
  email: string;
  phone_no: string;
  emergency_no: string;
  full_address: string;
  country: string;
  passport_no: string;
  payment_method: string;
  grand_total: number;
  sub_total: number;
  tax_total: number;
  service_charge: number;
  order_status: string;
  joining_date: string;
  createdAt: string;
  person: number;
  package_info: {
    package_id: string;
    title: string;
    image: string;
    category: string;
    price: number;
    features: string[];
  };
}

type FilterStatus = "all" | "active" | "completed" | "cancelled";

import PrivateRoutes from "@/routes/PrivateRoutes";
import Invoice from "@/components/pages/Invoice";

const BookingHistoryPage = () => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("active");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        const response = await axiosSecure.get(
          `/api/tourism/get-booking-list/${user.email}`,
        );
        const data = response.data?.list_data;
        if (Array.isArray(data)) {
          const sorted = [...data].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          setBookings(sorted);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        showError(
          "Retrieval Failed",
          "We encountered a synchronization error while accessing your voyage archives. Please refresh the portal to try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, axiosSecure]);

  const filteredBookings = useMemo(() => {
    if (activeFilter === "all") return bookings;
    return bookings.filter((booking) => {
      const status = booking.order_status.toUpperCase();
      if (activeFilter === "active") return status === "P" || status === "C";
      if (activeFilter === "completed") return status === "CO";
      if (activeFilter === "cancelled") return status === "X";
      return true;
    });
  }, [bookings, activeFilter]);

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "B":
        return (
          <span className="px-3 py-1 bg-success/20 text-success text-[8px] font-black uppercase tracking-[0.2em] rounded-md border border-success/30">
            Booking Confirm
          </span>
        );
      case "C":
        return (
          <span className="px-3 py-1 bg-info/20 text-info text-[8px] font-black uppercase tracking-[0.2em] rounded-md border border-info/30">
            Completed
          </span>
        );
      case "R":
        return (
          <span className="px-3 py-1 bg-error/20 text-error text-[8px] font-black uppercase tracking-[0.2em] rounded-md border border-error/30">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-base-content/10 text-base-content/40 text-[8px] font-black uppercase tracking-[0.2em] rounded-md">
            Processing
          </span>
        );
    }
  };

  return (
    <PrivateRoutes>
      <main className="min-h-screen bg-base-100 dark:bg-base-300/50 print:bg-white print:min-h-0">
        {/* GLOBAL PRINT OVERRIDE */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @media print {
            body, html { background: white !important; margin: 0 !important; padding: 0 !important; height: auto !important; overflow: hidden !important; }
            main { padding: 0 !important; margin: 0 !important; min-height: 0 !important; }
            main > section, main > div.print\\:hidden, header, footer, .navbar { display: none !important; }
            .manifest-modal-wrapper { display: none !important; }
            .print-only-manifest { display: block !important; visibility: visible !important; padding: 0 !important; margin: 0 !important; width: 100% !important; }
            @page { margin: 0.5cm; size: A4; }
          }
        `,
          }}
        />

        <div className="print:hidden">
          <CommonHeader
            title="Voyage"
            highlightText="Archives"
            subtitle="Access your digital boarding passes and expedition manifests through our secure travel archival system."
          />
        </div>

        <section className="pb-32 -mt-16 print:hidden">
          <div className="route-container max-w-7xl">
            {/* Filter Bar */}
            <div className="flex justify-center gap-2 mb-16 bg-base-100 p-2 rounded-2xl shadow-xl w-fit mx-auto border border-base-content/5">
              {["active", "completed", "cancelled", "all"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab as FilterStatus)}
                  className={`px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all duration-300 ${
                    activeFilter === tab
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-base-content/40 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {filteredBookings.length === 0 ? (
              <div className="bg-base-100 rounded-3xl p-24 text-center border-2 border-dashed border-base-content/5 animate-in fade-in duration-700">
                <h2 className="text-3xl font-black text-base-content/20 uppercase tracking-widest">
                  No Active Passes Found
                </h2>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="group relative flex flex-col h-full animate-in fade-in slide-in-from-bottom-10 duration-700"
                  >
                    <div className="relative h-56 bg-base-100 rounded-t-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-x border-t border-base-content/5">
                      <Image
                        src={booking.package_info.image}
                        alt={booking.package_info.title}
                        fill
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                      <div className="absolute top-6 left-6">
                        {getStatusBadge(booking.order_status)}
                      </div>

                      <div className="absolute bottom-6 left-6 right-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-1">
                          Boarding Pass
                        </p>
                        <h3 className="text-xl font-black text-white tracking-tight uppercase leading-none">
                          {booking.package_info.title}
                        </h3>
                      </div>
                    </div>

                    <div className="relative h-10 bg-base-100 flex items-center justify-between px-[-1px] border-x border-base-content/5 overflow-visible">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-base-200/50 rounded-full -ml-3 shadow-inner border border-base-content/5"></div>
                      <div className="w-full h-[2px] border-t-2 border-dashed border-base-content/10 mx-6"></div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-base-200/50 rounded-full -mr-3 shadow-inner border border-base-content/5"></div>
                    </div>

                    <div className="flex-1 bg-base-100 rounded-b-3xl p-8 border-x border-b border-base-content/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30">
                              Departs
                            </p>
                            <p className="text-sm font-black text-base-content">
                              {new Date(
                                booking.joining_date,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30">
                              Class
                            </p>
                            <p className="text-sm font-black text-base-content uppercase">
                              Elite
                            </p>
                          </div>
                        </div>

                        <div className="h-px bg-base-content/5"></div>

                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30">
                              Total Value
                            </p>
                            <p className="text-3xl font-black text-primary tracking-tighter">
                              ${booking.grand_total.toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-base-200 p-2 rounded-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-base-content/20"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z"
                                clipRule="evenodd"
                              />
                              <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2H10a1 1 0 01-1-1zM7 11a1 1 0 100-2H6a1 1 0 100 2h1zM11 13a1 1 0 100-2H9v1a1 1 0 001 1h1zM14 14a1 1 0 100-2h-1v1a1 1 0 001 1h1zM16 15a1 1 0 100 2h1a1 1 0 100-2h-1zM12 15a1 1 0 110 2h-1v-1a1 1 0 011-1zM10 16a1 1 0 100 2h1a1 1 0 100-2h-1zM8 17a1 1 0 100-2H6a1 1 0 100 2h2zM14 17a1 1 0 100-2h-2v1a1 1 0 001 1h1z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-8">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsModalOpen(true);
                          }}
                          className="btn btn-primary flex-1 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] group-hover:shadow-2xl group-hover:shadow-primary/30 transition-all duration-500"
                        >
                          Retrieve Manifest
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setTimeout(() => {
                              window.print();
                            }, 100);
                          }}
                          className="btn btn-ghost w-14 h-14 rounded-2xl border border-base-content/10 flex items-center justify-center hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
                          title="Instant Print"
                        >
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
                              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 00-2 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Manifest Modal (Passport Style) - DIGITAL VIEW ONLY */}
        {selectedBooking && isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 manifest-modal-wrapper print:hidden">
            <div
              className="absolute inset-0 bg-base-300/90 backdrop-blur-2xl"
              onClick={() => setIsModalOpen(false)}
            ></div>

            <div className="bg-base-100 w-full max-w-4xl rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border border-base-content/10 relative overflow-y-auto max-h-full sm:max-h-[90vh] animate-in zoom-in-95 duration-500">
              {/* Header Stripe */}
              <div className="h-6 bg-primary w-full"></div>

              <div className="p-8 sm:p-20">
                {/* Top Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-12 mb-16 border-b border-base-content/5 pb-16">
                  <div className="space-y-4">
                    <div className="w-20 h-2 bg-primary"></div>
                    <h2 className="text-5xl font-black text-base-content tracking-tighter uppercase leading-none">
                      Official Voyage
                      <br />
                      <span className="text-primary italic">Manifest</span>
                    </h2>
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-base-content/40">
                        Secure Travel Document
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center hover:bg-error/10 hover:text-error transition-all shadow-sm"
                  >
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
                        strokeWidth="3"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  {/* Left Column: Traveler & Expedition Details */}
                  <div className="space-y-12">
                    <section className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Traveler Identity
                      </h3>
                      <div className="grid grid-cols-1 gap-6 p-10 bg-base-100/50 dark:bg-base-200/50 rounded-2xl border border-base-content/5">
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30">
                              Lead Voyager
                            </p>
                            <p className="text-sm font-black text-base-content uppercase">
                              {selectedBooking.full_name}
                            </p>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30">
                              Passport Serial
                            </p>
                            <p className="text-sm font-black text-base-content">
                              {selectedBooking.passport_no}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30">
                            Digital Signature
                          </p>
                          <p className="text-sm font-bold text-base-content">
                            {selectedBooking.email}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30">
                              Primary Contact
                            </p>
                            <p className="text-sm font-bold text-base-content">
                              {selectedBooking.phone_no}
                            </p>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30">
                              Emergency Uplink
                            </p>
                            <p className="text-sm font-bold text-base-content">
                              {selectedBooking.emergency_no}
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Financial & Verification */}
                  <div className="space-y-12">
                    <section className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Security Verification
                      </h3>
                      <div className="grid grid-cols-2 gap-8 p-10 bg-base-100/50 dark:bg-base-200/50 rounded-2xl border border-base-content/5">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30">
                            Archival Ref
                          </p>
                          <p className="text-sm font-black text-base-content tracking-widest">
                            VOY-
                            {new Date(selectedBooking.createdAt)
                              .getTime()
                              .toString()
                              .slice(-6)}
                          </p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30">
                            Deployment
                          </p>
                          <p className="text-sm font-black text-base-content">
                            {new Date(
                              selectedBooking.joining_date,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Strategic Settlement
                      </h3>
                      <div className="p-10 border border-base-content/5 rounded-2xl bg-base-100/50 dark:bg-base-200/20">
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30">
                              Total Settlement
                            </p>
                            <p className="text-4xl font-black text-primary tracking-tighter leading-none">
                              ${selectedBooking.grand_total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                {/* Bottom Print Action */}
                <div className="mt-20 flex justify-center">
                  <button
                    className="btn btn-primary px-12 h-16 rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-primary/30 hover:scale-105 transition-all"
                    onClick={() => window.print()}
                  >
                    Authorize & Print Manifest
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRINT-ONLY COMPACT MANIFEST (Optimized for One A4 Page) */}
        {selectedBooking && <Invoice selectedBooking={selectedBooking} />}
      </main>
    </PrivateRoutes>
  );
};

export default BookingHistoryPage;
