import Hero from "@/components/Hero/Hero";
import PopularDestinations from "@/components/PopularDestinations/PopularDestinations";
import TourPackage from "@/components/TourPackage/TourPackage";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import TravelGallary from "@/components/TravelGallary/TravelGallary";
import CustomerReview from "@/components/CustomerReview/CustomerReview";
import TravelBlogs from "@/components/TravelBlogs/TravelBlogs";
import FAQ from "@/components/FAQ/FAQ";
import CouponClaim from "@/components/CouponClaim/CouponClaim";

export default function Home() {
  return (
    <>
      <Hero />
      <PopularDestinations />
      <TourPackage />
      <WhyChooseUs />
      <TravelGallary />
      <CustomerReview />
      <TravelBlogs />
      <FAQ />
      <CouponClaim />
    </>
  );
}
