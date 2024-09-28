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
            'fecha_recepcion',
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
                fecha_recepcion: formatDate(pacienteData.fecha_recepcion),
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
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar fijo */}
            <div className="w-64 bg-teal-700 text-white fixed h-screen">
                <Sidebar />
            </div>
            
            {/* Contenido desplazable */}
            <div className="flex-grow p-10 bg-gray-100 ml-64 overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4 text-center">Agregar Paciente</h1>

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

                    {/* Resto del formulario */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_recepcion">
                            Fecha recepción:<span className="text-red-500">*</span>
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

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="control_post_operatorio">
                            Control postoperatorio:
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

                    {/* Botón Agregar Paciente */}
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
