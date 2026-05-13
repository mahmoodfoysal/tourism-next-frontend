"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import {
  showError,
  showConfirmation,
  showProcessing,
  showSuccess,
  closeAlert,
} from "@/components/pages/Alert";

/**
 * CouponClaim Component
 * Handles newsletter subscription and exclusive coupon generation.
 */
const CouponClaim: React.FC = () => {
  const axiosSecure = useAxiosSecure();
  const { user: userInfo } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error" | "already_received"
  >("idle");
  const [couponCode, setCouponCode] = useState("");

  /**
   * Generates a random 6-character alphanumeric coupon code.
   */
  const generateCouponCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  /**
   * Handles the claim submission process.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInfo) {
      showError("Login Required", "Please log in to claim your discount!");
      return;
    }

    if (email.toLowerCase() !== userInfo.email?.toLowerCase()) {
      showError("Email Mismatch", "Please use your registered account email.");
      return;
    }

    const confirmation = await showConfirmation(
      "Claim Discount?",
      "Do you want to claim your exclusive 10% discount coupon?",
      "Claim Now",
      "Maybe later",
    );

    if (!confirmation.isConfirmed) return;

    setStatus("loading");
    showProcessing("Processing...", "Generating your unique discount code...");

    try {
      const userRes = await axiosSecure.get(
        `/api/tourism/get-user-list/${email}`,
      );

      let userData = userRes.data?.list_data?.[0];

      // If user doesn't exist in our DB records, create a basic record first
      if (!userData) {
        await axiosSecure.post(`/api/tourism/insert-update-user-list`, {
          full_name: userInfo.displayName || "Customer",
          email: email,
        });

        const recheckRes = await axiosSecure.get(
          `/api/tourism/get-user-list/${email}`,
        );
        userData = recheckRes.data?.list_data?.[0];
      }

      // 1. Check if user has already claimed a coupon (flag: 1 means already received)
      if (userData && userData.flag === 1) {
        closeAlert();
        setStatus("already_received");
        setIsSubmitted(true);
        return;
      }

      // 2. If user is eligible (flag: 0), generate and assign coupon
      if (userData && userData.flag === 0) {
        const newCode = generateCouponCode();

        // Step A: Insert coupon into administrative coupon list
        await axiosSecure.post(`/api/tourism/admin/insert-update-coupon-list`, {
          coupon_code: newCode,
          email: email,
          flag: 0,
          per_dis_amt: "0.10", // Aligned with the 20% Discount visual promise
          operator: "*",
          user_info: email, // Project tracking identifier
        });

        await axiosSecure.patch(
          `/api/tourism/update-user-list/${userData?._id}/${userData?.email}`,
        );

        setCouponCode(newCode);
        setStatus("success");
        setIsSubmitted(true);
        setEmail("");
        closeAlert();
        showSuccess(
          "Congratulations!",
          "Your unique 10% discount code has been generated and added to your profile.",
        );
      } else {
        throw new Error(
          "Unable to verify eligibility. Please contact support.",
        );
      }
    } catch (error: any) {
      console.error("Coupon process failed:", error);
      setStatus("error");
      closeAlert();
      showError(
        "Claim Failed",
        error.response?.data?.message ||
          "Something went wrong! Please try again later.",
      );
    }
  };

  return (
    <section className="py-24 bg-base-200/30">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-[3.5rem] bg-gradient-to-br from-primary via-primary/90 to-secondary shadow-2xl">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>

          <div className="relative z-10 px-8 py-20 lg:py-24 text-center max-w-4xl mx-auto">
            {!isSubmitted ? (
              <>
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-xs uppercase tracking-widest mb-8 border border-white/30">
                  Exclusive Welcome Offer
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
                  Unlock Your{" "}
                  <span className="text-accent underline decoration-4 underline-offset-8 italic">
                    10% Discount
                  </span>{" "}
                  <br />
                  For Your First Trip
                </h2>
                <p className="text-xl text-white/80 leading-relaxed mb-12 max-w-2xl mx-auto font-medium">
                  Join our global community of explorers. Subscribe today and
                  receive your unique welcome coupon instantly.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto"
                >
                  <div className="relative w-full sm:flex-1 group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/50 group-focus-within:text-white transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-lg font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-primary font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 disabled:opacity-50 disabled:scale-100"
                  >
                    {status === "loading" ? "Processing..." : "Claim Coupon"}
                  </button>
                </form>
                <p className="mt-6 text-white/50 text-sm font-medium italic">
                  * Exclusive offer for new members. Valid for first-time
                  bookings.
                </p>
              </>
            ) : (
              <div className="animate-in fade-in zoom-in duration-700">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/30 backdrop-blur-xl">
                  {status === "success" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="text-3xl">✨</span>
                  )}
                </div>

                {status === "success" ? (
                  <>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">
                      Your Coupon is Ready!
                    </h2>
                    <div className="bg-white/10 backdrop-blur-md border-2 border-dashed border-white/40 p-8 rounded-[2.5rem] mb-10 max-w-sm mx-auto group relative">
                      <p className="text-sm font-black text-white/40 uppercase tracking-widest mb-2">
                        Discount Code
                      </p>
                      <h3 className="text-5xl font-black text-white tracking-[0.2em] font-mono select-all">
                        {couponCode}
                      </h3>
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-[#0a0f1c] text-xs font-black animate-bounce">
                        -10%
                      </div>
                    </div>
                    <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-xl mx-auto">
                      Copy your code above and apply it at the checkout of your
                      next expedition.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">
                      Already Claimed!
                    </h2>
                    <p className="text-xl text-white/80 leading-relaxed mb-10 max-w-xl mx-auto">
                      It looks like you have already received your welcome
                      discount. Check your profile dashboard to see your active
                      coupons.
                    </p>
                  </>
                )}

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setStatus("idle");
                    }}
                    className="btn btn-ghost text-white/60 hover:text-white border-white/20 hover:bg-white/10 rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px]"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={() => (window.location.href = "/profile")}
                    className="btn bg-white text-primary border-none hover:bg-white/90 rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px]"
                  >
                    View in Profile
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Travel Related Icon Overlay */}
          <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-80 w-80 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CouponClaim;
