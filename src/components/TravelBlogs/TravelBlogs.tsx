import React from 'react';

const TravelBlogs = () => {
    const blogs = [
        {
            id: 1,
            title: "10 Essential Tips for Solo Travelers in 2024",
            excerpt: "Discover how to stay safe and make the most of your solo journey with these expert tips...",
            image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=800&auto=format&fit=crop",
            date: "May 10, 2024",
            author: "Alex Rivera",
            category: "Travel Tips"
        },
        {
            id: 2,
            title: "Exploring the Hidden Temples of Southeast Asia",
            excerpt: "Join us as we trek through remote jungles to find ancient ruins forgotten by time...",
            image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&auto=format&fit=crop",
            date: "May 08, 2024",
            author: "Sarah Jenkins",
            category: "Adventure"
        },
        {
            id: 3,
            title: "The Ultimate Guide to Sustainable Tourism",
            excerpt: "Learn how you can reduce your carbon footprint while exploring the world's beauty...",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=800&auto=format&fit=crop",
            date: "May 05, 2024",
            author: "David Chen",
            category: "Eco Travel"
        }
    ];

    return (
        <section className="py-24 bg-base-200/30">
            <div className="section-container">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-xs uppercase tracking-widest mb-4">
                            Latest Articles
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight">
                            Travel <span className="text-secondary">Insights</span>
                        </h2>
                        <p className="mt-4 text-lg text-base-content/60 leading-relaxed">
                            Stay updated with the latest travel trends, hidden gems, and expert advice from our professional explorers.
                        </p>
                    </div>
                    <button className="btn btn-ghost border-base-content/10 hover:bg-secondary hover:text-white px-8 rounded-2xl hidden md:flex font-bold">
                        View All Blogs
                    </button>
                </div>

                {/* Blogs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="group flex flex-col bg-base-100 rounded-[2.5rem] overflow-hidden border border-base-content/5 shadow-xl hover:shadow-2xl transition-all duration-500">
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img 
                                    src={blog.image} 
                                    alt={blog.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-6 left-6">
                                    <span className="bg-secondary px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                                        {blog.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-3 mb-4 text-sm text-base-content/40 font-bold">
                                    <span>{blog.date}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/30"></span>
                                    <span>By {blog.author}</span>
                                </div>
                                
                                <h3 className="text-2xl font-black text-base-content mb-4 group-hover:text-secondary transition-colors leading-tight">
                                    {blog.title}
                                </h3>
                                
                                <p className="text-base-content/60 leading-relaxed mb-8 flex-1">
                                    {blog.excerpt}
                                </p>

                                <div className="pt-6 border-t border-base-content/5 mt-auto">
                                    <button className="flex items-center gap-2 text-secondary font-black group-hover:gap-4 transition-all">
                                        Read Full Article
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TravelBlogs;