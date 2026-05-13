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

interface TourPackage {
  _id: string;
  package_id: number;
  title: string;
  duration: string;
  location: string;
  image: string;
  moreImage: string[];
  price: number;
  originalPrice: number;
  features: string[];
  discount: number;
  status: number;
  category?: string;
  tour_date?: string;
  details?: {
    description: string;
    itinerary: string[];
  };
  user_info?: string;
  createdAt?: string;
}

const AddPackagePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const axiosSecure = useAxiosSecure();
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(
    null,
  );
  const [viewingPackage, setViewingPackage] = useState<TourPackage | null>(
    null,
  );

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPackages = packages.filter((pkg) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      pkg.title.toLowerCase().includes(searchLower) ||
      pkg.location.toLowerCase().includes(searchLower) ||
      pkg.package_id.toString().includes(searchLower)
    );
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPackages.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

  // Reset to first page when searching
  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 0);
  }, [searchQuery]);

  // Form State
  const [formData, setFormData] = useState({
    package_id: "",
    title: "",
    duration: "",
    location: "",
    image: "",
    moreImage: [] as string[],
    price: "",
    originalPrice: "",
    features: [] as string[],
    discount: "",
    status: 1,
    category: "",
    tour_date: "",
    description: "",
    itinerary: [] as string[],
  });

  const statusList = [
    { value: 1, label: "Active" },
    { value: 0, label: "Inactive" },
  ];

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get("/api/tourism/get-package-list");
      if (response.data && Array.isArray(response.data.list_data)) {
        setPackages(response.data.list_data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      showError("Data Error", "Failed to synchronize package manifest.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchPackages();
    }, 0);
  }, [axiosSecure]);

  const handleOpenDrawer = (pkg: TourPackage | null = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        package_id: pkg.package_id.toString(),
        title: pkg.title,
        duration: pkg.duration,
        location: pkg.location,
        image: pkg.image,
        moreImage: pkg.moreImage || [],
        price: pkg.price.toString(),
        originalPrice: pkg.originalPrice.toString(),
        features: pkg.features || [],
        discount: pkg.discount.toString(),
        status: pkg.status,
        category: pkg.category || "",
        tour_date: pkg.tour_date || "",
        description: pkg.details?.description || "",
        itinerary: pkg.details?.itinerary || [],
      });
    } else {
      setEditingPackage(null);
      setFormData({
        package_id: "",
        title: "",
        duration: "",
        location: "",
        image: "",
        moreImage: [],
        price: "",
        originalPrice: "",
        features: [],
        discount: "",
        status: 1,
        category: "",
        tour_date: "",
        description: "",
        itinerary: [],
      });
    }
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setEditingPackage(null), 300);
  };

  const handleOpenDetails = (pkg: TourPackage) => {
    setViewingPackage(pkg);
    setIsDetailsDrawerOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsDrawerOpen(false);
    setTimeout(() => setViewingPackage(null), 300);
  };

  const handleArrayInputChange = (
    field: "features" | "moreImage" | "itinerary",
    index: number,
    value: string,
  ) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const handleAddArrayField = (
    field: "features" | "moreImage" | "itinerary",
  ) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleRemoveArrayField = (
    field: "features" | "moreImage" | "itinerary",
    index: number,
  ) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
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
        name === "status" ||
        name === "price" ||
        name === "originalPrice" ||
        name === "discount" ||
        name === "package_id"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    const action = editingPackage ? "Update" : "Create";
    const result = await showConfirmation(
      `${action} Package?`,
      `This will ${action.toLowerCase()} the tour package in the global inventory.`,
      action,
      "Cancel",
    );

    if (result.isConfirmed) {
      showProcessing(`${action}ing Package...`);

      try {
        const payload = {
          package_id: Number(formData.package_id),
          title: formData.title,
          duration: formData.duration,
          location: formData.location,
          image: formData.image,
          moreImage: formData.moreImage.filter(Boolean),
          price: Number(formData.price),
          originalPrice: Number(formData.originalPrice),
          features: formData.features.filter(Boolean),
          discount: Number(formData.discount),
          status: Number(formData.status),
          user_info: user.email,
          category: formData.category,
          tour_date: formData.tour_date,
          details: {
            description: formData.description,
            itinerary: formData.itinerary.filter(Boolean),
          },
          ...(editingPackage?._id && { _id: editingPackage._id }),
        };

        await axiosSecure.post(
          "/api/admin/insert-update-package-dest-list",
          payload,
        );
        await fetchPackages();

        showSuccess(
          `Package ${action}d`,
          `The tour package has been successfully ${action.toLowerCase()}d.`,
        );

        handleCloseDrawer();
      } catch (error: any) {
        console.error("Error saving package:", error);
        showError(
          "Operation Failed",
          error.response?.data?.message || "An unexpected error occurred.",
        );
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await showConfirmation(
      "Delete Package?",
      "This action will permanently remove this package from the inventory.",
      "Delete",
      "Keep",
    );

    if (result.isConfirmed) {
      showProcessing("Deleting Package...");
      try {
        await axiosSecure.delete(`/api/admin/delete-package-list/${id}`);
        await fetchPackages();
        showSuccess(
          "Package Deleted",
          "The package has been removed from the manifest.",
        );
      } catch (error: any) {
        showError(
          "Deletion Failed",
          error.response?.data?.message || "Failed to remove package.",
        );
      }
    }
  };

  const handleStatusChange = async (id: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const result = await showConfirmation(
      "Change Status?",
      `This will set the package to ${newStatus === 1 ? "Active" : "Inactive"}.`,
      "Update",
      "Cancel",
    );

    if (result.isConfirmed) {
      showProcessing("Updating Status...");
      try {
        await axiosSecure.patch(`/api/admin/update-package-status/${id}`, {
          status: newStatus,
        });
        await fetchPackages();
        showSuccess(
          "Status Updated",
          "The package availability has been synchronized.",
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
    return (
      <div className="flex flex-col gap-6">
        <div className="h-20 bg-base-200/50 rounded-2xl animate-pulse"></div>
        <div className="h-96 bg-base-200/50 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 relative">
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="relative w-full md:w-96 group">
          <input
            type="text"
            placeholder="Search manifest by title, location or ID..."
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
          Add New Package
        </button>
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
                  Package
                </th>
                <th className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                  Details
                </th>
                <th className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                  Price
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
              {currentItems.map((pkg, index) => (
                <tr
                  key={index}
                  className="hover:bg-base-200/30 transition-colors border-b border-base-content/5 group"
                >
                  <td className="pl-10 text-[10px] font-black text-base-content/20 uppercase tracking-widest">
                    {(indexOfFirstItem + index + 1).toString().padStart(2, "0")}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-base-200 border border-base-content/5 shrink-0">
                        {pkg.image ? (
                          <Image
                            src={pkg.image}
                            alt={pkg.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-black text-[10px]">
                            {pkg.title.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-black text-base-content uppercase tracking-tight line-clamp-1">
                          {pkg.title}
                        </div>
                        <div className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">
                          {pkg.package_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black uppercase tracking-widest text-base-content/70">
                        {pkg.location}
                      </span>
                      <span className="text-[9px] font-bold text-base-content/40 uppercase tracking-widest">
                        {pkg.duration}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-primary">
                        ${pkg.price}
                      </span>
                      {pkg.discount > 0 && (
                        <span className="text-[9px] font-bold text-error uppercase tracking-widest">
                          -{pkg.discount}% OFF
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] rounded-md border ${
                        pkg.status === 1
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-error/10 text-error border-error/20"
                      }`}
                    >
                      {pkg.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="pr-10 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenDrawer(pkg)}
                        className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-white transition-all shadow-sm"
                        title="Edit Package"
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
                        onClick={() => handleDelete(pkg._id)}
                        className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-error hover:text-white transition-all shadow-sm"
                        title="Delete Package"
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
                        onClick={() => handleStatusChange(pkg._id, pkg.status)}
                        className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-info hover:text-white transition-all shadow-sm"
                        title="Change Status"
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
                        onClick={() => handleOpenDetails(pkg)}
                        className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-accent hover:text-white transition-all shadow-sm"
                        title="Detailed Manifest"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Section */}
      {filteredPackages.length > itemsPerPage && (
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

          {/* Exterior Close Button */}
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

          {/* Fixed Header */}
          <div className="p-8 pb-0 shrink-0">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-base-content tracking-tighter uppercase leading-none">
                  {editingPackage ? "Edit Package" : "Add Package"}
                </h2>
              </div>
            </div>
            <div className="h-px bg-base-content/5 mt-8"></div>
          </div>

          {/* Scrollable Body */}
          <div className="p-10 pt-8 flex-1 overflow-y-auto custom-scrollbar">
            <form
              id="package-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Package ID <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    name="package_id"
                    required
                    value={formData.package_id}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                    placeholder="101"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Status <span className="text-error">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30 appearance-none"
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
                  Package Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                  placeholder="Alpine Expedition: Swiss Peaks"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Location <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                    placeholder="Switzerland"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Duration <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="duration"
                    required
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                    placeholder="5 Days / 4 Nights"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Price ($) <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Original ($)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                    placeholder="Beach & Luxury"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Tour Date
                  </label>
                  <input
                    type="date"
                    name="tour_date"
                    value={formData.tour_date}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                  Primary Image URL <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="image"
                  required
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                  Package Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full h-24 p-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30 resize-none"
                  placeholder="Experience the ultimate tropical escape..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                  Tour Itinerary (Comma separated days)
                </label>
                <textarea
                  name="itinerary"
                  value={formData.itinerary}
                  onChange={handleInputChange}
                  className="w-full h-24 p-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30 resize-none"
                  placeholder="Day 1: Arrival, Day 2: Snorkeling..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                  Gallery Images
                </label>
                <div className="space-y-2">
                  {formData.moreImage.map((img, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={img}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "moreImage",
                            idx,
                            e.target.value,
                          )
                        }
                        className="flex-1 h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                        placeholder="https://image-url.com"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayField("moreImage", idx)}
                        className="w-11 h-11 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all flex items-center justify-center shrink-0"
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
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddArrayField("moreImage")}
                    className="w-full h-11 rounded-xl border-2 border-dashed border-base-content/10 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40 hover:border-primary/40 hover:text-primary transition-all"
                  >
                    + Add Gallery Image
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                  Package Features
                </label>
                <div className="space-y-2">
                  {formData.features.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "features",
                            idx,
                            e.target.value,
                          )
                        }
                        className="flex-1 h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                        placeholder="Free Wi-Fi"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayField("features", idx)}
                        className="w-11 h-11 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all flex items-center justify-center shrink-0"
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
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddArrayField("features")}
                    className="w-full h-11 rounded-xl border-2 border-dashed border-base-content/10 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40 hover:border-primary/40 hover:text-primary transition-all"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                  Tour Itinerary
                </label>
                <div className="space-y-2">
                  {formData?.itinerary?.map((step, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={step}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "itinerary",
                            idx,
                            e.target.value,
                          )
                        }
                        className="flex-1 h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                        placeholder={`Day ${idx + 1}: Activity`}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayField("itinerary", idx)}
                        className="w-11 h-11 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all flex items-center justify-center shrink-0"
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
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddArrayField("itinerary")}
                    className="w-full h-11 rounded-xl border-2 border-dashed border-base-content/10 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40 hover:border-primary/40 hover:text-primary transition-all"
                  >
                    + Add Itinerary Step
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Fixed Footer with Actions */}
          <div className="p-10 border-t border-base-content/5 bg-base-100 shrink-0 space-y-6 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="flex-1 btn btn-ghost h-12 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] border border-base-content/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="package-form"
                className="flex-[2] btn btn-primary h-12 rounded-xl font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-primary/30"
              >
                {editingPackage ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <DetailsDrawer
        isOpen={isDetailsDrawerOpen}
        onClose={handleCloseDetails}
        pkg={viewingPackage}
      />
    </div>
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
    <div className="w-full min-h-11 px-5 py-3 rounded-xl bg-base-200/30 border border-base-content/5 text-[11px] font-bold text-base-content/70">
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

// New Details Drawer Implementation
const DetailsDrawer = ({
  isOpen,
  onClose,
  pkg,
}: {
  isOpen: boolean;
  onClose: () => void;
  pkg: TourPackage | null;
}) => {
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (pkg?.image) {
      setTimeout(() => {
        setActiveImage(pkg.image);
      }, 0);
    }
  }, [pkg]);

  if (!pkg) return null;

  const gallery = [pkg.image, ...(pkg.moreImage || [])].filter(Boolean);

  return (
    <div
      className={`fixed inset-0 z-[110] transition-visibility duration-300 ${isOpen ? "visible" : "invisible"}`}
    >
      <div
        className={`absolute inset-0 bg-base-300/40 backdrop-blur-md transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
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
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black text-base-content tracking-tighter uppercase leading-none">
                Detailed
                <br />
                <span className="text-accent italic">Manifest</span>
              </h2>
              <p className="mt-2 text-[9px] font-black uppercase tracking-[0.2em] text-base-content/30">
                Complete Object Verification
              </p>
            </div>
          </div>
          <div className="h-px bg-base-content/5 mt-8"></div>
        </div>

        {/* Body */}
        <div className="p-10 pt-8 flex-1 overflow-y-auto custom-scrollbar space-y-8">
          {/* Hero Identity */}
          <div className="space-y-4">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-base-200 border border-base-content/5 shadow-inner group">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={pkg.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-base-content/10 uppercase tracking-[0.4em]">
                  No Image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 rounded-md bg-accent text-white text-[9px] font-black uppercase tracking-[0.2em]">
                  {pkg.location}
                </span>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mt-2">
                  {pkg.title}
                </h3>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 aspect-video rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImage === img
                        ? "border-accent shadow-lg scale-95"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
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

          <div className="grid grid-cols-2 gap-6">
            <DetailItem
              label="Internal Database ID"
              value={pkg._id}
              fullWidth
            />
            <DetailItem label="Package ID" value={pkg.package_id} />
            <DetailItem
              label="Status"
              value={pkg.status === 1 ? "ACTIVE" : "INACTIVE"}
            />
            <DetailItem label="Location" value={pkg.location} />
            <DetailItem label="Category" value={pkg.category || "N/A"} />
            <DetailItem label="Duration" value={pkg.duration} />
            <DetailItem label="Tour Date" value={pkg.tour_date || "N/A"} />
            <DetailItem label="Current Price" value={`$${pkg.price}`} />
            <DetailItem label="Discount" value={`${pkg.discount}%`} />
            <DetailItem
              label="Original Price"
              value={`$${pkg.originalPrice}`}
            />
            <DetailItem
              label="Creator / Admin"
              value={pkg.user_info || "System"}
            />
            <DetailItem
              label="Registration Date"
              value={
                pkg.createdAt
                  ? new Date(pkg.createdAt).toLocaleDateString()
                  : "N/A"
              }
            />
            <DetailItem label="Core Features" value={pkg.features} fullWidth />
            <DetailItem
              label="Package Description"
              value={pkg.details?.description || "N/A"}
              fullWidth
            />
            <DetailItem
              label="Tour Itinerary"
              value={pkg.details?.itinerary || []}
              fullWidth
            />
            <DetailItem
              label="Gallery References"
              value={pkg.moreImage}
              fullWidth
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-10 border-t border-base-content/5 bg-base-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full btn btn-ghost h-12 rounded-xl font-black uppercase tracking-[0.4em] text-xs border border-base-content/10"
          >
            Close Manifest
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPackagePage;
