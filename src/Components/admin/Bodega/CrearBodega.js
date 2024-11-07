import React, { useState, useEffect } from "react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/button";
import { db } from "../../../libs/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import DashboardHeader from "../../menu/DashboardHeader";
import DashboardSidebar from "../../menu/DashboardSidebar";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function CrearBodega() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    codBodega: "",
    nomBodega: "",
    idTienda: "",
    nombreTienda: "",
  });
  const [loading, setLoading] = useState(false);
  const [tiendas, setTiendas] = useState([]);
  const [loadingTiendas, setLoadingTiendas] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tiendas"));
        const tiendasList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          nombreTienda: doc.data().nombreTienda,
        }));
        setTiendas(tiendasList);
        setLoadingTiendas(false);
      } catch (error) {
        toast.error("Error al cargar tiendas: " + error.message);
        setLoadingTiendas(false);
      }
    };

    fetchTiendas();
  }, []);

  useEffect(() => {
    const generateCodBodega = () => {
      const codBodega = `BOD-${Date.now()}`;
      setFormData((prevData) => ({
        ...prevData,
        codBodega,
      }));
    };

    generateCodBodega();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleTiendaChange = (e) => {
    const selectedTiendaId = e.target.value;
    const selectedTienda = tiendas.find((tienda) => tienda.id === selectedTiendaId);
    setFormData({
      ...formData,
      idTienda: selectedTiendaId,
      nombreTienda: selectedTienda ? selectedTienda.nombreTienda : "",
    });
  };

  const validateForm = () => {
    const { nomBodega, idTienda } = formData;
    if (!nomBodega.trim()) {
      toast.error("El nombre de la bodega es obligatorio.");
      return false;
    }
    if (!idTienda) {
      toast.error("Debe seleccionar una tienda.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const { codBodega, nomBodega, idTienda, nombreTienda } = formData;

    try {
      await addDoc(collection(db, "bodegas"), {
        codBodega,
        nomBodega,
        idTienda,
        nombreTienda,
      });

      toast.success("Bodega creada exitosamente");

      setFormData({
        codBodega: `BOD-${Date.now()}`,
        nomBodega: "",
        idTienda: "",
        nombreTienda: "",
      });
    } catch (err) {
      console.error("Error al agregar la bodega a Firestore:", err);
      toast.error("Error al crear la bodega: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Crear Bodega</h1>

            {loadingTiendas ? (
              <p className="text-center text-gray-500">Cargando tiendas...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="nomBodega" className="block text-sm font-semibold text-gray-700">
                    Nombre de la Bodega
                  </label>
                  <Input
                    id="nomBodega"
                    type="text"
                    placeholder="Nombre de la bodega"
                    value={formData.nomBodega}
                    onChange={handleInputChange}
                    required
                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="idTienda" className="block text-sm font-semibold text-gray-700">
                    Seleccionar Tienda
                  </label>
                  <select
                    id="idTienda"
                    value={formData.idTienda}
                    onChange={handleTiendaChange}
                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full bg-white"
                    required
                  >
                    <option value="">Seleccione una tienda</option>
                    {tiendas.map((tienda) => (
                      <option key={tienda.id} value={tienda.id}>
                        {tienda.nombreTienda}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold p-3 rounded-lg w-full"
                  disabled={loading}
                >
                  {loading ? "Creando bodega..." : "Crear Bodega"}
                </Button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
  