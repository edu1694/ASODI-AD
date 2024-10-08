import React, { useState, useEffect } from 'react';
import { FaBars, FaChevronDown, FaSignOutAlt,FaTasks } from 'react-icons/fa'; // Íconos de Font Awesome
import { AiFillDashboard, AiOutlineUserAdd, AiOutlineFileText, AiOutlineClockCircle } from 'react-icons/ai'; // Íconos de react-icons
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSolicitudes, setOpenSolicitudes] = useState(false); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para controlar si el sidebar está abierto o cerrado
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

  // Función para abrir/cerrar el sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {/* Botón para abrir/cerrar el sidebar en la esquina superior izquierda */}
      <button
        className="absolute top-4 left-4 z-50 bg-teal-700 text-white p-2 rounded-full"
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>

      {/* Sidebar con animación de apertura de izquierda a derecha */}
      <div className={`fixed top-0 left-0 h-screen bg-teal-700 text-white flex flex-col transition-all duration-300 overflow-y-auto ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
        
        {/* Encabezado, ahora colocado debajo del ícono */}
        <div className={`p-5 mt-12 transition-all flex items-center justify-center ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} ${isScrolled ? 'bg-teal-800' : 'bg-teal-700'}`}>
          {isSidebarOpen && <h1 className="text-xl font-bold">ASODI AD</h1>}
        </div>

        {/* Menú de navegación */}
        <ul className="mt-5 flex-grow">
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center" onClick={() => navigate('/dashboard')}>
            <AiFillDashboard className="mr-2" />
            {isSidebarOpen && <span>Dashboard</span>}
          </li>
          
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center" onClick={() => navigate('/add-paciente')}>
            <AiOutlineUserAdd className="mr-2" />
            {isSidebarOpen && <span>Agregar Paciente</span>}
          </li>

          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center" onClick={() => navigate('/listapaciente')}>
            <AiOutlineFileText className="mr-2" />
            {isSidebarOpen && <span>Lista Pacientes</span>}
          </li>

          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center" onClick={() => navigate('/listapendientes')}>
            <AiOutlineClockCircle className="mr-2" />
            {isSidebarOpen && <span>Lista Pendientes</span>}
          </li>
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center" onClick={() => navigate('/listaproceso')}>
            <FaTasks  className="mr-2" />
            {isSidebarOpen && <span>Lista En Proceso</span>}
          </li>

          {/* Submenú Solicitudes */}
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center justify-between" onClick={() => setOpenSolicitudes(!openSolicitudes)}>
            <div className="flex items-center">
              <AiOutlineFileText className="mr-2" />
              {isSidebarOpen && <span>Solicitudes</span>}
            </div>
            {isSidebarOpen && <FaChevronDown className={`${openSolicitudes ? 'rotate-180' : ''} transition-transform duration-300`} />}
          </li>
          {openSolicitudes && isSidebarOpen && (
            <ul className="ml-4">
              <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer" onClick={() => navigate('/addsolicitudes')}>
                <AiOutlineUserAdd className="mr-2" />
                {isSidebarOpen && <span>Crear Solicitud</span>}
              </li>
              <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer" onClick={() => navigate('/listasolicitudes')}>
                <AiOutlineFileText className="mr-2" />
                {isSidebarOpen && <span>Ver Solicitudes</span>}
              </li>
            </ul>
          )}
        </ul>

        {/* Cerrar sesión */}
        <div className="p-5">
          <div className="py-2 hover:bg-red-600 cursor-pointer flex items-center justify-center mt-5" onClick={handleLogout}>
            <FaSignOutAlt className="mr-2" />
            {isSidebarOpen && <span>Cerrar sesión</span>}
          </div>
        </div>
      </div>

      {/* El contenido de la página se desplaza junto al Sidebar */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'} flex-grow p-8`}>
        {/* Aquí va el contenido de la página */}
      </div>
    </div>
  );
};

export default Sidebar;
