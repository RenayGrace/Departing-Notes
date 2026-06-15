import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const Logo = () => (
  <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
    <rect x="3" y="14" width="34" height="22" rx="6" fill="#1F3D34"/>
    <path d="M6 17.5 20 27l14-9.5" stroke="#FBF8F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 14c0-4 2.4-6.8 0-11-2.4 4.2 0 7 0 11Z" fill="#8BA888"/>
    <path d="M20 14c.2-3 2.6-4.6 5-5.2-1 2.8-2.6 4.4-5 5.2Z" fill="#B9802F"/>
    <circle cx="20" cy="5" r="1.8" fill="#EAD9BC"/>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center px-5">
      <Link to="/" className="flex items-center gap-2.5 mb-10">
        <Logo />
        <span className="font-body font-semibold text-[var(--forest)] text-lg">DepartingNotes</span>
      </Link>

      <div className="dn-card p-8 w-full max-w-md">
        <h1 className="font-heading text-2xl font-bold text-[var(--text)] mb-1">Welcome back</h1>
        <p className="font-body text-[var(--text-soft)] text-sm mb-7">Sign in to access your vault.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Email address</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="dn-input" />
          </div>
          <div className="relative">
            <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Password</label>
            <input required type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="dn-input pr-12" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-9 text-[var(--text-mute)] hover:text-[var(--forest)]">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="font-body text-xs text-[var(--gold)] hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Log In'}
          </button>
        </form>

        <p className="font-body text-[var(--text-mute)] text-sm text-center mt-6">
          No account? <Link to="/register" className="text-[var(--forest)] font-medium hover:underline">Create one free</Link>
        </p>
      </div>
    </div>
  );
}