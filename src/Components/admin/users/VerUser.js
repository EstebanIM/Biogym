import React, { useState, useEffect } from 'react';
import { db } from '../../../libs/firebase'; // Importa tu configuración de Firestore
import { collection, getDocs } from 'firebase/firestore';
import DashboardHeader from "../../menu/DashboardHeader"; // Componente de cabecera del dashboard
import DashboardSidebar from "../../menu/DashboardSidebar"; // Componente de la barra lateral
import { ResponsiveTable } from "../../ui/ResponsiveTable"; // Importa el componente ResponsiveTable
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VerUser() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [users, setUsers] = useState([]); // Estado para almacenar la lista de usuarios
    const [loading, setLoading] = useState(true); // Estado para manejar la carga

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen); // Función para alternar la barra lateral

    // Función para obtener usuarios desde Firestore
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const usersList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(usersList); // Actualiza el estado con la lista de usuarios
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
                toast.error("Error al obtener la lista de usuarios");
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };

        fetchUsers();
    }, []);

    // Configuración de los encabezados y las filas para ResponsiveTable
    const headers = ["Nombre", "Email", "Rol", "Tienda Asociada", "Fecha de Creación"];
    const rows = users.map(user => [
        user.name || "Sin nombre",
        user.email,
        user.role,
        user.store || "No asignada",
        user.createdAt ? user.createdAt.toDate().toLocaleDateString() : "N/A"
    ]);

    return (
        <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
            {/* Sidebar */}
            <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <DashboardHeader toggleSidebar={toggleSidebar} />

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
                        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Usuarios Registrados</h1>

                        {loading ? (
                            <p className="text-center text-gray-500">Cargando usuarios...</p>
                        ) : (
                            <ResponsiveTable headers={headers} rows={rows} />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
