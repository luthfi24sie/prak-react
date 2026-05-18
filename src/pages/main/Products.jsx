import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import products from "./products.json";

export default function Products() {
    const [query, setQuery] = useState("");

    
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return products;
        return products.filter((item) => {
            const haystack = `${item.title} ${item.code} ${item.category} ${item.brand}`.toLowerCase();
            return haystack.includes(q);
        });
    }, [query]);

    const formatRupiah = (value) => {
        const numberValue = typeof value === "number" ? value : Number(value);
        if (!Number.isFinite(numberValue)) return "-";
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(numberValue * 1000);
    };

    return (
        <div id="products-container" className="pb-10">
            <PageHeader title="Products" breadcrumb={["Dashboard", "Product List"]} />

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
                                placeholder="Cari produk (update deploy)..."
                                className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all w-full max-w-xl"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-hijau">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">#</th>
                                    <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Brand</th>
                                    <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-500">{index + 1}.</td>
                                        <td className="px-6 py-4">
                                            <Link to={`/products/${item.id}`} className="text-hijau font-bold hover:underline">
                                                {item.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{item.code}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{item.category}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{item.brand}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-teks">{formatRupiah(item.price)}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-teks">{item.stock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
