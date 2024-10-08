import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import { baseUrl } from '../api/asodi.api.js';

const ListaPendientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [convenios, setConvenios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroConvenio, setFiltroConvenio] = useState(''); // Estado para filtrar por convenio
  const navigate = useNavigate();

  // Función para calcular las horas y minutos restantes para el llamado
  const calcularHorasYMinutosRestantes = (fechaRecepcion, horasLlamado) => {
    const ahora = new Date(); // Fecha actual
    const fechaRecepcionDate = new Date(fechaRecepcion); // Fecha de recepción del paciente

    // Verificación de la fecha de recepción
    if (isNaN(fechaRecepcionDate)) {
      console.error('Fecha de recepción inválida:', fechaRecepcion);
      return null;
    }

    // Calcular la diferencia en milisegundos y luego convertir a horas
    const diferenciaMilisegundos = ahora.getTime() - fechaRecepcionDate.getTime();
    const tiempoTranscurridoEnHoras = diferenciaMilisegundos / 1000 / 60 / 60;

    // Calcular las horas restantes según las horas del convenio
    const horasRestantes = horasLlamado - tiempoTranscurridoEnHoras;

    if (horasRestantes <= 0) {
      return { display: '0 horas', totalHorasRestantes: 0 }; // Si ya pasó el tiempo, mostrar 0 horas
    }

    // Descomponer las horas restantes en horas y minutos
    const horas = Math.floor(horasRestantes);
    const minutos = Math.floor((horasRestantes - horas) * 60);

    return {
      horas: horas,
      minutos: minutos,
      totalHorasRestantes: horasRestantes, // Esto lo usamos para la ordenación
      display: `${horas} horas y ${minutos} minutos`
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

  // Obtener pacientes en estado 'Pendiente'
  const fetchPacientes = async () => {
    try {
      setCargando(true);
      const response = await axios.get(`${baseUrl}/asodi/v1/planillas-convenio/`);
      if (response.status === 200 && response.data.length > 0) {
        const pacientesPendientes = response.data
          .filter(paciente => paciente.estado_paciente === 'P')
          .map(paciente => {
            console.log('Paciente:', paciente);

            // Obtener las horas del convenio asociado al paciente
            const convenio = convenios.find(conv => conv.nombre_convenio === paciente.convenios); 
            console.log('Convenio asociado:', convenio);

            if (convenio && convenio.horas_llamado) {
              // Calcular las horas y minutos restantes según el convenio
              const horasRestantes = calcularHorasYMinutosRestantes(paciente.fecha_recepcion, convenio.horas_llamado);
              return { ...paciente, horasRestantes };
            } else {
              return { ...paciente, horasRestantes: { display: 'No disponible', totalHorasRestantes: Infinity } };
            }
          });

        // Ordenar los pacientes por el tiempo restante (prioridad)
        const pacientesOrdenados = pacientesPendientes.sort((a, b) => {
          return a.horasRestantes.totalHorasRestantes - b.horasRestantes.totalHorasRestantes;
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

  // Función para asignar prioridad visual según las horas restantes
  const prioridadPaciente = (horasRestantes) => {
    if (horasRestantes <= 0) {
      return 'bg-red-500'; // Alto riesgo
    } else if (horasRestantes <= 4) {
      return 'bg-yellow-500'; // Riesgo moderado
    } else {
      return 'bg-green-500'; // Todo está bien
    }
  };

  // Filtrado de pacientes por convenio
  const pacientesFiltrados = pacientes.filter(paciente => {
    if (filtroConvenio === '') return true; // Si no hay filtro seleccionado, muestra todos
    return paciente.convenios === filtroConvenio;
  });

  // Función para redirigir al detalle de un paciente
  const handleRowClick = (id_planilla) => {
    navigate(`/paciente/${id_planilla}`);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-grow max-w-5xl mx-auto mt-10 p-6 bg-gray-100 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-green-600">Pacientes Pendientes</h1>

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
          <p>No se encontraron pacientes en estado pendiente.</p>
        ) : (
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-gray-500 text-white">
              <tr>
                <th className="py-3 px-6 text-left font-semibold">ID</th>
                <th className="py-3 px-6 text-left font-semibold">RUT</th>
                <th className="py-3 px-6 text-left font-semibold">Nombre</th>
                <th className="py-3 px-6 text-left font-semibold">Apellido</th>
                <th className="py-3 px-6 text-left font-semibold">Convenio</th>
                <th className="py-3 px-6 text-left font-semibold">Fecha Recepción</th>
                <th className="py-3 px-6 text-left font-semibold">Horas Restantes</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {pacientesFiltrados.map(paciente => (
                <tr
                  key={paciente.id_planilla}
                  className={`${prioridadPaciente(paciente.horasRestantes.totalHorasRestantes)} border-b border-gray-200 hover:bg-green-100 cursor-pointer`}
                  onClick={() => handleRowClick(paciente.id_planilla)} // Redirigir al hacer clic
                >
                  <td className="py-3 px-6">{paciente.id_planilla}</td>
                  <td className="py-3 px-6">{paciente.rut}</td>
                  <td className="py-3 px-6">{paciente.nombre_paciente}</td>
                  <td className="py-3 px-6">{paciente.apellido_paciente}</td>
                  <td className="py-3 px-6">{paciente.convenios}</td>
                  <td className="py-3 px-6">{new Date(paciente.fecha_recepcion).toLocaleString()}</td> {/* Formato de fecha local */}
                  <td className="py-3 px-6">{paciente.horasRestantes.display}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ListaPendientes;
