import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import FiltroPaciente from '../components/FiltroPaciente.jsx'; // Importamos el componente de filtros
import { baseUrl } from '../api/asodi.api.js';

const ListaPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [idFiltro, setIdFiltro] = useState('');
  const [rutFiltro, setRutFiltro] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('Todos');
  const navigate = useNavigate();

  const fetchPacientes = async () => {
    try {
      setCargando(true);
      const response = await axios.get(`${baseUrl}/asodi/v1/planillas-convenio/`);

      if (response.status === 200 && response.data.length > 0) {
        setPacientes(response.data);
      } else {
        setPacientes([]);
      }
    } catch (error) {
      console.error('Error al obtener los pacientes:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleRowClick = (id_planilla) => {
    navigate(`/paciente/${id_planilla}`);
  };

  const formatFecha = (fecha) => {
    return fecha ? fecha.split('T')[0] : '';
  };

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const idMatch = idFiltro === '' || paciente.id_planilla.toString().includes(idFiltro);
    const rutMatch = rutFiltro === '' || paciente.rut.includes(rutFiltro);
    const fechaMatch = fechaFiltro === '' || formatFecha(paciente.fecha_recepcion) === fechaFiltro;
    const estadoMatch = estadoFiltro === 'Todos' || paciente.estado_paciente === estadoFiltro;
    return idMatch && rutMatch && fechaMatch && estadoMatch;
  });

  return (
    <div className="flex">
      <Sidebar /> {/* Sidebar */}

      <div className="flex-grow max-w-5xl mx-auto mt-10 p-6 bg-gray-100 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-green-600">Lista de Pacientes</h1>

        {cargando ? (
          <p className="text-gray-700 text-xl">Cargando pacientes...</p>
        ) : pacientesFiltrados.length === 0 ? (
          <p className="text-gray-700 text-xl">No se encontraron pacientes.</p>
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
              {pacientesFiltrados.map((paciente) => (
                <tr
                  key={paciente.id_planilla}
                  className="border-b border-gray-200 hover:bg-green-100 cursor-pointer"
                  onClick={() => handleRowClick(paciente.id_planilla)}
                >
                  <td className="py-3 px-6">{paciente.id_planilla}</td>
                  <td className="py-3 px-6">{paciente.rut}</td>
                  <td className="py-3 px-6">{paciente.nombre_paciente}</td>
                  <td className="py-3 px-6">{paciente.apellido_paciente}</td>
                  <td className="py-3 px-6">{formatFecha(paciente.fecha_recepcion)}</td> {/* Mostrar fecha formateada */}
                  <td className="py-3 px-6">{paciente.convenios}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`${
                        paciente.estado_paciente === 'A'
                          ? 'bg-green-600'
                          : paciente.estado_paciente === 'E'
                          ? 'bg-gray-500'
                          : paciente.estado_paciente === 'P'
                          ? 'bg-yellow-500'
                          : paciente.estado_paciente === 'O'
                          ? 'bg-blue-600'
                          : paciente.estado_paciente === 'R'
                          ? 'bg-red-600'
                          : 'bg-gray-400'
                      } text-white py-1 px-3 rounded-full text-sm`}
                    >
                      {paciente.estado_paciente === 'A'
                        ? 'Alta'
                        : paciente.estado_paciente === 'E'
                        ? 'En Proceso'
                        : paciente.estado_paciente === 'P'
                        ? 'Pendiente'
                        : paciente.estado_paciente === 'O'
                        ? 'Operado'
                        : paciente.estado_paciente === 'R'
                        ? 'Rechazado'
                        : 'Desconocido'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Panel derecho con los filtros */}
      <FiltroPaciente
        estadoFiltro={estadoFiltro}
        handleEstadoChange={(e) => setEstadoFiltro(e.target.value)}
        fechaFiltro={fechaFiltro}
        handleFechaChange={setFechaFiltro} // Actualizamos para que acepte el valor directamente
        rutFiltro={rutFiltro}
        handleRutChange={setRutFiltro}
      />
    </div>
  );
};

export default ListaPacientes;
