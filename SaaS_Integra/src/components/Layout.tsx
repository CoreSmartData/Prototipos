import { useState } from 'react';
import {
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { Outlet, Link, useLocation } from 'react-router-dom';
import logo from '../assets/core-logo.png';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Inventario', href: '/inventory', icon: ShoppingBagIcon },
  { name: 'Ventas', href: '/sales', icon: ShoppingCartIcon },
  { name: 'Pedidos', href: '/orders', icon: ClipboardDocumentListIcon },
  { name: 'Compras', href: '/purchases', icon: DocumentTextIcon },
  { name: 'Vales de Material', href: '/material-vouchers', icon: UsersIcon },
];

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside 
          className={`
            w-16rem shrink-0 bg-white shadow-lg 
            transition-all duration-700 ease-out
            ${isSidebarOpen ? 'w-16rem opacity-100' : 'w-0 opacity-0'}
            overflow-hidden
          `}
        >
          <div className={`
            flex flex-col h-full w-16rem
            transition-transform duration-700 ease-out
            ${isSidebarOpen ? 'translate-x-0 scale-100' : '-translate-x-full scale-95'}
          `}>
            <div className="flex items-center justify-center h-24 px-4 border-b">
              <img src={logo} alt="CORE-Integra" className="h-48 w-auto" />
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.href
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Contenido principal */}
        <div className={`
          flex-1 flex flex-col min-w-0
          transition-all duration-700 ease-out
        `}>
          {/* Barra superior */}
          <header className="h-16 bg-white shadow-sm border-b">
            <div className="h-full flex items-center px-6">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`
                  p-2 rounded-md text-gray-400 
                  hover:text-gray-500 hover:bg-gray-100 
                  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500
                  transition-transform duration-700 ease-out
                  ${isSidebarOpen ? 'rotate-180' : 'rotate-0'}
                `}
              >
                <span className="sr-only">Abrir menú</span>
                {isSidebarOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
} 