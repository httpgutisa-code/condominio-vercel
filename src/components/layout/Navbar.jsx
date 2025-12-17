import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const pageTitles = {
    '/': 'Dashboard',
    '/residentes': 'Gestión de Residentes',
    '/finanzas': 'Gestión Financiera',
    '/seguridad': 'Alertas de Seguridad',
    '/mantenimiento': 'Tickets de Mantenimiento',
    '/reservas': 'Reservas de Áreas Comunes',
};

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const title = pageTitles[location.pathname] || 'Smart Condominium';

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-5 sticky top-0 z-10 transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Bienvenido de nuevo, {user?.first_name || 'Administrador'}</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 pl-4 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded-full shadow-sm hover:bg-white hover:border-gray-300 transition-all cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
                            <User size={16} strokeWidth={2.5} />
                        </div>
                        <div className="text-sm font-medium text-gray-700 pr-2">
                            {user?.username || 'Admin'}
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                        title="Cerrar sesión"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
