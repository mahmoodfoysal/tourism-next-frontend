"use client"
import React, { useState } from 'react';

const CouponClaim = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubmitted(true);
            // In a real app, you would call an API here
        }
    };

    return (
        <section className="py-24 bg-base-200/30">
            <div className="section-container">
                <div className="relative overflow-hidden rounded-[3.5rem] bg-gradient-to-br from-primary via-primary/90 to-secondary shadow-2xl">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>
                    
                    <div className="relative z-10 px-8 py-20 lg:py-24 text-center max-w-4xl mx-auto">
                        {!isSubmitted ? (
                            <>
                                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-xs uppercase tracking-widest mb-8 border border-white/30">
                                    Special Summer Offer
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
                                    Get <span className="text-accent underline decoration-4 underline-offset-8">20% Discount</span> <br />
                                    On Your First Journey
                                </h2>
                                <p className="text-xl text-white/80 leading-relaxed mb-12 max-w-2xl mx-auto font-medium">
                                    Subscribe to our newsletter and claim your exclusive welcome coupon today. Start your adventure with Aura Trip.
                                </p>

                                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
                                    <div className="relative w-full sm:flex-1 group">
                                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/50 group-focus-within:text-white transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input 
                                            type="email" 
                                            placeholder="Enter your email address" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-lg font-medium"
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-primary font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
                                    >
                                        Claim Coupon
                                    </button>
                                </form>
                                <p className="mt-6 text-white/50 text-sm font-medium italic">
                                    * We promise not to spam. You can unsubscribe at any time.
                                </p>
                            </>
                        ) : (
                            <div className="animate-in fade-in zoom-in duration-700">
                                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/30 backdrop-blur-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Coupon Sent!</h2>
                                <p className="text-xl text-white/80 leading-relaxed mb-10 max-w-xl mx-auto">
                                    Check your inbox at <span className="text-white font-black underline">{email}</span>. We have sent your 20% discount code!
                                </p>
                                <button 
                                    onClick={() => setIsSubmitted(false)}
                                    className="btn btn-ghost text-white/60 hover:text-white border-white/20 hover:bg-white/10"
                                >
                                    Use another email
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Travel Related Icon Overlay */}
                    <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-80 w-80 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CouponClaim;