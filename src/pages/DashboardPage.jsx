import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Pie, Line } from 'react-chartjs-2';
import axios from 'axios';
import { baseUrl } from '../api/asodi.api.js';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const AlertaPacientes = ({ pacientes }) => {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
      <h3 className="font-bold text-lg">Pacientes con llamada pendiente cercana</h3>
      {pacientes.length > 0 ? (
        <ul>
          {pacientes.map((paciente) => (
            <li key={paciente.id_planilla} className="mt-2">
              {paciente.riesgoAlto && <span className="text-red-700 font-bold mr-2">⚠️</span>}
              {paciente.nombre_paciente} {paciente.apellido_paciente} - Llamada en {paciente.horasRestantes.display}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay pacientes con llamadas pendientes próximas.</p>
      )}
    </div>
  );
};

const DashboardPage = () => {
  const [patientStats, setPatientStats] = useState({ Pendiente: 0, EnProceso: 0, Operado: 0, Alta: 0, Rechazado: 0 });
  const [monthlyPatientStats, setMonthlyPatientStats] = useState({});
  const [requestStats, setRequestStats] = useState({ Pendiente: 0, Aprobada: 0, Rechazada: 0 });
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [pacientesAlerta, setPacientesAlerta] = useState([]);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const responsePacientes = await axios.get(`${baseUrl}/asodi/v1/planillas-convenio/`);
        const responseConvenios = await axios.get(`${baseUrl}/asodi/v1/convenios/`);
        
        if (responsePacientes.status === 200 && responseConvenios.status === 200) {
          const pacientesPendientes = responsePacientes.data.filter(paciente => paciente.estado_paciente === 'P');
          const convenios = responseConvenios.data;

          const alertaPacientes = pacientesPendientes.filter(paciente => {
            const convenio = convenios.find(conv => conv.nombre_convenio === paciente.convenios);

            if (!convenio || !convenio.horas_llamado) return false;

            const fechaRecepcion = new Date(paciente.fecha_recepcion);
            const ahora = new Date();
            const diferenciaMilisegundos = ahora - fechaRecepcion;
            const tiempoTranscurridoEnHoras = diferenciaMilisegundos / 1000 / 60 / 60;

            const horasRestantes = convenio.horas_llamado - tiempoTranscurridoEnHoras;

            if (horasRestantes <= 0) {
              paciente.riesgoAlto = true;
              return true;
            } else if (horasRestantes <= 4) {
              paciente.riesgoAlto = false;
              return true;
            }

            return false;
          }).map(paciente => {
            const convenio = convenios.find(conv => conv.nombre_convenio === paciente.convenios);
            const fechaRecepcion = new Date(paciente.fecha_recepcion);
            const ahora = new Date();
            const diferenciaMilisegundos = ahora - fechaRecepcion;
            const tiempoTranscurridoEnHoras = diferenciaMilisegundos / 1000 / 60 / 60;
            const horasRestantes = convenio.horas_llamado - tiempoTranscurridoEnHoras;

            const horas = Math.floor(horasRestantes);
            const minutos = Math.floor((horasRestantes - horas) * 60);

            return {
              ...paciente,
              horasRestantes: {
                display: `${horas} horas y ${minutos} minutos`
              }
            };
          });

          setPacientesAlerta(alertaPacientes);
        }
      } catch (error) {
        console.error("Error al obtener los datos de pacientes o convenios:", error);
      }
    };

    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/asodi/v1/planillas-convenio/`);
        const patients = response.data;
        const stats = { Pendiente: 0, EnProceso: 0, Operado: 0, Alta: 0, Rechazado: 0 };
        const monthlyStats = {};

        patients.forEach(patient => {
          const estado = {
            'P': 'Pendiente',
            'E': 'EnProceso',
            'O': 'Operado',
            'A': 'Alta',
            'R': 'Rechazado'
          }[patient.estado_paciente] || patient.estado_paciente;
          
          const fechaRecepcion = new Date(patient.fecha_recepcion);
          const monthIndex = fechaRecepcion.getMonth();
          const year = fechaRecepcion.getFullYear();

          if (year === parseInt(selectedYear) && (selectedMonth === "" || monthIndex === parseInt(selectedMonth))) {
            stats[estado] += 1;
            if (!monthlyStats[year]) {
              monthlyStats[year] = Array(12).fill(0);
            }
            monthlyStats[year][monthIndex] += 1;
          }
        });

        setPatientStats(stats);
        setMonthlyPatientStats(monthlyStats);
      } catch (error) {
        console.error("Error al obtener los datos de los pacientes:", error);
      }
    };

    const fetchRequestData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/asodi/v1/solicitudes/`);
        const requests = response.data;
        const stats = { Pendiente: 0, Aprobada: 0, Rechazada: 0 };

        requests.forEach(request => {
          const estado = {
            'P': 'Pendiente',
            'A': 'Aprobada',
            'R': 'Rechazada'
          }[request.estado] || request.estado;
          
          const fechaSolicitud = new Date(request.fecha_creacion);
          const monthIndex = fechaSolicitud.getMonth();
          const year = fechaSolicitud.getFullYear();

          if (year === parseInt(selectedYear) && (selectedMonth === "" || monthIndex === parseInt(selectedMonth))) {
            stats[estado] += 1;
          }
        });

        setRequestStats(stats);
      } catch (error) {
        console.error("Error al obtener los datos de las solicitudes:", error);
      }
    };

    fetchPacientes();
    fetchPatientData();
    fetchRequestData();
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const patientData = {
    labels: ['Pendiente', 'En Proceso', 'Operado', 'Alta', 'Rechazado'],
    datasets: [
      {
        data: Object.values(patientStats),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#F7464A'],
      }
    ]
  };

  const requestData = {
    labels: ['Pendiente', 'Aprobada', 'Rechazada'],
    datasets: [
      {
        data: Object.values(requestStats),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      }
    ]
  };

  const lineData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: selectedYear.toString(),
        data: monthlyPatientStats[selectedYear] || Array(12).fill(0), // Muestra los datos del año seleccionado
        borderColor: 'red',
        fill: false,
      }
    ]
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-10">
        <AlertaPacientes pacientes={pacientesAlerta} />

        {/* Header with Filters */}
        <div className="flex items-center mb-10">
          <h1 className="text-3xl font-bold mr-4">Dashboard de Pacientes</h1>
          <select className="border p-2 mr-4" onChange={handleYearChange} value={selectedYear}>
            {[2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select className="border p-2" onChange={handleMonthChange} value={selectedMonth}>
            <option value="">Todos los Meses</option>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month, index) => (
              <option key={index} value={month}>{['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][month]}</option>
            ))}
          </select>
        </div>

        {/* Cards Section */}
        <h2 className="text-xl font-semibold mb-2">Cantidad de Pacientes por Estados</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {Object.entries(patientStats).map(([estado, cantidad]) => (
            <div key={estado} className="p-4 bg-white shadow rounded">
              <h2 className="font-bold">{estado}</h2>
              <p className="text-2xl">{cantidad}</p>
            </div>
          ))}
        </div>

        {/* Pie Chart Section with Custom Legend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="p-6 bg-white shadow rounded flex items-center">
            <div style={{ width: '200px', height: '200px', marginRight: '20px' }}>
              <Pie data={patientData} options={{ plugins: { legend: { display: false } } }} />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Estados de Pacientes</h2>
              <ul>
                {patientData.labels.map((label, index) => (
                  <li key={index} className="flex items-center">
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: patientData.datasets[0].backgroundColor[index],
                        marginRight: '8px',
                      }}
                    ></div>
                    {label}: {Object.values(patientStats)[index]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="p-6 bg-white shadow rounded flex items-center">
            <div style={{ width: '200px', height: '200px', marginRight: '20px' }}>
              <Pie data={requestData} options={{ plugins: { legend: { display: false } } }} />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Solicitudes por Estado</h2>
              <ul>
                {requestData.labels.map((label, index) => (
                  <li key={index} className="flex items-center">
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: requestData.datasets[0].backgroundColor[index],
                        marginRight: '8px',
                      }}
                    ></div>
                    {label}: {Object.values(requestStats)[index]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Line Chart Section */}
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Cantidad de Pacientes Ingresados por Mes y Año</h2>
          <div style={{ width: '100%', height: '400px' }}>
            <Line data={lineData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
