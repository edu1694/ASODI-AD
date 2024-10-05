import React, { useState } from "react";
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
  const [openUsuarios, setOpenUsuarios] = useState(false); // Estado para el submenú de usuarios
  const [openSolicitudes, setOpenSolicitudes] = useState(false); // Estado para el submenú de solicitudes
  const [openAnuncios, setOpenAnuncios] = useState(false); // Estado para el submenú de anuncios
  const [openPacientes, setOpenPacientes] = useState(false); // Estado para el submenú de pacientes
  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/"); // Redirigir a la página de inicio de sesión
  };

  return (
    <div className="flex h-screen">
      {/* SidebarAdmin */}
      <div className="fixed top-0 left-0 w-64 h-full bg-teal-700 text-white flex flex-col md:w-72 lg:w-80 overflow-y-auto">
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

          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer flex justify-between">
            Tablero{" "}
            <span className="bg-orange-500 text-xs px-2 py-1 rounded">
              Beta
            </span>
          </li>

          <li className="py-2 px-5 hover:bg-teal-600 cursor-pointer">Tareas</li>

          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
            onClick={() => navigate("/activos")}
          >
            Activos
          </li>

          <li
            className="py-2 px-5 hover:bg-teal-600 cursor-pointer"
            onClick={() => navigate("/informes")}
          >
            Informes
          </li>
        </ul>
        {/* Botón de cerrar sesión */}
        <div className="p-5">
          <div className="py-2 hover:bg-teal-600 cursor-pointer">Freshchat</div>
          <div className="py-2 hover:bg-teal-600 cursor-pointer">
            Switcher de Freshworks
          </div>
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
