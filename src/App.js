import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/login/Login';
import ResetPasswordForm from './Components/login/resetPassword';
import CrearTienda from './Components/admin/Tienda/CrearTienda';
import CrearBodega from './Components/admin/Bodega/CrearBodega';
import VerTiendas from './Components/admin/Tienda/Gettiendas';
import CrearDueño from './Components/duenio/Crear_duenio';
import VerBodegas from './Components/admin/Bodega/VerBodegas';
import CrearRack from './Components/User/Bodeguero/Racks/CrearRacks';
import VerRack from './Components/User/Bodeguero/Racks/VerRacks';
import QrGene from './Components/User/Bodeguero/Racks/ImprimirQr';
import PostProd from './Components/User/Bodeguero/Productos/AgregarProductos';
import GetProd from './Components/User/Bodeguero/Productos/VerProductos';
import CrearUsuario from './Components/admin/users/CrearUser';
import VerUsuario from './Components/admin/users/VerUser';
import Verificacion from './Components/login/isverify';
import Inicio from './Components/all/inicio';
import Config from './Components/all/Config';
import AccessDenied from './Components/all/AccessDenied'; // Importar AccessDenied
import { AuthProvider } from './Context/Authcontext';
import ProtectedRoute from './Context/ProtectedRoute';
import RedirectIfLoggedIn from './Context/RedirectIfLoggedIn';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta de Login */}
          <Route
            path="/"
            element={
              <RedirectIfLoggedIn>
                <Login />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/verificacion"
            element={
              <RedirectIfLoggedIn>
                <Verificacion />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/reset-password"
            element={
              <RedirectIfLoggedIn>
                <ResetPasswordForm />
              </RedirectIfLoggedIn>
            }
          />

          {/* Ruta de Inicio */}
          <Route
            path="/inicio"
            element={
              <ProtectedRoute allowedRoles={['logistica', 'vendedor', 'bodeguero']}>
                <Inicio />
              </ProtectedRoute>
            }
          />

          {/* Ruta de tiendas */}
          <Route
            path="/ver-tienda"
            element={
              <ProtectedRoute allowedRoles={['logistica', 'vendedor']}>
                <VerTiendas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crear-tienda"
            element={
              <ProtectedRoute allowedRoles={['logistica']}>
                <CrearTienda />
              </ProtectedRoute>
            }
          />

          {/* Ruta de Dueños */}
          <Route
            path="/crear-dueño"
            element={
              <ProtectedRoute allowedRoles={['logistica']}>
                <CrearDueño />
              </ProtectedRoute>
            }
          />

          {/* Ruta de bodegas */}
          <Route
            path="/crear-bodega"
            element={
              <ProtectedRoute allowedRoles={['logistica']}>
                <CrearBodega />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ver-bodegas"
            element={
              <ProtectedRoute allowedRoles={['logistica', 'bodeguero', 'vendedor']}>
                <VerBodegas />
              </ProtectedRoute>
            }
          />

          {/* Ruta de racks */}
          <Route
            path="/crear-rack"
            element={
              <ProtectedRoute allowedRoles={['bodeguero', 'logistica']}>
                <CrearRack />
              </ProtectedRoute>
            }
          />
          <Route
            path="/QR-Crear"
            element={
              <ProtectedRoute allowedRoles={['bodeguero', 'logistica']}>
                <QrGene />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Ver-rack"
            element={
              <ProtectedRoute allowedRoles={['bodeguero', 'logistica', 'vendedor']}>
                <VerRack />
              </ProtectedRoute>
            }
          />

          {/* Ruta de Configuración */}
          <Route
            path="/config"
            element={
              <ProtectedRoute allowedRoles={['logistica', 'bodeguero', 'vendedor']}>
                <Config />
              </ProtectedRoute>
            }
          />

          {/* Ruta de productos */}
          <Route
            path="/Agregar-Producto"
            element={
              <ProtectedRoute allowedRoles={['bodeguero', 'logistica']}>
                <PostProd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ver-Producto"
            element={
              <ProtectedRoute allowedRoles={['bodeguero', 'vendedor', 'logistica']}>
                <GetProd />
              </ProtectedRoute>
            }
          />

          {/* Ruta de usuarios */}
          <Route
            path="/Crear-users"
            element={
              <ProtectedRoute allowedRoles={['logistica']}>
                <CrearUsuario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Ver-users"
            element={
              <ProtectedRoute allowedRoles={['logistica']}>
                <VerUsuario />
              </ProtectedRoute>
            }
          />

          {/* Ruta de acceso denegado */}
          <Route path="/access-denied" element={<AccessDenied />} />
        </Routes>
        {/* Añadir ToastContainer en la jerarquía */}
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
