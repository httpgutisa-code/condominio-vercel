import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Wrench } from 'lucide-react';
import { personalMantenimiento } from '../../services/api';

const PersonalMantenimiento = () => {
    const [personalList, setPersonalList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        nombre_completo: '',
        telefono: '',
        especialidad: '', // e.g. Electricista, Plomería
        activo: true
    });

    useEffect(() => {
        fetchPersonal();
    }, []);

    const fetchPersonal = async () => {
        try {
            setLoading(true);
            const response = await personalMantenimiento.getAll();
            setPersonalList(response.data);
        } catch (error) {
            console.error('Error fetching personal mantenimiento:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await personalMantenimiento.update(editingItem.id, formData);
            } else {
                await personalMantenimiento.create(formData);
            }
            fetchPersonal();
            handleCloseForm();
        } catch (error) {
            console.error('Error saving personal:', error);
            alert('Error al guardar personal técnico');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar este técnico?')) {
            try {
                await personalMantenimiento.delete(id);
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
            especialidad: item.especialidad,
            activo: item.activo
        });
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingItem(null);
        setFormData({ nombre_completo: '', telefono: '', especialidad: '', activo: true });
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando personal técnico...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    Nuevo Técnico
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalList.map((tecnico) => (
                    <div key={tecnico.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                                <Wrench size={24} />
                            </div>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${tecnico.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {tecnico.activo ? 'ACTIVO' : 'INACTIVO'}
                            </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{tecnico.nombre_completo}</h3>
                        <p className="text-sm text-gray-500">{tecnico.telefono}</p>
                        
                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                            <span className="text-sm font-medium text-orange-700 bg-orange-50 px-3 py-1 rounded-lg">
                                {tecnico.especialidad || 'General'}
                            </span>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(tecnico)} className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDelete(tecnico.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                        <h2 className="text-xl font-bold mb-4">{editingItem ? 'Editar Técnico' : 'Nuevo Técnico'}</h2>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                                <input required placeholder="Ej: Plomería, Electricidad..."
                                    value={formData.especialidad} 
                                    onChange={(e) => setFormData({...formData, especialidad: e.target.value})} 
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="activo_mant"
                                    checked={formData.activo} 
                                    onChange={(e) => setFormData({...formData, activo: e.target.checked})} 
                                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                                />
                                <label htmlFor="activo_mant" className="text-sm font-medium text-gray-700">Técnico Activo</label>
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

export default PersonalMantenimiento;
