import { useState, useEffect } from 'react';
import { Search, DollarSign, Calendar, User, FileText } from 'lucide-react';
import { pagos } from '../../services/api';

const PagosHistory = () => {
    const [pagosList, setPagosList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPagos();
    }, []);

    const fetchPagos = async () => {
        try {
            setLoading(true);
            const response = await pagos.getAll();
            // Sort by date descending
            const sorted = response.data.sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago));
            setPagosList(sorted);
        } catch (error) {
            console.error('Error fetching pagos:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const filteredPagos = pagosList.filter(p => 
        (p.cuota_detalle?.residente_nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.metodo_pago || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando historial...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por residente o método..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-bold text-gray-900">{filteredPagos.length}</span> registros encontrados
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID Pago</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Residente</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Monto</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cuota Ref.</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Método</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredPagos.map((pago) => (
                            <tr key={pago.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-mono text-gray-500">#{pago.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center text-xs font-bold text-brand-600">
                                            <User size={12} />
                                        </div>
                                        <span className="font-medium text-gray-900">{pago.cuota_detalle?.residente_nombre || 'Desconocido'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-green-600">
                                    {formatCurrency(pago.monto)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {pago.cuota_detalle?.mes || 'N/A'} (Total: {formatCurrency(pago.cuota_detalle?.monto || 0)})
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg border border-blue-100 uppercase">
                                        {pago.metodo_pago}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {formatDate(pago.fecha_pago)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PagosHistory;
