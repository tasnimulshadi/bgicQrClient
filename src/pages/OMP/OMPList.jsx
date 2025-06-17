// src/pages/DataList.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaPlus } from "react-icons/fa";
import config from "../../utility/config";

function OMPList() {
  const { token } = useAuth();
  const [dataList, setDataList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    mobile: "",
    ompNumber: "",
  });
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20; // or match backend default

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.mobile) query.append("mobile", filters.mobile);
      if (filters.ompNumber) query.append("ompNumber", filters.ompNumber);
      query.append("page", currentPage);
      query.append("limit", itemsPerPage);

      const res = await axios.get(`${config.apiUrl}/omp?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDataList(res.data.data);
      setTotalItems(res.data.total);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch data");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  function handleFilterSubmit(e) {
    e.preventDefault();
    fetchData();
  }

  //pagination
  const handlePageChange = (pageNum) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between items-start w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">OMP List</h1>

        <Link
          to={"/omp/new"}
          className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          <p className="flex justify-center items-center gap-2">
            <FaPlus size={20} />
            Add New OMP
          </p>
        </Link>
      </div>

      <form
        className="mb-6 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-7 gap-4"
        onSubmit={handleFilterSubmit}
      >
        <input
          type="text"
          name="mobile"
          placeholder="Search Mobile"
          value={filters.mobile}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, mobile: e.target.value }))
          }
          className="border px-4 py-2 rounded"
        />
        <input
          type="text"
          name="ompNumber"
          placeholder="Search OMP No"
          value={filters.ompNumber}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, ompNumber: e.target.value }))
          }
          className="border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      <hr />

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : dataList.length === 0 ? (
        <p className="text-gray-600">No OMP Found.</p>
      ) : (
        <>
          <div className="w-full max-w-6xl overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 border-b border-gray-300">
                    Policy Number
                  </th>
                  <th className="text-right px-4 py-3 border-b border-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="px-4 py-3 border-b border-gray-300">
                      {item.policyNumber}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300 text-right">
                      <Link
                        to={`/omp/${item.id}`}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        View OMP
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Start */}
          <div className="mt-4 flex gap-4 justify-center items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-4 py-2 font-medium text-gray-700 border rounded">
              Page {currentPage}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
              className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          {/* Pagination End */}
        </>
      )}
    </div>
  );
}

export default OMPList;
