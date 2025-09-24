import { useEffect, useState } from "react";
import Select from "react-select";

export default function ModalFormUser({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  keyFields,
}) {
  const [formData, setFormData] = useState({});

  const roleOptions = [
    { value: "viewer", label: "viewer" },
    { value: "editor", label: "editor" },
    { value: "manager", label: "manager" },
    { value: "admin", label: "admin" },
  ];

  const statusOptions = [
    { value: 1, label: "Active" },
    { value: 0, label: "Inactive" },
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Initialize empty values for all keyFields
      const emptyData = {};
      keyFields.forEach((f) => (emptyData[f] = ""));
      setFormData(emptyData);
    }
  }, [initialData, keyFields]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

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
          {initialData ? "Edit Record" : "Create Record"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData?.username || ""}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
              placeholder="Enter Username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              type="text"
              name="password"
              value={formData?.password || ""}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
              placeholder="Enter Password"
            />
          </div>

          {/* Role - Dropdown */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Role
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <Select
              options={roleOptions}
              onChange={(selected) =>
                handleChange({
                  target: {
                    name: "role",
                    value: selected ? selected.value : "",
                  },
                })
              }
              value={
                formData?.role
                  ? roleOptions.find((opt) => opt.value === formData.role)
                  : null
              }
              required
            />
          </div>

          {/* Active - Dropdown */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Active
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <Select
              options={statusOptions}
              onChange={(selected) =>
                handleChange({
                  target: { name: "active", value: selected.value },
                })
              }
              value={
                formData?.active !== undefined && formData?.active !== null
                  ? statusOptions.find((opt) => opt.value === formData.active)
                  : null
              }
              required
            />
          </div>

          {/* Button */}
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
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
