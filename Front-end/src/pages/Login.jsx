import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// CRUCIAL: Configurar axios para manejar cookies y credenciales.
// Asegúrate de que esta configuración esté en un archivo central (como App.jsx) 
// o se repita en cada componente que interactúe con el backend.
axios.defaults.withCredentials = true;

const API_URL = "/api/auth"; // Ajusta el puerto si es necesario

export default function Login({ setUser }) {
  const [formData, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null); // Usamos null para el estado inicial sin error
  const navigate = useNavigate(); // Corregido: 'navegate' a 'navigate'

  // Controlador de cambios para campos de formulario
  const handleInputChange = (e) => {
    setForm({ 
        ...formData, 
        [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores anteriores

    try {
      // Petición POST para iniciar sesión.
      // Axios enviará las credenciales (cookies) gracias a la configuración global.
      const res = await axios.post(
        `${API_URL}/login`,
        formData
      );
      
      // Si tiene éxito, el backend ya estableció la cookie HTTP-Only.
      // Actualizamos el estado de usuario en el frontend y navegamos.
      setUser(res.data.user);
      navigate("/"); // Redirigir al inicio
    } catch (err) {
      console.error("Error de inicio de sesión:", err);
      // Mostrar un mensaje más detallado si está disponible en la respuesta del backend
      const errorMessage = err.response?.data?.message || "Credenciales inválidas. Por favor, inténtalo de nuevo.";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <form 
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm transition-all duration-300 transform hover:shadow-3xl" 
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-600">
          Iniciar Sesión
        </h2>
        
        {/* Visualización de Errores */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-medium animate-pulse">
            {error}
          </div>
        )}
        
        <div className="space-y-5">
            {/* Campo de Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    required
                    className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    value={formData.email}
                    onChange={handleInputChange}
                />
            </div>

            {/* Campo de Contraseña */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Contraseña</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    value={formData.password}
                    onChange={handleInputChange}
                />
            </div>

            {/* Botón de Enviar */}
            <button 
                type="submit"
                className="bg-indigo-600 text-white font-semibold p-3 w-full rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 transform hover:scale-[1.01]"
            >
                Acceder
            </button>
        </div>
      </form>
    </div>
  );
}