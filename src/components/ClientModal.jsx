import { useState, useEffect } from "react";
import { FaWindowClose } from "react-icons/fa";
import axios from "axios";
import config from "../utility/config";

export default function ClientModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  token,
}) {
  const [formData, setFormData] = useState({});
  // console.log(formData);

  const [banks, setBanks] = useState([]);
  const [branches, setBranches] = useState([]);

  // Load initial data into form
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({});
    }
  }, [initialData]);

  // Fetch banks and branches when modal opens
  useEffect(() => {
    if (isOpen) {
      // get banks
      axios
        .get(`${config.apiUrl}/bank`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setBanks(res.data.data))
        .catch(console.error);

      //get branches
      axios
        .get(`${config.apiUrl}/bankbranch`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setBranches(res.data.data))
        .catch(console.error);
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-[#000000bd] bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl font-bold"
        >
          <FaWindowClose size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-blue-900 text-center">
          {initialData ? "Edit Client" : "Create Client"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Mobile
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
          </div>

          {/* BIN */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">BIN</label>
            <input
              type="text"
              name="bin"
              value={formData.bin || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
          </div>

          {/* Bank Dropdown */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Bank</label>
            <select
              name="bankId"
              value={formData.bankId || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            >
              <option value="">Select Bank</option>
              {banks.length > 0 &&
                banks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Branch Dropdown */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Bank Branch
            </label>
            <select
              name="bankbranchId"
              value={formData.bankbranchId || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            >
              <option value="">Select Branch</option>
              {branches.length > 0 &&
                branches?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
