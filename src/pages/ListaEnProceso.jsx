import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import { baseUrl } from '../api/asodi.api.js';

const ListaEnProceso = () => {
  const [pacientes, setPacientes] = useState([]);
  const [convenios, setConvenios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroConvenio, setFiltroConvenio] = useState(''); // Estado para filtrar por convenio
  const navigate = useNavigate();

  // Función para calcular los días restantes para operar
  const calcularTiempoRestante = (fechaCreacion, diasParaOperar) => {
    const ahora = new Date();
    const fechaCreacionDate = new Date(fechaCreacion);
    const tiempoTranscurrido = Math.abs(ahora - fechaCreacionDate);

    const diasRestantes = diasParaOperar - Math.floor(tiempoTranscurrido / (1000 * 60 * 60 * 24));
    const horasRestantes = 24 - Math.floor((tiempoTranscurrido % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutosRestantes = 60 - Math.floor((tiempoTranscurrido % (1000 * 60 * 60)) / (1000 * 60));

    return {
      dias: diasRestantes,
      horas: horasRestantes,
      minutos: minutosRestantes,
      display: `${diasRestantes} días, ${horasRestantes} horas y ${minutosRestantes} minutos`
    };
  };

  // Obtener convenios desde la API
  const fetchConvenios = async () => {
    try {
      const response = await axios.get(`${baseUrl}/asodi/v1/convenios/`);
      if (response.status === 200) {
        setConvenios(response.data);
        console.log('Convenios cargados:', response.data); // Log de los convenios cargados
      }
    } catch (error) {
      console.error('Error al obtener los convenios:', error);
    }
  };

  // Obtener pacientes en estado 'En Proceso'
  const fetchPacientes = async () => {
    try {
      setCargando(true);
      const response = await axios.get(`${baseUrl}/asodi/v1/planillas-convenio/`);
      if (response.status === 200 && response.data.length > 0) {
        const pacientesEnProceso = response.data
          .filter(paciente => paciente.estado_paciente === 'E')
          .map(paciente => {
            const convenio = convenios.find(conv => conv.nombre_convenio === paciente.convenios);
            const tiempoRestante = calcularTiempoRestante(paciente.fecha_recepcion, convenio?.dias_para_operar || 0);
            return { ...paciente, tiempoRestante, convenio };
          });

        // Ordenar los pacientes por los días restantes (prioridad)
        const pacientesOrdenados = pacientesEnProceso.sort((a, b) => {
          return (a.tiempoRestante.dias * 24 * 60 * 60 + a.tiempoRestante.horas * 3600 + a.tiempoRestante.minutos * 60) - 
                 (b.tiempoRestante.dias * 24 * 60 * 60 + b.tiempoRestante.horas * 3600 + b.tiempoRestante.minutos * 60);
        });

        setPacientes(pacientesOrdenados);
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
    fetchConvenios();
  }, []);

  useEffect(() => {
    if (convenios.length > 0) {
      fetchPacientes();
    }
  }, [convenios]);

  // Filtrado de pacientes por convenio
  const pacientesFiltrados = pacientes.filter(paciente => {
    if (filtroConvenio === '') return true; // Si no hay filtro seleccionado, muestra todos
    return paciente.convenios === filtroConvenio;
  });

  // Función para redirigir al detalle de un paciente
  const handleRowClick = (id_planilla) => {
    navigate(`/paciente/${id_planilla}`);
  };

  // Función para asignar colores según los días restantes
  const asignarColor = (diasRestantes, diasParaAlertar) => {
    if (diasRestantes <= diasParaAlertar) {
      return 'bg-red-500'; // Rojo si está dentro del rango de alerta
    } else if (diasRestantes <= 3) {
      return 'bg-yellow-500'; // Amarillo si falta poco tiempo
    } else {
      return 'bg-green-500'; // Verde si está en un estado normal
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow max-w-5xl mx-auto mt-10 p-6 bg-gray-100 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-green-600">Pacientes En Proceso</h1>

        {/* Filtro de convenios */}
        <div className="mb-4">
          <label htmlFor="convenioFilter" className="mr-2">Filtrar por Convenio:</label>
          <select
            id="convenioFilter"
            className="p-2 border rounded"
            value={filtroConvenio}
            onChange={(e) => setFiltroConvenio(e.target.value)}
          >
            <option value="">Todos</option>
            {convenios.map((convenio) => (
              <option key={convenio.nombre_convenio} value={convenio.nombre_convenio}>
                {convenio.nombre_convenio}
              </option>
            ))}
          </select>
        </div>

        {cargando ? (
          <p>Cargando pacientes...</p>
        ) : pacientesFiltrados.length === 0 ? (
          <p>No se encontraron pacientes en estado en proceso.</p>
        ) : (
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-gray-500 text-white">
              <tr>
                <th className="py-3 px-6 text-left font-semibold">ID</th>
                <th className="py-3 px-6 text-left font-semibold">RUT</th>
                <th className="py-3 px-6 text-left font-semibold">Nombre</th>
                <th className="py-3 px-6 text-left font-semibold">Apellido</th>
                <th className="py-3 px-6 text-left font-semibold">Convenio</th>
                <th className="py-3 px-6 text-left font-semibold">Días Restantes</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {pacientesFiltrados.map(paciente => (
                <tr
                  key={paciente.id_planilla}
                  className={`${asignarColor(paciente.tiempoRestante.dias, paciente.convenio.dias_para_alertar)} border-b border-gray-200 hover:bg-green-100 cursor-pointer`}
                  onClick={() => handleRowClick(paciente.id_planilla)} // Redirigir al hacer clic
                >
                  <td className="py-3 px-6">{paciente.id_planilla}</td>
                  <td className="py-3 px-6">{paciente.rut}</td>
                  <td className="py-3 px-6">{paciente.nombre_paciente}</td>
                  <td className="py-3 px-6">{paciente.apellido_paciente}</td>
                  <td className="py-3 px-6">{paciente.convenios}</td>
                  <td className="py-3 px-6">{paciente.tiempoRestante.display}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ListaEnProceso;
