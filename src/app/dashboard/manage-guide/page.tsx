"use client";

import React, { useState, useEffect } from "react";
import AdminRoute from "@/routes/AdminRoute";
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

interface TourGuide {
  _id: string;
  id: number;
  name: string;
  image: string;
  experience: number;
  languages: string[];
  specialty: string;
  rating: number;
  destination: string;
  tour_type: string;
  shortDescription: string;
  benefits: string[];
  details: {
    bio: string;
    longDescription: string;
    education: string;
    certificates: string[];
    totalTours: number;
    joinedDate: string;
  };
  status: number;
  modifiedAt?: string;
  user_info?: string;
}

const ManageGuide = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const axiosSecure = useAxiosSecure();
  const [guides, setGuides] = useState<TourGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<TourGuide | null>(null);
  const [viewingGuide, setViewingGuide] = useState<TourGuide | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuides = guides.filter((guide) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      guide.name.toLowerCase().includes(searchLower) ||
      guide.destination.toLowerCase().includes(searchLower) ||
      guide.id.toString().includes(searchLower)
    );
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGuides.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGuides.length / itemsPerPage);

  // Reset to first page when searching
  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 0);
  }, [searchQuery]);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    image: "",
    experience: "",
    languages: [] as string[],
    specialty: "",
    rating: "5.0",
    destination: "",
    tour_type: "",
    shortDescription: "",
    benefits: [] as string[],
    details: {
      bio: "",
      longDescription: "",
      education: "",
      certificates: [] as string[],
      totalTours: "0",
      joinedDate: "",
    },
    status: 1,
  });

  const statusList = [
    { value: 1, label: "Active" },
    { value: 0, label: "Inactive" },
  ];

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get("/api/tourism/get-guide-list");
      if (response.data && Array.isArray(response.data.list_data)) {
        setGuides(response.data.list_data);
      }
    } catch (error) {
      console.error("Error fetching guides:", error);
      showError("Data Error", "Failed to synchronize guide manifest.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchGuides();
    }, 0);
  }, [axiosSecure]);

  const handleOpenDrawer = (guide: TourGuide | null = null) => {
    if (guide) {
      setEditingGuide(guide);
      setFormData({
        id: guide.id.toString(),
        name: guide.name,
        image: guide.image,
        experience: guide.experience.toString(),
        languages: guide.languages || [],
        specialty: guide.specialty,
        rating: guide.rating.toString(),
        destination: guide.destination,
        tour_type: guide.tour_type,
        shortDescription: guide.shortDescription,
        benefits: guide.benefits || [],
        details: {
          bio: guide.details?.bio || "",
          longDescription: guide.details?.longDescription || "",
          education: guide.details?.education || "",
          certificates: guide.details?.certificates || [],
          totalTours: guide.details?.totalTours?.toString() || "0",
          joinedDate: guide.details?.joinedDate || "",
        },
        status: guide.status,
      });
    } else {
      setEditingGuide(null);
      setFormData({
        id: "",
        name: "",
        image: "",
        experience: "",
        languages: [],
        specialty: "",
        rating: "5.0",
        destination: "",
        tour_type: "",
        shortDescription: "",
        benefits: [],
        details: {
          bio: "",
          longDescription: "",
          education: "",
          certificates: [],
          totalTours: "0",
          joinedDate: "",
        },
        status: 1,
      });
    }
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setEditingGuide(null), 300);
  };

  const handleOpenDetails = (guide: TourGuide) => {
    setViewingGuide(guide);
    setIsDetailsDrawerOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsDrawerOpen(false);
    setTimeout(() => setViewingGuide(null), 300);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "status" || name === "experience" || name === "id"
          ? Number(value)
          : value,
    }));
  };

  const handleDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      details: { ...prev.details, [name]: value },
    }));
  };

  const handleArrayInputChange = (
    field: "languages" | "benefits",
    index: number,
    value: string,
  ) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const handleAddArrayField = (field: "languages" | "benefits") => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleRemoveArrayField = (
    field: "languages" | "benefits",
    index: number,
  ) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const handleCertificateChange = (index: number, value: string) => {
    const updated = [...formData.details.certificates];
    updated[index] = value;
    setFormData((prev) => ({
      ...prev,
      details: { ...prev.details, certificates: updated },
    }));
  };

  const handleAddCertificate = () => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        certificates: [...prev.details.certificates, ""],
      },
    }));
  };

  const handleRemoveCertificate = (index: number) => {
    const updated = formData.details.certificates.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      details: { ...prev.details, certificates: updated },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    const action = editingGuide ? "Update" : "Create";
    const result = await showConfirmation(
      `${action} Guide?`,
      `This will ${action.toLowerCase()} the tour guide in the global registry.`,
      action,
      "Cancel",
    );

    if (result.isConfirmed) {
      showProcessing(`${action}ing Guide...`);

      try {
        const payload = {
          id: Number(formData.id),
          name: formData.name,
          image: formData.image,
          experience: Number(formData.experience),
          languages: formData.languages,
          specialty: formData.specialty,
          rating: Number(formData.rating),
          destination: formData.destination,
          tour_type: formData.tour_type,
          shortDescription: formData.shortDescription,
          benefits: formData.benefits,
          details: {
            ...formData.details,
            totalTours: Number(formData.details.totalTours),
          },
          status: Number(formData.status),
          user_info: user.email,
          ...(editingGuide?._id && { _id: editingGuide._id }),
        };

        await axiosSecure.post("/api/admin/insert-update-guide-list", payload);
        await fetchGuides();

        showSuccess(
          `Guide ${action}d`,
          `The tour guide has been successfully ${action.toLowerCase()}d.`,
        );

        handleCloseDrawer();
      } catch (error: any) {
        console.error("Error saving guide:", error);
        showError(
          "Operation Failed",
          error.response?.data?.message || "An unexpected error occurred.",
        );
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await showConfirmation(
      "Delete Guide?",
      "This action will permanently remove this guide from the platform.",
      "Delete",
      "Keep",
    );

    if (result.isConfirmed) {
      showProcessing("Deleting Guide...");
      try {
        await axiosSecure.delete(`/api/admin/delete-guide-list/${id}`);
        await fetchGuides();
        showSuccess(
          "Guide Deleted",
          "The tour guide has been removed from the registry.",
        );
      } catch (error: any) {
        showError(
          "Deletion Failed",
          error.response?.data?.message || "Failed to remove guide.",
        );
      }
    }
  };

  const handleStatusChange = async (id: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const result = await showConfirmation(
      "Change Status?",
      `This will set the guide to ${newStatus === 1 ? "Active" : "Inactive"}.`,
      "Update",
      "Cancel",
    );

    if (result.isConfirmed) {
      showProcessing("Updating Status...");
      try {
        await axiosSecure.patch(`/api/admin/update-guide-status/${id}`, {
          status: newStatus,
        });
        await fetchGuides();
        showSuccess(
          "Status Updated",
          "The guide availability has been synchronized.",
        );
      } catch (error: any) {
        showError(
          "Update Failed",
          error.response?.data?.message || "Failed to update status.",
        );
      }
    }
  };

  if (loading) {
    return <DashboardSkeleton></DashboardSkeleton>;
  }

  return (
    <AdminRoute>
      <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 relative">
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="relative w-full md:w-96 group">
          <input
            type="text"
            placeholder="Search guides by name, destination or ID..."
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
          className="w-full md:w-auto btn btn-primary h-12 px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20 cursor-pointer"
        >
          Add New Guide
        </button>
      </div>

      {/* Information Row */}
      <div className="flex flex-wrap items-center gap-4 mb-10">
        <div className="px-6 py-3 bg-base-100 rounded-2xl border border-base-content/5 flex items-center gap-3 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
            Total Guides:
          </span>
          <span className="text-sm font-black text-primary">
            {guides.length}
          </span>
        </div>
        <div className="px-6 py-3 bg-base-100 rounded-2xl border border-base-content/5 flex items-center gap-3 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
            Active Guides:
          </span>
          <span className="text-sm font-black text-success">
            {guides.filter((p) => p.status === 1).length}
          </span>
        </div>
        {searchQuery && (
          <div className="px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-3 shadow-sm animate-in fade-in zoom-in duration-300">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
              Filtered Results:
            </span>
            <span className="text-sm font-black text-primary">
              {filteredGuides.length}
            </span>
            <button
              onClick={() => setSearchQuery("")}
              className="ml-2 text-[10px] font-black uppercase tracking-widest text-base-content/40 hover:text-error transition-colors"
            >
              [Clear Filter]
            </button>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-base-100 rounded-2xl border border-base-content/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-md w-full">
            <thead>
              <tr className="border-b border-base-content/5 h-10">
                <th className="pl-10 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                  SL
                </th>
                <th className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                  Guide
                </th>
                <th className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                  Expertise
                </th>
                <th className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                  Destination
                </th>
                <th className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                  Status
                </th>
                <th className="pr-10 text-right text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
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
                    No guides found
                  </td>
                </tr>
              ) : (
                currentItems.map((guide, index) => (
                  <tr
                    key={index}
                    className="hover:bg-base-200/30 transition-colors border-b border-base-content/5 group"
                  >
                    <td className="pl-10 text-[10px] font-black text-base-content/20 uppercase tracking-widest">
                      {(indexOfFirstItem + index + 1)
                        .toString()
                        .padStart(2, "0")}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-base-200 border border-base-content/5 shrink-0">
                          {guide.image ? (
                            <Image
                              src={guide.image}
                              alt={guide.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-black text-[10px]">
                              {guide.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-black text-base-content uppercase tracking-tight line-clamp-1">
                            {guide.name}
                          </div>
                          <div className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">
                            ID: {guide.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black uppercase tracking-widest text-base-content/70">
                          {guide.specialty}
                        </span>
                        <span className="text-[9px] font-bold text-base-content/40 uppercase tracking-widest">
                          {guide.experience} Years Exp.
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black uppercase tracking-widest text-base-content/70">
                          {guide.destination}
                        </span>
                        <span className="text-[9px] font-bold text-base-content/40 uppercase tracking-widest">
                          {guide.tour_type}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] rounded-md border ${
                          guide.status === 1
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-error/10 text-error border-error/20"
                        }`}
                      >
                        {guide.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="pr-10 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenDrawer(guide)}
                          className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-white transition-all shadow-sm"
                          title="Edit Guide"
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
                          onClick={() => handleDelete(guide._id)}
                          className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-error hover:text-white transition-all shadow-sm"
                          title="Delete Guide"
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
                            handleStatusChange(guide._id, guide.status)
                          }
                          className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-info hover:text-white transition-all shadow-sm"
                          title="Toggle Status"
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
                          onClick={() => handleOpenDetails(guide)}
                          className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-accent hover:text-white transition-all shadow-sm"
                          title="Detailed Profile"
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

      {/* Pagination Section */}
      {filteredGuides.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={setCurrentPage}
        />
      )}

      {/* Side Drawer Section */}
      <div
        className={`fixed inset-0 z-[100] transition-visibility duration-300 ${isDrawerOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-base-300/40 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={handleCloseDrawer}
        ></div>
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-xl bg-base-100 shadow-2xl transition-transform duration-500 ease-out border-l border-base-content/5 flex flex-col ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
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

          <div className="p-8 pb-0 shrink-0">
            <h2 className="text-3xl font-black text-base-content tracking-tighter uppercase leading-none">
              {editingGuide ? "Edit Guide" : "Add Guide"}
            </h2>
            <div className="h-px bg-base-content/5 mt-8"></div>
          </div>

          <div className="p-10 pt-8 flex-1 overflow-y-auto custom-scrollbar">
            <form id="guide-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Guide ID <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    name="id"
                    required
                    value={formData.id}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                  >
                    {statusList.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                  Full Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Rating
                  </label>
                  <input
                    type="text"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Primary Specialty
                  </label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Tour Type
                  </label>
                  <input
                    type="text"
                    name="tour_type"
                    value={formData.tour_type}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                  Destination Cover
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30 resize-none"
                />
              </div>

              {/* Dynamic Arrays */}
              <div className="space-y-4 pt-4 border-t border-base-content/5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Languages Spoken
                </h3>
                {formData.languages.map((lang, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={lang}
                      onChange={(e) =>
                        handleArrayInputChange("languages", idx, e.target.value)
                      }
                      className="flex-1 h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayField("languages", idx)}
                      className="btn btn-ghost btn-square btn-sm h-11 w-11 rounded-xl text-error"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddArrayField("languages")}
                  className="btn btn-ghost btn-xs font-black uppercase tracking-widest text-primary"
                >
                  + Add Language
                </button>
              </div>

              <div className="space-y-4 pt-4 border-t border-base-content/5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Key Benefits
                </h3>
                {formData.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) =>
                        handleArrayInputChange("benefits", idx, e.target.value)
                      }
                      className="flex-1 h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayField("benefits", idx)}
                      className="btn btn-ghost btn-square btn-sm h-11 w-11 rounded-xl text-error"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddArrayField("benefits")}
                  className="btn btn-ghost btn-xs font-black uppercase tracking-widest text-primary"
                >
                  + Add Benefit
                </button>
              </div>

              {/* Details Object */}
              <div className="space-y-4 pt-4 border-t border-base-content/5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Detailed Profile
                </h3>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Professional Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.details.bio}
                    onChange={handleDetailsChange}
                    rows={3}
                    className="w-full p-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30 resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Long Description
                  </label>
                  <textarea
                    name="longDescription"
                    value={formData.details.longDescription}
                    onChange={handleDetailsChange}
                    rows={5}
                    className="w-full p-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={formData.details.education}
                      onChange={handleDetailsChange}
                      className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                      Total Tours
                    </label>
                    <input
                      type="number"
                      name="totalTours"
                      value={formData.details.totalTours}
                      onChange={handleDetailsChange}
                      className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Joined Date (e.g. March 2020)
                  </label>
                  <input
                    type="text"
                    name="joinedDate"
                    value={formData.details.joinedDate}
                    onChange={handleDetailsChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Professional Certificates
                  </label>
                  {formData.details.certificates.map((cert, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={cert}
                        onChange={(e) =>
                          handleCertificateChange(idx, e.target.value)
                        }
                        className="flex-1 h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCertificate(idx)}
                        className="btn btn-ghost btn-square btn-sm h-11 w-11 rounded-xl text-error"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddCertificate}
                    className="btn btn-ghost btn-xs font-black uppercase tracking-widest text-primary"
                  >
                    + Add Certificate
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="p-10 border-t border-base-content/5 bg-base-100 shrink-0 space-y-6 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="flex-1 btn btn-ghost h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] border border-base-content/10"
              >
                Discard
              </button>
              <button
                type="submit"
                form="guide-form"
                className="flex-[2] btn btn-primary h-14 rounded-2xl font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-primary/30"
              >
                {editingGuide ? "Update Profile" : "Register Guide"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <GuideDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        onClose={handleCloseDetails}
        guide={viewingGuide}
      />
    </div>
    </AdminRoute>
  );
};

const GuideDetailsDrawer = ({
  isOpen,
  onClose,
  guide,
}: {
  isOpen: boolean;
  onClose: () => void;
  guide: TourGuide | null;
}) => {
  if (!guide) return null;

  return (
    <div
      className={`fixed inset-0 z-[110] transition-visibility duration-300 ${isOpen ? "visible" : "invisible"}`}
    >
      <div
        className={`absolute inset-0 bg-base-300/40 backdrop-blur-md transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      ></div>
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-4xl bg-base-100 shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-2 bg-primary w-full shrink-0"></div>
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

        <div className="py-5 px-12 pb-2">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/10">
              {guide.specialty}
            </span>
            <span className="text-[9px] font-black text-base-content/30 uppercase tracking-[0.3em]">
              {guide.experience} Years Experience • {guide.tour_type}
            </span>
          </div>
          <h2 className="text-5xl font-black uppercase tracking-tight leading-[0.9] text-base-content">
            {guide.name}
          </h2>
          <div className="h-px bg-base-content/5 mt-10"></div>
        </div>

        <div className="px-12 py-6 flex-1 overflow-y-auto custom-scrollbar space-y-12">
          {/* Hero Profile Image */}
          <div className="relative aspect-[100/90] rounded-3xl overflow-hidden border border-base-content/5 shadow-inner bg-base-200">
            <Image
              src={guide.image}
              alt={guide.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="grid grid-cols-3 gap-12">
            <div className="col-span-2 space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/20">
                  Professional Biography
                </label>
                <p className="text-base font-bold text-base-content/80 leading-relaxed border-l-4 border-primary pl-6">
                  {guide.details?.bio}
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/20">
                  Full Career Overview
                </label>
                <div className="text-base-content/70 font-medium leading-loose whitespace-pre-wrap text-sm">
                  {guide.details?.longDescription}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/20">
                    Certifications
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {guide.details?.certificates.map((cert, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-xl bg-secondary/5 text-[10px] font-bold text-secondary border border-secondary/10"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/20">
                    Languages
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {guide.languages.map((lang, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-xl bg-primary/5 text-[10px] font-bold text-primary border border-primary/10"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="p-8 rounded-3xl bg-base-200/50 border border-base-content/5 space-y-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-base-content/30">
                  Career Statistics
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-base-content/40 uppercase">
                      Total Tours
                    </span>
                    <span className="text-sm font-black text-primary">
                      {guide.details?.totalTours}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-base-content/40 uppercase">
                      Rating
                    </span>
                    <span className="text-sm font-black text-amber-500">
                      {guide.rating}/5.0
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-base-content/40 uppercase">
                      Joined
                    </span>
                    <span className="text-[10px] font-black text-base-content/60">
                      {guide.details?.joinedDate}
                    </span>
                  </div>
                </div>
                <div className="h-px bg-base-content/5"></div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30">
                    Academic
                  </label>
                  <p className="text-[11px] font-black text-base-content leading-tight uppercase">
                    {guide.details?.education}
                  </p>
                </div>
              </div>

              <div className="p-8 rounded-3xl border border-dashed border-base-content/10 space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-base-content/20">
                  Registry Verification
                </div>
                <div className="space-y-3">
                  <MetaItem label="Guide ID" value={guide.id} />
                  <MetaItem
                    label="Last Sync"
                    value={
                      guide.modifiedAt
                        ? new Date(guide.modifiedAt).toLocaleDateString()
                        : "Never"
                    }
                  />
                  <MetaItem
                    label="System Status"
                    value={guide.status === 1 ? "VERIFIED" : "SUSPENDED"}
                  />
                  <MetaItem
                    label="Managed By"
                    value={guide.user_info || "System"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-12 py-6 border-t border-base-content/5 flex gap-4 bg-base-100">
          <button
            onClick={onClose}
            className="w-full btn btn-ghost h-14 rounded-2xl font-black uppercase tracking-[0.4em] text-xs border border-base-content/10 shadow-sm"
          >
            Close Profile Manifest
          </button>
        </div>
      </div>
    </div>
  );
};

const MetaItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex justify-between items-center">
    <span className="text-[9px] font-bold text-base-content/30 uppercase">
      {label}
    </span>
    <span className="text-[9px] font-black text-base-content/60 uppercase truncate ml-4">
      {value}
    </span>
  </div>
);

export default ManageGuide;
