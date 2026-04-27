import React, { Suspense } from 'react';
//import { Routes, Route } from "react-router-dom";
//import './assets/tailwind.css';
//import MainLayout from './layouts/MainLayout';
//import Login from './pages/auth/Login';
//import Register from './pages/auth/Register';
//import Forgot from './pages/auth/Forgot';
//import Orders from './pages/main/Orders';
//import Customers from './pages/main/Customers';
//import ErrorPage from './pages/main/ErrorPage';
//import AuthLayout from './layouts/AuthLayout';
//import Loading from './components/Loading';

const Dashboard = React.lazy(() => import("./pages/main/Dashboard"))
const MainLayout = React.lazy(() => import("./layouts/mainLayout"))
const  Login = React.lazy(() => import("./pages/auth/Login"))
const  Register = React.lazy(() => import("./pages/auth/Register"))
const Forgot = React.lazy(() => import("./pages/auth/Forgot"))
const Orders = React.lazy(() => import("./pages/main/Orders"))
const Customers = React.lazy(() => import("./pages/main/Customers"))
const ErrorPage = React.lazy(() => import("./pages/main/ErrorPage"))
const  AuthLayout = React.lazy(() => import("./layouts/AuthLayout"))
const Loading = React.lazy(() => import("./components/Loading"))
function App() {
  return (
    <Suspense fallback={<Loading />}>

      <Routes>
        <Route element={<MainLayout />}>
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
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>
      </Routes>
    </Suspense>
  )

}

export default App;
