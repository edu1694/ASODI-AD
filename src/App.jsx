import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from './pages/HomePage'; // HomePage es el login
import './index.css'; // Importa el archivo CSS que contiene Tailwind
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from './components/ProtectedRoute'; // Importa el componente de rutas protegidas
import NotFoundPage from './pages/NotFoundPage'; // Importa la página de error 404
import AddPacientePage from "./pages/AddPacientePage";

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  return (
    <BrowserRouter>
      <Routes>
        {/* Si el usuario está autenticado y va a la raíz, redirige al dashboard */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <HomePage />} />
        
        {/* Protegemos la ruta del dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para agregar pacientes */}
        <Route
          path="/add-paciente"
          element={
            <ProtectedRoute>
              <AddPacientePage />
            </ProtectedRoute>
          }
        />

        {/* Página de error 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
