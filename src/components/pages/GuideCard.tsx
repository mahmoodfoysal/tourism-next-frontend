import React from "react";
import Link from "next/link";

/**
 * Interface defining the structure of a tour guide profile.
 */
export interface GuideInfo {
  _id: string | number;
  name: string;
  image: string;
  experience: number;
  languages: string[];
  specialty: string;
  rating: number;
  shortDescription: string;
  destination: string;
  tour_type: string;
  benefits: string[];
  details: {
    bio: string;
    longDescription: string;
    education: string;
    certificates: string[];
    totalTours: number;
    joinedDate: string;
  };
  status: number;
}

interface GuideCardProps {
  guide: GuideInfo;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide }) => {
  return (
    <div className="bg-base-100 rounded-[2.5rem] overflow-hidden border border-base-content/5 shadow-xl hover:shadow-2xl transition-all duration-500 group flex flex-col h-full hover:-translate-y-2">
      {/* Profile Image Container */}
      <div className="relative h-56 overflow-hidden">
        <Link
          href={`/travel-guides/details/${guide._id}`}
          className="block w-full h-full"
        >
          <img
            src={guide.image}
            alt={guide.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        {/* Rating Badge */}
        <div className="absolute top-6 right-6">
          <div className="flex items-center gap-1.5 glass-effect px-4 py-2 rounded-2xl text-white shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-yellow-400 fill-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="text-sm font-black">{guide.rating}</span>
          </div>
        </div>
        {/* Specialty Tag */}
        <div className="absolute bottom-6 left-6">
          <span className="bg-primary/90 backdrop-blur-md px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
            {guide.specialty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-3">
          <Link href={`/travel-guides/details/${guide._id}`}>
            <h3 className="text-xl font-black text-base-content group-hover:text-primary transition-colors leading-tight mb-1 line-clamp-1 cursor-pointer">
              {guide.name}
            </h3>
          </Link>
          <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">
            {guide.experience}+ Years Experience
          </p>
        </div>

        <p className="text-xs text-base-content/60 leading-relaxed font-medium mb-4 line-clamp-2 min-h-[2rem]">
          {guide.shortDescription}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-2 mb-6">
          <div className="flex items-center gap-2.5 text-base-content/70">
            <div className="w-7 h-7 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
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
                  strokeWidth="2"
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
            </div>
            <span className="text-[10px] font-bold truncate">
              {guide.languages.join(", ")}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-base-content/70">
            <div className="w-7 h-7 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
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
            </div>
            <span className="text-[10px] font-bold truncate">
              {guide.destination}
            </span>
          </div>
        </div>

        {/* Benefits Badges */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {guide.benefits?.slice(0, 4).map((benefit, idx) => {
            const getIcon = (title: string) => {
              const lowerTitle = title.toLowerCase();
              if (lowerTitle.includes("local"))
                return (
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
                );
              if (lowerTitle.includes("safe"))
                return (
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                );
              if (lowerTitle.includes("support"))
                return (
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                );
              if (
                lowerTitle.includes("professional") ||
                lowerTitle.includes("exp")
              )
                return (
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
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                );
              if (lowerTitle.includes("eco"))
                return (
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
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"
                    />
                  </svg>
                );
              return (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              );
            };

            const getColor = (title: string) => {
              const lowerTitle = title.toLowerCase();
              if (lowerTitle.includes("local")) return "primary";
              if (lowerTitle.includes("safe")) return "secondary";
              if (lowerTitle.includes("support")) return "accent";
              if (lowerTitle.includes("eco")) return "primary";
              return "secondary";
            };

            return (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-base-200/50 border border-base-content/5 group-hover:bg-base-200 transition-colors"
              >
                <div className={`text-${getColor(benefit)}`}>
                  {getIcon(benefit)}
                </div>
                <span className="text-[8px] font-black uppercase tracking-tight text-base-content/60 truncate">
                  {benefit}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-auto pt-5 border-t border-base-content/5">
          <Link
            href={`/travel-guides/details/${guide._id}`}
            className="btn btn-primary btn-sm w-full rounded-xl h-11 shadow-lg shadow-primary/20 transition-all active:scale-95 group/btn overflow-hidden relative"
          >
            <span className="relative z-10 font-black uppercase tracking-widest text-xs text-primary-content">
              View Details
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuideCard;
