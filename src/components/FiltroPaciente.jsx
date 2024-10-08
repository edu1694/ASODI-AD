import React, { useState } from 'react';

// Función para formatear el RUT con puntos y guión, asegurando que la 'K' solo esté al final
const formatRut = (rut) => {
  let rutLimpio = rut.replace(/[^0-9kK]/g, '');

  const indexOfK = rutLimpio.indexOf('k') !== -1 ? rutLimpio.indexOf('k') : rutLimpio.indexOf('K');
  if (indexOfK !== -1 && indexOfK !== rutLimpio.length - 1) {
    rutLimpio = rutLimpio.slice(0, indexOfK);
  }

  const cuerpo = rutLimpio.slice(0, -1);
  let dv = rutLimpio.slice(-1);

  if (!/[kK0-9]/.test(dv)) {
    dv = '';
  }

  let cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${cuerpoFormateado}-${dv}`;
};

const rutRegex = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/;

const FiltroPaciente = ({ estadoFiltro, handleEstadoChange, fechaFiltro, handleFechaChange, rutFiltro, handleRutChange }) => {
  const [errorRut, setErrorRut] = useState('');

  const handleRutInputChange = (e) => {
    const value = e.target.value;
    const rutFormateado = formatRut(value);
    handleRutChange(rutFormateado);

    if (rutFormateado.length > 9 && rutRegex.test(rutFormateado)) {
      setErrorRut('');
    } else {
      setErrorRut('Formato de RUT inválido. Debe ser 11.111.111-1 o 11.111.111-K.');
    }
  };

  // Actualizamos el handleFechaChange para evitar errores de lectura
  const handleFechaInputChange = (e) => {
    if (e.target) {
      handleFechaChange(e.target.value);
    }
  };

  return (
    <div className="w-80 p-6 bg-white shadow-md rounded-lg ml-4">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Filtros</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Filtrar por RUT</label>
        <input
          type="text"
          value={rutFiltro}
          onChange={handleRutInputChange}
          placeholder="Ingrese RUT (Ej: 11.111.111-1)"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errorRut && <p className="text-red-500 mt-2">{errorRut}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Fecha de Ingreso:</label>
        <input
          type="date"
          value={fechaFiltro}
          onChange={handleFechaInputChange} // Cambio aquí
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

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
