"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useAxiosSecure from "@/hooks/useAxiosSecure";
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

const BookingHistoryPage = () => {
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
        const response = await axiosSecure.get(`/api/tourism/get-booking-list/${user.email}`);
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
          "We encountered a synchronization error while accessing your voyage archives."
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
      case "P":
        return <span className="px-3 py-1 bg-warning/20 text-warning text-[8px] font-black uppercase tracking-[0.2em] rounded-md border border-warning/30">Pending Archive</span>;
      case "C":
        return <span className="px-3 py-1 bg-success/20 text-success text-[8px] font-black uppercase tracking-[0.2em] rounded-md border border-success/30">Confirmed</span>;
      case "CO":
        return <span className="px-3 py-1 bg-info/20 text-info text-[8px] font-black uppercase tracking-[0.2em] rounded-md border border-info/30">Completed</span>;
      case "X":
        return <span className="px-3 py-1 bg-error/20 text-error text-[8px] font-black uppercase tracking-[0.2em] rounded-md border border-error/30">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-base-content/10 text-base-content/40 text-[8px] font-black uppercase tracking-[0.2em] rounded-md">Processing</span>;
    }
  };

  if (loading) {
      return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => (
                  <div key={i} className="h-96 bg-base-300/50 rounded-[3rem] animate-pulse"></div>
              ))}
          </div>
      )
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* GLOBAL PRINT OVERRIDE */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body, html { background: white !important; margin: 0 !important; padding: 0 !important; height: auto !important; }
          main { padding: 0 !important; margin: 0 !important; min-height: 0 !important; }
          main > section, header, footer, .navbar, aside { display: none !important; }
          .manifest-modal-wrapper { display: none !important; }
          .print-only-manifest { display: block !important; visibility: visible !important; padding: 0 !important; margin: 0 !important; width: 100% !important; }
          @page { margin: 0.5cm; size: A4; }
        }
      `}} />

      {/* Filter Bar */}
      <div className="flex justify-start gap-2 mb-12 bg-base-200/50 p-2 rounded-2xl border border-base-content/5 w-fit">
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
        <div className="bg-base-200/30 rounded-[3rem] p-32 text-center border-2 border-dashed border-base-content/5">
          <h2 className="text-3xl font-black text-base-content/20 uppercase tracking-widest">No Active Passes Found</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="group relative flex flex-col h-full"
            >
              <div className="relative h-56 bg-base-100 rounded-t-[3rem] overflow-hidden border-x border-t border-base-content/5">
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
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-1">Boarding Pass</p>
                  <h3 className="text-xl font-black text-white tracking-tight uppercase leading-none">{booking.package_info.title}</h3>
                </div>
              </div>

              <div className="relative h-10 bg-base-100 flex items-center justify-between border-x border-base-content/5">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-base-200/50 rounded-full -ml-3 border border-base-content/5"></div>
                <div className="w-full h-[2px] border-t-2 border-dashed border-base-content/10 mx-6"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-base-200/50 rounded-full -mr-3 border border-base-content/5"></div>
              </div>

              <div className="flex-1 bg-base-100 rounded-b-[3rem] p-8 border-x border-b border-base-content/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30">Departs</p>
                      <p className="text-sm font-black text-base-content">
                        {new Date(booking.joining_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30">Class</p>
                      <p className="text-sm font-black text-base-content uppercase">Elite</p>
                    </div>
                  </div>

                  <div className="h-px bg-base-content/5"></div>

                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30">Total Value</p>
                      <p className="text-3xl font-black text-primary tracking-tighter">${booking.grand_total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setIsModalOpen(true);
                    }}
                    className="btn btn-primary flex-1 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]"
                  >
                    Retrieve Manifest
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setTimeout(() => window.print(), 100);
                    }}
                    className="btn btn-ghost w-14 h-14 rounded-2xl border border-base-content/10 flex items-center justify-center hover:bg-primary/10 hover:text-primary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 00-2 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manifest Modal */}
      {selectedBooking && isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 manifest-modal-wrapper print:hidden">
          <div className="absolute inset-0 bg-base-300/90 backdrop-blur-2xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-base-100 w-full max-w-4xl rounded-[3rem] shadow-2xl border border-base-content/10 relative overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-500">
            <div className="h-6 bg-primary w-full"></div>
            <div className="p-16">
              <div className="flex justify-between items-start mb-16 border-b border-base-content/5 pb-16">
                <h2 className="text-5xl font-black text-base-content tracking-tighter uppercase leading-none">
                  Official Voyage<br/><span className="text-primary italic">Manifest</span>
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center hover:text-error transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30">Lead Voyager</p>
                  <p className="text-xl font-black text-base-content uppercase">{selectedBooking.full_name}</p>
                  <p className="text-sm font-bold text-base-content/60">{selectedBooking.email}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30">Total Settlement</p>
                  <p className="text-4xl font-black text-primary tracking-tighter">${selectedBooking.grand_total.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-20 flex justify-center">
                <button className="btn btn-primary px-12 h-16 rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-primary/30" onClick={() => window.print()}>
                  Authorize & Print Manifest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY MANIFEST */}
      {selectedBooking && (
        <div className="print-only-manifest hidden p-10 font-sans text-black bg-white">
          <div className="border-4 border-black p-8 min-h-[25cm]">
            <h1 className="text-4xl font-black uppercase">AuraTrip Executive Manifest</h1>
            <p className="mt-4 text-xl">Voyager: {selectedBooking.full_name}</p>
            <p>Package: {selectedBooking.package_info.title}</p>
            <p>Total Value: ${selectedBooking.grand_total.toFixed(2)}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookingHistoryPage;
