import React, { useState } from "react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/button";
import { db } from "../../../libs/firebase";
import { collection, addDoc } from "firebase/firestore";
import DashboardHeader from "../../menu/DashboardHeader";
import DashboardSidebar from "../../menu/DashboardSidebar";
import chileRegions from '../../../data/comunas-regiones';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function CrearTienda() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombreTienda: "",
    direccion: "",
    numeroDireccion: "",
    ciudad: "",
    region: "",
  });
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setFormData({
      ...formData,
      region: selectedRegion,
      ciudad: "",
    });
  };

  const comunas = formData.region
    ? chileRegions.regiones.find((r) => r.region === formData.region)?.comunas || []
    : [];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const validateForm = () => {
    const { nombreTienda, direccion, numeroDireccion, ciudad, region } = formData;
    if (!nombreTienda.trim()) {
      toast.error("El nombre de la tienda es obligatorio.");
      return false;
    }
    if (!region) {
      toast.error("Debe seleccionar una región.");
      return false;
    }
    if (!ciudad) {
      toast.error("Debe seleccionar una ciudad.");
      return false;
    }
    if (!direccion.trim()) {
      toast.error("La dirección es obligatoria.");
      return false;
    }
    if (!numeroDireccion.trim() || !/^[0-9]+$/.test(numeroDireccion)) {
      toast.error("El número de dirección debe ser un número válido.");
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

    const { nombreTienda, direccion, numeroDireccion, ciudad, region } = formData;

    try {
      const docRef = await addDoc(collection(db, "tiendas"), {
        nombreTienda,
        direccion: `${direccion} ${numeroDireccion}`,
        ciudad,
        region,
        fechaCreacion: new Date(),
      });

      toast.success(`Tienda creada exitosamente con ID: ${docRef.id}`);

      setFormData({
        nombreTienda: "",
        direccion: "",
        numeroDireccion: "",
        ciudad: "",
        region: "",
      });
    } catch (err) {
      console.error("Error al agregar tienda a Firestore:", err);
      toast.error("Error al crear la tienda: " + err.message);
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
            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Crear Tienda</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="nombreTienda" className="block text-sm font-semibold text-gray-700">
                  Nombre de la Tienda
                </label>
                <Input
                  id="nombreTienda"
                  type="text"
                  placeholder="Nombre de la tienda"
                  value={formData.nombreTienda}
                  onChange={handleInputChange}
                  required
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="region" className="block text-sm font-semibold text-gray-700">
                  Región
                </label>
                <select
                  id="region"
                  value={formData.region}
                  onChange={handleRegionChange}
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full bg-white"
                  required
                >
                  <option value="">Seleccione una región</option>
                  {chileRegions.regiones.map((r) => (
                    <option key={r.region} value={r.region}>
                      {r.region}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-5">
                <label htmlFor="ciudad" className="block text-sm font-semibold text-gray-700">
                  Ciudad
                </label>
                <select
                  id="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full bg-white"
                  required
                  disabled={!formData.region}
                >
                  <option value="">Seleccione una ciudad</option>
                  {comunas.map((comuna) => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-5">
                <label htmlFor="direccion" className="block text-sm font-semibold text-gray-700">
                  Dirección
                </label>
                <Input
                  id="direccion"
                  type="text"
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  required
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="numeroDireccion" className="block text-sm font-semibold text-gray-700">
                  Número de Dirección
                </label>
                <Input
                  id="numeroDireccion"
                  type="text"
                  placeholder="Número"
                  value={formData.numeroDireccion}
                  onChange={handleInputChange}
                  required
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                />
              </div>

              <Button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold p-3 rounded-lg w-full"
                disabled={loading}
              >
                {loading ? "Creando tienda..." : "Crear Tienda"}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
