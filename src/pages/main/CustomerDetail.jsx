import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function CustomerDetail() {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCustomerDetail();
    }, [id]);

    const loadCustomerDetail = async () => {
        try {
            setLoading(true);

            // Fetch profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (!profileError && profile) {
                setCustomer(profile);
            }

            // Fetch orders
            const { data: orderData } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', id)
                .order('created_at', { ascending: false });

            setOrders(orderData || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="pb-10">
                <PageHeader title="Customer Detail" breadcrumb={["Dashboard", "Customers", "Loading..."]} />
                <LoadingSpinner text="Memuat detail customer..." />
            </div>
        );
    }

    if (!customer) {
        return (
            <div id="customer-detail-container" className="pb-10">
                <PageHeader title="Customer Detail" breadcrumb={["Dashboard", "Customers", "Not Found"]} />
                <div className="px-5 mt-4">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
                        <h2 className="text-2xl font-extrabold text-teks mb-2">Customer tidak ditemukan</h2>
                        <p className="text-gray-400 font-medium mb-6">ID: {id}</p>
                        <Link to="/customers" className="inline-flex bg-hijau text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors">
                            Kembali ke Customers
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const tierBadge = (tier) => {
        const badges = { bronze: "🥉", silver: "🥈", gold: "🥇", platinum: "💎" };
        return badges[tier] || "🥉";
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
    };

    const statusClass = (status) => {
        if (status === "completed") return "text-hijau bg-hijau/10";
        if (status === "pending") return "text-blue-600 bg-blue-50";
        if (status === "processing") return "text-yellow-600 bg-yellow-50";
        return "text-red-600 bg-red-50";
    };

    return (
        <div id="customer-detail-container" className="pb-10">
            <PageHeader
                title="Customer Detail"
                breadcrumb={["Dashboard", "Customers", customer.full_name || customer.id]}
            >
                <Link to="/customers" className="bg-hijau text-white px-4 py-2 rounded-lg font-bold">
                    Back
                </Link>
            </PageHeader>

            <div className="px-5 mt-4">
                {/* Profile Info */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-hijau/10 text-hijau flex items-center justify-center font-extrabold text-xl">
                            {(customer.full_name || "?").charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-teks">{customer.full_name || "-"}</h2>
                            <p className="text-sm text-gray-400 font-medium">{customer.id.slice(0, 8)}...</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-5 rounded-2xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                            <p className="text-teks font-bold">{customer.email || "-"}</p>
                        </div>
                        <div className="p-5 rounded-2xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                            <p className="text-teks font-bold">{customer.phone || "-"}</p>
                        </div>
                        <div className="p-5 rounded-2xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tier</p>
                            <p className="text-teks font-bold">{tierBadge(customer.tier)} <span className="capitalize">{customer.tier}</span></p>
                        </div>
                        <div className="p-5 rounded-2xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Poin</p>
                            <p className="text-teks font-bold">{customer.total_points?.toLocaleString() || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Order History */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50">
                        <h2 className="text-xl font-bold text-teks">History Pesanan</h2>
                        <p className="text-sm text-gray-400 font-medium">Total: {orders.length} pesanan</p>
                    </div>

                    {orders.length === 0 ? (
                        <div className="p-10 text-center text-gray-400 font-medium">Belum ada pesanan</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Poin</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 text-sm font-bold text-hijau">{order.id.slice(0, 8)}...</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClass(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-teks">{formatRupiah(order.total_amount)}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-teks">{order.points_earned}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString("id-ID")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
