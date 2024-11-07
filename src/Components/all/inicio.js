import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, Dumbbell, Box, Store, Bug } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/Card";
import DashboardHeader from "../menu/DashboardHeader";
import DashboardSidebar from "../menu/DashboardSidebar";
import { useAuth } from '../../Context/Authcontext';

export default function Inicio() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { userData } = useAuth(); // Acceder a los datos del usuario (incluye rol)

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Definir qué cards están disponibles para cada rol
    const roleBasedCards = {
        vendedor: ["Inventario"],
        bodeguero: ["Inventario", "Racks", "Bodegas"],
        logistica: ["Inventario", "Cuentas", "Racks", "Bodegas", "Tienda"]
    };

    // Obtener las cards permitidas para el rol actual del usuario
    const allowedCards = roleBasedCards[userData?.role] || [];

    return (
        <div className="flex h-screen bg-gray-100">
            <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col">
                <DashboardHeader toggleSidebar={toggleSidebar} />

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
                        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                            Bienvenido a BioGymStore
                        </h1>
                        <p className="text-lg text-gray-600 mb-12 text-center">
                            Gestiona tus productos, usuarios, bodegas y más desde este panel de control.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                            {/* Card de Inventario */}
                            {allowedCards.includes("Inventario") && (
                                <Link to="/ver-Producto" className="hover:shadow-lg transition">
                                    <Card className="bg-white rounded-lg shadow-md flex flex-col items-center text-center p-6 transform hover:scale-105 transition-transform duration-300">
                                        <CardHeader className="flex flex-col items-center mb-4">
                                            <div className="bg-gray-800 rounded-full p-4 mb-3">
                                                <Package className="h-12 w-12 text-blue-500" />
                                            </div>
                                            <CardTitle className="text-lg font-semibold text-gray-700">Inventario</CardTitle>
                                            <CardDescription className="text-sm text-gray-500 mt-2">
                                                Gestiona y visualiza todos los productos disponibles.
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            )}

                            {/* Card de Cuentas */}
                            {allowedCards.includes("Cuentas") && (
                                <Link to="/Ver-users" className="hover:shadow-lg transition">
                                    <Card className="bg-white rounded-lg shadow-md flex flex-col items-center text-center p-6 transform hover:scale-105 transition-transform duration-300">
                                        <CardHeader className="flex flex-col items-center mb-4">
                                            <div className="bg-gray-800 rounded-full p-4 mb-3">
                                                <Users className="h-12 w-12 text-green-500" />
                                            </div>
                                            <CardTitle className="text-lg font-semibold text-gray-700">Cuentas</CardTitle>
                                            <CardDescription className="text-sm text-gray-500 mt-2">
                                                Administra las cuentas de usuarios del sistema.
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            )}

                            {/* Card de Racks */}
                            {allowedCards.includes("Racks") && (
                                <Link to="/Ver-rack" className="hover:shadow-lg transition">
                                    <Card className="bg-white rounded-lg shadow-md flex flex-col items-center text-center p-6 transform hover:scale-105 transition-transform duration-300">
                                        <CardHeader className="flex flex-col items-center mb-4">
                                            <div className="bg-gray-800 rounded-full p-4 mb-3">
                                                <Dumbbell className="h-12 w-12 text-yellow-500" />
                                            </div>
                                            <CardTitle className="text-lg font-semibold text-gray-700">Racks</CardTitle>
                                            <CardDescription className="text-sm text-gray-500 mt-2">
                                                Visualiza y organiza los racks de almacenamiento.
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            )}

                            {/* Card de Bodegas */}
                            {allowedCards.includes("Bodegas") && (
                                <Link to="/ver-bodegas" className="hover:shadow-lg transition">
                                    <Card className="bg-white rounded-lg shadow-md flex flex-col items-center text-center p-6 transform hover:scale-105 transition-transform duration-300">
                                        <CardHeader className="flex flex-col items-center mb-4">
                                            <div className="bg-gray-800 rounded-full p-4 mb-3">
                                                <Box className="h-12 w-12 text-purple-500" />
                                            </div>
                                            <CardTitle className="text-lg font-semibold text-gray-700">Bodegas</CardTitle>
                                            <CardDescription className="text-sm text-gray-500 mt-2">
                                                Gestiona y organiza las bodegas de almacenamiento.
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            )}

                            {/* Card de Tienda */}
                            {allowedCards.includes("Tienda") && (
                                <Link to="/ver-tienda" className="hover:shadow-lg transition">
                                    <Card className="bg-white rounded-lg shadow-md flex flex-col items-center text-center p-6 transform hover:scale-105 transition-transform duration-300">
                                        <CardHeader className="flex flex-col items-center mb-4">
                                            <div className="bg-gray-800 rounded-full p-4 mb-3">
                                                <Store className="h-12 w-12 text-pink-500" />
                                            </div>
                                            <CardTitle className="text-lg font-semibold text-gray-700">Tienda</CardTitle>
                                            <CardDescription className="text-sm text-gray-500 mt-2">
                                                Administra las tiendas asociadas a la bodega.
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
