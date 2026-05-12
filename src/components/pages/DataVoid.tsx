import React from "react";

interface DataVoidProps {
  onReset?: () => void;
}

const DataVoid: React.FC<DataVoidProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 bg-gradient-to-br from-base-200/50 to-transparent rounded-[3.5rem] border border-dashed border-base-content/10 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150"></div>
        <div className="relative w-24 h-24 bg-base-100 rounded-[2rem] flex items-center justify-center shadow-xl border border-base-content/5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-primary/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6"
              className="text-error/30"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-3xl font-black text-base-content mb-3 tracking-tight">
        Data Void
      </h3>
      <p className="text-base-content/40 font-medium max-w-sm mb-10 text-sm">
        No matching destinations found in our current database.
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="btn btn-primary rounded-2xl px-10 shadow-lg shadow-primary/20 font-bold hover:scale-105 transition-all"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};

export default DataVoid;
