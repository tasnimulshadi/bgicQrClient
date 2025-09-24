import { FaRegTrashAlt } from "react-icons/fa";
import {
  getFileIcon,
  getFileNameFromFullPath,
  groupFilesByCategory,
} from "../../utility/utilityFunctions";
import { useState } from "react";
import ModalDelete from "../../components/ModalDelete";
import Loading from "../../components/Loading";

export default function FilesListDel({ data, onDelete, loading }) {
  const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDeleteModal = (f) => {
    setSelectedFile(f);
    setisDeleteModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <Loading />
      ) : Array.isArray(data) && data.length > 0 ? (
        groupFilesByCategory(data).map((categoryGroup, catIdx) => (
          <div key={catIdx}>
            <h3 className="font-semibold text-gray-700 mb-2">
              {categoryGroup.category}
            </h3>

            {Array.isArray(categoryGroup.files) &&
            categoryGroup.files.length > 0 ? (
              <ul className="space-y-2">
                {categoryGroup.files.map((file, fileIdx) => (
                  <li
                    key={fileIdx}
                    className="flex justify-between items-center bg-white p-2 rounded-md shadow-md"
                  >
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() =>
                        window.open(
                          `http://localhost:5000${file.path}`,
                          "_blank"
                        )
                      }
                    >
                      <img
                        src={getFileIcon(file.path)}
                        className="w-12 object-cover"
                      />
                      <p>{getFileNameFromFullPath(file.path)}</p>
                    </div>
                    <FaRegTrashAlt
                      className="w-5 h-5 text-red-600 cursor-pointer hover:text-red-800"
                      onClick={() => handleDeleteModal(file)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No files</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No files uploaded</p>
      )}

      <ModalDelete
        isOpen={isDeleteModalOpen}
        onClose={() => setisDeleteModalOpen(false)}
        record={selectedFile}
        onConfirm={onDelete}
      />
    </div>
  );
}
