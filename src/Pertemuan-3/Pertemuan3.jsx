import React from 'react';
import UserForm from './UserForm';
import FlexboxGrid from './FlexboxGrid';
import HitungGajiForm from './HitungGajiForm';
import TailwindCSS from './TailwindCSS';
import Typography from './Typography';

const Pertemuan3 = () => {
  return (
    <div className="p-8 space-y-12 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center border-b pb-4">Tugas Pertemuan 3</h1>
      
      <section>
        <h2 className="text-xl font-semibold mb-4 bg-gray-100 p-2">1. Typography</h2>
        <Typography />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 bg-gray-100 p-2">2. Tailwind CSS Basic</h2>
        <TailwindCSS />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 bg-gray-100 p-2">3. Flexbox & Grid</h2>
        <FlexboxGrid />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 bg-gray-100 p-2">4. User Form</h2>
        <UserForm />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 bg-gray-100 p-2">5. Hitung Gaji Form</h2>
        <HitungGajiForm />
      </section>
    </div>
  );
};

export default Pertemuan3;
