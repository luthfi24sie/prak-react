import React from 'react';
import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaEllipsisH } from "react-icons/fa"; 
import PageHeader from "../components/PageHeader";

export default function Dashboard() { 
    const recentOrders = [
        { id: "#OR-1234", customer: "Budi Santoso", menu: "Nasi Goreng Spesial", amount: "Rp 35.000", status: "Delivered", color: "text-hijau bg-hijau/10" },
        { id: "#OR-1235", customer: "Siti Aminah", menu: "Ayam Bakar Madu", amount: "Rp 42.000", status: "Pending", color: "text-blue-500 bg-blue-50" },
        { id: "#OR-1236", customer: "Andi Wijaya", menu: "Es Teh Manis", amount: "Rp 5.000", status: "Canceled", color: "text-red-500 bg-red-50" },
        { id: "#OR-1237", customer: "Dewi Lestari", menu: "Sate Kambing", amount: "Rp 55.000", status: "Delivered", color: "text-hijau bg-hijau/10" },
    ];

    return ( 
        <div id="dashboard-container" className="pb-10"> 
            <PageHeader title="Dashboard" breadcrumb={["Dashboard", "Order List"]}>
                <button id="add-button" className="bg-hijau text-white px-4 py-2 rounded-lg font-bold">
                    Add Orders
                </button>
            </PageHeader> 
            
            {/* Stats Grid */}
            <div id="dashboard-grid" className="px-5 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> 
                {/* Total Orders */}
                <div id="dashboard-orders" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"> 
                    <div id="orders-icon" className="bg-hijau rounded-2xl p-4 text-3xl text-white shadow-lg shadow-hijau/20"> 
                        <FaShoppingCart /> 
                    </div> 
                    <div id="orders-info" className="flex flex-col"> 
                        <span id="orders-count" className="text-3xl font-extrabold text-teks">75</span> 
                        <span id="orders-text" className="text-sm font-medium text-gray-400">Total Orders</span> 
                    </div> 
                </div> 

                {/* Total Delivered */}
                <div id="dashboard-delivered" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"> 
                    <div id="delivered-icon" className="bg-blue-500 rounded-2xl p-4 text-3xl text-white shadow-lg shadow-blue-500/20"> 
                        <FaTruck /> 
                    </div> 
                    <div id="delivered-info" className="flex flex-col"> 
                        <span id="delivered-count" className="text-3xl font-extrabold text-teks">175</span> 
                        <span id="delivered-text" className="text-sm font-medium text-gray-400">Total Delivered</span> 
                    </div> 
                </div> 

                {/* Total Canceled */}
                <div id="dashboard-canceled" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"> 
                    <div id="canceled-icon" className="bg-red-500 rounded-2xl p-4 text-3xl text-white shadow-lg shadow-red-500/20"> 
                        <FaBan /> 
                    </div> 
                    <div id="canceled-info" className="flex flex-col"> 
                        <span id="canceled-count" className="text-3xl font-extrabold text-teks">40</span> 
                        <span id="canceled-text" className="text-sm font-medium text-gray-400">Total Canceled</span> 
                    </div> 
                </div> 

                {/* Total Revenue */}
                <div id="dashboard-revenue" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"> 
                    <div id="revenue-icon" className="bg-yellow-500 rounded-2xl p-4 text-3xl text-white shadow-lg shadow-yellow-500/20"> 
                        <FaDollarSign /> 
                    </div> 
                    <div id="revenue-info" className="flex flex-col"> 
                        <span id="revenue-amount" className="text-3xl font-extrabold text-teks">Rp.128</span> 
                        <span id="revenue-text" className="text-sm font-medium text-gray-400">Total Revenue</span> 
                    </div> 
                </div> 
            </div> 

            {/* Recent Orders Table (Improvisasi 3) */}
            <div id="recent-orders-container" className="px-5 mt-4">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-teks">Pesanan Terbaru</h2>
                            <p className="text-sm text-gray-400 font-medium">Pantau pesanan masuk secara real-time</p>
                        </div>
                        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                            <FaEllipsisH className="text-gray-300" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID Pesanan</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Pelanggan</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Menu</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-sm text-hijau">{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                                                    {order.customer.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-teks">{order.customer}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{order.menu}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-teks">{order.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.color}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-hijau text-sm font-bold hover:underline">Detail</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-center">
                        <button className="text-sm font-bold text-gray-400 hover:text-hijau transition-colors">Lihat Semua Pesanan</button>
                    </div>
                </div>
            </div>
        </div> 
    ); 
} 
