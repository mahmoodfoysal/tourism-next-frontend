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
import DashboardSkeleton from "@/components/pages/DashboardSkeleton";

interface PopularDestination {
  _id: string;
  pop_id: number;
  name: string;
  location: string;
  image: string;
  moreImage: string[];
  price: number;
  rating: number;
  badge: string;
  shortDescription: string;
  longDescription: string;
  status: number;
  discount: number | string;
  bestTimeToVisit: string;
  nearbyAttractions: string[];
  itinerary: {
    day: number;
    title: string;
    activities: string[];
  }[];
  user_info?: string;
  createdAt?: string;
}

const AddDestination = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const axiosSecure = useAxiosSecure();
  const [destinations, setDestinations] = useState<PopularDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<PopularDestination | null>(
    null,
  );
  const [viewingDest, setViewingDest] = useState<PopularDestination | null>(
    null,
  );

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDestinations = destinations.filter((dest) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      dest.name.toLowerCase().includes(searchLower) ||
      dest.location.toLowerCase().includes(searchLower) ||
      dest.pop_id.toString().includes(searchLower)
    );
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDestinations.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);

  // Reset to first page when searching
  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 0);
  }, [searchQuery]);

  // Form State
  const [formData, setFormData] = useState({
    pop_id: "",
    name: "",
    location: "",
    image: "",
    moreImage: [] as string[],
    price: "",
    rating: "",
    badge: "",
    shortDescription: "",
    longDescription: "",
    status: 1,
    discount: "",
    bestTimeToVisit: "",
    nearbyAttractions: [] as string[],
    itinerary: [] as { day: number; title: string; activities: string[] }[],
  });

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get(
        "/api/tourism/get-popular-dest-list",
      );
      if (response.data && Array.isArray(response.data.list_data)) {
        setDestinations(response.data.list_data);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
      showError("Data Error", "Failed to synchronize destination manifest.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchDestinations();
    }, 0);
  }, [axiosSecure]);

  const handleOpenDrawer = (dest: PopularDestination | null = null) => {
    if (dest) {
      setEditingDest(dest);
      setFormData({
        pop_id: dest.pop_id.toString(),
        name: dest.name,
        location: dest.location,
        image: dest.image,
        moreImage: dest.moreImage || [],
        price: dest.price.toString(),
        rating: dest.rating.toString(),
        badge: dest.badge || "",
        shortDescription: dest.shortDescription || "",
        longDescription: dest.longDescription || "",
        status: dest.status,
        discount: dest.discount?.toString() || "",
        bestTimeToVisit: dest.bestTimeToVisit || "",
        nearbyAttractions: dest.nearbyAttractions || [],
        itinerary: dest.itinerary || [],
      });
    } else {
      setEditingDest(null);
      setFormData({
        pop_id: "",
        name: "",
        location: "",
        image: "",
        moreImage: [],
        price: "",
        rating: "",
        badge: "",
        shortDescription: "",
        longDescription: "",
        status: 1,
        discount: "",
        bestTimeToVisit: "",
        nearbyAttractions: [],
        itinerary: [],
      });
    }
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setEditingDest(null), 300);
  };

  const handleOpenDetails = (dest: PopularDestination) => {
    setViewingDest(dest);
    setIsDetailsDrawerOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsDrawerOpen(false);
    setTimeout(() => setViewingDest(null), 300);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Array Handlers (moreImage, nearbyAttractions)
  const handleArrayFieldChange = (
    field: "moreImage" | "nearbyAttractions",
    index: number,
    value: string,
  ) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const addArrayField = (field: "moreImage" | "nearbyAttractions") => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayField = (
    field: "moreImage" | "nearbyAttractions",
    index: number,
  ) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  // Itinerary Handlers
  const addItineraryDay = () => {
    const newDay = {
      day: formData.itinerary.length + 1,
      title: "",
      activities: [""],
    };
    setFormData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, newDay],
    }));
  };

  const removeItineraryDay = (index: number) => {
    const updated = formData.itinerary
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, day: i + 1 }));
    setFormData((prev) => ({ ...prev, itinerary: updated }));
  };

  const handleItineraryChange = (
    index: number,
    field: "title",
    value: string,
  ) => {
    const updated = [...formData.itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, itinerary: updated }));
  };

  const handleActivityChange = (
    dayIndex: number,
    actIndex: number,
    value: string,
  ) => {
    const updated = [...formData.itinerary];
    const updatedActivities = [...updated[dayIndex].activities];
    updatedActivities[actIndex] = value;
    updated[dayIndex] = { ...updated[dayIndex], activities: updatedActivities };
    setFormData((prev) => ({ ...prev, itinerary: updated }));
  };

  const addActivity = (dayIndex: number) => {
    const updated = [...formData.itinerary];
    updated[dayIndex] = {
      ...updated[dayIndex],
      activities: [...updated[dayIndex].activities, ""],
    };
    setFormData((prev) => ({ ...prev, itinerary: updated }));
  };

  const removeActivity = (dayIndex: number, actIndex: number) => {
    const updated = [...formData.itinerary];
    updated[dayIndex] = {
      ...updated[dayIndex],
      activities: updated[dayIndex].activities.filter((_, i) => i !== actIndex),
    };
    setFormData((prev) => ({ ...prev, itinerary: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    const action = editingDest ? "Update" : "Create";
    const result = await showConfirmation(
      `${action} Destination?`,
      `This will ${action.toLowerCase()} the destination in the popular list.`,
      action,
      "Cancel",
    );

    if (result.isConfirmed) {
      showProcessing(`${action}ing Destination...`);

      try {
        const payload = {
          pop_id: Number(formData.pop_id),
          name: formData.name,
          location: formData.location,
          image: formData.image,
          moreImage: formData.moreImage.filter(Boolean),
          price: Number(formData.price),
          rating: Number(formData.rating),
          badge: formData.badge,
          shortDescription: formData.shortDescription,
          longDescription: formData.longDescription,
          status: Number(formData.status),
          discount: isNaN(Number(formData.discount))
            ? formData.discount
            : Number(formData.discount),
          bestTimeToVisit: formData.bestTimeToVisit,
          nearbyAttractions: formData.nearbyAttractions.filter(Boolean),
          itinerary: formData.itinerary.map((item) => ({
            day: Number(item.day),
            title: item.title,
            activities: item.activities.filter(Boolean),
          })),
          user_info: user.email,
          ...(editingDest?._id && { _id: editingDest._id }),
        };

        await axiosSecure.post(
          "/api/admin/insert-update-popular-dest-list",
          payload,
        );
        await fetchDestinations();

        showSuccess(
          `Destination ${action}d`,
          `The record has been successfully ${action.toLowerCase()}d.`,
        );
        handleCloseDrawer();
      } catch (error: any) {
        console.error("Error saving destination:", error);
        showError(
          "Operation Failed",
          error.response?.data?.message || "An unexpected error occurred.",
        );
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await showConfirmation(
      "Delete Destination?",
      "This will permanently remove this destination from the popular list.",
      "Delete",
      "Keep",
    );

    if (result.isConfirmed) {
      showProcessing("Deleting...");
      try {
        await axiosSecure.delete(`/api/admin/delete-popular-dest-list/${id}`);
        await fetchDestinations();
        showSuccess("Deleted", "Destination has been removed.");
      } catch (error: any) {
        showError(
          "Failed",
          error.response?.data?.message || "Failed to remove destination.",
        );
      }
    }
  };

  const handleStatusChange = async (id: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const statusLabel = newStatus === 1 ? "Active" : "Inactive";

    const result = await showConfirmation(
      "Change Status?",
      `This will set the destination manifest to ${statusLabel.toUpperCase()}.`,
      "Update",
      "Cancel",
    );

    if (result.isConfirmed) {
      showProcessing("Updating Status...");
      try {
        await axiosSecure.patch(`/api/admin/update-popular-dest-status/${id}`, {
          status: newStatus,
        });
        await fetchDestinations();
        showSuccess("Status Updated", `Destination is now ${statusLabel}.`);
      } catch (error: any) {
        showError("Update Failed", "Failed to synchronize status change.");
      }
    }
  };
  const handleClearSearch = () => {
    setSearchQuery("");
  };
  if (loading) {
    return <DashboardSkeleton></DashboardSkeleton>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 relative p-8">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="relative w-full md:w-96 group">
          <input
            type="text"
            placeholder="Search destinations..."
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
        <button
          onClick={() => handleOpenDrawer()}
          className="w-full md:w-auto btn btn-primary h-12 px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20"
        >
          Add Popular Destination
        </button>
      </div>

      {/* Table */}
      <div className="bg-base-100 rounded-2xl border border-base-content/5 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-md w-full">
            <thead>
              <tr className="border-b border-base-content/5 h-14">
                <th className="pl-10 text-[10px] font-black uppercase tracking-widest text-base-content/40">
                  SL
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest text-base-content/40">
                  Destination
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest text-base-content/40">
                  Badge/Rating
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest text-base-content/40">
                  Price
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest text-base-content/40">
                  Status
                </th>
                <th className="pr-10 text-right text-[10px] font-black uppercase tracking-widest text-base-content/40">
                  Actions
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
                    No Destination found
                    <button
                      onClick={handleClearSearch}
                      className="ml-2 px-3 py-2 rounded-xl font-bold text-primary hover:text-secondary hover:bg-primary/10"
                    >
                      Clear Filter
                    </button>
                  </td>
                </tr>
              ) : (
                currentItems.map((dest, index) => (
                  <tr
                    key={dest._id}
                    className="hover:bg-base-200/30 transition-colors border-b border-base-content/5 group"
                  >
                    <td className="pl-10 text-[10px] font-black text-base-content/20">
                      {(indexOfFirstItem + index + 1)
                        .toString()
                        .padStart(2, "0")}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-base-200 border border-base-content/5">
                          {dest.image && (
                            <Image
                              src={dest.image}
                              alt={dest.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-black text-base-content uppercase tracking-tight">
                            {dest.name}
                          </div>
                          <div className="text-[9px] font-bold text-base-content/40 uppercase">
                            {dest.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-accent">
                          {dest.badge}
                        </span>
                        <span className="text-[10px] font-bold text-base-content/40">
                          ⭐ {dest.rating}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="font-black text-primary">
                        ${dest.price}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-md border ${
                          dest.status === 1
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-error/10 text-error border-error/20"
                        }`}
                      >
                        {dest.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="pr-10 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenDrawer(dest)}
                          className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(dest._id)}
                          className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center hover:bg-error hover:text-white transition-all"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
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
                        <button
                          onClick={() =>
                            handleStatusChange(dest._id, dest.status)
                          }
                          className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center hover:bg-info hover:text-white transition-all"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleOpenDetails(dest)}
                          className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center hover:bg-accent hover:text-white transition-all"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
      {filteredDestinations.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={setCurrentPage}
        />
      )}

      {/* Admin Drawer */}
      <div
        className={`fixed inset-0 z-[100] transition-visibility duration-300 ${isDrawerOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-base-300/40 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={handleCloseDrawer}
        ></div>
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-2xl bg-base-100 shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="h-2 bg-primary w-full shrink-0"></div>
          <button
            onClick={handleCloseDrawer}
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

          <div className="p-8 pb-4 shrink-0">
            <h2 className="text-3xl font-black uppercase tracking-tighter">
              {editingDest ? "Edit Destination" : "Add Destination"}
            </h2>
            <div className="h-px bg-base-content/5 mt-6"></div>
          </div>

          <div className="p-8 pt-4 flex-1 overflow-y-auto custom-scrollbar space-y-8">
            <form id="dest-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Primary Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
                    Pop ID *
                  </label>
                  <input
                    type="number"
                    name="pop_id"
                    required
                    value={formData.pop_id}
                    onChange={handleInputChange}
                    className="w-full h-12 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-bold text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full h-12 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-bold text-xs appearance-none"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
                  Destination Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full h-12 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-bold text-xs"
                  placeholder="E.g. Bali, Indonesia"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full h-12 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-bold text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
                    Best Time to Visit
                  </label>
                  <input
                    type="text"
                    name="bestTimeToVisit"
                    value={formData.bestTimeToVisit}
                    onChange={handleInputChange}
                    className="w-full h-12 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-bold text-xs"
                    placeholder="April - October"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full h-12 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-bold text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full h-12 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-bold text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
                    Discount
                  </label>
                  <input
                    type="text"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="w-full h-12 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-bold text-xs"
                    placeholder="15% OFF"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
                  Badge
                </label>
                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  className="w-full h-12 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-bold text-xs"
                  placeholder="Popular, Trending, etc."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
                  Primary Image URL *
                </label>
                <input
                  type="text"
                  name="image"
                  required
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full h-12 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-bold text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  className="w-full h-24 p-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-bold text-xs resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
                  Long Description
                </label>
                <textarea
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleInputChange}
                  className="w-full h-40 p-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-bold text-xs resize-none"
                />
              </div>

              {/* Dynamic Arrays */}
              <ArrayInputSection
                label="Gallery Images"
                field="moreImage"
                items={formData.moreImage}
                onAdd={() => addArrayField("moreImage")}
                onRemove={(idx: any) => removeArrayField("moreImage", idx)}
                onChange={(idx: any, val: any) =>
                  handleArrayFieldChange("moreImage", idx, val)
                }
              />

              <ArrayInputSection
                label="Nearby Attractions"
                field="nearbyAttractions"
                items={formData.nearbyAttractions}
                onAdd={() => addArrayField("nearbyAttractions")}
                onRemove={(idx: any) =>
                  removeArrayField("nearbyAttractions", idx)
                }
                onChange={(idx: any, val: any) =>
                  handleArrayFieldChange("nearbyAttractions", idx, val)
                }
              />

              {/* Itinerary Management */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
                    Itinerary Management
                  </label>
                  <button
                    type="button"
                    onClick={addItineraryDay}
                    className="text-[10px] font-black text-primary uppercase"
                  >
                    + Add Day
                  </button>
                </div>
                <div className="space-y-6">
                  {formData.itinerary.map((item, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-6 rounded-2xl bg-base-200/30 border border-base-content/5 space-y-4 relative group/day"
                    >
                      <button
                        type="button"
                        onClick={() => removeItineraryDay(dIdx)}
                        className="absolute top-4 right-4 text-error opacity-0 group-hover/day:opacity-100 transition-opacity"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                          D{item.day}
                        </div>
                        <input
                          type="text"
                          placeholder="Day Title (e.g. Arrival)"
                          value={item.title}
                          onChange={(e) =>
                            handleItineraryChange(dIdx, "title", e.target.value)
                          }
                          className="flex-1 h-10 px-4 rounded-xl bg-base-100 border border-base-content/5 font-bold text-xs"
                        />
                      </div>
                      <div className="space-y-2 pl-14">
                        {item.activities.map((act, aIdx) => (
                          <div key={aIdx} className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Activity..."
                              value={act}
                              onChange={(e) =>
                                handleActivityChange(dIdx, aIdx, e.target.value)
                              }
                              className="flex-1 h-10 px-4 rounded-xl bg-base-100 border border-base-content/5 font-bold text-[11px]"
                            />
                            <button
                              type="button"
                              onClick={() => removeActivity(dIdx, aIdx)}
                              className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center"
                            >
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
                                  strokeWidth="2.5"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addActivity(dIdx)}
                          className="text-[9px] font-black text-primary/60 hover:text-primary uppercase tracking-widest"
                        >
                          + Add Activity
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>

          <div className="p-8 border-t border-base-content/5 bg-base-100 flex gap-4">
            <button
              onClick={handleCloseDrawer}
              className="flex-1 btn btn-ghost h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-base-content/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="dest-form"
              className="flex-[2] btn btn-primary h-12 rounded-2xl font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-primary/30"
            >
              {editingDest ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </div>

      <DestDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        onClose={handleCloseDetails}
        dest={viewingDest}
      />
    </div>
  );
};

const ArrayInputSection = ({
  label,
  items,
  onAdd,
  onRemove,
  onChange,
}: any) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
        {label}
      </label>
      <button
        type="button"
        onClick={onAdd}
        className="text-[10px] font-black text-primary uppercase"
      >
        + Add Item
      </button>
    </div>
    <div className="space-y-2">
      {items.map((item: string, idx: number) => (
        <div key={idx} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => onChange(idx, e.target.value)}
            className="flex-1 h-12 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-bold text-xs"
          />
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center shrink-0 hover:bg-error hover:text-white transition-all"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  </div>
);

const DestDetailsDrawer = ({
  isOpen,
  onClose,
  dest,
}: {
  isOpen: boolean;
  onClose: () => void;
  dest: PopularDestination | null;
}) => {
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (dest?.image) {
      setTimeout(() => {
        setActiveImage(dest.image);
      }, 0);
    }
  }, [dest]);

  if (!dest) return null;

  const gallery = [dest.image, ...(dest.moreImage || [])].filter(Boolean);

  return (
    <div
      className={`fixed inset-0 z-[110] transition-visibility duration-300 ${isOpen ? "visible" : "invisible"}`}
    >
      <div
        className={`absolute inset-0 bg-base-300/40 backdrop-blur-md transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      ></div>
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-2xl bg-base-100 shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-2 bg-accent w-full shrink-0"></div>
        <button
          onClick={onClose}
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
        <div className="p-10 pb-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Detailed <span className="text-accent italic">Manifest</span>
          </h2>
          <p className="text-[10px] font-black text-base-content/30 uppercase tracking-widest mt-2">
            Popular Destination Record
          </p>
          <div className="h-px bg-base-content/5 mt-8"></div>
        </div>
        <div className="p-10 pt-4 flex-1 overflow-y-auto custom-scrollbar space-y-10">
          <div className="space-y-4">
            <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-base-100 shadow-2xl group">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-base-200 flex items-center justify-center text-base-content/20 font-black uppercase tracking-widest">
                  No Image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <span className="px-4 py-1.5 rounded-full bg-accent text-white text-[10px] font-black uppercase tracking-widest">
                  {dest.badge}
                </span>
                <h3 className="text-3xl font-black text-white uppercase mt-4 tracking-tight">
                  {dest.name}
                </h3>
                <p className="text-white/60 font-bold text-sm uppercase tracking-widest mt-1">
                  {dest.location}
                </p>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-24 aspect-video rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === img ? "border-accent shadow-lg scale-95" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <Image
                      src={img}
                      alt={`Gallery ${idx}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8">
            <DetailItem label="Destination ID" value={dest.pop_id} />
            <DetailItem label="Global Rating" value={`${dest.rating} / 5.0`} />
            <DetailItem label="Base Price" value={`$${dest.price}`} />
            <DetailItem label="Discount Offer" value={dest.discount || "N/A"} />
            <DetailItem
              label="Status"
              value={dest.status === 1 ? "ACTIVE" : "INACTIVE"}
            />
            <DetailItem
              label="Best Visit Time"
              value={dest.bestTimeToVisit || "N/A"}
            />
            <DetailItem
              label="Nearby Attractions"
              value={dest.nearbyAttractions}
              fullWidth
            />
            <DetailItem
              label="Manifest Description"
              value={dest.longDescription}
              fullWidth
            />
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/20 ml-1">
              Journey Itinerary
            </label>
            <div className="space-y-4">
              {dest.itinerary?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-base-200/50 border border-base-content/5 flex gap-6"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg shrink-0">
                    D{item.day}
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-black text-base-content uppercase tracking-tight">
                      {item.title}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.activities.map((act, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-base-100 border border-base-content/5 text-[10px] font-bold text-base-content/60 uppercase"
                        >
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-10 border-t border-base-content/5 flex gap-4">
          <button
            onClick={onClose}
            className="w-full btn btn-ghost h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-base-content/10"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, fullWidth = false }: any) => (
  <div className={`space-y-2 ${fullWidth ? "col-span-2" : ""}`}>
    <label className="text-[10px] font-black uppercase tracking-widest text-base-content/20 ml-1">
      {label}
    </label>
    <div className="min-h-12 px-6 py-4 rounded-2xl bg-base-200/30 border border-base-content/5 text-xs font-bold text-base-content/70">
      {Array.isArray(value) ? (
        <div className="flex flex-wrap gap-2">
          {value.map((v, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded bg-base-100 text-[9px] uppercase font-black"
            >
              {v}
            </span>
          ))}
        </div>
      ) : (
        value || "N/A"
      )}
    </div>
  </div>
);

export default AddDestination;
