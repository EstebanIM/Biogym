import React, { useState, useEffect } from 'react';
import { db } from '../../../../libs/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { ResponsiveTable } from "../../../ui/ResponsiveTable";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardHeader from "../../../menu/DashboardHeader";
import DashboardSidebar from "../../../menu/DashboardSidebar";

export default function VerRacks() {
    const [racks, setRacks] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Función para obtener racks y el nombre de la bodega asociada desde Firestore
    useEffect(() => {
        const fetchRacks = async () => {
            try {
                // Obtén los racks
                const querySnapshot = await getDocs(collection(db, "racks"));
                const racksList = await Promise.all(
                    querySnapshot.docs.map(async (doc) => {
                        const rackData = doc.data();

                        // Obtener el nombre de la bodega asociada usando `codBodega`
                        let bodegaName = "Sin bodega";
                        if (rackData.codBodega) {
                            const bodegaSnapshot = await getDocs(
                                collection(db, "bodegas")
                            );
                            const matchingBodega = bodegaSnapshot.docs.find(
                                (bodegaDoc) =>
                                    bodegaDoc.data().codBodega === rackData.codBodega
                            );

                            if (matchingBodega && matchingBodega.exists()) {
                                bodegaName =
                                    matchingBodega.data().nomBodega ||
                                    "Nombre de bodega no disponible";
                            }
                        }

                        return {
                            id: doc.id,
                            ...rackData,
                            bodegaName, // Añadir el nombre de la bodega
                        };
                    })
                );

                console.log("Datos obtenidos de Firestore:", racksList); // <-- Verificar datos en consola
                setRacks(racksList); // Actualiza el estado con la lista de racks
            } catch (error) {
                console.error("Error al obtener los racks:", error);
                toast.error("Error al obtener la lista de racks");
            } finally {
                setLoading(false); 
            }
        };

        fetchRacks();
    }, []);

    // Configura los encabezados y las filas para la tabla
    const headers = ["Código de Rack", "Bodega Asociada", "Fila", "Número de Rack", "Pasillo"];
    const rows = racks.map(rack => [
        rack.codRack || "Sin código",
        rack.bodegaName || "Sin bodega",
        rack.fila || "Sin fila",
        rack.numRack || "N/A",
        rack.pasillo || "Sin pasillo"
    ]);

    return (
        <div className="flex h-screen bg-gray-100">
            <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col">
                <DashboardHeader toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
                        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Lista de Racks</h1>

                        {loading ? (
                            <p className="text-center text-gray-500">Cargando racks...</p>
                        ) : (
                            <ResponsiveTable headers={headers} rows={rows} />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
