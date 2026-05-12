import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  paginate,
}) => {
  return (
    <div className="mt-24 flex items-center justify-center">
      <div className="flex items-center gap-2 bg-base-100 p-2 rounded-full border border-base-content/10 shadow-lg backdrop-blur-sm">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-12 h-12 rounded-full flex items-center justify-center text-base-content/60 hover:bg-base-200 hover:text-primary transition-all disabled:opacity-20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`w-12 h-12 rounded-full font-black text-sm transition-all duration-300 relative group overflow-hidden ${
                currentPage === i + 1
                  ? "text-primary-content"
                  : "text-base-content/60 hover:text-base-content hover:bg-base-200"
              }`}
            >
              {/* Background Slider Effect */}
              {currentPage === i + 1 && (
                <div className="absolute inset-0 bg-primary animate-in fade-in zoom-in duration-300"></div>
              )}
              <span className="relative z-10">{i + 1}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-12 h-12 rounded-full flex items-center justify-center text-base-content/60 hover:bg-base-200 hover:text-primary transition-all disabled:opacity-20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
