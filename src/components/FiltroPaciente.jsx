import React, { useState } from 'react';

const FiltroPaciente = ({ estadoFiltro, handleEstadoChange, fechaFiltro, handleFechaChange, idFiltro, handleIdChange, rutFiltro, handleRutChange }) => {
  const [errorId, setErrorId] = useState(''); // Estado para manejar el mensaje de error para ID
  const [errorRut, setErrorRut] = useState(''); // Estado para manejar el mensaje de error para RUT

  // Validación para permitir solo números en el campo ID
  const handleIdInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setErrorId('');  // Limpiar el mensaje de error si es válido
      handleIdChange(value);  // Actualizar el ID si es válido
    } else {
      setErrorId('Solo se aceptan caracteres numéricos.');  // Mostrar error si no es numérico
    }
  };

  // Función para formatear RUT a "XX.XXX.XXX-X"
  const formatRut = (rut) => {
    const cleanRut = rut.replace(/[^\dkK]/g, '').toUpperCase();  // Remover caracteres no permitidos y convertir la 'k' a mayúscula
    if (cleanRut.length <= 1) return cleanRut;

    const cuerpo = cleanRut.slice(0, -1);
    const verificador = cleanRut.slice(-1);

    const formattedCuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formattedCuerpo}-${verificador}`;
  };

  // Validación y formateo progresivo del RUT
  const handleRutInputChange = (e) => {
    let value = e.target.value.toUpperCase();

    // Remover cualquier carácter no numérico excepto la 'K'
    value = value.replace(/[^\dkK]/g, '');

    // Aplicar el formato solo si el campo tiene más de 1 dígito
    if (value.length > 1) {
      value = formatRut(value);
    }

    // Verificar si es un RUT válido o si contiene caracteres no permitidos
    if (/^[0-9.]+[-kK]{0,1}$/.test(value) || value === '') {
      setErrorRut('');  // Limpiar el mensaje de error
      handleRutChange(value);  // Actualizar el valor del RUT
    } else {
      setErrorRut('Formato de RUT incorrecto.');
    }
  };

  return (
    <div className="w-80 p-6 bg-white shadow-md rounded-lg ml-4">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Filtros</h2>

      {/* Filtro por ID */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">ID:</label>
        <input
          type="text"
          value={idFiltro}
          onChange={handleIdInputChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Buscar por ID"
        />
        {errorId && <p className="text-red-500 text-sm mt-1">{errorId}</p>}
      </div>

      {/* Filtro por RUT */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">RUT:</label>
        <input
          type="text"
          value={rutFiltro}
          onChange={handleRutInputChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="20.986.233-6"
        />
        {errorRut && <p className="text-red-500 text-sm mt-1">{errorRut}</p>}
      </div>

      {/* Filtro por fecha de recepción */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Fecha de Recepción:</label>
        <input
          type="date"
          value={fechaFiltro}
          onChange={handleFechaChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Filtro por estado */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Estado del Paciente:</label>
        <select
          value={estadoFiltro}
          onChange={handleEstadoChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="Todos">Todos</option>
          <option value="A">Alta</option>
          <option value="E">En Proceso</option>
          <option value="P">Pendiente</option>
          <option value="O">Operado</option>
          <option value="R">Rechazado</option>
        </select>
      </div>
    </div>
  );
};

export default FiltroPaciente;
