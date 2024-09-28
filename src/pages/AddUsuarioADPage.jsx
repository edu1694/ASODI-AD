import React, { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../api/asodi.api.js';
import SidebarAdmin from '../components/SidebarAdmin';

function AddUsuarioADPage() {
    const [usuarioData, setUsuarioData] = useState({
        rut_ad: '',
        nombre: '',
        apellido: '',
        correo: '',
        password: '',
        estado_ad: true, // Valor siempre será true
    });

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Formatear el RUT
    const formatRUT = (value) => {
        const cleanValue = value.replace(/[^0-9kK]/g, ''); // Eliminar caracteres no numéricos o K/k

        if (cleanValue.length > 1) {
            const rut = cleanValue.slice(0, -1); // Todo menos el dígito verificador
            const dv = cleanValue.slice(-1); // Último carácter es el dígito verificador
            const formattedRUT = rut.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv.toUpperCase();
            return formattedRUT;
        }
        return cleanValue;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'rut_ad') {
            const formattedRUT = formatRUT(value);
            setUsuarioData((prevData) => ({
                ...prevData,
                [name]: formattedRUT,
            }));
        } else {
            setUsuarioData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const requiredFields = ['rut_ad', 'nombre', 'apellido', 'correo', 'password'];

        const isValid = requiredFields.every((field) => usuarioData[field]);
        if (!isValid) {
            setMessage('Por favor, complete todos los campos obligatorios.');
            setMessageType('error');
            setIsLoading(false);
            setTimeout(() => {
                setMessage('');
            }, 3000);
            return;
        }

        try {
            const response = await axios.post(
                `${baseUrl}/asodi/v1/usuarios-asodi-ad/`,
                { ...usuarioData, estado_ad: true }, // Se asegura que estado_ad siempre sea true
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 201) {
                setMessage('Usuario AD agregado exitosamente');
                setMessageType('success');
                setUsuarioData({
                    rut_ad: '',
                    nombre: '',
                    apellido: '',
                    correo: '',
                    password: '',
                    estado_ad: true,
                });

                setTimeout(() => {
                    setMessage('');
                }, 3000);
            }
        } catch (error) {
            setMessage('Error al agregar el usuario AD');
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
            {/* SidebarAdmin fijo */}
            <div className="w-64 bg-teal-700 text-white fixed h-screen">
                <SidebarAdmin />
            </div>
            
            {/* Contenido desplazable */}
            <div className="flex-grow p-10 bg-gray-100 ml-64 overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4 text-center">Agregar Usuario AD</h1>

                {message && (
                    <div className={`text-white font-bold py-2 px-4 rounded mb-4 ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rut_ad">
                            RUT:<span className="text-red-500">*</span>
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            id="rut_ad"
                            name="rut_ad"
                            type="text"
                            value={usuarioData.rut_ad}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                            Nombre:<span className="text-red-500">*</span>
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            id="nombre"
                            name="nombre"
                            type="text"
                            value={usuarioData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                            Apellido:<span className="text-red-500">*</span>
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            id="apellido"
                            name="apellido"
                            type="text"
                            value={usuarioData.apellido}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="correo">
                            Correo:<span className="text-red-500">*</span>
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            id="correo"
                            name="correo"
                            type="email"
                            value={usuarioData.correo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Contraseña:<span className="text-red-500">*</span>
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            id="password"
                            name="password"
                            type="password"
                            value={usuarioData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-span-2 flex justify-center">
                        <button
                            type="submit"
                            className={`w-full bg-green-500 text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Cargando...' : 'Agregar Usuario AD'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddUsuarioADPage;
