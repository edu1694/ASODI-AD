import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserMd, FaCalendarAlt, FaFileAlt, FaNotesMedical } from 'react-icons/fa';
import Sidebar from '../components/Sidebar.jsx';
import { baseUrl } from '../api/asodi.api.js';

const DetallePaciente = () => {
  const { id } = useParams();  // Obtener el parámetro id_planilla de la URL
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);  
  const [mensaje, setMensaje] = useState(null);    
  const [cargando, setCargando] = useState(true);  

  // Verificación del ID y función para obtener los datos del paciente
  useEffect(() => {
    if (!id) {
      setMensaje('ID de paciente no encontrado.');
      setCargando(false);
      return;
    }

    const fetchPaciente = async () => {
      try {
        setCargando(true);
        // Llamada a la API para obtener los datos del paciente por el id_planilla
        const response = await axios.get(`${baseUrl}/asodi/v1/planillas-convenio/${id}/`);
        if (response.data) {
          setPaciente(response.data);  // Guardar los datos del paciente
        } else {
          setMensaje('No se encontró el paciente con el ID proporcionado.');
        }
      } catch (error) {
        console.error('Error al obtener los detalles del paciente:', error);
        setMensaje('Error al obtener los detalles del paciente. Inténtalo de nuevo.');
      } finally {
        setCargando(false);
      }
    };

    fetchPaciente();
  }, [id]);

  // Función para verificar si todos los campos médicos del paciente están completos
  const camposCompletos = () => {
    return paciente &&
      paciente.doctor &&
      paciente.fecha_cirugia &&
      paciente.fecha_evaluacion &&
      paciente.control_post_operatorio &&
      paciente.control_mes &&
      paciente.reg_primer_llamado &&
      paciente.reg_segundo_llamado &&
      paciente.reg_tercer_llamado &&
      paciente.observacion;
  };

  // Verificación para deshabilitar el botón de "Actualizar Paciente"
  const deshabilitarBoton = () => {
    return (
      camposCompletos() && paciente.estado_paciente === 'A' || // Todos los campos completos y el estado es "Alta"
      paciente.estado_paciente === 'R' // El estado del paciente es "Rechazado"
    );
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-grow max-w-5xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
        {mensaje ? (
          <div className="p-4 mb-6 text-white bg-red-500 rounded-md">
            {mensaje}
          </div>
        ) : cargando ? (
          <p className="text-gray-700 text-xl">Cargando detalles del paciente...</p>
        ) : paciente ? (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-green-600 mb-6 border-b pb-4">Detalles del Paciente</h1>
            
            {/* Tarjeta de Información Personal */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
              <div className="flex items-center space-x-4">
                <FaUserMd className="text-green-600 text-2xl" />
                <h2 className="text-2xl font-semibold text-gray-800">Información Personal</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <p><strong>ID:</strong> {paciente.id_planilla}</p>
                <p><strong>Nombre:</strong> {paciente.nombre_paciente}</p>
                <p><strong>RUT:</strong> {paciente.rut}</p>
                <p><strong>Apellido:</strong> {paciente.apellido_paciente}</p>
                <p><strong>Convenios:</strong> {paciente.convenios}</p>
              </div>
            </div>

            {/* Tarjeta de Estado del Paciente */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
              <div className="flex items-center space-x-4">
                <FaFileAlt className="text-green-600 text-2xl" />
                <h2 className="text-2xl font-semibold text-gray-800">Estado del Paciente</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <p><strong>Estado del Paciente:</strong> 
                  <span className={`ml-2 inline-block px-3 py-1 rounded-full text-sm text-white ${
                    paciente.estado_paciente === 'A' ? 'bg-green-600' :
                    paciente.estado_paciente === 'E' ? 'bg-gray-500' :
                    paciente.estado_paciente === 'P' ? 'bg-yellow-500' : 
                    paciente.estado_paciente === 'O' ? 'bg-blue-600' :  
                    paciente.estado_paciente === 'R' ? 'bg-red-600' : 'bg-gray-400'
                  }`}>
                    {paciente.estado_paciente === 'A' ? 'Alta' : 
                    paciente.estado_paciente === 'E' ? 'En Proceso' :
                    paciente.estado_paciente === 'P' ? 'Pendiente' :  
                    paciente.estado_paciente === 'O' ? 'Operado' :  
                    paciente.estado_paciente === 'R' ? 'Rechazado' : 'Desconocido'}
                  </span>
                </p>
                {/* Mostrar el motivo de rechazo solo si el estado es "Rechazado" */}
                {paciente.estado_paciente === 'R' && (
                  <p><strong>Motivo de Rechazo:</strong> {paciente.motivo_rechazo || 'No especificado'}</p>
                )}
              </div>
            </div>

            {/* Tarjeta de Información Médica */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
              <div className="flex items-center space-x-4">
                <FaNotesMedical className="text-green-600 text-2xl" />
                <h2 className="text-2xl font-semibold text-gray-800">Detalles Médicos</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <p><strong>Doctor:</strong> {paciente.doctor || 'No asignado'}</p>
                <p><strong>Fecha de Cirugía:</strong> {paciente.fecha_cirugia || 'No asignada'}</p>
                <p><strong>Fecha de Evaluación:</strong> {paciente.fecha_evaluacion || 'No asignada'}</p>
                <p><strong>Control Post-Operatorio:</strong> {paciente.control_post_operatorio || 'No realizado'}</p>
                <p><strong>Control de Mes:</strong> {paciente.control_mes || 'No realizado'}</p>
              </div>
            </div>

            {/* Tarjeta de Historial de Llamados */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
              <div className="flex items-center space-x-4">
                <FaCalendarAlt className="text-green-600 text-2xl" />
                <h2 className="text-2xl font-semibold text-gray-800">Historial de Llamados</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <p><strong>Fecha Cambio De Estado:</strong> {paciente.fecha_recepcion}</p>
                <p><strong>Primer Llamado:</strong> {paciente.reg_primer_llamado || 'No registrado'}</p>
                <p><strong>Fecha SIC:</strong> {paciente.fecha_sic}</p>
                <p><strong>Segundo Llamado:</strong> {paciente.reg_segundo_llamado || 'No registrado'}</p>
                <p><strong>Observación:</strong> {paciente.observacion || 'Ninguna'}</p>
                <p><strong>Tercer Llamado:</strong> {paciente.reg_tercer_llamado || 'No registrado'}</p>
              </div>
            </div>

            {/* Botón para actualizar los datos del paciente */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => navigate(`/EditarPaciente/${paciente.id_planilla}`)}
                className={`px-6 py-3 rounded-full font-semibold shadow-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  deshabilitarBoton()
                    ? 'bg-gray-400 text-gray-800 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                }`}
                disabled={deshabilitarBoton()} // Deshabilitar si todas las condiciones se cumplen
              >
                Actualizar Paciente
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DetallePaciente;
