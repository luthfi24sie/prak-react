import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import HelloWorld from './pertemuan-2/HelloWorld';
import Pertemuan3 from './Pertemuan-3/Pertemuan3';
import CarRental from './Pertemuan-4/CarRental';

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Awal - Hanya Tampilan Awal FMI App */}
        <Route path="/" element={<Home />} />
        
        {/* Akses Terpisah per Pertemuan */}
        <Route path="/pertemuan-2" element={<HelloWorld />} />
        <Route path="/pertemuan-3" element={<Pertemuan3 />} />
        <Route path="/pertemuan-4" element={<CarRental />} />
        
        {/* Fallback to home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
