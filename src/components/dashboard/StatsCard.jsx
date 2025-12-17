const StatsCard = ({ title, value, subValue, icon: Icon, color = 'blue', progress, variant }) => {
    const colorClasses = {
        brand: { bg: 'bg-brand-50', text: 'text-brand-600', border: 'border-brand-100', iconBg: 'bg-brand-600', gradient: 'from-brand-500 to-brand-600', barColor: '#0284c7' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', iconBg: 'bg-blue-500', gradient: 'from-blue-400 to-blue-500', barColor: '#3b82f6' },
        green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', iconBg: 'bg-green-500', gradient: 'from-green-400 to-green-500', barColor: '#10b981' },
        red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', iconBg: 'bg-red-500', gradient: 'from-red-400 to-red-500', barColor: '#ef4444' },
        yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100', iconBg: 'bg-yellow-500', gradient: 'from-yellow-400 to-yellow-500', barColor: '#eab308' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', iconBg: 'bg-purple-500', gradient: 'from-purple-400 to-purple-500', barColor: '#a855f7' },
        orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', iconBg: 'bg-orange-500', gradient: 'from-orange-400 to-orange-500', barColor: '#f97316' },
        secondary: { bg: 'bg-secondary-50', text: 'text-secondary-600', border: 'border-secondary-100', iconBg: 'bg-secondary-500', gradient: 'from-secondary-400 to-secondary-500', barColor: '#8b5cf6' },
    };

    const current = colorClasses[color] || colorClasses.blue;

    // Apply alert variant styling
    const borderClass = variant === 'alert' ? 'border-red-200 bg-red-50/30' : 'border-gray-100';

    // Ensure progress is a number
    const progressValue = Number(progress) || 0;

    return (
        <div className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border ${borderClass} relative overflow-hidden group`}>
            <div className="flex items-start justify-between relative z-10">
                <div className="w-full">
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">{title}</p>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
                    {subValue && (
                        <div className="mt-1 text-sm">{subValue}</div>
                    )}
                </div>
                <div className={`${current.bg} p-3.5 rounded-xl ${current.text} transition-transform group-hover:scale-110 duration-300 shrink-0 ml-4`}>
                    <Icon size={24} strokeWidth={2.5} />
                </div>
            </div>

            {progress !== undefined && (
                <div className="mt-4 relative z-10">
                    <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                        <span>Progreso</span>
                        <span>{progressValue.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="h-2.5 rounded-full transition-all duration-700 ease-out"
                            style={{
                                width: `${progressValue}%`,
                                backgroundColor: current.barColor
                            }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Decorative background element */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${current.gradient} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity duration-300`}></div>
        </div>
    );
};

export default StatsCard;
