import React, { useState, useEffect } from "react";
import { Input } from "../../../ui/Input";
import { Button } from "../../../ui/button";
import { db } from "../../../../libs/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import DashboardHeader from "../../../menu/DashboardHeader";
import DashboardSidebar from "../../../menu/DashboardSidebar";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function CrearRack() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    codRack: "",
    numRack: "",
    fila: "",
    pasillo: "",
    codBodega: "",
    nomBodega: "",
  });
  const [loading, setLoading] = useState(false);
  const [bodegas, setBodegas] = useState([]);
  const [loadingBodegas, setLoadingBodegas] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Cargar bodegas desde Firestore
  useEffect(() => {
    const fetchBodegas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bodegas"));
        const bodegasList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          codBodega: doc.data().codBodega,
          nomBodega: doc.data().nomBodega,
        }));
        setBodegas(bodegasList);
        setLoadingBodegas(false);
      } catch (error) {
        toast.error("Error al cargar bodegas: " + error.message);
        setLoadingBodegas(false);
      }
    };

    fetchBodegas();
  }, []);

  // Generar un código de rack único automáticamente
  useEffect(() => {
    const generateCodRack = () => {
      const codRack = `RACK-${Date.now()}`;
      setFormData((prevData) => ({
        ...prevData,
        codRack,
      }));
    };

    generateCodRack();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleBodegaChange = (e) => {
    const selectedBodegaCod = e.target.value;
    const selectedBodega = bodegas.find((bodega) => bodega.codBodega === selectedBodegaCod);
    setFormData({
      ...formData,
      codBodega: selectedBodega ? selectedBodega.codBodega : "",
      nomBodega: selectedBodega ? selectedBodega.nomBodega : "",
    });
  };

  const validateForm = () => {
    const { numRack, fila, pasillo, codBodega } = formData;
    if (!numRack.trim()) {
      toast.error("El número de rack es obligatorio.");
      return false;
    }
    if (!fila.trim()) {
      toast.error("La fila es obligatoria.");
      return false;
    }
    if (!pasillo.trim()) {
      toast.error("El pasillo es obligatorio.");
      return false;
    }
    if (!codBodega) {
      toast.error("Debe seleccionar una bodega.");
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

    const { codRack, numRack, fila, pasillo, codBodega } = formData;

    try {
      await addDoc(collection(db, "racks"), {
        codRack,
        numRack,
        fila,
        pasillo,
        codBodega,
      });

      toast.success("Rack creado exitosamente");
      setFormData({
        codRack: `RACK-${Date.now()}`,
        numRack: "",
        fila: "",
        pasillo: "",
        codBodega: "",
        nomBodega: "",
      });
    } catch (err) {
      console.error("Error al agregar el rack a Firestore:", err);
      toast.error("Error al crear el rack: " + err.message);
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
            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Crear Rack</h1>

            {loadingBodegas ? (
              <p className="text-center text-gray-500">Cargando bodegas...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="numRack" className="block text-sm font-medium text-gray-700">
                    Número de Rack
                  </label>
                  <Input
                    id="numRack"
                    type="text"
                    placeholder="Número de Rack"
                    value={formData.numRack}
                    onChange={handleInputChange}
                    required
                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="fila" className="block text-sm font-medium text-gray-700">
                    Fila
                  </label>
                  <Input
                    id="fila"
                    type="text"
                    placeholder="Fila"
                    value={formData.fila}
                    onChange={handleInputChange}
                    required
                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="pasillo" className="block text-sm font-medium text-gray-700">
                    Pasillo
                  </label>
                  <Input
                    id="pasillo"
                    type="text"
                    placeholder="Pasillo"
                    value={formData.pasillo}
                    onChange={handleInputChange}
                    required
                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="codBodega" className="block text-sm font-medium text-gray-700">
                    Seleccionar Bodega
                  </label>
                  <select
                    id="codBodega"
                    value={formData.codBodega}
                    onChange={handleBodegaChange}
                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full bg-white"
                    required
                  >
                    <option value="">Seleccione una bodega</option>
                    {bodegas.map((bodega) => (
                      <option key={bodega.codBodega} value={bodega.codBodega}>
                        {bodega.nomBodega}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold p-3 rounded-lg w-full"
                  disabled={loading}
                >
                  {loading ? "Creando rack..." : "Crear Rack"}
                </Button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
