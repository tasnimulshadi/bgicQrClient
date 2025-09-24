/* eslint-disable no-unused-vars */
// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { FaListAlt, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import config from "../utility/config";

// Define all modules with allowed roles
const modules = [
  {
    title: "Claim",
    listPath: "/claim",
    newPath: "/claim/new",
    image: "/assets/images/claimimage.png",
    allowedRoles: {
      view: config.roles.level_4,
      edit: config.roles.level_3,
      delete: config.roles.level_2,
    },
  },
  // Add more modules as needed
];

function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Filter modules that include the user's role
  const accessibleModules = modules.filter((item) =>
    item.allowedRoles.view.includes(user?.role)
  );

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      {/* Dashboard Header */}
      <h1 className="text-4xl font-bold text-blue-950 mt-6 mb-10">Dashboard</h1>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-6">
        {accessibleModules.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-left">
              <h2 className="text-2xl font-semibold text-blue-950 text-center">
                {item.title}
              </h2>
              <p className="text-gray-500">{item?.subtitle}</p>
            </div>
            <img src={item.image} className="w-full object-cover" />
            <div className="flex flex-col gap-4">
              <Link
                to={item.listPath}
                className={`flex items-center justify-center px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg cursor-pointer`}
              >
                <FaListAlt className="mr-2 text-xl" />
                {item.title} List
              </Link>

              {item.allowedRoles.edit?.includes(user?.role) && (
                <Link
                  to={item.newPath}
                  className={`flex items-center justify-center px-5 py-3 bg-green-600 text-white font-semibold rounded-lg cursor-pointer`}
                >
                  <FaPlus className="mr-2 text-xl" />
                  New {item.title}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
