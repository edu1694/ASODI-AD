import React, { useState } from 'react';

// Función para formatear el RUT con puntos y guión, asegurando que la 'K' solo esté al final
const formatRut = (rut) => {
  // Remover todo excepto números y 'k' o 'K'
  let rutLimpio = rut.replace(/[^0-9kK]/g, '');

  // Si ya hay una "k" (o "K") en cualquier parte del RUT antes del guion, la eliminamos
  const indexOfK = rutLimpio.indexOf('k') !== -1 ? rutLimpio.indexOf('k') : rutLimpio.indexOf('K');
  if (indexOfK !== -1 && indexOfK !== rutLimpio.length - 1) {
    rutLimpio = rutLimpio.slice(0, indexOfK); // Remover cualquier "k" que no esté al final
  }

  // Separar el cuerpo del dígito verificador (DV)
  const cuerpo = rutLimpio.slice(0, -1);
  let dv = rutLimpio.slice(-1);

  // Si el último carácter no es 'k' o 'K', entonces el DV es el último dígito
  if (!/[kK0-9]/.test(dv)) {
    dv = ''; // Si el último carácter es inválido, lo eliminamos
  }

  // Agregar puntos al cuerpo
  let cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${cuerpoFormateado}-${dv}`;
};

// Expresión regular más estricta para validar el RUT completo
const rutRegex = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/;

const FiltroPaciente = ({ estadoFiltro, handleEstadoChange, fechaFiltro, handleFechaChange, rutFiltro, handleRutChange }) => {
  const [errorRut, setErrorRut] = useState(''); // Estado para manejar el mensaje de error

  const handleRutInputChange = (e) => {
    const value = e.target.value;

    // Formatear el RUT a medida que el usuario escribe
    const rutFormateado = formatRut(value);
    handleRutChange(rutFormateado);

    // Validar el RUT ingresado
    if (rutFormateado.length > 9 && rutRegex.test(rutFormateado)) { // Asegurarse de que el RUT tenga la longitud adecuada
      setErrorRut('');  // Limpiar mensaje de error si el formato es válido
    } else {
      setErrorRut('Formato de RUT inválido. Debe ser 11.111.111-1 o 11.111.111-K.'); // Mostrar error si el formato es incorrecto
    }
  };

  return (
    <div className="w-80 p-6 bg-white shadow-md rounded-lg ml-4">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Filtros</h2>

      {/* Filtro por RUT */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Filtrar por RUT</label>
        <input
          type="text"
          value={rutFiltro}
          onChange={handleRutInputChange}
          placeholder="Ingrese RUT (Ej: 11.111.111-1)"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errorRut && (
          <p className="text-red-500 mt-2">{errorRut}</p> // Mostrar mensaje de error si el formato es incorrecto
        )}
      </div>

      {/* Filtro por fecha de ingreso */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Fecha de Ingreso:</label>
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
