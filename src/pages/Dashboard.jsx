/* eslint-disable no-unused-vars */
// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { FaListAlt, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

function Dashboard() {
  // State to hold dashboard data (e.g., list of modules/sections)
  // Currently hardcoded for OMP, but can be extended for other modules
  const [data, setData] = useState([
    {
      id: "1",
      name: "OMP", // Name of the module
      route: "omp", // Base route for the module (e.g., /omp for list, /omp/new for add)
    },
    {
      id: "2",
      name: "MR",
      route: "mr",
    },
  ]);

  // Effect hook to set the document title when the component mounts
  useEffect(() => {
    document.title = `BGIC - OMP Dashboard`;
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="flex flex-col items-center w-full min-h-screen ">
      {/* Dashboard Header */}
      <h1 className="text-4xl font-bold text-blue-950 mb-8 mt-4">Dashboard</h1>

      {/* Main content area, centered and with max-width for better readability */}
      <div className="w-full bg-white rounded-lg shadow-xl overflow-y-auto max-h-[600px] border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-950 text-white">
            <tr>
              {/* Table Header for Data Name */}
              <th className="text-left px-6 py-3 text-lg font-bold uppercase tracking-wider  rounded-tl-lg">
                Data Name
              </th>
              {/* Table Header for Data List Link */}
              <th className="px-6 py-3 text-lg font-bold uppercase tracking-wider  text-right">
                Data List
              </th>
              {/* Table Header for Add To List Link */}
              <th className="px-6 py-3 text-lg font-bold uppercase tracking-wider  text-right rounded-tr-lg">
                Add To List
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Map through the data array to render each module's row */}
            {data.map((item) => (
              <tr
                className="hover:bg-gray-100 transition duration-150 ease-in-out"
                key={item.id}
              >
                {/* Module Name */}
                <td className="px-6 py-4 whitespace-nowrap text-xl font-semibold text-gray-800">
                  {item.name}
                </td>

                {/* Link to Module List */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link
                    to={`/${item.route}`}
                    className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FaListAlt className="mr-2 text-xl" /> {/* Icon for list */}
                    <span className="text-lg">{item.name} List</span>
                  </Link>
                </td>

                {/* Link to Add New Module Item */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link
                    to={`/${item.route}/new`}
                    className="inline-flex items-center px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FaPlus className="mr-2 text-xl" /> {/* Icon for add */}
                    <span className="text-lg">Add {item.name}</span>
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
