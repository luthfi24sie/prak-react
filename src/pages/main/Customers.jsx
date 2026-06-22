import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import AlertBox from "../../components/AlertBox";

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [form, setForm] = useState({
        full_name: "",
        phone: "",
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            setError("");
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'member')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCustomers(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const tierClass = (tier) => {
        if (tier === "gold") return "text-yellow-700 bg-yellow-50";
        if (tier === "silver") return "text-gray-700 bg-gray-100";
        if (tier === "platinum") return "text-purple-700 bg-purple-50";
        return "text-amber-700 bg-amber-50";
    };

    const openEdit = (customer) => {
        setEditingCustomer(customer);
        setForm({
            full_name: customer.full_name || "",
            phone: customer.phone || "",
        });
        setIsEditOpen(true);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { error } = await supabase.from('profiles').update({
                full_name: form.full_name,
                phone: form.phone,
            }).eq('id', editingCustomer.id);
            if (error) throw error;
            setSuccess("Data customer berhasil diupdate!");
            setIsEditOpen(false);
            await loadCustomers();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSoftDelete = async (id) => {
        if (!confirm("Yakin ingin menonaktifkan customer ini?")) return;
        try {
            setLoading(true);
            const { error } = await supabase.from('profiles').update({ is_active: false }).eq('id', id);
            if (error) throw error;
            setSuccess("Customer berhasil dinonaktifkan!");
            await loadCustomers();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleActivate = async (id) => {
        try {
            setLoading(true);
            const { error } = await supabase.from('profiles').update({ is_active: true }).eq('id', id);
            if (error) throw error;
            setSuccess("Customer berhasil diaktifkan!");
            await loadCustomers();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="customers-container" className="pb-10">
            <PageHeader title="Customers" breadcrumb={["Dashboard", "Customer List"]} />

            {error && <div className="px-5"><AlertBox type="error">{error}</AlertBox></div>}
            {success && <div className="px-5"><AlertBox type="success">{success}</AlertBox></div>}

            <div className="px-5 mt-4">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-teks">Daftar Customer</h2>
                            <p className="text-sm text-gray-400 font-medium">Total data: {customers.length}</p>
                        </div>
                    </div>

                    {loading && customers.length === 0 ? (
                        <LoadingSpinner text="Memuat data customer..." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nama</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tier</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Poin</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {customers.map((customer) => (
                                        <tr key={customer.id} className={`hover:bg-gray-50/50 transition-colors ${!customer.is_active ? 'opacity-50' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                                                        {(customer.full_name || "?").charAt(0)}
                                                    </div>
                                                    <Link to={`/customers/${customer.id}`} className="text-sm font-bold text-teks hover:text-hijau">
                                                        {customer.full_name || "-"}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-500">{customer.email || "-"}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-500">{customer.phone || "-"}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tierClass(customer.tier)}`}>
                                                    {customer.tier}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-teks">{customer.total_points?.toLocaleString() || 0}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${customer.is_active ? 'text-hijau bg-hijau/10' : 'text-red-600 bg-red-50'}`}>
                                                    {customer.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <Link to={`/customers/${customer.id}`} className="text-hijau text-sm font-bold hover:underline">Detail</Link>
                                                <button onClick={() => openEdit(customer)} className="text-blue-500 text-sm font-bold hover:underline">Edit</button>
                                                {customer.is_active ? (
                                                    <button onClick={() => handleSoftDelete(customer.id)} className="text-red-500 text-sm font-bold hover:underline">Deactivate</button>
                                                ) : (
                                                    <button onClick={() => handleActivate(customer.id)} className="text-green-500 text-sm font-bold hover:underline">Activate</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
                    <div className="relative w-full max-w-xl mx-4 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-teks">Edit Customer</h3>
                                <p className="text-sm text-gray-400 font-medium">Ubah data customer</p>
                            </div>
                            <button type="button" onClick={() => setIsEditOpen(false)} className="px-3 py-2 rounded-xl hover:bg-gray-50 font-bold text-gray-400 hover:text-teks transition-colors">Close</button>
                        </div>
                        <form onSubmit={handleEdit} className="p-6 grid grid-cols-1 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-teks">Nama Lengkap</label>
                                <input
                                    value={form.full_name}
                                    onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
                                    className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all"
                                    placeholder="Nama customer"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-teks">Phone</label>
                                <input
                                    value={form.phone}
                                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                                    className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all"
                                    placeholder="08xx-xxxx-xxxx"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-3 rounded-xl font-bold text-gray-500 hover:text-teks hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="bg-hijau text-white px-5 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
