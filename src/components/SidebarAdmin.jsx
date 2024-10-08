import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
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

  return (
    <div className="flex">
      {/* SidebarAdmin */}
      <div className={`fixed top-0 left-0 w-52 bg-teal-700 text-white h-screen flex flex-col md:w-60 lg:w-64 overflow-y-auto transition-all ${isScrolled ? 'shadow-lg bg-teal-800' : 'bg-teal-700'}`}>
        <div className="p-5">
          <h1 className="text-xl font-bold">ASODI ADMIN</h1>
        </div>
        <ul className="mt-5 flex-grow">
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
            onClick={() => navigate("/admin")}
          >
            Dashboard
          </li>

          {/* Usuarios ASODI con submenú */}
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center justify-between"
            onClick={() => setOpenUsuarios(!openUsuarios)}
          >
            <div className="flex items-center">
              <AiFillIdcard className="mr-2" />
              Usuarios ASODI
            </div>
            <FaChevronDown
              className={`${
                openUsuarios ? "rotate-180" : ""
              } transition-transform duration-300`}
            />
          </li>
          {openUsuarios && (
            <ul className="ml-4">
              <li
                className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
                onClick={() => navigate("/add-userad")}
              >
                <div className="flex items-center">
                  <AiFillPlusSquare className="mr-1" />
                  Crear Usuarios ASODI
                </div>
              </li>
              <li
                className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
                onClick={() => navigate("/search-userad")}
              >
                <div className="flex items-center">
                  <AiFillSecurityScan className="mr-1" />
                  Buscar Usuarios ASODI
                </div>
              </li>
            </ul>
          )}

          {/* Anuncios con submenú */}
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center justify-between"
            onClick={() => setOpenAnuncios(!openAnuncios)}
          >
            <div className="flex items-center">
              <AiFillBell className="mr-2" />
              Anuncios
            </div>
            <FaChevronDown
              className={`${
                openAnuncios ? "rotate-180" : ""
              } transition-transform duration-300`}
            />
          </li>
          {openAnuncios && (
            <ul className="ml-4">
              <li
                className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
                onClick={() => navigate("/add-anuncio")}
              >
                <div className="flex items-center">
                  <AiFillPlusSquare className="mr-1" />
                  Crear Anuncio
                </div>
              </li>
              <li
                className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
                onClick={() => navigate("/view-anuncio")}
              >
                <div className="flex items-center">
                  <AiFillContainer className="mr-1" />
                  Listar Anuncio
                </div>
              </li>
            </ul>
          )}

          {/* Solicitudes con submenú */}
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center justify-between"
            onClick={() => setOpenSolicitudes(!openSolicitudes)}
          >
            <div className="flex items-center">
              <AiFillFileText className="mr-2" />
              Solicitudes
            </div>
            <FaChevronDown
              className={`${
                openSolicitudes ? "rotate-180" : ""
              } transition-transform duration-300`}
            />
          </li>
          {openSolicitudes && (
            <ul className="ml-4">
              <li
                className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
                onClick={() => navigate("/listasolicitudadmin")}
              >
                <div className="flex items-center">
                  <AiFillEye className="mr-1" />
                  Ver Solicitudes
                </div>
              </li>
            </ul>
          )}

          {/* Pacientes con submenú */}
          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex items-center justify-between"
            onClick={() => setOpenPacientes(!openPacientes)}
          >
            <div className="flex items-center">
              <AiFillHeart className="mr-2" />
              Pacientes
            </div>
            <FaChevronDown
              className={`${
                openPacientes ? "rotate-180" : ""
              } transition-transform duration-300`}
            />
          </li>
          {openPacientes && (
            <ul className="ml-4">
              <li
                className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
                onClick={() => navigate("/add-paciente")}
              >
                <div className="flex items-center">
                  <AiFillPlusSquare className="mr-1" />
                  Crear Paciente
                </div>
              </li>
              <li
                className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
                onClick={() => navigate("/listapacienteadmin")}
              >
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
          <div
            className="py-2 hover:bg-red-600 cursor-pointer text-center mt-5"
            onClick={handleLogout}
          >
            Cerrar sesión
          </div>
        </div>
      </div>

      {/* El contenido de la página se desplaza junto al Sidebar */}
      <div className="ml-52 flex-grow p-8">
        {/* Aquí va el contenido de la página */}
      </div>
    </div>
  );
};

export default SidebarAdmin;
