import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../api/asodi.api.js';
import SidebarAdmin from '../components/SidebarAdmin';
import Notification from '../components/Notification'; // Importamos el componente Notification

const AddAnuncioPage = () => {
    const [anuncioData, setAnuncioData] = useState({
        usuario_asodi_admin: '',
        titulo: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_termino: '',
        estado_an: true,
        imagen: null, // Añadido para la imagen
    });

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // Obtener el correo del administrador desde localStorage
    useEffect(() => {
        const adminCorreo = localStorage.getItem('usuario_asodi_admin');
        if (adminCorreo) {
            setAnuncioData((prevData) => ({
                ...prevData,
                usuario_asodi_admin: adminCorreo,
            }));
        }
    }, []);

    const handleChange = (e) => {
        if (e.target.name === 'imagen') {
            setAnuncioData({
                ...anuncioData,
                [e.target.name]: e.target.files[0], // Para archivos
            });
        } else {
            setAnuncioData({
                ...anuncioData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('usuario_asodi_admin', anuncioData.usuario_asodi_admin);
        formData.append('titulo', anuncioData.titulo);
        formData.append('descripcion', anuncioData.descripcion);
        formData.append('fecha_inicio', anuncioData.fecha_inicio);
        formData.append('fecha_termino', anuncioData.fecha_termino);
        formData.append('estado_an', anuncioData.estado_an);

        // Solo agregar la imagen si fue seleccionada
        if (anuncioData.imagen) {
            formData.append('imagen', anuncioData.imagen);
        }

        try {
            await axios.post(`${baseUrl}/asodi/v1/anuncios/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Anuncio creado exitosamente.');
            setMessageType('success');

            // Reseteo del formulario
            setAnuncioData({
                usuario_asodi_admin: anuncioData.usuario_asodi_admin, // Mantener el admin
                titulo: '',
                descripcion: '',
                fecha_inicio: '',
                fecha_termino: '',
                estado_an: true,
                imagen: null, // Resetear la imagen
            });
        } catch (error) {
            console.error('Error al crear anuncio:', error);
            setMessage('Error al crear anuncio.');
            setMessageType('error');
        } finally {
            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* SidebarAdmin fijo */}
            <div className="w-64 bg-teal-700 text-white fixed h-screen">
                <SidebarAdmin />
            </div>

            {/* Contenido principal */}
            <div className="flex-grow p-10 bg-gray-100 ml-64 overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4 text-center text-teal-700">Crear Anuncio</h1>

                {/* Mostrar notificación */}
                <Notification message={message} type={messageType} />

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campo de Usuario Admin (solo lectura) */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="usuario_asodi_admin">
                            Usuario Admin:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-200"
                            id="usuario_asodi_admin"
                            name="usuario_asodi_admin"
                            type="text"
                            value={anuncioData.usuario_asodi_admin}
                            readOnly
                        />
                    </div>

                    {/* Campo de Título */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="titulo">
                            Título:<span className="text-red-500">*</span>
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            id="titulo"
                            name="titulo"
                            type="text"
                            value={anuncioData.titulo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Campo de Descripción */}
                    <div className="mb-4 md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
                            Descripción:<span className="text-red-500">*</span>
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            id="descripcion"
                            name="descripcion"
                            value={anuncioData.descripcion}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Campo de Fecha de Inicio */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_inicio">
                            Fecha Inicio:<span className="text-red-500">*</span>
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            id="fecha_inicio"
                            name="fecha_inicio"
                            type="date"
                            value={anuncioData.fecha_inicio}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Campo de Fecha de Término */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_termino">
                            Fecha Término:<span className="text-red-500">*</span>
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            id="fecha_termino"
                            name="fecha_termino"
                            type="date"
                            value={anuncioData.fecha_termino}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Checkbox de Estado Activo */}
                    <div className="flex items-center mb-4">
                        <input
                            className="mr-2 leading-tight focus:ring-teal-500"
                            type="checkbox"
                            id="estado_an"
                            name="estado_an"
                            checked={anuncioData.estado_an}
                            onChange={() => setAnuncioData({ ...anuncioData, estado_an: !anuncioData.estado_an })}
                        />
                        <label htmlFor="estado_an" className="text-sm text-gray-700 font-bold">
                            Estado Activo
                        </label>
                    </div>

                    {/* Campo de Imagen */}
                    <div className="mb-4 md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imagen">
                            Imagen:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            id="imagen"
                            name="imagen"
                            type="file"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Botón para enviar */}
                    <div className="md:col-span-2 flex justify-center">
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-105"
                        >
                            Crear Anuncio
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAnuncioPage;
