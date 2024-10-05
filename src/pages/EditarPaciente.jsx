import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserMd, FaCalendarAlt, FaNotesMedical, FaFileAlt } from 'react-icons/fa';
import Sidebar from '../components/Sidebar.jsx';
import { baseUrl } from '../api/asodi.api.js';

const EditarPaciente = () => {
  const { id } = useParams(); // Capturamos el id_planilla desde la URL
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null); // Almacenamos los datos del paciente
  const [mensaje, setMensaje] = useState(null); // Mensaje de error o éxito
  const [cargando, setCargando] = useState(true); // Estado de carga
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(false); // Estado para deshabilitar el botón de guardar
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false); // Estado para mostrar el pop-up de confirmación
  const [mostrarExito, setMostrarExito] = useState(false); // Estado para mostrar el pop-up de éxito
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(true); // Estado para mostrar el pop-up de advertencia
  const [mostrarRechazarModal, setMostrarRechazarModal] = useState(false); // Estado para mostrar el modal de rechazo
  const [motivoRechazo, setMotivoRechazo] = useState(''); // Estado para almacenar el motivo de rechazo
  const [mostrarErrorRechazo, setMostrarErrorRechazo] = useState(false); // Estado para mostrar el error de motivo rechazo
  const [disabledFields, setDisabledFields] = useState({}); // Para deshabilitar los campos que ya fueron editados

  // Estado para almacenar todos los datos del paciente
  const [planilla, setPlanilla] = useState({
    nombre_paciente: '',
    apellido_paciente: '',
    rut: '',
    convenios: '',
    estado_paciente: '', // Incluimos el estado del paciente
    doctor: '',
    fecha_cirugia: '',
    fecha_evaluacion: '',
    control_post_operatorio: '',
    control_mes: '',
    reg_segundo_llamado: '',
    reg_tercer_llamado: '',
    observacion: '',
    motivo_rechazo: '',
  });

  // Estado para los datos editables del formulario
  const [editData, setEditData] = useState({
    doctor: '',
    fecha_cirugia: '',
    fecha_evaluacion: '',
    control_post_operatorio: '',
    control_mes: '',
    reg_segundo_llamado: '',
    reg_tercer_llamado: '',
    observacion: '',
    estado_paciente: '', // Campo de estado del paciente
  });

  // Obtener los datos del paciente por id_planilla
  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        setCargando(true);
        const response = await axios.get(`${baseUrl}/asodi/v1/planillas-convenio/${id}/`);
        if (response.data) {
          const pacienteEncontrado = response.data;
          setPaciente(pacienteEncontrado);
          setPlanilla(pacienteEncontrado); // Almacenamos todos los datos en el estado `planilla`

          // Inicializamos editData con los datos actuales
          setEditData({
            doctor: pacienteEncontrado.doctor || '',
            fecha_cirugia: pacienteEncontrado.fecha_cirugia || '',
            fecha_evaluacion: pacienteEncontrado.fecha_evaluacion || '',
            control_post_operatorio: pacienteEncontrado.control_post_operatorio || '',
            control_mes: pacienteEncontrado.control_mes || '',
            reg_segundo_llamado: pacienteEncontrado.reg_segundo_llamado || '',
            reg_tercer_llamado: pacienteEncontrado.reg_tercer_llamado || '',
            observacion: pacienteEncontrado.observacion || '',
            estado_paciente: pacienteEncontrado.estado_paciente || '', // Inicializamos con el estado actual
          });

          // Deshabilitamos los campos que ya tienen datos, excepto observación
          const initialDisabledFields = {};
          Object.keys(editData).forEach((field) => {
            if (pacienteEncontrado[field] && field !== 'observacion') { // Observación siempre habilitada
              initialDisabledFields[field] = true; // Deshabilitamos campos con datos
            }
          });
          setDisabledFields(initialDisabledFields);
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

  // Manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  // Validar el formato de fecha
  const validateDate = (date) => {
    if (!date) return null;
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Asegurar que el formato sea YYYY-MM-DD
    return regex.test(date) ? date : null;
  };

  // Función para avanzar el estado del paciente
  const avanzarEstado = async () => {
    const estadosPermitidos = ['P', 'E', 'O', 'A']; // Estados permitidos: Pendiente, En Proceso, Operado, Alta
    const estadoActualIndex = estadosPermitidos.indexOf(editData.estado_paciente);

    if (estadoActualIndex < estadosPermitidos.length - 1) {
      // Avanzamos al siguiente estado permitido
      const nuevoEstado = estadosPermitidos[estadoActualIndex + 1];
      setEditData((prevState) => ({ ...prevState, estado_paciente: nuevoEstado }));

      // Actualizamos el estado del paciente en el servidor
      try {
        const updatedPlanilla = { ...planilla, estado_paciente: nuevoEstado };
        await axios.put(`${baseUrl}/asodi/v1/planillas-convenio/${id}/`, updatedPlanilla);
        setMensaje('Estado del paciente actualizado correctamente.');
      } catch (error) {
        console.error('Error al actualizar el estado del paciente:', error);
        setMensaje('Hubo un error al actualizar el estado del paciente.');
      }
    }
  };

  // Guardar los datos actualizados del paciente
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validamos y formateamos los campos de fecha antes de enviar
    const validData = {
      ...editData,
      fecha_cirugia: validateDate(editData.fecha_cirugia),
      fecha_evaluacion: validateDate(editData.fecha_evaluacion),
      control_post_operatorio: validateDate(editData.control_post_operatorio),
      control_mes: validateDate(editData.control_mes),
      reg_segundo_llamado: validateDate(editData.reg_segundo_llamado),
      reg_tercer_llamado: validateDate(editData.reg_tercer_llamado),
      motivo_rechazo: motivoRechazo, // Incluimos el motivo de rechazo en caso de que esté presente
    };

    // Mezclamos los datos editados con los demás campos de la planilla
    const updatedPlanilla = {
      ...planilla, // Incluimos todos los campos actuales de la planilla
      ...validData, // Sobrescribimos solo los campos editados
    };

    try {
      const response = await axios.put(`${baseUrl}/asodi/v1/planillas-convenio/${id}/`, updatedPlanilla);
      if (response.status === 200) {
        setMostrarExito(true); // Mostrar el pop-up de éxito
        setBotonDeshabilitado(true);

        // Deshabilitamos los campos que se actualizaron, excepto observación
        const updatedDisabledFields = { ...disabledFields };
        Object.keys(editData).forEach((field) => {
          if (editData[field] && field !== 'observacion') {
            updatedDisabledFields[field] = true;
          }
        });
        setDisabledFields(updatedDisabledFields);

        // Ocultar el pop-up de éxito después de 1.5 segundos
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

  // Mostrar el pop-up de confirmación para avanzar estado
  const confirmarAvanzarEstado = () => {
    setMostrarConfirmacion(true);
  };

  // Confirmar avanzar estado desde el pop-up
  const confirmarAvance = () => {
    avanzarEstado(); // Llamar a la función para avanzar el estado
    setMostrarConfirmacion(false); // Cerrar el pop-up de confirmación
  };

  // Cancelar avance de estado
  const cancelarAvance = () => {
    setMostrarConfirmacion(false);
  };

  // Cerrar el pop-up de advertencia
  const cerrarAdvertencia = () => {
    setMostrarAdvertencia(false);
  };

  // Abrir el modal de rechazo
  const handleRechazarPaciente = () => {
    setMostrarRechazarModal(true);
  };

  // Cerrar el modal de rechazo
  const cerrarRechazarModal = () => {
    setMostrarRechazarModal(false);
  };

  // Confirmar el rechazo del paciente
  const confirmarRechazo = () => {
    if (!motivoRechazo.trim()) {
      setMostrarErrorRechazo(true); // Mostrar error si el motivo rechazo está vacío
    } else {
      // Aquí puedes agregar lógica adicional si es necesario
      setEditData({ ...editData, estado_paciente: 'R' });
      handleSubmit(); // Guardamos los cambios con el estado de "Rechazado"
      cerrarRechazarModal();
    }
  };

  // Cerrar el pop-up de error de rechazo
  const cerrarErrorRechazo = () => {
    setMostrarErrorRechazo(false);
  };

  // Función para manejar la cancelación y redirigir al Detalle del Paciente
  const handleCancel = () => {
    navigate(`/paciente/${id}`);  // Redirige a la página de detalles
  };

  return (
    <div className="flex">
      <Sidebar /> {/* Mantenemos el Sidebar si lo necesitas */}
      <div className="flex-grow max-w-5xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">

        {/* Pop-up de advertencia al entrar a la página */}
        {mostrarAdvertencia && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-yellow-100 p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-semibold mb-4">Advertencia</h2>
              <p className="mb-4">Recuerda que la actualización de datos de los pacientes solo se permite una única vez. Una vez rellenados, los campos serán deshabilitados.</p>
              <button
                onClick={cerrarAdvertencia}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-yellow-600 transition duration-300"
              >
                Aceptar
              </button>
            </div>
          </div>
        )}

        {/* Pop-up de confirmación para avanzar estado */}
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

        {/* Modal para Rechazar Paciente */}
        {mostrarRechazarModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-semibold mb-4">Rechazar Paciente</h2>
              <p className="mb-4">El estado del paciente será cambiado a "Rechazado". Por favor, ingresa el motivo del rechazo:</p>
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

        {/* Pop-up de error por motivo de rechazo vacío */}
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

        {/* Pop-up de éxito al guardar cambios */}
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
              {/* Información Personal */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Información Personal</h2>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <p><strong>ID:</strong> {paciente.id_planilla}</p>
                  <p><strong>Nombre:</strong> {paciente.nombre_paciente}</p>
                  <p><strong>RUT:</strong> {paciente.rut}</p>
                  <p><strong>Apellido:</strong> {paciente.apellido_paciente}</p>
                  <p><strong>Convenios:</strong> {paciente.convenios}</p>
                </div>
              </div>

              {/* Estado del Paciente */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
                <div className="flex items-center space-x-4">
                  <FaFileAlt className="text-green-600 text-2xl" />
                  <h2 className="text-2xl font-semibold text-gray-800">Estado del Paciente</h2>
                </div>
                <p>
                  <strong>Estado del Paciente:</strong> 
                  <span className={`ml-2 inline-block px-3 py-1 rounded-full text-sm text-white ${
                    editData.estado_paciente === 'A' ? 'bg-green-600' :
                    editData.estado_paciente === 'E' ? 'bg-gray-500' :
                    editData.estado_paciente === 'P' ? 'bg-yellow-500' :  
                    editData.estado_paciente === 'O' ? 'bg-blue-600' :
                    editData.estado_paciente === 'R' ? 'bg-red-500' : 'bg-gray-400'
                  }`}>
                    {editData.estado_paciente === 'A' ? 'Alta' : 
                    editData.estado_paciente === 'E' ? 'En Proceso' :
                    editData.estado_paciente === 'P' ? 'Pendiente' :  
                    editData.estado_paciente === 'O' ? 'Operado' : 
                    editData.estado_paciente === 'R' ? 'Rechazado' : 'Desconocido'}
                  </span>
                </p>

                <button
                  type="button"
                  onClick={confirmarAvanzarEstado} // Muestra el pop-up de confirmación
                  disabled={editData.estado_paciente === 'A'} // Deshabilitar si el estado es "Alta"
                  className={`${
                    editData.estado_paciente === 'A' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white px-4 py-2 mt-4 rounded-md shadow-md transition duration-300`}
                >
                  Avanzar Estado
                </button>
              </div>

              {/* Detalles Médicos */}
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
                      disabled={disabledFields.doctor} // Deshabilitar si ya se ha editado
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
                      disabled={disabledFields.fecha_cirugia} // Deshabilitar si ya se ha editado
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
                      disabled={disabledFields.fecha_evaluacion} // Deshabilitar si ya se ha editado
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
                      disabled={disabledFields.control_post_operatorio} // Deshabilitar si ya se ha editado
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
                      disabled={disabledFields.control_mes} // Deshabilitar si ya se ha editado
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Historial de Llamados */}
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
                      disabled={disabledFields.reg_segundo_llamado} // Deshabilitar si ya se ha editado
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
                      disabled={disabledFields.reg_tercer_llamado} // Deshabilitar si ya se ha editado
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Observación (siempre habilitada) */}
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

              {/* Botones Cancelar, Guardar Cambios, Rechazar Paciente */}
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
