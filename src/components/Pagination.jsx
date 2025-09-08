// components/Pagination.jsx
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}) {
  return (
    <div className="mt-8 flex justify-center items-center gap-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className={`px-5 py-2 border border-blue-500 rounded-full bg-blue-500 text-white font-semibold flex items-center gap-2 shadow-md transition duration-300 ease-in-out ${
          currentPage === 1 || loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-600 hover:border-blue-600 transform hover:scale-105"
        }`}
      >
        <FaChevronLeft className="text-sm" /> Previous
      </button>

      {/* Page Indicator */}
      <span className="px-4 py-2 font-bold text-gray-800 bg-white border border-gray-300 rounded-full shadow-sm">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className={`px-5 py-2 border border-blue-500 rounded-full bg-blue-500 text-white font-semibold flex items-center gap-2 shadow-md transition duration-300 ease-in-out ${
          currentPage === totalPages || loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-600 hover:border-blue-600 transform hover:scale-105"
        }`}
      >
        Next <FaChevronRight className="text-sm" />
      </button>
    </div>
  );
}
