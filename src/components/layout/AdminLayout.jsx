import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { LayoutDashboard, FileCheck, Users, Clock, TrendingUp, UsersRound, Handshake, LogOut, Menu, X, ShieldAlert } from 'lucide-react';

const NAV = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'Overview', title: 'Overview', sub: 'Platform health at a glance.' },
  { section: 'Operations' },
  { to: '/admin/queue', icon: FileCheck, label: 'Verification Queue', title: 'Death Certificate Queue', sub: 'Handle each submission with care.' },
  { to: '/admin/members', icon: Users, label: 'Members', title: 'Member Management', sub: 'The full membership base.' },
  { to: '/admin/releases', icon: Clock, label: 'Release Log', title: 'Release & Memorialization Log', sub: 'Every delivered legacy, recorded.' },
  { section: 'Business' },
  { to: '/admin/revenue', icon: TrendingUp, label: 'Revenue', title: 'Revenue Dashboard', sub: 'Recurring revenue & growth.' },
  { to: '/admin/tribes', icon: UsersRound, label: 'Tribes', title: 'Tribe Management', sub: 'Communities across the platform.' },
  { to: '/admin/partners', icon: Handshake, label: 'Partners', title: 'Partner Directory', sub: 'Referral partners & sign-ups.' },
];

const Logo = () => (
  <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
    <rect x="3" y="14" width="34" height="22" rx="6" fill="#1F3D34"/>
    <path d="M6 17.5 20 27l14-9.5" stroke="#FBF8F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 14c0-4 2.4-6.8 0-11-2.4 4.2 0 7 0 11Z" fill="#8BA888"/>
    <path d="M20 14c.2-3 2.6-4.6 5-5.2-1 2.8-2.6 4.4-5 5.2Z" fill="#B9802F"/>
    <circle cx="20" cy="5" r="1.8" fill="#EAD9BC"/>
  </svg>
);

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const load = async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);
        if (u?.role === 'admin') {
          const pending = await base44.entities.ReleaseRequest.filter({ status: 'pending' });
          setPendingCount(pending.length);
        }
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => { setNavOpen(false); }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center">
        <p className="font-body text-[var(--text-mute)] text-sm">Loading admin console…</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center px-5">
        <div className="bg-white border border-[var(--border)] rounded-2xl p-12 text-center max-w-md">
          <div className="w-14 h-14 rounded-full bg-[#F3DED8] flex items-center justify-center mx-auto mb-5">
            <ShieldAlert size={24} className="text-[var(--rose)]" />
          </div>
          <h1 className="font-heading text-2xl font-semibold text-[var(--forest)] mb-3">Admin access required</h1>
          <p className="font-body text-sm text-[var(--text-soft)] mb-6">This area is restricted to DepartingNotes administrators.</p>
          <Link to="/" className="inline-flex bg-[var(--forest)] text-white font-body text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[var(--forest-600)] transition-colors">Back to home</Link>
        </div>
      </div>
    );
  }

  const active = NAV.filter(n => n.to).find(n => n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)) || NAV[0];
  const initial = (user.full_name || user.email || 'A')[0].toUpperCase();

  return (
    <div className="min-h-screen bg-[var(--paper)] flex">
      {/* Mobile overlay */}
      {navOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setNavOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 z-50 h-screen w-64 bg-[var(--ink-deep)] flex flex-col p-4 transition-transform md:translate-x-0 ${navOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <Link to="/" className="flex items-center gap-2 px-2 pb-2">
          <Logo />
          <span className="font-body font-semibold text-white">DepartingNotes</span>
        </Link>
        <span className="badge-gold w-max ml-2 mb-3">Admin Console</span>
        <nav className="flex-1 overflow-y-auto space-y-0.5">
          {NAV.map((item, i) => item.section ? (
            <p key={i} className="font-body text-[10px] uppercase tracking-[0.16em] text-white/30 px-3 pt-4 pb-1">{item.section}</p>
          ) : (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-colors ${
                isActive ? 'bg-[var(--forest)] text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}>
              <item.icon size={17} />
              <span className="flex-1">{item.label}</span>
              {item.to === '/admin/queue' && pendingCount > 0 && (
                <span className="bg-[var(--gold)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{pendingCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-3 mt-3">
          <div className="flex items-center gap-3 px-2 mb-2">
            <span className="w-9 h-9 rounded-full bg-[var(--gold)] text-white flex items-center justify-center font-heading font-bold flex-shrink-0">{initial}</span>
            <div className="min-w-0">
              <p className="font-body text-sm font-semibold text-white truncate">{user.full_name || user.email}</p>
              <p className="font-body text-xs text-white/40">Administrator</p>
            </div>
          </div>
          <button onClick={() => base44.auth.logout('/')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm text-white/60 hover:text-white hover:bg-white/5 w-full transition-colors">
            <LogOut size={17} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-[var(--paper)]/85 backdrop-blur border-b border-[var(--border)] flex items-center gap-4 px-5 md:px-8 py-4">
          <button className="md:hidden text-[var(--forest)]" onClick={() => setNavOpen(o => !o)}>
            {navOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div>
            <h1 className="font-heading text-xl font-semibold text-[var(--forest)] leading-tight">{active.title}</h1>
            <p className="font-body text-xs text-[var(--text-mute)]">{active.sub}</p>
          </div>
        </header>
        <div className="p-5 md:p-8 max-w-6xl w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}