"use client";

import Hero from "@/components/Hero/Hero";
import PopularDestinations from "@/components/PopularDestinations/PopularDestinations";
import TourPackage from "@/components/TourPackage/TourPackage";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import TravelGallary from "@/components/TravelGallary/TravelGallary";
import CustomerReview from "@/components/CustomerReview/CustomerReview";
import TravelBlogs from "@/components/TravelBlogs/TravelBlogs";
import FAQ from "@/components/FAQ/FAQ";
import CouponClaim from "@/components/CouponClaim/CouponClaim";
import { useEffect, useState } from "react";
import { axiosPublic } from "@/hooks/useAxiosPublic";

export interface PackageInfo {
  _id: string | number;
  package_id: string | number;
  image: string;
  title: string;
  duration: string;
  category: string;
  discount: number | string;
  location: string;
  features: string[];
  originalPrice: number;
  price: number;
  status: number;
  is_popular: number;
}

export default function Home() {
  const [packageList, setPackageList] = useState<PackageInfo[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axiosPublic.get("/api/tourism/get-package-list");
        const data = response.data?.list_data;
        const result = Array.isArray(data) ? data : data?.data || [];
        setPackageList(result);
      } catch (error) {
        console.error("Error fetching tour packages:", error);
      } finally {
        setLoadingPackages(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <>
      <Hero />
      <PopularDestinations
        packageList={packageList}
        loading={loadingPackages}
      />
      <TourPackage packageList={packageList} loading={loadingPackages} />
      <WhyChooseUs />
      <TravelGallary />
      <CustomerReview />
      <TravelBlogs />
      <FAQ />
      <CouponClaim />
    </>
  );
}
