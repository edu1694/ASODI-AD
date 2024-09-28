import React, { useState } from 'react';
import { FaExclamationTriangle, FaChevronDown } from 'react-icons/fa'; // Importamos los iconos
import { useNavigate } from 'react-router-dom'; // Para la redirección

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // Hook de navegación para redirigir

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated'); // Eliminar el estado de autenticación
    navigate('/'); // Redirigir a la página de inicio de sesión
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="h-screen w-64 bg-teal-700 text-white">
        <div className="p-5">
          <h1 className="text-xl font-bold">Red 911</h1>
        </div>
        <ul className="mt-5">
          {/* Redirección al Tablero de Instrumentos */}
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
            onClick={() => navigate('/dashboard')} // Redirigir al dashboard
          >
            Tablero De Instrumentos
          </li>
          
          {/* Redirección a otras páginas */}
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
            onClick={() => navigate('/add-paciente')} // Supuesta página de tickets
          >
            Agregar Paciente
          </li>
          
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
            onClick={() => navigate('/lista')} // Supuesta página de lista
          >
            Lista
          </li>
          
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex justify-between">
            Tablero <span className="bg-orange-500 text-xs px-2 py-1 rounded">Beta</span>
          </li>
          
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer">Tareas</li>
          
          {/* Operaciones De TI con submenú */}
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center justify-between"
            onClick={() => setOpen(!open)}
          >
            <div className="flex items-center">
              <FaExclamationTriangle className="mr-2" /> {/* Ícono de alerta */}
              Operaciones De TI
            </div>
            <FaChevronDown className={`${open ? 'rotate-180' : ''} transition-transform duration-300`} /> {/* Flecha */}
          </li>

          {open && (
            <ul className="ml-4">
              <li
                className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
                onClick={() => navigate('/submenu1')} // Supuesta página de submenú 1
              >
                Submenú 1
              </li>
              <li
                className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
                onClick={() => navigate('/submenu2')} // Supuesta página de submenú 2
              >
                Submenú 2
              </li>
            </ul>
          )}
          
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
            onClick={() => navigate('/activos')} // Supuesta página de activos
          >
            Activos
          </li>
          
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
            onClick={() => navigate('/informes')} // Supuesta página de informes
          >
            Informes
          </li>
          
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
            onClick={() => navigate('/admin')} // Supuesta página de administrador
          >
            Administrador
          </li>
        </ul>

        {/* Botón de cerrar sesión */}
        <div className="mt-auto p-5">
          <div className="py-2 hover:bg-teal-600 cursor-pointer">Freshchat</div>
          <div className="py-2 hover:bg-teal-600 cursor-pointer">Switcher de Freshworks</div>
          <div
            className="py-2 hover:bg-red-600 cursor-pointer text-center mt-5"
            onClick={handleLogout}
          >
            Cerrar sesión
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
