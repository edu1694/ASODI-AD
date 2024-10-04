import React, { useState, useEffect } from 'react';
import { baseUrl } from '../api/asodi.api.js';
import axios from 'axios';
import Sidebar from '../components/Sidebar.jsx';

const AddSolicitudForm = () => {  
  const [motivo, setMotivo] = useState('');
  const [planilla, setPlanilla] = useState('');
  const [usuarioSolicitante, setUsuarioSolicitante] = useState(''); 
  const [mensaje, setMensaje] = useState(null);
  const [errorPlanilla, setErrorPlanilla] = useState(null); 
  const [errorFormato, setErrorFormato] = useState(null); 

  useEffect(() => {
    const rutUsuario = localStorage.getItem('usuario_asodi_ad');
    if (rutUsuario) {
      setUsuarioSolicitante(rutUsuario); 
    } else {
      setMensaje('RUT de usuario no encontrado en localStorage.');
    }
  }, []);

  const validarPlanilla = async (idPlanilla) => {
    try {
      const response = await axios.get(`${baseUrl}/asodi/v1/planillas-convenio/`);
      const planillas = response.data;

      const planillaExiste = planillas.some(planilla => planilla.id === parseInt(idPlanilla));

      if (planillaExiste) {
        setErrorPlanilla(null); 
      } else {
        setErrorPlanilla('El ID de la planilla convenio no existe.');
      }
    } catch (error) {
      console.error('Error al obtener las planillas:', error); 
      setErrorPlanilla('Error al obtener las planillas. Inténtalo de nuevo.');
    }
  };

  const handlePlanillaChange = (e) => {
    const idPlanilla = e.target.value;

    const nonNumeric = /\D/; 
    if (nonNumeric.test(idPlanilla)) {
      setErrorFormato('Solo caracteres numéricos');
    } else {
      setErrorFormato(null); 
    }

    const onlyNumbers = idPlanilla.replace(/\D/g, '');
    setPlanilla(onlyNumbers);

    if (onlyNumbers) {
      validarPlanilla(onlyNumbers);
    } else {
      setErrorPlanilla(null); 
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (errorPlanilla || errorFormato) {
      setMensaje('No se puede crear la solicitud. Corrige los errores.');
      return;
    }

    const solicitudData = {
      motivo, 
      estado: 'P', 
      fecha_creacion: new Date().toISOString().slice(0, 10), 
      planilla_convenio: parseInt(planilla), 
      usuario_solicitante: usuarioSolicitante, 
    };

    try {
      const response = await axios.post(`${baseUrl}/asodi/v1/solicitudes/`, solicitudData);

      if (response.status === 201) {
        setMensaje('Solicitud creada con éxito');
        setMotivo('');
        setPlanilla('');
      }
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      setMensaje('Error al crear la solicitud, intenta nuevamente.');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow max-w-4xl mx-auto mt-10 p-8 bg-green-50 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Crear nueva solicitud</h1>

        {mensaje && (
          <div className={`p-4 mb-6 text-white text-center rounded-md ${mensaje.includes('éxito') ? 'bg-green-400' : 'bg-red-500'}`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Motivo</label>
            <textarea
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
              placeholder="Describe el motivo de la solicitud"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Planilla Convenio</label>
            <input
              type="text"
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={planilla}
              onChange={handlePlanillaChange}
              required
              placeholder="Ingresa el ID de la planilla convenio"
            />
            {errorFormato && <p className="text-red-500 mt-2">{errorFormato}</p>}
            {errorPlanilla && <p className="text-red-500 mt-2">{errorPlanilla}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Usuario Solicitante (RUT)</label>
            <input
              type="text"
              className="w-full p-3 border border-green-300 rounded-lg bg-gray-100 focus:outline-none"
              value={usuarioSolicitante}
              readOnly
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300"
          >
            Crear Solicitud
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSolicitudForm;
