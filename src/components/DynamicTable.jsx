import { useAuth } from "../context/AuthContext";

function DynamicTable({
  data,
  onEdit,
  onDelete,
  hiddenColumns = [],
  itemsPerPage,
  currentPage,
  fieldData,
}) {
  const { user } = useAuth();

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  // Get column names dynamically from first object keys
  const columns = Object.keys(data[0]).filter(
    (col) => !hiddenColumns.includes(col)
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-xl overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 table-auto ">
        <thead className="bg-blue-950 text-white">
          <tr>
            <th className="text-left px-4 py-3 text-sm font-semibold uppercase tracking-wider">
              SL
            </th>
            {columns.map((col) => (
              <th
                key={col}
                className="text-left px-4 py-3 text-sm font-semibold uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
            <th className="text-right px-4 py-3 text-sm font-semibold uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`transition-colors duration-200 ease-in-out ${
                rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-blue-100`}
            >
              <td className="px-4 py-3 text-sm text-gray-800 break-words max-w-[200px]">
                {(currentPage - 1) * itemsPerPage + rowIndex + 1}
              </td>
              {columns.map((col) => (
                <td
                  key={col}
                  className="px-4 py-3 text-sm text-gray-800 break-words max-w-[200px]"
                >
                  {row[col]}
                </td>
              ))}
              <td className="px-4 py-3 text-right text-sm font-medium whitespace-nowrap">
                <div className="flex justify-end gap-2">
                  {fieldData?.allowedRolesForEdit?.includes(user?.role) && (
                    <button
                      onClick={() => onEdit(row)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  )}

                  {fieldData?.allowedRolesForDelete?.includes(user?.role) && (
                    <button
                      onClick={() => onDelete(row)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DynamicTable;
