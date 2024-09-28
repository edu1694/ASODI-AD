import React, { useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa'; // Para el ícono de alerta
import { FaChevronDown } from 'react-icons/fa'; // Para la flecha hacia abajo
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
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer">Tablero De Instrumentos</li>
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer">Tickets</li>
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer">Lista</li>
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex justify-between">
            Tablero <span className="bg-orange-500 text-xs px-2 py-1 rounded">Beta</span>
          </li>
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer">Tareas</li>
          {/* Operaciones De TI */}
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
          {/* Submenú de Operaciones De TI */}
          {open && (
            <ul className="ml-4">
              <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer">Submenú 1</li>
              <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer">Submenú 2</li>
            </ul>
          )}
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer">Activos</li>
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer">Informes</li>
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer">Administrador</li>
        </ul>

        {/* Botón de cerrar sesión */}
        <div className="mt-auto p-5">
          <div className="py-2 hover:bg-teal-600 cursor-pointer">Freshchat</div>
          <div className="py-2 hover:bg-teal-600 cursor-pointer">Switcher de Freshworks</div>
          {/* Añadir aquí el botón de Cerrar Sesión */}
          <div
            className="py-2 hover:bg-red-600 cursor-pointer text-center mt-5"
            onClick={handleLogout}
          >
            Cerrar sesión
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h2 className="text-2xl font-bold">Contenido Principal</h2>
        {/* Aquí iría tu contenido */}
      </div>
    </div>
  );
};

export default Sidebar;
