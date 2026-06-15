import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Plans', to: '/plans' },
  { label: 'Partners', to: '/partners' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const Logo = () => (
  <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect x="3" y="14" width="34" height="22" rx="6" fill="#1F3D34"/>
    <path d="M6 17.5 20 27l14-9.5" stroke="#FBF8F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 14c0-4 2.4-6.8 0-11-2.4 4.2 0 7 0 11Z" fill="#8BA888"/>
    <path d="M20 14c.2-3 2.6-4.6 5-5.2-1 2.8-2.6 4.4-5 5.2Z" fill="#B9802F"/>
    <circle cx="20" cy="5" r="1.8" fill="#EAD9BC"/>
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[var(--paper)]/90 backdrop-blur-md shadow-sm border-b border-[var(--border)]' : 'bg-[var(--paper)]'
    }`}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 text-[var(--forest)] font-semibold text-lg hover:opacity-80 transition-opacity" aria-label="DepartingNotes home">
          <Logo />
          <span className="font-body font-semibold">DepartingNotes</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`font-body text-sm transition-colors hover:text-[var(--forest)] ${
                location.pathname === l.to ? 'text-[var(--forest)] font-medium' : 'text-[var(--text-soft)]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="font-body text-sm text-[var(--text-soft)] hover:text-[var(--forest)] transition-colors border border-[var(--border)] px-5 py-2 rounded-full hover:border-[var(--forest)]">
            Log In
          </Link>
          <Link to="/register" className="bg-[var(--forest)] text-white font-body font-semibold text-sm px-5 py-2 rounded-full hover:bg-[var(--forest-600)] transition-colors">
            Create Free Account
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-[var(--text-soft)] hover:text-[var(--forest)] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[var(--paper)] border-t border-[var(--border)]">
          <div className="px-5 py-4 flex flex-col gap-1">
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className="font-body text-sm py-2.5 text-[var(--text-soft)] hover:text-[var(--forest)] transition-colors border-b border-[var(--border)] last:border-0"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-3">
              <Link to="/login" className="border border-[var(--border)] text-[var(--text)] text-sm py-2.5 text-center rounded-full font-body">Log In</Link>
              <Link to="/register" className="bg-[var(--forest)] text-white text-sm py-2.5 text-center rounded-full font-body font-semibold">Create Free Account</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}