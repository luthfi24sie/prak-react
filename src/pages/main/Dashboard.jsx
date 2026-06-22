import React, { useEffect, useState } from 'react';
import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaEllipsisH } from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";
import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalDelivered: 0,
        totalCanceled: 0,
        totalRevenue: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);

            const [
                { count: ordersCount },
                { count: deliveredCount },
                { count: canceledCount },
                { data: completedOrders },
                { data: recent },
            ] = await Promise.all([
                supabase.from('orders').select('*', { count: 'exact', head: true }),
                supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
                supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
                supabase.from('orders').select('total_amount').eq('status', 'completed'),
                supabase.from('orders').select('*, profiles(full_name)').order('created_at', { ascending: false }).limit(4),
            ]);

            const totalRevenue = (completedOrders || []).reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

            setStats({
                totalOrders: ordersCount || 0,
                totalDelivered: deliveredCount || 0,
                totalCanceled: canceledCount || 0,
                totalRevenue,
            });

            setRecentOrders(recent || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
    };

    const statusColor = (status) => {
        if (status === "completed") return "text-hijau bg-hijau/10";
        if (status === "pending") return "text-blue-500 bg-blue-50";
        if (status === "processing") return "text-yellow-600 bg-yellow-50";
        return "text-red-500 bg-red-50";
    };

    if (loading) {
        return (
            <div className="pb-10">
                <PageHeader title="Dashboard" breadcrumb={["Dashboard", "Order List"]} />
                <LoadingSpinner text="Memuat dashboard..." />
            </div>
        );
    }

    return (
        <div id="dashboard-container" className="pb-10">
            <PageHeader title="Dashboard" breadcrumb={["Dashboard", "Order List"]}>
                <button id="add-button" className="bg-hijau text-white px-4 py-2 rounded-lg font-bold">
                    Add Orders
                </button>
            </PageHeader>

            {/* Stats Grid */}
            <div id="dashboard-grid" className="px-5 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div id="dashboard-orders" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div id="orders-icon" className="bg-hijau rounded-2xl p-4 text-3xl text-white shadow-lg shadow-hijau/20">
                        <FaShoppingCart />
                    </div>
                    <div id="orders-info" className="flex flex-col">
                        <span id="orders-count" className="text-3xl font-extrabold text-teks">{stats.totalOrders}</span>
                        <span id="orders-text" className="text-sm font-medium text-gray-400">Total Orders</span>
                    </div>
                </div>

                <div id="dashboard-delivered" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div id="delivered-icon" className="bg-blue-500 rounded-2xl p-4 text-3xl text-white shadow-lg shadow-blue-500/20">
                        <FaTruck />
                    </div>
                    <div id="delivered-info" className="flex flex-col">
                        <span id="delivered-count" className="text-3xl font-extrabold text-teks">{stats.totalDelivered}</span>
                        <span id="delivered-text" className="text-sm font-medium text-gray-400">Total Delivered</span>
                    </div>
                </div>

                <div id="dashboard-canceled" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div id="canceled-icon" className="bg-red-500 rounded-2xl p-4 text-3xl text-white shadow-lg shadow-red-500/20">
                        <FaBan />
                    </div>
                    <div id="canceled-info" className="flex flex-col">
                        <span id="canceled-count" className="text-3xl font-extrabold text-teks">{stats.totalCanceled}</span>
                        <span id="canceled-text" className="text-sm font-medium text-gray-400">Total Canceled</span>
                    </div>
                </div>

                <div id="dashboard-revenue" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div id="revenue-icon" className="bg-yellow-500 rounded-2xl p-4 text-3xl text-white shadow-lg shadow-yellow-500/20">
                        <FaDollarSign />
                    </div>
                    <div id="revenue-info" className="flex flex-col">
                        <span id="revenue-amount" className="text-2xl font-extrabold text-teks">{formatRupiah(stats.totalRevenue)}</span>
                        <span id="revenue-text" className="text-sm font-medium text-gray-400">Total Revenue</span>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
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
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-gray-400 font-medium">Belum ada pesanan</td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-sm text-hijau">{order.id.slice(0, 8)}...</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                                                        {(order.profiles?.full_name || "?").charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-teks">{order.profiles?.full_name || "-"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-teks">{formatRupiah(order.total_amount)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-hijau text-sm font-bold hover:underline">Detail</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
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
