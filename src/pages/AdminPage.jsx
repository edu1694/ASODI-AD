import React, { useEffect, useState } from 'react';
import Sidebar from '../components/SidebarAdmin';
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

const AdminPage = () => {
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
        data: monthlyPatientStats[selectedYear] || Array(12).fill(0),
        borderColor: 'red',
        fill: false,
      }
    ]
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-10">
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

        {/* Cards Section for Patients */}
        <h2 className="text-xl font-semibold mb-2">Cantidad de Pacientes por Estados</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {Object.entries(patientStats).map(([estado, cantidad]) => (
            <div key={estado} className="p-4 bg-white shadow rounded">
              <h2 className="font-bold">{estado}</h2>
              <p className="text-2xl">{cantidad}</p>
            </div>
          ))}
        </div>

        {/* New Cards Section for Requests */}
        <h2 className="text-xl font-semibold mb-2">Cantidad de Solicitudes por Estados</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {Object.entries(requestStats).map(([estado, cantidad]) => (
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

export default AdminPage;
