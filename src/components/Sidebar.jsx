import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';  // Íconos de Font Awesome
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openOperacionesTI, setOpenOperacionesTI] = useState(false); 
  const [openSolicitudes, setOpenSolicitudes] = useState(false); 
  const navigate = useNavigate();

  // Detectar el scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('usuario_asodi_ad');
    localStorage.clear(); 
    navigate('/'); 
  };

  return (
    <div className="flex">
      {/* Sidebar con posición fija */}
      <div className={`fixed top-0 left-0 w-64 bg-teal-700 text-white h-screen flex flex-col md:w-72 lg:w-80 overflow-y-auto transition-all ${isScrolled ? 'shadow-lg bg-teal-800' : 'bg-teal-700'}`}>
        {/* Encabezado */}
        <div className={`p-5 transition-all ${isScrolled ? 'bg-teal-800' : 'bg-teal-700'}`}>
          <h1 className="text-xl font-bold">ASODI AD</h1>
        </div>

        {/* Menú de navegación */}
        <ul className="mt-5 flex-grow">
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer" onClick={() => navigate('/dashboard')}>
            Dashboard
          </li>
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer" onClick={() => navigate('/add-paciente')}>
            Agregar Paciente
          </li>
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer" onClick={() => navigate('/listapaciente')}>
            Lista Pacientes
          </li>
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex justify-between">
            Tablero <span className="bg-orange-500 text-xs px-2 py-1 rounded">Beta</span>
          </li>

          {/* Submenú Operaciones TI */}
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center justify-between" onClick={() => setOpenOperacionesTI(!openOperacionesTI)}>
            <div className="flex items-center">
              <FaExclamationTriangle className="mr-2" />
              Operaciones De TI
            </div>
            <FaChevronDown className={`${openOperacionesTI ? 'rotate-180' : ''} transition-transform duration-300`} />
          </li>
          {openOperacionesTI && (
            <ul className="ml-4">
              <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer" onClick={() => navigate('/submenu1')}>
                Submenú 1
              </li>
              <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer" onClick={() => navigate('/submenu2')}>
                Submenú 2
              </li>
            </ul>
          )}

          {/* Activos y Informes */}
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer" onClick={() => navigate('/activos')}>
            Activos
          </li>
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer" onClick={() => navigate('/informes')}>
            Informes
          </li>

          {/* Submenú Solicitudes */}
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center justify-between" onClick={() => setOpenSolicitudes(!openSolicitudes)}>
            <div className="flex items-center">Solicitudes</div>
            <FaChevronDown className={`${openSolicitudes ? 'rotate-180' : ''} transition-transform duration-300`} />
          </li>
          {openSolicitudes && (
            <ul className="ml-4">
              <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer" onClick={() => navigate('/addsolicitudes')}>
                Crear Solicitud
              </li>
              <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer" onClick={() => navigate('/listasolicitudes')}>
                Ver Solicitudes
              </li>
            </ul>
          )}
        </ul>

        {/* Cerrar sesión */}
        <div className="p-5">
          <div className="py-2 hover:bg-red-600 cursor-pointer flex items-center justify-center mt-5" onClick={handleLogout}>
            <FaSignOutAlt className="mr-2" />
            Cerrar sesión
          </div>
        </div>
      </div>

      {/* El contenido de la página se desplaza junto al Sidebar */}
      <div className="ml-64 flex-grow p-8">
        {/* Aquí va el contenido de la página */}
      </div>
    </div>
  );
};

export default Sidebar;
