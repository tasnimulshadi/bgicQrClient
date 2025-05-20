// src/pages/DataList.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DataList() {
  const [dataList, setDataList] = useState([]);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/data", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDataList(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch data");
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Data List</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {dataList.length === 0 ? (
        <p>No data found.</p>
      ) : (
        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left px-4 py-3 border-b border-gray-300">
                  Title
                </th>
                <th className="text-left px-4 py-3 border-b border-gray-300">
                  Content
                </th>
                <th className="text-left px-4 py-3 border-b border-gray-300">
                  View
                </th>
              </tr>
            </thead>
            <tbody>
              {dataList.map((item) => (
                <tr key={item._id} className="hover:bg-gray-100">
                  <td className="px-4 py-3 border-b border-gray-300">
                    {item.title}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-300">
                    {item.content}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-300">
                    <Link
                      to={`/data/${item._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DataList;
