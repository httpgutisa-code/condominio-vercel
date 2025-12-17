import { useState, useEffect } from 'react';
import { Filter, Wrench, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { ticketsMantenimiento } from '../../services/api';
import StatsCard from '../dashboard/StatsCard';

const TicketsPanel = () => {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterEstado, setFilterEstado] = useState('all');
    const [filterPrioridad, setFilterPrioridad] = useState('all');

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        filterTicketsData();
    }, [tickets, filterEstado, filterPrioridad]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await ticketsMantenimiento.getAll();
            setTickets(response.data.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)));
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterTicketsData = () => {
        let filtered = [...tickets];

        if (filterEstado !== 'all') {
            filtered = filtered.filter((t) => t.estado === filterEstado);
        }

        if (filterPrioridad !== 'all') {
            filtered = filtered.filter((t) => t.prioridad === filterPrioridad);
        }

        setFilteredTickets(filtered);
    };

    const getPrioridadColor = (prioridad) => {
        const colors = {
            baja: 'bg-blue-50 text-blue-700 border-blue-200',
            media: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            alta: 'bg-orange-50 text-orange-700 border-orange-200',
            critica: 'bg-red-50 text-red-700 border-red-200',
        };
        return colors[prioridad] || colors.media;
    };

    const getEstadoColor = (estado) => {
        const colors = {
            pendiente: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            en_proceso: 'bg-blue-50 text-blue-700 border-blue-200',
            completado: 'bg-green-50 text-green-700 border-green-200',
            cancelado: 'bg-gray-50 text-gray-700 border-gray-200',
        };
        return colors[estado] || colors.pendiente;
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    const pendientes = tickets.filter((t) => t.estado === 'pendiente').length;
    const enProceso = tickets.filter((t) => t.estado === 'en_proceso').length;
    const completados = tickets.filter((t) => t.estado === 'completado').length;
    const altaPrioridad = tickets.filter((t) => t.prioridad === 'alta' || t.prioridad === 'critica').length;

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard title="Pendientes" value={pendientes} icon={Clock} color="yellow" />
                <StatsCard title="En Proceso" value={enProceso} icon={Wrench} color="blue" />
                <StatsCard title="Completados" value={completados} icon={CheckCircle} color="green" />
                <StatsCard
                    title="Alta Prioridad"
                    value={altaPrioridad}
                    icon={AlertCircle}
                    color="red"
                    variant={altaPrioridad > 0 ? "alert" : undefined}
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
                            <option value="en_proceso">En Proceso</option>
                            <option value="completado">Completado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <Wrench size={20} className="text-gray-500" />
                        </div>
                        <select
                            value={filterPrioridad}
                            onChange={(e) => setFilterPrioridad(e.target.value)}
                            className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-gray-700 font-medium min-w-[200px]"
                        >
                            <option value="all">Todas las prioridades</option>
                            <option value="baja">Baja</option>
                            <option value="media">Media</option>
                            <option value="alta">Alta</option>
                            <option value="critica">Crítica</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tickets Grid */}
            <div className="grid grid-cols-1 gap-6">
                {filteredTickets.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
                        No se encontraron tickets
                    </div>
                ) : (
                    filteredTickets.map((ticket) => (
                        <div key={ticket.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group p-6">
                            {/* Colored indicator bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${ticket.prioridad === 'critica' || ticket.prioridad === 'alta' ? 'bg-red-500' :
                                ticket.prioridad === 'media' ? 'bg-yellow-500' : 'bg-blue-500'
                                }`}></div>

                            <div className="flex flex-col md:flex-row items-start justify-between mb-6 pl-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{ticket.titulo}</h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getPrioridadColor(
                                                ticket.prioridad
                                            )}`}
                                        >
                                            {ticket.prioridad}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 line-clamp-2 text-base">{ticket.descripcion}</p>
                                </div>
                                <span
                                    className={`mt-3 md:mt-0 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getEstadoColor(
                                        ticket.estado
                                    )}`}
                                >
                                    {ticket.estado.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm border-t border-gray-100 pt-5 pl-2">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Residente</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                            {ticket.residente_nombre ? ticket.residente_nombre.charAt(0) : 'U'}
                                        </div>
                                        <p className="font-semibold text-gray-800">
                                            {ticket.residente_nombre || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Asignado a</p>
                                    <p className="font-semibold text-gray-800">
                                        {ticket.asignado_a_nombre || 'Sin asignar'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Costo Estimado</p>
                                    <p className="font-semibold text-gray-800">{formatCurrency(ticket.costo_estimado)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Fecha Creación</p>
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <Clock size={14} />
                                        <span className="font-medium">{formatDate(ticket.fecha_creacion)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TicketsPanel;
