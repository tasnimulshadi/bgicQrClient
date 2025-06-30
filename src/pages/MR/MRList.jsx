// src/pages/MR/MRList.jsx
import axios from "axios";
import { useEffect, useState, useCallback } from "react"; // Added useCallback
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaPlus,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import config from "../../utility/config";
import { toast } from "react-toastify";
import { formatNumberToComma } from "../../utility/utilityFunctions";
import Loading from "../../components/Loading";

function MRList() {
  const { token } = useAuth();
  const [dataList, setDataList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    mrNumber: "",
    policyNumber: "",
  });
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  // Memoized fetchData function to avoid unnecessary re-renders
  const fetchData = useCallback(
    async (
      filters,
      currentPage,
      itemsPerPage,
      token,
      setLoading,
      setDataList,
      setTotalItems,
      setError
    ) => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (filters.mrNumber) query.append("mrNumber", filters.mrNumber);
        if (filters.policyNumber)
          query.append("policyNumber", filters.policyNumber);
        query.append("page", currentPage);
        query.append("limit", itemsPerPage);

        const res = await axios.get(`${config.apiUrl}/mr?${query.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDataList(res.data.data);
        setTotalItems(res.data.total);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load MR data.");
        console.error("Fetch error:", err);
        setDataList([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Effect hook to fetch data
  useEffect(() => {
    document.title = "BGIC - MR List";

    let debounceTimer;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchData(
        filters,
        currentPage,
        itemsPerPage,
        token,
        setLoading,
        setDataList,
        setTotalItems,
        setError
      );
    }, 1000);

    return () => clearTimeout(debounceTimer); // Clean up on unmount or before rerun
  }, [filters, currentPage, itemsPerPage, token, fetchData]);

  // Handler for applying filters
  function handleFilterSubmit(e) {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when new filters are applied
    fetchData(); // Fetch data with new filters
  }

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

  // Effect hook to display error toasts
  useEffect(() => {
    if (error) {
      toast.error(
        <div>
          <p className="font-bold">Error!</p>
          <p>{error}</p>
        </div>
      );
      setError(""); // Clear the error after showing the toast to prevent re-triggering
    }
  }, [error]); // Dependency array includes error

  // Calculate total pages for pagination display
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex flex-col items-center min-h-screen ">
      {/* Page Header and Add New Button */}
      <div className="flex justify-between items-center w-full mb-6 px-4 sha">
        <h1 className="text-4xl font-bold text-blue-950">MR List</h1>
        <Link
          to={"/mr/new"}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-800 transition duration-300 ease-in-out transform hover:scale-105"
        >
          <FaPlus className="mr-2 text-lg" />
          Add New MR
        </Link>
      </div>

      {/* Filter Form */}
      <form
        className="w-full grid grid-cols-1 sm:grid-cols-3 md:grid-cols-7 gap-4 bg-white p-6 rounded-lg shadow-xl mb-8"
        onSubmit={handleFilterSubmit}
      >
        {/* Search by MR Number */}
        <input
          type="number"
          name="policyNumber"
          id="policyNumberFilter" // Added ID for accessibility
          placeholder="Search Policy No."
          value={filters.policyNumber}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, policyNumber: e.target.value }))
          }
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 col-span-3 sm:col-span-1 md:col-span-3"
        />
        {/* Search by mrNumber Number */}
        <input
          type="number"
          name="mrNumber"
          id="mrNumberFilter" // Added ID for accessibility
          placeholder="Search MR No"
          value={filters.mrNumber}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, mrNumber: e.target.value }))
          }
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 col-span-3 sm:col-span-1 md:col-span-3"
        />
        {/* Search Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 flex items-center justify-center gap-2 cursor-pointer font-semibold transition duration-200 ease-in-out transform hover:scale-105 col-span-full sm:col-span-1 md:col-span-1 w-full sm:w-auto"
          disabled={loading}
        >
          <FaSearch className="text-lg" /> Search
        </button>
      </form>

      {/* Conditional Rendering for Loading, No Data, or Table */}
      {loading ? (
        // Loading component
        <Loading message="Fetching MR data..." />
      ) : dataList.length === 0 ? (
        // No data message
        <div className="bg-white p-8 rounded-lg shadow-xl text-center w-full max-w-md">
          <p className="text-xl text-gray-700 font-semibold">
            No MR records found.
          </p>
          <p className="text-md text-gray-500 mt-2">
            Try adjusting your search filters or add a new MR.
          </p>
        </div>
      ) : (
        // Data Table and Pagination
        <>
          <div className="w-full overflow-x-auto bg-white rounded-lg shadow-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold uppercase tracking-wider rounded-tl-lg">
                    ID
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold uppercase tracking-wider">
                    MR Number
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold uppercase tracking-wider">
                    Money Receipt No
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold uppercase tracking-wider">
                    Policy Number
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold uppercase tracking-wider">
                    Policy No
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold uppercase tracking-wider rounded-tr-lg">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dataList.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`transition-colors duration-200 ease-in-out ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-100`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      {item.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      {item.mrNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      {item.mrNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      {item.policyNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      {item.policyNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      BDT {formatNumberToComma(Number(item.total))}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/mr/${item.id}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold transition duration-150 ease-in-out"
                      >
                        View Receipt
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className={`px-5 py-2 border border-blue-500 rounded-full bg-blue-500 text-white font-semibold flex items-center gap-2 shadow-md transition duration-300 ease-in-out ${
                currentPage === 1 || loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600 hover:border-blue-600 transform hover:scale-105"
              }`}
            >
              <FaChevronLeft className="text-sm" /> Previous
            </button>

            <span className="px-4 py-2 font-bold text-gray-800 bg-white border border-gray-300 rounded-full shadow-sm">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
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
        </>
      )}
    </div>
  );
}

export default MRList;
