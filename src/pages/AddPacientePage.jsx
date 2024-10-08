import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../api/asodi.api.js';
import Sidebar from '../components/Sidebar';

function AddPacientePage() {
    const [pacienteData, setPacienteData] = useState({
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

    const [convenios, setConvenios] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchConvenios = async () => {
            try {
                const response = await axios.get(`${baseUrl}/asodi/v1/convenios/`);
                setConvenios(response.data);
            } catch (error) {
                console.error('Error al cargar los convenios', error);
            }
        };
        fetchConvenios();
    }, []);

    useEffect(() => {
        const usuarioAsodi = localStorage.getItem('usuario_asodi_ad');
        
        if (usuarioAsodi && usuarioAsodi !== 'undefined') {
            setPacienteData((prevData) => ({
                ...prevData,
                usuario_asodi_ad: usuarioAsodi,
            }));
        } else {
            setMessage('Error: No se encontró un usuario válido. Por favor, vuelve a iniciar sesión.');
            setMessageType('error');
        }
    }, []);
  
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'rut') {
            const formattedRUT = formatRUT(value);
            setPacienteData((prevData) => ({
                ...prevData,
                [name]: formattedRUT,
            }));
        } else {
            setPacienteData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const formatRUT = (value) => {
        const cleanValue = value.replace(/[^0-9kK]/g, '');

        if (cleanValue.length > 1) {
            const rut = cleanValue.slice(0, -1);
            const dv = cleanValue.slice(-1);
            const formattedRUT = rut.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + '-' + dv.toUpperCase();
            return formattedRUT;
        }
        return cleanValue;
    };

    const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const requiredFields = [
            'convenios',
            'rut',
            'nombre_paciente',
            'apellido_paciente',
        ];

        const isValid = requiredFields.every((field) => pacienteData[field]);
        if (!isValid) {
            setMessage('Por favor, complete todos los campos obligatorios.');
            setMessageType('error');
            setIsLoading(false);
            setTimeout(() => {
                setMessage('');
            }, 3000);
            return;
        }

        if (!pacienteData.usuario_asodi_ad || pacienteData.usuario_asodi_ad === 'undefined') {
            setMessage('Error: No se encontró un usuario válido.');
            setMessageType('error');
            setIsLoading(false);
            return;
        }

        try {
            const formattedData = {
                ...pacienteData,
                fecha_sic: formatDate(pacienteData.fecha_sic),
                reg_primer_llamado: formatDate(pacienteData.reg_primer_llamado),
                reg_segundo_llamado: formatDate(pacienteData.reg_segundo_llamado),
                reg_tercer_llamado: formatDate(pacienteData.reg_tercer_llamado),
                fecha_evaluacion: formatDate(pacienteData.fecha_evaluacion),
                fecha_cirugia: formatDate(pacienteData.fecha_cirugia),
                control_post_operatorio: formatDate(pacienteData.control_post_operatorio),
                control_mes: formatDate(pacienteData.control_mes),
            };

            const response = await axios.post(
                `${baseUrl}/asodi/v1/planillas-convenio/`,
                formattedData,
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
        <div className="flex flex-col lg:flex-row min-h-screen overflow-hidden">
            {/* Sidebar fijo */}
            <Sidebar />
            
            {/* Contenido desplazable */}
            <div className="flex-grow p-6 md:p-10 bg-gray-100">
                <h1 className="text-4xl font-bold mb-6 text-center">Agregar Paciente</h1>

                {message && (
                    <div className={`text-white font-bold py-2 px-4 rounded mb-4 ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Convenios */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="convenios">
                            Convenios:<span className="text-red-500">*</span>
                        </label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            id="convenios"
                            name="convenios"
                            value={pacienteData.convenios}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un convenio</option>
                            {convenios.map((convenio, index) => (
                                <option key={index} value={convenio.nombre_convenio}>
                                    {convenio.nombre_convenio}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* RUT */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rut">
                            RUT:<span className="text-red-500">*</span>
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
                            Nombre paciente:<span className="text-red-500">*</span>
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
                            Apellido paciente:<span className="text-red-500">*</span>
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

                    {/* Otros campos adicionales */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_sic">
                            Fecha SIC:
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

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reg_primer_llamado">
                            Registro Primer Llamado:
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

                    {/* Observaciones */}
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

                    {/* Otros campos (doctor, fechas) */}
                    {/* Continuar aquí agregando el resto de los campos como fechas de cirugía, control post-operatorio, etc. */}

                    <div className="col-span-2 flex justify-center">
                        <button
                            type="submit"
                            className={`w-full bg-green-500 text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
