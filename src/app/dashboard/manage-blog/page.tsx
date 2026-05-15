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

interface Blog {
  _id: string;
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  authorImage: string;
  category: string;
  status: number;
  readingTime: string;
  tags: string[];
  content: string;
  user_info?: string;
  createdAt?: string;
}

const AddBlogPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const axiosSecure = useAxiosSecure();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [viewingBlog, setViewingBlog] = useState<Blog | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = blogs.filter((blog) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      blog.title.toLowerCase().includes(searchLower) ||
      blog.category.toLowerCase().includes(searchLower) ||
      blog.author.toLowerCase().includes(searchLower) ||
      blog.id.toString().includes(searchLower)
    );
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  // Reset to first page when searching
  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 0);
  }, [searchQuery]);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    excerpt: "",
    image: "",
    date: "",
    author: "",
    authorImage: "",
    category: "",
    status: 1,
    readingTime: "",
    tags: [] as string[],
    content: "",
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get("/api/tourism/get-blog-list");
      if (response.data && Array.isArray(response.data.list_data)) {
        setBlogs(response.data.list_data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      showError("Data Error", "Failed to synchronize blog manifest.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchBlogs();
    }, 0);
  }, [axiosSecure]);

  const handleOpenDrawer = (blog: Blog | null = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        id: blog.id.toString(),
        title: blog.title,
        excerpt: blog.excerpt,
        image: blog.image,
        date: blog.date,
        author: blog.author,
        authorImage: blog.authorImage,
        category: blog.category,
        status: blog.status,
        readingTime: blog.readingTime,
        tags: blog.tags || [],
        content: blog.content,
      });
    } else {
      setEditingBlog(null);
      setFormData({
        id: "",
        title: "",
        excerpt: "",
        image: "",
        date: new Date().toISOString().split("T")[0],
        author: user?.displayName || "",
        authorImage: user?.photoURL || "",
        category: "",
        status: 1,
        readingTime: "",
        tags: [],
        content: "",
      });
    }
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setEditingBlog(null), 300);
  };

  const handleOpenDetails = (blog: Blog) => {
    setViewingBlog(blog);
    setIsDetailsDrawerOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsDrawerOpen(false);
    setTimeout(() => setViewingBlog(null), 300);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Tag Handlers
  const handleTagChange = (index: number, value: string) => {
    const updatedTags = [...formData.tags];
    updatedTags[index] = value;
    setFormData((prev) => ({ ...prev, tags: updatedTags }));
  };

  const addTag = () => {
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
  };

  const removeTag = (index: number) => {
    const updatedTags = formData.tags.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, tags: updatedTags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    const action = editingBlog ? "Update" : "Create";
    const result = await showConfirmation(
      `${action} Blog Post?`,
      `This will ${action.toLowerCase()} the blog entry in the global archive.`,
      action,
      "Cancel",
    );

    if (result.isConfirmed) {
      showProcessing(`${action}ing Blog...`);

      try {
        const payload = {
          id: formData.id ? Number(formData.id) : null,
          title: formData.title || null,
          excerpt: formData.excerpt || null,
          image: formData.image || null,
          date: formData.date || null,
          author: formData.author || null,
          authorImage: formData.authorImage || null,
          category: formData.category || null,
          status:
            typeof formData.status === "number"
              ? formData.status
              : Number(formData.status),
          readingTime: formData.readingTime || null,
          tags: Array.isArray(formData.tags)
            ? formData.tags.filter(Boolean)
            : [],
          content: formData.content || null,
          user_info: user.email || null,
          ...(editingBlog?._id && { _id: editingBlog._id }),
        };

        await axiosSecure.post("/api/tourism/insert-update-blog-list", payload);
        await fetchBlogs();

        showSuccess(
          `Blog ${action}d`,
          `The post has been successfully ${action.toLowerCase()}d.`,
        );
        handleCloseDrawer();
      } catch (error: any) {
        console.error("Error saving blog:", error);
        showError(
          "Operation Failed",
          error.response?.data?.message || "An unexpected error occurred.",
        );
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await showConfirmation(
      "Delete Blog Post?",
      "This action will permanently remove this post from the archive.",
      "Delete",
      "Keep",
    );

    if (result.isConfirmed) {
      showProcessing("Deleting Blog...");
      try {
        await axiosSecure.delete(`/api/tourism/delete-blog-list/${id}`);
        await fetchBlogs();
        showSuccess(
          "Blog Deleted",
          "The post has been removed from the archive.",
        );
      } catch (error: any) {
        showError(
          "Deletion Failed",
          error.response?.data?.message || "Failed to remove blog.",
        );
      }
    }
  };

  const handleStatusChange = async (id: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const result = await showConfirmation(
      "Change Visibility?",
      `This will set the post to ${newStatus === 1 ? "Published" : "Draft"}.`,
      "Update",
      "Cancel",
    );

    if (result.isConfirmed) {
      showProcessing("Updating Visibility...");
      try {
        await axiosSecure.patch(`/api/admin/update-blog-status/${id}`, {
          status: newStatus,
        });
        await fetchBlogs();
        showSuccess(
          "Visibility Updated",
          "The blog status has been synchronized.",
        );
      } catch (error: any) {
        showError("Update Failed", "Failed to update blog status.");
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
            placeholder="Search by title, category or author..."
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
          Create New Article
        </button>
      </div>

      {/* Information Row */}
      <div className="flex flex-wrap items-center gap-4 mb-10">
        <div className="px-6 py-3 bg-base-100 rounded-2xl border border-base-content/5 flex items-center gap-3 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
            Total Articles:
          </span>
          <span className="text-sm font-black text-primary">
            {blogs.length}
          </span>
        </div>
        <div className="px-6 py-3 bg-base-100 rounded-2xl border border-base-content/5 flex items-center gap-3 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
            Published Items:
          </span>
          <span className="text-sm font-black text-success">
            {blogs.filter((b) => b.status === 1).length}
          </span>
        </div>
        {searchQuery && (
          <div className="px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-3 shadow-sm animate-in fade-in zoom-in duration-300">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
              Filtered Records:
            </span>
            <span className="text-sm font-black text-primary">
              {filteredBlogs.length}
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

      {/* Grid Archive */}
      <div className="bg-base-100 rounded-3xl border border-base-content/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-md w-full">
            <thead>
              <tr className="border-b border-base-content/5 h-16 bg-base-200/20">
                <th className="pl-10 text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30">
                  SL
                </th>
                <th className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30">
                  Article Identity
                </th>
                <th className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30">
                  Manifest
                </th>
                <th className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30">
                  Status
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
                    No blogs found
                    <button
                      onClick={handleClearSearch}
                      className="ml-2 px-3 py-2 rounded-xl font-bold text-primary hover:text-secondary hover:bg-primary/10"
                    >
                      Clear Filter
                    </button>
                  </td>
                </tr>
              ) : (
                currentItems.map((blog, index) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-base-200/40 transition-all border-b border-base-content/5 group"
                  >
                    <td className="pl-10">
                      <span className="text-[10px] font-black text-base-content/20 tracking-widest">
                        {(indexOfFirstItem + index + 1)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                    </td>
                    <td className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-base-200 border border-base-content/5 shrink-0 shadow-sm">
                          {blog.image && (
                            <Image
                              src={blog.image}
                              alt={blog.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-110 duration-500"
                              unoptimized
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-black text-sm text-base-content uppercase tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                            {blog.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">
                              {blog.category}
                            </span>
                            <span className="text-[9px] font-bold text-base-content/30 uppercase tracking-widest">
                              ID: {blog.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <div className="relative w-5 h-5 rounded-full overflow-hidden border border-base-content/10">
                            <Image
                              src={
                                blog.authorImage || "https://i.pravatar.cc/150"
                              }
                              alt={blog.author}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-tight text-base-content/70">
                            {blog.author}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-base-content/30 uppercase tracking-widest mt-1">
                          {new Date(blog.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          • {blog.readingTime}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] rounded-lg border ${
                          blog.status === 1
                            ? "bg-success/10 text-success border-success/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                            : "bg-warning/10 text-warning border-warning/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]"
                        }`}
                      >
                        {blog.status === 1 ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="pr-10 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button
                          onClick={() => handleOpenDrawer(blog)}
                          className="w-9 h-9 rounded-xl bg-base-100 shadow-xl flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-white transition-all border border-base-content/5"
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
                          onClick={() => handleDelete(blog._id)}
                          className="w-9 h-9 rounded-xl bg-base-100 shadow-xl flex items-center justify-center text-base-content/60 hover:bg-error hover:text-white transition-all border border-base-content/5"
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
                        <button
                          onClick={() =>
                            handleStatusChange(blog._id, blog.status)
                          }
                          className="w-9 h-9 rounded-xl bg-base-100 shadow-xl flex items-center justify-center text-base-content/60 hover:bg-info hover:text-white transition-all border border-base-content/5"
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
                          onClick={() => handleOpenDetails(blog)}
                          className="w-9 h-9 rounded-xl bg-base-100 shadow-xl flex items-center justify-center text-base-content/60 hover:bg-accent hover:text-white transition-all border border-base-content/5"
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
      {filteredBlogs.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={setCurrentPage}
        />
      )}

      {/* Blog Drawer */}
      <div
        className={`fixed inset-0 z-[100] transition-visibility duration-300 ${isDrawerOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-base-300/40 backdrop-blur-md transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={handleCloseDrawer}
        ></div>
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-3xl bg-base-100 shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
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
              {editingBlog ? "Edit Article" : "Compose Post"}
            </h2>
            <div className="h-px bg-base-content/5 mt-8"></div>
          </div>

          <div className="p-10 pt-4 flex-1 overflow-y-auto custom-scrollbar space-y-10">
            <form id="blog-form" onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                    Article ID *
                  </label>
                  <input
                    type="number"
                    name="id"
                    required
                    value={formData.id}
                    onChange={handleInputChange}
                    className="w-full h-14 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-black text-xs"
                    placeholder="e.g. 1001"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full h-14 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-black text-xs appearance-none"
                  >
                    <option value={1}>Published</option>
                    <option value={0}>Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full h-14 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-black text-xs"
                  placeholder="The Ultimate Guide to Alpine Trekking"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-14 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-black text-xs"
                    placeholder="Travel, Luxury, etc."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    name="readingTime"
                    value={formData.readingTime}
                    onChange={handleInputChange}
                    className="w-full h-14 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-black text-xs"
                    placeholder="8 min read"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full h-14 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-black text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full h-14 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-black text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                  Hero Image URL *
                </label>
                <input
                  type="text"
                  name="image"
                  required
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full h-14 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-black text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                  Author Avatar URL
                </label>
                <input
                  type="text"
                  name="authorImage"
                  value={formData.authorImage}
                  onChange={handleInputChange}
                  className="w-full h-14 px-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-black text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                  Article Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="w-full h-28 p-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-bold text-xs resize-none"
                  placeholder="A brief summary for the preview card..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                  Article Content (Markdown/HTML supported)
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full h-64 p-6 rounded-2xl bg-base-200/50 border border-base-content/5 font-bold text-xs resize-none"
                  placeholder="Write your masterpiece here..."
                />
              </div>

              {/* Tags Management */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 ml-1">
                    Search Tags
                  </label>
                  <button
                    type="button"
                    onClick={addTag}
                    className="text-[10px] font-black text-primary uppercase"
                  >
                    + Add Tag
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {formData.tags.map((tag, idx) => (
                    <div key={idx} className="flex gap-2 group">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleTagChange(idx, e.target.value)}
                        className="flex-1 h-12 px-5 rounded-2xl bg-base-200/50 border border-base-content/5 font-black text-[11px] focus:border-primary/40 focus:outline-none transition-all"
                        placeholder="e.g. Adventure"
                      />
                      <button
                        type="button"
                        onClick={() => removeTag(idx)}
                        className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center shrink-0 hover:bg-error hover:text-white transition-all shadow-sm"
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
            </form>
          </div>

          <div className="p-10 border-t border-base-content/5 bg-base-100 flex gap-4">
            <button
              onClick={handleCloseDrawer}
              className="flex-1 btn btn-ghost h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-base-content/10"
            >
              Discard
            </button>
            <button
              type="submit"
              form="blog-form"
              className="flex-[2] btn btn-primary h-14 rounded-2xl font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-primary/30"
            >
              {editingBlog ? "Update" : "Publish Now"}
            </button>
          </div>
        </div>
      </div>

      <BlogDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        onClose={handleCloseDetails}
        blog={viewingBlog}
      />
    </div>
  );
};

const BlogDetailsDrawer = ({
  isOpen,
  onClose,
  blog,
}: {
  isOpen: boolean;
  onClose: () => void;
  blog: Blog | null;
}) => {
  if (!blog) return null;
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

        <div className="p-12 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest">
              {blog.category}
            </span>
            <span className="text-[9px] font-black text-base-content/30 uppercase tracking-[0.3em]">
              {blog.readingTime} • Published on{" "}
              {new Date(blog.date).toLocaleDateString()}
            </span>
          </div>
          <h2 className="text-5xl font-black uppercase tracking-tight leading-[0.9] text-base-content">
            {blog.title}
          </h2>
          <div className="h-px bg-base-content/5 mt-10"></div>
        </div>

        <div className="px-12 py-6 flex-1 overflow-y-auto custom-scrollbar space-y-12">
          {/* Article Identity */}
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-base-content/5 shadow-inner bg-base-200">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="grid grid-cols-3 gap-12">
            <div className="col-span-2 space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/20">
                  Executive Summary
                </label>
                <p className="text-base font-bold text-base-content/80 leading-relaxed  border-l-4 border-accent pl-6">
                  {blog.excerpt}
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/20">
                  Full Content Manifest
                </label>
                <div className="prose prose-sm max-w-none text-base-content/70 font-medium leading-loose whitespace-pre-wrap">
                  {blog.content}
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="p-8 rounded-3xl bg-base-200/50 border border-base-content/5 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-accent/20">
                    <Image
                      src={blog.authorImage || "https://i.pravatar.cc/150"}
                      alt={blog.author}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-base-content/30">
                      Curated By
                    </div>
                    <div className="text-sm font-black text-base-content uppercase">
                      {blog.author}
                    </div>
                  </div>
                </div>
                <div className="h-px bg-base-content/5"></div>
                <div className="space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-base-content/30 ">
                    Article Tags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-base-100 border border-base-content/5 text-[9px] font-black uppercase tracking-widest text-base-content/50"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl border border-dashed border-base-content/10 space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-base-content/20">
                  Metadata Verification
                </div>
                <div className="space-y-3">
                  <MetaItem label="Archive ID" value={blog.id} />
                  <MetaItem
                    label="Sync Date"
                    value={new Date(blog.createdAt || "").toLocaleString()}
                  />
                  <MetaItem
                    label="System Status"
                    value={blog.status === 1 ? "LIVE" : "DRAFT"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-12 border-t border-base-content/5 flex gap-4 bg-base-100">
          <button
            onClick={onClose}
            className="w-full btn btn-ghost h-14 rounded-2xl font-black uppercase tracking-[0.4em] text-xs border border-base-content/10 shadow-sm"
          >
            Close Manifest
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
    <span className="text-[9px] font-black text-base-content/60 uppercase">
      {value}
    </span>
  </div>
);

export default AddBlogPage;
