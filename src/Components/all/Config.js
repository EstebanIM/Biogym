import React, { useState } from 'react';
import DashboardSidebar from "../menu/DashboardSidebar";
import DashboardHeader from "../menu/DashboardHeader";
import { useAuth } from '../../Context/Authcontext';
import { Button } from "../ui/button";
import { Input } from "../ui/Input";
import { auth } from '../../libs/firebase';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Config() {
    const { userData, currentUser } = useAuth(); // Acceso a los datos del usuario autenticado
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    // Alternar visibilidad de la contraseña
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    // Estados para editar la configuración del usuario
    const [name, setName] = useState(userData?.name || '');
    const [email, setEmail] = useState(userData?.email || '');
    const [loading, setLoading] = useState(false);

    // Estados para cambiar la contraseña
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false); // Estado para mostrar/ocultar la contraseña

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleSaveChanges = async () => {
        setLoading(true);
        console.log("Guardando cambios:", { name, email });
        setLoading(false);
        toast.success("Información de cuenta actualizada exitosamente.");
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            toast.error("Las contraseñas nuevas no coinciden.");
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(
                currentUser.email,
                currentPassword
            );
            await reauthenticateWithCredential(currentUser, credential);

            await updatePassword(currentUser, newPassword);
            toast.success("Contraseña actualizada exitosamente.");

            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            if (error.code === 'auth/wrong-password') {
                toast.error("La contraseña actual es incorrecta.");
            } else {
                toast.error("Error al cambiar la contraseña. Inténtalo de nuevo.");
            }
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col">
                <DashboardHeader toggleSidebar={toggleSidebar} />

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Información de usuario */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Configuración de Cuenta</h1>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Nombre
                                    </label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Nombre del usuario"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Correo Electrónico
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        readOnly
                                        placeholder="Correo electrónico"
                                        className="mt-1 bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                        Rol
                                    </label>
                                    <Input
                                        id="role"
                                        type="text"
                                        value={userData?.role || 'No disponible'}
                                        readOnly
                                        className="mt-1 bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="store" className="block text-sm font-medium text-gray-700">
                                        Tienda Asociada
                                    </label>
                                    <Input
                                        id="store"
                                        type="text"
                                        value={userData?.store || 'No disponible'}
                                        readOnly
                                        className="mt-1 bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                {/* Botón para Guardar Cambios */}
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleSaveChanges}
                                        disabled={loading}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                    >
                                        {loading ? "Guardando..." : "Guardar Cambios"}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Cambiar contraseña */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h1 className="text-xl font-semibold text-gray-800 mb-6">Cambiar Contraseña</h1>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div className="relative">
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                        Contraseña Actual
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Contraseña actual"
                                            required
                                            className="mt-1 pr-10" // Espacio para el icono a la derecha
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                                            aria-label="Toggle password visibility"
                                        >
                                            {showCurrentPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="relative">
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                        Nueva Contraseña
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Nueva contraseña"
                                            required
                                            className="mt-1 pr-10" // Espacio para el icono a la derecha
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                                            aria-label="Toggle password visibility"
                                        >
                                            {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="relative">
                                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                                        Confirmar Nueva Contraseña
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="confirmNewPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            placeholder="Confirmar nueva contraseña"
                                            required
                                            className="mt-1 pr-10" // Espacio para el icono a la derecha
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                                            aria-label="Toggle password visibility"
                                        >
                                            {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                    >
                                        Cambiar Contraseña
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <ToastContainer />
                </main>
            </div>
        </div>
    );
}
