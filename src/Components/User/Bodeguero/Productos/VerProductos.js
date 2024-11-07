import React, { useEffect, useState } from "react";
import { db } from '../../../../libs/firebase';
import { collection, getDocs } from 'firebase/firestore';
import DashboardHeader from "../../../menu/DashboardHeader";
import DashboardSidebar from "../../../menu/DashboardSidebar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ResponsiveTable } from "../../../ui/ResponsiveTable"; // Importar el componente ResponsiveTable

export default function VerProductos() {
  const [productos, setProductos] = useState([]);
  const [racks, setRacks] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productosSnapshot, racksSnapshot, bodegasSnapshot] = await Promise.all([
        getDocs(collection(db, 'productos')),
        getDocs(collection(db, 'racks')),
        getDocs(collection(db, 'bodegas'))
      ]);

      setProductos(productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setRacks(racksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setBodegas(bodegasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los datos: ", error);
      toast.error("Error al obtener los datos.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
    setCurrentPage(1); // Restablecer la página actual al cambiar la búsqueda
  };

  const filteredProductos = productos.filter(producto =>
    producto.sku.toLowerCase().includes(searchQuery) ||
    producto.nombreProducto.toLowerCase().includes(searchQuery)
  );

  // Configuración de paginación
  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProductos.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Preparar datos para la tabla
  const headers = ["SKU", "Nombre del Producto", "Rack", "Fila", "Pasillo", "Bodega"];
  const rows = currentItems.map(producto => {
    const rack = racks.find(r => r.codRack === producto.rack);
    const numRack = rack ? rack.numRack : "Rack no encontrado";
    const fila = rack ? rack.fila : "Fila no encontrada";
    const pasillo = rack?.pasillo || "Sin pasillo";
    const bodega = rack ? bodegas.find(b => b.codBodega === rack.codBodega) : null;
    const nombreBodega = bodega ? bodega.nomBodega : "Bodega no encontrada";

    return [producto.sku, producto.nombreProducto, numRack, fila, pasillo, nombreBodega];
  });

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="w-full p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Lista de Productos</h1>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Buscar por SKU o Nombre del Producto"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {loading ? (
              <p>Cargando productos...</p>
            ) : (
              <ResponsiveTable headers={headers} rows={rows} />
            )}

            {/* Controles de paginación */}
            <div className="flex justify-center mt-6 items-center space-x-4">
              <button
                className={`w-8 h-8 flex items-center justify-center rounded-md shadow-md transition duration-200 ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
              >
                ←
              </button>

              <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 shadow-sm text-sm font-medium">
                Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
              </span>

              <button
                className={`w-8 h-8 flex items-center justify-center rounded-md shadow-md transition duration-200 ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
              >
                →
              </button>
            </div>

          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
