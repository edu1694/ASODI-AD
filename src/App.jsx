import { BrowserRouter, Routes, Route } from "react-router-dom"; // Agrega 'Route' a la importación
import HomePage from './pages/HomePage';
import './index.css'; // Importa el archivo CSS que contiene Tailwind

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
