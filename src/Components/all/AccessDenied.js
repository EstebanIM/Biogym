import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react'; // Usaremos este ícono para dar un toque visual

export default function AccessDenied() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
                <AlertTriangle className="text-red-500 h-16 w-16 mx-auto mb-4" />

                <h1 className="text-3xl font-bold text-gray-800 mb-2">Acceso Denegado</h1>
                <p className="text-gray-600 mb-6">
                    No tienes permiso para acceder a esta sección.
                </p>

                <Link to="/inicio">
                    <button className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-300">
                        Ir a Inicio
                    </button>
                </Link>
            </div>
        </div>
    );
}
