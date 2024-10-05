import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserMd, FaCalendarAlt, FaNotesMedical, FaFileAlt } from 'react-icons/fa';
import Sidebar from '../components/SidebarAdmin.jsx'; // Usamos SidebarAdmin
import { baseUrl } from '../api/asodi.api.js';

const EditarPacienteAdmin = () => {
  const { id } = useParams(); // Capturamos el id_planilla desde la URL
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null); // Almacenamos los datos del paciente
  const [mensaje, setMensaje] = useState(null); // Mensaje de error o éxito
  const [cargando, setCargando] = useState(true); // Estado de carga
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(false); // Estado para deshabilitar el botón de guardar
  const [mostrarExito, setMostrarExito] = useState(false); // Estado para mostrar el pop-up de éxito
  const [mostrarMotivoRechazo, setMostrarMotivoRechazo] = useState(false); // Estado para mostrar el campo de motivo de rechazo
  const [mostrarError, setMostrarError] = useState(false); // Estado para mostrar el pop-up de error al guardar sin motivo

  // Estado para almacenar todos los datos del paciente
  const [planilla, setPlanilla] = useState({
    nombre_paciente: '',
    apellido_paciente: '',
    rut: '',
    convenios: 'Fonasa',  // Selector inicial de convenio
    estado_paciente: 'P',  // Selector inicial del estado del paciente
    doctor: '',
    fecha_cirugia: '',
    fecha_evaluacion: '',
    control_post_operatorio: '',
    control_mes: '',
    reg_primer_llamado: '',   // Campo de Primer Llamado agregado
    reg_segundo_llamado: '',
    reg_tercer_llamado: '',
    observacion: '',
    motivo_rechazo: '', // Agregamos el campo de motivo de rechazo
  });

  // Manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Mostrar el campo "motivo_rechazo" solo cuando el estado es "Rechazado"
    if (name === 'estado_paciente') {
      if (value === 'R') {
        setMostrarMotivoRechazo(true);
      } else {
        setMostrarMotivoRechazo(false);
        setPlanilla((prevState) => ({ ...prevState, motivo_rechazo: '' })); // Eliminar motivo si el estado no es Rechazado
      }
    }

    // Formatear el RUT si el campo es 'rut'
    if (name === 'rut') {
      const formattedRut = formatRut(value);  // Aplicamos la función de formateo del RUT
      setPlanilla({ ...planilla, [name]: formattedRut });
    } else {
      setPlanilla({ ...planilla, [name]: value });
    }
  };

  // Función para formatear el RUT
  const formatRut = (rut) => {
    const cleanRut = rut.replace(/[^\dkK]/g, '').toUpperCase();  // Remover caracteres no permitidos y convertir la 'k' a mayúscula
    if (cleanRut.length <= 1) return cleanRut;
    
    // Dividimos entre dígito verificador y cuerpo del RUT
    const cuerpo = cleanRut.slice(0, -1);
    const verificador = cleanRut.slice(-1);
    
    // Formatear con puntos y guión
    const formattedCuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return `${formattedCuerpo}-${verificador}`;
  };

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

          // Si el estado del paciente es "Rechazado", mostramos el campo de motivo de rechazo
          if (pacienteEncontrado.estado_paciente === 'R') {
            setMostrarMotivoRechazo(true);
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

  // Guardar los datos actualizados del paciente
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación adicional: si el estado es "Rechazado", debe haber un motivo
    if (planilla.estado_paciente === 'R' && !planilla.motivo_rechazo) {
      setMostrarError(true);  // Mostrar el pop-up de error
      return;
    }

    // Si el estado no es "Rechazado", limpiar el motivo de rechazo
    if (planilla.estado_paciente !== 'R') {
      planilla.motivo_rechazo = ''; // Enviar vacío o null a la API
    }

    try {
      const response = await axios.put(`${baseUrl}/asodi/v1/planillas-convenio/${id}/`, planilla);
      if (response.status === 200) {
        setMostrarExito(true); // Mostrar el pop-up de éxito
        setBotonDeshabilitado(true);

        // Ocultar el pop-up de éxito después de 1.5 segundos
        setTimeout(() => {
          setMostrarExito(false);
          navigate(`/admin/paciente/${id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error en la solicitud de actualización:', error.response?.data || error.message);
      setMensaje(`Hubo un error al actualizar los datos: ${error.response?.data || error.message}`);
    }
  };

  // Función para manejar la cancelación y redirigir al Detalle del Paciente
  const handleCancel = () => {
    navigate(`/admin/paciente/${id}`);  // Redirige a la página de detalles
  };

  // Cerrar el pop-up de error
  const cerrarError = () => {
    setMostrarError(false);
  };

  return (
    <div className="flex">
      <Sidebar /> {/* Usamos SidebarAdmin */}
      <div className="flex-grow max-w-5xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">

        {/* Pop-up de éxito al guardar cambios */}
        {mostrarExito && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-green-100 p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-semibold mb-4">Éxito</h2>
              <p>Los datos han sido actualizados con éxito.</p>
            </div>
          </div>
        )}

        {/* Pop-up de error al intentar guardar sin motivo de rechazo */}
        {mostrarError && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-red-100 p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-semibold mb-4">Error</h2>
              <p>Debes escribir el motivo del rechazo para actualizar los datos.</p>
              <button
                onClick={cerrarError}
                className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {cargando ? (
          <p className="text-gray-700 text-xl">Cargando datos del paciente...</p>
        ) : paciente ? (
          <form onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold mb-6 text-green-600">Editar Datos del Paciente (Admin)</h1>

            <div className="space-y-6">
              {/* Información Personal */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Información Personal</h2>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <p><strong>ID:</strong> {paciente.id_planilla}</p>
                  <p><strong>RUT:</strong>
                    <input
                      type="text"
                      name="rut"
                      value={planilla.rut}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded mt-2"
                      maxLength={12}  // Limitar la longitud máxima a 12 caracteres
                    />
                  </p>
                  <p><strong>Nombre:</strong>
                    <input
                      type="text"
                      name="nombre_paciente"
                      value={planilla.nombre_paciente}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </p>
                  <p><strong>Apellido:</strong>
                    <input
                      type="text"
                      name="apellido_paciente"
                      value={planilla.apellido_paciente}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </p>
                  <p><strong>Convenios:</strong>
                    <select
                      name="convenios"
                      value={planilla.convenios}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded mt-2"
                    >
                      <option value="Fonasa">Fonasa</option>
                      <option value="Barros Luco">Barros Luco</option>
                    </select>
                  </p>
                </div>
              </div>

              {/* Estado del Paciente */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
                <div className="flex items-center space-x-4">
                  <FaFileAlt className="text-green-600 text-2xl" />
                  <h2 className="text-2xl font-semibold text-gray-800">Estado del Paciente</h2>
                </div>
                <select
                  name="estado_paciente"
                  value={planilla.estado_paciente}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded mt-2"
                >
                  <option value="P">Pendiente</option>
                  <option value="E">En Proceso</option>
                  <option value="O">Operado</option>
                  <option value="A">Alta</option>
                  <option value="R">Rechazado</option>
                </select>

                {/* Mostrar campo "motivo_rechazo" solo si el estado es "Rechazado" */}
                {mostrarMotivoRechazo && (
                  <div className="mt-4">
                    <label><strong>Motivo de Rechazo:</strong></label>
                    <input
                      type="text"
                      name="motivo_rechazo"
                      value={planilla.motivo_rechazo}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                )}
              </div>

              {/* Detalles Médicos */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
                <div className="flex items-center space-x-4">
                  <FaNotesMedical className="text-green-600 text-2xl" />
                  <h2 className="text-2xl font-semibold text-gray-800">Detalles Médicos</h2>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label><strong>Doctor:</strong></label>
                    <input
                      type="text"
                      name="doctor"
                      value={planilla.doctor}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                  <div>
                    <label><strong>Fecha de Cirugía:</strong></label>
                    <input
                      type="date"
                      name="fecha_cirugia"
                      value={planilla.fecha_cirugia}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                  <div>
                    <label><strong>Fecha de Evaluación:</strong></label>
                    <input
                      type="date"
                      name="fecha_evaluacion"
                      value={planilla.fecha_evaluacion}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                  <div>
                    <label><strong>Control Post-Operatorio:</strong></label>
                    <input
                      type="date"
                      name="control_post_operatorio"
                      value={planilla.control_post_operatorio}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                  <div>
                    <label><strong>Control de Mes:</strong></label>
                    <input
                      type="date"
                      name="control_mes"
                      value={planilla.control_mes}
                      onChange={handleInputChange}
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
                    <label><strong>Primer Llamado:</strong></label>  {/* Campo de Primer Llamado agregado */}
                    <input
                      type="date"
                      name="reg_primer_llamado"
                      value={planilla.reg_primer_llamado}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                  <div>
                    <label><strong>Segundo Llamado:</strong></label>
                    <input
                      type="date"
                      name="reg_segundo_llamado"
                      value={planilla.reg_segundo_llamado}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                  <div>
                    <label><strong>Tercer Llamado:</strong></label>
                    <input
                      type="date"
                      name="reg_tercer_llamado"
                      value={planilla.reg_tercer_llamado}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Observación */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
                <label><strong>Observación:</strong></label>
                <input
                  type="text"
                  name="observacion"
                  value={planilla.observacion}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded mt-2"
                />
              </div>

              {/* Botones de guardar y cancelar */}
              <div className="flex justify-center space-x-4 mt-8">
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
                  onClick={handleCancel}
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default EditarPacienteAdmin;
