import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import config from "../../utility/config";
import axios from "axios";

export default function ModalFileUpload({ claimId, onClose, onSubmit }) {
  const { token } = useAuth();
  const [categoryDropDown, setCategoryDropDown] = useState([]);
  const [data, setData] = useState({
    claim_id: claimId,
    category_id: "",
    file: {},
  });

  // Fetch category dropdown
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/file_category/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategoryDropDown(res.data.data);
      } catch (err) {
        console.log(err.message || "Failed to load data");
      }
    };
    fetchData();
  }, [token]);

  // Handle dropdown change
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setData((prev) => ({
      ...prev,
      file: e.target.files[0], // get the first selected file
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.category_id || !data.claim_id || !data.file) {
      alert("Please fill in all required* fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("category_id", data.category_id);
      formData.append("claim_id", data.claim_id);
      formData.append("file", data.file);

      const res = await axios.post(`${config.apiUrl}/file`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onSubmit(res.data); // pass back result if needed
      // onClose();
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert("Upload failed. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000bd] bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-lg sm:max-w-xl md:max-w-2xl rounded-2xl shadow-2xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-blue-900 text-center">
          Upload File
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block mb-1 font-medium text-gray-700">
            Category
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <select
            name="category_id"
            value={data?.category_id}
            onChange={handleChange}
            // required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          >
            <option value="" className="text-gray-400" disabled>
              Select Category
            </option>
            {categoryDropDown &&
              categoryDropDown.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            <option value="" className="text-gray-400">
              Null
            </option>
          </select>

          <label className="block mb-1 font-medium text-gray-700">
            Select File
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="file"
            name="file"
            // multiple
            onChange={handleFileChange}
            required
            className="w-full pr-4  border border-gray-300 rounded-md shadow-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputFieldDropDown({
  handleChange,
  value,
  required = false,
  className = "",
  name,
  label,
  dropDownData,
  dropDownOption,
}) {
  return (
    <div className={className}>
      <label className="block mb-1 font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        name={name}
        value={value ?? ""}
        onChange={handleChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
      >
        <option value="" className="text-gray-400" disabled>
          Select {label}
        </option>
        {dropDownData &&
          dropDownData.map((item) => (
            <option key={item.id} value={item.id}>
              {item[dropDownOption]}
            </option>
          ))}
      </select>
    </div>
  );
}
