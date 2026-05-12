import React from 'react';

const PopularDestinations = () => {
    const destinations = [
        {
            pop_id: 1,
            name: "Bora Bora",
            location: "French Polynesia",
            image: "https://images.unsplash.com/photo-1506929113614-bb93ce044a94?q=80&w=800&auto=format&fit=crop",
            price: 2499,
            rating: 4.9,
            badge: "Best Seller",
            shortDescription: "Experience crystal clear turquoise lagoons and luxury overwater villas.",
            longDescription: "Bora Bora is a small South Pacific island northwest of Tahiti in French Polynesia. Surrounded by sand-fringed motus and a turquoise lagoon protected by a coral reef, it’s known for its world-class scuba diving and iconic overwater bungalows."
        },
        {
            pop_id: 2,
            name: "Santorini",
            location: "Greece",
            image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop",
            price: 1899,
            rating: 4.8,
            badge: "Trending",
            shortDescription: "Iconic white-washed buildings and breathtaking sunset caldera views.",
            longDescription: "Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape. The giant, lagoon-edged caldera is overlooked by white, cubiform houses of Fira and Oia."
        },
        {
            pop_id: 3,
            name: "Kyoto",
            location: "Japan",
            image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
            price: 2100,
            rating: 4.9,
            badge: "Cultural",
            shortDescription: "Immerse yourself in traditional temples, zen gardens, and bamboo forests.",
            longDescription: "Kyoto, once the capital of Japan, is a city on the island of Honshu. It's famous for its numerous classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses. It’s also known for formal traditions such as kaiseki dining."
        },
        {
            pop_id: 4,
            name: "Swiss Alps",
            location: "Switzerland",
            image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=800&auto=format&fit=crop",
            price: 3200,
            rating: 5.0,
            badge: "Luxury",
            shortDescription: "World-class skiing and panoramic views in the heart of Europe.",
            longDescription: "The Alps are the highest and most extensive mountain range system that lies entirely in Europe, stretching approximately 1,200 km across eight Alpine countries. The Swiss portion offers unparalleled luxury ski resorts and summer hiking trails."
        },
        {
            pop_id: 5,
            name: "Bali",
            location: "Indonesia",
            image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop",
            price: 1250,
            rating: 4.7,
            badge: "Tropical",
            shortDescription: "Spiritual retreats, vibrant coral reefs, and lush jungle landscapes.",
            longDescription: "Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple. To the south, the beachside city of Kuta has lively bars."
        },
        {
            pop_id: 6,
            name: "Paris",
            location: "France",
            image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop",
            price: 1950,
            rating: 4.8,
            badge: "Romantic",
            shortDescription: "The city of light, world-class art galleries, and gourmet cuisine.",
            longDescription: "Paris, France's capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine. Beyond such landmarks as the Eiffel Tower."
        }
    ];

    return (
        <section className="py-24 bg-base-100">
            <div className="section-container">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                            Global Hotspots
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight">
                            Popular <span className="text-primary">Destinations</span>
                        </h2>
                        <p className="mt-4 text-lg text-base-content/60 leading-relaxed">
                            Discover our handpicked collection of the worlds most sought-after travel spots, from serene beaches to majestic mountains.
                        </p>
                    </div>
                    <button className="btn btn-outline border-base-content/10 hover:bg-primary hover:border-primary px-8 rounded-2xl hidden md:flex">
                        View All Places
                    </button>
                </div>

                {/* Destinations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map((dest) => (
                        <div key={dest.pop_id} className="group cursor-pointer">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl border border-base-content/5 transition-all duration-500 hover:shadow-primary/30">
                                {/* Image */}
                                <img 
                                    src={dest.image} 
                                    alt={dest.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>

                                {/* Badge */}
                                <div className="absolute top-5 left-5">
                                    <span className="glass-effect px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white border-white/20">
                                        {dest.badge}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500">
                                    <div className="flex items-center gap-1 text-accent mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(dest.rating) ? 'fill-current' : 'opacity-30'}`} viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                        <span className="text-white/90 text-sm font-bold ml-1">{dest.rating}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-0.5 group-hover:text-primary transition-colors">{dest.name}</h3>
                                    <div className="flex items-center gap-1 text-white/60 text-xs mb-3 font-medium">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {dest.location}
                                    </div>

                                    {/* Short Description */}
                                    <p className="text-sm text-white/80 line-clamp-2 mb-6 leading-relaxed">
                                        {dest.shortDescription}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <div className="text-white">
                                            <span className="text-xl font-black text-primary">${dest.price}</span>
                                            <span className="text-xs opacity-60 ml-1">/ person</span>
                                        </div>
                                        <button className="btn btn-primary btn-sm rounded-xl px-4 normal-case border-none font-bold">
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularDestinations;