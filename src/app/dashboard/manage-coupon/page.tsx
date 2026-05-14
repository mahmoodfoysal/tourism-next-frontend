"use client";

import React, { useState, useEffect } from "react";
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

interface Coupon {
  _id: string;
  coupon_code: string;
  email: string;
  flag: number;
  per_dis_amt: string;
  operator: string;
  createdAt?: string;
}

const ManageCouponPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const axiosSecure = useAxiosSecure();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCoupons = coupons.filter((coupon) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      coupon.coupon_code.toLowerCase().includes(searchLower) ||
      coupon.email.toLowerCase().includes(searchLower) ||
      coupon.operator.toLowerCase().includes(searchLower)
    );
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCoupons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);

  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 0);
  }, [searchQuery]);

  // Form State
  const [formData, setFormData] = useState({
    coupon_code: "",
    email: "",
    flag: 1, // 1 for Active, 0 for Inactive
    per_dis_amt: "",
    operator: "",
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get(
        "/api/tourism/admin/get-coupon-list",
      );
      if (response.data && Array.isArray(response.data.list_data)) {
        setCoupons(response.data.list_data);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      showError("Sync Error", "Failed to retrieve coupon inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchCoupons();
    }, 0);
  }, [axiosSecure]);

  const handleOpenDrawer = (coupon: Coupon | null = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        coupon_code: coupon.coupon_code,
        email: coupon.email,
        flag: coupon.flag,
        per_dis_amt: coupon.per_dis_amt,
        operator: coupon.operator,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        coupon_code: "",
        email: "", // Default or empty
        flag: 0,
        per_dis_amt: "",
        operator: "+", // Default math operator
      });
    }
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setEditingCoupon(null), 300);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "flag" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    const action = editingCoupon ? "Update" : "Issue";
    const result = await showConfirmation(
      `${action} Coupon?`,
      `This will ${action.toLowerCase()} the coupon code in the global system.`,
      action,
      "Cancel",
    );

    if (result.isConfirmed) {
      showProcessing(`${action}ing Coupon...`);

      try {
        const payload = {
          coupon_code: formData.coupon_code || null,
          email: formData.email || null,
          per_dis_amt: formData.per_dis_amt || null,
          operator: formData.operator || null,
          user_info: user.email || null,
          ...(editingCoupon?._id && { _id: editingCoupon._id }),
        };

        await axiosSecure.post(
          "/api/tourism/admin/insert-update-coupon-list",
          payload,
        );
        await fetchCoupons();

        showSuccess(
          `Coupon ${action}d`,
          `The coupon has been successfully ${action.toLowerCase()}d.`,
        );
        handleCloseDrawer();
      } catch (error: any) {
        showError(
          "Operation Failed",
          error.response?.data?.message || "An unexpected error occurred.",
        );
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await showConfirmation(
      "Revoke Coupon?",
      "This will permanently invalidate this coupon code.",
      "Revoke",
      "Keep",
    );

    if (result.isConfirmed) {
      showProcessing("Revoking...");
      try {
        await axiosSecure.delete(`/api/tourism/delete-coupon-list/${id}`);
        await fetchCoupons();
        showSuccess(
          "Coupon Revoked",
          "The code has been removed from the registry.",
        );
      } catch (error: any) {
        showError("Revocation Failed", "Failed to remove coupon.");
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
    <div className="p-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="relative w-full md:w-96 group">
          <input
            type="text"
            placeholder="Search coupons by code or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-14 pr-6 rounded-xl bg-base-100 border border-base-content/5 text-xs font-black focus:outline-none focus:border-primary/30 transition-all shadow-sm"
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-base-content/20 group-focus-within:text-primary transition-colors">
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
          className="w-full md:w-auto btn btn-primary h-11 px-10 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/20"
        >
          Issue New Coupon
        </button>
      </div>

      {/* Coupon Registry Table */}
      <div className="bg-base-100 rounded-xl border border-base-content/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200/20 h-12 border-b border-base-content/5">
                <th className="pl-10 text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30">
                  Registry SL
                </th>
                <th className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30">
                  Coupon Artifact
                </th>
                <th className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30">
                  Target Audience
                </th>
                <th className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30">
                  Value
                </th>
                <th className="pr-10 text-right text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30">
                  Registry Control
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
                    No coupons found
                    <button
                      onClick={handleClearSearch}
                      className="ml-2 px-3 py-2 rounded-xl font-bold text-primary hover:text-secondary hover:bg-primary/10"
                    >
                      Clear Filter
                    </button>
                  </td>
                </tr>
              ) : (
                currentItems.map((coupon, index) => (
                  <tr
                    key={coupon._id}
                    className="hover:bg-base-200/40 transition-all group border-b border-base-content/5"
                  >
                    <td className="pl-10">
                      <span className="text-[10px] font-black text-base-content/20 tracking-widest">
                        {(indexOfFirstItem + index + 1)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-base-content uppercase tracking-tighter group-hover:text-primary transition-colors">
                          {coupon.coupon_code}
                        </span>
                        <span className="text-[9px] font-bold text-base-content/30 uppercase tracking-[0.2em] mt-1">
                          Registry Code
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-base-content/70 uppercase tracking-tight">
                          {coupon.email}
                        </span>
                        <span className="text-[9px] font-bold text-base-content/30 uppercase tracking-widest mt-1">
                          Authorised Entity
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-accent uppercase tracking-tighter">
                          {coupon.per_dis_amt}
                        </span>
                        <span className="text-[9px] font-bold text-base-content/30 uppercase tracking-widest mt-1">
                          Benefit Value
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-primary uppercase tracking-tighter">
                          {coupon.operator}
                        </span>
                        <span className="text-[9px] font-bold text-base-content/30 uppercase tracking-widest mt-1">
                          Calc Operator
                        </span>
                      </div>
                    </td>
                    <td className="pr-10 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button
                          onClick={() => handleOpenDrawer(coupon)}
                          className="w-10 h-10 rounded-full bg-base-100 shadow-xl flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-white transition-all border border-base-content/5"
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
                          onClick={() => handleDelete(coupon._id)}
                          className="w-10 h-10 rounded-full bg-base-100 shadow-xl flex items-center justify-center text-base-content/60 hover:bg-error hover:text-white transition-all border border-base-content/5"
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
      {filteredCoupons.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={setCurrentPage}
        />
      )}

      {/* Coupon Drawer */}
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
            <h2 className="text-4xl font-black uppercase tracking-tighter  leading-none">
              {editingCoupon ? "Update Coupon" : "Add New Coupon"}
            </h2>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-base-content/20">
              System-Wide Value Distribution
            </p>
            <div className="h-px bg-base-content/5 mt-8"></div>
          </div>

          <div className="p-10 pt-4 flex-1 overflow-y-auto custom-scrollbar space-y-10">
            <form
              id="coupon-form"
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                  Unique Coupon Code *
                </label>
                <input
                  type="text"
                  name="coupon_code"
                  required
                  value={formData.coupon_code}
                  onChange={handleInputChange}
                  className="w-full h-11 px-6 rounded-xl bg-base-200/50 border border-base-content/5 font-black text-sm uppercase tracking-widest focus:border-primary/40 focus:outline-none transition-all"
                  placeholder="E.G. TRAVEL20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                  Value Proposition *
                </label>
                <input
                  type="text"
                  name="per_dis_amt"
                  required
                  value={formData.per_dis_amt}
                  onChange={handleInputChange}
                  className="w-full h-11 px-6 rounded-xl bg-base-200/50 border border-base-content/5 font-black text-sm uppercase tracking-widest focus:border-primary/40 focus:outline-none transition-all"
                  placeholder="E.G. 20% OR $50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                  Target Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-11 px-6 rounded-xl bg-base-200/50 border border-base-content/5 font-black text-sm lowercase focus:border-primary/40 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                  Discount Operator (+ - / *) *
                </label>
                <select
                  name="operator"
                  required
                  value={formData.operator}
                  onChange={handleInputChange}
                  className="w-full h-11 px-6 rounded-xl bg-base-200/50 border border-base-content/5 font-black text-sm appearance-none focus:border-primary/40 focus:outline-none transition-all"
                >
                  <option value="-">MINUS (-)</option>
                  <option value="/">DIVIDE (/)</option>
                  <option value="*">MULTIPLY (*)</option>
                </select>
              </div>

              <div className="p-6 rounded-2xl bg-accent/5 border border-accent/10 space-y-2">
                <div className="text-[10px] font-black text-accent uppercase tracking-widest">
                  Operational Metadata
                </div>
                <div className="text-[11px] font-bold text-base-content/50 uppercase">
                  Issued By: {user?.email}
                </div>
                <div className="text-[11px] font-bold text-base-content/50 uppercase">
                  Timestamp: {new Date().toLocaleString()}
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
              form="coupon-form"
              className="flex-[2] btn btn-primary h-11 rounded-xl font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-primary/30"
            >
              {editingCoupon ? "Update" : "Issue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCouponPage;
