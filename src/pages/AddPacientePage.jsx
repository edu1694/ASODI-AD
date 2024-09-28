import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../api/asodi.api.js';
import Sidebar from '../components/Sidebar';

function AddPacientePage() {
  const [pacienteData, setPacienteData] = useState({
    fecha_recepcion: '',
    rut: '',
    nombre_paciente: '',
    apellido_paciente: '',
    fecha_sic: '',
    reg_primer_llamado: '',
    reg_segundo_llamado: '',
    reg_tercer_llamado: '',
    observacion: '',
    doctor: '',
    fecha_evaluacion: '',
    fecha_cirugia: '',
    control_post_operatorio: '',
    control_mes: '',
    estado_paciente: 'P',
    convenios: '',
    usuario_asodi_ad: ''
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const usuarioAsodi = localStorage.getItem('usuario_asodi_ad');
    if (usuarioAsodi) {
      setPacienteData(prevData => ({
        ...prevData,
        usuario_asodi_ad: usuarioAsodi,
      }));
    }
  }, []);

  const handleChange = (e) => {
    setPacienteData({
      ...pacienteData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseUrl}/asodi/v1/planillas-convenio/`,
        pacienteData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 201) {
        setMessage('Paciente agregado exitosamente');
        setMessageType('success');

        setPacienteData({
          fecha_recepcion: '',
          rut: '',
          nombre_paciente: '',
          apellido_paciente: '',
          fecha_sic: '',
          reg_primer_llamado: '',
          reg_segundo_llamado: '',
          reg_tercer_llamado: '',
          observacion: '',
          doctor: '',
          fecha_evaluacion: '',
          fecha_cirugia: '',
          control_post_operatorio: '',
          control_mes: '',
          estado_paciente: 'P',
          convenios: '',
          usuario_asodi_ad: localStorage.getItem('usuario_asodi_ad'),
        });

        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      setMessage('Error al agregar el paciente');
      setMessageType('error');

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10 bg-gray-100">
        <h1 className="text-4xl font-bold mb-4 text-center">Agregar Paciente</h1>

        {message && (
          <div className={`text-white font-bold py-2 px-4 rounded mb-4 ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fecha de recepción */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_recepcion">
              Fecha recepción:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="fecha_recepcion"
              name="fecha_recepcion"
              type="date"
              value={pacienteData.fecha_recepcion}
              onChange={handleChange}
              required
            />
          </div>

          {/* Rut */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rut">
              RUT:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="rut"
              name="rut"
              type="text"
              value={pacienteData.rut}
              onChange={handleChange}
              required
            />
          </div>

          {/* Nombre paciente */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre_paciente">
              Nombre paciente:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="nombre_paciente"
              name="nombre_paciente"
              type="text"
              value={pacienteData.nombre_paciente}
              onChange={handleChange}
              required
            />
          </div>

          {/* Apellido paciente */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido_paciente">
              Apellido paciente:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="apellido_paciente"
              name="apellido_paciente"
              type="text"
              value={pacienteData.apellido_paciente}
              onChange={handleChange}
              required
            />
          </div>

          {/* Fecha sic */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_sic">
              Fecha sic:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="fecha_sic"
              name="fecha_sic"
              type="date"
              value={pacienteData.fecha_sic}
              onChange={handleChange}
            />
          </div>

          {/* Reg primer llamado */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reg_primer_llamado">
              Reg primer llamado:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="reg_primer_llamado"
              name="reg_primer_llamado"
              type="date"
              value={pacienteData.reg_primer_llamado}
              onChange={handleChange}
            />
          </div>

          {/* Reg segundo llamado */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reg_segundo_llamado">
              Reg segundo llamado:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="reg_segundo_llamado"
              name="reg_segundo_llamado"
              type="date"
              value={pacienteData.reg_segundo_llamado}
              onChange={handleChange}
            />
          </div>

          {/* Reg tercer llamado */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reg_tercer_llamado">
              Reg tercer llamado:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="reg_tercer_llamado"
              name="reg_tercer_llamado"
              type="date"
              value={pacienteData.reg_tercer_llamado}
              onChange={handleChange}
            />
          </div>

          {/* Observacion */}
          <div className="mb-4 col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="observacion">
              Observación:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="observacion"
              name="observacion"
              value={pacienteData.observacion}
              onChange={handleChange}
            />
          </div>

          {/* Doctor */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="doctor">
              Doctor:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="doctor"
              name="doctor"
              type="text"
              value={pacienteData.doctor}
              onChange={handleChange}
            />
          </div>

          {/* Fecha evaluacion */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_evaluacion">
              Fecha evaluación:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="fecha_evaluacion"
              name="fecha_evaluacion"
              type="date"
              value={pacienteData.fecha_evaluacion}
              onChange={handleChange}
            />
          </div>

          {/* Fecha cirugia */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_cirugia">
              Fecha cirugía:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="fecha_cirugia"
              name="fecha_cirugia"
              type="date"
              value={pacienteData.fecha_cirugia}
              onChange={handleChange}
            />
          </div>

          {/* Control post operatorio */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="control_post_operatorio">
              Control post operatorio:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="control_post_operatorio"
              name="control_post_operatorio"
              type="date"
              value={pacienteData.control_post_operatorio}
              onChange={handleChange}
            />
          </div>

          {/* Control mes */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="control_mes">
              Control mes:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="control_mes"
              name="control_mes"
              type="date"
              value={pacienteData.control_mes}
              onChange={handleChange}
            />
          </div>

          {/* Estado paciente */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado_paciente">
              Estado paciente:
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="estado_paciente"
              name="estado_paciente"
              value={pacienteData.estado_paciente}
              onChange={handleChange}
            >
              <option value="P">Pendiente</option>
              <option value="E">En proceso</option>
              <option value="A">Alta</option>
            </select>
          </div>

          {/* Convenios */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="convenios">
              Convenios:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="convenios"
              name="convenios"
              type="text"
              value={pacienteData.convenios}
              onChange={handleChange}
            />
          </div>

          {/* Botón para enviar */}
          <div className="col-span-2 flex justify-center">
            <button
              type="submit"
              className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} transition duration-300`}
              disabled={isLoading}
            >
              {isLoading ? 'Cargando...' : 'Agregar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPacientePage;
