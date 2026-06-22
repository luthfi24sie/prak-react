import React, { useState, useEffect } from 'react';
import { supabase } from "../../lib/supabaseClient";
import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import AlertBox from "../../components/AlertBox";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");
            const { data, error } = await supabase
                .from('orders')
                .select('*, profiles(full_name)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const statusClass = (status) => {
        if (status === "completed") return "text-hijau bg-hijau/10";
        if (status === "pending") return "text-blue-600 bg-blue-50";
        if (status === "processing") return "text-yellow-600 bg-yellow-50";
        return "text-red-600 bg-red-50";
    };

    const formatRupiah = (value) => {
        const numberValue = typeof value === "number" ? value : Number(value);
        if (!Number.isFinite(numberValue)) return "-";
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(numberValue);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric", month: "short", year: "numeric"
        });
    };

    const handleStatusChange = async (order, newStatus) => {
        try {
            setLoading(true);
            setError("");

            // 1. Update status pesanan
            const { error: updateError } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', order.id);

            if (updateError) throw updateError;

            // 2. Jika completed, hitung dan tambah poin
            if (newStatus === 'completed') {
                // Ambil tier member
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('tier')
                    .eq('id', order.user_id)
                    .single();

                const userTier = profile?.tier || 'bronze';

                // Hitung poin
                const { data: pointsEarned, error: calcError } = await supabase.rpc('calculate_points', {
                    p_total_amount: order.total_amount,
                    p_tier: userTier,
                });

                if (!calcError && pointsEarned) {
                    // Update poin di pesanan
                    await supabase.from('orders').update({ points_earned: pointsEarned }).eq('id', order.id);

                    // Tambah poin dan update tier member
                    await supabase.rpc('add_points_and_update_tier', {
                        p_user_id: order.user_id,
                        p_points: pointsEarned,
                    });
                }
            }

            setSuccess(`Status pesanan berhasil diubah ke ${newStatus}!`);
            await loadOrders();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (orderId) => {
        if (!confirm("Yakin ingin menghapus pesanan ini?")) return;
        try {
            setLoading(true);
            const { error } = await supabase.from('orders').delete().eq('id', orderId);
            if (error) throw error;
            setSuccess("Pesanan berhasil dihapus!");
            await loadOrders();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getNextStatuses = (currentStatus) => {
        switch (currentStatus) {
            case 'pending': return ['processing', 'cancelled'];
            case 'processing': return ['completed', 'cancelled'];
            default: return [];
        }
    };

    return (
        <div id="orders-container" className="pb-10">
            <PageHeader title="Orders" breadcrumb={["Dashboard", "Order List"]} />

            {error && <div className="px-5"><AlertBox type="error">{error}</AlertBox></div>}
            {success && <div className="px-5"><AlertBox type="success">{success}</AlertBox></div>}

            <div className="px-5 mt-4">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-teks">Daftar Order</h2>
                            <p className="text-sm text-gray-400 font-medium">Total data: {orders.length}</p>
                        </div>
                    </div>

                    {loading && orders.length === 0 ? (
                        <LoadingSpinner text="Memuat data pesanan..." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Poin</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {orders.map((order) => (
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
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClass(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-teks">{formatRupiah(order.total_amount)}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-teks">
                                                {order.points_earned > 0 ? `+${order.points_earned}` : "-"}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-500">{formatDate(order.created_at)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 flex-wrap">
                                                    {getNextStatuses(order.status).map((nextStatus) => (
                                                        <button
                                                            key={nextStatus}
                                                            onClick={() => handleStatusChange(order, nextStatus)}
                                                            className={`text-xs font-bold px-2 py-1 rounded-lg capitalize ${
                                                                nextStatus === 'completed' ? 'bg-hijau/10 text-hijau hover:bg-hijau/20' :
                                                                nextStatus === 'cancelled' ? 'bg-red-50 text-red-500 hover:bg-red-100' :
                                                                'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                                                            }`}
                                                        >
                                                            {nextStatus}
                                                        </button>
                                                    ))}
                                                    {order.status === 'cancelled' && (
                                                        <button
                                                            onClick={() => handleDelete(order.id)}
                                                            className="text-xs font-bold px-2 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
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
