/* eslint-disable no-unused-vars */
// src/pages/Dashboard.jsx

import { useState } from "react";
import { FaListAlt, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

function Dashboard() {
  const [data, setData] = useState([
    {
      id: "1",
      name: "OMP",
      route: "omp",
    },
  ]);

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-300">
            <tr>
              <th className="text-left px-4 py-3 border-b border-gray-300">
                Data Name
              </th>
              <th className="px-4 py-3 border-b border-gray-300 text-right">
                Data List
              </th>
              <th className="px-4 py-3 border-b border-gray-300 text-right">
                Add To List
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr className="bg-gray-100 hover:bg-gray-200" key={item.id}>
                {/* Name */}
                <td className="px-4 py-3 border-b border-gray-300 font-bold">
                  {item.name}
                </td>

                {/* List */}
                <td className="px-4 py-3 border-b border-gray-300 text-right">
                  <Link
                    to={`/${item.route}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    <p className="flex justify-center items-center gap-2 font-semibold">
                      <FaListAlt size={20} />
                      {item.name} List
                    </p>
                  </Link>
                </td>

                {/* New */}
                <td className="px-4 py-3 border-b border-gray-300 text-right">
                  <Link
                    to={`/${item.route}/new`}
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    <p className="flex justify-center items-center gap-2 font-semibold">
                      <FaPlus size={20} />
                      Add {item.name}
                    </p>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
