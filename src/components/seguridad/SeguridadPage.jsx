import { useState } from 'react';
import { Shield, FileText, Bell, Users, ClipboardList } from 'lucide-react';
import AlertasPanel from './AlertasPanel';
import BitacoraVisitas from './BitacoraVisitas';
import PersonalSeguridad from './PersonalSeguridad';
import api from '../../services/api';

const SeguridadPage = () => {
    const [activeTab, setActiveTab] = useState('alertas');
    const [downloading, setDownloading] = useState(false);

    const handleDownloadReport = async () => {
        try {
            setDownloading(true);
            const response = await api.get('reportes/seguridad/', { responseType: 'blob' });
            
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Reporte_Seguridad.pdf');
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

    const tabs = [
        { id: 'alertas', label: 'Alertas e Incidentes', icon: Bell },
        { id: 'bitacora', label: 'Bitácora de Visitas', icon: ClipboardList },
        { id: 'personal', label: 'Personal de Guardia', icon: Users },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <Shield className="text-brand-600" />
                        Centro de Seguridad
                    </h2>
                    <p className="text-gray-500">Gestión integral de vigilancia, accesos y personal</p>
                </div>
                <button
                    onClick={handleDownloadReport}
                    disabled={downloading}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-brand-600 transition-all font-medium shadow-sm disabled:opacity-50"
                >
                    <FileText size={20} />
                    {downloading ? 'Generando PDF...' : 'Descargar Reporte PDF'}
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all
                                    ${activeTab === tab.id
                                        ? 'border-brand-600 text-brand-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                                `}
                            >
                                <Icon size={18} className={activeTab === tab.id ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-500'} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'alertas' && <AlertasPanel />}
                {activeTab === 'bitacora' && <BitacoraVisitas />}
                {activeTab === 'personal' && <PersonalSeguridad />}
            </div>
        </div>
    );
};

export default SeguridadPage;
