import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../api/asodi.api.js';
import SidebarAdmin from '../components/SidebarAdmin';
import Notification from '../components/Notification'; // Importamos el componente Notification

const ViewAnuncioPage = () => {
    const [anuncios, setAnuncios] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAnuncio, setSelectedAnuncio] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchAnuncios();
    }, []);

    const fetchAnuncios = async () => {
        try {
            const response = await axios.get(`${baseUrl}/asodi/v1/anuncios/`);
            setAnuncios(response.data);
        } catch (error) {
            console.error('Error al cargar los anuncios:', error);
        }
    };

    const deleteAnuncio = async (id_anuncio) => {
        setIsLoading(true);
        try {
            await axios.delete(`${baseUrl}/asodi/v1/anuncios/${id_anuncio}/`);
            fetchAnuncios();
            setMessage('Anuncio eliminado correctamente.');
            setMessageType('success');
        } catch (error) {
            console.error('Error al eliminar el anuncio:', error);
            setMessage('Error al eliminar el anuncio.');
            setMessageType('error');
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
    };

    const openEditModal = (anuncio) => {
        setSelectedAnuncio(anuncio);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAnuncio(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedAnuncio((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        setSelectedAnuncio({
            ...selectedAnuncio,
            imagen: e.target.files[0], // Captura el archivo
        });
    };

    const handleUpdateAnuncio = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('titulo', selectedAnuncio.titulo);
        formData.append('descripcion', selectedAnuncio.descripcion);
        formData.append('fecha_inicio', selectedAnuncio.fecha_inicio);
        formData.append('fecha_termino', selectedAnuncio.fecha_termino);
        formData.append('estado_an', selectedAnuncio.estado_an);

        // Si hay una imagen nueva, la agregamos
        if (selectedAnuncio.imagen instanceof File) {
            formData.append('imagen', selectedAnuncio.imagen); // Adjunta la imagen solo si es un archivo nuevo
        }

        try {
            // Usamos PATCH para actualizar parcialmente solo los campos modificados
            await axios.patch(`${baseUrl}/asodi/v1/anuncios/${selectedAnuncio.id_anuncio}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Anuncio actualizado correctamente.');
            setMessageType('success');
            closeModal();
            fetchAnuncios(); // Recargar los anuncios actualizados
        } catch (error) {
            console.error('Error al actualizar el anuncio:', error);
            setMessage('Error al actualizar el anuncio.');
            setMessageType('error');

            // Captura los detalles del error si están disponibles
            if (error.response) {
                console.log('Detalles del error:', error.response.data);
            }
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* SidebarAdmin fijo */}
            <div className="w-64 bg-teal-700 text-white fixed h-screen shadow-lg">
                <SidebarAdmin />
            </div>

            {/* Contenido principal */}
            <div className="flex-grow p-10 bg-gray-100 ml-64 overflow-y-auto">
                <h1 className="text-4xl font-bold mb-6 text-center text-teal-700">Lista de Anuncios</h1>

                {/* Mostrar notificación */}
                <Notification message={message} type={messageType} />

                <table className="min-w-full bg-white shadow-lg rounded-lg mb-6 table-auto border-separate border-spacing-0">
                    <thead>
                        <tr>
                            <th className="w-2/6 px-4 py-2 bg-teal-500 text-white text-left text-sm font-semibold uppercase">Título</th>
                            <th className="w-2/6 px-4 py-2 bg-teal-500 text-white text-left text-sm font-semibold uppercase">Descripción</th>
                            <th className="w-1/6 px-4 py-2 bg-teal-500 text-white text-left text-sm font-semibold uppercase rounded-tr-lg">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {anuncios.length > 0 ? (
                            anuncios.map((anuncio) => (
                                <tr key={anuncio.id_anuncio} className="hover:bg-teal-50 border-t border-gray-300">
                                    <td className="border px-4 py-2">{anuncio.titulo}</td>
                                    <td className="border px-4 py-2">{anuncio.descripcion}</td>
                                    <td className="border px-4 py-2 flex justify-center space-x-2">
                                        <button
                                            onClick={() => openEditModal(anuncio)}
                                            className="bg-yellow-500 text-white py-1 px-3 rounded-full shadow-md transition-all duration-300 hover:bg-yellow-600 hover:shadow-lg"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => deleteAnuncio(anuncio.id_anuncio)}
                                            className="bg-red-500 text-white py-1 px-3 rounded-full shadow-md transition-all duration-300 hover:bg-red-600 hover:shadow-lg"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Eliminando...' : 'Eliminar'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-gray-500">
                                    No hay anuncios disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Modal de Edición */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Editar Anuncio</h2>
                            <form onSubmit={handleUpdateAnuncio}>
                                {/* Campo de Título */}
                                <div className="mb-4">
                                    <label htmlFor="titulo" className="block text-sm font-bold text-gray-700">Título:</label>
                                    <input
                                        type="text"
                                        name="titulo"
                                        id="titulo"
                                        value={selectedAnuncio.titulo}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 p-2 rounded"
                                    />
                                </div>

                                {/* Campo de Descripción */}
                                <div className="mb-4">
                                    <label htmlFor="descripcion" className="block text-sm font-bold text-gray-700">Descripción:</label>
                                    <textarea
                                        name="descripcion"
                                        id="descripcion"
                                        value={selectedAnuncio.descripcion}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 p-2 rounded"
                                    />
                                </div>

                                {/* Campo de Fecha de Inicio */}
                                <div className="mb-4">
                                    <label htmlFor="fecha_inicio" className="block text-sm font-bold text-gray-700">Fecha Inicio:</label>
                                    <input
                                        type="date"
                                        name="fecha_inicio"
                                        id="fecha_inicio"
                                        value={selectedAnuncio.fecha_inicio}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 p-2 rounded"
                                    />
                                </div>

                                {/* Campo de Fecha de Término */}
                                <div className="mb-4">
                                    <label htmlFor="fecha_termino" className="block text-sm font-bold text-gray-700">Fecha Término:</label>
                                    <input
                                        type="date"
                                        name="fecha_termino"
                                        id="fecha_termino"
                                        value={selectedAnuncio.fecha_termino}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 p-2 rounded"
                                    />
                                </div>

                                {/* Checkbox de Estado Activo */}
                                <div className="flex items-center mb-4">
                                    <input
                                        type="checkbox"
                                        name="estado_an"
                                        id="estado_an"
                                        checked={selectedAnuncio.estado_an}
                                        onChange={() => setSelectedAnuncio({ ...selectedAnuncio, estado_an: !selectedAnuncio.estado_an })}
                                        className="mr-2"
                                    />
                                    <label htmlFor="estado_an" className="text-sm font-bold text-gray-700">Estado Activo</label>
                                </div>

                                {/* Mostrar nombre de archivo y cambiar imagen */}
                                <div className="mb-4">
                                    <label htmlFor="imagen" className="block text-sm font-bold text-gray-700">Imagen:</label>
                                    {selectedAnuncio.imagen && !(selectedAnuncio.imagen instanceof File) ? (
                                        <p className="text-gray-500 mb-2">{selectedAnuncio.imagen.split('/').pop()}</p>
                                    ) : null}
                                    <input
                                        type="file"
                                        name="imagen"
                                        id="imagen"
                                        onChange={handleImageChange}
                                        className="w-full border border-gray-300 p-2 rounded"
                                    />
                                </div>

                                {/* Botones */}
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        className="bg-gray-500 text-white py-2 px-4 rounded"
                                        onClick={closeModal}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                                    >
                                        Guardar Cambios
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewAnuncioPage;
