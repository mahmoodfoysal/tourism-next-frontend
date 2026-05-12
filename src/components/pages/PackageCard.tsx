import React from 'react';
import Image from 'next/image';

/**
 * Interface defining the structure of a tourism package.
 */
interface PackageInfo {
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
    return (
        <div key={info.package_id} className="bg-base-100 rounded-[2.5rem] overflow-hidden border border-base-content/5 shadow-xl hover:shadow-2xl transition-all duration-500 group flex flex-col">
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="text-xs font-bold uppercase tracking-wide">{info.location}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-black text-base-content mb-4 group-hover:text-primary transition-colors">
                    {info.title}
                </h3>
                
                {/* Features */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-8">
                    {info.features?.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-base-content/60">
                            <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium">{feature}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-6 border-t border-base-content/5 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-sm text-base-content/40 line-through font-bold">${info.originalPrice}</span>
                        <span className="text-3xl font-black text-primary">${info.price}</span>
                    </div>
                    <button className="btn btn-primary rounded-2xl px-8 shadow-lg shadow-primary/20">
                        Book Deal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PackageCard;
