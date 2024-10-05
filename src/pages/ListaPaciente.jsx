import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import Sidebar from '../components/Sidebar.jsx'; 
import { baseUrl } from '../api/asodi.api.js'; 

const ListaPaciente = () => {
  const [pacientes, setPacientes] = useState([]); 
  const [mensaje, setMensaje] = useState(null);  
  const [cargando, setCargando] = useState(true); 
  const navigate = useNavigate();                 

  // Función para obtener los pacientes desde la API
  const fetchPacientes = async () => {
    try {
      setCargando(true); 
      const response = await axios.get(`${baseUrl}/asodi/v1/planillas-convenio/`); 

      if (response.status === 200 && response.data.length > 0) {
        setPacientes(response.data); 
      } else {
        setMensaje('No hay pacientes registrados.');
      }
    } catch (error) {
      console.error('Error al obtener los pacientes:', error);
      setMensaje('Error al obtener los pacientes. Inténtalo de nuevo.');
    } finally {
      setCargando(false); 
    }
  };

  // useEffect para cargar los pacientes cuando se monte el componente
  useEffect(() => {
    fetchPacientes();
  }, []);

  // Función para redirigir al detalle de un paciente
  const handleRowClick = (id_planilla) => {
    navigate(`/paciente/${id_planilla}`);  // Navegamos a la página de detalles con el ID correcto
  };

  return (
    <div className="flex">
      <Sidebar />  {/* Si usas un Sidebar */}
      <div className="flex-grow max-w-5xl mx-auto mt-10 p-6 bg-gray-100 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-green-600">Lista de Pacientes</h1>

        {/* Mostrar mensaje de error o información */}
        {mensaje && (
          <div className="p-4 mb-6 text-white bg-red-500 rounded-md">
            {mensaje}
          </div>
        )}

        {/* Mostrar estado de cargando */}
        {cargando ? (
          <p className="text-gray-700 text-xl">Cargando pacientes...</p>
        ) : pacientes.length === 0 && !mensaje ? (
          <p className="text-gray-700 text-xl">No hay pacientes registrados.</p>
        ) : (
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-green-500 text-black">
              <tr>
                <th className="py-3 px-6 text-left font-semibold">ID</th>
                <th className="py-3 px-6 text-left font-semibold">RUT</th>
                <th className="py-3 px-6 text-left font-semibold">Nombre</th>
                <th className="py-3 px-6 text-left font-semibold">Apellido</th>
                <th className="py-3 px-6 text-left font-semibold">Fecha Recepción</th>
                <th className="py-3 px-6 text-left font-semibold">Convenio</th>
                <th className="py-3 px-6 text-left font-semibold">Estado Paciente</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {/* Iterar sobre los pacientes y mostrarlos en la tabla */}
              {pacientes.map((paciente) => (
                <tr 
                  key={paciente.id_planilla}  
                  className="border-b border-gray-200 hover:bg-green-100 cursor-pointer"
                  onClick={() => handleRowClick(paciente.id_planilla)}  // Usamos id_planilla para la navegación
                >
                  <td className="py-3 px-6">{paciente.id_planilla}</td> {/* Mostrar ID */}
                  <td className="py-3 px-6">{paciente.rut}</td> {/* Mostrar RUT */}
                  <td className="py-3 px-6">{paciente.nombre_paciente}</td> {/* Mostrar Nombre */}
                  <td className="py-3 px-6">{paciente.apellido_paciente}</td> {/* Mostrar Apellido */}
                  <td className="py-3 px-6">{paciente.fecha_recepcion}</td> {/* Mostrar Fecha */}
                  <td className="py-3 px-6">{paciente.convenios}</td> {/* Mostrar Convenio */}
                  <td className="py-3 px-6">
                    <span
                      className={`${
                        paciente.estado_paciente === 'A' ? 'bg-green-600' :
                        paciente.estado_paciente === 'E' ? 'bg-gray-500' :
                        paciente.estado_paciente === 'P' ? 'bg-yellow-500' : 
                        paciente.estado_paciente === 'O' ? 'bg-blue-600' :  
                        paciente.estado_paciente === 'R' ? 'bg-red-600' : 'bg-gray-400'
                      } text-white py-1 px-3 rounded-full text-sm`}
                    >
                      {paciente.estado_paciente === 'A' ? 'Alta' : 
                      paciente.estado_paciente === 'E' ? 'En Proceso' :
                      paciente.estado_paciente === 'P' ? 'Pendiente' :  
                      paciente.estado_paciente === 'O' ? 'Operado' :  
                      paciente.estado_paciente === 'R' ? 'Rechazado' : 'Desconocido'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ListaPaciente;
