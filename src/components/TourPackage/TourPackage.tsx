import React from 'react';

const TourPackage = () => {
    const packages = [
        {
            id: 1,
            title: "Ultimate Island Paradise",
            duration: "7 Days / 6 Nights",
            location: "Maldives",
            image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop",
            price: 4500,
            originalPrice: 5200,
            features: ["Luxury Resort", "All Meals", "Water Sports", "Private Cruise"],
            discount: "15% OFF"
        },
        {
            id: 2,
            title: "Historic Europe Tour",
            duration: "10 Days / 9 Nights",
            location: "Italy & France",
            image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800&auto=format&fit=crop",
            price: 3800,
            originalPrice: 4100,
            features: ["City Guided Tours", "Hotels", "Train Travel", "Breakfast"],
            discount: "HOT DEAL"
        },
        {
            id: 3,
            title: "Nature & Wildlife Safaris",
            duration: "5 Days / 4 Nights",
            location: "Kenya",
            image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop",
            price: 2900,
            originalPrice: 3500,
            features: ["Wilderness Lodge", "Safari Jeep", "Local Guide", "Airport Pick"],
            discount: "20% OFF"
        }
    ];

    return (
        <section className="py-24 bg-base-200/30">
            <div className="section-container">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-xs uppercase tracking-widest mb-4">
                        Exclusive Deals
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight mb-6">
                        Amazing <span className="text-secondary">Tour Packages</span>
                    </h2>
                    <p className="text-lg text-base-content/60 leading-relaxed">
                        Choose from our curated selection of all-inclusive packages designed to provide the ultimate travel experience without any hassle.
                    </p>
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="bg-base-100 rounded-[2.5rem] overflow-hidden border border-base-content/5 shadow-xl hover:shadow-2xl transition-all duration-500 group flex flex-col">
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <img 
                                    src={pkg.image} 
                                    alt={pkg.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                    <span className="bg-primary px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg">
                                        {pkg.duration}
                                    </span>
                                    <span className="bg-accent px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg">
                                        {pkg.discount}
                                    </span>
                                </div>
                                <div className="absolute bottom-6 left-6">
                                    <div className="flex items-center gap-1 glass-effect px-4 py-2 rounded-2xl text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        <span className="text-xs font-bold uppercase tracking-wide">{pkg.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-1">
                                <h3 className="text-2xl font-black text-base-content mb-4 group-hover:text-primary transition-colors">
                                    {pkg.title}
                                </h3>
                                
                                {/* Features */}
                                <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-8">
                                    {pkg.features.map((feature, i) => (
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
                                        <span className="text-sm text-base-content/40 line-through font-bold">${pkg.originalPrice}</span>
                                        <span className="text-3xl font-black text-primary">${pkg.price}</span>
                                    </div>
                                    <button className="btn btn-primary rounded-2xl px-8 shadow-lg shadow-primary/20">
                                        Book Deal
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* View All Bottom CTA */}
                <div className="mt-20 text-center">
                    <p className="text-base-content/50 font-medium mb-6 italic">Want something different? We can create a custom package for you!</p>
                    <button className="btn btn-outline border-base-content/10 rounded-2xl px-12 hover:bg-secondary hover:border-secondary">
                        Explore All Packages
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TourPackage;
