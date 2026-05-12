"use client";

import React, { useState, useEffect } from "react";
import CommonHeader from "@/components/shared/CommonHeader/CommonHeader";
import Image from "next/image";
import tourismApi from "@/api/tourismApi";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import {
  showSuccess,
  showError,
  showConfirmation,
  showProcessing,
  closeAlert,
} from "@/components/pages/Alert";
import { useRouter } from "next/navigation";

interface TourPackage {
  id?: string | number;
  _id?: string | number;
  title: string;
  price: number;
  originalPrice?: number;
  duration: string;
  category: string;
  image: string;
  features: string[];
}

const BookingPage = () => {
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId");
  const reduxPackage = useSelector(
    (state: RootState) => state.booking.selectedPackage,
  );

  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    emergencyContact: "",
    address: "",
    travelDate: "",
    paymentMethod: "Credit Card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
    mobileNo: "",
    transactionId: "",
    passportNo: "",
    country: "",
  });
  const [travelers, setTravelers] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    // If we have data in Redux, use it immediately
    if (reduxPackage) {
      setTimeout(() => {
        setSelectedPackage(reduxPackage);
        setLoading(false);
      }, 0);

      return;
    }

    const fetchData = async () => {
      try {
        if (packageId) {
          const data = await tourismApi.getPackageDetails(packageId);
          if (data) {
            setSelectedPackage(data);
          }
        } else {
          // Fallback: If no ID, we might still want to fetch the list to get a default
          // but since the user specifically asked to use the detail endpoint:
          const data = await tourismApi.getTourPackages();
          const result = Array.isArray(data) ? data : data?.data || [];
          if (result.length > 0) setSelectedPackage(result[0]);
        }
      } catch (error) {
        console.error("Error fetching package details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [packageId, reduxPackage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Manual validation check for required fields
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "emergencyContact",
      "address",
      "country",
      "passportNo",
      "travelDate",
    ];
    const isBaseValid = requiredFields.every(
      (field) => formData[field as keyof typeof formData],
    );

    let isPaymentValid = true;
    if (formData.paymentMethod === "Credit Card") {
      isPaymentValid = [
        "cardNumber",
        "expiryDate",
        "cvv",
        "cardHolderName",
      ].every((field) => formData[field as keyof typeof formData]);
    } else if (formData.paymentMethod === "Mobile Banking") {
      isPaymentValid = ["mobileNo", "transactionId"].every(
        (field) => formData[field as keyof typeof formData],
      );
    }

    if (!isBaseValid || !isPaymentValid) {
      showError(
        "Incomplete Form",
        "Please fill in all required fields marked with * to proceed.",
      );
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    if (!selectedPackage) return;

    const isConfirmed = await showConfirmation(
      "Confirm Booking",
      "Are you sure you want to proceed with this reservation?",
      "Yes, Book Now",
      "Cancel",
    );

    if (!isConfirmed.isConfirmed) return;

    setLoading(true);
    showProcessing(
      "Securing Your Spot",
      "Please wait while we process your booking...",
    );

    try {
      const orderData = {
        // ... (rest of the orderData construction remains the same)
        full_name: formData.fullName,
        email: formData.email,
        phone_no: formData.phone,
        emergency_no: formData.emergencyContact,
        full_address: formData.address,
        country: formData.country,
        passport_no: formData.passportNo,
        joining_date: formData.travelDate,
        payment_method: formData.paymentMethod,
        person: travelers,
        card_name: formData.cardHolderName,
        card_number: Number(formData.cardNumber.replace(/\s+/g, "")),
        expire_date: formData.expiryDate,
        cvc: Number(formData.cvv),
        mobile_bank_no: formData.mobileNo,
        transaction_no: formData.transactionId,
        sub_total: totalPrice,
        tax_total: Number((totalPrice * 0.1).toFixed(2)),
        service_charge: 25,
        grand_total: Number((totalPrice * 1.1 + 25).toFixed(2)),
        order_status: "P",
        package_info: {
          package_id: selectedPackage.id || selectedPackage._id,
          price: selectedPackage.price,
          category: selectedPackage.category,
          features: selectedPackage.features,
          image: selectedPackage.image,
          originalPrice: selectedPackage.originalPrice,
          title: selectedPackage.title,
        },
      };

      const result = await tourismApi.submitOrder(orderData, axiosSecure);

      if (result) {
        closeAlert();
        showSuccess(
          "Booking Confirmed",
          "Your adventure has been secured! Redirecting to home...",
        );

        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          emergencyContact: "",
          address: "",
          travelDate: "",
          paymentMethod: "Credit Card",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          cardHolderName: "",
          mobileNo: "",
          transactionId: "",
          passportNo: "",
          country: "",
        });
        setTravelers(1);
        setFormSubmitted(false);

        // Redirect after success
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      closeAlert();
      console.error("Booking Error:", error);
      showError(
        "Submission Failed",
        "We couldn't process your booking. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = selectedPackage ? selectedPackage.price * travelers : 0;

  return (
    <main className="min-h-screen bg-base-100">
      <CommonHeader
        title="Book Your"
        highlightText="Adventure"
        subtitle="Secure your spot on an unforgettable journey. Fill in your details below to finalize your booking."
      />

      <section className="pb-24">
        <div className="route-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            {/* Left Side: Booking Form (2/3) */}
            <div className="lg:col-span-2 space-y-12">
              <div className="bg-base-100 rounded-[4rem] border border-base-content/5 p-12 md:p-16 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                <div className="relative">
                  <h2 className="text-3xl font-black text-base-content mb-12 flex items-center gap-4">
                    <span className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center text-xl">
                      1
                    </span>
                    Personal Information
                  </h2>

                  <form
                    className="space-y-10"
                    onSubmit={handleSubmit}
                    noValidate
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4 flex items-center">
                          Full Name <span className="text-error ml-1">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Alex Rivera"
                          className={`input input-ghost w-full h-12 rounded-2xl bg-base-200/50 border-transparent focus:bg-base-100 focus:border-primary/20 px-8 font-bold ${formSubmitted && !formData.fullName ? "border-error/50 bg-error/5" : ""}`}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4 flex items-center">
                          Email Address{" "}
                          <span className="text-error ml-1">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="alex@example.com"
                          className={`input input-ghost w-full h-12 rounded-2xl bg-base-200/50 border-transparent focus:bg-base-100 focus:border-primary/20 px-8 font-bold ${formSubmitted && !formData.email ? "border-error/50 bg-error/5" : ""}`}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4 flex items-center">
                          Phone Number{" "}
                          <span className="text-error ml-1">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 000-0000"
                          className={`input input-ghost w-full h-12 rounded-2xl bg-base-200/50 border-transparent focus:bg-base-100 focus:border-primary/20 px-8 font-bold ${formSubmitted && !formData.phone ? "border-error/50 bg-error/5" : ""}`}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4 flex items-center">
                          Emergency Contact{" "}
                          <span className="text-error ml-1">*</span>
                        </label>
                        <input
                          type="tel"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleInputChange}
                          placeholder="Enter Number"
                          className={`input input-ghost w-full h-12 rounded-2xl bg-base-200/50 border-transparent focus:bg-base-100 focus:border-primary/20 px-8 font-bold ${formSubmitted && !formData.emergencyContact ? "border-error/50 bg-error/5" : ""}`}
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4 flex items-center">
                          Full Address{" "}
                          <span className="text-error ml-1">*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Street, City, State, ZIP"
                          className={`input input-ghost w-full h-12 rounded-2xl bg-base-200/50 border-transparent focus:bg-base-100 focus:border-primary/20 px-8 font-bold ${formSubmitted && !formData.address ? "border-error/50 bg-error/5" : ""}`}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4 flex items-center">
                          Country <span className="text-error ml-1">*</span>
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          placeholder="e.g. United States"
                          className={`input input-ghost w-full h-12 rounded-2xl bg-base-200/50 border-transparent focus:bg-base-100 focus:border-primary/20 px-8 font-bold ${formSubmitted && !formData.country ? "border-error/50 bg-error/5" : ""}`}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4 flex items-center">
                          Passport No <span className="text-error ml-1">*</span>
                        </label>
                        <input
                          type="text"
                          name="passportNo"
                          value={formData.passportNo}
                          onChange={handleInputChange}
                          placeholder="A12345678"
                          className={`input input-ghost w-full h-12 rounded-2xl bg-base-200/50 border-transparent focus:bg-base-100 focus:border-primary/20 px-8 font-bold ${formSubmitted && !formData.passportNo ? "border-error/50 bg-error/5" : ""}`}
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-8">
                      <h2 className="text-3xl font-black text-base-content mb-12 flex items-center gap-4">
                        <span className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center text-xl">
                          2
                        </span>
                        Trip Configuration
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4 flex items-center">
                            Joining Date{" "}
                            <span className="text-error ml-1">*</span>
                          </label>
                          <input
                            type="date"
                            name="travelDate"
                            value={formData.travelDate}
                            onChange={handleInputChange}
                            className={`input input-ghost w-full h-12 rounded-2xl bg-base-200/50 border-transparent focus:bg-base-100 focus:border-primary/20 px-8 font-bold ${formSubmitted && !formData.travelDate ? "border-error/50 bg-error/5" : ""}`}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4 flex items-center">
                            Number of Travelers{" "}
                            <span className="text-error ml-1">*</span>
                          </label>
                          <div className="flex items-center gap-4 bg-base-200/50 rounded-2xl px-4 h-12">
                            <button
                              type="button"
                              onClick={() =>
                                setTravelers(Math.max(1, travelers - 1))
                              }
                              className="w-10 h-10 rounded-xl bg-base-100 flex items-center justify-center text-xl font-black hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                              -
                            </button>
                            <span className="flex-1 text-center font-black text-xl">
                              {travelers}
                            </span>
                            <button
                              type="button"
                              onClick={() => setTravelers(travelers + 1)}
                              className="w-10 h-10 rounded-xl bg-base-100 flex items-center justify-center text-xl font-black hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8">
                      <h2 className="text-3xl font-black text-base-content mb-12 flex items-center gap-4">
                        <span className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center text-xl">
                          3
                        </span>
                        Payment Selection
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {["Credit Card", "Mobile Banking"].map((method) => (
                          <div
                            key={method}
                            className="cursor-pointer group relative"
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              className="peer hidden"
                              id={method}
                              value={method}
                              checked={formData.paymentMethod === method}
                              onChange={handleInputChange}
                            />
                            <label
                              htmlFor={method}
                              className="flex flex-col items-center justify-center h-14 rounded-2xl bg-base-200/50 border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 transition-all group-hover:bg-base-200"
                            >
                              <div className="font-black text-sm uppercase tracking-widest text-base-content/60 peer-checked:text-primary">
                                {method}
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>

                      {/* Conditional Card Fields */}
                      {formData.paymentMethod === "Credit Card" && (
                        <div className="mt-12 p-10 rounded-[3rem] bg-base-200/30 border border-base-content/5 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                          <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4 flex items-center">
                              Cardholder Name{" "}
                              <span className="text-error ml-1">*</span>
                            </label>
                            <input
                              type="text"
                              name="cardHolderName"
                              value={formData.cardHolderName}
                              onChange={handleInputChange}
                              placeholder="ALEX RIVERA"
                              className={`input input-ghost w-full h-12 rounded-2xl bg-base-100 border-transparent focus:border-primary/20 px-8 font-bold uppercase ${formSubmitted && formData.paymentMethod === "Credit Card" && !formData.cardHolderName ? "border-error/50 bg-error/5" : ""}`}
                              required={
                                formData.paymentMethod === "Credit Card"
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4 flex items-center">
                              Card Number{" "}
                              <span className="text-error ml-1">*</span>
                            </label>
                            <input
                              type="number"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              placeholder="0000 0000 0000 0000"
                              className={`input input-ghost w-full h-12 rounded-2xl bg-base-100 border-transparent focus:border-primary/20 px-8 font-bold tracking-[0.2em] ${formSubmitted && formData.paymentMethod === "Credit Card" && !formData.cardNumber ? "border-error/50 bg-error/5" : ""}`}
                              required={
                                formData.paymentMethod === "Credit Card"
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                              <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4 flex items-center">
                                Expiry Date{" "}
                                <span className="text-error ml-1">*</span>
                              </label>
                              <input
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                placeholder="MM / YY"
                                className={`input input-ghost w-full h-12 rounded-2xl bg-base-100 border-transparent focus:border-primary/20 px-8 font-bold ${formSubmitted && formData.paymentMethod === "Credit Card" && !formData.expiryDate ? "border-error/50 bg-error/5" : ""}`}
                                required={
                                  formData.paymentMethod === "Credit Card"
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4 flex items-center">
                                CVC <span className="text-error ml-1">*</span>
                              </label>
                              <input
                                type="number"
                                name="cvc"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                placeholder="***"
                                className={`input input-ghost w-full h-12 rounded-2xl bg-base-100 border-transparent focus:border-primary/20 px-8 font-bold ${formSubmitted && formData.paymentMethod === "Credit Card" && !formData.cvv ? "border-error/50 bg-error/5" : ""}`}
                                required={
                                  formData.paymentMethod === "Credit Card"
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Conditional Mobile Banking Fields */}
                      {formData.paymentMethod === "Mobile Banking" && (
                        <div className="mt-12 p-10 rounded-[3rem] bg-base-200/30 border border-base-content/5 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                          <div className="flex items-center gap-4 p-6 rounded-2xl bg-primary/5 border border-primary/10 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="text-xs font-bold text-primary/80 leading-relaxed">
                              Please send the total amount to our merchant
                              number and provide the details below.
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                              <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4 flex items-center">
                                Mobile Number{" "}
                                <span className="text-error ml-1">*</span>
                              </label>
                              <input
                                type="tel"
                                name="mobileNo"
                                value={formData.mobileNo}
                                onChange={handleInputChange}
                                placeholder="01XXX-XXXXXX"
                                className={`input input-ghost w-full h-12 rounded-2xl bg-base-100 border-transparent focus:border-primary/20 px-8 font-bold ${formSubmitted && formData.paymentMethod === "Mobile Banking" && !formData.mobileNo ? "border-error/50 bg-error/5" : ""}`}
                                required={
                                  formData.paymentMethod === "Mobile Banking"
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4 flex items-center">
                                Transaction ID{" "}
                                <span className="text-error ml-1">*</span>
                              </label>
                              <input
                                type="text"
                                name="transactionId"
                                value={formData.transactionId}
                                onChange={handleInputChange}
                                placeholder="TRX123456789"
                                className={`input input-ghost w-full h-12 rounded-2xl bg-base-100 border-transparent focus:border-primary/20 px-8 font-bold uppercase ${formSubmitted && formData.paymentMethod === "Mobile Banking" && !formData.transactionId ? "border-error/50 bg-error/5" : ""}`}
                                required={
                                  formData.paymentMethod === "Mobile Banking"
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button className="btn btn-primary w-full h-16 rounded-3xl font-black uppercase tracking-[0.2em] text-lg shadow-2xl shadow-primary/30 hover:scale-[1.01] transition-all mt-12">
                      Complete Booking
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Side: Order Summary (1/3) */}
            <div className="space-y-8 sticky top-28">
              <div className="bg-base-200/50 rounded-[4rem] border border-base-content/5 p-12 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                <h3 className="text-2xl font-black text-base-content mb-8">
                  Booking Summary
                </h3>

                {selectedPackage && (
                  <div className="space-y-8">
                    <div className="relative h-48 rounded-[2.5rem] overflow-hidden shadow-xl">
                      <Image
                        src={selectedPackage.image}
                        alt={selectedPackage.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <div className="text-[10px] font-black uppercase tracking-widest text-base-content/30">
                            Package
                          </div>
                          <div className="text-lg font-black text-base-content leading-tight">
                            {selectedPackage.title}
                          </div>
                        </div>
                        <div className="text-primary font-black">
                          {selectedPackage.duration}
                        </div>
                      </div>

                      <div className="h-px bg-base-content/5"></div>

                      <div className="space-y-4">
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-base-content/50">
                            Base Price ({travelers} travelers)
                          </span>
                          <span className="text-base-content">
                            ${selectedPackage.price * travelers}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-base-content/50">
                            Taxes & Fees (10%)
                          </span>
                          <span className="text-base-content">
                            ${(totalPrice * 0.1).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-base-content/50">
                            Service Charge
                          </span>
                          <span className="text-base-content">$25.00</span>
                        </div>
                      </div>

                      <div className="pt-6 border-t-2 border-dashed border-base-content/10 flex justify-between items-center">
                        <div className="text-xs font-black uppercase tracking-widest text-base-content/40">
                          Total Amount
                        </div>
                        <div className="text-4xl font-black text-primary tracking-tighter">
                          ${(totalPrice * 1.1 + 25).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Signals */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-6 rounded-3xl bg-success/5 border border-success/10">
                  <div className="w-12 h-12 rounded-2xl bg-success/20 flex items-center justify-center text-success">
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
                        strokeWidth="2.5"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-success">
                      Secure Payment
                    </div>
                    <div className="text-[10px] font-bold text-success/60">
                      SSL Encrypted Transaction
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-6 rounded-3xl bg-secondary/5 border border-secondary/10">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
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
                        strokeWidth="2.5"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-secondary">
                      Free Cancellation
                    </div>
                    <div className="text-[10px] font-bold text-secondary/60">
                      Up to 5 days before trip
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookingPage;
