import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Archive, Mail, Users, Globe, CreditCard,
  Star, Settings, Menu, X, LogOut, ChevronRight, Shield
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'My Vault', to: '/dashboard/vault', icon: Archive },
  { label: 'My Letters', to: '/dashboard/letters', icon: Mail },
  { label: 'My Recipients', to: '/dashboard/recipients', icon: Users },
  { label: 'My Tribes', to: '/dashboard/tribes', icon: Globe },
  { label: 'My Card', to: '/dashboard/card', icon: CreditCard },
  { label: 'My Points', to: '/dashboard/points', icon: Star },
  { label: 'My Account', to: '/dashboard/account', icon: Settings },
];

const Logo = () => (
  <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 40 40" fill="none">
    <rect x="3" y="14" width="34" height="22" rx="6" fill="#8BA888"/>
    <path d="M6 17.5 20 27l14-9.5" stroke="#FBF8F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 14c0-4 2.4-6.8 0-11-2.4 4.2 0 7 0 11Z" fill="rgba(255,255,255,0.5)"/>
    <path d="M20 14c.2-3 2.6-4.6 5-5.2-1 2.8-2.6 4.4-5 5.2Z" fill="#EAD9BC"/>
    <circle cx="20" cy="5" r="1.8" fill="#FBF8F3"/>
  </svg>
);

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then(u => setIsAdmin(u?.role === 'admin')).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[var(--paper)] flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-60 dn-sidebar flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="font-body font-semibold text-white text-base">DepartingNotes</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`dn-sidebar-link ${active ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {active && <ChevronRight size={12} className="ml-auto opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          {isAdmin && (
            <Link to="/admin" onClick={() => setSidebarOpen(false)} className="dn-sidebar-link">
              <Shield size={16} />
              <span>Admin Console</span>
            </Link>
          )}
          <button
            onClick={() => base44.auth.logout('/')}
            className="dn-sidebar-link w-full"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[var(--forest)] text-white">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <span className="font-body font-semibold text-sm">DepartingNotes</span>
          <div className="w-5" />
        </header>

        <main className="flex-1 overflow-auto p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}