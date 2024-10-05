import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from './pages/HomePage'; // HomePage es el login
import './index.css'; // Importa el archivo CSS que contiene Tailwind
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from './components/ProtectedRoute'; // Importa el componente de rutas protegidas
import NotFoundPage from './pages/NotFoundPage'; // Importa la página de error 404
import AddPacientePage from "./pages/AddPacientePage";
import AdminPage from "./pages/AdminPage";
import AddUsuarioADPage from "./pages/AddUsuarioADPage.JSX";
import SearchUsuarioPage from "./pages/SearchUsuarioPage";
import AddSolicitudes from "./pages/AddSolicitudes";
import ListaSolicitudes from "./pages/ListaSolicitudes";
import ListaPaciente from "./pages/ListaPaciente";
import DetallePaciente from "./pages/DetallePaciente";
import EditarPaciente from "./pages/EditarPaciente";
import AddAnuncioPage from './pages/AddAnuncioPage'; // Asegúrate de tener este componente importado
import ViewAnuncioPage from './pages/ViewAnuncioPage'; // Asegúrate de tener este componente importado
import ListaSolicitudAdmin from './pages/ListaSolicitudAdmin';
import ListaPacienteAdmin from "./pages/ListaPacienteAdmin";
import DetallePacienteAdmin from "./pages/DetallePacienteAdmin";
import EditarPacienteAdmin from "./pages/EditarPacienteAdmin";

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
        <Route
          path="/listapaciente"
          element={
            <ProtectedRoute>
              <ListaPaciente />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/paciente/:id"
          element={
            <ProtectedRoute>
              <DetallePaciente />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/editarpaciente/:id"
          element={
            <ProtectedRoute>
              <EditarPaciente />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-userad"
          element={
            <ProtectedRoute>
              <AddUsuarioADPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-userad"
          element={
            <ProtectedRoute>
              <SearchUsuarioPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/add-anuncio"
          element={
            <ProtectedRoute>
              <AddAnuncioPage />
            </ProtectedRoute>
          }
        />
        
        <Route 
          path="/addsolicitudes"
          element={
            <ProtectedRoute>
              <AddSolicitudes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-anuncio"
          element={
            <ProtectedRoute>
              <ViewAnuncioPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listasolicitudes"
          element={
            <ProtectedRoute>
              <ListaSolicitudes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/listasolicitudadmin"
          element={
            <ProtectedRoute>
              <ListaSolicitudAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/listapacienteadmin"
          element={
            <ProtectedRoute>
              <ListaPacienteAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/paciente/:id"
          element={
            <ProtectedRoute>
              <DetallePacienteAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editarpacienteadmin/:id"
          element={
            <ProtectedRoute>
              <EditarPacienteAdmin />
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
