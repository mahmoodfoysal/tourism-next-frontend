import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setBookingPackage } from "@/store/slices/bookingSlice";

/**
 * Interface defining the structure of a tourism package.
 */
interface PackageInfo {
  _id: string | number;
  package_id: string | number;
  image: string;
  title: string;
  duration: string;
  discount: string;
  location: string;
  features: string[];
  originalPrice: number | string;
  price: number | string;
}

interface PackageCardProps {
  info: PackageInfo;
}

const PackageCard: React.FC<PackageCardProps> = ({ info }) => {
  const dispatch = useDispatch();
  return (
    <div
      key={info.package_id}
      className="bg-base-100 rounded-[2.5rem] overflow-hidden border border-base-content/5 shadow-xl hover:shadow-2xl transition-all duration-500 group flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={info.image}
          alt={info.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <span className="bg-primary px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg">
            {info.duration}
          </span>
          <span className="bg-accent px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg">
            {info.discount}
          </span>
        </div>
        <div className="absolute bottom-6 left-6">
          <div className="flex items-center gap-1 glass-effect px-4 py-2 rounded-2xl text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-primary"
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
            </svg>
            <span className="text-xs font-bold uppercase tracking-wide">
              {info.location}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-black text-base-content mb-3 group-hover:text-primary transition-colors leading-tight">
          {info.title}
        </h3>

        {/* Features */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-2 mb-6">
          {info.features?.map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-base-content/60"
            >
              <div className="w-4 h-4 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-2.5 w-2.5 text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-[12px] font-bold truncate">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-5 border-t border-base-content/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-base-content/40 line-through font-black tracking-widest uppercase">
                ${info.originalPrice}
              </span>
              <span className="text-xl font-black text-primary tracking-tighter">
                ${info.price}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/booking?packageId=${info._id || info.package_id}`}
              onClick={() => dispatch(setBookingPackage(info))}
              className="flex-[1.5] btn btn-primary btn-sm rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-primary/20 h-10 min-h-0 border-none flex items-center justify-center"
            >
              Book Now
            </Link>
            <Link
              href={`/packages/details/${info._id}`}
              className="flex-1 btn btn-ghost btn-sm rounded-xl border border-base-content/10 font-black uppercase tracking-widest text-[9px] h-10 min-h-0 hover:bg-base-200 hover:border-transparent flex items-center justify-center"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
