import { useEffect, useState } from 'react';
import { Users, DollarSign, Shield, Wrench, RefreshCw, AlertTriangle } from 'lucide-react';
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
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(value);
    };

    if (loading) {
        return (
            <div className="space-y-8 p-6">
                <div className="flex justify-between items-center mb-8">
                    <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white h-40 rounded-xl border border-gray-100 shadow-sm animate-pulse"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="h-96 bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse lg:col-span-1"></div>
                    <div className="h-96 bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse lg:col-span-2"></div>
                </div>
            </div>
        );
    }

    if (error && !stats.kpis.total_residentes) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-6">
                <div className="bg-rose-50 p-6 rounded-full mb-6">
                    <AlertTriangle size={40} className="text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Error de Conexión</h3>
                <p className="text-gray-500 mb-8 max-w-md">{error || 'Ha ocurrido un error al intentar comunicar con el servidor.'}</p>
                <button
                    onClick={fetchDashboardData}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition-all font-medium shadow-lg shadow-gray-200"
                >
                    <RefreshCw size={18} /> Reintentar
                </button>
            </div>
        );
    }

    const { kpis, graficos, actividad_reciente } = stats;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">Panel de Control</h1>
                    <p className="text-gray-500 font-medium">Resumen general de operaciones</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-xs font-semibold uppercase tracking-wider">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Sistema Operativo
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="OCUPACIÓN"
                    value={`${Number(kpis.ocupacion_porcentaje).toFixed(1)}%`}
                    icon={Users}
                    color="brand"
                    progress={kpis.ocupacion_porcentaje}
                    subValue={`${kpis.total_residentes} residentes totales`}
                />

                <StatsCard
                    title="FINANZAS (MES)"
                    value={formatCurrency(kpis.recaudacion_total)}
                    icon={DollarSign}
                    color="green"
                    subValue={
                        <span className="text-rose-600 text-sm font-medium">
                            {formatCurrency(kpis.deuda_pendiente)} pendiente
                        </span>
                    }
                />

                <StatsCard
                    title="SEGURIDAD"
                    value={kpis.alertas_activas}
                    icon={Shield}
                    color={kpis.alertas_activas > 0 ? "red" : "blue"}
                    subValue={kpis.alertas_activas > 0 ? "Incidentes activos" : "Sin incidentes"}
                    variant={kpis.alertas_activas > 0 ? "alert" : "normal"}
                />

                <StatsCard
                    title="MANTENIMIENTO"
                    value={kpis.tickets_pendientes}
                    icon={Wrench}
                    color="orange"
                    subValue="Tickets abiertos"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto">
                <div className="lg:col-span-1 h-[420px]">
                    <FinanceChart data={graficos.finanzas} />
                </div>
                <div className="lg:col-span-2 h-[420px]">
                    <AlertsWidget alerts={actividad_reciente.alertas} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
