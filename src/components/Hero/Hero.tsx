"use client";

import React, { useState, useEffect } from 'react';

const Hero = () => {
    const images = [
        "https://images.unsplash.com/photo-1524467128837-00f6644866d7?q=100&w=2560&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=100&w=2560&auto=format&fit=crop",
        "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?q=100&w=2560&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=100&w=2560&auto=format&fit=crop"
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
            {/* Background Images with Cross-fade */}
            <div className="absolute inset-0 z-0">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center bg-no-repeat ${
                            index === currentImageIndex ? 'opacity-90' : 'opacity-0'
                        }`}
                        style={{ backgroundImage: `url('${image}')` }}
                    />
                ))}
                {/* Theme-aware overlay */}
                <div className="absolute inset-0 hero-overlay-custom backdrop-blur-[2px]"></div>
            </div>

            <div className="section-container relative z-10 flex flex-col items-center justify-center text-center py-16 lg:py-24">
                <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-white font-bold text-xs uppercase tracking-widest backdrop-blur-xl border border-primary/20 dark:border-white/20 shadow-xl">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Start Your Adventure
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-base-content leading-[1.1] drop-shadow-sm">
                        Journey Beyond <br />
                        <span className="text-primary">Imagination</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-base-content/80 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-medium">
                        Discover the worlds most exotic destinations with our curated premium travel packages. Your next great story starts here.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-2">
                        <button className="btn btn-primary btn-lg rounded-2xl px-10 shadow-2xl shadow-primary/30 hover:scale-105 transition-all duration-300 border-none h-14">
                            Explore Now
                        </button>
                        <button className="btn btn-ghost btn-lg rounded-2xl px-10 border-base-content/30 text-base-content hover:bg-base-content/10 backdrop-blur-md transition-all duration-300 h-14 shadow-lg">
                            Watch Story
                        </button>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 md:gap-16 pt-12 max-w-2xl mx-auto border-t border-base-content/10">
                        {[
                            { label: 'Destinations', value: '150+' },
                            { label: 'Happy Travelers', value: '25k+' },
                            { label: 'Experience', value: '12 Years' }
                        ].map((stat) => (
                            <div key={stat.label} className="space-y-1">
                                <div className="text-2xl md:text-4xl font-black text-base-content tabular-nums drop-shadow-sm">{stat.value}</div>
                                <div className="text-[10px] md:text-xs text-base-content/50 uppercase tracking-[0.2em] font-bold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
