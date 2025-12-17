import { useNavigate } from 'react-router-dom';
import { CheckCircle, Dog, Car, Users, Package, AlertCircle, Shield, ArrowRight, Clock } from 'lucide-react';

const AlertsWidget = ({ alerts = [] }) => {
    const navigate = useNavigate();

    const getAlertIcon = (tipo) => {
        const iconMap = {
            'perro_suelto': Dog,
            'vehiculo_sospechoso': Car,
            'reunion_no_autorizada': Users,
            'paquete_abandonado': Package,
            'intruso': Shield,
            'default': AlertCircle
        };
        const Icon = iconMap[tipo] || iconMap.default;
        return <Icon size={16} strokeWidth={2} />;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        }).format(date);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <AlertCircle size={18} className="text-gray-400" />
                    Actividad Reciente
                </h3>
                <button
                    onClick={() => navigate('/seguridad')}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
                >
                    Ver todo <ArrowRight size={14} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-0">
                {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                            <CheckCircle size={24} className="text-gray-400" />
                        </div>
                        <p className="text-gray-900 font-medium text-sm">Sin incidentes recientes</p>
                        <p className="text-xs text-gray-500 mt-1">El sistema no ha detectado nuevas alertas.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {alerts.slice(0, 6).map((alert) => (
                            <div
                                key={alert.id}
                                className="p-4 hover:bg-gray-50/50 transition-colors group cursor-default"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon Box */}
                                    <div className={`
                                        p-2 rounded-lg shrink-0 mt-0.5
                                        ${alert.resuelto 
                                            ? 'bg-emerald-50 text-emerald-600' 
                                            : 'bg-rose-50 text-rose-600'}
                                    `}>
                                        {alert.resuelto ? <CheckCircle size={16} /> : getAlertIcon(alert.tipo_alerta)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-0.5">
                                            <p className="text-sm font-semibold text-gray-900 capitalize truncate pr-2">
                                                {alert.tipo_alerta?.replace(/_/g, ' ') || 'Incidente'}
                                            </p>
                                            <span className={`
                                                text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border
                                                ${alert.resuelto
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    : 'bg-rose-50 text-rose-700 border-rose-100'}
                                            `}>
                                                {alert.resuelto ? 'Resuelto' : 'Activo'}
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-1 group-hover:line-clamp-none transition-all">
                                            {alert.descripcion}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {formatDate(alert.fecha_hora)}
                                            </span>
                                            {alert.residente_nombre && (
                                                <span className="flex items-center gap-1">
                                                    <Users size={12} />
                                                    {alert.residente_nombre}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertsWidget;
