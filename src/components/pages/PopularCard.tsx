import React from "react";
import Image from "next/image";
import Link from "next/link";

interface PopularCardProps {
  info: {
    _id: string | number;
    pop_id: string | number;
    image: string;
    name: string;
    location: string;
    price: number;
    rating: number;
    badge: string;
    shortDescription: string;
    longDescription: string;
    moreImage: string[];
    status: number;
    discount: string;
    itinerary: { day: number; title: string; activities: string[] }[];
    bestTimeToVisit: string;
    nearbyAttractions: string[];
  };
}

const PopularCard: React.FC<PopularCardProps> = ({ info }) => {
  return (
    <div
      key={info.pop_id}
      className="group flex flex-col bg-base-100 rounded-[2.5rem] overflow-hidden border border-base-content/5 shadow-xl hover:shadow-2xl transition-all duration-500 h-full"
    >
      {/* Image Section */}
      <div className="relative h-72 overflow-hidden">
        <Image
          src={info.image}
          alt={info.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Floating Badge */}
        <div className="absolute top-5 left-5">
          <span className="bg-primary/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20">
            {info.badge}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute top-5 right-5">
          <div className="bg-base-100/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex flex-col items-end border border-white/10">
            <span className="text-[10px] font-black uppercase text-base-content/30 tracking-tighter leading-none">
              From
            </span>
            <span className="text-lg font-black text-primary leading-none mt-1">
              ${info.price}
            </span>
          </div>
        </div>

        {/* Rating Floating */}
        <div className="absolute bottom-5 left-5">
          <div className="flex items-center gap-1.5 glass-effect px-3 py-1.5 rounded-xl text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-yellow-400 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-black">{info.rating}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-base-content/40 text-[10px] font-black uppercase tracking-widest mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
          </svg>
          {info.location}
        </div>

        <h3 className="text-lg font-black text-base-content mb-3 group-hover:text-primary transition-colors leading-tight">
          {info.name}
        </h3>

        <p className="text-[13px] text-base-content/50 leading-relaxed mb-6 flex-1 line-clamp-3">
          {info.shortDescription}
        </p>

        <div className="pt-6 border-t border-base-content/5 mt-auto flex items-center justify-between">
          <div className="flex -space-x-2">
            {info.moreImage.slice(0, 3).map((img, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-base-100 overflow-hidden relative shadow-sm"
              >
                <Image src={img} alt="explorer" fill className="object-cover" />
              </div>
            ))}
            {info.moreImage.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center border-2 border-base-100 shadow-sm">
                +{info.moreImage.length - 3}
              </div>
            )}
          </div>

          <Link
            href={`/destinations/details/${info._id}`}
            className="flex items-center gap-2 text-primary text-[11px] font-black uppercase tracking-widest group-hover:gap-3 transition-all"
          >
            Explore Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PopularCard;
