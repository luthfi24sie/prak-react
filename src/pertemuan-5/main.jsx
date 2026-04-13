import React from 'react';
import Sidebar from './layouts/Sidebar';
import Header from './layouts/Header';
import Dashboard from './pages/Dashboard';
import './assets/tailwind.css';

const Pertemuan5 = () => {
  return (
    <div id="app-container" className="bg-gray-100 min-h-screen flex">
      <div id="layout-wrapper" className="flex flex-row flex-1">
        <Sidebar />
        <div id="main-content" className="flex-1 p-4 ml-64">
          <Header />
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default Pertemuan5;
