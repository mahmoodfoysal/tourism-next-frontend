import React from "react";
import Image from "next/image";

const TravelGallary = () => {
  const photos = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
      span: "col-span-1 row-span-1",
      category: "Beaches",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop",
      span: "col-span-1 lg:col-span-2 row-span-1 lg:row-span-2",
      category: "Adventure",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop",
      span: "col-span-1 row-span-1",
      category: "Mountains",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
      span: "col-span-1 row-span-1",
      category: "Culture",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop",
      span: "col-span-1 row-span-1",
      category: "Nightlife",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1440778303588-435521a205bc?q=80&w=800&auto=format&fit=crop",
      span: "col-span-1 lg:col-span-2 row-span-1",
      category: "Relaxation",
    },
  ];

  return (
    <section className="py-24 bg-base-200/50">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">
              Visual Journey
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight mb-6">
              Travel <span className="text-primary">Gallery</span>
            </h2>
            <p className="text-lg text-base-content/60 leading-relaxed">
              Explore the beauty of the world through our lens. A collection of
              unforgettable moments from our travelers.
            </p>
          </div>
          <button className="btn btn-primary rounded-2xl px-8 h-14 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px] hidden md:flex items-center">
            View All Photos
          </button>
        </div>

        {/* Mosaic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[250px]">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`group relative overflow-hidden rounded-[2rem] shadow-xl ${photo.span}`}
            >
              <Image
                src={photo.url}
                alt={photo.category}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-125"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {photo.category}
                </span>
                <h3 className="text-white text-xl font-black transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  Unforgettable Moments
                </h3>
              </div>

              {/* Corner Accent */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white">
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
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Style Footer */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 border-t border-base-content/5 pt-16">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full border-4 border-base-100 overflow-hidden shadow-lg relative"
              >
                <Image
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  alt="user"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            ))}
          </div>
          <div className="text-center md:text-left">
            <div className="text-lg font-black text-base-content">
              Join 25,000+ happy travelers
            </div>
            <div className="text-sm text-base-content/60 font-medium">
              Follow us on Instagram{" "}
              <span className="text-primary font-bold cursor-pointer">
                @Aura Trip
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelGallary;
