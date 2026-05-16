"use client";

import React, { useState, useEffect, useCallback } from "react";
import AdminRoute from "@/routes/AdminRoute";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import {
  showError,
  showConfirmation,
  showProcessing,
  showSuccess,
} from "@/components/pages/Alert";
import Pagination from "@/components/pages/Pagination";
import DashboardSkeleton from "@/components/pages/DashboardSkeleton";

interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  poster_image: string;
  more_image?: string[];
  status: number;
  user_info?: string;
  createdAt?: string;
}

const ManageGalleryPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const axiosSecure = useAxiosSecure();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [viewingItem, setViewingItem] = useState<GalleryItem | null>(null);

  // Search State (Filter by user_info or image URL)
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = galleryItems.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.title?.toLowerCase().includes(searchLower) ||
      item.user_info?.toLowerCase().includes(searchLower) ||
      item.poster_image?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    poster_image: "",
    more_image: [] as string[],
    status: 1,
  });

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get(
        "/api/tourism/get-galary-photo-list",
      );
      if (response.data && Array.isArray(response.data.list_data)) {
        setGalleryItems(response.data.list_data);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
      showError("Data Error", "Failed to synchronize gallery manifest.");
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    setTimeout(() => {
      fetchGallery();
    }, 0);
  }, [fetchGallery]);

  const handleOpenDrawer = (item: GalleryItem | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        category: item.category || "",
        poster_image: item.poster_image,
        more_image: item.more_image || [],
        status: item.status,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        category: "",
        poster_image: "",
        more_image: [],
        status: 1,
      });
    }
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setEditingItem(null), 300);
  };

  const handleOpenDetails = (item: GalleryItem) => {
    setViewingItem(item);
    setIsDetailsDrawerOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsDrawerOpen(false);
    setTimeout(() => setViewingItem(null), 300);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? Number(value) : value,
    }));
  };

  const handleArrayInputChange = (index: number, value: string) => {
    const updatedArray = [...formData.more_image];
    updatedArray[index] = value;
    setFormData((prev) => ({ ...prev, more_image: updatedArray }));
  };

  const handleAddArrayField = () => {
    setFormData((prev) => ({ ...prev, more_image: [...prev.more_image, ""] }));
  };

  const handleRemoveArrayField = (index: number) => {
    const updatedArray = formData.more_image.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, more_image: updatedArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    // Client-side validation
    if (!formData.title || !formData.category || !formData.poster_image) {
      showError("Validation Error", "Invalid or missing required fields");
      return;
    }

    const action = editingItem ? "Update" : "Upload";
    const result = await showConfirmation(
      `${action} Photo?`,
      `This will ${action.toLowerCase()} the photograph in the global gallery.`,
      action,
      "Cancel",
    );

    if (result.isConfirmed) {
      showProcessing(
        `${action === "Upload" ? "Uploading" : "Updating"} Photo...`,
      );

      try {
        const payload = {
          _id: editingItem ? editingItem._id : null,
          title: formData.title,
          category: formData.category,
          poster_image: formData.poster_image,
          more_image: formData.more_image.filter(Boolean),
          status: Number(formData.status),
          user_info: user.email,
        };

        await axiosSecure.post(
          "/api/tourism/admin/insert-update-galary-photo-list",
          payload,
        );
        await fetchGallery();

        showSuccess(
          `Photo ${action === "Upload" ? "Uploaded" : "Updated"}`,
          `The photograph has been successfully synchronized.`,
        );

        handleCloseDrawer();
      } catch (error: any) {
        showError(
          "Operation Failed",
          error.response?.data?.message || "Invalid or missing required fields",
        );
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await showConfirmation(
      "Delete Photo?",
      "This action will permanently remove this photograph from the gallery.",
      "Delete",
      "Keep",
    );

    if (result.isConfirmed) {
      showProcessing("Deleting Photo...");
      try {
        await axiosSecure.delete(`/api/tourism/delete-galary-image-list/${id}`);
        await fetchGallery();
        showSuccess("Photo Removed", "The photograph has been deleted.");
      } catch {
        showError("Deletion Failed", "Failed to remove photograph.");
      }
    }
  };

  const handleStatusChange = async (id: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const result = await showConfirmation(
      "Change Visibility?",
      `This photo will be set to ${newStatus === 1 ? "Visible" : "Hidden"}.`,
      "Update",
      "Cancel",
    );

    if (result.isConfirmed) {
      showProcessing("Updating Visibility...");
      try {
        await axiosSecure.patch(`/api/tourism/update-image-status/${id}`, {
          status: newStatus,
        });
        await fetchGallery();
        showSuccess("Status Updated", "Visibility has been synchronized.");
      } catch {
        showError("Update Failed", "Failed to update visibility.");
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
    <AdminRoute>
      <div className="p-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="relative w-full md:w-96 group">
          <input
            type="text"
            placeholder="Search gallery by URL or uploader..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-12 pr-6 rounded-xl bg-base-100 border border-base-content/5 text-xs font-black focus:outline-none focus:border-primary/30 transition-all shadow-sm"
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
          className="w-full md:w-auto btn btn-primary h-11 px-10 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20"
        >
          Add New Photo
        </button>
      </div>

      {/* Information Row */}
      <div className="flex flex-wrap items-center gap-4 mb-10">
        <div className="px-6 py-3 bg-base-100 rounded-2xl border border-base-content/5 flex items-center gap-3 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
            Total Assets:
          </span>
          <span className="text-sm font-black text-primary">
            {galleryItems.length}
          </span>
        </div>
        <div className="px-6 py-3 bg-base-100 rounded-2xl border border-base-content/5 flex items-center gap-3 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
            Active Media:
          </span>
          <span className="text-sm font-black text-success">
            {galleryItems.filter((i) => i.status === 1).length}
          </span>
        </div>
        {searchQuery && (
          <div className="px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-3 shadow-sm animate-in fade-in zoom-in duration-300">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
              Matched Media:
            </span>
            <span className="text-sm font-black text-primary">
              {filteredItems.length}
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

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-40 text-center space-y-4 bg-base-100 rounded-3xl border border-dashed border-base-content/10">
          <div className="text-4xl">📸</div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-base-content/20">
            Gallery Empty
          </p>
          <button
            onClick={handleClearSearch}
            className="ml-2 px-3 py-2 rounded-xl font-bold text-primary hover:text-secondary hover:bg-primary/10"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {currentItems.map((item) => (
            <div
              key={item._id}
              className="group relative bg-base-100 rounded-[2.5rem] p-4 border border-base-content/5 shadow-[0_30px_100px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_120px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-3"
            >
              {/* Photo Stage */}
              <div
                onClick={() => handleOpenDetails(item)}
                className="aspect-square relative overflow-hidden rounded-[2rem] bg-base-200 cursor-pointer mb-6"
              >
                <img
                  src={item.poster_image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                />

                {/* Contextual Action Hub */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(item._id, item.status);
                      }}
                      className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-primary hover:border-primary flex items-center justify-center text-white transition-all shadow-xl"
                      title="Toggle Visibility"
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDrawer(item);
                      }}
                      className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-accent hover:border-accent flex items-center justify-center text-white transition-all shadow-xl"
                      title="Edit Metadata"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                      className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-error hover:border-error flex items-center justify-center text-white transition-all shadow-xl"
                      title="Delete Asset"
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
                </div>

                {/* Counter Badge */}
                {item.more_image && item.more_image.length > 0 && (
                  <div className="absolute bottom-5 right-5">
                    <span className="px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-md text-white text-[10px] font-black tracking-widest border border-white/10">
                      +{item.more_image.length}
                    </span>
                  </div>
                )}
              </div>

              <div className="px-4 pb-4 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40">
                      Asset Identity
                    </span>
                    <h3 className="text-lg font-black text-base-content uppercase tracking-tighter leading-tight line-clamp-1">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full animate-pulse ${item.status === 1 ? "bg-success" : "bg-error"}`}
                      ></div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-base-content/40">
                        {item.status === 1 ? "Live" : "Draft"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-base-content/5 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-widest text-base-content/20">
                      Uploader
                    </span>
                    <span className="text-[10px] font-bold text-base-content/60 truncate max-w-[100px]">
                      {item.user_info?.split("@")[0] || "System"}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black uppercase tracking-widest text-base-content/20">
                      Registered
                    </span>
                    <span className="text-[10px] font-bold text-base-content/60">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredItems.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={setCurrentPage}
        />
      )}

      {/* Gallery Drawer */}
      <div
        className={`fixed inset-0 z-[100] transition-transparency duration-300 ${isDrawerOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-base-300/40 backdrop-blur-md transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={handleCloseDrawer}
        ></div>
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-lg bg-base-100 shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
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

          <div className="p-10 pb-6 shrink-0 bg-base-100">
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
              {editingItem ? "Edit Photo" : "Upload Photo"}
            </h2>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-base-content/20">
              Gallery Asset Management
            </p>
            <div className="h-px bg-base-content/5 mt-8"></div>
          </div>

          <div className="p-10 pt-4 flex-1 overflow-y-auto custom-scrollbar">
            <form
              id="gallery-form"
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                  Photograph Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 font-black text-xs uppercase tracking-widest focus:border-primary/40 focus:outline-none transition-all"
                  placeholder="E.G. SUNSET OVER THE ALPS"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 font-black text-xs uppercase tracking-widest focus:border-primary/40 focus:outline-none transition-all"
                  placeholder="E.G. NATURE, CITY, ADVENTURE"
                />
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                  Photo Preview
                </label>
                <div className="aspect-video relative rounded-2xl overflow-hidden bg-base-200 border border-base-content/5 shadow-inner flex items-center justify-center">
                  {formData.poster_image ? (
                    <img
                      src={formData.poster_image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/20">
                      No Image Specified
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                  Primary Poster Image URL *
                </label>
                <input
                  type="text"
                  name="poster_image"
                  required
                  value={formData.poster_image}
                  onChange={handleInputChange}
                  className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 font-black text-xs focus:border-primary/40 focus:outline-none transition-all"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                  Initial Status *
                </label>
                <select
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 font-black text-xs appearance-none focus:border-primary/40 focus:outline-none transition-all"
                >
                  <option value={1}>Active / Visible</option>
                  <option value={0}>Hidden / Draft</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                  Additional Photographs
                </label>
                <div className="space-y-3">
                  {formData.more_image.map((img, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 animate-in slide-in-from-right-4 duration-300"
                    >
                      <input
                        type="text"
                        value={img}
                        onChange={(e) =>
                          handleArrayInputChange(idx, e.target.value)
                        }
                        className="flex-1 h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 font-black text-xs focus:border-primary/40 focus:outline-none transition-all"
                        placeholder="Supplementary URL..."
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayField(idx)}
                        className="w-11 h-11 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all flex items-center justify-center shrink-0 shadow-sm"
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
                            strokeWidth="3"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddArrayField}
                    className="w-full h-11 rounded-xl border-2 border-dashed border-base-content/10 text-[10px] font-black uppercase tracking-[0.3em] text-base-content/20 hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-2"
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
                        strokeWidth="3"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Expand Gallery Manifest
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="p-10 border-t border-base-content/5 bg-base-100 flex gap-4">
            <button
              onClick={handleCloseDrawer}
              className="flex-1 btn btn-ghost h-11 rounded-xl font-black uppercase tracking-widest text-[10px] border border-base-content/10"
            >
              Discard
            </button>
            <button
              type="submit"
              form="gallery-form"
              className="flex-[2] btn btn-primary h-11 rounded-xl font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-primary/30"
            >
              {editingItem ? "Save Changes" : "Confirm Upload"}
            </button>
          </div>
        </div>
      </div>
      {/* Gallery Details Drawer */}
      <GalleryDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        onClose={handleCloseDetails}
        item={viewingItem}
      />
    </div>
    </AdminRoute>
  );
};

// Sub-component for Details View
const DetailItem = ({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: string | number | string[];
  fullWidth?: boolean;
}) => (
  <div className={`space-y-1 ${fullWidth ? "col-span-2" : ""}`}>
    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/30 ml-1">
      {label}
    </label>
    <div className="w-full min-h-11 px-5 py-3 rounded-xl bg-base-200/30 border border-base-content/5 text-[11px] font-bold text-base-content/70 break-all">
      {Array.isArray(value) ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {value.map((v, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded-md bg-base-100 border border-base-content/5 text-[9px] uppercase tracking-wider font-black"
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

// Detail Drawer Implementation for Gallery
const GalleryDetailsDrawer = ({
  isOpen,
  onClose,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: GalleryItem | null;
}) => {
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (item?.poster_image) {
      setTimeout(() => {
        setActiveImage(item.poster_image);
      }, 0);
    }
  }, [item]);

  if (!item) return null;

  const gallery = [item.poster_image, ...(item.more_image || [])].filter(
    Boolean,
  );

  return (
    <div
      className={`fixed inset-0 z-[110] transition-visibility duration-300 ${isOpen ? "visible" : "invisible"}`}
    >
      <div
        className={`absolute inset-0 bg-base-300/60 backdrop-blur-md transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      ></div>
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-xl bg-base-100 shadow-2xl transition-transform duration-500 ease-out border-l border-base-content/5 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-2 bg-accent w-full shrink-0"></div>

        {/* Exterior Close Button */}
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

        {/* Header */}
        <div className="p-10 pb-0 shrink-0">
          <div>
            <h2 className="text-4xl font-black text-base-content tracking-tighter uppercase leading-none">
              Asset
              <br />
              <span className="text-accent italic">Collection</span>
            </h2>
            <p className="mt-2 text-[9px] font-black uppercase tracking-[0.2em] text-base-content/30">
              Complete Visual Verification
            </p>
          </div>
          <div className="h-px bg-base-content/5 mt-8"></div>
        </div>

        {/* Body */}
        <div className="p-10 pt-8 flex-1 overflow-y-auto custom-scrollbar space-y-8">
          {/* Main Visual */}
          <div className="space-y-4">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-base-200 border border-base-content/5 shadow-inner group">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-base-content/10 uppercase tracking-[0.4em]">
                  No Asset
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Gallery Navigation */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar no-scrollbar">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-24 aspect-[3/4] rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImage === img
                        ? "border-accent shadow-xl scale-95"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Asset ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-2 gap-6 pb-10">
            <DetailItem
              label="Internal Database ID"
              value={item._id}
              fullWidth
            />
            <DetailItem
              label="Asset Status"
              value={item.status === 1 ? "LIVE / VISIBLE" : "DRAFT / HIDDEN"}
            />
            <DetailItem label="Asset Category" value={item.category} />
            <DetailItem
              label="Uploader Identity"
              value={item.user_info || "System Admin"}
            />
            <DetailItem
              label="Registration Date"
              value={
                item.createdAt
                  ? new Date(item.createdAt).toLocaleString()
                  : "N/A"
              }
              fullWidth
            />
            <DetailItem
              label="Supplementary Image Collection"
              value={item.more_image || []}
              fullWidth
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-10 border-t border-base-content/5 bg-base-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full btn btn-ghost h-12 rounded-2xl font-black uppercase tracking-[0.4em] text-xs border border-base-content/10"
          >
            Close Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageGalleryPage;
