"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div className="bg-base-100 w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-base-content/5">
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-base-100/80 backdrop-blur-md z-20">
          <h3 className="text-2xl font-black uppercase tracking-tight text-primary">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle hover:bg-primary/10 hover:text-primary transition-all"
          >
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
                strokeWidth="3"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-8 pt-4 max-h-[60vh] overflow-y-auto custom-scrollbar text-base-content/70 leading-relaxed font-medium space-y-4">
          {children}
        </div>
        <div className="p-8 pt-4 border-t border-base-content/5 flex justify-end bg-base-200/30">
          <button
            onClick={onClose}
            className="btn btn-primary rounded-2xl px-10 h-14 font-black uppercase tracking-widest text-xs"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [dynamicDestinations, setDynamicDestinations] = useState<any[]>([]);
  const [isDestLoading, setIsDestLoading] = useState(true);
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { axiosPublic } = await import("@/hooks/useAxiosPublic");
        const response = await axiosPublic.get(
          "/api/tourism/get-popular-dest-list",
        );
        const data = response.data?.list_data;
        const result = Array.isArray(data) ? data : data?.data || [];
        // Shuffle and take 4 random items
        const shuffled = [...result]
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setDynamicDestinations(shuffled);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setIsDestLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (pathname?.startsWith("/dashboard")) return null;

  const footerLinks = {
    services: [
      { name: "Home", href: "/" },
      { name: "Destinations", href: "/destinations" },
      { name: "Tour Packages", href: "/packages" },
      { name: "Latest Blogs", href: "/blogs" },
      { name: "About Us", href: "/about" },
      { name: "Contact Us", href: "/contact" },
      { name: "My Bookings", href: "/my-bookings" },
    ],
    destinations: dynamicDestinations.map((dest) => ({
      name: dest.name,
      href: `/destinations/details/${dest._id}`,
    })),
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Terms of Service", action: () => setShowTerms(true) },
      { name: "Privacy Policy", action: () => setShowPrivacy(true) },
      { name: "Contact Us", href: "/contact" },
    ],
  };

  return (
    <footer className="bg-base-200 text-base-content/70 border-t border-base-content/5 print:hidden">
      {/* Main Footer Links */}
      <div className="section-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
        {/* Brand Section */}
        <div className="space-y-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-black tracking-tighter text-base-content"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
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
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span>
              Aura<span className="text-primary"> Trip</span>
            </span>
          </Link>
          <p className="opacity-70 leading-relaxed">
            Discover the worlds most beautiful destinations with Aura Trip. We
            provide premium travel experiences tailored to your dreams.
          </p>
          <div className="flex gap-4">
            <a
              target="_blank"
              href="https://foysalmahmood.netlify.app/"
              className="w-10 h-10 border-2 border-current flex items-center justify-center hover:opacity-70 transition-all active:scale-90"
              title="View Portfolio"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-current"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </a>

            <a
              target="black"
              href="https://github.com/mahmoodfoysal"
              className="w-10 h-10 border-2 border-current flex items-center justify-center hover:opacity-70 transition-all active:scale-90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/foysalmahmood/"
              target="black"
              className="w-10 h-10 border-2 border-current flex items-center justify-center hover:opacity-70 transition-all active:scale-90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/foysal.mahmood.1/"
              target="blank"
              className="w-10 h-10 border-2 border-current flex items-center justify-center hover:opacity-70 transition-all active:scale-90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Links Groups */}
        <div>
          <h4 className="text-base-content font-bold text-lg mb-6 uppercase tracking-wider text-center">
            Navigation
          </h4>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
            {footerLinks.services.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-base-content font-bold text-lg mb-6 uppercase tracking-wider">
            Destinations
          </h4>
          <ul className="space-y-4">
            {isDestLoading ? (
              [...Array(4)].map((_, i) => (
                <li
                  key={i}
                  className="h-4 w-32 bg-base-content/10 animate-pulse rounded"
                ></li>
              ))
            ) : footerLinks.destinations.length > 0 ? (
              footerLinks.destinations.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-xs italic opacity-40">
                No destinations found
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-base-content font-bold text-lg mb-6 uppercase tracking-wider">
            Support
          </h4>
          <ul className="space-y-4">
            {footerLinks.support.map((link) => (
              <li key={link.name}>
                {link.action ? (
                  <a
                    onClick={link.action}
                    className="hover:text-primary transition-colors duration-200 cursor-pointer"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    href={link.href || "#"}
                    className="hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-base-content/10 bg-base-300/30">
        <div className="w-[85%] mx-auto py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-50">
          <p>
            © {currentYear} Aura Trip Inc. All rights reserved. by Foysal
            Mahmood
          </p>
          <div className="flex gap-8">
            <a
              href="https://foysalmahmood.netlify.app/"
              target="_blank"
              onClick={() => setShowPrivacy(true)}
              className="hover:text-base-content transition-colors"
            >
              Develop & Maintainence by Foysal Mahmood
            </a>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms & Conditions"
      >
        <p className="font-bold text-base-content">
          Welcome to AuraTrip. By using our services, you agree to the following
          terms:
        </p>
        <div className="space-y-4">
          <section>
            <h4 className="font-black text-primary text-sm uppercase">
              1. User Agreement
            </h4>
            <p>
              You must be at least 18 years old to use this platform. All
              account information must be accurate and truthful.
            </p>
          </section>
          <section>
            <h4 className="font-black text-primary text-sm uppercase">
              2. Booking Policy
            </h4>
            <p>
              All bookings are subject to availability. Prices may fluctuate
              based on seasonal demand and local provider adjustments.
            </p>
          </section>
          <section>
            <h4 className="font-black text-primary text-sm uppercase">
              3. Cancellation
            </h4>
            <p>
              Cancellations must be made at least 72 hours before the scheduled
              departure to be eligible for a partial refund.
            </p>
          </section>
          <section>
            <h4 className="font-black text-primary text-sm uppercase">
              4. Code of Conduct
            </h4>
            <p>
              We maintain a zero-tolerance policy for harassment or illegal
              activities during our tours.
            </p>
          </section>
        </div>
      </Modal>

      <Modal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Privacy Policy"
      >
        <p className="font-bold text-base-content">
          Your privacy is our tactical priority. Here is how we handle your
          data:
        </p>
        <div className="space-y-4">
          <section>
            <h4 className="font-black text-primary text-sm uppercase">
              1. Data Collection
            </h4>
            <p>
              We collect your name, email, and travel preferences to provide a
              personalized experience.
            </p>
          </section>
          <section>
            <h4 className="font-black text-primary text-sm uppercase">
              2. Security Measures
            </h4>
            <p>
              All data is encrypted and stored in secure cloud environments.
            </p>
          </section>
          <section>
            <h4 className="font-black text-primary text-sm uppercase">
              3. Third-Party Sharing
            </h4>
            <p>
              We only share necessary information with our trusted travel
              partners (hotels, airlines) to facilitate your bookings.
            </p>
          </section>
          <section>
            <h4 className="font-black text-primary text-sm uppercase">
              4. Your Rights
            </h4>
            <p>
              You have the right to request access to or deletion of your
              personal data at any time via your account settings.
            </p>
          </section>
        </div>
      </Modal>
    </footer>
  );
};

export default Footer;
