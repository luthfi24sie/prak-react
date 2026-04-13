import React from 'react';
import { 
  FaHome, 
  FaListUl, 
  FaUsers,
  FaPlus
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div id="sidebar" className="w-64 bg-white min-h-screen border-r border-garis flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div id="sidebar-logo" className="p-8 flex flex-col">
        <span id="logo-title" className="font-poppins font-[1000] text-[48px] leading-tight text-teks">
          Sedap <b id="logo-dot" className="text-hijau">.</b>
        </span>
        <span id="logo-subtitle" className="text-teks-samping font-semibold font-barlow text-xs">Modern Admin Dashboard</span>
      </div>

      {/* List Menu */}
      <div id="sidebar-menu" className="flex-grow mt-4">
        <ul id="menu-list" className="space-y-2">
          <li className="px-8 py-4 bg-emerald-50 text-hijau border-r-4 border-hijau cursor-pointer flex items-center group">
            <FaHome className="mr-4 text-xl" />
            <span className="text-sm font-bold tracking-wide">Dashboard</span>
          </li>
          <li className="px-8 py-4 text-teks-samping hover:bg-slate-50 hover:text-teks cursor-pointer flex items-center group">
            <FaListUl className="mr-4 text-xl text-slate-300 group-hover:text-teks-samping" />
            <span className="text-sm font-bold tracking-wide">Orders</span>
          </li>
          <li className="px-8 py-4 text-teks-samping hover:bg-slate-50 hover:text-teks cursor-pointer flex items-center group">
            <FaUsers className="mr-4 text-xl text-slate-300 group-hover:text-teks-samping" />
            <span className="text-sm font-bold tracking-wide">Customers</span>
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
