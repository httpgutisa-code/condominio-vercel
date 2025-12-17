import { useState } from 'react';
import { DollarSign, FileText, PieChart, History } from 'lucide-react';
import CuotasTable from './CuotasTable';
import PagosHistory from './PagosHistory';
import api from '../../services/api';

const FinanzasPage = () => {
    const [activeTab, setActiveTab] = useState('cuotas');
    const [downloading, setDownloading] = useState(false);

    const handleDownloadReport = async () => {
        try {
            setDownloading(true);
            const response = await api.get('reportes/finanzas/', { responseType: 'blob' });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Reporte_Finanzas.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('No se pudo descargar el reporte.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <DollarSign className="text-green-600" />
                        Gestión Financiera
                    </h2>
                    <p className="text-gray-500">Control de cuotas, pagos y reporte de ingresos</p>
                </div>
                <button
                    onClick={handleDownloadReport}
                    disabled={downloading}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all font-medium shadow-sm disabled:opacity-50"
                >
                    <FileText size={20} />
                    {downloading ? 'Generando Excel...' : 'Descargar Reporte Excel'}
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('cuotas')}
                        className={`
                            group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all
                            ${activeTab === 'cuotas'
                                ? 'border-brand-600 text-brand-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        `}
                    >
                        <PieChart size={18} className={activeTab === 'cuotas' ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-500'} />
                        Cuotas y Expensas
                    </button>
                    <button
                        onClick={() => setActiveTab('pagos')}
                        className={`
                            group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all
                            ${activeTab === 'pagos'
                                ? 'border-brand-600 text-brand-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        `}
                    >
                        <History size={18} className={activeTab === 'pagos' ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-500'} />
                        Historial de Pagos
                    </button>
                </nav>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'cuotas' && <CuotasTable />}
                {activeTab === 'pagos' && <PagosHistory />}
            </div>
        </div>
    );
};

export default FinanzasPage;
