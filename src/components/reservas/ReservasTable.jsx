import { useState, useEffect } from 'react';
import { Filter, Calendar as CalendarIcon, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { reservas, areasComunes } from '../../services/api';
import StatsCard from '../dashboard/StatsCard';

const ReservasTable = () => {
    const [reservasList, setReservasList] = useState([]);
    const [filteredReservas, setFilteredReservas] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterEstado, setFilterEstado] = useState('all');
    const [filterArea, setFilterArea] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterReservasData();
    }, [reservasList, filterEstado, filterArea]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [reservasRes, areasRes] = await Promise.all([
                reservas.getAll(),
                areasComunes.getAll(),
            ]);
            setReservasList(reservasRes.data.sort((a, b) => new Date(b.fecha_reserva) - new Date(a.fecha_reserva)));
            setAreas(areasRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterReservasData = () => {
        let filtered = [...reservasList];

        if (filterEstado !== 'all') {
            filtered = filtered.filter((r) => r.estado === filterEstado);
        }

        if (filterArea !== 'all') {
            filtered = filtered.filter((r) => r.area_comun === parseInt(filterArea));
        }

        setFilteredReservas(filtered);
    };

    const getEstadoColor = (estado) => {
        const colors = {
            pendiente: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            confirmada: 'bg-green-50 text-green-700 border-green-200',
            cancelada: 'bg-red-50 text-red-700 border-red-200',
            completada: 'bg-blue-50 text-blue-700 border-blue-200',
        };
        return colors[estado] || colors.pendiente;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (timeString) => {
        return timeString?.substring(0, 5) || 'N/A';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    const pendientes = reservasList.filter((r) => r.estado === 'pendiente').length;
    const confirmadas = reservasList.filter((r) => r.estado === 'confirmada').length;
    const completadas = reservasList.filter((r) => r.estado === 'completada').length;
    const canceladas = reservasList.filter((r) => r.estado === 'cancelada').length;

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard title="Pendientes" value={pendientes} icon={Clock} color="yellow" />
                <StatsCard title="Confirmadas" value={confirmadas} icon={CheckCircle} color="green" />
                <StatsCard title="Completadas" value={completadas} icon={CalendarIcon} color="blue" />
                <StatsCard
                    title="Canceladas"
                    value={canceladas}
                    icon={XCircle}
                    color="red"
                    variant={canceladas > 0 ? "alert" : undefined}
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
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmada">Confirmada</option>
                            <option value="completada">Completada</option>
                            <option value="cancelada">Cancelada</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <CalendarIcon size={20} className="text-gray-500" />
                        </div>
                        <select
                            value={filterArea}
                            onChange={(e) => setFilterArea(e.target.value)}
                            className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-gray-700 font-medium min-w-[200px]"
                        >
                            <option value="all">Todas las áreas</option>
                            {areas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.nombre}
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
                                    Área Común
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Residente
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Horario
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredReservas.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <CalendarIcon size={32} className="opacity-20" />
                                            <p className="font-medium">No se encontraron reservas</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredReservas.map((reserva) => (
                                    <tr key={reserva.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">
                                                {reserva.area_comun_detalle?.nombre || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                                    {reserva.residente_nombre ? reserva.residente_nombre.charAt(0) : 'U'}
                                                </div>
                                                <div className="text-sm font-medium text-gray-700">
                                                    {reserva.residente_nombre || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDate(reserva.fecha_reserva)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50/50 rounded-lg px-2 py-1 inline-block">
                                            {formatTime(reserva.hora_inicio)} - {formatTime(reserva.hora_fin)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-bold uppercase tracking-wider rounded-full border ${getEstadoColor(
                                                    reserva.estado
                                                )}`}
                                            >
                                                {reserva.estado.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReservasTable;
