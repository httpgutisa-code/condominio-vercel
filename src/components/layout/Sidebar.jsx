import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    DollarSign,
    Shield,
    Wrench,
    Calendar
} from 'lucide-react';

const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/residentes', icon: Users, label: 'Residentes' },
    { path: '/finanzas', icon: DollarSign, label: 'Finanzas' },
    { path: '/seguridad', icon: Shield, label: 'Seguridad' },
    { path: '/mantenimiento', icon: Wrench, label: 'Mantenimiento' },
    { path: '/reservas', icon: Calendar, label: 'Reservas' },
];

const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-gray-100 text-gray-800 min-h-screen p-6 shadow-soft z-20 transition-all duration-300">
            <div className="mb-10 px-2 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <span className="text-white font-bold text-xl">S</span>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Smart Condominium</h1>
                    <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Admin Panel</p>
                </div>
            </div>

            <nav className="space-y-1.5">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${isActive
                                ? 'bg-brand-50 text-brand-700 font-semibold shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
                                }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 w-1 h-8 bg-brand-500 rounded-r-full" />
                            )}
                            <Icon size={22} className={`transition-colors ${isActive ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto px-4 py-6">
                <div className="p-4 rounded-xl bg-brand-50 border border-brand-100 shadow-sm">
                    <p className="text-sm font-medium text-brand-900">Estado del Sistema</p>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse ring-2 ring-green-200"></div>
                        <span className="text-xs font-bold text-brand-700">En línea</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
