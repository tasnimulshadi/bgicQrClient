import { useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const modules = [
  {
    name: "Bank",
    sub: "Bank Name",
    path: "bank",
    roles: ["admin", "all", "mr", "omp"],
    keyFields: ["id", "name"],
  },
  {
    name: "Bank Branch",
    sub: "Bank Branch Name",
    path: "bankBranch",
    roles: ["admin", "all", "mr", "omp"],
    keyFields: ["id", "name"],
  },
  {
    name: "Class",
    sub: "Class Of Insurance",
    path: "class",
    roles: ["admin", "all", "mr", "omp"],
    keyFields: ["id", "className", "classCode"],
  },
  {
    name: "Client",
    sub: "Client Information",
    path: "client",
    roles: ["admin", "all", "mr", "omp"],
    keyFields: [],
  },
  {
    name: "MOP",
    sub: "Method Of Payment",
    path: "mop",
    roles: ["admin", "all", "mr", "omp"],
    keyFields: ["id", "name"],
  },
  {
    name: "Office",
    sub: "Issuing Office",
    path: "office",
    roles: ["admin", "all", "mr", "omp"],
    keyFields: ["id", "officeName", "officeCode"],
  },
];

export default function FieldSettings() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Field Settings";
  }, []);

  const accessibleModules = modules.filter((mod) =>
    mod.roles.includes(user?.role)
  );

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <h1 className="text-4xl font-bold text-blue-950 mt-6 mb-10">
        Field Settings
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-6 pb-6">
        {accessibleModules.map((mod) => {
          // Compute keyFieldsParam here
          const keyFieldsParam = encodeURIComponent(
            JSON.stringify(mod.keyFields || [])
          );

          return (
            <Link
              to={`/field-settings/${mod.path}?keyFields=${keyFieldsParam}`}
              state={{ keyFields: mod.keyFields }} // ✅ optional, for history back
              key={mod.name}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 flex justify-between items-center cursor-pointer"
            >
              <div>
                <h2 className="text-2xl font-semibold text-blue-950">
                  {mod.name}
                </h2>
                <p className="text-gray-500">{mod.sub}</p>
              </div>
              <FaChevronRight size={30} className="text-blue-950" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
