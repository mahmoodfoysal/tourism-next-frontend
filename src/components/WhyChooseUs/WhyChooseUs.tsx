import React from "react";

const WhyChooseUs = () => {
  const benefits = [
    {
      id: 1,
      title: "Expert Local Guides",
      description:
        "Our guides are certified experts with deep knowledge of local culture and hidden gems.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      color: "primary",
    },
    {
      id: 2,
      title: "Safe & Secure Travel",
      description:
        "Your safety is our top priority. We provide 24/7 emergency support and insurance options.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      color: "secondary",
    },
    {
      id: 3,
      title: "Flexible Booking",
      description:
        "Life happens. Change your dates or cancel with ease thanks to our flexible booking policies.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      color: "accent",
    },
    {
      id: 4,
      title: "Best Price Guarantee",
      description:
        "We work directly with local partners to bring you the best prices without compromising quality.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "primary",
    },
  ];

  return (
    <section className="py-24 bg-base-100 overflow-hidden">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent font-bold text-xs uppercase tracking-widest mb-4">
              Our Distinction
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight mb-6">
              Why Choose <span className="text-primary">Aura Trip?</span>
            </h2>
            <p className="text-lg text-base-content/60 leading-relaxed">
              With over a decade of expertise, we turn your travel dreams into
              reality with personalized service and attention to every detail.
            </p>
          </div>
          <button className="btn btn-primary rounded-2xl px-8 h-14 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px] hidden md:flex items-center">
            Learn More About Us
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="group p-8 rounded-[2.5rem] bg-base-200 border border-base-content/5 hover:bg-base-100 transition-all duration-300 hover:shadow-xl text-center flex flex-col items-center shadow-md"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg 
                                ${
                                  benefit.color === "primary"
                                    ? "bg-primary/20 text-primary"
                                    : benefit.color === "secondary"
                                      ? "bg-secondary/20 text-secondary"
                                      : "bg-accent/20 text-accent"
                                }`}
              >
                {benefit.icon}
              </div>
              <h3 className="text-xl font-black text-base-content mb-3">
                {benefit.title}
              </h3>
              <p className="text-sm text-base-content/60 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
