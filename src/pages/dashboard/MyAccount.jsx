import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { PLAN_LABELS, getPlanFeatures } from '@/lib/planPermissions';

const inputCls = "w-full bg-white border border-[var(--border)] focus:border-[var(--forest)] text-[var(--text)] rounded-xl px-4 py-3 font-body text-sm outline-none transition-colors";
const labelCls = "font-body text-xs font-semibold text-[var(--text)] block mb-2";

export default function MyAccount() {
  const [user, setUser] = useState(null);
  const [member, setMember] = useState(null);
  const [executorRecord, setExecutorRecord] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingExec, setSavingExec] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);
  const [savedExec, setSavedExec] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', executor_name: '', executor_email: '', executor_phone: '' });
  const [twoFactor, setTwoFactor] = useState(false);
  const [language, setLanguage] = useState('en');
  const [releaseTiming, setReleaseTiming] = useState('immediately');

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      setUser(u);
      const members = await base44.entities.Member.filter({ user_id: u.id });
      if (members.length > 0) {
        const m = members[0];
        setMember(m);
        setForm({
          first_name: m.first_name || '',
          last_name: m.last_name || '',
          executor_name: m.executor_name || '',
          executor_email: m.executor_email || '',
          executor_phone: m.executor_phone || '',
        });
        setTwoFactor(!!m.two_factor_enabled);
        setLanguage(m.language_preference || 'en');
      }
      const executors = await base44.entities.Executor.filter({ created_by_id: u.id, status: 'active' });
      if (executors.length > 0) {
        const ex = executors[0];
        setExecutorRecord(ex);
        setForm(prev => ({
          ...prev,
          executor_name: ex.full_name || prev.executor_name,
          executor_email: ex.email || prev.executor_email,
          executor_phone: ex.phone || prev.executor_phone,
        }));
      }
    };
    load();
  }, []);

  // Returns existing member or creates one if missing (e.g. user registered without completing the flow)
  const ensureMember = async () => {
    if (member) return member;
    const u = user || await base44.auth.me();
    const created = await base44.entities.Member.create({
      user_id: u.id,
      first_name: form.first_name || u.full_name?.split(' ')[0] || '',
      last_name: form.last_name || u.full_name?.split(' ').slice(1).join(' ') || '',
      tier: 'free',
      status: 'active',
    });
    setMember(created);
    return created;
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const m = await ensureMember();
      const updated = await base44.entities.Member.update(m.id, { first_name: form.first_name, last_name: form.last_name });
      setMember(updated);
      setSavedProfile(true);
      setTimeout(() => setSavedProfile(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveExecutor = async () => {
    setSavingExec(true);
    try {
      const m = await ensureMember();
      const updated = await base44.entities.Member.update(m.id, {
        executor_name: form.executor_name,
        executor_email: form.executor_email,
        executor_phone: form.executor_phone,
      });
      setMember(updated);
      // Save to Executor database
      const executorData = {
        member_id: m.id,
        full_name: form.executor_name,
        email: form.executor_email,
        phone: form.executor_phone,
        status: 'active',
      };
      if (executorRecord) {
        const ex = await base44.entities.Executor.update(executorRecord.id, executorData);
        setExecutorRecord(ex);
      } else {
        const ex = await base44.entities.Executor.create(executorData);
        setExecutorRecord(ex);
      }
      setSavedExec(true);
      setTimeout(() => setSavedExec(false), 2500);
    } finally {
      setSavingExec(false);
    }
  };

  const toggleTwoFactor = async () => {
    const next = !twoFactor;
    setTwoFactor(next);
    const m = await ensureMember();
    await base44.entities.Member.update(m.id, { two_factor_enabled: next });
  };

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    const m = await ensureMember();
    await base44.entities.Member.update(m.id, { language_preference: lang });
  };

  const tier = member?.tier || 'free';
  const planLabel = PLAN_LABELS[tier] || 'Free';
  const planPrice = getPlanFeatures(tier).annualPrice;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

        {/* Profile */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-7">
          <h2 className="font-heading text-xl font-semibold text-[var(--forest)] mb-5">Profile</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>First name</label>
              <input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Last name</label>
              <input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} className={inputCls} />
            </div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Email</label>
            <input value={user?.email || ''} disabled className={`${inputCls} bg-[var(--paper)] cursor-not-allowed text-[var(--text-soft)]`} />
          </div>
          <div className="mb-5">
            <label className={labelCls}>Password</label>
            <input type="password" value="••••••••••" disabled className={`${inputCls} bg-[var(--paper)] cursor-not-allowed`} />
          </div>
          <button onClick={handleSaveProfile} disabled={saving}
            className="bg-[var(--forest)] text-white font-body text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[var(--forest-600)] transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : savedProfile ? 'Saved ✓' : 'Save changes'}
          </button>
        </div>

        {/* Executor */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-7">
          <h2 className="font-heading text-xl font-semibold text-[var(--forest)] mb-2">Executor</h2>
          <p className="font-body text-sm text-[var(--text-mute)] mb-5">
            The trusted person who will notify us, so your messages can be delivered.
          </p>
          <div className="mb-4">
            <label className={labelCls}>Executor name</label>
            <input value={form.executor_name} onChange={e => setForm({ ...form, executor_name: e.target.value })}
              placeholder="Their full name" className={inputCls} />
          </div>
          <div className="mb-4">
            <label className={labelCls}>Executor email</label>
            <input type="email" value={form.executor_email} onChange={e => setForm({ ...form, executor_email: e.target.value })}
              placeholder="their@email.com" className={inputCls} />
          </div>
          <div className="mb-5">
            <label className={labelCls}>Executor phone</label>
            <input type="tel" value={form.executor_phone} onChange={e => setForm({ ...form, executor_phone: e.target.value })}
              placeholder="(555) 000-0000" className={inputCls} />
          </div>
          <button onClick={handleSaveExecutor} disabled={savingExec}
            className="bg-[var(--forest)] text-white font-body text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[var(--forest-600)] transition-colors disabled:opacity-60">
            {savingExec ? 'Saving...' : savedExec ? 'Saved ✓' : 'Save executor'}
          </button>
        </div>

        {/* Billing */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-7">
          <h2 className="font-heading text-xl font-semibold text-[var(--forest)] mb-5">Billing</h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="font-body text-sm text-[var(--text-soft)]">Current plan</span>
              <span className="badge-gold">{planLabel}{planPrice ? ` - $${planPrice}/yr` : ''}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="font-body text-sm text-[var(--text-soft)]">Next renewal</span>
              <span className="font-body text-sm font-bold text-[var(--text)]">{member?.renewal_date || '—'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="font-body text-sm text-[var(--text-soft)]">Payment method</span>
              <span className="font-body text-sm text-[var(--text-mute)]">Visa ···· 4242</span>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <Link to="/plans" className="border border-[var(--border)] text-[var(--forest)] hover:border-[var(--forest)] transition-all font-body text-sm font-semibold px-5 py-2 rounded-full">
              Change plan
            </Link>
            <button className="border border-red-200 text-red-400 hover:border-red-400 hover:text-red-500 transition-all font-body text-sm font-semibold px-5 py-2 rounded-full">
              Cancel membership
            </button>
          </div>
        </div>

        {/* Security & preferences */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-7">
          <h2 className="font-heading text-xl font-semibold text-[var(--forest)] mb-5">Security &amp; preferences</h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <div>
                <p className="font-body text-sm font-bold text-[var(--text)]">Two-factor authentication</p>
                <p className="font-body text-xs text-[var(--text-mute)]">Recommended for your protection</p>
              </div>
              <button onClick={toggleTwoFactor}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${twoFactor ? 'bg-[var(--forest)]' : 'bg-[var(--sage-soft)]'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${twoFactor ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <div>
                <p className="font-body text-sm font-bold text-[var(--text)]">Language</p>
                <p className="font-body text-xs text-[var(--text-mute)]">English / Español</p>
              </div>
              <div className="flex bg-[var(--paper-2)] rounded-full p-0.5">
                {[{ key: 'en', label: 'EN' }, { key: 'es', label: 'ES' }].map(lang => (
                  <button key={lang.key} onClick={() => changeLanguage(lang.key)}
                    className={`font-body text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                      language === lang.key ? 'bg-white text-[var(--forest)] shadow-sm' : 'text-[var(--text-mute)]'
                    }`}>
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-body text-sm font-bold text-[var(--text)]">Release timing</p>
                <p className="font-body text-xs text-[var(--text-mute)]">When materials release after death is confirmed</p>
              </div>
              <select value={releaseTiming} onChange={e => setReleaseTiming(e.target.value)}
                className="bg-white border border-[var(--border)] rounded-lg px-3 py-1.5 font-body text-xs text-[var(--text)] outline-none">
                <option value="immediately">Immediately</option>
                <option value="30days">After 30 days</option>
                <option value="90days">After 90 days</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}