import React, { useState } from 'react';
import { FaExclamationTriangle, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/'); // Redirigir a la página de inicio de sesión
  };

  return (
    <div className="flex h-screen"> {/* Mantiene el contenido a la altura completa de la pantalla */}
      {/* Sidebar */}
      <div className="w-64 bg-teal-700 text-white flex flex-col md:w-72 lg:w-80 overflow-y-auto"> {/* Sidebar con ancho fijo y scroll si el contenido excede */}
        <div className="p-5">
          <h1 className="text-xl font-bold">ASODI AD</h1>
        </div>
        <ul className="mt-5 flex-grow">
          {/* Redirección al Tablero de Instrumentos */}
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </li>
          
          {/* Redirección a otras páginas */}
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
            onClick={() => navigate('/add-paciente')}
          >
            Agregar Paciente
          </li>
          
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
            onClick={() => navigate('/lista')}
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
              <FaExclamationTriangle className="mr-2" />
              Operaciones De TI
            </div>
            <FaChevronDown className={`${open ? 'rotate-180' : ''} transition-transform duration-300`} />
          </li>

          {open && (
            <ul className="ml-4">
              <li
                className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
                onClick={() => navigate('/submenu1')}
              >
                Submenú 1
              </li>
              <li
                className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
                onClick={() => navigate('/submenu2')}
              >
                Submenú 2
              </li>
            </ul>
          )}
          
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
            onClick={() => navigate('/activos')}
          >
            Activos
          </li>
          
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
            onClick={() => navigate('/informes')}
          >
            Informes
          </li>
          
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
            onClick={() => navigate('/admin')}
          >
            Administrador
          </li>
        </ul>

        {/* Botón de cerrar sesión */}
        <div className="p-5">
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
