import { Link } from 'react-router-dom';

const Logo = () => (
  <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect x="3" y="14" width="34" height="22" rx="6" fill="#8BA888"/>
    <path d="M6 17.5 20 27l14-9.5" stroke="#FBF8F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 14c0-4 2.4-6.8 0-11-2.4 4.2 0 7 0 11Z" fill="rgba(255,255,255,0.5)"/>
    <path d="M20 14c.2-3 2.6-4.6 5-5.2-1 2.8-2.6 4.4-5 5.2Z" fill="#EAD9BC"/>
    <circle cx="20" cy="5" r="1.8" fill="#FBF8F3"/>
  </svg>
);

const SocialIcon = ({ href, children }) => (
  <a href={href} className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-colors text-sm font-body">
    {children}
  </a>
);

export default function Footer() {
  return (
    <footer className="bg-[var(--ink-deep)] text-white">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Logo />
              <span className="font-body font-semibold text-white">DepartingNotes</span>
            </div>
            <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem' }} className="text-[var(--gold-soft)] mb-5">
              Everyone deserves the right to say goodbye.
            </p>
            <div className="flex gap-2">
              <SocialIcon href="#">f</SocialIcon>
              <SocialIcon href="#">ig</SocialIcon>
              <SocialIcon href="#">in</SocialIcon>
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="font-body font-semibold text-white/60 text-xs uppercase tracking-widest mb-4">Explore</p>
            <ul className="space-y-2.5">
              {[
                { label: 'How It Works', to: '/how-it-works' },
                { label: 'Membership Plans', to: '/plans' },
                { label: 'Our Partners', to: '/partners' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="font-body text-sm text-white/50 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="font-body font-semibold text-white/60 text-xs uppercase tracking-widest mb-4">Account</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Create Account', to: '/register' },
                { label: 'Member Log In', to: '/login' },
                { label: 'Release Portal', to: '/release' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="font-body text-sm text-white/50 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="font-body font-semibold text-white/60 text-xs uppercase tracking-widest mb-4">Legal</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Terms of Service', to: '/terms' },
                { label: 'CCPA Notice', to: '/ccpa' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="font-body text-sm text-white/50 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-white/30 text-xs">© 2026 DepartingNotes Co. All Rights Reserved.</p>
          <p className="font-body text-white/30 text-xs">A platform by R. Grace Rodriguez, Esq.</p>
        </div>
      </div>
    </footer>
  );
}