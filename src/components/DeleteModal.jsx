import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export default function DeleteModal({ isOpen, onClose, onConfirm, record }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000bd] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-fadeIn">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <FaExclamationTriangle className="text-2xl" />
          <h2 className="text-xl font-semibold">Confirm Delete</h2>
        </div>

        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this record{" "}
          <span className="font-bold">{record?.id}</span>? This action cannot be
          undone.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(record);
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
