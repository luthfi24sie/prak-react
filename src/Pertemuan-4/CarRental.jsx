import React, { useState } from 'react';
import carsData from './cars_data.json';

const CarRental = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('guest'); // 'guest' or 'admin'

  // Filter Logic
  const filteredCars = carsData.filter((car) => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || car.category === categoryFilter;
    const matchesStatus = statusFilter === '' || car.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(carsData.map(car => car.category))];
  const statuses = [...new Set(carsData.map(car => car.status))];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Global Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">EliteDrive<span className="text-blue-600">Rental</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
              <button 
                onClick={() => setViewMode('guest')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'guest' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Guest
              </button>
              <button 
                onClick={() => setViewMode('admin')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        {/* Integrated Welcome & Hero Section */}
        <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 mb-12 shadow-2xl group min-h-[450px] flex items-center">
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" 
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
          
          <div className="relative z-10 p-12 md:p-20 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 backdrop-blur-md border border-blue-500/30 rounded-full mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-blue-400 text-xs font-black uppercase tracking-[0.2em]">Selamat Datang di EliteDrive Rental</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.05] tracking-tight">
              Portal Praktikum <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Penyewaan Mobil</span>
            </h2>
            
            <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-xl mb-10">
              Eksplorasi layanan penyewaan mobil premium dengan integrasi data JSON, UI responsif, dan fitur manajemen admin.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a href="#explore" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95">
                Mulai Eksplorasi
              </a>
              <div className="flex -space-x-3 items-center ml-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                  </div>
                ))}
                <span className="ml-6 text-slate-400 text-sm font-bold">+20 Armada Tersedia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters Panel */}
        <div id="explore" className="bg-white rounded-[2.5rem] shadow-2xl p-10 mb-16 border border-slate-100 -mt-24 relative z-20 mx-4 md:mx-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Cari Kendaraan</label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Ketik nama mobil..."
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 outline-none transition-all text-slate-800 font-bold placeholder:text-slate-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="w-6 h-6 text-slate-300 absolute left-5 top-5 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Kategori Utama</label>
              <div className="relative group">
                <select
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none text-slate-800 font-bold cursor-pointer"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">Semua Kategori</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <div className="absolute right-6 top-6 pointer-events-none text-slate-300 group-focus-within:text-blue-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Status Armada</label>
              <div className="relative group">
                <select
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none text-slate-800 font-bold cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Semua Status</option>
                  {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
                <div className="absolute right-6 top-6 pointer-events-none text-slate-300 group-focus-within:text-blue-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {viewMode === 'guest' ? (
          /* GUEST: GRID DESIGN */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredCars.map((car) => (
              <div key={car.id} className="group bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col border border-slate-50">
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={car.image} 
                    alt={car.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className={`absolute top-6 right-6 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md border border-white/20 ${
                    car.status === 'Available' ? 'bg-emerald-500/90 text-white' : 
                    car.status === 'Maintenance' ? 'bg-amber-500/90 text-white' : 'bg-rose-500/90 text-white'
                  }`}>
                    {car.status}
                  </div>
                </div>
                
                <div className="p-10 flex-grow flex flex-col">
                  <div className="mb-6">
                    <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">{car.category}</span>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{car.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-8 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                    <div className="flex flex-col items-center">
                      <svg className="w-5 h-5 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{car.specifications.transmission}</span>
                    </div>
                    <div className="flex flex-col items-center border-x border-slate-200">
                      <svg className="w-5 h-5 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{car.specifications.seats} Seats</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <svg className="w-5 h-5 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{car.specifications.fuel}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-10 group/loc">
                    <div className="p-3 bg-rose-50 rounded-2xl group-hover/loc:bg-rose-500 transition-all duration-300">
                      <svg className="w-5 h-5 text-rose-500 group-hover/loc:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <span className="text-sm font-bold text-slate-500">{car.location.city}</span>
                  </div>

                  <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Per Hari</p>
                      <div className="text-3xl font-black text-slate-900">
                        Rp{car.pricePerDay.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <button className="bg-slate-900 text-white p-5 rounded-[1.5rem] hover:bg-blue-600 transition-all duration-300 shadow-2xl hover:shadow-blue-600/40 active:scale-90">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ADMIN: TABLE DESIGN */
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-1">Manajemen Armada</h3>
                <p className="text-slate-500 font-medium text-sm">Kelola daftar mobil dan status ketersediaan di sini.</p>
              </div>
              <div className="flex gap-4">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95">Tambah Unit Baru</button>
                <button className="px-8 py-4 bg-white text-slate-600 border-2 border-slate-100 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all">Laporan Bulanan</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                    <th className="px-10 py-8 border-b border-slate-100">Informasi Dasar</th>
                    <th className="px-10 py-8 border-b border-slate-100">Klasifikasi</th>
                    <th className="px-10 py-8 border-b border-slate-100">Status Aktif</th>
                    <th className="px-10 py-8 border-b border-slate-100">Pricing</th>
                    <th className="px-10 py-8 border-b border-slate-100">Data Performa</th>
                    <th className="px-10 py-8 border-b border-slate-100">Kontrol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCars.map((car) => (
                    <tr key={car.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden shadow-xl group-hover:scale-110 transition-transform duration-500">
                            <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-black text-slate-900 text-xl mb-1">{car.name}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1">
                              <svg className="w-3 h-3 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                              {car.location.city}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl uppercase tracking-widest border border-blue-100">{car.category}</span>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border ${
                          car.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          car.status === 'Maintenance' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          <span className={`w-2 h-2 rounded-full animate-pulse ${
                            car.status === 'Available' ? 'bg-emerald-500' : 
                            car.status === 'Maintenance' ? 'bg-amber-500' : 'bg-rose-500'
                          }`}></span>
                          {car.status}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="font-black text-slate-900 text-xl">Rp{car.pricePerDay.toLocaleString('id-ID')}</div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-3 min-w-[180px]">
                          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kecepatan</span>
                            <span className="text-xs font-black text-slate-700">{car.performance.topSpeed}</span>
                          </div>
                          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Akselerasi</span>
                            <span className="text-xs font-black text-slate-700">{car.performance.acceleration}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex gap-3">
                          <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/30 transition-all border border-slate-100">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-600/30 transition-all border border-slate-100">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredCars.length === 0 && (
          <div className="text-center py-40 bg-white rounded-[4rem] shadow-2xl border-2 border-dashed border-slate-100 mx-4">
            <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
              <svg className="w-16 h-16 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Hasil Tidak Ditemukan</h3>
            <p className="text-slate-400 text-lg font-medium max-w-md mx-auto">Kami tidak dapat menemukan armada yang sesuai dengan kriteria filter atau pencarian Anda saat ini.</p>
            <button 
              onClick={() => {setSearchTerm(''); setCategoryFilter(''); setStatusFilter('');}}
              className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all active:scale-95"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CarRental;
