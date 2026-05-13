import React from "react";

interface BookingItem {
  _id: string;
  full_name: string;
  email: string;
  phone_no: string;
  passport_no: string;
  full_address: string;
  country: string;
  joining_date: string;
  person: number;
  sub_total?: number;
  tax_total: number;
  service_charge: number;
  grand_total: number;
  order_status: string;
  package_info: {
    package_id: string | number;
    title: string;
    price: number;
    image: string;
  };
  createdAt: string;
}

const Invoice = ({ selectedBooking }: { selectedBooking: BookingItem }) => {
  return (
    <div className="print-only-manifest hidden p-8 font-sans text-black bg-white">
      <div className="border-4 border-black p-8 relative min-h-[24cm] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start border-b-4 border-black pb-8 mb-10">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
              AuraTrip
              <br />
              <span className="text-2xl font-bold">Executive Travel</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-gray-500">
              Official Strategic Document
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black uppercase">Voyage Manifest</h2>
            <p className="text-sm font-bold tracking-widest mt-1">
              ARCHIVAL REF: VOY-
              {new Date(selectedBooking.createdAt)
                .getTime()
                .toString()
                .slice(-6)}
            </p>
            <div className="mt-4 p-2 bg-black text-white text-[10px] font-black uppercase tracking-widest">
              Status:{" "}
              {selectedBooking.order_status === "C"
                ? "Confirmed"
                : "Authorized"}
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-2 gap-10 mb-12">
          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-black uppercase border-b-2 border-black pb-1 mb-4">
                Traveler Identity
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[8px] font-bold uppercase text-gray-400">
                    Lead Voyager
                  </p>
                  <p className="text-sm font-black uppercase">
                    {selectedBooking.full_name}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-bold uppercase text-gray-400">
                    Passport Number
                  </p>
                  <p className="text-sm font-bold">
                    {selectedBooking.passport_no}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-bold uppercase text-gray-400">
                    Digital Signature / Email
                  </p>
                  <p className="text-sm font-bold">{selectedBooking.email}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold uppercase text-gray-400">
                    Primary Contact
                  </p>
                  <p className="text-sm font-bold">
                    {selectedBooking.phone_no}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-black uppercase border-b-2 border-black pb-1 mb-4">
                Registered Residency
              </h3>
              <p className="text-xs font-bold leading-relaxed">
                {selectedBooking.full_address}, {selectedBooking.country}
              </p>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-black uppercase border-b-2 border-black pb-1 mb-4">
                Expedition Specs
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[8px] font-bold uppercase text-gray-400">
                    Deployment Date
                  </p>
                  <p className="text-sm font-black">
                    {new Date(selectedBooking.joining_date).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-bold uppercase text-gray-400">
                    Tour Package
                  </p>
                  <p className="text-sm font-black uppercase">
                    {selectedBooking.package_info.title}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-bold uppercase text-gray-400">
                    Group Size
                  </p>
                  <p className="text-sm font-black">
                    {selectedBooking.person} Voyagers
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-black uppercase border-b-2 border-black pb-1 mb-4">
                Financial Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>Base Value</span>
                  <span>${selectedBooking.sub_total?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span>Strategic Tax (10%)</span>
                  <span>${selectedBooking.tax_total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span>Service Premium</span>
                  <span>${selectedBooking.service_charge.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-black pt-2 mt-2 flex justify-between items-baseline">
                  <span className="text-xs font-black uppercase">
                    Grand Total
                  </span>
                  <span className="text-2xl font-black tracking-tighter">
                    ${selectedBooking.grand_total.toFixed(2)}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Verification Section */}
        <div className="mt-auto pt-10 border-t-4 border-black grid grid-cols-3 gap-8 items-end">
          <div>
            <p className="text-[8px] font-bold uppercase text-gray-400 mb-6">
              Authorized Signature
            </p>
            <div className="border-b border-black w-full h-8"></div>
            <p className="text-[8px] font-black uppercase mt-2">
              AuraTrip Executive Concierge
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-24 h-24 border-2 border-black flex items-center justify-center p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-black"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z"
                  clipRule="evenodd"
                />
                <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2H10a1 1 0 01-1-1zM7 11a1 1 0 100-2H6a1 1 0 100 2h1zM11 13a1 1 0 100-2H9v1a1 1 0 001 1h1zM14 14a1 1 0 100-2h-1v1a1 1 0 001 1h1zM16 15a1 1 0 100 2h1a1 1 0 100-2h-1zM12 15a1 1 0 110 2h-1v-1a1 1 0 011-1zM10 16a1 1 0 100 2h1a1 1 0 100-2h-1zM8 17a1 1 0 100-2H6a1 1 0 100 2h2zM14 17a1 1 0 100-2h-2v1a1 1 0 001 1h1z" />
              </svg>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-bold uppercase text-gray-400">
              Issue Date & Archival Code
            </p>
            <p className="text-[10px] font-black">
              {new Date().toLocaleDateString()} /{" "}
              {new Date(selectedBooking.createdAt)
                .getTime()
                .toString()
                .slice(-6)
                .toUpperCase()}
            </p>
          </div>
        </div>

        {/* Subtle Disclaimer Footer */}
        <div className="absolute bottom-4 left-8 right-8 text-center">
          <p className="text-[7px] font-bold uppercase tracking-[0.3em] text-gray-300">
            This manifest is a legal proof of reservation. All voyages are
            subject to AuraTrip Executive Terms & Conditions. Secure Archive ID:{" "}
            {selectedBooking._id}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
