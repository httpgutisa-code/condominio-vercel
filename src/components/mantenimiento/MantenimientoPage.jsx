import { useState } from 'react';
import { Wrench, ClipboardList, Users } from 'lucide-react';
import TicketsPanel from './TicketsPanel';
import PersonalMantenimiento from './PersonalMantenimiento';

const MantenimientoPage = () => {
    const [activeTab, setActiveTab] = useState('tickets');

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <Wrench className="text-orange-600" />
                        Mantenimiento y Servicios
                    </h2>
                    <p className="text-gray-500">Gestión de tickets, reparaciones y personal técnico</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('tickets')}
                        className={`
                            group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all
                            ${activeTab === 'tickets'
                                ? 'border-brand-600 text-brand-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        `}
                    >
                        <ClipboardList size={18} className={activeTab === 'tickets' ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-500'} />
                        Tickets de Mantenimiento
                    </button>
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`
                            group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all
                            ${activeTab === 'personal'
                                ? 'border-brand-600 text-brand-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        `}
                    >
                        <Users size={18} className={activeTab === 'personal' ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-500'} />
                        Personal Técnico
                    </button>
                </nav>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'tickets' && <TicketsPanel />}
                {activeTab === 'personal' && <PersonalMantenimiento />}
            </div>
        </div>
    );
};

export default MantenimientoPage;
