import { useEffect, useState } from "react";

export default function ModalForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  keyFields,
}) {
  const [formData, setFormData] = useState({});

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

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
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
          {initialData ? "Edit Record" : "Create Record"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {keyFields.map((field) => (
            <div key={field}>
              <label className="block mb-1 font-medium text-gray-700 capitalize">
                {field}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                required={field == "name"}
                disabled={field === "id"}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out ${
                  field === "id"
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "border-gray-300"
                }`}
              />
            </div>
          ))}

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
