import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from "../components/PageHeader";

export default function NotFound() {
    return (
        <div id="not-found-container" className="pb-10">
            <PageHeader title="Error 404" breadcrumb={["Dashboard", "Error 404"]} />
            <div className="px-5 mt-4 text-center">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 flex flex-col items-center">
                    <h1 className="text-9xl font-extrabold text-hijau mb-4">404</h1>
                    <h2 className="text-3xl font-bold text-teks mb-2">Halaman Tidak Ditemukan</h2>
                    <p className="text-gray-400 font-medium mb-8">Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
                    <Link to="/" className="bg-hijau text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors">
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
