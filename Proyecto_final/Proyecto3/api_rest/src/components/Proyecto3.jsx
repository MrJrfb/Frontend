import React, { useState, useEffect } from 'react';

// URL de la API de prueba (recurso "users")
const API_URL = 'https://jsonplaceholder.typicode.com/users';

export default function App() {
  // Estados principales
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados del Formulario (para Crear y Editar)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Estados para feedbacks visuales temporales (Toasts)
  const [toastMessage, setToastMessage] = useState(null);

  // 1. READ: Obtener usuarios al cargar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('No se pudo conectar con el servidor.');
      const data = await response.json();
      
      // Simplificamos la estructura para que coincida con nuestro formulario
      const formattedUsers = data.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        company: u.company?.name || u.company || 'Ninguna'
      }));
      setUsers(formattedUsers);
    } catch (err) {
      setError(err.message || 'Error al cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. CREATE & UPDATE: Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Por favor, completa los campos requeridos (Nombre y Email).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        // --- Operación UPDATE (PUT) ---
        const response = await fetch(`${API_URL}/${currentUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Error al actualizar el usuario.');
        const updatedData = await response.json();

        // JSONPlaceholder no persiste los cambios en su base de datos real, 
        // así que actualizamos el estado local simulando el éxito de la API.
        setUsers(users.map(user => user.id === currentUserId ? { ...formData, id: currentUserId } : user));
        showToast('¡Usuario actualizado con éxito! (Simulado)');
        resetForm();
      } else {
        // --- Operación CREATE (POST) ---
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Error al crear el usuario.');
        const newUser = await response.json();

        // Generamos un ID local único ya que la API siempre devuelve id: 11
        const idLocal = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        setUsers([{ ...formData, id: idLocal }, ...users]);
        showToast('¡Usuario agregado con éxito! (Simulado)');
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Preparar formulario para edición
  const handleEditClick = (user) => {
    setIsEditing(true);
    setCurrentUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      company: user.company
    });
    // Desplazar la pantalla suavemente hacia el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. DELETE: Eliminar registro con confirmación nativa
  const handleDeleteClick = async (id, name) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar a "${name}"?`);
    if (!confirmDelete) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error al eliminar el usuario del servidor.');

      // Filtramos el estado local
      setUsers(users.filter(user => user.id !== id));
      showToast('Usuario eliminado con éxito (Simulado).');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', company: '' });
    setIsEditing(false);
    setCurrentUserId(null);
  };

  return (
    <div class="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-8">
      <div class="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header class="mb-8 text-center sm:text-left border-b border-slate-800 pb-6">
          <h1 class="text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            React CRUD Dashboard
          </h1>
          <p class="text-sm text-slate-400 mt-1">Gestión de usuarios interactiva utilizando API REST externa y Tailwind CSS.</p>
        </header>

        {/* NOTIFICACIÓN TOAST FLOTANTE */}
        {toastMessage && (
          <div class="fixed bottom-5 right-5 bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-2xl z-50 animate-bounce">
            {toastMessage}
          </div>
        )}

        {/* FEEDBACK DE ERROR */}
        {error && (
          <div class="mb-6 p-4 bg-red-950/40 border border-red-500/50 rounded-xl flex justify-between items-center text-red-200">
            <div class="flex items-center space-x-2">
              <span class="font-bold">⚠️ Error:</span>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} class="text-red-400 hover:text-white font-bold text-sm">
              Descartar
            </button>
          </div>
        )}

        {/* GRID PRINCIPAL: FORMULARIO + TABLA */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* SECCIÓN 1: FORMULARIO (Crear / Editar) */}
          <section class="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl lg:sticky lg:top-8">
            <h2 class="text-xl font-bold text-white mb-4 flex items-center">
              <span class={`h-3 w-3 rounded-full mr-2 ${isEditing ? 'bg-amber-400' : 'bg-indigo-400'}`}></span>
              {isEditing ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
            </h2>
            
            <form onSubmit={handleSubmit} class="space-y-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Nombre Completo *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej. Juan Pérez" 
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-600"
                  required
                />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Correo Electrónico *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="juan@email.com" 
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-600"
                  required
                />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Teléfono</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Ej. +595 981 123456" 
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-600"
                />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Compañía / Organización</label>
                <input 
                  type="text" 
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Ej. Acme Corp" 
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-600"
                />
              </div>

              <div class="pt-2 flex gap-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  class={`flex-1 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                    isEditing 
                      ? 'bg-amber-500 hover:bg-amber-400 focus:ring-amber-500' 
                      : 'bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-500'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isEditing ? 'Guardar Cambios' : 'Registrar Usuario'}
                </button>
                
                {isEditing && (
                  <button 
                    type="button" 
                    onClick={resetForm}
                    class="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-lg text-sm transition-all"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* SECCIÓN 2: TABLA / LISTADO (Read) */}
          <section class="lg:col-span-2">
            <div class="bg-slate-800 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
              
              {/* Encabezado del listado */}
              <div class="p-6 border-b border-slate-700/80 flex justify-between items-center bg-slate-850">
                <h3 class="text-lg font-bold text-white flex items-center">
                  Directorio de Usuarios 
                  <span class="ml-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                    {users.length}
                  </span>
                </h3>
                <button 
                  onClick={fetchUsers} 
                  disabled={loading}
                  class="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  🔄 Sincronizar
                </button>
              </div>

              {/* ESTADO DE CARGA (LOADING SPINNER) */}
              {loading && (
                <div class="py-20 flex flex-col items-center justify-center space-y-3">
                  <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-400"></div>
                  <p class="text-sm text-slate-400">Procesando solicitud de datos...</p>
                </div>
              )}

              {/* LISTADO VACÍO */}
              {!loading && users.length === 0 && (
                <div class="py-16 text-center">
                  <span class="text-4xl">👥</span>
                  <p class="text-slate-400 font-medium mt-3">No hay usuarios registrados en el sistema.</p>
                  <p class="text-slate-500 text-xs mt-1">Usa el formulario de la izquierda para dar de alta uno nuevo.</p>
                </div>
              )}

              {/* TABLA DE CONTENIDO */}
              {!loading && users.length > 0 && (
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-slate-700/60">
                    <thead class="bg-slate-900/30">
                      <tr>
                        <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Usuario</th>
                        <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Contacto</th>
                        <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Compañía</th>
                        <th scope="col" class="px-6 py-4 class text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-700/60">
                      {users.map((user) => (
                        <tr key={user.id} class="hover:bg-slate-750 transition-colors group">
                          {/* Usuario (Nombre + ID) */}
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center space-x-3">
                              <div class="h-9 w-9 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-sm border border-slate-600">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div class="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                                  {user.name}
                                </div>
                                <div class="text-xs text-slate-500">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>

                          {/* Contacto (Email + Phone) */}
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-slate-300">{user.email}</div>
                            <div class="text-xs text-slate-500">{user.phone || 'S/N Teléfono'}</div>
                          </td>

                          {/* Compañía */}
                          <td class="px-6 py-4 whitespace-nowrap">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-700 text-slate-300 border border-slate-600/50">
                              {user.company}
                            </span>
                          </td>

                          {/* Acciones */}
                          <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div class="flex justify-center space-x-2">
                              {/* Botón Editar */}
                              <button 
                                onClick={() => handleEditClick(user)}
                                class="p-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white rounded-lg border border-amber-500/20 transition-all"
                                title="Editar registro"
                              >
                                ✏️
                              </button>
                              
                              {/* Botón Eliminar */}
                              <button 
                                onClick={() => handleDeleteClick(user.id, user.name)}
                                class="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg border border-red-500/20 transition-all"
                                title="Eliminar registro"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

