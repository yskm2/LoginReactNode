import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// Importamos un ícono para añadir un toque visual moderno
import { LogOut, LogIn, UserPlus, Grid } from 'lucide-react'; // Necesitarás instalar 'lucide-react' o usar otro set de iconos (ej: react-icons)

export const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Manejo de errores básico para el logout
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
    } catch (error) {
      console.error("Error durante el logout:", error);
    }
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 shadow-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Nombre del Sistema */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-extrabold text-indigo-400 hover:text-indigo-300 transition-colors duration-200 tracking-wider"
          >
            <Grid className="w-6 h-6" /> {/* Ícono moderno */}
            <span>Systems</span>
          </Link>

          {/* Enlaces de Navegación */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Vista de Usuario Autenticado
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm font-medium hidden sm:inline">
                  Usuario: {user.name || 'Undifined'}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              // Vista de Usuario No Autenticado
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 p-2 text-gray-300 hover:text-indigo-400 transition-colors duration-200 rounded-md hover:bg-gray-800"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="font-medium">Login</span>
                </Link>

                <Link
                  to="/register"
                  className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
