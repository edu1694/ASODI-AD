import React, { useState, useEffect } from 'react';
import { baseUrl } from '../api/asodi.api.js';
import axios from 'axios';
import Sidebar from '../components/SidebarAdmin.jsx';
import PanelFiltros from '../components/PanelFiltros.jsx';

const ListaSolicitudAdmin = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(false); // Estado para manejar el éxito
  const [cargando, setCargando] = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [solicitudFiltro, setSolicitudFiltro] = useState(''); // Filtro de ID de Solicitud
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null); // Para la solicitud seleccionada
  const [nuevoEstado, setNuevoEstado] = useState(''); // Para el nuevo estado

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        setCargando(true);
        const response = await axios.get(`${baseUrl}/asodi/v1/solicitudes/`);
        if (response.data.length > 0) {
          let solicitudesFiltradas = response.data;
          let filtroFallido = '';

          // Filtros
          if (estadoFiltro) {
            const solicitudesEstado = solicitudesFiltradas.filter(
              (solicitud) => solicitud.estado === estadoFiltro
            );
            if (solicitudesEstado.length === 0) filtroFallido = 'estado';
            solicitudesFiltradas = solicitudesEstado;
          }

          if (fechaFiltro) {
            const solicitudesFecha = solicitudesFiltradas.filter(
              (solicitud) => solicitud.fecha_creacion === fechaFiltro
            );
            if (solicitudesFecha.length === 0) filtroFallido = 'fecha';
            solicitudesFiltradas = solicitudesFecha;
          }

          if (solicitudFiltro) {
            const solicitudesID = solicitudesFiltradas.filter(
              (solicitud) => solicitud.id_soli.toString() === solicitudFiltro
            );
            if (solicitudesID.length === 0) filtroFallido = 'solicitud';
            solicitudesFiltradas = solicitudesID;
          }

          if (solicitudesFiltradas.length > 0) {
            setSolicitudes(solicitudesFiltradas);
            setMensaje(null);
          } else {
            setSolicitudes([]);
            setMensaje(`No hay solicitudes que coincidan con los filtros.`);
          }
        } else {
          setMensaje('No hay solicitudes.');
          setSolicitudes([]);
        }
      } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
        setMensaje('Error al obtener las solicitudes. Inténtalo de nuevo.');
      } finally {
        setCargando(false);
      }
    };

    fetchSolicitudes();
  }, [estadoFiltro, fechaFiltro, solicitudFiltro]);

  const handleEstadoChange = (e) => {
    setEstadoFiltro(e.target.value);
  };

  const handleFechaChange = (e) => {
    setFechaFiltro(e.target.value);
  };

  const handleSolicitudChange = (value) => {
    setSolicitudFiltro(value);
  };

  const handleEstadoSolicitud = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setNuevoEstado(solicitud.estado);
  };

  const handleConfirmarCambio = async () => {
    if (solicitudSeleccionada) {
      try {
        const updatedSolicitud = {
          ...solicitudSeleccionada,
          estado: nuevoEstado,
        };
        
        // Usar el método PUT para actualizar la solicitud completa
        await axios.put(`${baseUrl}/asodi/v1/solicitudes/${solicitudSeleccionada.id_soli}/`, updatedSolicitud);
        
        setMensajeExito(true); // Mostrar el mensaje de éxito
        setMensaje('Estado de la solicitud actualizado correctamente.');
        setSolicitudSeleccionada(null);

        // Refrescar la lista de solicitudes
        const response = await axios.get(`${baseUrl}/asodi/v1/solicitudes/`);
        setSolicitudes(response.data);

        // Ocultar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setMensajeExito(false);
          setMensaje(null);
        }, 3000);
      } catch (error) {
        console.error('Error al actualizar el estado:', error);
        setMensaje('Error al actualizar el estado de la solicitud.');
      }
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      {/* Panel izquierdo con las solicitudes */}
      <div className="flex-grow max-w-5xl mx-auto mt-10 p-6 bg-gray-100 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-green-600">Mis Solicitudes</h1>

        {mensaje && (
          <div
            className={`p-4 mb-6 rounded-md ${
              mensajeExito ? 'bg-green-200 text-green-800' : 'bg-red-500 text-white'
            }`}
          >
            {mensaje}
          </div>
        )}

        {cargando ? (
          <p className="text-gray-700 text-xl">Cargando solicitudes...</p>
        ) : solicitudes.length === 0 && !mensaje ? (
          <p className="text-gray-700 text-xl">No hay solicitudes.</p>
        ) : (
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-green-500 text-black">
              <tr>
                <th className="py-3 px-6 text-left font-semibold">ID Solicitud</th>
                <th className="py-3 px-6 text-left font-semibold">ID Planilla</th>
                <th className="py-3 px-6 text-left font-semibold">Motivo</th>
                <th className="py-3 px-6 text-left font-semibold">Estado</th>
                <th className="py-3 px-6 text-left font-semibold">Acciones</th>
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
                  <td className="py-3 px-6">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                      onClick={() => handleEstadoSolicitud(solicitud)}
                    >
                      Cambiar Estado
                    </button>
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
      />

      {/* Pop-up de confirmación */}
      {solicitudSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirmar Cambio de Estado</h2>
            <p className="mb-4">
              ¿Estás seguro de que deseas cambiar el estado de la solicitud ID {solicitudSeleccionada.id_soli}?
            </p>
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="P">Pendiente</option>
              <option value="A">Aprobado</option>
              <option value="R">Rechazado</option>
            </select>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mr-2"
              onClick={handleConfirmarCambio}
            >
              Confirmar
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={() => setSolicitudSeleccionada(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaSolicitudAdmin;
