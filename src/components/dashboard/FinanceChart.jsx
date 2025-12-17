import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const FinanceChart = ({ data }) => {
    // Expected data format: { labels: ["Pagado", "Por Cobrar"], data: [15000, 4500] }
    // Transform to Recharts format
    const chartData = [
        { name: 'Pagado', value: data?.data[0] || 0, color: '#10b981' }, // Verde Esmeralda
        { name: 'Por Cobrar', value: data?.data[1] || 0, color: '#f43f5e' }, // Rojo Rosa
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(value);
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl">
                    <p className="text-sm font-semibold text-gray-900">{payload[0].name}</p>
                    <p className="text-sm text-gray-600">
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
            <ul className="flex justify-center gap-6 mt-4">
                {payload.map((entry, index) => (
                    <li key={`item-${index}`} className="flex items-center gap-2 text-sm text-gray-600">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="font-medium">{entry.value}</span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2 self-start w-full">Estado Financiero</h3>

            <div className="w-full h-[300px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={renderLegend} verticalAlign="bottom" />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text for Donut */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total</p>
                    <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(chartData.reduce((acc, curr) => acc + curr.value, 0))}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FinanceChart;
