import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import AlertBox from "../../components/AlertBox";

export default function Products() {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Modal states
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError("");
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return products;
        return products.filter((item) => {
            const haystack = `${item.name} ${item.category} ${item.description || ''}`.toLowerCase();
            return haystack.includes(q);
        });
    }, [query, products]);

    const formatRupiah = (value) => {
        const numberValue = typeof value === "number" ? value : Number(value);
        if (!Number.isFinite(numberValue)) return "-";
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(numberValue);
    };

    const resetForm = () => setForm({ name: "", description: "", price: "", stock: "", category: "" });

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { error } = await supabase.from('products').insert({
                name: form.name,
                description: form.description || null,
                price: Number(form.price),
                stock: Number(form.stock),
                category: form.category || null,
            });
            if (error) throw error;
            setSuccess("Produk berhasil ditambahkan!");
            setIsAddOpen(false);
            resetForm();
            await loadProducts();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            description: product.description || "",
            price: String(product.price),
            stock: String(product.stock),
            category: product.category || "",
        });
        setIsEditOpen(true);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { error } = await supabase.from('products').update({
                name: form.name,
                description: form.description || null,
                price: Number(form.price),
                stock: Number(form.stock),
                category: form.category || null,
            }).eq('id', editingProduct.id);
            if (error) throw error;
            setSuccess("Produk berhasil diupdate!");
            setIsEditOpen(false);
            resetForm();
            await loadProducts();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSoftDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus produk ini?")) return;
        try {
            setLoading(true);
            const { error } = await supabase.from('products').update({ is_active: false }).eq('id', id);
            if (error) throw error;
            setSuccess("Produk berhasil dihapus!");
            await loadProducts();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formFields = (
        <>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-teks">Nama Produk</label>
                <input
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all"
                    placeholder="Nama produk"
                    required
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-teks">Harga</label>
                    <input
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                        className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all"
                        placeholder="Contoh: 50000"
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-teks">Stok</label>
                    <input
                        type="number"
                        min="0"
                        value={form.stock}
                        onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
                        className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all"
                        placeholder="Contoh: 100"
                        required
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-teks">Kategori</label>
                <input
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all"
                    placeholder="Kategori produk"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-teks">Deskripsi</label>
                <textarea
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all resize-none"
                    placeholder="Deskripsi produk (opsional)"
                    rows="2"
                />
            </div>
        </>
    );

    return (
        <div id="products-container" className="pb-10">
            <PageHeader title="Products" breadcrumb={["Dashboard", "Product List"]}>
                <button
                    type="button"
                    onClick={() => { resetForm(); setIsAddOpen(true); }}
                    className="bg-hijau text-white px-4 py-2 rounded-lg font-bold"
                >
                    Add Product
                </button>
            </PageHeader>

            {error && <div className="px-5"><AlertBox type="error">{error}</AlertBox></div>}
            {success && <div className="px-5"><AlertBox type="success">{success}</AlertBox></div>}

            <div className="px-5 mt-4">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50">
                        <div className="flex flex-col gap-3">
                            <div>
                                <h2 className="text-xl font-bold text-teks">Daftar Produk</h2>
                                <p className="text-sm text-gray-400 font-medium">Total data: {filtered.length}</p>
                            </div>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari produk..."
                                className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all w-full max-w-xl"
                            />
                        </div>
                    </div>

                    {loading && products.length === 0 ? (
                        <LoadingSpinner text="Memuat produk..." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-hijau">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">#</th>
                                        <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filtered.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-gray-500">{index + 1}.</td>
                                            <td className="px-6 py-4">
                                                <span className="text-hijau font-bold">{item.name}</span>
                                                {item.description && (
                                                    <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-500">{item.category || "-"}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-teks">{formatRupiah(item.price)}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-teks">{item.stock}</td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <button
                                                    onClick={() => openEdit(item)}
                                                    className="text-blue-500 text-sm font-bold hover:underline"
                                                >Edit</button>
                                                <button
                                                    onClick={() => handleSoftDelete(item.id)}
                                                    className="text-red-500 text-sm font-bold hover:underline"
                                                >Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
                    <div className="relative w-full max-w-xl mx-4 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-teks">Add Product</h3>
                                <p className="text-sm text-gray-400 font-medium">Tambah produk baru</p>
                            </div>
                            <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-2 rounded-xl hover:bg-gray-50 font-bold text-gray-400 hover:text-teks transition-colors">Close</button>
                        </div>
                        <form onSubmit={handleAdd} className="p-6 grid grid-cols-1 gap-4">
                            {formFields}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsAddOpen(false)} className="px-5 py-3 rounded-xl font-bold text-gray-500 hover:text-teks hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="bg-hijau text-white px-5 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
                    <div className="relative w-full max-w-xl mx-4 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-teks">Edit Product</h3>
                                <p className="text-sm text-gray-400 font-medium">Ubah data produk</p>
                            </div>
                            <button type="button" onClick={() => setIsEditOpen(false)} className="px-3 py-2 rounded-xl hover:bg-gray-50 font-bold text-gray-400 hover:text-teks transition-colors">Close</button>
                        </div>
                        <form onSubmit={handleEdit} className="p-6 grid grid-cols-1 gap-4">
                            {formFields}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-3 rounded-xl font-bold text-gray-500 hover:text-teks hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="bg-hijau text-white px-5 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors">Update Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
