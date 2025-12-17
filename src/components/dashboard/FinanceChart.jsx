import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DollarSign } from 'lucide-react';

const FinanceChart = ({ data }) => {
    // Expected data format: { labels: ["Pagado", "Por Cobrar"], data: [15000, 4500] }
    
    // Updated Professional Palette (Emerald for Income, Rose for Debt)
    const chartData = [
        { name: 'Pagado (Recaudado)', value: data?.data[0] || 0, color: '#10b981' }, // Emerald 500
        { name: 'Pendiente (Deuda)', value: data?.data[1] || 0, color: '#e11d48' }, // Rose 600
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(value);
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 shadow-xl rounded-lg text-sm">
                    <p className="font-semibold text-gray-900 mb-1">{payload[0].name}</p>
                    <p className="font-mono text-gray-600">
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    const renderLegend = (props) => {
        const { payload } = props;
        return (
            <ul className="flex flex-col gap-3 mt-4 w-full px-8">
                {payload.map((entry, index) => (
                    <li key={`item-${index}`} className="flex items-center justify-between text-sm text-gray-600 w-full">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full shadow-sm"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="font-medium text-gray-700">{entry.value}</span>
                        </div>
                        <span className="font-mono text-gray-500">
                             {/* Calculation for percentage could go here if needed */}
                        </span>
                    </li>
                ))}
            </ul>
        );
    };

    const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 bg-gray-50/30">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <DollarSign size={18} className="text-gray-400" />
                    Balance Financiero
                </h3>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative p-4">
                <div className="w-full h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={100}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={4}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                            <Legend content={renderLegend} verticalAlign="bottom" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Center Text for Donut */}
                <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Mes</p>
                    <p className="text-2xl font-bold text-gray-900 tracking-tight font-mono">
                        {formatCurrency(total)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FinanceChart;
