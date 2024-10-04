import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { baseUrl } from '../api/asodi.api.js';

export function HomePage() {
  const [correo, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate(); // Crea una instancia de navigate

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!correo || !password) {
      setLoginError('Por favor, ingresa tu correo y contraseña');
      return;
    }

    try {
      // Limpiar cualquier dato anterior del localStorage antes de iniciar una nueva sesión
      localStorage.clear();

      // Primero verificar si el usuario es admin
      const adminResponse = await fetch(`${baseUrl}/asodi/v1/usuarios-asodi-admin/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!adminResponse.ok) {
        throw new Error('Error en la solicitud de admin');
      }

      const admins = await adminResponse.json();
      const adminEncontrado = admins.find(
        (admin) => admin.correo === correo && admin.password === password
      );

      if (adminEncontrado) {
        // Si el usuario es admin, redirige a AdminPage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('usuario_asodi_admin', adminEncontrado.correo);
        setLoginError(null);
        navigate('/admin');
        return; // Detenemos aquí si es admin
      }

      // Si no es admin, entonces verificar si es usuario normal
      const userResponse = await fetch(`${baseUrl}/asodi/v1/usuarios-asodi-ad/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        throw new Error('Error en la solicitud de usuario');
      }

      const usuarios = await userResponse.json();
      const usuarioEncontrado = usuarios.find(
        (user) => user.correo === correo && user.password === password
      );

      if (usuarioEncontrado) {
        // Si es usuario normal, redirige a DashboardPage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('usuario_asodi_ad', usuarioEncontrado.rut_ad); // Guardar el RUT en el localStorage
        setLoginError(null);
        navigate('/dashboard');
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
