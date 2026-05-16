"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import dynamic from "next/dynamic";

// Dynamic import for ApexCharts to prevent SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DashboardOverview = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const axiosSecure = useAxiosSecure();
  const [theme, setTheme] = useState("dark");
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    upcomingTrips: 0,
    totalPackages: 0,
  });
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Detect theme
    const isDark = document.documentElement.classList.contains("dark");
    setTimeout(() => {
      setTheme(isDark ? "dark" : "light");
    });

    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains("dark");
      setTheme(isDarkNow ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const fetchDashboardData = async () => {
      if (!user?.email) return;
      try {
        setLoading(true);
        // Using direct API calls as requested
        const [bookingsRes, packagesRes] = await Promise.all([
          axiosSecure.get("/api/tourism/get-booking-list"),
          axiosPublic.get("/api/tourism/get-package-list"),
        ]);

        const bookingsData = bookingsRes.data?.list_data || [];
        const packagesData = packagesRes.data?.list_data || [];

        if (Array.isArray(bookingsData)) {
          setBookings(bookingsData);
          const totalSpent = bookingsData.reduce(
            (acc: number, b: any) => acc + (b.grand_total - b.tax_total || 0),
            0,
          );
          const upcoming = bookingsData.filter(
            (b: any) => b.order_status === "B" || b.order_status === "BP",
          ).length;

          setStats((prev) => ({
            ...prev,
            totalBookings: bookingsData.length,
            totalSpent,
            upcomingTrips: upcoming,
          }));
        }

        if (Array.isArray(packagesData)) {
          setStats((prev) => ({
            ...prev,
            totalPackages: packagesData.length,
          }));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    return () => observer.disconnect();
  }, [user, axiosSecure]);

  // Data processing for charts
  const chartData = useMemo(() => {
    // 1. Revenue Trend Data (Daily)
    const revenueByDate: Record<string, number> = {};

    // 2. Monthly Bar Chart Data
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const volumeByMonth = new Array(12).fill(0);

    // 3. Pie Chart Data
    let subTotal = 0;
    let taxTotal = 0;
    let serviceCharge = 0;

    bookings.forEach((b) => {
      const dateObj = new Date(b.createdAt);
      if (isNaN(dateObj.getTime())) return;

      // Revenue Trend (Daily) - Use ISO format for internal sorting
      const dateKey = dateObj.toISOString().split("T")[0];
      const amount = Number(b.grand_total) || 0;
      revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + amount;

      // Monthly processing
      const monthIndex = dateObj.getMonth();
      if (monthIndex >= 0 && monthIndex < 12) {
        volumeByMonth[monthIndex] += 1;
      }

      // Financial processing
      subTotal += Number(b.sub_total) || 0;
      taxTotal += Number(b.tax_total) || 0;
      serviceCharge += Number(b.service_charge) || 0;
    });

    // Pie Chart Specific Calculation: Revenue at 15% of Subtotal
    const calculatedRevenue = Number((subTotal * 0.15).toFixed(2));

    // Sort dates for line chart using YYYY-MM-DD keys (lexicographical sort)
    const sortedKeys = Object.keys(revenueByDate).sort();
    const revenueSeriesData = sortedKeys.map((key) =>
      Number(revenueByDate[key] || 0),
    );
    const displayCategories = sortedKeys.map((key) => {
      const [y, m, d] = key.split("-");
      const months_short = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${d}-${months_short[parseInt(m) - 1]}-${y}`;
    });

    return {
      revenueTrend: {
        categories: displayCategories,
        series: [
          {
            name: "Revenue",
            data: revenueSeriesData.map((v) => (isNaN(v) ? 0 : v)),
          },
        ],
      },
      bar: {
        categories: months,
        series: [
          {
            name: "Monthly Bookings",
            data: volumeByMonth.map((v) => (isNaN(v) ? 0 : v)),
          },
        ],
      },
      pie: {
        series: [calculatedRevenue, serviceCharge, taxTotal].map((v) =>
          isNaN(v) ? 0 : v,
        ),
        labels: ["Platform Revenue (15%)", "Service Charge", "VAT/Tax"],
      },
    };
  }, [bookings]);

  // Chart Configurations
  const revenueTrendOptions: any = {
    chart: {
      id: "revenue-trend",
      toolbar: { show: false },
      background: "transparent",
      foreColor: theme === "dark" ? "#94a3b8" : "#64748b",
      fontFamily: "Inter, sans-serif",
    },
    xaxis: {
      categories: chartData.revenueTrend.categories,
      labels: { rotate: -45, style: { fontSize: "10px", fontWeight: 600 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `$${val.toFixed(0)}`,
        style: { fontWeight: 600 },
      },
    },
    stroke: { curve: "smooth", width: 4, colors: ["#22d3ee"] },
    colors: ["#22d3ee"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    markers: {
      size: 6,
      colors: ["#22d3ee"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 8 },
    },
    grid: {
      borderColor:
        theme === "dark"
          ? "rgba(148, 163, 184, 0.1)"
          : "rgba(100, 116, 139, 0.1)",
      strokeDashArray: 5,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    theme: { mode: theme as "light" | "dark" },
    tooltip: { theme: theme as "light" | "dark", x: { show: true } },
  };

  const barChartOptions: any = {
    chart: {
      id: "monthly-volume",
      toolbar: { show: false },
      background: "transparent",
      foreColor: theme === "dark" ? "#94a3b8" : "#64748b",
    },
    xaxis: { categories: chartData.bar.categories },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "60%" } },
    colors: ["#10b981"],
    theme: { mode: theme as "light" | "dark" },
    grid: { show: false },
  };

  const pieChartOptions: any = {
    chart: {
      id: "revenue-pie",
      background: "transparent",
      foreColor: theme === "dark" ? "#94a3b8" : "#64748b",
    },
    labels: chartData.pie.labels,
    colors: ["#22d3ee", "#8b5cf6", "#f59e0b"],
    theme: { mode: theme as "light" | "dark" },
    stroke: { show: false },
    legend: { position: "bottom", fontSize: "10px" },
    tooltip: { y: { formatter: (val: number) => `$${val.toFixed(2)}` } },
  };

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalBookings,
      icon: "📦",
      color: "primary",
    },
    {
      label: "Total Sells Revenue",
      value: `$${stats.totalSpent.toLocaleString()}`,
      icon: "💰",
      color: "success",
    },
    {
      label: "Available Packages",
      value: stats.totalPackages,
      icon: "🌍",
      color: "warning",
    },
    {
      label: "Pending Orders",
      value: stats.upcomingTrips,
      icon: "⏳",
      color: "accent",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-base-300/50 rounded-[2rem] animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* Top row: 3 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="p-8 rounded-[2.5rem] bg-base-100 dark:bg-base-300/30 border border-base-content/5 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-black text-base-content uppercase tracking-widest">
              Revenue Trend
            </h3>
            <p className="text-[9px] font-bold text-base-content/30 tracking-widest uppercase">
              Financial Performance
            </p>
          </div>
          <div className="h-[240px]">
            <Chart
              options={revenueTrendOptions}
              series={chartData.revenueTrend.series}
              type="area"
              height="100%"
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="p-8 rounded-[2.5rem] bg-base-100 dark:bg-base-300/30 border border-base-content/5 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-black text-base-content uppercase tracking-widest">
              Monthly Volume
            </h3>
            <p className="text-[9px] font-bold text-base-content/30 tracking-widest uppercase">
              Reservation Intensity
            </p>
          </div>
          <div className="h-[240px]">
            <Chart
              options={barChartOptions}
              series={chartData.bar.series}
              type="bar"
              height="100%"
            />
          </div>
        </div>

        {/* Financial Split Pie Chart */}
        <div className="p-8 rounded-[2.5rem] bg-base-100 dark:bg-base-300/30 border border-base-content/5 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-black text-base-content uppercase tracking-widest">
              Financial Split
            </h3>
            <p className="text-[9px] font-bold text-base-content/30 tracking-widest uppercase">
              Platform Yield & Fees
            </p>
          </div>
          <div className="h-[240px]">
            <Chart
              options={pieChartOptions}
              series={chartData.pie.series}
              type="pie"
              height="100%"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="group p-6 rounded-[2rem] bg-base-100 dark:bg-base-300/30 border border-base-content/5 shadow-sm transition-all duration-500"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center text-xl mb-4`}
            >
              {stat.icon}
            </div>
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-1">
              {stat.label}
            </h3>
            <p className="text-2xl font-black text-base-content tracking-tighter">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;
