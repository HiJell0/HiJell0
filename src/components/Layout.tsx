import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, User, MessageSquare, CreditCard, Users, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { LINCOLN_LOGO_URL } from '../constants';

export default function Layout() {
  const { userRole, setUserRole } = useAppContext();
  const location = useLocation();

  const clientLinks = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/documents', icon: FileText, label: 'Documents' },
    { to: '/intake', icon: User, label: 'Your Info' },
    { to: '/communication', icon: MessageSquare, label: 'Messages' },
    { to: '/billing', icon: CreditCard, label: 'Billing' },
  ];

  const staffLinks = [
    { to: '/staff', icon: Users, label: 'Client Overview' },
  ];

  const links = userRole === 'client' ? clientLinks : staffLinks;

  return (
    <div className="h-dvh bg-stone-50 text-stone-900 font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-stone-200 h-full">
        <div className="p-6 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              <img 
                src={LINCOLN_LOGO_URL} 
                alt="Logo" 
                className="w-6 h-6 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#00668a]">Lincoln Law</h1>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-stone-100 text-stone-900'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-stone-900' : 'text-stone-400'}`} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-stone-100">
          {userRole === 'staff' ? (
            <button
              onClick={() => setUserRole('client')}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
            >
              <LogOut className="w-5 h-5 text-stone-400" />
              Switch to Client
            </button>
          ) : (
            <div className="px-3 py-2.5 text-sm font-medium text-stone-900">
              Alex Doe
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-stone-50 h-full relative">
        {/* Mobile Header - Fixed at top */}
        <header className="md:hidden bg-white border-b border-stone-200 p-4 flex justify-between items-center shrink-0 z-30 relative">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center overflow-hidden shrink-0">
              <img 
                src={LINCOLN_LOGO_URL} 
                alt="Logo" 
                className="w-5 h-5 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-[#00668a]">Lincoln Law</h1>
          </div>
          {userRole === 'staff' ? (
            <button
              onClick={() => setUserRole('client')}
              className="text-xs font-medium text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full"
            >
              Switch Role
            </button>
          ) : (
            <span className="text-xs font-medium text-stone-900">Alex Doe</span>
          )}
        </header>

        {/* Scrollable Content Area */}
        <main className={`flex-1 ${location.pathname === '/communication' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex justify-around p-2 pb-safe z-20">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center p-2 rounded-lg min-w-[64px] ${
                isActive ? 'text-stone-900' : 'text-stone-400'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
