import React, { useMemo, useState } from 'react';
import PageHeader from "../../components/PageHeader";

export default function Orders() {
    const initialOrders = useMemo(() => ([
        { orderId: "ORD-1001", customerName: "Budi Santoso", status: "Completed", totalPrice: 125000, orderDate: "2026-03-10" },
        { orderId: "ORD-1002", customerName: "Siti Aminah", status: "Pending", totalPrice: 78000, orderDate: "2026-03-11" },
        { orderId: "ORD-1003", customerName: "Andi Wijaya", status: "Cancelled", totalPrice: 56000, orderDate: "2026-03-11" },
        { orderId: "ORD-1004", customerName: "Dewi Lestari", status: "Completed", totalPrice: 214000, orderDate: "2026-03-12" },
        { orderId: "ORD-1005", customerName: "Rizky Pratama", status: "Pending", totalPrice: 99000, orderDate: "2026-03-12" },
        { orderId: "ORD-1006", customerName: "Nabila Putri", status: "Completed", totalPrice: 143000, orderDate: "2026-03-13" },
        { orderId: "ORD-1007", customerName: "Ahmad Fauzi", status: "Cancelled", totalPrice: 67000, orderDate: "2026-03-13" },
        { orderId: "ORD-1008", customerName: "Intan Permata", status: "Pending", totalPrice: 159000, orderDate: "2026-03-14" },
        { orderId: "ORD-1009", customerName: "Dimas Saputra", status: "Completed", totalPrice: 88000, orderDate: "2026-03-14" },
        { orderId: "ORD-1010", customerName: "Putri Aulia", status: "Pending", totalPrice: 132000, orderDate: "2026-03-15" },
        { orderId: "ORD-1011", customerName: "Fajar Nugroho", status: "Completed", totalPrice: 175000, orderDate: "2026-03-15" },
        { orderId: "ORD-1012", customerName: "Maya Sari", status: "Cancelled", totalPrice: 46000, orderDate: "2026-03-16" },
        { orderId: "ORD-1013", customerName: "Rina Kurnia", status: "Pending", totalPrice: 71000, orderDate: "2026-03-16" },
        { orderId: "ORD-1014", customerName: "Yusuf Ramadhan", status: "Completed", totalPrice: 201000, orderDate: "2026-03-17" },
        { orderId: "ORD-1015", customerName: "Sarah Nabila", status: "Completed", totalPrice: 94000, orderDate: "2026-03-17" },
        { orderId: "ORD-1016", customerName: "Gilang Prakoso", status: "Pending", totalPrice: 119000, orderDate: "2026-03-18" },
        { orderId: "ORD-1017", customerName: "Ayu Wulandari", status: "Cancelled", totalPrice: 52000, orderDate: "2026-03-18" },
        { orderId: "ORD-1018", customerName: "Hendra Gunawan", status: "Completed", totalPrice: 187000, orderDate: "2026-03-19" },
        { orderId: "ORD-1019", customerName: "Tika Maharani", status: "Pending", totalPrice: 63000, orderDate: "2026-03-19" },
        { orderId: "ORD-1020", customerName: "Bagas Aditya", status: "Completed", totalPrice: 221000, orderDate: "2026-03-20" },
        { orderId: "ORD-1021", customerName: "Rafi Akbar", status: "Pending", totalPrice: 84000, orderDate: "2026-03-20" },
        { orderId: "ORD-1022", customerName: "Vina Melati", status: "Completed", totalPrice: 156000, orderDate: "2026-03-21" },
        { orderId: "ORD-1023", customerName: "Nanda Putra", status: "Cancelled", totalPrice: 49000, orderDate: "2026-03-21" },
        { orderId: "ORD-1024", customerName: "Shinta Ayu", status: "Pending", totalPrice: 108000, orderDate: "2026-03-22" },
        { orderId: "ORD-1025", customerName: "Arif Setiawan", status: "Completed", totalPrice: 193000, orderDate: "2026-03-22" },
        { orderId: "ORD-1026", customerName: "Dinda Mahesa", status: "Pending", totalPrice: 76000, orderDate: "2026-03-23" },
        { orderId: "ORD-1027", customerName: "Kevin Pratama", status: "Completed", totalPrice: 168000, orderDate: "2026-03-23" },
        { orderId: "ORD-1028", customerName: "Anisa Rahma", status: "Cancelled", totalPrice: 41000, orderDate: "2026-03-24" },
        { orderId: "ORD-1029", customerName: "Doni Haryanto", status: "Pending", totalPrice: 97000, orderDate: "2026-03-24" },
        { orderId: "ORD-1030", customerName: "Nia Paramitha", status: "Completed", totalPrice: 209000, orderDate: "2026-03-25" },
    ]), []);

    const [orders, setOrders] = useState(initialOrders);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [form, setForm] = useState({
        customerName: "",
        status: "Pending",
        totalPrice: "",
        orderDate: "",
    });

    const statusClass = (status) => {
        if (status === "Completed") return "text-hijau bg-hijau/10";
        if (status === "Pending") return "text-blue-600 bg-blue-50";
        return "text-red-600 bg-red-50";
    };

    const formatRupiah = (value) => {
        const numberValue = typeof value === "number" ? value : Number(value);
        if (!Number.isFinite(numberValue)) return "-";
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(numberValue);
    };

    const createNextOrderId = (currentOrders) => {
        const maxNumber = currentOrders.reduce((acc, item) => {
            const match = String(item.orderId).match(/(\d+)$/);
            const n = match ? Number(match[1]) : 0;
            return Math.max(acc, n);
        }, 0);
        return `ORD-${String(maxNumber + 1).padStart(4, "0")}`;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const total = Number(form.totalPrice);
        if (!form.customerName.trim()) return;
        if (!Number.isFinite(total) || total <= 0) return;
        if (!form.orderDate) return;

        const next = {
            orderId: createNextOrderId(orders),
            customerName: form.customerName.trim(),
            status: form.status,
            totalPrice: total,
            orderDate: form.orderDate,
        };

        setOrders([next, ...orders]);
        setIsAddOpen(false);
        setForm({ customerName: "", status: "Pending", totalPrice: "", orderDate: "" });
    };

    return (
        <div id="orders-container" className="pb-10">
            <PageHeader title="Orders" breadcrumb={["Dashboard", "Order List"]}>
                <button
                    type="button"
                    onClick={() => setIsAddOpen(true)}
                    className="bg-hijau text-white px-4 py-2 rounded-lg font-bold"
                >
                    Add Orders
                </button>
            </PageHeader>
            <div className="px-5 mt-4">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-teks">Daftar Order</h2>
                            <p className="text-sm text-gray-400 font-medium">Total data: {orders.length}</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total Price</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map((order) => (
                                    <tr key={order.orderId} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-sm text-hijau">{order.orderId}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                                                    {order.customerName.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-teks">{order.customerName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClass(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-teks">{formatRupiah(order.totalPrice)}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{order.orderDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setIsAddOpen(false)}
                    />
                    <div className="relative w-full max-w-xl mx-4 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-teks">Add Orders</h3>
                                <p className="text-sm text-gray-400 font-medium">Isi form sesuai atribut JSON Orders</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddOpen(false)}
                                className="px-3 py-2 rounded-xl hover:bg-gray-50 font-bold text-gray-400 hover:text-teks transition-colors"
                            >
                                Close
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="p-6 grid grid-cols-1 gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-teks">Customer Name</label>
                                    <input
                                        value={form.customerName}
                                        onChange={(e) => setForm((prev) => ({ ...prev, customerName: e.target.value }))}
                                        className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all"
                                        placeholder="Nama customer"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-teks">Status</label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                                        className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all bg-white"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-teks">Total Price</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={form.totalPrice}
                                        onChange={(e) => setForm((prev) => ({ ...prev, totalPrice: e.target.value }))}
                                        className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all"
                                        placeholder="Contoh: 125000"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-teks">Order Date</label>
                                    <input
                                        type="date"
                                        value={form.orderDate}
                                        onChange={(e) => setForm((prev) => ({ ...prev, orderDate: e.target.value }))}
                                        className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddOpen(false)}
                                    className="px-5 py-3 rounded-xl font-bold text-gray-500 hover:text-teks hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-hijau text-white px-5 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                                >
                                    Save Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
