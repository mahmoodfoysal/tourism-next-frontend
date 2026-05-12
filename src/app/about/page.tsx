"use client";

import React from "react";
import Image from "next/image";
import CommonHeader from "@/components/shared/CommonHeader/CommonHeader";
import Link from "next/link";

const AboutPage = () => {
  const stats = [
    { label: "Years Experience", value: "12+", color: "primary" },
    { label: "Happy Travelers", value: "50k+", color: "secondary" },
    { label: "Destinations", value: "250+", color: "accent" },
    { label: "Local Guides", value: "150+", color: "primary" },
  ];

  const values = [
    {
      title: "Integrity First",
      description:
        "We believe in honest pricing and authentic experiences without hidden agendas.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: "Expert Curation",
      description:
        "Every itinerary is hand-picked and tested by our travel experts to ensure excellence.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
    },
    {
      title: "Sustainability",
      description:
        "We are committed to eco-friendly travel that supports and preserves local communities.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2 2 2 0 012 2v.654M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  const team = [
    {
      name: "Marcus Thorne",
      role: "CEO & Founder",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
    },
    {
      name: "Sarah Jenkins",
      role: "Head of Operations",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
    },
    {
      name: "David Chen",
      role: "Chief Travel Explorer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400",
    },
    {
      name: "Elena Rodriguez",
      role: "Sustainability Lead",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400",
    },
  ];

  return (
    <main className="min-h-screen bg-base-100">
      <CommonHeader
        title="Our"
        highlightText="Legacy"
        subtitle="Crafting unforgettable stories since 2012, one destination at a time."
      />

      {/* Story Section */}
      <section className="py-24">
        <div className="route-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl group">
              <Image
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000"
                alt="Our Story"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 flex items-center gap-4 bg-white/20 backdrop-blur-xl p-6 rounded-3xl border border-white/20">
                <div className="text-4xl font-black text-white">12</div>
                <div className="text-xs font-black uppercase tracking-widest text-white/80 leading-tight">
                  Years of <br /> Excellence
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest">
                Our Genesis
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight leading-tight">
                We Do not Just Plan Trips, We{" "}
                <span className="text-primary">Create Memories</span>
              </h2>
              <p className="text-lg text-base-content/60 leading-relaxed">
                Founded in 2012 by a group of passionate explorers, Aura Trip
                was born out of a desire to bring authenticity back to travel.
                We realized that the world was becoming over-commercialized, and
                the true soul of destinations was being lost.
              </p>
              <p className="text-lg text-base-content/60 leading-relaxed">
                Today, we stand as a beacon for responsible, immersive, and
                high-impact travel. Our team traverses the globe to find the
                hidden paths, the local flavors, and the untold stories that
                make every journey unique.
              </p>

              <div className="grid grid-cols-2 gap-8 pt-8">
                {stats.map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className={`text-3xl font-black text-${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-base-content/40">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Pattern Section */}
      <section className="py-24 bg-base-200/50">
        <div className="route-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                Core Beliefs
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight mb-6">
                What Drives <span className="text-primary">Our Passion</span>
              </h2>
              <p className="text-lg text-base-content/60 leading-relaxed">
                Our values are the compass that guides every itinerary we build
                and every relationship we nurture with local partners.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((value, i) => (
              <div
                key={i}
                className="bg-base-100 p-10 rounded-[3rem] border border-base-content/5 shadow-xl hover:shadow-2xl transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-xl font-black text-base-content mb-4">
                  {value.title}
                </h3>
                <p className="text-base-content/60 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="route-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-xs uppercase tracking-widest mb-4">
                The Explorers
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight mb-6">
                Meet the <span className="text-secondary">Visionaries</span>
              </h2>
              <p className="text-lg text-base-content/60 leading-relaxed">
                A diverse team of world-class travelers, logistics experts, and
                storytellers dedicated to your discovery.
              </p>
            </div>
            <button className="btn btn-secondary rounded-2xl px-8 h-14 shadow-lg shadow-secondary/20 font-black uppercase tracking-widest text-[10px] hidden md:flex items-center">
              Join Our Team
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="group relative">
                <div className="relative h-[400px] rounded-[3rem] overflow-hidden shadow-xl mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale-[0.5]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-colors cursor-pointer">
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <h4 className="text-xl font-black text-base-content group-hover:text-primary transition-colors">
                  {member.name}
                </h4>
                <p className="text-xs font-bold uppercase tracking-widest text-base-content/40">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="route-container">
          <div className="relative rounded-[4rem] bg-primary overflow-hidden p-12 md:p-24 text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>

            <div className="relative max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                Ready to Start Your <br /> Next Story?
              </h2>
              <p className="text-xl text-white/80 font-medium">
                Join our community of elite explorers and discover the world
                like never before.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                <Link
                  href="/packages"
                  className="btn bg-white border-none text-primary hover:bg-white/90 rounded-2xl px-12 h-16 font-black uppercase tracking-widest shadow-2xl shadow-black/20"
                >
                  Browse Packages
                </Link>
                <Link
                  href="/destinations"
                  className="btn btn-ghost text-white border-white/20 hover:bg-white/10 rounded-2xl px-12 h-16 font-black uppercase tracking-widest"
                >
                  Explore Places
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
