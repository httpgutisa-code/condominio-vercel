import { useEffect, useState } from 'react';
import { Users, Home, DollarSign, AlertTriangle, TrendingUp, TrendingDown, Wrench } from 'lucide-react';
import StatsCard from './StatsCard';
import AlertsWidget from './AlertsWidget';
import FinanceChart from './FinanceChart';
import { dashboard } from '../../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        kpis: {
            total_residentes: 0,
            ocupacion_porcentaje: 0,
            alertas_activas: 0,
            tickets_pendientes: 0,
            recaudacion_total: 0,
            deuda_pendiente: 0,
        },
        graficos: {
            finanzas: { labels: [], data: [] }
        },
        actividad_reciente: {
            alertas: []
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await dashboard.getAdminStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('No se pudieron cargar las estadísticas');

            // Fallback for development/demo if API fails (using provided JSON structure)
            // Uncomment to test without backend
            /*
            setStats({
                kpis: {
                    total_residentes: 12,
                    ocupacion_porcentaje: 85.5,
                    alertas_activas: 3,
                    tickets_pendientes: 5,
                    recaudacion_total: 15000.00,
                    deuda_pendiente: 4500.00
                },
                graficos: {
                    finanzas: {
                        labels: ["Pagado", "Por Cobrar"],
                        data: [15000.00, 4500.00]
                    }
                },
                actividad_reciente: {
                    alertas: [
                        {
                            id: 1,
                            tipo_alerta: "perro_suelto",
                            descripcion: "Perro ladrando en pasillo",
                            fecha_hora: "2024-12-15T10:30:00Z",
                            resuelto: false,
                            residente_nombre: "Juan Pérez"
                        }
                    ]
                }
            });
            */
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(value);
    };

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                        <div className="h-4 bg-gray-100 rounded w-48"></div>
                    </div>
                    <div className="h-10 bg-gray-100 rounded-lg w-32"></div>
                </div>

                {/* KPI Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-start justify-between">
                                <div className="w-full">
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                                    <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
                                </div>
                                <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Content Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-[400px]">
                        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                        <div className="flex items-center justify-center h-[300px]">
                            <div className="w-48 h-48 bg-gray-100 rounded-full"></div>
                        </div>
                    </div>
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-[450px]">
                        <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !stats.kpis.total_residentes) { // Show error only if no data
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <AlertTriangle size={32} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Error de Conexión</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                    onClick={fetchDashboardData}
                    className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
                >
                    Intentar de nuevo
                </button>
            </div>
        );
    }

    const { kpis, graficos, actividad_reciente } = stats;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Principal</h2>
                    <p className="text-gray-500">Vista general del estado del condominio</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        En línea
                    </div>
                    <button
                        onClick={fetchDashboardData}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-brand-600"
                        title="Actualizar datos"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21h5v-5" /></svg>
                    </button>
                </div>
            </div>

            {/* KPI Cards Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Ocupación - Con barra de progreso */}
                <StatsCard
                    title="Ocupación"
                    value={`${Number(kpis.ocupacion_porcentaje).toFixed(1)}%`}
                    icon={Users}
                    color="brand"
                    progress={kpis.ocupacion_porcentaje}
                />

                {/* Finanzas - Recaudado vs Deuda */}
                <StatsCard
                    title="Finanzas (Mes)"
                    value={formatCurrency(kpis.recaudacion_total)}
                    subValue={
                        <span className="flex items-center gap-1 text-red-500 font-medium text-xs">
                            Deuda: {formatCurrency(kpis.deuda_pendiente)}
                        </span>
                    }
                    icon={DollarSign}
                    color="green"
                />

                {/* Seguridad - Alerta roja si hay activas */}
                <StatsCard
                    title="Seguridad"
                    value={kpis.alertas_activas}
                    subValue={kpis.alertas_activas > 0 ? "Alertas Activas" : "Todo seguro"}
                    icon={AlertTriangle}
                    color={kpis.alertas_activas > 0 ? "red" : "blue"}
                    variant={kpis.alertas_activas > 0 ? "alert" : undefined}
                />

                {/* Mantenimiento */}
                <StatsCard
                    title="Mantenimiento"
                    value={kpis.tickets_pendientes}
                    subValue="Tickets Pendientes"
                    icon={Wrench}
                    color="orange"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Financial Chart - Pie Chart */}
                <div className="lg:col-span-1 h-[400px]">
                    <FinanceChart data={graficos.finanzas} />
                </div>

                {/* Recent Activity Table */}
                <div className="lg:col-span-2">
                    <AlertsWidget alerts={actividad_reciente.alertas} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
