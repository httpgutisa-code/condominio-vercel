import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Eye, Filter, X } from 'lucide-react';
import { alertasSeguridad } from '../../services/api';

const AlertasPanel = () => {
    const [alertas, setAlertas] = useState([]);
    const [filteredAlertas, setFilteredAlertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterTipo, setFilterTipo] = useState('all');
    const [filterEstado, setFilterEstado] = useState('all');
    const [selectedAlert, setSelectedAlert] = useState(null);

    useEffect(() => {
        fetchAlertas();
    }, []);

    useEffect(() => {
        filterAlertas();
    }, [alertas, filterTipo, filterEstado]);

    const fetchAlertas = async () => {
        try {
            setLoading(true);
            const response = await alertasSeguridad.getAll();
            setAlertas(response.data.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora)));
        } catch (error) {
            console.error('Error fetching alertas:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAlertas = () => {
        let filtered = [...alertas];

        if (filterTipo !== 'all') {
            filtered = filtered.filter((a) => a.tipo_alerta === filterTipo);
        }

        if (filterEstado === 'resuelto') {
            filtered = filtered.filter((a) => a.resuelto);
        } else if (filterEstado === 'pendiente') {
            filtered = filtered.filter((a) => !a.resuelto);
        }

        setFilteredAlertas(filtered);
    };

    const handleMarcarResuelto = async (id, currentStatus) => {
        try {
            await alertasSeguridad.patch(id, { resuelto: !currentStatus });
            fetchAlertas();
        } catch (error) {
            console.error('Error updating alerta:', error);
            alert('Error al actualizar la alerta');
        }
    };

    const getAlertTypeColor = (tipo) => {
        const colors = {
            intruso: 'bg-red-50 text-red-700 border-red-200',
            perro_suelto: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            vehiculo_sospechoso: 'bg-orange-50 text-orange-700 border-orange-200',
            actividad_inusual: 'bg-purple-50 text-purple-700 border-purple-200',
            otro: 'bg-gray-50 text-gray-700 border-gray-200',
        };
        return colors[tipo] || colors.otro;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <Filter size={20} className="text-gray-500" />
                        </div>
                        <select
                            value={filterTipo}
                            onChange={(e) => setFilterTipo(e.target.value)}
                            className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-gray-700 font-medium min-w-[200px]"
                        >
                            <option value="all">Todos los tipos</option>
                            <option value="intruso">Intruso</option>
                            <option value="perro_suelto">Perro Suelto</option>
                            <option value="vehiculo_sospechoso">Vehículo Sospechoso</option>
                            <option value="actividad_inusual">Actividad Inusual</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-gray-700 font-medium min-w-[200px]"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="pendiente">Pendientes</option>
                            <option value="resuelto">Resueltos</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Alerts Grid */}
            <div className="grid grid-cols-1 gap-4">
                {filteredAlertas.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                        No se encontraron alertas
                    </div>
                ) : (
                    filteredAlertas.map((alerta) => (
                        <div
                            key={alerta.id}
                            className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 group relative overflow-hidden`}
                        >
                            {/* Status Indicator Line */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${alerta.resuelto ? 'bg-green-500' : 'bg-red-500'}`}></div>

                            <div className="flex items-start justify-between pl-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold border ${getAlertTypeColor(
                                                alerta.tipo_alerta
                                            )}`}
                                        >
                                            {alerta.tipo_alerta.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <span className={`flex items-center gap-1 text-sm font-medium ${alerta.resuelto ? 'text-green-600' : 'text-red-600'}`}>
                                            {alerta.resuelto ? (
                                                <>
                                                    <CheckCircle size={16} strokeWidth={2.5} />
                                                    Resuelto
                                                </>
                                            ) : (
                                                <>
                                                    <Clock size={16} strokeWidth={2.5} />
                                                    Pendiente
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    <p className="text-gray-800 font-medium mb-2 text-lg">{alerta.descripcion}</p>

                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p className="flex items-center gap-2">
                                            <Clock size={14} />
                                            {formatDate(alerta.fecha_hora)}
                                        </p>
                                        {alerta.url_evidencia && (
                                            <p className="flex items-center gap-2">
                                                <Eye size={14} />
                                                <a
                                                    href={alerta.url_evidencia}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-brand-600 hover:text-brand-700 hover:underline font-medium"
                                                >
                                                    Ver evidencia
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pl-4">
                                    <button
                                        onClick={() => setSelectedAlert(alerta)}
                                        className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"
                                        title="Ver detalles"
                                    >
                                        <Eye size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleMarcarResuelto(alerta.id, alerta.resuelto)}
                                        className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${alerta.resuelto
                                            ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'
                                            : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                            }`}
                                    >
                                        {alerta.resuelto ? 'Reabrir' : 'Resolver'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Details Modal */}
            {selectedAlert && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden scale-100 transition-transform">
                        <div className="border-b border-gray-100 px-8 py-6 flex items-center justify-between bg-gray-50/50">
                            <h2 className="text-2xl font-bold text-gray-900">Detalles de Alerta</h2>
                            <button onClick={() => setSelectedAlert(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Tipo</label>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold border ${getAlertTypeColor(selectedAlert.tipo_alerta)}`}>
                                        {selectedAlert.tipo_alerta.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Estado</label>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${selectedAlert.resuelto ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {selectedAlert.resuelto ? (
                                            <>
                                                <CheckCircle size={14} /> Resuelto
                                            </>
                                        ) : (
                                            <>
                                                <Clock size={14} /> Pendiente
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Descripción</label>
                                <p className="text-lg text-gray-800 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed">
                                    {selectedAlert.descripcion}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Fecha y Hora</label>
                                <p className="text-gray-700 flex items-center gap-2 font-medium">
                                    <Clock size={18} className="text-gray-400" />
                                    {formatDate(selectedAlert.fecha_hora)}
                                </p>
                            </div>

                            {selectedAlert.url_evidencia && (
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Evidencia</label>
                                    <a
                                        href={selectedAlert.url_evidencia}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-brand-300 hover:bg-brand-50/30 transition-all group"
                                    >
                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white text-gray-600 group-hover:text-brand-600 transition-colors">
                                            <Eye size={24} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 group-hover:text-brand-700">Ver Archivo Adjunto</p>
                                            <p className="text-sm text-gray-500">{selectedAlert.url_evidencia}</p>
                                        </div>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlertasPanel;
