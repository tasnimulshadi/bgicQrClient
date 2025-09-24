// src/pages/Claim/ClaimList.jsx
import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react"; // Added useCallback
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaPlus, FaEdit, FaEye } from "react-icons/fa";
import config from "../../utility/config";
import { toast } from "react-toastify";
import { formatNumberToComma } from "../../utility/utilityFunctions";
import Loading from "../../components/Loading";
import moment from "moment";
import Pagination from "../../components/Pagination";
import DownloadDropdown from "../../components/DownloadDropdown";

const allowedRoles = {
  view: config.roles.level_4,
  edit: config.roles.level_3,
  delete: config.roles.level_2,
};

function ClaimList() {
  const navigate = useNavigate();

  const { token, user } = useAuth();
  const debounceTimerRef = useRef(null);
  const [dataList, setDataList] = useState([]);
  // console.log(dataList);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    claim_no: "",
    policy_no: "",
    insured_name: "",
    date_from: "",
    date_to: "",
  });
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  // Memoized fetchData function to avoid unnecessary re-renders
  const fetchData = useCallback(
    async (filters, currentPage, itemsPerPage, token) => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (filters.claim_no) {
          query.append("claim_no", filters.claim_no.trim());
        }

        if (filters.policy_no) {
          query.append("policy_no", filters.policy_no.trim());
        }

        if (filters.insured_name) {
          query.append("insured_name", filters.insured_name.trim());
        }

        if (filters.date_from) {
          query.append("date_from", filters.date_from);
        }

        if (filters.date_to) {
          query.append("date_to", filters.date_to);
        }

        query.append("page", currentPage);
        query.append("limit", itemsPerPage);

        const res = await axios.get(
          `${config.apiUrl}/claim?${query.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDataList(res.data?.data);
        setTotalItems(res.data?.total);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load data.");
        console.error("Fetch error:", err);
        setDataList([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Debounce Effect to slowdown
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      fetchData(filters, currentPage, itemsPerPage, token);
    }, 1000);

    // Cleanup on unmount
    return () => clearTimeout(debounceTimerRef.current);
  }, [filters, currentPage, itemsPerPage, token, fetchData]);

  // Handler for applying filters
  function handleFilterSubmit(e) {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when new filters are applied
    fetchData(filters, currentPage, itemsPerPage, token); // Fetch data with new filters
  }

  // Handle Action Button
  function handleOnClickNew() {
    navigate(`/claim/new`);
  }
  function handleOnClickView(itemId) {
    navigate(`/claim/${itemId}`);
  }
  function handleOnClickEdit(itemId) {
    navigate(`/claim/edit/${itemId}`);
  }

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

  return (
    <div className="flex flex-col items-center min-h-screen ">
      {/* Page Header and create New Button */}
      <div className="flex justify-between items-center w-full mb-6 px-4 flex-wrap gap-y-3">
        {/* title */}
        <h1 className="text-3xl font-bold text-blue-950 capitalize">Claims</h1>

        {/* buttons */}
        <div className="flex gap-2">
          {allowedRoles.edit.includes(user?.role) && (
            <button
              onClick={handleOnClickNew}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-xl cursor-pointer flex justify-center items-center gap-1 self-end"
            >
              <FaPlus size={20} /> New
            </button>
          )}

          <DownloadDropdown />
        </div>
      </div>

      {/* Filter Form */}
      <form
        className="w-full grid grid-cols-1 md:grid-cols-7 gap-4 bg-white p-4 rounded-lg shadow-xl mb-8"
        onSubmit={handleFilterSubmit}
      >
        {/* Search by claim_no */}
        <div className="flex flex-col self-end">
          <label
            htmlFor="claim_no"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Claim No.
          </label>
          <input
            type="text"
            id="claim_no"
            name="claim_no"
            placeholder="🔍︎ Claim No."
            value={filters.claim_no}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, claim_no: e.target.value }))
            }
            className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Search by policy_no */}
        <div className="flex flex-col self-end">
          <label
            htmlFor="policy_no"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Policy No.
          </label>
          <input
            type="text"
            id="policy_no"
            name="policy_no"
            placeholder="🔍︎ Policy No."
            value={filters.policy_no}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, policy_no: e.target.value }))
            }
            className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Search by insured_name */}
        <div className="flex flex-col self-end">
          <label
            htmlFor="insured_name"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Insured Name
          </label>
          <input
            type="text"
            id="insured_name"
            name="insured_name"
            placeholder="🔍︎ Insured Name"
            value={filters.insured_name}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, insured_name: e.target.value }))
            }
            className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Date From */}
        <div className="flex flex-col self-end">
          <label
            htmlFor="date_from"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Date From
          </label>
          <input
            type="date"
            id="date_from"
            name="date_from"
            value={filters.date_from}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, date_from: e.target.value }))
            }
            className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Date To */}
        <div className="flex flex-col self-end">
          <label
            htmlFor="date_to"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Date To
          </label>
          <input
            type="date"
            id="date_to"
            name="date_to"
            value={filters.date_to}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, date_to: e.target.value }))
            }
            className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Buttons */}
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold p-2 rounded-md shadow-md hover:bg-blue-700 w-full self-end"
        >
          Filter
        </button>

        <button
          type="button"
          className="bg-gray-600 text-white font-semibold p-2 rounded-md shadow-md hover:bg-gray-700 w-full self-end"
          onClick={() =>
            setFilters({
              claim_no: "",
              policy_no: "",
              insured_name: "",
              date_from: "",
              date_to: "",
            })
          }
        >
          Clear
        </button>
      </form>

      {/* Conditional Rendering for Loading, No Data, or Table */}
      {loading && (
        // Loading always comes first
        <Loading message="Fetching data..." />
      )}

      {!loading && dataList?.length === 0 && (
        // Show only after loading finishes
        <div className="bg-white p-8 rounded-lg shadow-xl text-center w-full max-w-md">
          <p className="text-xl text-gray-700 font-semibold">No claim found.</p>
          <p className="text-md text-gray-500 mt-2">
            Try adjusting your search filters or create a new claim.
          </p>
        </div>
      )}

      {!loading && dataList?.length > 0 && (
        // Data Table and Pagination
        <>
          <div className="w-full overflow-x-auto bg-white rounded-lg shadow-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="text-left p-3 text-sm font-semibold uppercase tracking-wider rounded-tl-lg">
                    SL
                  </th>
                  {/* <th className="text-left p-3 text-sm font-semibold uppercase tracking-wider">
                    ID
                  </th> */}
                  <th className="text-left p-3 text-sm font-semibold uppercase tracking-wider">
                    Claim No
                  </th>
                  <th className="text-left p-3 text-sm font-semibold uppercase tracking-wider">
                    Policy No
                  </th>
                  <th className="text-left p-3 text-sm font-semibold uppercase tracking-wider">
                    Insured Name
                  </th>
                  <th className="text-left p-3 text-sm font-semibold uppercase tracking-wider">
                    Class Of Business
                  </th>
                  <th className="text-left p-3 text-sm font-semibold uppercase tracking-wider">
                    Loss Date
                  </th>
                  <th className="text-left p-3 text-sm font-semibold uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-right p-3 text-sm font-semibold uppercase tracking-wider rounded-tr-lg">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dataList?.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`transition-colors duration-200 ease-in-out ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-100`}
                  >
                    <td className="p-3 whitespace-nowrap text-sm text-gray-800">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    {/* <td className="p-3 whitespace-nowrap text-sm text-gray-800">
                      {item.id}
                    </td> */}
                    <td className="p-3 whitespace-nowrap text-sm text-gray-800">
                      {item.claim_no}
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-800">
                      {item.policy_no}
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-800">
                      {item.insured_name}
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-800">
                      {item.class_name}
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-800">
                      {moment(item.loss_date).format("DD MMM YYYY")}
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-800">
                      {formatNumberToComma(Number(item.amount))}
                    </td>
                    <td className="p-3 whitespace-nowrap text-right text-sm font-medium flex gap-4 items-center justify-end">
                      <button
                        onClick={() => handleOnClickView(item.id)}
                        className="text-green-600 hover:text-green-800 cursor-pointer"
                      >
                        <FaEye size={20} />
                      </button>

                      {allowedRoles.edit?.includes(user?.role) && (
                        <button
                          onClick={() => handleOnClickEdit(item.id)}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          <FaEdit size={20} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            loading={loading}
            setLoading={setLoading}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

export default ClaimList;
