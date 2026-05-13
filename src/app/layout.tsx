import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/shared/NavBar/NavBar";
import Footer from "@/components/shared/Footer/Footer";
import ReduxProvider from "@/store/ReduxProvider";
import NextTopLoader from "nextjs-toploader";
import ScrollToTop from "@/components/shared/ScrollToTop/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aura Trip | Premium Travel & Tourism Experiences",
  description: "Discover the world's most beautiful destinations with Aura Trip. Tailored travel packages, flight bookings, and luxury hotel reservations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextTopLoader color="#38bdf8" showSpinner={false} height={3} shadow="0 0 10px #38bdf8,0 0 5px #38bdf8" />
        <ReduxProvider>
          <NavBar />
          {children}
          <Footer />
          <ScrollToTop />
        </ReduxProvider>
        </body>
    </html>
  );
}
