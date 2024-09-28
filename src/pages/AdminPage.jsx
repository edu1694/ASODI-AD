import React from 'react';
import SidebarAdmin from '../components/SidebarAdmin'; // Asegúrate de tener el Sidebar en la misma carpeta o ajusta el import

const AdminPage = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold">Bienvenido a la Plataforma</h1>
        <p className="mt-5 text-lg">Este es tu panel de inicio. Aquí podrás ver tus tickets, tareas, informes y más.</p>
        
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Tus Actividades Recientes</h2>
          <ul className="list-disc list-inside space-y-3">
            <li className="text-lg">Ticket #12345 - Resuelto</li>
            <li className="text-lg">Tarea de TI - En progreso</li>
            <li className="text-lg">Informe de activos - Pendiente</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;