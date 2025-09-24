import { FaChevronRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import config from "../../utility/config";

const modules = [
  {
    title: "Class Of Business",
    subtitle: "Class Of Business",
    database: "class",
    keyFields: ["id", "name"],
    allowedRolesForView: config.roles.level_3,
    allowedRolesForEdit: config.roles.level_2,
    allowedRolesForDelete: config.roles.level_2,
  },
  {
    title: "File Category",
    subtitle: "File Category",
    database: "file_category",
    keyFields: ["id", "name"],
    allowedRolesForView: config.roles.level_3,
    allowedRolesForEdit: config.roles.level_2,
    allowedRolesForDelete: config.roles.level_2,
  },
  {
    title: "Insured Person",
    subtitle: "Insured Person",
    database: "insured",
    keyFields: ["id", "name", "address", "mobile", "email"],
    allowedRolesForView: config.roles.level_3,
    allowedRolesForEdit: config.roles.level_3,
    allowedRolesForDelete: config.roles.level_2,
  },
  {
    title: "Users",
    subtitle: "App Users",
    database: "users",
    keyFields: ["id", "username", "password", "role", "active"],
    allowedRolesForView: config.roles.level_1,
    allowedRolesForEdit: config.roles.level_1,
    // allowedRolesForDelete: config.roles.level_1,
  },
];

export default function Fields() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const accessibleModules = modules.filter((item) =>
    item.allowedRolesForView.includes(user?.role)
  );

  function handleOnClick(module) {
    navigate("/fields/list", { state: module });
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <h1 className="text-4xl font-bold text-blue-950 mt-6 mb-10">Data Sets</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-6 pb-6">
        {accessibleModules.map((item, index) => (
          <button
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 flex justify-between items-center cursor-pointer"
            onClick={() => handleOnClick(item)}
          >
            <div className="text-left">
              <h2 className="text-2xl font-semibold text-blue-950">
                {item.title}
              </h2>
              <p className="text-gray-500">{item?.subtitle}</p>
            </div>
            <FaChevronRight size={30} className="text-blue-950" />
          </button>
        ))}
      </div>
    </div>
  );
}
