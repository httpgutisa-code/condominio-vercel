import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Shield } from 'lucide-react';
import { seguridad } from '../../services/api';

const PersonalSeguridad = () => {
    const [personalList, setPersonalList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        nombre_completo: '',
        telefono: '',
        turno: 'mañana', // Default
        activo: true
    });

    useEffect(() => {
        fetchPersonal();
    }, []);

    const fetchPersonal = async () => {
        try {
            setLoading(true);
            const response = await seguridad.getAll();
            setPersonalList(response.data);
        } catch (error) {
            console.error('Error fetching personal:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await seguridad.update(editingItem.id, formData);
            } else {
                await seguridad.create(formData);
            }
            fetchPersonal();
            handleCloseForm();
        } catch (error) {
            console.error('Error saving personal:', error);
            alert('Error al guardar');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar este guardia?')) {
            try {
                await seguridad.delete(id);
                fetchPersonal();
            } catch (error) {
                console.error('Error deleting:', error);
            }
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            nombre_completo: item.nombre_completo,
            telefono: item.telefono,
            turno: item.turno,
            activo: item.activo
        });
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingItem(null);
        setFormData({ nombre_completo: '', telefono: '', turno: 'mañana', activo: true });
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando personal...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    Nuevo Guardia
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalList.map((guardia) => (
                    <div key={guardia.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <Shield size={24} />
                            </div>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${guardia.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {guardia.activo ? 'ACTIVO' : 'INACTIVO'}
                            </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{guardia.nombre_completo}</h3>
                        <p className="text-sm text-gray-500 mb-4">{guardia.telefono}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <span className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-lg capitalize">
                                Turno: {guardia.turno}
                            </span>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(guardia)} className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDelete(guardia.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4">{editingItem ? 'Editar Guardia' : 'Nuevo Guardia'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                <input required 
                                    value={formData.nombre_completo} 
                                    onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})} 
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <input required 
                                    value={formData.telefono} 
                                    onChange={(e) => setFormData({...formData, telefono: e.target.value})} 
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                                <select 
                                    value={formData.turno} 
                                    onChange={(e) => setFormData({...formData, turno: e.target.value})} 
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                >
                                    <option value="mañana">Mañana</option>
                                    <option value="tarde">Tarde</option>
                                    <option value="noche">Noche</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="activo"
                                    checked={formData.activo} 
                                    onChange={(e) => setFormData({...formData, activo: e.target.checked})} 
                                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                                />
                                <label htmlFor="activo" className="text-sm font-medium text-gray-700">Guardia Activo</label>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={handleCloseForm} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalSeguridad;
