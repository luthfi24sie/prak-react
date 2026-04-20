import React from 'react';
import { NavLink } from "react-router-dom";
import { 
  FaHome, 
  FaListUl, 
  FaUsers,
  FaPlus,
  FaExclamationTriangle,
  FaLock,
  FaBan
} from "react-icons/fa";

export default function Sidebar() {
  const menuClass = ({ isActive }) => 
    `flex cursor-pointer items-center rounded-xl p-4 space-x-2 transition-all 
    ${isActive ? 
        "text-hijau bg-green-200 font-extrabold" : 
        "text-gray-600 hover:text-hijau hover:bg-green-200 hover:font-extrabold" 
    }`

  return (
    <div id="sidebar" className="w-64 bg-white min-h-screen border-r border-garis flex flex-col fixed left-0 top-0 z-40 overflow-y-auto">
      {/* Logo */}
      <div id="sidebar-logo" className="p-8 flex flex-col">
        <span id="logo-title" className="font-poppins font-[1000] text-[48px] leading-tight text-teks">
          Sedap <b id="logo-dot" className="text-hijau">.</b>
        </span>
        <span id="logo-subtitle" className="text-teks-samping font-semibold font-barlow text-xs">Modern Admin Dashboard</span>
      </div>

      {/* List Menu */}
      <div id="sidebar-menu" className="flex-grow mt-4 px-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">Main Menu</p>
        <ul id="menu-list" className="space-y-2 mb-6">
          <li>
            <NavLink to="/" className={menuClass}>
              <FaHome className="mr-2 text-xl" />
              <span className="text-sm tracking-wide">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/orders" className={menuClass}>
              <FaListUl className="mr-2 text-xl" />
              <span className="text-sm tracking-wide">Orders</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/customers" className={menuClass}>
              <FaUsers className="mr-2 text-xl" />
              <span className="text-sm tracking-wide">Customers</span>
            </NavLink>
          </li>
        </ul>

        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">Error Pages</p>
        <ul className="space-y-2">
          <li>
            <NavLink to="/error-400" className={menuClass}>
              <FaExclamationTriangle className="mr-2 text-xl" />
              <span className="text-sm tracking-wide">Error 400</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/error-401" className={menuClass}>
              <FaLock className="mr-2 text-xl" />
              <span className="text-sm tracking-wide">Error 401</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/error-403" className={menuClass}>
              <FaBan className="mr-2 text-xl" />
              <span className="text-sm tracking-wide">Error 403</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div id="sidebar-footer" className="p-8 mt-auto flex flex-col gap-4">
        <div id="footer-card" className="bg-hijau px-4 py-2 rounded-md shadow-lg mb-10 flex items-center">
          <div id="footer-text" className="text-white text-sm">
            <span>Please organize your menus through button below!</span>
            <div id="add-menu-button" className="flex justify-center items-center p-2 mt-3 bg-white rounded-md space-x-2">
              <FaPlus className="text-gray-600" />
              <span className="text-gray-600 flex items-center">Add Menus</span>
            </div>
          </div>
          <img id="footer-avatar" src="https://avatar.iran.liara.run/public/28" className="w-20 rounded-full" alt="Avatar" />
        </div>
        
        <div className="flex flex-col gap-1">
          <span id="footer-brand" className="font-bold text-gray-400 text-[10px] uppercase tracking-widest">Sedap Restaurant Admin Dashboard</span>
          <p id="footer-copyright" className="font-light text-gray-400 text-[10px]">&copy; 2025 All Right Reserved</p>
        </div>
      </div>
    </div>
  );
}
