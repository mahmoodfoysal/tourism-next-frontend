"use client";

import React, { useState, useEffect, useCallback } from "react";
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

interface Review {
  _id: string;
  full_name: string;
  email: string;
  comment: string;
  image_url: string;
  rating: number;
  package_id: number;
  createdAt?: string;
}

interface TourPackage {
  _id: string;
  package_id: number;
  title: string;
}

const ManageReviewPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const axiosSecure = useAxiosSecure();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReviews = reviews.filter((review) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      review.full_name?.toLowerCase().includes(searchLower) ||
      review.email?.toLowerCase().includes(searchLower) ||
      review.comment?.toLowerCase().includes(searchLower) ||
      review.package_id?.toString().includes(searchLower)
    );
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  // Form State
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    comment: "",
    image_url: "",
    rating: 5,
    package_id: "",
  });

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get("/api/tourism/get-review-list");
      if (response.data && Array.isArray(response.data.list_data)) {
        setReviews(response.data.list_data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      showError("Data Error", "Failed to synchronize review manifest.");
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  const fetchPackages = useCallback(async () => {
    try {
      const response = await axiosSecure.get("/api/tourism/get-package-list");
      if (response.data && Array.isArray(response.data.list_data)) {
        setPackages(response.data.list_data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  }, [axiosSecure]);

  useEffect(() => {
    setTimeout(() => {
      fetchReviews();
      fetchPackages();
    }, 0);
  }, [fetchReviews, fetchPackages]);

  const handleOpenDrawer = (review: Review | null = null) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        full_name: review.full_name,
        email: review.email,
        comment: review.comment,
        image_url: review.image_url,
        rating: review.rating,
        package_id: review.package_id.toString(),
      });
    } else {
      setEditingReview(null);
      setFormData({
        full_name: "",
        email: "",
        comment: "",
        image_url: "",
        rating: 5,
        package_id: "",
      });
    }
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setEditingReview(null), 300);
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
        name === "rating" || name === "package_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    const action = editingReview ? "Update" : "Add";
    const result = await showConfirmation(
      `${action} Review?`,
      `This will ${action.toLowerCase()} the customer review in the system.`,
      action,
      "Cancel",
    );

    if (result.isConfirmed) {
      // Client-side validation check
      if (
        !formData.full_name ||
        !formData.email ||
        !formData.comment ||
        !formData.image_url ||
        !formData.rating ||
        !formData.package_id
      ) {
        showError("Validation Error", "Invalid or missing required fields");
        return;
      }

      showProcessing(`${action}ing Review...`);

      try {
        const payload = {
          _id: editingReview ? editingReview._id : null,
          full_name: formData.full_name || null,
          email: formData.email || null,
          comment: formData.comment || null,
          image_url: formData.image_url || null,
          rating: Number(formData.rating) || 0,
          package_id: Number(formData.package_id) || null,
        };

        await axiosSecure.post(
          "/api/tourism/insert-update-review-list",
          payload,
        );
        await fetchReviews();

        showSuccess(
          `Review ${action}ed`,
          `The review has been successfully ${action.toLowerCase()}ed.`,
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
      "Delete Review?",
      "This action will permanently remove this review.",
      "Delete",
      "Keep",
    );

    if (result.isConfirmed) {
      showProcessing("Deleting Review...");
      try {
        await axiosSecure.delete(`/api/tourism/delete-review-list/${id}`);
        await fetchReviews();
        showSuccess("Review Deleted", "The review has been removed.");
      } catch {
        showError("Deletion Failed", "Failed to remove review.");
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (loading) return <DashboardSkeleton></DashboardSkeleton>;

  return (
    <AdminRoute>
      <div className="p-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="relative w-full md:w-96 group">
          <input
            type="text"
            placeholder="Search reviews by name or package..."
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
          className="w-full md:w-auto btn btn-primary h-11 px-8 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20"
        >
          Add New Review
        </button>
      </div>

      {/* Information Row */}
      <div className="flex flex-wrap items-center gap-4 mb-10">
        <div className="px-6 py-3 bg-base-100 rounded-2xl border border-base-content/5 flex items-center gap-3 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
            Total Reviews:
          </span>
          <span className="text-sm font-black text-primary">{reviews.length}</span>
        </div>
        {searchQuery && (
          <div className="px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-3 shadow-sm animate-in fade-in zoom-in duration-300">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
              Filtered Records:
            </span>
            <span className="text-sm font-black text-primary">
              {filteredReviews.length}
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

      {/* Reviews Table */}
      <div className="bg-base-100 rounded-xl border border-base-content/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200/20 h-12 border-b border-base-content/5">
                <th className="pl-10 text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30">
                  SL
                </th>
                <th className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30">
                  Reviewer
                </th>
                <th className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30">
                  Feedback
                </th>
                <th className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30">
                  Rating
                </th>
                <th className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30">
                  Package
                </th>
                <th className="pr-10 text-right text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30">
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
                    No reviews found
                    <button
                      onClick={handleClearSearch}
                      className="ml-2 px-3 py-2 rounded-xl font-bold text-primary hover:text-secondary hover:bg-primary/10"
                    >
                      Clear Filter
                    </button>
                  </td>
                </tr>
              ) : (
                currentItems.map((review, index) => (
                  <tr
                    key={review._id}
                    className="hover:bg-base-200/40 transition-all group border-b border-base-content/5"
                  >
                    <td className="pl-10">
                      <span className="text-[10px] font-black text-base-content/20 tracking-widest">
                        {(indexOfFirstItem + index + 1)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-base-200 shrink-0">
                          {review.image_url ? (
                            <Image
                              src={review.image_url}
                              alt={review.full_name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary font-black text-xs bg-primary/10">
                              {review.full_name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-black text-base-content uppercase tracking-tighter">
                            {review.full_name}
                          </div>
                          <div className="text-[9px] font-bold text-base-content/30 lowercase mt-0.5">
                            {review.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="text-[11px] font-bold text-base-content/70 line-clamp-2 max-w-xs">
                        {review.comment}
                      </p>
                    </td>
                    <td>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-3 w-3 ${i < review.rating ? "text-warning fill-warning" : "text-base-content/10 fill-base-content/10"}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-accent uppercase tracking-tight">
                          {packages.find(
                            (p) => p.package_id === review.package_id,
                          )?.title || `ID: ${review.package_id}`}
                        </span>
                        <span className="text-[9px] font-bold text-base-content/30 uppercase tracking-widest mt-1">
                          Tour Package
                        </span>
                      </div>
                    </td>
                    <td className="pr-10 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button
                          onClick={() => handleOpenDrawer(review)}
                          className="w-8 h-8 rounded-lg bg-base-100 shadow-xl flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-white transition-all border border-base-content/5"
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
                          onClick={() => handleDelete(review._id)}
                          className="w-8 h-8 rounded-lg bg-base-100 shadow-xl flex items-center justify-center text-base-content/60 hover:bg-error hover:text-white transition-all border border-base-content/5"
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
      {filteredReviews.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={setCurrentPage}
        />
      )}

      {/* Review Drawer */}
      <div
        className={`fixed inset-0 z-[100] transition-visibility duration-300 ${isDrawerOpen ? "visible" : "invisible"}`}
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
              {editingReview ? "Update Review" : "Add Review"}
            </h2>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-base-content/20">
              Customer Feedback Management
            </p>
            <div className="h-px bg-base-content/5 mt-8"></div>
          </div>

          <div className="p-10 pt-4 flex-1 overflow-y-auto custom-scrollbar">
            <form
              id="review-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                    Reviewer Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 font-black text-xs uppercase tracking-widest focus:border-primary/40 focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 font-black text-xs focus:border-primary/40 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                    Tour Package *
                  </label>
                  <select
                    name="package_id"
                    required
                    value={formData.package_id}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 font-black text-xs appearance-none focus:border-primary/40 focus:outline-none transition-all"
                  >
                    <option value="">Select Package</option>
                    {packages.map((pkg) => (
                      <option key={pkg._id} value={pkg.package_id}>
                        {pkg.title} ({pkg.package_id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                    Rating (1-5) *
                  </label>
                  <select
                    name="rating"
                    required
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 font-black text-xs appearance-none focus:border-primary/40 focus:outline-none transition-all"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} Stars
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                  Image URL *
                </label>
                <input
                  type="text"
                  name="image_url"
                  required
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 font-black text-xs focus:border-primary/40 focus:outline-none transition-all"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                  Feedback Comment *
                </label>
                <textarea
                  name="comment"
                  required
                  value={formData.comment}
                  onChange={handleInputChange}
                  className="w-full h-32 p-5 rounded-xl bg-base-200/50 border border-base-content/5 font-bold text-[11px] text-base-content/70 focus:border-primary/40 focus:outline-none transition-all resize-none"
                ></textarea>
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
              form="review-form"
              className="flex-[2] btn btn-primary h-11 rounded-xl font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-primary/30"
            >
              {editingReview ? "Update" : "Add Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </AdminRoute>
  );
};

export default ManageReviewPage;
