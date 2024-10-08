import React, { useState, useEffect } from 'react';
import { baseUrl } from '../api/asodi.api.js';
import axios from 'axios';
import Sidebar from '../components/Sidebar.jsx';
import PanelFiltros from '../components/PanelFiltros.jsx'; // Importamos el nuevo componente

const ListaSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true); 
  const [estadoFiltro, setEstadoFiltro] = useState(''); // Estado del filtro de estado
  const [fechaFiltro, setFechaFiltro] = useState(''); // Estado del filtro de fecha
  const [solicitudFiltro, setSolicitudFiltro] = useState(''); // Estado del filtro por ID de solicitud

  useEffect(() => {
    const usuarioSolicitante = localStorage.getItem('usuario_asodi_ad'); // Obtener el RUT del usuario logueado

    if (usuarioSolicitante) {
      const fetchSolicitudes = async () => {
        try {
          setCargando(true);
          
          // Llamada a la API para obtener todas las solicitudes del usuario logueado
          const response = await axios.get(`${baseUrl}/asodi/v1/solicitudes/`, {
            params: { 
              usuario_solicitante: usuarioSolicitante // Solo solicitudes del usuario logueado
            }
          });

          if (response.data.length > 0) {
            let solicitudesFiltradas = response.data.filter(
              (solicitud) => solicitud.usuario_solicitante === usuarioSolicitante
            );

            // Variable para identificar el tipo de filtro que falló
            let filtroFallido = '';

            // Aplicar el filtro de estado
            if (estadoFiltro) {
              const solicitudesEstado = solicitudesFiltradas.filter(
                (solicitud) => solicitud.estado === estadoFiltro
              );
              if (solicitudesEstado.length === 0) {
                filtroFallido = 'estado';
              }
              solicitudesFiltradas = solicitudesEstado;
            }

            // Aplicar el filtro de fecha
            if (fechaFiltro) {
              const solicitudesFecha = solicitudesFiltradas.filter(
                (solicitud) => solicitud.fecha_creacion === fechaFiltro
              );
              if (solicitudesFecha.length === 0) {
                filtroFallido = 'fecha';
              }
              solicitudesFiltradas = solicitudesFecha;
            }

            // Aplicar el filtro por ID de Solicitud
            if (solicitudFiltro) {
              const solicitudesSolicitud = solicitudesFiltradas.filter(
                (solicitud) => solicitud.id_soli.toString() === solicitudFiltro
              );
              if (solicitudesSolicitud.length === 0) {
                filtroFallido = 'solicitud';
              }
              solicitudesFiltradas = solicitudesSolicitud;
            }

            if (solicitudesFiltradas.length > 0) {
              setSolicitudes(solicitudesFiltradas); // Guardar las solicitudes filtradas
              setMensaje(null); // Limpiar mensaje si hay solicitudes
            } else {
              setSolicitudes([]); // Limpiar la lista si no hay coincidencias

              // Mostrar mensaje de error según el filtro que falló
              switch (filtroFallido) {
                case 'estado':
                  setMensaje('No hay solicitudes que coincidan con el estado seleccionado.');
                  break;
                case 'fecha':
                  setMensaje('No hay solicitudes que coincidan con la fecha seleccionada.');
                  break;
                case 'solicitud':
                  setMensaje('No hay solicitudes que coincidan con el ID ingresado.');
                  break;
                default:
                  setMensaje('No tienes solicitudes que coincidan con los filtros.');
              }
            }
          } else {
            setMensaje('No tienes solicitudes.');
            setSolicitudes([]); // Limpiar la lista si no hay solicitudes
          }
        } catch (error) {
          console.error('Error al obtener las solicitudes:', error);
          setMensaje('Error al obtener las solicitudes. Inténtalo de nuevo.');
        } finally {
          setCargando(false);
        }
      };

      // Llamar a la función para obtener las solicitudes del usuario logueado
      fetchSolicitudes();
    } else {
      setMensaje('Usuario solicitante no encontrado en localStorage.');
      setCargando(false);
    }
  }, [estadoFiltro, fechaFiltro, solicitudFiltro]); // Ejecutar cada vez que los filtros cambien

  const handleEstadoChange = (e) => {
    setEstadoFiltro(e.target.value); // Actualizar el filtro de estado
  };

  const handleFechaChange = (e) => {
    setFechaFiltro(e.target.value); // Actualizar el filtro de fecha
  };

  const handleSolicitudChange = (value) => {
    setSolicitudFiltro(value); // Actualizar el filtro por ID de solicitud
  };

  const verificarSolicitud = (value, callback) => {
    const existe = solicitudes.some((solicitud) => solicitud.id_soli.toString() === value);
    callback(existe);
  };

  return (
    <div className="flex">
      <Sidebar />

      {/* Panel izquierdo con las solicitudes */}
      <div className="flex-grow max-w-5xl mx-auto mt-10 p-6 bg-gray-100 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-green-600">Mis Solicitudes</h1>

        {mensaje && (
          <div className="p-4 mb-6 text-white bg-red-500 rounded-md">
            {mensaje}
          </div>
        )}

        {cargando ? (
          <p className="text-gray-700 text-xl">Cargando solicitudes...</p>
        ) : solicitudes.length === 0 && !mensaje ? (
          <p className="text-gray-700 text-xl">No tienes solicitudes.</p>
        ) : (
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-green-500 text-black">
              <tr>
                <th className="py-3 px-6 text-left font-semibold">ID Solicitud</th>
                <th className="py-3 px-6 text-left font-semibold">ID Planilla</th>
                <th className="py-3 px-6 text-left font-semibold">Motivo</th>
                <th className="py-3 px-6 text-left font-semibold">Estado</th>
                <th className="py-3 px-6 text-left font-semibold">Fecha de creación</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {solicitudes.map((solicitud) => (
                <tr key={solicitud.id_soli} className="border-b border-gray-200 hover:bg-green-100">
                  <td className="py-3 px-6">{solicitud.id_soli}</td>
                  <td className="py-3 px-6">{solicitud.planilla_convenio}</td>
                  <td className="py-3 px-6">{solicitud.motivo}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`${
                        solicitud.estado === 'P' ? 'bg-yellow-500' : 
                        solicitud.estado === 'A' ? 'bg-green-600' :
                        solicitud.estado === 'R' ? 'bg-red-600' : ''
                      } text-white py-1 px-3 rounded-full text-sm`}
                    >
                      {solicitud.estado === 'P' ? 'Pendiente' : 
                       solicitud.estado === 'A' ? 'Aprobado' : 
                       solicitud.estado === 'R' ? 'Rechazado' : ''}
                    </span>
                  </td>
                  <td className="py-3 px-6">{solicitud.fecha_creacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Panel derecho con los filtros */}
      <PanelFiltros 
        estadoFiltro={estadoFiltro}
        handleEstadoChange={handleEstadoChange}
        fechaFiltro={fechaFiltro}
        handleFechaChange={handleFechaChange}
        solicitudFiltro={solicitudFiltro}
        handleSolicitudChange={handleSolicitudChange}
        verificarSolicitud={verificarSolicitud}
      />
    </div>
  );
};

export default ListaSolicitudes;
