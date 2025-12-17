import { useState, useEffect } from 'react';
import { Filter, DollarSign, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import PagosModal from './PagosModal';
import { cuotas } from '../../services/api';
import StatsCard from '../dashboard/StatsCard';

const CuotasTable = () => {
    const [cuotasList, setCuotasList] = useState([]);
    const [filteredCuotas, setFilteredCuotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterEstado, setFilterEstado] = useState('all');
    const [filterMes, setFilterMes] = useState('all');
    const [selectedCuota, setSelectedCuota] = useState(null);
    const [isPagosModalOpen, setIsPagosModalOpen] = useState(false);

    useEffect(() => {
        fetchCuotas();
    }, []);

    useEffect(() => {
        filterCuotasData();
    }, [cuotasList, filterEstado, filterMes]);

    const fetchCuotas = async () => {
        try {
            setLoading(true);
            const response = await cuotas.getAll();
            setCuotasList(response.data);
        } catch (error) {
            console.error('Error fetching cuotas:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterCuotasData = () => {
        let filtered = [...cuotasList];

        if (filterEstado !== 'all') {
            filtered = filtered.filter((c) => c.estado === filterEstado);
        }

        if (filterMes !== 'all') {
            filtered = filtered.filter((c) => c.mes === filterMes);
        }

        setFilteredCuotas(filtered);
    };

    const handleRowClick = (cuota) => {
        setSelectedCuota(cuota);
        setIsPagosModalOpen(true);
    };

    const handleModalClose = () => {
        setIsPagosModalOpen(false);
        setSelectedCuota(null);
        fetchCuotas(); // Refresh to get updated status
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getEstadoBadge = (estado) => {
        const badges = {
            pagada: 'bg-green-100 text-green-800',
            pendiente: 'bg-yellow-100 text-yellow-800',
            vencida: 'bg-red-100 text-red-800',
        };
        return badges[estado] || badges.pendiente;
    };

    const getRowColor = (estado) => {
        if (estado === 'vencida') return 'bg-red-50/30';
        if (estado === 'pagada') return 'bg-green-50/30';
        return '';
    };

    // Get unique months for filter
    const uniqueMonths = [...new Set(cuotasList.map((c) => c.mes))].sort();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    const pagadas = cuotasList.filter((c) => c.estado === 'pagada').length;
    const pendientes = cuotasList.filter((c) => c.estado === 'pendiente').length;
    const vencidas = cuotasList.filter((c) => c.estado === 'vencida').length;

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Cuotas Pagadas"
                    value={pagadas}
                    icon={CheckCircle}
                    color="green"
                />
                <StatsCard
                    title="Cuotas Pendientes"
                    value={pendientes}
                    icon={Clock}
                    color="yellow"
                />
                <StatsCard
                    title="Cuotas Vencidas"
                    value={vencidas}
                    icon={AlertTriangle}
                    color="red"
                    variant={vencidas > 0 ? "alert" : undefined}
                />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <Filter size={20} className="text-gray-500" />
                        </div>
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-gray-700 font-medium min-w-[200px]"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="pendiente">Pendientes</option>
                            <option value="pagada">Pagadas</option>
                            <option value="vencida">Vencidas</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <DollarSign size={20} className="text-gray-500" />
                        </div>
                        <select
                            value={filterMes}
                            onChange={(e) => setFilterMes(e.target.value)}
                            className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-gray-700 font-medium min-w-[200px]"
                        >
                            <option value="all">Todos los meses</option>
                            {uniqueMonths.map((mes) => (
                                <option key={mes} value={mes}>
                                    {mes}
                                </option>
                            ))}
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
                                    Mes
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Monto
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Fecha Vencimiento
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCuotas.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                        <p className="font-medium">No se encontraron cuotas</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredCuotas.map((cuota) => (
                                    <tr key={cuota.id} className={`hover:bg-gray-50/80 transition-colors ${getRowColor(cuota.estado)}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {cuota.residente_nombre || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {cuota.mes}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            {formatCurrency(cuota.monto)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDate(cuota.fecha_vencimiento)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getEstadoBadge(
                                                    cuota.estado
                                                )}`}
                                            >
                                                {cuota.estado.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => handleRowClick(cuota)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium shadow-sm hover:shadow"
                                            >
                                                <DollarSign size={16} className="text-green-600" />
                                                Ver Pagos
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagos Modal */}
            <PagosModal
                isOpen={isPagosModalOpen}
                onClose={handleModalClose}
                cuota={selectedCuota}
            />
        </div>
    );
};

export default CuotasTable;
