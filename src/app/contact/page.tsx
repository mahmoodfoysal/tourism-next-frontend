"use client";

import React from "react";
import CommonHeader from "@/components/shared/CommonHeader/CommonHeader";
import Image from "next/image";

const ContactPage = () => {
  const contactInfo = [
    {
      title: "Direct Call",
      value: "+1 (555) 000-1234",
      subValue: "Mon-Fri: 9am - 6pm",
      icon: (
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
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      color: "primary",
    },
    {
      title: "Email Support",
      value: "hello@auratrip.com",
      subValue: "24/7 Online Support",
      icon: (
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
      ),
      color: "secondary",
    },
    {
      title: "Global Office",
      value: "123 Discovery Way",
      subValue: "San Francisco, CA 94103",
      icon: (
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
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      color: "accent",
    },
  ];

  return (
    <main className="min-h-screen bg-base-100">
      <CommonHeader
        title="Get in"
        highlightText="Touch"
        subtitle="Have questions about a destination? We're here to help you plan your next great adventure."
      />

      <section className="pb-24">
        <div className="route-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            {/* Left Side: Contact Form (2/3) */}
            <div className="lg:col-span-2 space-y-12">
              <div className="bg-base-100 rounded-[4rem] border border-base-content/5 p-12 md:p-16 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                <div className="relative">
                  <div className="mb-12">
                    <h2 className="text-3xl md:text-5xl font-black text-base-content tracking-tight mb-4">
                      Send Us a <span className="text-primary">Message</span>
                    </h2>
                    <p className="text-lg text-base-content/60 font-medium leading-relaxed">
                      Fill out the form below and our travel specialists will
                      get back to you within 24 hours.
                    </p>
                  </div>

                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4">
                          Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="input input-ghost w-full rounded-2xl bg-base-200/50 border-transparent focus:bg-base-100 focus:border-primary/20 px-6 font-bold h-16"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="john@example.com"
                          className="input input-ghost w-full rounded-2xl bg-base-200/50 border-transparent focus:bg-base-100 focus:border-primary/20 px-6 font-bold h-16"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4">
                        Contact No
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="input input-ghost w-full rounded-2xl bg-base-200/50 border-transparent focus:bg-base-100 focus:border-primary/20 px-6 font-bold h-16"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-base-content/40 ml-4">
                        Message
                      </label>
                      <textarea
                        placeholder="Tell us about your travel plans..."
                        className="textarea textarea-ghost w-full h-48 rounded-[2rem] bg-base-200/50 border-transparent focus:bg-base-100 focus:border-primary/20 px-6 py-6 font-bold leading-relaxed resize-none"
                      ></textarea>
                    </div>

                    <button className="btn btn-primary w-full h-20 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all text-sm">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Side: Info Sidebar (1/3) */}
            <div className="space-y-8 sticky top-28">
              {/* Contact Cards */}
              <div className="space-y-6">
                {contactInfo.map((info, i) => (
                  <div
                    key={i}
                    className="group p-8 rounded-[3rem] bg-base-100 border border-base-content/5 hover:bg-base-200/50 transition-all duration-300 shadow-sm flex items-center gap-6"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl bg-${info.color}/10 flex items-center justify-center text-${info.color} shrink-0 shadow-lg shadow-${info.color}/5`}
                    >
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-base-content/30 mb-0.5">
                        {info.title}
                      </h3>
                      <div className="text-sm font-black text-base-content">
                        {info.value}
                      </div>
                      <div className="text-[10px] font-bold text-base-content/40">
                        {info.subValue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Emergency Support Card */}
              <div className="bg-gradient-to-br from-primary to-accent p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="relative">
                  <h3 className="text-xl font-black mb-3 flex items-center gap-2">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Need Help?
                  </h3>
                  <p className="text-white/80 text-sm font-medium mb-8 leading-relaxed">
                    Our emergency priority line is open 24/7 for travelers on
                    the ground.
                  </p>
                  <div className="text-2xl font-black tracking-tight">
                    +1 (800) AURA-SOS
                  </div>
                </div>
              </div>

              {/* Social Proof Section */}
              <div className="bg-base-200/50 p-10 rounded-[4rem] border border-base-content/5">
                <h3 className="text-sm font-black uppercase tracking-widest text-base-content/30 mb-6">
                  Online Now
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-base-100 overflow-hidden relative"
                      >
                        <Image
                          src={`https://i.pravatar.cc/100?img=${i + 20}`}
                          alt="team"
                          fill
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-base-content">
                      Travel Designers
                    </span>
                    <span className="text-[10px] font-bold text-success flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
                      Ready to Help
                    </span>
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

export default ContactPage;
