// components/Pagination.jsx
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Pagination({
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage,
  loading = false,
  setLoading,
}) {
  // Handler for pagination changes
  const handlePageChange = (pageNum) => {
    setLoading(true);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    // Prevent navigating to invalid pages
    if (pageNum < 1 || pageNum > totalPages) {
      toast.warn("Invalid page number.");
      return;
    }
    setCurrentPage(pageNum); // Update current page
  };

  // Calculate total pages for pagination display
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="mt-8 flex justify-center items-center gap-4">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className={`p-2.5 rounded-full bg-blue-500 text-white font-semibold shadow-md cursor-pointer ${
          (currentPage === 1 || loading) && "opacity-50"
        }`}
      >
        <FaChevronLeft />
      </button>

      {/* Page Indicator */}
      <span className="px-4 py-2 font-semibold text-gray-800 bg-white rounded-full shadow-md">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className={`p-2.5 rounded-full bg-blue-500 text-white font-semibold shadow-md cursor-pointer ${
          (currentPage === totalPages || loading) && "opacity-50"
        }`}
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
