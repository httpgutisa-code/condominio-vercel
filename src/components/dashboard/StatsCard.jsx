const StatsCard = ({ title, value, subValue, icon: Icon, color = 'slate', progress, variant }) => {
    // Professional color palette mapping (Muted/Corporate styles)
    const styles = {
        slate: { 
            bg: 'bg-white', 
            iconBg: 'bg-slate-100', 
            iconText: 'text-slate-600', 
            border: 'border-slate-200',
            barColor: '#475569' 
        },
        brand: { 
            bg: 'bg-white', 
            iconBg: 'bg-indigo-50', 
            iconText: 'text-indigo-600', 
            border: 'border-indigo-100',
            barColor: '#4f46e5' 
        },
        blue: { 
            bg: 'bg-white', 
            iconBg: 'bg-blue-50', 
            iconText: 'text-blue-600', 
            border: 'border-blue-100',
            barColor: '#2563eb' 
        },
        green: { 
            bg: 'bg-white', 
            iconBg: 'bg-emerald-50', 
            iconText: 'text-emerald-600', 
            border: 'border-emerald-100',
            barColor: '#059669' 
        },
        red: { 
            bg: 'bg-white', 
            iconBg: 'bg-rose-50', 
            iconText: 'text-rose-600', 
            border: 'border-rose-100',
            barColor: '#e11d48' 
        },
        orange: { 
            bg: 'bg-white', 
            iconBg: 'bg-orange-50', 
            iconText: 'text-orange-600', 
            border: 'border-orange-100',
            barColor: '#ea580c' 
        }
    };

    const currentStyle = styles[color] || styles.slate;
    const progressValue = Number(progress) || 0;

    // Alert variant overrides
    const isAlert = variant === 'alert';
    const containerClasses = isAlert 
        ? 'border-rose-200 bg-rose-50/10' 
        : `border-gray-200 hover:border-gray-300 bg-white`;

    return (
        <div className={`
            relative p-6 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md
            ${containerClasses}
        `}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${currentStyle.iconBg} ${currentStyle.iconText}`}>
                    <Icon size={20} strokeWidth={2} />
                </div>
                {/* Optional: Add a subtle menu or indicator if needed, for now keeping it clean */}
            </div>

            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
            </div>

            {/* Subvalue / Footer */}
            {(subValue || progress !== undefined) && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                    {progress !== undefined ? (
                        <div className="space-y-2">
                             <div className="flex justify-between text-xs font-medium text-gray-500">
                                <span>Progreso</span>
                                <span>{progressValue.toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${progressValue}%`, backgroundColor: currentStyle.barColor }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 font-medium">
                            {subValue}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StatsCard;
