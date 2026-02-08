
import React, { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import FaturfecaLogo from './FaturfecaLogo';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

const Sidebar: React.FC = () => {
    const { currentUser, logout } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const allNavItems = [
        { name: 'Dashboard', path: '/dashboard', icon: HomeIcon, roles: [UserRole.Administrador, UserRole.Contabilista, UserRole.Operador] },
        { name: 'Documentos', path: '/documents', icon: DocumentTextIcon, roles: [UserRole.Administrador, UserRole.Contabilista, UserRole.Operador] },
        { name: 'Clientes', path: '/clients', icon: UsersIcon, roles: [UserRole.Administrador, UserRole.Contabilista, UserRole.Operador] },
        { name: 'Produtos', path: '/products', icon: CubeIcon, roles: [UserRole.Administrador, UserRole.Operador] },
        { name: 'Fluxo de Caixa', path: '/cash-flow', icon: SwitchHorizontalIcon, roles: [UserRole.Administrador, UserRole.Contabilista] },
        { name: 'Relatórios', path: '/reports', icon: ChartBarIcon, roles: [UserRole.Administrador, UserRole.Contabilista] },
        { name: 'Configurações', path: '/settings', icon: CogIcon, roles: [UserRole.Administrador] },
    ];
    
    const navItems = useMemo(() => {
        if (!currentUser) return [];
        return allNavItems.filter(item => item.roles.includes(currentUser.role));
    }, [currentUser]);


    if (!currentUser) {
        return null; // Don't render sidebar if no user is logged in (e.g., during redirection)
    }

    const NavItem: React.FC<{ item: typeof navItems[0] }> = ({ item }) => (
        <NavLink
            to={item.path}
            className={({ isActive }) =>
                `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                    ? 'bg-primary-50 text-primary'
                    : 'text-neutral-dark hover:bg-primary-50 hover:text-primary'
                }`
            }
        >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
        </NavLink>
    );

    return (
        <div className="w-64 bg-white border-r border-neutral-medium flex flex-col">
            <div className="h-20 flex items-center px-6">
                <FaturfecaLogo />
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map(item => <NavItem key={item.name} item={item} />)}
            </nav>
            <div className="px-4 py-6">
                 <div className="p-4 bg-neutral-light rounded-lg">
                    <p className="text-sm font-semibold text-secondary">{currentUser.name}</p>
                    <p className="text-xs text-neutral-dark">{currentUser.role}</p>
                </div>
                 <button onClick={handleLogout} className="w-full mt-4 flex items-center px-4 py-2.5 text-sm font-medium text-neutral-dark hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                    <LogoutIcon className="w-5 h-5 mr-3"/>
                    Sair
                </button>
            </div>
        </div>
    );
};

// SVG Icon Components
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const DocumentTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292" />
  </svg>
);
const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const CogIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const CubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

const SwitchHorizontalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
);

export default Sidebar;
