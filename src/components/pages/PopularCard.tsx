import React from 'react';
import Image from 'next/image';

interface PopularCardProps {
    info: {
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
        <div key={info.pop_id} className="group cursor-pointer">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl border border-base-content/5 transition-all duration-500 hover:shadow-primary/30">
                {/* Image */}
                <Image 
                    src={info.image} 
                    alt={info.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>

                {/* Badge */}
                <div className="absolute top-5 left-5">
                    <span className="glass-effect px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white border-white/20">
                        {info.badge}
                    </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500">
                    <div className="flex items-center gap-1 text-accent mb-2">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(info.rating) ? 'fill-current' : 'opacity-30'}`} viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                        <span className="text-white/90 text-sm font-bold ml-1">{info.rating}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-0.5 group-hover:text-primary transition-colors">{info.name}</h3>
                    <div className="flex items-center gap-1 text-white/60 text-xs mb-3 font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {info.location}
                    </div>

                    {/* Short Description */}
                    <p className="text-sm text-white/80 line-clamp-2 mb-6 leading-relaxed">
                        {info.shortDescription}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="text-white">
                            <span className="text-xl font-black text-primary">${info.price}</span>
                            <span className="text-xs opacity-60 ml-1">/ person</span>
                        </div>
                        <button className="btn btn-primary btn-sm rounded-xl px-4 normal-case border-none font-bold">
                            Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopularCard;