import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { baseUrl } from '../api/asodi.api.js';
import { FaBell } from 'react-icons/fa';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [vistas, setVistas] = useState(new Set());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Fetch de notificaciones cada minuto
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const responsePacientes = await axios.get(`${baseUrl}/asodi/v1/planillas-convenio/`);
        const responseConvenios = await axios.get(`${baseUrl}/asodi/v1/convenios/`);

        if (responsePacientes.status === 200 && responseConvenios.status === 200) {
          const pacientesPendientes = responsePacientes.data.filter((paciente) => paciente.estado_paciente === 'P');
          const convenios = responseConvenios.data;

          const nuevasNotificaciones = pacientesPendientes.map((paciente) => {
            const convenio = convenios.find((conv) => conv.nombre_convenio === paciente.convenios);
            if (!convenio || !convenio.horas_llamado) return null;

            const fechaRecepcion = new Date(paciente.fecha_recepcion);
            const ahora = new Date();
            const diferenciaMilisegundos = ahora - fechaRecepcion;
            const tiempoTranscurridoEnHoras = diferenciaMilisegundos / 1000 / 60 / 60;

            const horasRestantes = convenio.horas_llamado - tiempoTranscurridoEnHoras;

            const horas = Math.floor(horasRestantes);
            const minutos = Math.floor((horasRestantes - horas) * 60);
            const riesgoAlto = horasRestantes <= 0;

            return {
              id: paciente.id_planilla,
              nombre: `${paciente.nombre_paciente} ${paciente.apellido_paciente}`,
              tiempoRestante: `${horas} horas y ${minutos} minutos`,
              riesgoAlto,
              atrasado: horasRestantes < 0,
            };
          }).filter((notificacion) => notificacion !== null);

          const notificacionesSinVer = nuevasNotificaciones.filter((notif) => !vistas.has(notif.id));
          setNotificaciones(notificacionesSinVer);
        }
      } catch (error) {
        console.error("Error al obtener los datos para las notificaciones:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);

    return () => clearInterval(interval);
  }, [vistas]);

  // Manejar clic fuera del menú de notificaciones
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Alternar visibilidad del menú de notificaciones
  const toggleMenu = (event) => {
    event.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  // Manejar clic en la notificación
  const handleNotificationClick = (id) => {
    setVistas((prevVistas) => new Set(prevVistas).add(id));
    setNotificaciones((prevNotificaciones) => prevNotificaciones.filter((notificacion) => notificacion.id !== id));
    navigate(`/paciente/${id}`);
  };

  const totalNotificaciones = notificaciones.length;
  const hayRiesgoAlto = notificaciones.some((notif) => notif.riesgoAlto);

  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={toggleMenu}>
        <FaBell className={`text-2xl ${hayRiesgoAlto ? 'text-red-600' : ''}`} />
        {totalNotificaciones > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalNotificaciones}
          </span>
        )}
      </div>
      {isMenuOpen && (
        <div ref={menuRef} className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
          <h3 className="font-bold text-lg mb-2">Notificaciones</h3>
          {totalNotificaciones > 0 ? (
            <ul>
              {notificaciones.map((notificacion) => (
                <li
                  key={notificacion.id}
                  className={`mb-2 p-2 rounded cursor-pointer ${
                    notificacion.atrasado ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}
                  onClick={() => handleNotificationClick(notificacion.id)}
                >
                  {notificacion.atrasado && <FaExclamationTriangle className="mr-2 text-red-700" />}
                  <span className="font-bold">{notificacion.nombre}</span> - Llamada en {notificacion.tiempoRestante}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay pacientes con llamadas pendientes próximas.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
