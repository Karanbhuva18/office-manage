import { routes } from "../utils/routes";
import { NavLink } from "react-router-dom";
const SideBar = () => {
  return (
    <div className="hidden md:flex flex-col bg-gray-900 w-56 h-screen sticky top-0">
      <div className="text-xl font-bold text-white border-b-2 border-gray-600 px-6 py-2 ">
        ERP System
      </div>
      <div className="flex flex-col px-4 py-2 gap-1">
        {routes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            end={route.path === "/"}
            className={({ isActive }) =>
              `text-white p-2 hover:bg-gray-700 cursor-pointer rounded-lg ${
                isActive ? "bg-blue-400" : ""
              }`
            }
          >
            <route.icon className="inline-block mr-2" width={18} height={18} />

            <span className="text-[14px]">{route.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
