import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaPlus } from "react-icons/fa";
import config from "../../utility/config";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import DynamicTable from "../../components/DynamicTable";
import ModalForm from "../../components/ModalForm";
import ModalDelete from "../../components/ModalDelete";
import DownloadExcel from "../../components/DownloadExcel";
import ModalFormUser from "../../components/ModalFormUser";

export default function FieldList() {
  const location = useLocation();
  const fieldData = location.state; // 👈 data sent via navigate
  // console.log(fieldData);

  const { user, token } = useAuth();
  const [dataList, setDataList] = useState([]);
  // console.log(dataList);
  const [nameFilter, setNameFilter] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  // Memoized fetchData function to avoid unnecessary re-renders
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.append("page", currentPage);
      query.append("limit", itemsPerPage);

      if (nameFilter) {
        query.append("name", nameFilter.trim());
      }

      const res = await axios.get(
        `${config.apiUrl}/${fieldData?.database}?${query.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
  }, [fieldData, currentPage, itemsPerPage, token, nameFilter]);

  // Effect hook to fetch data
  useEffect(() => {
    // FETCH API
    fetchData();
  }, [currentPage, itemsPerPage, token]);

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
    if (fieldData?.database === "users") {
      setIsUserModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCreate = () => {
    setSelectedRow(null);
    if (fieldData?.database === "users") {
      setIsUserModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleDelete = (row) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (formData) => {
    // Exclude 'id' from formData
    const { id, ...dataToSend } = formData;
    console.log(id);

    if (selectedRow) {
      // Update
      axios
        .put(
          `${config.apiUrl}/${fieldData?.database}/${selectedRow.id}`,
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => fetchData())
        .catch(console.error);
    } else {
      // Create
      axios
        .post(`${config.apiUrl}/${fieldData?.database}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => fetchData())
        .catch(console.error);
    }
  };

  const confirmDelete = (row) => {
    axios
      .delete(`${config.apiUrl}/${fieldData?.database}/${row?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => fetchData(currentPage, itemsPerPage, token))
      .catch(console.error);
  };

  // Handler for applying filters
  function handleFilterSubmit(e) {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  }

  return (
    <div className="flex flex-col items-center min-h-screen ">
      {/* Page Header and Create New Button */}
      <div className="flex justify-between items-center w-full mb-6 px-4 flex-wrap gap-y-3">
        {/* title */}
        <div className="text-left">
          <h1 className="text-3xl font-bold text-blue-950 capitalize">
            {fieldData?.title}
          </h1>
          <p className="text-gray-500">{fieldData?.subtitle}</p>
        </div>

        {/* buttons */}
        <div className="flex gap-2">
          {fieldData?.allowedRolesForEdit?.includes(user?.role) && (
            <button
              onClick={handleCreate}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-xl cursor-pointer flex justify-center items-center gap-1 self-end"
            >
              <FaPlus size={20} /> New
            </button>
          )}

          <DownloadExcel data={dataList} filename={fieldData?.database} />
        </div>
      </div>

      <form
        className="w-full grid grid-cols-1 lg:grid-cols-7 gap-4 bg-white p-4 rounded-lg shadow-xl mb-8"
        onSubmit={handleFilterSubmit}
      >
        {/* Search by nameFilter */}
        <input
          type="text"
          id="nameFilter"
          name="nameFilter"
          placeholder="🔍︎ Search Name."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="lg:col-span-6 border border-gray-300 p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />

        {/* Buttons */}
        <button
          type="submit"
          className="lg:col-span-1 bg-blue-600 text-white font-semibold p-2 rounded-md shadow-md hover:bg-blue-700 w-full"
        >
          Filter
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
          <p className="text-xl text-gray-700 font-semibold">
            No records found.
          </p>
        </div>
      )}

      {!loading && dataList?.length > 0 && (
        // Data Table and Pagination
        <>
          <DynamicTable
            data={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            fieldData={fieldData}
          />

          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            loading={loading}
            setLoading={setLoading}
            setCurrentPage={setCurrentPage}
          />

          <ModalForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            initialData={selectedRow}
            keyFields={fieldData?.keyFields}
          />

          <ModalFormUser
            isOpen={isUserModalOpen}
            onClose={() => setIsUserModalOpen(false)}
            onSubmit={handleSubmit}
            initialData={selectedRow}
            keyFields={fieldData?.keyFields}
          />

          <ModalDelete
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            record={selectedRow}
          />
        </>
      )}
    </div>
  );
}
