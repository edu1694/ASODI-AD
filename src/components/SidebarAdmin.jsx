import React, { useState, useEffect } from "react";
import { FaBars, FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import {
  AiFillBell,
  AiFillPlusSquare,
  AiFillContainer,
  AiFillIdcard,
  AiFillSecurityScan,
  AiFillFileText,
  AiFillEye,
  AiFillHeart,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const SidebarAdmin = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openUsuarios, setOpenUsuarios] = useState(false);
  const [openSolicitudes, setOpenSolicitudes] = useState(false);
  const [openAnuncios, setOpenAnuncios] = useState(false);
  const [openPacientes, setOpenPacientes] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/"); // Redirigir a la página de inicio de sesión
  };

  // Función para abrir/cerrar el sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {/* Botón para abrir/cerrar el sidebar */}
      <button
        className="absolute top-4 left-4 z-50 bg-teal-700 text-white p-2 rounded-full"
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>

      {/* SidebarAdmin con animación de apertura de izquierda a derecha */}
      <div className={`fixed top-0 left-0 h-screen bg-teal-700 text-white flex flex-col transition-all duration-300 overflow-y-auto overflow-x-hidden ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
        
        {/* Encabezado - ahora debajo del ícono */}
        <div className={`p-5 mt-12 transition-all flex items-center justify-center ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} ${isScrolled ? 'bg-teal-800' : 'bg-teal-700'}`}>
          {isSidebarOpen && <h1 className="text-xl font-bold">ASODI ADMIN</h1>}
        </div>

        {/* Menú de navegación */}
        <ul className="mt-5 flex-grow">
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center" onClick={() => navigate("/admin")}>
            <AiFillIdcard className="mr-2" />
            {isSidebarOpen && <span>Dashboard</span>}
          </li>

          {/* Usuarios ASODI con submenú */}
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center justify-between" onClick={() => setOpenUsuarios(!openUsuarios)}>
            <div className="flex items-center">
              <AiFillIdcard className="mr-2" />
              {isSidebarOpen && <span>Usuarios ASODI</span>}
            </div>
            {isSidebarOpen && <FaChevronDown className={`${openUsuarios ? "rotate-180" : ""} transition-transform duration-300`} />}
          </li>
          {openUsuarios && isSidebarOpen && (
            <ul className="ml-4">
              <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer" onClick={() => navigate("/add-userad")}>
                <div className="flex items-center">
                  <AiFillPlusSquare className="mr-1" />
                  Crear Usuarios ASODI
                </div>
              </li>
              <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer" onClick={() => navigate("/search-userad")}>
                <div className="flex items-center">
                  <AiFillSecurityScan className="mr-1" />
                  Buscar Usuarios ASODI
                </div>
              </li>
            </ul>
          )}

          {/* Anuncios con submenú */}
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center justify-between" onClick={() => setOpenAnuncios(!openAnuncios)}>
            <div className="flex items-center">
              <AiFillBell className="mr-2" />
              {isSidebarOpen && <span>Anuncios</span>}
            </div>
            {isSidebarOpen && <FaChevronDown className={`${openAnuncios ? "rotate-180" : ""} transition-transform duration-300`} />}
          </li>
          {openAnuncios && isSidebarOpen && (
            <ul className="ml-4">
              <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer" onClick={() => navigate("/add-anuncio")}>
                <div className="flex items-center">
                  <AiFillPlusSquare className="mr-1" />
                  Crear Anuncio
                </div>
              </li>
              <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer" onClick={() => navigate("/view-anuncio")}>
                <div className="flex items-center">
                  <AiFillContainer className="mr-1" />
                  Listar Anuncio
                </div>
              </li>
            </ul>
          )}

          {/* Solicitudes con submenú */}
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center justify-between" onClick={() => setOpenSolicitudes(!openSolicitudes)}>
            <div className="flex items-center">
              <AiFillFileText className="mr-2" />
              {isSidebarOpen && <span>Solicitudes</span>}
            </div>
            {isSidebarOpen && <FaChevronDown className={`${openSolicitudes ? "rotate-180" : ""} transition-transform duration-300`} />}
          </li>
          {openSolicitudes && isSidebarOpen && (
            <ul className="ml-4">
              <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer" onClick={() => navigate("/listasolicitudadmin")}>
                <div className="flex items-center">
                  <AiFillEye className="mr-1" />
                  Ver Solicitudes
                </div>
              </li>
            </ul>
          )}

          {/* Pacientes con submenú */}
          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center justify-between" onClick={() => setOpenPacientes(!openPacientes)}>
            <div className="flex items-center">
              <AiFillHeart className="mr-2" />
              {isSidebarOpen && <span>Pacientes</span>}
            </div>
            {isSidebarOpen && <FaChevronDown className={`${openPacientes ? "rotate-180" : ""} transition-transform duration-300`} />}
          </li>
          {openPacientes && isSidebarOpen && (
            <ul className="ml-4">
              <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer" onClick={() => navigate("/listapacienteadmin")}>
                <div className="flex items-center">
                  <AiFillEye className="mr-1" />
                  Ver Pacientes
                </div>
              </li>
            </ul>
          )}
        </ul>

        {/* Botón de cerrar sesión */}
        <div className="p-5">
          <div className="py-2 hover:bg-red-600 cursor-pointer text-center mt-5 flex items-center justify-center" onClick={handleLogout}>
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

export default SidebarAdmin;

