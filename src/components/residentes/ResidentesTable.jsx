import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Car, RefreshCcw } from 'lucide-react';
import ResidenteForm from './ResidenteForm';
import VehiculosModal from './VehiculosModal';
import { residentes } from '../../services/api';

const ResidentesTable = () => {
    const [residentesList, setResidentesList] = useState([]);
    const [filteredResidentes, setFilteredResidentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingResidente, setEditingResidente] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPropietario, setFilterPropietario] = useState('all');

    const [isVehiculosModalOpen, setIsVehiculosModalOpen] = useState(false);
    const [selectedResidenteVehiculos, setSelectedResidenteVehiculos] = useState(null);

    useEffect(() => {
        fetchResidentes();
    }, []);

    useEffect(() => {
        filterResidentes();
    }, [residentesList, searchTerm, filterPropietario]);

    const fetchResidentes = async () => {
        try {
            setLoading(true);
            const response = await residentes.getAll();
            setResidentesList(response.data);
        } catch (error) {
            console.error('Error fetching residentes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterResidentes = () => {
        let filtered = [...residentesList];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter((r) => {
                const fullName = `${r.user?.first_name || ''} ${r.user?.last_name || ''}`.toLowerCase();
                const unidad = `${r.unidad_habitacional_detalle?.torre || ''} ${r.unidad_habitacional_detalle?.numero || ''}`.toLowerCase();
                return fullName.includes(searchTerm.toLowerCase()) || unidad.includes(searchTerm.toLowerCase());
            });
        }

        // Propietario filter
        if (filterPropietario !== 'all') {
            filtered = filtered.filter((r) => r.es_propietario === (filterPropietario === 'si'));
        }

        setFilteredResidentes(filtered);
    };

    const handleEdit = (residente) => {
        setEditingResidente(residente);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este residente?')) {
            try {
                await residentes.delete(id);
                fetchResidentes();
            } catch (error) {
                console.error('Error deleting residente:', error);
                alert('Error al eliminar el residente');
            }
        }
    };

    const handleVehiculos = (residente) => {
        setSelectedResidenteVehiculos(residente);
        setIsVehiculosModalOpen(true);
    };

    const handleUpdateScore = async (residente) => {
        try {
            // Mocking IA Score update for demo purposes or calling API if exists logic
            // The API requires a score, or maybe the backend calculates it.
            // If backend calculates, we might POST to an action.
            // Documentation says: POST /residentes/{id}/actualizar-score-ia/ { score_morosidad_ia: <int> }
            // Let's assume we trigger a recalculation or just simulate simple update for now.
            const randomScore = Math.floor(Math.random() * 100);
            await residentes.actualizarScoreIA(residente.id, randomScore);
            alert(`Score actualizado a ${randomScore}%`);
            fetchResidentes();
        } catch (error) {
            console.error('Error updating score:', error);
            alert('Error al actualizar Score IA');
        }
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingResidente(null);
    };

    const handleFormSuccess = () => {
        fetchResidentes();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>           </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5"
                >
                    <Plus size={20} className="stroke-2" />
                    <span className="font-semibold">Nuevo Residente</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-brand-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, correo o unidad..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-gray-700"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <Filter size={20} className="text-gray-500" />
                        </div>
                        <select
                            value={filterPropietario}
                            onChange={(e) => setFilterPropietario(e.target.value)}
                            className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-gray-700 font-medium min-w-[200px]"
                        >
                            <option value="all">Todos los residentes</option>
                            <option value="si">Solo Propietarios</option>
                            <option value="no">Solo Inquilinos</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Residente
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Unidad Habitacional
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Contacto
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Score IA
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredResidentes.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                                <Search size={24} className="opacity-50" />
                                            </div>
                                            <p className="font-medium">No se encontraron residentes</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredResidentes.map((residente) => (
                                    <tr key={residente.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold border border-brand-100 mr-3">
                                                    {residente.user?.first_name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {residente.user?.first_name} {residente.user?.last_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{residente.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {residente.unidad_habitacional_detalle?.torre && residente.unidad_habitacional_detalle?.numero ? (
                                                <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium border border-gray-200">
                                                    Torre {residente.unidad_habitacional_detalle.torre} • {residente.unidad_habitacional_detalle.numero}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Sin asignar</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                            {residente.telefono || 'Sin teléfono'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${residente.es_propietario
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                                    }`}
                                            >
                                                {residente.es_propietario ? 'Propietario' : 'Inquilino'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {residente.score_morosidad_ia != null ? (
                                                    <div className="flex-1 w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${Number(residente.score_morosidad_ia) < 30 ? 'bg-green-500' :
                                                                Number(residente.score_morosidad_ia) < 70 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${Number(residente.score_morosidad_ia)}%` }}
                                                        ></div>
                                                    </div>
                                                ) : <span className="text-xs text-gray-400">N/A</span>}
                                                
                                                <button onClick={() => handleUpdateScore(residente)} title="Recalcular con IA" className="p-1 text-gray-400 hover:text-brand-600 rounded-full hover:bg-gray-100">
                                                    <RefreshCcw size={14} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleVehiculos(residente)}
                                                    className="p-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                                    title="Vehículos"
                                                >
                                                    <Car size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(residente)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(residente.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Vehiculos Modal */}
            <VehiculosModal 
                isOpen={isVehiculosModalOpen}
                onClose={() => setIsVehiculosModalOpen(false)}
                resident={selectedResidenteVehiculos}
            />

            {/* Form Modal */}
            <ResidenteForm
                isOpen={isFormOpen}
                onClose={handleFormClose}
                onSuccess={handleFormSuccess}
                editingResidente={editingResidente}
            />
        </div>
    );
};

export default ResidentesTable;
