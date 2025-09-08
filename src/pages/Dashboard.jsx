/* eslint-disable no-unused-vars */
// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { FaListAlt, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Define all modules with allowed roles
const modules = [
  {
    name: "Money Receipt",
    roles: ["admin", "all", "mr"], // multiple roles
    listPath: "/mr",
    addPath: "/mr/new",
  },
  {
    name: "OMP",
    roles: ["admin", "all", "omp"],
    listPath: "/omp",
    addPath: "/omp/new",
  },
  // Add more modules as needed
];

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State to manage overall loading status

  useEffect(() => {
    document.title = `BGIC - Dashboard`;

    setLoading(true);

    if (user?.role === "mr") {
      navigate("/mr");
    }
    if (user?.role === "omp") {
      navigate("/omp");
    }

    setLoading(false);
  }, [navigate, user]);

  // Filter modules that include the user's role
  const accessibleModules = modules.filter((mod) =>
    mod.roles.includes(user?.role)
  );

  if (loading) return <Loading message="Loading MR details..." />;

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      {/* Dashboard Header */}
      <h1 className="text-4xl font-bold text-blue-950 mt-6 mb-10">Dashboard</h1>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-6">
        {accessibleModules.map((mod) => (
          <div
            key={mod.name}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {mod.name}
            </h2>
            <div className="flex flex-col gap-4">
              <Link
                to={mod.listPath}
                className={`flex items-center justify-center px-5 py-3 bg-green-600 text-white font-semibold rounded-lg hover:brightness-110 transition transform hover:scale-105`}
              >
                <FaListAlt className="mr-2 text-xl" />
                {mod.name} List
              </Link>
              <Link
                to={mod.addPath}
                className={`flex items-center justify-center px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:brightness-110 transition transform hover:scale-105`}
              >
                <FaPlus className="mr-2 text-xl" />
                Add {mod.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
