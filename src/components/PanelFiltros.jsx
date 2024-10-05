import React, { useState } from 'react';

const PanelFiltros = ({ estadoFiltro, handleEstadoChange, fechaFiltro, handleFechaChange, solicitudFiltro, handleSolicitudChange }) => {
  const [errorSolicitud, setErrorSolicitud] = useState(''); // Estado para manejar el mensaje de error

  const handleSolicitudInputChange = (e) => {
    const value = e.target.value;

    // Verificar si el valor contiene caracteres no numéricos
    if (/^\d*$/.test(value)) {  // Solo permitir dígitos numéricos
      setErrorSolicitud('');     // Limpiar mensaje de error si el valor es válido
      handleSolicitudChange(value);  // Actualizar el filtro de solicitud con el valor numérico
    } else {
      setErrorSolicitud('Solo se aceptan caracteres numéricos.'); // Mostrar error si hay caracteres no numéricos
    }
  };

  const handleKeyDown = (e) => {
    // Permitir solo teclas numéricas, backspace, tab, y flechas de navegación
    if (
      !(e.key >= '0' && e.key <= '9') &&
      e.key !== 'Backspace' &&
      e.key !== 'Tab' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowRight'
    ) {
      e.preventDefault();  // Evitar la inserción de caracteres no numéricos
    }
  };

  return (
    <div className="w-80 p-6 bg-white shadow-md rounded-lg ml-4">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Filtros</h2>

      {/* Filtro por estado */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Filtrar por estado</label>
        <select
          value={estadoFiltro}
          onChange={handleEstadoChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="A">Aprobado</option>
          <option value="P">Pendiente</option>
          <option value="R">Rechazado</option>
          <option value="">Todos</option>
        </select>
      </div>

      {/* Filtro por fecha de creación */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Filtrar por fecha de creación</label>
        <input
          type="date"
          value={fechaFiltro}
          onChange={handleFechaChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Filtro por ID de Solicitud */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Filtrar por ID de Solicitud</label>
        <input
          type="text"
          value={solicitudFiltro}
          onKeyDown={handleKeyDown} // Bloquear caracteres no numéricos
          onChange={handleSolicitudInputChange} // Usar la función de validación
          placeholder="Ingrese ID de Solicitud"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errorSolicitud && (
          <p className="text-red-500 mt-2">{errorSolicitud}</p> // Mostrar mensaje de error si hay un problema
        )}
      </div>
    </div>
  );
};

export default PanelFiltros;
