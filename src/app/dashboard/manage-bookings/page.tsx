"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Image from "next/image";
import {
  showError,
  showConfirmation,
  showProcessing,
  showSuccess,
} from "@/components/pages/Alert";
import Pagination from "@/components/pages/Pagination";
import Invoice from "@/components/pages/Invoice";
import DashboardSkeleton from "@/components/pages/DashboardSkeleton";

interface BookingItem {
  _id: string;
  order_id: string;
  full_name: string;
  email: string;
  phone_no: string;
  emergency_no: string;
  passport_no: string;
  full_address: string;
  country: string;
  joining_date: string;
  person: number;
  sub_total: number;
  tax_total: number;
  service_charge: number;
  grand_total: number;
  order_status: string;
  package_info: {
    package_id: string | number;
    title: string;
    price: number;
    image: string;
  };
  createdAt: string;
}

const ManageBookingsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get("/api/tourism/get-booking-list");
      const data = response.data?.list_data;
      if (Array.isArray(data)) {
        // Sort by newest first
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setBookings(sorted);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showError("Data Error", "Failed to synchronize booking manifest.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchBookings();
    }, 0);
  }, [axiosSecure]);

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      booking.full_name.toLowerCase().includes(searchLower) ||
      booking.email.toLowerCase().includes(searchLower) ||
      booking.package_info.title.toLowerCase().includes(searchLower) ||
      booking._id.toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 0);
  }, [searchQuery]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const statusMap: Record<string, string> = {
      BP: "Processing",
      B: "Confirmed",
      C: "Completed",
      R: "Cancelled",
    };

    const result = await showConfirmation(
      "Update Booking Status?",
      `This will set the status to ${statusMap[newStatus] || newStatus}.`,
      "Update",
      "Cancel",
    );

    if (result.isConfirmed) {
      showProcessing("Synchronizing Status...");
      try {
        await axiosSecure.patch(`/api/admin/update-booking-status/${id}`, {
          order_status: newStatus,
        });
        await fetchBookings();
        showSuccess(
          "Status Synchronized",
          `Booking is now marked as ${statusMap[newStatus]}.`,
        );
      } catch (error: any) {
        showError(
          "Update Failed",
          error.response?.data?.message || "Failed to update booking status.",
        );
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await showConfirmation(
      "Delete Booking?",
      "This action will permanently remove this record from the database.",
      "Delete",
      "Keep",
    );

    if (result.isConfirmed) {
      showProcessing("Purging Record...");
      try {
        await axiosSecure.delete(`/api/admin/delete-booking-list/${id}`);
        await fetchBookings();
        showSuccess(
          "Record Purged",
          "The booking has been successfully removed.",
        );
      } catch (error: any) {
        showError(
          "Purge Failed",
          error.response?.data?.message || "Failed to remove record.",
        );
      }
    }
  };

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

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (loading) {
    return <DashboardSkeleton></DashboardSkeleton>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 relative">
      {/* Global Print Override */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body, html { background: white !important; margin: 0 !important; padding: 0 !important; height: auto !important; overflow: hidden !important; }
          aside, header, footer, .print\:hidden, nav { display: none !important; }
          .print-only-manifest { display: block !important; visibility: visible !important; width: 100% !important; }
          @page { margin: 0.5cm; size: A4; }
        }
      `,
        }}
      />

      <div className="print:hidden">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="relative w-full md:w-96 group">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-6 rounded-2xl bg-base-100 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30 transition-all shadow-sm group-hover:shadow-md"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/20 group-focus-within:text-primary transition-colors">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            </div>
          </div>

        {/* Information Row */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <div className="px-6 py-3 bg-base-100 rounded-2xl border border-base-content/5 flex items-center gap-3 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
              Total Manifests:
            </span>
            <span className="text-sm font-black text-primary">
              {bookings.length}
            </span>
          </div>
          {searchQuery && (
            <div className="px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-3 shadow-sm animate-in fade-in zoom-in duration-300">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                Filtered Results:
              </span>
              <span className="text-sm font-black text-primary">
                {filteredBookings.length}
              </span>
              <button
                onClick={handleClearSearch}
                className="ml-2 text-[10px] font-black uppercase tracking-widest text-base-content/40 hover:text-error transition-colors"
              >
                [Clear Filter]
              </button>
            </div>
          )}
        </div>

        {/* Booking Table */}
        <div className="bg-base-100 rounded-2xl border border-base-content/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-md w-full">
              <thead>
                <tr className="border-b border-base-content/5 h-14">
                  <th className="pl-10 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                    Identity
                  </th>
                  <th className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                    Package
                  </th>
                  <th className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                    Costing
                  </th>
                  <th className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                    Status
                  </th>
                  <th className="pr-10 text-right text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                    Operations
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-20 text-base-content/30 font-black uppercase tracking-widest"
                    >
                      No bookings found
                      <button
                        onClick={handleClearSearch}
                        className="ml-2 px-3 py-2 rounded-xl font-bold text-primary hover:text-secondary hover:bg-primary/10"
                      >
                        Clear Filter
                      </button>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-base-200/30 transition-colors border-b border-base-content/5 group"
                    >
                      <td className="pl-10 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-black text-base-content uppercase tracking-tight">
                            {booking.full_name}
                          </span>
                          <span className="text-[10px] font-bold text-base-content/40">
                            {booking.email}
                          </span>
                          <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest mt-1">
                            ID: {booking.order_id}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-4">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-base-content/5">
                            <Image
                              src={booking.package_info.image}
                              alt="Pkg"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black text-base-content uppercase tracking-tight line-clamp-1 max-w-[200px]">
                              {booking.package_info.title}
                            </span>
                            <span className="text-[9px] font-bold text-base-content/40">
                              Date:{" "}
                              {new Date(
                                booking.joining_date,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-primary">
                            ${booking.grand_total.toFixed(2)}
                          </span>
                          <span className="text-[9px] font-bold text-base-content/40 uppercase tracking-widest">
                            {booking.person} Persons
                          </span>
                        </div>
                      </td>
                      <td>{getStatusBadge(booking.order_status)}</td>
                      <td className="pr-10 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="dropdown dropdown-left">
                            <label
                              tabIndex={0}
                              className="w-9 h-9 rounded-xl bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer"
                            >
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
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </label>
                            <ul
                              tabIndex={0}
                              className="dropdown-content z-[50] menu p-2 shadow-2xl bg-base-100 rounded-xl border border-base-content/5 w-44 space-y-1"
                            >
                              <li>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(booking._id, "BP")
                                  }
                                  className="text-[10px] font-black uppercase tracking-widest py-2.5 hover:bg-base-content/5"
                                >
                                  Set Processing
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(booking._id, "B")
                                  }
                                  className="text-[10px] font-black uppercase tracking-widest py-2.5 hover:bg-success/5 hover:text-success"
                                >
                                  Set Booking Confirm
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(booking._id, "C")
                                  }
                                  className="text-[10px] font-black uppercase tracking-widest py-2.5 hover:bg-info/5 hover:text-info"
                                >
                                  Set Completed
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(booking._id, "R")
                                  }
                                  className="text-[10px] font-black uppercase tracking-widest py-2.5 hover:bg-error/5 hover:text-error"
                                >
                                  Set Cancelled
                                </button>
                              </li>
                            </ul>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsModalOpen(true);
                            }}
                            className="w-9 h-9 rounded-xl bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-accent hover:text-white transition-all shadow-sm"
                            title="View Manifest"
                          >
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setTimeout(() => window.print(), 100);
                            }}
                            className="w-9 h-9 rounded-xl bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-white transition-all shadow-sm"
                            title="Print Strategic Manifest"
                          >
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
                                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="w-9 h-9 rounded-xl bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-error hover:text-white transition-all shadow-sm"
                            title="Delete Record"
                          >
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredBookings.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={setCurrentPage}
          />
        )}

        {/* Manifest Side Drawer */}
        <div
          className={`fixed inset-0 z-[100] transition-visibility duration-300 ${isModalOpen ? "visible" : "invisible"}`}
        >
          <div
            className={`absolute inset-0 bg-base-300/40 backdrop-blur-md transition-opacity duration-300 ${isModalOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div
            className={`absolute top-0 right-0 h-full w-full max-w-xl bg-base-100 shadow-2xl transition-transform duration-500 ease-out border-l border-base-content/5 flex flex-col ${isModalOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="h-2 bg-primary w-full shrink-0"></div>

            {/* Exterior Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -left-14 top-8 w-11 h-11 rounded-xl bg-base-100 shadow-xl flex items-center justify-center hover:text-error transition-all group border border-base-content/5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300"
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

            {/* Drawer Header */}
            <div className="p-10 pb-0 shrink-0">
              <h2 className="text-4xl font-black text-base-content tracking-tighter uppercase leading-none">
                Official Voyage
                <br />
                <span className="text-primary italic">Manifest</span>
              </h2>
              <p className="mt-4 text-[9px] font-black uppercase tracking-[0.4em] text-base-content/20">
                Archival Record Verification
              </p>
              <div className="h-px bg-base-content/5 mt-8"></div>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="p-10 pt-8 flex-1 overflow-y-auto custom-scrollbar space-y-10">
              {selectedBooking && (
                <>
                  {/* Traveler Identity */}
                  <section className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                      Traveler Identity
                    </h3>
                    <div className="p-6 bg-base-200/50 rounded-2xl border border-base-content/5 space-y-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30 mb-1">
                          Lead Voyager
                        </p>
                        <p className="text-lg font-black text-base-content uppercase">
                          {selectedBooking.full_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30 mb-1">
                          Digital Signature
                        </p>
                        <p className="text-sm font-bold text-base-content/70">
                          {selectedBooking.email}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30 mb-1">
                            Passport No.
                          </p>
                          <p className="text-xs font-black text-base-content/70">
                            {selectedBooking.passport_no}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30 mb-1">
                            Contact
                          </p>
                          <p className="text-xs font-black text-base-content/70">
                            {selectedBooking.phone_no}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Expedition Specs */}
                  <section className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                      Expedition Specs
                    </h3>
                    <div className="p-6 bg-base-200/50 rounded-2xl border border-base-content/5 space-y-4">
                      <div className="flex items-center gap-4 pb-4 border-b border-base-content/5">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-base-content/5">
                          <Image
                            src={selectedBooking.package_info.image}
                            alt="Pkg"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="text-sm font-black text-base-content uppercase tracking-tight">
                            {selectedBooking.package_info.title}
                          </p>
                          <p className="text-[10px] font-bold text-base-content/40">
                            Reference: PKG-
                            {selectedBooking.package_info.package_id}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30 mb-1">
                            Departure Date
                          </p>
                          <p className="text-xs font-black text-base-content/70">
                            {new Date(
                              selectedBooking.joining_date,
                            ).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30 mb-1">
                            Persons
                          </p>
                          <p className="text-xs font-black text-base-content/70">
                            {selectedBooking.person} Adults
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Residency Details */}
                  <section className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                      Residency Details
                    </h3>
                    <div className="p-6 bg-base-200/50 rounded-2xl border border-base-content/5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30 mb-2">
                        Registered Address
                      </p>
                      <p className="text-xs font-bold text-base-content/60 leading-relaxed italic">
                        {selectedBooking.full_address},{" "}
                        {selectedBooking.country}
                      </p>
                    </div>
                  </section>

                  {/* Financial Summary */}
                  <section className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                      Strategic Settlement
                    </h3>
                    <div className="p-8 bg-primary text-white rounded-3xl shadow-2xl shadow-primary/20 flex justify-between items-end relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="relative z-10 space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                          Grand Total Settlement
                        </p>
                        <p className="text-4xl font-black tracking-tighter">
                          ${selectedBooking.grand_total.toFixed(2)}
                        </p>
                      </div>
                      <div className="relative z-10 text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                          Status
                        </p>
                        <p className="text-xs font-black uppercase tracking-widest">
                          {selectedBooking.order_status === "B"
                            ? "Confirmed"
                            : selectedBooking.order_status === "C"
                              ? "Completed"
                              : selectedBooking.order_status === "R"
                                ? "Cancelled"
                                : "Processing"}
                        </p>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-10 border-t border-base-content/5 bg-base-100 shrink-0 flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 btn btn-ghost h-12 rounded-xl font-black uppercase tracking-widest text-[10px] border border-base-content/10"
              >
                Close Manifest
              </button>
              <button
                onClick={() => window.print()}
                className="flex-[2] btn btn-primary h-12 rounded-xl font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-primary/30"
              >
                Print Strategic Manifest
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Print View Only - Executive Travel Manifest */}
      {selectedBooking && <Invoice selectedBooking={selectedBooking} />}
    </div>
  );
};

export default ManageBookingsPage;
