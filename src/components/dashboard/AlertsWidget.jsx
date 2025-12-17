import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Dog, Car, Users, Package, AlertCircle, Shield, ArrowRight } from 'lucide-react';

const AlertsWidget = ({ alerts = [] }) => {
    const navigate = useNavigate();

    // Map alert types to icons
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
        return <Icon size={18} className="text-red-500" strokeWidth={2.5} />;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month} ${hours}:${minutes}`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-[450px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Actividad Reciente</h3>
                <button
                    onClick={() => navigate('/seguridad')}
                    className="text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                    Ver todas <ArrowRight size={14} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                            <CheckCircle size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">Todo está bajo control</p>
                        <p className="text-xs text-gray-400 mt-1">No hay alertas recientes</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {alerts.slice(0, 5).map((alert) => (
                            <div
                                key={alert.id}
                                className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Icon Column */}
                                    <div className={`p-2 rounded-lg ${alert.resuelto ? 'bg-green-50' : 'bg-red-50'} shrink-0`}>
                                        {alert.resuelto ? (
                                            <CheckCircle size={18} className="text-green-600" strokeWidth={2.5} />
                                        ) : (
                                            getAlertIcon(alert.tipo_alerta)
                                        )}
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <p className="font-semibold text-gray-900 text-sm capitalize">
                                                {alert.tipo_alerta?.replace(/_/g, ' ') || 'Alerta'}
                                            </p>
                                            {/* Status Badge */}
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${alert.resuelto
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {alert.resuelto ? 'Resuelto' : 'Pendiente'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-1 mb-1">{alert.descripcion}</p>
                                        {/* Date/Time Column */}
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span className="font-medium">{formatDate(alert.fecha_hora)}</span>
                                            {alert.residente_nombre && (
                                                <>
                                                    <span>•</span>
                                                    <span>{alert.residente_nombre}</span>
                                                </>
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
