import React from "react";

const FAQ = () => {
  const faqs = [
    {
      id: 1,
      question: "How do I book a tour with Aura Trip?",
      answer:
        "Booking is simple! You can browse our destinations or packages, select your preferred dates, and click 'Book Now'. You can also contact our 24/7 support team for personalized assistance with your reservation.",
    },
    {
      id: 2,
      question: "What is your cancellation policy?",
      answer:
        "We offer flexible cancellation policies. For most packages, you can cancel up to 72 hours before departure for a full refund. Specific terms may vary based on the destination and seasonal demand.",
    },
    {
      id: 3,
      question: "Are your tours family-friendly?",
      answer:
        "Absolutely! We specialize in family travel and offer specific packages designed with kids in mind, including child-friendly accommodations, educational tours, and plenty of fun activities for all ages.",
    },
    {
      id: 4,
      question: "Do you provide travel insurance?",
      answer:
        "Yes, we highly recommend travel insurance and offer several comprehensive plans that cover medical emergencies, trip cancellations, and lost luggage to give you total peace of mind during your journey.",
    },
    {
      id: 5,
      question: "Can I customize a travel package?",
      answer:
        "We love creating unique experiences! You can work with our travel experts to customize any existing package or build a completely new itinerary from scratch based on your interests and budget. Please contact with us",
    },
  ];

  return (
    <section className="py-24 bg-base-100">
      <div className="section-container">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Side: Header */}
          <div className="lg:w-1/3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent font-bold text-xs uppercase tracking-widest mb-4">
              Need Help?
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-base-content tracking-tight mb-6">
              Frequently Asked <br />
              <span className="text-primary">Questions</span>
            </h2>
            <p className="text-base text-base-content/60 leading-relaxed mb-10">
              Everything you need to know about our tours, bookings, and
              policies. Cant find the answer? Feel free to reach out.
            </p>

            <div className="p-8 rounded-3xl bg-base-200/50 border border-base-content/5">
              <h4 className="text-lg font-black text-base-content mb-2">
                Still have questions?
              </h4>
              <p className="text-sm text-base-content/50 mb-6">
                Our support team is here to help you 24 hours a day, 7 days a
                week.
              </p>
              <button className="btn btn-primary rounded-2xl px-8 w-full shadow-lg shadow-primary/20 text-xs uppercase font-black tracking-widest">
                Contact Support
              </button>
            </div>
          </div>

          {/* Right Side: Accordion */}
          <div className="lg:w-2/3 space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="collapse collapse-plus bg-base-200/50 border border-base-content/5 rounded-3xl group transition-all duration-300 hover:bg-base-200"
              >
                <input
                  type="radio"
                  name="my-accordion-3"
                  defaultChecked={index === 0}
                />
                <div className="collapse-title text-lg font-black text-base-content px-8 py-5 group-hover:text-primary transition-colors">
                  {faq.question}
                </div>
                <div className="collapse-content px-8 pb-6">
                  <p className="text-sm text-base-content/60 leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
