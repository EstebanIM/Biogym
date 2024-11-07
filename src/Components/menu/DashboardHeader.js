import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate para redireccionar
import { Button } from "../ui/button";
import { Bell, Menu, User, Settings, LogOut } from "lucide-react";
import { useAuth } from '../../Context/Authcontext';

export default function DashboardHeader({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout, userData } = useAuth(); // Obtener userData para acceder al nombre del usuario
  const navigate = useNavigate(); // Inicializar useNavigate para redireccionar

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const goToConfig = () => {
    navigate("/config"); // Redirigir a la página de configuración
  };

  return (
    <header className="bg-white shadow-md z-10">
      <div className="max-w-7xl mx-auto py-3 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggleSidebar}>
            <Menu className="h-5 w-5 text-gray-600" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">BioGymStore</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            {/* Indicador de notificación (opcional) */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Dropdown de usuario */}
          <div className="relative">
            <Button variant="ghost" size="icon" onClick={toggleDropdown}>
              <User className="h-5 w-5 text-gray-600" />
            </Button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-20">
                {/* Mostrar el nombre del usuario */}
                <div className="px-4 py-2 text-sm font-medium text-gray-800">
                  {userData?.name || "Mi Cuenta"}
                </div>
                <div className="border-t border-gray-200"></div>
                <div
                  className="px-4 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-gray-100"
                  onClick={goToConfig} // Redirigir a configuración al hacer clic
                >
                  <Settings className="mr-2 h-4 w-4 text-gray-600" /> Configuración
                </div>
                <div
                  className="px-4 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4 text-gray-600" /> Cerrar Sesión
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
