import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Pie, Line } from 'react-chartjs-2';
import axios from 'axios';
import { baseUrl } from '../api/asodi.api.js';
import Notification from '../components/Notification';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const DashboardPage = () => {
  const [patientStats, setPatientStats] = useState({ Pendiente: 0, EnProceso: 0, Operado: 0, Alta: 0, Rechazado: 0 });
  const [monthlyPatientStats, setMonthlyPatientStats] = useState({});
  const [requestStats, setRequestStats] = useState({ Pendiente: 0, Aprobada: 0, Rechazada: 0 });
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/asodi/v1/planillas-convenio/`);
        const patients = response.data;
        const stats = { Pendiente: 0, EnProceso: 0, Operado: 0, Alta: 0, Rechazado: 0 };
        const monthlyStats = {};

        patients.forEach((patient) => {
          const estado = {
            P: 'Pendiente',
            E: 'EnProceso',
            O: 'Operado',
            A: 'Alta',
            R: 'Rechazado',
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

        requests.forEach((request) => {
          const estado = {
            P: 'Pendiente',
            A: 'Aprobada',
            R: 'Rechazada',
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

    fetchPatientData();
    fetchRequestData();
  }, [selectedMonth, selectedYear]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const patientData = {
    labels: ['Pendiente', 'En Proceso', 'Operado', 'Alta', 'Rechazado'],
    datasets: [
      {
        data: Object.values(patientStats),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#F7464A'],
      },
    ],
  };

  const requestData = {
    labels: ['Pendiente', 'Aprobada', 'Rechazada'],
    datasets: [
      {
        data: Object.values(requestStats),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const lineData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: selectedYear.toString(),
        data: monthlyPatientStats[selectedYear] || Array(12).fill(0),
        borderColor: 'red',
        fill: false,
      },
    ],
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-10">
        {/* Header with Filters and Notification */}
        <div className="flex items-center mb-10">
          <h1 className="text-3xl font-bold mr-4">Dashboard de Pacientes</h1>
          <select className="border p-2 mr-4" onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
            {[2023, 2024, 2025].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select className="border p-2 mr-4" onChange={(e) => setSelectedMonth(e.target.value)} value={selectedMonth}>
            <option value="">Todos los Meses</option>
            {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
          <Notification />
        </div>

        {/* Grid Layout for Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Estados de Pacientes</h2>
            <div className="h-64">
              <Pie data={patientData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Solicitudes por Estado</h2>
            <div className="h-64">
              <Pie data={requestData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Line Chart Section */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Cantidad de Pacientes Ingresados por Mes y Año</h2>
          <div className="h-96">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
