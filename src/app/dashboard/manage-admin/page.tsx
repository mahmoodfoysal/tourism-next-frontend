"use client";

import React, { useState, useEffect, useCallback } from "react";
import SuperAdmin from "@/routes/SuperAdmin";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import {
  showError,
  showConfirmation,
  showProcessing,
  showSuccess,
} from "@/components/pages/Alert";
import DashboardSkeleton from "@/components/pages/DashboardSkeleton";

interface AdminUser {
  _id: string;
  email: string;
  role: string;
  role_id: number;
  createdAt?: string;
}

const ManageAdminPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const axiosSecure = useAxiosSecure();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    role: "",
    role_id: 0,
  });

  const accessList = [
    { role_id: 200, role: "Super Admin" },
    { role_id: 201, role: "Admin" },
    { role_id: 202, role: "Manager" },
  ];

  const fetchAdmins = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const response = await axiosSecure.get(
        `/api/admin/get-admin-list/${user.email}`,
      );
      if (response.data && Array.isArray(response.data.list_data)) {
        setAdmins(response.data.list_data);
      } else {
        const mockAdmins: AdminUser[] = [
          {
            _id: "1",
            email: "admin@auratrip.com",
            role: "Super Admin",
            role_id: 200,
          },
          {
            _id: "2",
            email: "sarah@auratrip.com",
            role: "Admin",
            role_id: 201,
          },
          {
            _id: "3",
            email: "mike@auratrip.com",
            role: "Manager",
            role_id: 202,
          },
        ];
        setAdmins(mockAdmins);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      const mockAdmins: AdminUser[] = [
        {
          _id: "1",
          email: "admin@auratrip.com",
          role: "Super Admin",
          role_id: 200,
        },
        { _id: "2", email: "sarah@auratrip.com", role: "Admin", role_id: 201 },
        { _id: "3", email: "mike@auratrip.com", role: "Manager", role_id: 202 },
      ];
      setAdmins(mockAdmins);
    } finally {
      setLoading(false);
    }
  }, [user, axiosSecure]);

  useEffect(() => {
    if (user?.email) {
      setTimeout(() => {
        fetchAdmins();
      }, 0);
    }
  }, [user?.email, fetchAdmins]);

  const handleOpenDrawer = (admin: AdminUser | null = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        email: admin.email,
        role: admin.role,
        role_id: admin.role_id,
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        email: "",
        role: "",
        role_id: 0,
      });
    }
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setEditingAdmin(null), 300); // Wait for transition
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "role") {
      const selectedRole = accessList.find((r) => r.role === value);
      setFormData((prev) => ({
        ...prev,
        role: value,
        role_id: selectedRole ? selectedRole.role_id : 201,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    const result = await showConfirmation(
      editingAdmin ? "Update Clearance?" : "Authorize Admin?",
      editingAdmin
        ? "This will synchronize new administrative privileges for this operative."
        : "This will grant new administrative access levels.",
      "Authorize",
      "Cancel",
    );

    if (result.isConfirmed) {
      showProcessing(editingAdmin ? "Updating Admin..." : "Creating Admin...");

      try {
        const payload = {
          ...formData,
          user_info: user.email,
          ...(editingAdmin?._id && { _id: editingAdmin._id }),
        };

        await axiosSecure.post("/api/admin/insert-update-admin", payload);

        await fetchAdmins();

        showSuccess(
          editingAdmin ? "Admin Updated" : "Admin Created",
          editingAdmin
            ? "The administrative privileges have been successfully synchronized."
            : "New administrative access has been authorized.",
        );

        handleCloseDrawer();
      } catch (error: any) {
        console.error("Error saving admin:", error);
        showError(
          "Operation Failed",
          error.response?.data?.message || "An unexpected error occurred.",
        );
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await showConfirmation(
      "Revoke Access?",
      "This action will permanently terminate all administrative privileges.",
      "Revoke",
      "Keep Access",
    );

    if (result.isConfirmed) {
      showProcessing("Revoking Access...");
      try {
        await axiosSecure.delete(`/api/admin/delete-admin-list/${id}`);
        await fetchAdmins();
        showSuccess(
          "Access Revoked",
          "The administrative status has been successfully terminated.",
        );
      } catch (error: any) {
        showError(
          "Revocation Failed",
          error.response?.data?.message || "Failed to terminate access.",
        );
      }
    }
  };

  if (loading) {
    return <DashboardSkeleton></DashboardSkeleton>;
  }

  return (
    <SuperAdmin>
      <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 relative overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-base-content tracking-tighter uppercase leading-none">
              Access <span className="text-primary italic">Control</span>
            </h1>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.4em] text-base-content/40">
              Manage administrative operatives and permissions
            </p>
          </div>
          <button
            onClick={() => handleOpenDrawer()}
            className="btn btn-primary h-10 px-8 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 cursor-pointer"
          >
            Authorize New Admin
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-base-100 rounded-2xl border border-base-content/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-md w-full">
              <thead>
                <tr className="border-b border-base-content/5 h-10">
                  <th className="pl-10 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                    Operative
                  </th>
                  <th className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                    Clearance Level
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
                {admins.map((admin) => (
                  <tr
                    key={admin._id}
                    className="hover:bg-base-200/30 transition-colors border-b border-base-content/5 group"
                  >
                    <td className="pl-10 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 uppercase">
                          {admin.email.charAt(0)}
                        </div>
                        <div>
                          <div className="font-black text-base-content uppercase tracking-tight">
                            {admin.email.split("@")[0]}
                          </div>
                          <div className="text-[10px] font-bold text-base-content/40 lowercase">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            admin.role_id === 200
                              ? "bg-error"
                              : admin.role_id === 201
                                ? "bg-primary"
                                : "bg-info"
                          }`}
                        ></div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-base-content/70">
                          {admin.role}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="px-3 py-1 bg-success/10 text-success text-[8px] font-black uppercase tracking-[0.2em] rounded-md border border-success/20">
                        Active
                      </span>
                    </td>
                    <td className="pr-10 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenDrawer(admin)}
                          className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-white transition-all shadow-sm"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(admin._id)}
                          className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-error hover:text-white transition-all shadow-sm"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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
                    {editingAdmin ? "Update Operative" : "Authorize Operative"}
                  </h2>
                </div>
              </div>
              <div className="h-px bg-base-content/5 mt-8"></div>
            </div>

            {/* Scrollable Body */}
            <div className="p-10 pt-8 flex-1 overflow-y-auto custom-scrollbar">
              <form
                id="admin-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Email Address <span className="text-error">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30"
                    placeholder="operative@auratrip.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-1">
                    Clearance Level <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full h-11 px-5 rounded-xl bg-base-200/50 border border-base-content/5 text-xs font-bold focus:outline-none focus:border-primary/30 appearance-none transition-all cursor-pointer pr-12"
                    >
                      <option value="" disabled>
                        Select Clearance Level
                      </option>
                      {accessList.map((role) => (
                        <option key={role.role_id} value={role.role}>
                          [{role.role_id}] {role.role} —{" "}
                          {role.role === "Super Admin"
                            ? "Full Authorization"
                            : role.role === "Admin"
                              ? "Standard Access"
                              : "Limited Management"}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-base-content/20">
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
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
                  form="admin-form"
                  className="flex-[2] btn btn-primary h-12 rounded-xl font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-primary/30 group"
                >
                  <span className="group-hover:scale-110 transition-transform">
                    {editingAdmin ? "Give Access" : "Update Access"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdmin>
  );
};

export default ManageAdminPage;
