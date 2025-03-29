import React from "react";
import { Link, NavLink } from "react-router-dom";

const navigation = [
  { name: "Home", href: "dashboard" },
  { name: "Users", href: "users" },
  { name: "System", href: "system" },
];

const Sidebar = () => {
  return (
    <div className="h-screen bg-[#121820] col-span-2 text-white flex flex-col justify-between">
      <div className="flex flex-col">
        <p className="flex items-center justify-center mt-4">PASUGALAN</p>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => {
              return (
                "px-4 py-2 no-underline " + (isActive ? "bg-[#1E2A38]" : "")
              );
            }}
          >
            {item.name}
          </NavLink>
        ))}
      </div>
      <div className="px-4 py-2 no-underline bg-red-600 cursor-pointer mb-10">
        Logout
      </div>
    </div>
  );
};

export default Sidebar;
