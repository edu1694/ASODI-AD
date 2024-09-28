import React from 'react';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">404 - Página no encontrada</h1>
      <p className="text-lg">La página que estás buscando no existe.</p>
      <a href="/" className="mt-4 bg-green-200 text-green-700 font-semibold py-2 px-4 rounded hover:bg-green-300 transition duration-300">
        Volver a la página de inicio
      </a>
    </div>
  );
}

export default NotFoundPage;
