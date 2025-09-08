import axios from "axios";
import { useEffect, useState, useCallback } from "react"; // Added useCallback
import { useAuth } from "../../context/AuthContext";
import { FaPlus } from "react-icons/fa";
import config from "../../utility/config";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import DynamicTable from "../../components/DynamicTable";
import ModalForm from "../../components/ModalForm";
import DeleteModal from "../../components/DeleteModal";
import ClientModal from "../../components/ClientModal";

export default function ClientField() {
  const field = "client";
  const { token } = useAuth();
  const [dataList, setDataList] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 30;

  // Memoized fetchData function to avoid unnecessary re-renders
  const fetchData = useCallback(
    async (currentPage, itemsPerPage, token) => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        query.append("page", currentPage);
        query.append("limit", itemsPerPage);

        const res = await axios.get(`${config.apiUrl}/${field}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDataList(res.data?.data);
        setTotalItems(res.data?.total);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load data.");
        console.error("Fetch error:", err);
        setDataList([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    },
    [field]
  );

  // Effect hook to fetch data
  useEffect(() => {
    document.title = "BGIC - Field Settings";

    // FETCH API
    fetchData(currentPage, itemsPerPage, token);
  }, [currentPage, itemsPerPage, token, fetchData]);

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

  const handleEdit = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedRow(null);
    setIsModalOpen(true);
  };

  const handleDelete = (row) => {
    setSelectedRow(row);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (formData) => {
    // Exclude 'id' from formData
    const { id, bankName, branchName, ...dataToSend } = formData;
    // console.log(id, bankName, branchName, dataToSend);

    if (selectedRow) {
      // Update
      axios
        .put(`${config.apiUrl}/${field}/${selectedRow.id}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => fetchData(currentPage, itemsPerPage, token))
        .catch(console.error);
    } else {
      // Create
      axios
        .post(`${config.apiUrl}/${field}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => fetchData(currentPage, itemsPerPage, token))
        .catch(console.error);
    }
    setSelectedRow(null);
  };

  const confirmDelete = (row) => {
    axios
      .delete(`${config.apiUrl}/${field}/${row.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => fetchData(currentPage, itemsPerPage, token))
      .catch(console.error);
  };

  // Calculate total pages for pagination display
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // let newDataList = dataList.map(({ bankId, bankbranchId, ...rest }) => rest);

  return (
    <div className="flex flex-col items-center min-h-screen ">
      {/* Page Header and Add New Button */}
      <div className="flex justify-between items-center w-full mb-6 px-4 sha">
        <h1 className="text-4xl font-bold text-blue-950">
          <span className="capitalize">{field}</span> List
        </h1>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-800 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          <FaPlus className="mr-2 text-lg" />
          Add <span className="capitalize ml-1"> {field}</span>
        </button>
      </div>

      {/* Conditional Rendering for Loading, No Data, or Table */}
      {loading ? (
        // Loading component
        <Loading message="Fetching data..." />
      ) : dataList?.length === 0 ? (
        // No data message
        <div className="bg-white p-8 rounded-lg shadow-xl text-center w-full max-w-md">
          <p className="text-xl text-gray-700 font-semibold">
            No records found.
          </p>
        </div>
      ) : (
        // Data Table and Pagination
        <>
          <DynamicTable
            data={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
            hiddenColumns={["bankId", "bankbranchId"]}
          />

          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
            loading={loading}
          />

          <ClientModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            initialData={selectedRow} // null for create, object for edit
            token={token}
          />

          <DeleteModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={confirmDelete}
            record={selectedRow}
          />
        </>
      )}
    </div>
  );
}
