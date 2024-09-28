import React from 'react';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">404 - Página no encontrada</h1>
      <p className="text-lg">La página que estás buscando no existe.</p>
    </div>
  );
}

export default NotFoundPage;
