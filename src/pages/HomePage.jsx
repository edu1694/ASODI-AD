import React, { useState } from 'react';
import { baseUrl } from '../api/asodi.api.js';

export function HomePage() {
  const [correo, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    if (!correo || !password) {
      setLoginError('Por favor, ingresa tu correo y contraseña');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/asodi/v1/usuarios-asodi-ad/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const usuarios = await response.json();

      const usuarioEncontrado = usuarios.find(
        (user) => user.correo === correo && user.password === password
      );

      if (usuarioEncontrado) {
        // Marcar al usuario como autenticado
        localStorage.setItem('isAuthenticated', 'true');
        console.log('Inicio de sesión exitoso:', usuarioEncontrado);
        setLoginError(null);
        window.location.href = '/dashboard'; // Redirigir al dashboard
      } else {
        setLoginError('Usuario no encontrado o contraseña incorrecta');
      }
    } catch (error) {
      console.error('Error de conexión con el servidor:', error);
      setLoginError('No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-4xl font-bold mb-10 text-center text-green-600">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-8">
            <label htmlFor="correo" className="block text-gray-700 font-medium mb-3 text-lg">
              Correo electrónico
            </label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              placeholder="tucorreo@gmail.com"
            />
          </div>
          <div className="mb-10">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-3 text-lg">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              placeholder="********"
            />
          </div>
          {loginError && <p className="text-red-500 mb-4">{loginError}</p>}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-8 py-4 rounded-md text-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HomePage;
