import React, { useState, useRef } from "react";
import { Button } from "../../../ui/button";
import { QrReader } from '@blackbox-vision/react-qr-reader';
import Webcam from "react-webcam";
import DashboardHeader from "../../../menu/DashboardHeader";
import DashboardSidebar from "../../../menu/DashboardSidebar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../../../../libs/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Input } from "../../../ui/Input";

export default function AgregarProducto() {
  const [formData, setFormData] = useState({
    sku: "",
    nombreProducto: "",
    marca: "",
    rack: "",
    proveedor: "",
    fotos: [],
  });

  const [scanning, setScanning] = useState(false);
  const [qrData, setQrData] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const webcamRef = useRef(null);

  const capturePhoto = () => {
    if (!webcamRef.current) return;

    const photoUrl = webcamRef.current.getScreenshot();
    if (formData.fotos.length >= 3) {
      setPhotoError("Máximo 3 fotos permitidas.");
      return;
    }

    setFormData(prevData => ({ ...prevData, fotos: [...prevData.fotos, photoUrl] }));
    setPhotoError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sku || !formData.nombreProducto || !formData.marca || !formData.rack || formData.fotos.length === 0) {
      setErrorMsg("Por favor, complete todos los campos y capture al menos una foto.");
      toast.error("Por favor, complete todos los campos y capture al menos una foto.");
      return;
    }

    try {
      await addDoc(collection(db, 'productos'), {
        sku: formData.sku,
        nombreProducto: formData.nombreProducto,
        marca: formData.marca,
        rack: formData.rack,
        proveedor: formData.proveedor,
        fotos: formData.fotos,
      });

      toast.success('Producto agregado con éxito!');
      setFormData({
        sku: "",
        nombreProducto: "",
        marca: "",
        rack: "",
        proveedor: "",
        fotos: [],
      });
      setQrData("");
    } catch (error) {
      console.error("Error al agregar el producto: ", error);
      toast.error("Error al agregar el producto: " + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Agregar Producto</h1>

            <form onSubmit={handleSubmit}>
              {/* Escanear QR */}
              {scanning ? (
                <div className="mb-5">
                  <QrReader
                    delay={300}
                    onResult={(result, error) => {
                      if (result) {
                        setQrData(result.text);
                        setFormData(prevData => ({ ...prevData, rack: result.text }));
                        setScanning(false);
                      }
                      if (error && error.name === "NotFoundException") {
                        setErrorMsg("No se ha detectado un código QR, intenta ajustar la cámara.");
                      }
                    }}
                    style={{ width: "100%" }}
                    constraints={{ facingMode: "environment" }}
                  />
                </div>
              ) : (
                <div className="mb-5">
                  <Button
                    type="button"
                    className="w-full bg-blue-500 text-white"
                    onClick={() => {
                      setErrorMsg("");
                      setScanning(true);
                    }}
                  >
                    Escanear Código QR o Barras
                  </Button>
                </div>
              )}

              {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
              {qrData && <p className="p-2 mb-4 bg-gray-200 rounded-md">{qrData}</p>}

              {/* Campos de entrada */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700">SKU</label>
                <Input
                  name="sku"
                  type="text"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                  placeholder="Ingresa el SKU"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                <Input
                  name="nombreProducto"
                  type="text"
                  value={formData.nombreProducto}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                  placeholder="Ingresa el nombre del producto"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700">Marca</label>
                <Input
                  name="marca"
                  type="text"
                  value={formData.marca}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                  placeholder="Ingresa la marca"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700">Código del Rack (desde el QR)</label>
                <Input
                  name="rack"
                  type="text"
                  value={formData.rack}
                  readOnly
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                />
              </div>

              {/* Cámara para fotos */}
              <div className="mb-5">
                {cameraActive ? (
                  <div className="mb-4">
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode: "environment" }}
                      className="w-full h-64 bg-black"
                    />
                    <Button type="button" onClick={capturePhoto} className="w-full bg-green-500 text-white mt-4">
                      Tomar Foto
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setCameraActive(true)}
                    className="w-full bg-blue-500 text-white mb-5"
                  >
                    Activar Cámara para Tomar Fotos
                  </Button>
                )}
              </div>

              {photoError && <p className="text-red-500 mb-4">{photoError}</p>}

              {/* Vista previa de fotos */}
              {formData.fotos.length > 0 && (
                <div className="mb-5">
                  <p className="text-sm font-medium text-gray-700">Vista previa de las fotos:</p>
                  <div className="flex gap-4 mt-2">
                    {formData.fotos.map((foto, index) => (
                      <img
                        key={index}
                        src={foto}
                        alt={`Foto ${index + 1}`}
                        className="h-20 w-20 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Botón de envío */}
              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold p-3 rounded-lg">
                Agregar Producto
              </Button>
            </form>
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
