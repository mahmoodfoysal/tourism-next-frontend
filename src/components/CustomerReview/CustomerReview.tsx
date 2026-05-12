import React from 'react';

const CustomerReview = () => {
    const reviews = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Adventure Enthusiast",
            image: "https://i.pravatar.cc/150?u=sarah",
            rating: 5,
            review: "Aura Trip made our honeymoon absolutely perfect. The attention to detail and the local guides were beyond our expectations. Truly a once-in-a-lifetime experience!",
            destination: "Maldives"
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Photography Hobbyist",
            image: "https://i.pravatar.cc/150?u=michael",
            rating: 5,
            review: "The photography tour in Kyoto was incredible. Our guide knew all the secret spots for the best shots. I've never seen such beautiful landscapes in my life.",
            destination: "Kyoto, Japan"
        },
        {
            id: 3,
            name: "Elena Rodriguez",
            role: "Family Traveler",
            image: "https://i.pravatar.cc/150?u=elena",
            rating: 4,
            review: "Traveling with three kids isn't easy, but the team at Aura Trip handled everything. The Swiss Alps family package was seamless and so much fun for the little ones.",
            destination: "Swiss Alps"
        }
    ];

    return (
        <section className="py-24 bg-base-100">
            <div className="section-container">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                        Testimonials
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight mb-6">
                        What Our <span className="text-primary">Travelers Say</span>
                    </h2>
                    <p className="text-lg text-base-content/60 leading-relaxed">
                        Dont just take our word for it. Read about the unforgettable journeys and experiences shared by our global community of adventurers.
                    </p>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="relative group">
                            {/* Quote Icon Background */}
                            <div className="absolute -top-4 -right-4 text-primary opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11M3.01704 21L3.01704 18C3.01704 16.8954 3.91243 16 5.01704 16H8.01704C8.56933 16 9.01704 15.5523 9.01704 15V9C9.01704 8.44772 8.56933 8 8.01704 8H4.01704C3.46476 8 3.01704 8.44772 3.01704 9V11" />
                                </svg>
                            </div>

                            <div className="bg-base-200/50 p-8 rounded-[2.5rem] border border-base-content/5 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                                {/* Stars */}
                                <div className="flex items-center gap-1 text-accent mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < review.rating ? 'fill-current' : 'opacity-20'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>

                                {/* Review Text */}
                                <p className="text-base-content/80 text-lg italic leading-relaxed mb-8 flex-1">
                                    {review.review}
                                </p>

                                {/* User Info */}
                                <div className="flex items-center gap-4 pt-6 border-t border-base-content/5">
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg">
                                        <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-base-content">{review.name}</h4>
                                        <div className="text-sm text-base-content/50 font-bold uppercase tracking-wider">{review.role}</div>
                                        <div className="flex items-center gap-1 text-primary text-[10px] font-bold mt-1 uppercase">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4" />
                                            </svg>
                                            Verified Trip to {review.destination}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Stats */}
                <div className="mt-20 py-12 rounded-[3rem] bg-gradient-to-r from-primary/10 via-base-200 to-secondary/10 border border-base-content/5 flex flex-wrap justify-around gap-10 items-center px-8 text-center">
                    <div>
                        <div className="text-4xl font-black text-primary mb-1">4.9/5</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-base-content/50">Average Rating</div>
                    </div>
                    <div className="w-px h-12 bg-base-content/10 hidden md:block"></div>
                    <div>
                        <div className="text-4xl font-black text-secondary mb-1">10k+</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-base-content/50">Verified Reviews</div>
                    </div>
                    <div className="w-px h-12 bg-base-content/10 hidden md:block"></div>
                    <div>
                        <div className="text-4xl font-black text-accent mb-1">98%</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-base-content/50">Recommendation Rate</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomerReview;