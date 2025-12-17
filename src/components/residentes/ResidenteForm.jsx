import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { residentes, unidadesHabitacionales } from '../../services/api';

const ResidenteForm = ({ isOpen, onClose, onSuccess, editingResidente = null }) => {
    const [formData, setFormData] = useState({
        user: {
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            password: 'defaultpass123',
        },
        unidad_habitacional: '',
        telefono: '',
        es_propietario: false,
    });
    const [unidades, setUnidades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchUnidades();
            if (editingResidente) {
                setFormData({
                    user: {
                        username: editingResidente.user?.username || '',
                        email: editingResidente.user?.email || '',
                        first_name: editingResidente.user?.first_name || '',
                        last_name: editingResidente.user?.last_name || '',
                    },
                    unidad_habitacional: editingResidente.unidad_habitacional?.id || '',
                    telefono: editingResidente.telefono || '',
                    es_propietario: editingResidente.es_propietario || false,
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, editingResidente]);

    const fetchUnidades = async () => {
        try {
            const response = await unidadesHabitacionales.getAll();
            setUnidades(response.data);
        } catch (error) {
            console.error('Error fetching unidades:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            user: {
                username: '',
                email: '',
                first_name: '',
                last_name: '',
                password: 'defaultpass123',
            },
            unidad_habitacional: '',
            telefono: '',
            es_propietario: false,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (editingResidente) {
                await residentes.update(editingResidente.id, formData);
            } else {
                await residentes.create(formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving residente:', error);
            setError(error.response?.data?.message || 'Error al guardar el residente');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingResidente ? 'Editar Residente' : 'Nuevo Residente'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {/* User Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Información del Usuario</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.user.first_name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            user: { ...formData.user, first_name: e.target.value },
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.user.last_name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            user: { ...formData.user, last_name: e.target.value },
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.user.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            user: { ...formData.user, email: e.target.value },
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.user.username}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            user: { ...formData.user, username: e.target.value },
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Resident Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Información de Residencia</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Unidad Habitacional
                                </label>
                                <select
                                    required
                                    value={formData.unidad_habitacional}
                                    onChange={(e) =>
                                        setFormData({ ...formData, unidad_habitacional: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccionar unidad...</option>
                                    {unidades.map((unidad) => (
                                        <option key={unidad.id} value={unidad.id}>
                                            Torre {unidad.torre} - Unidad {unidad.numero}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.es_propietario}
                                    onChange={(e) =>
                                        setFormData({ ...formData, es_propietario: e.target.checked })
                                    }
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Es propietario</span>
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Guardando...' : editingResidente ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResidenteForm;
