import React from "react";
import { Link } from "react-router-dom";

export default function Home({ user, error }) {
  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 bg-gray-50">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-lg text-center transform transition duration-500 hover:scale-[1.01]">
        
        {/* Manejo de Errores */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-medium">
            Error: {error}
          </div>
        )}

        {/* Contenido si el usuario está logueado */}
        {user ? (
          <div>
            <svg 
                className="w-16 h-16 mx-auto mb-4 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <h2 className="text-3xl font-extrabold mb-2 text-gray-800">
                ¡Bienvenido, {user.name}!
            </h2>
            <p className="text-lg text-gray-500 mb-6">
                Has iniciado sesión correctamente.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Email registrado:</p>
                <p className="text-xl font-bold text-indigo-600 truncate">{user.email}</p>
            </div>
          </div>
        ) : (
          /* Contenido si el usuario NO está logueado */
          <div className="">
            <svg 
                className="w-16 h-16 mx-auto mb-4 text-indigo-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
              Necesitas Iniciar Sesión
            </h2>
            <div className="flex flex-col gap-y-4">
              <Link
                to="/login"
                className="w-full text-white bg-indigo-600 p-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-semibold shadow-md"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="w-full text-gray-700 bg-gray-200 p-3 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-semibold"
              >
                Registrarse
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}