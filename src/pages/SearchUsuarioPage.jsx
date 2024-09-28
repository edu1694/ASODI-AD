import React, { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../api/asodi.api.js';
import SidebarAdmin from '../components/SidebarAdmin';
import Modal from '../components/Modal'; // Asegúrate de tener un componente Modal

function SearchUsuarioPage() {
    const [rut, setRut] = useState('');
    const [usuario, setUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [updatedUsuario, setUpdatedUsuario] = useState({
        rut_ad: '',
        nombre: '',
        apellido: '',
        correo: '',
        password: '',
        estado_ad: true,  // Añadido estado_ad por defecto como true
    });

    // Formatear el RUT correctamente (con puntos y guion)
    const formatRUT = (value) => {
        const cleanValue = value.replace(/[^0-9kK]/g, ''); // Eliminar todo lo que no sea números o K/k
        if (cleanValue.length > 1) {
            const rut = cleanValue.slice(0, -1); // Todo excepto el dígito verificador
            const dv = cleanValue.slice(-1); // Último carácter es el dígito verificador
            const formattedRUT = rut.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv.toUpperCase(); // Agrega puntos y guion
            return formattedRUT;
        }
        return cleanValue;
    };

    // Buscar el usuario por RUT en formato xx.xxx.xxx-x
    const handleSearch = async () => {
        setIsLoading(true);
        setUsuario(null); // Limpiar el usuario al iniciar una nueva búsqueda
        setUpdatedUsuario({ rut_ad: '', nombre: '', apellido: '', correo: '', password: '', estado_ad: true }); // Limpiar estado anterior

        console.log("RUT enviado a la API:", rut); // Verificar el RUT con formato enviado a la API

        try {
            const response = await axios.get(`${baseUrl}/asodi/v1/usuarios-asodi-ad/${rut}/`);
            console.log("Usuario encontrado:", response.data); // Verificar los datos recibidos
            setUsuario(response.data); // Aquí se asigna el objeto devuelto por la API
            setUpdatedUsuario(response.data);
        } catch (error) {
            console.error("Error buscando usuario:", error);
            setUsuario(null); // En caso de error, limpiar el usuario
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Actualizar el estado de los campos editables, incluido el estado_ad
    const handleUpdate = (e) => {
        const { name, value, type, checked } = e.target;
        setUpdatedUsuario((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value, // Si es checkbox (estado_ad), usa checked en lugar de value
        }));
    };

    // Guardar los cambios del usuario editado
    const handleSaveChanges = async () => {
        try {
            console.log('Datos enviados:', updatedUsuario); // Inspecciona los datos enviados en consola
            
            await axios.put(`${baseUrl}/asodi/v1/usuarios-asodi-ad/${updatedUsuario.rut_ad}/`, updatedUsuario, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Datos recibidos:', updatedUsuario);
            setUsuario(updatedUsuario); // Actualiza la información en la página principal
            setShowModal(false); // Cierra el modal
        } catch (error) {
            console.error("Error actualizando usuario:", error);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* SidebarAdmin fijo */}
            <div className="w-64 bg-teal-700 text-white fixed h-screen">
                <SidebarAdmin />
            </div>

            {/* Contenido principal */}
            <div className="flex-grow p-10 bg-gray-100 ml-64">
                <h1 className="text-4xl font-bold mb-4 text-center">Buscar Usuario</h1>

                {/* Campo de búsqueda por RUT */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="search">
                        Ingrese RUT del usuario:
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        id="search"
                        type="text"
                        placeholder="11.111.111-1"
                        value={rut}
                        onChange={(e) => setRut(formatRUT(e.target.value))} // Formatear el RUT al escribir
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-[#28a745] hover:bg-[#28a745] text-white font-bold py-2 px-4 rounded mt-4"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>

                {/* Mostrar datos del usuario si es encontrado */}
                {usuario ? (
                    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                        <h2 className="text-2xl font-bold mb-4">Datos del Usuario</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div><strong>RUT:</strong> {usuario.rut_ad}</div>
                            <div><strong>Nombre:</strong> {usuario.nombre}</div>
                            <div><strong>Apellido:</strong> {usuario.apellido}</div>
                            <div><strong>Correo:</strong> {usuario.correo}</div>
                            <div><strong>Estado:</strong> {usuario.estado_ad ? 'Activo' : 'Inactivo'}</div>
                        </div>
                        <button
                            onClick={handleOpenModal}
                            className="bg-[#28a745] hover:bg-[#28a745] text-white font-bold py-2 px-4 rounded mt-4"
                        >
                            Modificar
                        </button>
                    </div>
                ) : (
                    !isLoading && rut && (
                        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                            <h2 className="text-2xl font-bold mb-4 text-center">No se encontró el usuario</h2>
                        </div>
                    )
                )}

                {/* Modal para editar los datos del usuario */}
                {showModal && (
                    <Modal onClose={handleCloseModal}>
                        <h2 className="text-2xl font-bold mb-4">Editar Usuario</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label>RUT:</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                    name="rut_ad"
                                    value={updatedUsuario.rut_ad}
                                    disabled
                                />
                            </div>
                            <div>
                                <label>Nombre:</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                    name="nombre"
                                    value={updatedUsuario.nombre}
                                    onChange={handleUpdate}
                                />
                            </div>
                            <div>
                                <label>Apellido:</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                    name="apellido"
                                    value={updatedUsuario.apellido}
                                    onChange={handleUpdate}
                                />
                            </div>
                            <div>
                                <label>Correo:</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                    name="correo"
                                    value={updatedUsuario.correo}
                                    onChange={handleUpdate}
                                />
                            </div>
                            {/* Campo para modificar el estado_ad */}
                            <div className="flex items-center">
                                <label className="mr-2">Estado:</label>
                                <input
                                    type="checkbox"
                                    name="estado_ad"
                                    checked={updatedUsuario.estado_ad}
                                    onChange={handleUpdate} // Actualiza estado_ad con checkbox
                                />
                                <span className="ml-2">{updatedUsuario.estado_ad ? 'Activo' : 'Inactivo'}</span>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-500 text-white font-bold py-2 px-4 rounded mr-4"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                className="bg-[#28a745] hover:bg-[#28a745] text-white font-bold py-2 px-4 rounded"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
}

export default SearchUsuarioPage;
