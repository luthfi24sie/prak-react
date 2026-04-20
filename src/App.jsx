import React from 'react';
import { Routes, Route } from "react-router-dom";
import Sidebar from './layouts/Sidebar';
import Header from './layouts/Header';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import ErrorPage from './pages/ErrorPage';
import './assets/tailwind.css';

function App() {
  return (
    <div id="app-container" className="bg-gray-100 min-h-screen flex">
      <div id="layout-wrapper" className="flex flex-row flex-1">
        <Sidebar />
        <div id="main-content" className="flex-1 p-4 ml-64">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            
            {/* Error Routes */}
            <Route path="/error-400" element={
              <ErrorPage 
                errorCode="400" 
                description="Bad Request! Permintaan Anda tidak dapat dipahami oleh server." 
                imageUrl="https://illustrations.popsy.co/amber/resistance-band-training.svg"
              />
            } />
            <Route path="/error-401" element={
              <ErrorPage 
                errorCode="401" 
                description="Unauthorized! Anda tidak memiliki izin untuk mengakses halaman ini." 
                imageUrl="https://illustrations.popsy.co/amber/lock.svg"
              />
            } />
            <Route path="/error-403" element={
              <ErrorPage 
                errorCode="403" 
                description="Forbidden! Akses ke halaman ini dilarang." 
                imageUrl="https://illustrations.popsy.co/amber/shrugging-man.svg"
              />
            } />
            
            {/* 404 Route */}
            <Route path="*" element={
              <ErrorPage 
                errorCode="404" 
                description="Halaman Tidak Ditemukan! Maaf, halaman yang Anda cari tidak tersedia." 
                imageUrl="https://illustrations.popsy.co/amber/crashed-error.svg"
              />
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
