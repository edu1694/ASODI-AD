import React, { useState } from 'react';
import axios from 'axios';
import SidebarAdmin from '../components/SidebarAdmin';
import { baseUrl } from '../api/asodi.api.js';

function AddUsuarioADPage() {
    const [usuarioData, setUsuarioData] = useState({
        rut_ad: '',
        nombre: '',
        apellido: '',
        correo: '',
        password: '',
        estado_ad: true, // Campo por defecto en true
    });
    const [mensaje, setMensaje] = useState('');
    const [mensajeTipo, setMensajeTipo] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuarioData({
            ...usuarioData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);

        try {
            const response = await axios.post(`${baseUrl}/asodi/v1/usuarios-asodi-ad/`, usuarioData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                setMensaje('Usuario creado exitosamente.');
                setMensajeTipo('success');
                setUsuarioData({
                    rut_ad: '',
                    nombre: '',
                    apellido: '',
                    correo: '',
                    password: '',
                    estado_ad: true, // Mantener estado_ad en true por defecto
                });
            }
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            setMensaje('Error al crear el usuario.');
            setMensajeTipo('error');
        } finally {
            setCargando(false);
            setTimeout(() => {
                setMensaje('');
            }, 3000);
        }
    };

    return (
        <div className="flex">
            <SidebarAdmin />

            <div className="flex-grow max-w-4xl mx-auto mt-10 p-6 bg-gray-100 shadow-md rounded-lg">
                <h1 className="text-3xl font-bold mb-6 text-green-600 text-center">Agregar Usuario AD</h1>

                {mensaje && (
                    <div className={`mb-4 p-4 ${mensajeTipo === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'} rounded`}>
                        {mensaje}
                    </div>
                )}

                <div className="bg-white shadow-md rounded-lg p-6">
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

                        <div className="col-span-2">
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-105"
                                disabled={cargando}
                            >
                                {cargando ? 'Creando Usuario...' : 'Agregar Usuario AD'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddUsuarioADPage;
