import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl bg-white p-20 rounded-[4rem] shadow-2xl border border-slate-100">
        <div className="mb-12 inline-block p-8 bg-blue-50 rounded-[2.5rem]">
          <svg className="w-24 h-24 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        
        <h1 className="text-7xl font-black text-slate-900 mb-10 tracking-tighter">
          EliteDrive <span className="text-blue-600">Rental</span>
        </h1>
        
        <p className="text-2xl text-slate-400 font-bold uppercase tracking-[0.3em]">
          Portal Praktikum
        </p>
      </div>
    </div>
  );
};

export default Home;
