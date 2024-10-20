import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserMd, FaCalendarAlt, FaNotesMedical, FaFileAlt } from 'react-icons/fa';
import Sidebar from '../components/Sidebar.jsx';
import { baseUrl } from '../api/asodi.api.js';

const EditarPaciente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(true);
  const [mostrarRechazarModal, setMostrarRechazarModal] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [mostrarErrorRechazo, setMostrarErrorRechazo] = useState(false);
  const [disabledFields, setDisabledFields] = useState({});

  const [planilla, setPlanilla] = useState({
    nombre_paciente: '',
    apellido_paciente: '',
    rut: '',
    convenios: '',
    estado_paciente: '',
    doctor: '',
    fecha_cirugia: '',
    fecha_evaluacion: '',
    control_post_operatorio: '',
    control_mes: '',
    reg_segundo_llamado: '',
    reg_tercer_llamado: '',
    observacion: '',
    motivo_rechazo: '',
    fecha_recepcion: '',
  });

  const [editData, setEditData] = useState({
    doctor: '',
    fecha_cirugia: '',
    fecha_evaluacion: '',
    control_post_operatorio: '',
    control_mes: '',
    reg_segundo_llamado: '',
    reg_tercer_llamado: '',
    observacion: '',
    estado_paciente: '',
  });

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        setCargando(true);
        const response = await axios.get(`${baseUrl}/asodi/v1/planillas-convenio/${id}/`);
        if (response.data) {
          const pacienteEncontrado = response.data;
          setPaciente(pacienteEncontrado);
          setPlanilla(pacienteEncontrado);

          setEditData({
            doctor: pacienteEncontrado.doctor || '',
            fecha_cirugia: pacienteEncontrado.fecha_cirugia || '',
            fecha_evaluacion: pacienteEncontrado.fecha_evaluacion || '',
            control_post_operatorio: pacienteEncontrado.control_post_operatorio || '',
            control_mes: pacienteEncontrado.control_mes || '',
            reg_segundo_llamado: pacienteEncontrado.reg_segundo_llamado || '',
            reg_tercer_llamado: pacienteEncontrado.reg_tercer_llamado || '',
            observacion: pacienteEncontrado.observacion || '',
            estado_paciente: pacienteEncontrado.estado_paciente || '',
          });

          const initialDisabledFields = {};
          Object.keys(pacienteEncontrado).forEach((field) => {
            if (pacienteEncontrado[field] && field !== 'observacion') {
              initialDisabledFields[field] = true;
            }
          });
          setDisabledFields(initialDisabledFields);

          if (pacienteEncontrado.estado_paciente === 'R') {
            setBotonDeshabilitado(true);
          }
        } else {
          setMensaje('Paciente no encontrado.');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const validateDate = (date) => {
    if (!date) return null;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date) ? date : null;
  };

  const avanzarEstado = async () => {
    const estadosPermitidos = ['P', 'E', 'O', 'A'];
    const estadoActualIndex = estadosPermitidos.indexOf(editData.estado_paciente);

    if (estadoActualIndex < estadosPermitidos.length - 1) {
      const nuevoEstado = estadosPermitidos[estadoActualIndex + 1];
      setEditData((prevState) => ({ ...prevState, estado_paciente: nuevoEstado }));

      let nuevaFechaRecepcion = planilla.fecha_recepcion;
      if (nuevoEstado === 'E') {
        const ahora = new Date();
        const localDate = new Intl.DateTimeFormat('sv-SE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hourCycle: 'h23',
          timeZone: 'America/Santiago',
        }).format(ahora);
        nuevaFechaRecepcion = `${localDate.replace(' ', 'T')}-03:00`;
      }

      console.log('Nueva fecha_recepcion calculada:', nuevaFechaRecepcion);

      try {
        const updatedPlanilla = { ...planilla, estado_paciente: nuevoEstado, fecha_recepcion: nuevaFechaRecepcion };
        console.log('Datos enviados al servidor para actualizar:', updatedPlanilla);

        const response = await axios.put(`${baseUrl}/asodi/v1/planillas-convenio/${id}/`, updatedPlanilla);
        if (response.status === 200) {
          console.log('Respuesta exitosa del servidor:', response.data);
          setMensaje('Estado del paciente actualizado correctamente.');
          setPlanilla(updatedPlanilla);
        } else {
          console.warn('El servidor respondió, pero el estado no fue 200:', response);
        }
      } catch (error) {
        console.error('Error al actualizar el estado del paciente:', error);
        setMensaje('Hubo un error al actualizar el estado del paciente.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validData = {
      ...editData,
      fecha_cirugia: validateDate(editData.fecha_cirugia),
      fecha_evaluacion: validateDate(editData.fecha_evaluacion),
      control_post_operatorio: validateDate(editData.control_post_operatorio),
      control_mes: validateDate(editData.control_mes),
      reg_segundo_llamado: validateDate(editData.reg_segundo_llamado),
      reg_tercer_llamado: validateDate(editData.reg_tercer_llamado),
      motivo_rechazo: motivoRechazo,
    };

    const updatedPlanilla = {
      ...planilla,
      ...validData,
      fecha_recepcion: planilla.estado_paciente === 'E' ? planilla.fecha_recepcion : undefined,
    };

    try {
      const response = await axios.put(`${baseUrl}/asodi/v1/planillas-convenio/${id}/`, updatedPlanilla);
      if (response.status === 200) {
        setMostrarExito(true);
        setBotonDeshabilitado(true);

        const updatedDisabledFields = { ...disabledFields };
        Object.keys(editData).forEach((field) => {
          if (editData[field] && field !== 'observacion') {
            updatedDisabledFields[field] = true;
          }
        });
        setDisabledFields(updatedDisabledFields);

        setTimeout(() => {
          setMostrarExito(false);
          navigate(`/paciente/${id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error en la solicitud de actualización:', error.response?.data || error.message);
      setMensaje(`Hubo un error al actualizar los datos: ${error.response?.data || error.message}`);
    }
  };

  const confirmarAvanzarEstado = () => {
    setMostrarConfirmacion(true);
  };

  const confirmarAvance = () => {
    avanzarEstado();
    setMostrarConfirmacion(false);
  };

  const cancelarAvance = () => {
    setMostrarConfirmacion(false);
  };

  const cerrarAdvertencia = () => {
    setMostrarAdvertencia(false);
  };

  const handleRechazarPaciente = () => {
    setMostrarRechazarModal(true);
  };

  const cerrarRechazarModal = () => {
    setMostrarRechazarModal(false);
  };

  const confirmarRechazo = () => {
    if (!motivoRechazo.trim()) {
      setMostrarErrorRechazo(true);
    } else {
      setEditData({ ...editData, estado_paciente: 'R' });
      handleSubmit();
      cerrarRechazarModal();
    }
  };

  const cerrarErrorRechazo = () => {
    setMostrarErrorRechazo(false);
  };

  const handleCancel = () => {
    navigate(`/paciente/${id}`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow max-w-5xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
        {mostrarAdvertencia && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-yellow-100 p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-semibold mb-4">Advertencia</h2>
              <p className="mb-4">
                Recuerda que la actualización de datos de los pacientes solo se permite una única vez. Una vez rellenados,
                los campos serán deshabilitados.
              </p>
              <button
                onClick={cerrarAdvertencia}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-yellow-600 transition duration-300"
              >
                Aceptar
              </button>
            </div>
          </div>
        )}

        {mostrarConfirmacion && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-semibold mb-4">Confirmar</h2>
              <p className="mb-4">¿Estás seguro de que deseas avanzar el estado del paciente?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmarAvance}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                >
                  Confirmar
                </button>
                <button
                  onClick={cancelarAvance}
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {mostrarRechazarModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-semibold mb-4">Rechazar Paciente</h2>
              <p className="mb-4">
                El estado del paciente será cambiado a "Rechazado". Por favor, ingresa el motivo del rechazo:
              </p>
              <textarea
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                placeholder="Motivo del rechazo"
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={confirmarRechazo}
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-300"
                >
                  Confirmar Rechazo
                </button>
                <button
                  onClick={cerrarRechazarModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600 transition duration-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {mostrarErrorRechazo && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-red-100 p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-semibold mb-4">Error</h2>
              <p className="mb-4">Para rechazar al paciente debes rellenar el campo "Motivo de Rechazo".</p>
              <button
                onClick={cerrarErrorRechazo}
                className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-300"
              >
                Aceptar
              </button>
            </div>
          </div>
        )}

        {mostrarExito && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-green-100 p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-semibold mb-4">Éxito</h2>
              <p>Los datos han sido actualizados con éxito.</p>
            </div>
          </div>
        )}

        {cargando ? (
          <p className="text-gray-700 text-xl">Cargando datos del paciente...</p>
        ) : paciente ? (
          <form onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold mb-6 text-green-600">Editar Datos del Paciente</h1>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Información Personal</h2>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <p>
                    <strong>ID:</strong> {paciente.id_planilla}
                  </p>
                  <p>
                    <strong>Nombre:</strong> {paciente.nombre_paciente}
                  </p>
                  <p>
                    <strong>RUT:</strong> {paciente.rut}
                  </p>
                  <p>
                    <strong>Apellido:</strong> {paciente.apellido_paciente}
                  </p>
                  <p>
                    <strong>Convenios:</strong> {paciente.convenios}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
                <div className="flex items-center space-x-4">
                  <FaFileAlt className="text-green-600 text-2xl" />
                  <h2 className="text-2xl font-semibold text-gray-800">Estado del Paciente</h2>
                </div>
                <p>
                  <strong>Estado del Paciente:</strong>
                  <span
                    className={`ml-2 inline-block px-3 py-1 rounded-full text-sm text-white ${
                      editData.estado_paciente === 'A'
                        ? 'bg-green-600'
                        : editData.estado_paciente === 'E'
                        ? 'bg-gray-500'
                        : editData.estado_paciente === 'P'
                        ? 'bg-yellow-500'
                        : editData.estado_paciente === 'O'
                        ? 'bg-blue-600'
                        : editData.estado_paciente === 'R'
                        ? 'bg-red-500'
                        : 'bg-gray-400'
                    }`}
                  >
                    {editData.estado_paciente === 'A'
                      ? 'Alta'
                      : editData.estado_paciente === 'E'
                      ? 'En Proceso'
                      : editData.estado_paciente === 'P'
                      ? 'Pendiente'
                      : editData.estado_paciente === 'O'
                      ? 'Operado'
                      : editData.estado_paciente === 'R'
                      ? 'Rechazado'
                      : 'Desconocido'}
                  </span>
                </p>

                <button
                  type="button"
                  onClick={confirmarAvanzarEstado}
                  disabled={editData.estado_paciente === 'A' || editData.estado_paciente === 'R'}
                  className={`${
                    editData.estado_paciente === 'A' || editData.estado_paciente === 'R'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white px-4 py-2 mt-4 rounded-md shadow-md transition duration-300`}
                >
                  Avanzar Estado
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
                <div className="flex items-center space-x-4">
                  <FaNotesMedical className="text-green-600 text-2xl" />
                  <h2 className="text-2xl font-semibold text-gray-800">Detalles Médicos</h2>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label>
                      <strong>Doctor:</strong>
                    </label>
                    <input
                      type="text"
                      name="doctor"
                      value={editData.doctor}
                      onChange={handleInputChange}
                      disabled={disabledFields.doctor}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                  <div>
                    <label>
                      <strong>Fecha de Cirugía:</strong>
                    </label>
                    <input
                      type="date"
                      name="fecha_cirugia"
                      value={editData.fecha_cirugia}
                      onChange={handleInputChange}
                      disabled={disabledFields.fecha_cirugia}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                  <div>
                    <label>
                      <strong>Fecha de Evaluación:</strong>
                    </label>
                    <input
                      type="date"
                      name="fecha_evaluacion"
                      value={editData.fecha_evaluacion}
                      onChange={handleInputChange}
                      disabled={disabledFields.fecha_evaluacion}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                  <div>
                    <label>
                      <strong>Control Post-Operatorio:</strong>
                    </label>
                    <input
                      type="date"
                      name="control_post_operatorio"
                      value={editData.control_post_operatorio}
                      onChange={handleInputChange}
                      disabled={disabledFields.control_post_operatorio}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                  <div>
                    <label>
                      <strong>Control de Mes:</strong>
                    </label>
                    <input
                      type="date"
                      name="control_mes"
                      value={editData.control_mes}
                      onChange={handleInputChange}
                      disabled={disabledFields.control_mes}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
                <div className="flex items-center space-x-4">
                  <FaCalendarAlt className="text-green-600 text-2xl" />
                  <h2 className="text-2xl font-semibold text-gray-800">Historial de Llamados</h2>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label>
                      <strong>Segundo Llamado:</strong>
                    </label>
                    <input
                      type="date"
                      name="reg_segundo_llamado"
                      value={editData.reg_segundo_llamado}
                      onChange={handleInputChange}
                      disabled={disabledFields.reg_segundo_llamado}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                  <div>
                    <label>
                      <strong>Tercer Llamado:</strong>
                    </label>
                    <input
                      type="date"
                      name="reg_tercer_llamado"
                      value={editData.reg_tercer_llamado}
                      onChange={handleInputChange}
                      disabled={disabledFields.reg_tercer_llamado}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
                <label>
                  <strong>Observación:</strong>
                </label>
                <input
                  type="text"
                  name="observacion"
                  value={editData.observacion}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded mt-2"
                />
              </div>

              <div className="flex justify-center space-x-4 mt-8">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-300"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={botonDeshabilitado}
                  className={`${
                    botonDeshabilitado ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                  } text-white px-4 py-2 rounded-md shadow-md transition duration-300`}
                >
                  Guardar Cambios
                </button>

                <button
                  type="button"
                  onClick={handleRechazarPaciente}
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-300"
                >
                  Rechazar Paciente
                </button>
              </div>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default EditarPaciente;
