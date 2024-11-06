import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../../libs/firebase';
import DashboardHeader from "../../menu/DashboardHeader";
import DashboardSidebar from "../../menu/DashboardSidebar";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/button";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function AdminCreateUser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [store, setStore] = useState('');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tiendas"));
        const storesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          nombreTienda: doc.data().nombreTienda,
        }));
        setStores(storesList);
      } catch (error) {
        console.error("Error fetching stores:", error);
        toast.error('Error al obtener las tiendas');
      }
    };

    fetchStores();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      toast.success(`Email de verificación enviado a ${email}`);

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: name,
        role: role,
        store: store,
        createdAt: new Date(),
      });

      toast.success(`Usuario creado con éxito. Nombre: ${name}, Rol: ${role}, Tienda: ${store}`);

      setEmail('');
      setPassword('');
      setRole('');
      setName('');
      setStore('');
    } catch (error) {
      console.error('Error creando usuario:', error);
      toast.error('Error creando usuario: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Crear Nuevo Usuario</h1>

            <form onSubmit={handleCreateUser}>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700">Nombre del usuario</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ingresa el nombre completo"
                  required
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700">Email del usuario</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa el email"
                  required
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña"
                  required
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700">Rol del usuario</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full bg-white"
                  required
                >
                  <option value="">Seleccionar un rol</option>
                  <option value="logistica">Logística</option>
                  <option value="bodeguero">Bodeguero</option>
                  <option value="vendedor">Vendedor</option>
                </select>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700">Tienda Asociada</label>
                <select
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full bg-white"
                  required
                >
                  <option value="">Seleccionar una tienda</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.nombreTienda}
                    </option>
                  ))}
                </select>
              </div>

              <Button 
                type="submit" 
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold p-3 rounded-lg w-full"
                disabled={loading}
              >
                {loading ? 'Creando Usuario...' : 'Crear Usuario'}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
