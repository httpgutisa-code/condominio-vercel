import { useState, useEffect } from 'react';
import { Search, Plus, Calendar, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { visitas } from '../../services/api';

const BitacoraVisitas = () => {
    const [visitaList, setVisitaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // Form States
    const [formData, setFormData] = useState({
        visitante_nombre: '',
        visitante_documento: '',
        residente: '', // ID
        motivo: '',
        vehiculo_placa: '',
        acompanantes: 0
    });

    useEffect(() => {
        fetchVisitas();
    }, []);

    const fetchVisitas = async () => {
        try {
            setLoading(true);
            const response = await visitas.getAll();
            // Sort by entry time descending
            const sorted = response.data.sort((a, b) => new Date(b.fecha_ingreso) - new Date(a.fecha_ingreso));
            setVisitaList(sorted);
        } catch (error) {
            console.error('Error fetching visitas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await visitas.create(formData);
            fetchVisitas();
            setIsFormOpen(false);
            setFormData({
                visitante_nombre: '',
                visitante_documento: '',
                residente: '',
                motivo: '',
                vehiculo_placa: '',
                acompanantes: 0
            });
        } catch (error) {
            console.error('Error registering visit:', error);
            alert('Error al registrar la visita');
        }
    };

    const handleSalida = async (id) => {
        if (window.confirm('¿Registrar salida de esta visita?')) {
            try {
                // Assuming the API handles setting the exit time automatically or we send it
                // If API expects a specific payload for update, we might need to adjust.
                // Assuming standard update or specific action. Let's try standard update with current time.
                // Or maybe just updating the record. 
                // Based on standard CRUD, we might PUT/PATCH.
                await visitas.update(id, { ...visitaList.find(v => v.id === id), fecha_salida: new Date().toISOString() });
                fetchVisitas();
            } catch (error) {
                console.error('Error registering exit:', error);
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-ES', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const filteredVisitas = visitaList.filter(v => 
        (v.visitante_nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.visitante_documento || '').includes(searchTerm)
    );

    if (loading) return <div className="p-8 text-center">Cargando bitácora...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o documento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                >
                    <Plus size={20} />
                    Registrar Visita
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Visitante</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Motivo / Destino</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ingreso</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Salida</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredVisitas.map((visita) => (
                            <tr key={visita.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                            <User size={16} className="text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{visita.visitante_nombre}</p>
                                            <p className="text-xs text-gray-500">CI: {visita.visitante_documento}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-gray-900">{visita.motivo}</p>
                                    <p className="text-xs text-gray-500">
                                        {visita.vehiculo_placa ? `Placa: ${visita.vehiculo_placa}` : 'A pie'}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {formatDate(visita.fecha_ingreso)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {visita.fecha_salida ? formatDate(visita.fecha_salida) : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        visita.fecha_salida 
                                        ? 'bg-gray-100 text-gray-600' 
                                        : 'bg-green-100 text-green-700'
                                    }`}>
                                        {visita.fecha_salida ? 'Finalizada' : 'En Curso'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {!visita.fecha_salida && (
                                        <button 
                                            onClick={() => handleSalida(visita.id)}
                                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                                        >
                                            Registrar Salida
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4">Nueva Visita</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Visitante</label>
                                <input required name="visitante_nombre" value={formData.visitante_nombre} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Documento ID</label>
                                <input required name="visitante_documento" value={formData.visitante_documento} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                                <input required name="motivo" value={formData.motivo} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Placa Vehículo</label>
                                    <input name="vehiculo_placa" value={formData.vehiculo_placa} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="Opcional" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Acompañantes</label>
                                    <input type="number" name="acompanantes" value={formData.acompanantes} onChange={handleInputChange} className="w-full p-2 border rounded-lg" min="0" />
                                </div>
                            </div>
                            {/* Note: Residente ID selection is simplified. Ideally a dropdown with autocomplete. 
                                For now input ID manually or implement a simple selector if resident list was passed.
                                Sticking to simple input for MVP or could assume we pass residents prop.
                            */}
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ID Residente (Opcional)</label>
                                <input type="number" name="residente" value={formData.residente} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Registrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BitacoraVisitas;
