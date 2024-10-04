import React from 'react';

const PanelFiltros = ({ estadoFiltro, handleEstadoChange, fechaFiltro, handleFechaChange, planillaFiltro, handlePlanillaChange }) => {
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

      {/* Filtro por ID de Planilla */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Filtrar por ID de Planilla</label>
        <input
          type="text"
          value={planillaFiltro}
          onChange={handlePlanillaChange}
          placeholder="Ingrese ID de Planilla"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>
  );
};

export default PanelFiltros;
