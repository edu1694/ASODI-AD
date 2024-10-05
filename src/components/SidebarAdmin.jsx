import React, { useState } from 'react';
import { FaExclamationTriangle, FaChevronDown  } from 'react-icons/fa';
import { AiFillBell, AiFillPlusSquare, AiFillContainer, AiFillIdcard, AiFillSecurityScan   } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

const SidebarAdmin = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/'); // Redirigir a la página de inicio de sesión
  };

  return (
    <div className="flex h-screen"> {/* Mantiene el contenido a la altura completa de la pantalla */}
      {/* SidebarAdmin */}
      <div className="w-64 bg-teal-700 text-white flex flex-col md:w-72 lg:w-80 overflow-y-auto"> {/* SidebarAdmin con ancho fijo y scroll si el contenido excede */}
        <div className="p-5">
          <h1 className="text-xl font-bold">ASODI ADMIN</h1>
        </div>
        <ul className="mt-5 flex-grow">
          {/* Redirección al Tablero de Instrumentos */}
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
            onClick={() => navigate('/admin')}
          >
            Dashboard
          </li>
          {/* Operaciones De TI con submenú */}
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center justify-between"
            onClick={() => setOpen(!open)}
          >
            <div className="flex items-center">
              <AiFillIdcard  className="mr-2" />
              Usuarios ASODI
            </div>
            <FaChevronDown className={`${open ? 'rotate-180' : ''} transition-transform duration-300`} />
          </li>

          {open && (
            <ul className="ml-4">
              <li
                className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
                onClick={() => navigate('/add-userad')}
              >
                <div className="flex items-center">
                  <AiFillPlusSquare className="mr-1" />
                  Crear Usuarios ASODI
                </div>
              </li>
              <li
                className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
                onClick={() => navigate('/search-userad')}
              >
                <div className="flex items-center">
                  <AiFillSecurityScan className="mr-1" />
                  Buscar Usuarios ASODI
                </div>
              </li>
            </ul>
          )}
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center justify-between"
            onClick={() => setOpen(!open)}
          >
            <div className="flex items-center">
              <AiFillBell className="mr-2" />
              Anuncios
            </div>
            <FaChevronDown className={`${open ? 'rotate-180' : ''} transition-transform duration-300`} />
          </li>

          {open && (
            <ul className="ml-4">
              <li
                className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
                onClick={() => navigate('/add-anuncio')}
              >
                <div className="flex items-center">
                  <AiFillPlusSquare className="mr-1" />
                  Crear Anuncio
                </div>
              </li>
              <li
                className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
                onClick={() => navigate('/view-anuncio')}
              >
                <div className="flex items-center">
                  <AiFillContainer className="mr-1" />
                  Listar Anuncio
                </div>
              </li>
            </ul>
          )}
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex justify-between">
            Tablero <span className="bg-orange-500 text-xs px-2 py-1 rounded">Beta</span>
          </li>
          
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer">Tareas</li>
          
          {/* Operaciones De TI con submenú */}
          
          
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

export default SidebarAdmin;
