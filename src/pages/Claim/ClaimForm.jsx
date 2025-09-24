// src/pages/Claim/ClaimForm.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import config from "../../utility/config";
import { toast } from "react-toastify";
import { FaUpload } from "react-icons/fa";
import ModalFileUpload from "./ModalFileUpload";
import FilesListDel from "./FilesListDel";
import { FaRegSave, FaPlus, FaRegTrashAlt } from "react-icons/fa";
import ModalDelete from "../../components/ModalDelete";
import AsyncSelect from "react-select/async";

const allowedRoles = {
  view: config.roles.level_4,
  edit: config.roles.level_3,
  delete: config.roles.level_2,
};

export default function ClaimForm() {
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isNewInTheParams =
    queryParams.has("new") || queryParams.get("new") === "true"; // ?new or ?new=true

  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [data, setData] = useState({
    class_id: "",
    insured_id: "",
    claim_no: "",
    policy_no: "",
    loss_date: null,
    amount: "",
    summary: "",
    remarks: "",
    present_status: null,
    survey_report: "",
  });
  const [files, setFiles] = useState([]);

  const [dropdownClassOptions, setDropdownClassOptions] = useState([]);
  const [dropdownInsuredOptions, setDropdownInsuredOptions] = useState([]);

  // ======= Use Effect ============ Satrt =======================================================================================

  // Single Fetch for all data fetching and side effects
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch data for edit mode
      if (params.id) {
        const claimRes = await axios.get(
          `${config.apiUrl}/claim/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // console.log(claimRes.data);
        setData((prev) => ({ ...prev, ...claimRes.data }));

        const fileRes = await axios.get(
          `${config.apiUrl}/file/claim/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // console.log(fileRes);
        setFiles(fileRes.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // For Fetch
  useEffect(() => {
    fetchData();
  }, [params.id, token]);

  // For dropdown initial data when editing
  useEffect(() => {
    const fetchDefaults = async () => {
      try {
        if (data.class_id) {
          const res = await fetch(`${config.apiUrl}/class/${data.class_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to fetch class");
          const item = await res.json();
          setDropdownClassOptions([{ value: item.id, label: item.name }]);
        }

        if (data.insured_id) {
          const res = await fetch(
            `${config.apiUrl}/insured/${data.insured_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!res.ok) throw new Error("Failed to fetch insured");
          const item = await res.json();
          setDropdownInsuredOptions([{ value: item.id, label: item.name }]);
        }
      } catch (err) {
        console.error("Error fetching defaults:", err);
      }
    };

    if (token) fetchDefaults();
  }, [data, token]);

  // For Upload modal opening 1 time if there is "new" in the params
  useEffect(() => {
    if (isNewInTheParams) {
      setIsUploadModalOpen(true);
    }
  }, [isNewInTheParams]);

  // For Error
  useEffect(() => {
    if (error) {
      toast.error(
        <div>
          <p className="font-bold">Error!</p>
          <p>{error}</p>
        </div>
      );
      setError("");
    }
  }, [error]);

  // ======= Use Effect ============ End =======================================================================================

  // ======= Hanldle Change Inputs, Dropdown, Dates ============ Satrt =========================================================

  // handleChange function to manage all input changes
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setData({
      ...data,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : type === "date" && value === ""
          ? null
          : value,
    });
  };

  // Fetch Dropdown (class)
  const dropdownLoadOptions_class = async (inputValue) => {
    const res = await fetch(
      `${config.apiUrl}/class/search?search=${inputValue}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    return data.map((item) => ({ value: item.id, label: item.name }));
  };

  // For AsyncSelect (class)
  const handleChange_class = (selectedOption) => {
    setData({
      ...data,
      class_id: selectedOption ? selectedOption.value : null,
    });
  };

  // Fetch Dropdown (insured)
  const dropdownLoadOptions_insured = async (inputValue) => {
    const res = await fetch(
      `${config.apiUrl}/insured/search?search=${inputValue}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    return data.map((item) => ({ value: item.id, label: item.name }));
  };

  // For AsyncSelect (insured)
  const handleChange_insured = (selectedOption) => {
    setData({
      ...data,
      insured_id: selectedOption ? selectedOption.value : null,
    });
  };

  // ======= Hanldle Change Inputs, Dropdown, Dates ============ End =========================================================

  // ======= Handle Buttons ============ Start ===============================================================================

  // SUBMIT (create and update claim)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !data.insured_id ||
      !data.class_id ||
      !data.claim_no ||
      !data.policy_no ||
      !data.loss_date
      // !data.amount
    ) {
      setError("Please fill in all required* fields.");
      setLoading(false);
      return;
    }

    try {
      // trim string
      const payload = Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
          if (key === "amount") {
            return [key, Number(value) || 0]; // safely convert to number
          }
          if (typeof value === "string") {
            return [key, value.trim()];
          }
          return [key, value];
        })
      );

      if (params.id) {
        // Update API
        await axios.put(`${config.apiUrl}/claim/${params.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(
          <div>
            <p className="font-bold">Claim Updated.</p>
            <p>{payload.claim_no}</p>
          </div>
        );
        // navigate(`/claim`, { replace: true });
        navigate(`/claim/${params.id}`, { replace: true });
      } else {
        // Create API
        await axios.post(`${config.apiUrl}/claim`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(
          <div>
            <p className="font-bold">Claim Created.</p>
            <p>{payload.claim_no}</p>
          </div>
        );
        navigate("/claim", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit data");
    } finally {
      setLoading(false);
    }
  };

  // File Upload (Modal open if claim not created then create claim)
  const handleFileUpload = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !data.insured_id ||
      !data.class_id ||
      !data.claim_no ||
      !data.policy_no ||
      !data.loss_date ||
      !data.amount
    ) {
      setError("Please fill in all required* fields.");
      setLoading(false);
      return;
    }

    try {
      if (params.id) {
        setIsUploadModalOpen(true);
      } else {
        // trim string
        const payload = Object.fromEntries(
          Object.entries(data).map(([key, value]) => {
            if (key === "amount") {
              return [key, Number(value) || 0]; // safely convert to number
            }
            if (typeof value === "string") {
              return [key, value.trim()];
            }
            return [key, value];
          })
        );

        // Create API
        const res = await axios.post(`${config.apiUrl}/claim`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        navigate(`/claim/edit/${res.data.id}?new`, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit data");
    } finally {
      setLoading(false);
    }
  };

  // Delete Button (delete claim by claim_id, also delete related files)
  const handleDelete = async () => {
    try {
      // 1. Delete related files in parallel
      await Promise.all(
        files.map((file) =>
          axios.delete(`${config.apiUrl}/file/${file.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      // 2. Delete claim
      await axios.delete(`${config.apiUrl}/claim/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 3. Redirect after success
      navigate("/claim", { replace: true }); // ✅ redirect to claims list
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to delete");
    }
  };

  // Cancel Button (go back or if claim created without adding file at the same time the delete cmail and go back)
  const handleCancel = () => {
    if (isNewInTheParams) {
      // delete claim and related files
      handleDelete();
      navigate("/claim", { replace: true });
    } else {
      navigate("/claim", { replace: true });
    }
  };

  // Delete File By File ID
  const handleDeleteFileByFileId = async (file) => {
    try {
      // DELETE API
      await axios.delete(`${config.apiUrl}/file/${file?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Check if selected category_id is 1
      if (file?.category_id === 1) {
        // Make a PATCH request to update the survey report for the given claim ID
        // Note: axios.patch(url, data, config) — headers go in the third argument
        await axios.patch(
          `${config.apiUrl}/claim/update-survey-report/${params.id}`,
          {}, // Empty body since no additional data is needed
          {
            headers: { Authorization: `Bearer ${token}` }, // Pass auth token in headers
          }
        );
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete");
    }

    fetchData();
  };

  // ======= Handle Buttons ============ End ===============================================================================

  // ======= Modal ============ Start ===============================================================================

  // SUBMIT
  const handleUploadModalSubmit = async (modalData) => {
    try {
      // Check if modalData exists and the selected category_id is 1
      if (modalData?.category_id === 1) {
        // Make a PATCH request to update the survey report for the given claim ID
        // Note: axios.patch(url, data, config) — headers go in the third argument
        await axios.patch(
          `${config.apiUrl}/claim/update-survey-report/${params.id}`,
          {}, // Empty body since no additional data is needed
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // If modalData exists, refresh the table or data
      if (modalData) {
        fetchData();
      }
    } catch (error) {
      // Log any errors that occur during the PATCH request
      console.error("Error updating survey report:", error);
    } finally {
      // Close the modal regardless of success or failure
      setIsUploadModalOpen(false);
    }
  };

  // ======= Modal ============ End ===============================================================================

  // =========================================================================================================================================================================
  return (
    <div className="">
      <form className="w-full bg-white p-8 rounded-lg shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side*/}
        <div className="col-span-full lg:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-4 border-b-2 text-gray-800 pb-2">
            <h2 className="text-2xl font-bold text-gray-800">Claim Details</h2>
          </div>

          {/* Class of Business - Dropdown */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Class of Business
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <AsyncSelect
              cacheOptions
              loadOptions={dropdownLoadOptions_class}
              defaultOptions
              onChange={handleChange_class}
              required
              value={dropdownClassOptions[0] || null}
            />
          </div>

          {/* Insured - Dropdown */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Insured
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <AsyncSelect
              cacheOptions
              loadOptions={dropdownLoadOptions_insured}
              defaultOptions
              onChange={handleChange_insured}
              required
              value={dropdownInsuredOptions[0] || null}
            />
          </div>

          {/* Claim No - Text */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Claim No
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              name="claim_no"
              onChange={handleChange}
              value={data?.claim_no}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
              placeholder="Enter Claim No"
            />
          </div>

          {/* Policy No - Text */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Policy No
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              name="policy_no"
              onChange={handleChange}
              value={data?.policy_no}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
              placeholder="Enter Policy No"
            />
          </div>

          {/* Claim Amount - Number */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Claim Amount
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              name="amount"
              type="number"
              onChange={handleChange}
              value={data?.amount}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
              placeholder="Enter Claim Amount"
              onWheel={(e) => e.target.blur()}
            />
          </div>

          {/* loss_date - Date*/}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Date Of Loss
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              type="date"
              name="loss_date"
              value={
                data.loss_date
                  ? moment(data.loss_date).format("YYYY-MM-DD")
                  : "" // empty string keeps React happy
              }
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
            />
          </div>

          {/* present_status - Date */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              All Papers Received Date
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              type="date"
              name="present_status"
              value={
                data.present_status
                  ? moment(data.present_status).format("YYYY-MM-DD")
                  : "" // empty string keeps React happy
              }
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
            />
          </div>

          {/* Final Survey Report - Button */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Final Survey Report
            </label>
            <input
              type="button"
              value={data?.survey_report == 0 ? "Not Received" : "Received"}
              className="w-full p-2 border border-gray-300 rounded text-left focus:ring-2 focus:ring-blue-500"
              onClick={(e) => !data?.survey_report && handleFileUpload(e)}
            />
          </div>

          {/* Summary - Text*/}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Final Summary
            </label>
            <input
              name="summary"
              onChange={handleChange}
              value={data?.summary ?? ""} // convert null/undefined to empty string
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
              placeholder="Enter Final Summary"
            />
          </div>

          {/* Remarks - Text */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Remarks
            </label>
            <input
              name="remarks"
              onChange={handleChange}
              value={data?.remarks ?? ""} // convert null/undefined to empty string
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
              placeholder="Enter Remarks"
            />
          </div>
        </div>

        {/* Right Side*/}
        <div className="col-span-full lg:col-span-1 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b-2 text-gray-800 pb-2">
            <h2 className="text-2xl font-bold text-gray-800">Claim Files</h2>

            <button
              type="button"
              className={` bg-green-600 text-white py-1 px-3 font-semibold rounded-lg shadow-xl hover:bg-green-700 transition duration-150 ease-in-out cursor-pointer flex justify-center items-center gap-1`}
              disabled={loading}
              onClick={(e) => handleFileUpload(e)}
              title="Upload File"
            >
              <FaUpload size={18} /> Upload
            </button>
          </div>

          <FilesListDel
            data={files}
            onDelete={handleDeleteFileByFileId}
            loading={loading}
          />
        </div>

        {/* Buttons */}
        <div className="col-span-full flex justify-center flex-wrap gap-4 ">
          {/* Save / Submit */}
          <button
            type="button"
            className={`w-full lg:w-1/4 bg-green-600 text-white font-bold p-2 rounded-lg shadow-xl hover:bg-green-700 transition duration-150 ease-in-out cursor-pointer flex justify-center items-center gap-1 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
            onClick={(e) => handleSubmit(e)}
          >
            <FaRegSave size={20} />
            {loading ? "Processing..." : "Save"}
          </button>

          {/* Delete */}
          {allowedRoles.delete?.includes(user?.role) && (
            <button
              type="button"
              className={`w-full lg:w-1/4 bg-red-600 text-white font-bold p-2 rounded-lg shadow-xl hover:bg-red-700 transition duration-150 ease-in-out cursor-pointer flex justify-center items-center gap-1`}
              disabled={loading}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <FaRegTrashAlt size={20} /> Delete
            </button>
          )}

          {/* Cancel */}
          <button
            type="button"
            className={`w-full lg:w-1/4 bg-gray-600 text-white font-bold p-2 rounded-lg shadow-xl hover:bg-gray-700 transition duration-150 ease-in-out cursor-pointer flex justify-center items-center gap-1`}
            disabled={loading}
            onClick={handleCancel}
          >
            <FaPlus size={20} className="transform rotate-45" /> Cancel
          </button>
        </div>
      </form>

      {isUploadModalOpen && (
        <ModalFileUpload
          onClose={() => setIsUploadModalOpen(false)}
          claimId={params.id}
          onSubmit={handleUploadModalSubmit}
        />
      )}

      <ModalDelete
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

// Components
function InputDate({
  handleChange,
  value,
  required = false,
  className,
  name,
  label,
}) {
  return (
    <div className={className}>
      <label className="block mb-1 font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type="date"
        name={name}
        value={value ? moment(value).format("YYYY-MM-DD") : null}
        onChange={handleChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
      />
    </div>
  );
}

function InputCheckbox({ label, name, checked, handleChange = () => {} }) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={handleChange}
        className="w-4 h-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   transition duration-150 ease-in-out"
      />
      <span>{label}</span>
    </label>
  );
}
