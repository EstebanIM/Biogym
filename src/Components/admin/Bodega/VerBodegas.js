import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../libs/firebase"; // Importamos Firestore
import DashboardHeader from "../../menu/DashboardHeader";
import DashboardSidebar from "../../menu/DashboardSidebar";
import { ResponsiveTable } from "../../ui/ResponsiveTable"; // Importa el componente ResponsiveTable
import { toast } from "react-toastify"; // Importar el toast
import 'react-toastify/dist/ReactToastify.css';

export default function VerBodegas() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bodegas, setBodegas] = useState([]); // Estado para almacenar las bodegas
  const [tiendas, setTiendas] = useState([]); // Estado para almacenar las tiendas
  const [productos, setProductos] = useState([]); // Estado para almacenar los productos
  const [racks, setRacks] = useState([]); // Estado para almacenar los racks
  const [filteredBodegas, setFilteredBodegas] = useState([]); // Estado para bodegas filtradas
  const [loading, setLoading] = useState(true);
  const [selectedTienda, setSelectedTienda] = useState(""); // Filtro por tienda

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Cargar las bodegas, tiendas, productos, y racks desde Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener bodegas
        const bodegasSnapshot = await getDocs(query(collection(db, "bodegas"), orderBy("idTienda")));
        const bodegasList = bodegasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Obtener tiendas
        const tiendasSnapshot = await getDocs(collection(db, "tiendas"));
        const tiendasList = tiendasSnapshot.docs.map((doc) => ({
          id: doc.id,
          nombreTienda: doc.data().nombreTienda,
        }));

        // Obtener productos
        const productosSnapshot = await getDocs(collection(db, "productos"));
        const productosList = productosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Obtener racks
        const racksSnapshot = await getDocs(collection(db, "racks"));
        const racksList = racksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBodegas(bodegasList);
        setTiendas(tiendasList);
        setProductos(productosList); // Set products data
        setRacks(racksList); // Set racks data
        setFilteredBodegas(bodegasList); // Inicialmente todas las bodegas están visibles
        setLoading(false);
      } catch (error) {
        toast.error("Error al cargar los datos: " + error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Aplicar filtro cuando cambia el valor de `selectedTienda`
  useEffect(() => {
    if (selectedTienda) {
      const filtered = bodegas.filter((bodega) => bodega.idTienda === selectedTienda);
      setFilteredBodegas(filtered);
    } else {
      // Si no hay tienda seleccionada, mostrar todas las bodegas
      setFilteredBodegas(bodegas);
    }
  }, [selectedTienda, bodegas]);

  // Manejar cambio en filtro de tienda
  const handleTiendaChange = (e) => {
    setSelectedTienda(e.target.value);
  };

  // Obtener productos asociados a una bodega (a través de racks)
  const getProductosForBodega = (bodegaId) => {
    const racksForBodega = racks.filter(rack => rack.codBodega === bodegaId);
    const rackIds = racksForBodega.map(rack => rack.codRack);
    return productos.filter(producto => rackIds.includes(producto.rack));
  };

  // Configuración de los encabezados y las filas para ResponsiveTable
  const headers = ["Nombre de Bodega", "Tienda Asociada", "Cantidad de Productos", "Cantidad de Racks"];
  const rows = filteredBodegas.map((bodega) => {
    const tienda = tiendas.find((tienda) => tienda.id === bodega.idTienda);
    const productosCount = getProductosForBodega(bodega.codBodega).length;
    const racksCount = racks.filter((rack) => rack.codBodega === bodega.codBodega).length;

    return [
      bodega.nomBodega,
      tienda ? tienda.nombreTienda : "Tienda no encontrada",
      productosCount > 0 ? productosCount : "No hay productos registrados",
      racksCount > 0 ? racksCount : "No hay racks registrados",
    ];
  });

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader toggleSidebar={toggleSidebar} />

        {/* Contenido Principal - Mostrar Bodegas */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Bodegas</h1>

            {loading ? (
              <p className="text-center text-gray-500">Cargando bodegas...</p>
            ) : (
              <div>
                {/* Filtros */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700">Filtrar por Tienda</label>
                  <select
                    value={selectedTienda}
                    onChange={handleTiendaChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Todas las tiendas</option>
                    {tiendas.map((tienda) => (
                      <option key={tienda.id} value={tienda.id}>
                        {tienda.nombreTienda}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tabla de bodegas filtradas */}
                <ResponsiveTable headers={headers} rows={rows} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
