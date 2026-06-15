import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Mail, Archive, Globe, ArrowRight, Star, AlertTriangle, Lock } from 'lucide-react';
import { getPlanFeatures, PLAN_LABELS, getPlanSummary } from '@/lib/planPermissions';

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const [member, setMember] = useState(null);
  const [letterCount, setLetterCount] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [recipientCount, setRecipientCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      setUser(u);
      const [letters, docs, recipients, members] = await Promise.all([
        base44.entities.Letter.filter({ created_by_id: u.id }),
        base44.entities.VaultDocument.filter({ created_by_id: u.id }),
        base44.entities.Recipient.filter({ created_by_id: u.id }),
        base44.entities.Member.filter({ user_id: u.id }),
      ]);
      setLetterCount(letters.length);
      setDocCount(docs.length);
      setRecipientCount(recipients.length);
      if (members.length > 0) setMember(members[0]);
    };
    load();
  }, []);

  const tier = member?.tier || 'free';
  const perms = getPlanFeatures(tier);
  const planLabel = PLAN_LABELS[tier] || 'Free';

  const vaultPct = Math.min(100, letterCount * 20 + docCount * 25 + (recipientCount > 0 ? 15 : 0) + (member?.executor_name ? 15 : 0));

  const tasks = [
    { label: 'Account created & verified', done: true },
    { label: 'First letter written', done: letterCount > 0 },
    { label: 'Designate your executor', done: !!member?.executor_name },
    { label: 'Upload a key document', done: docCount > 0 },
  ];

  // Only show actions available to this plan
  const quickActions = [
    { label: 'Write a Letter', to: '/dashboard/letters', icon: Mail, desc: perms.unlimitedLetters ? 'Unlimited letters' : '1 letter (free plan)', available: true },
    { label: 'Upload a Document', to: '/dashboard/vault', icon: Archive, desc: 'Will, trust, directive…', available: true },
    { label: perms.canCreateTribe ? 'Create a Tribe' : 'Join a Tribe', to: '/dashboard/tribes', icon: Globe, desc: perms.canCreateTribe ? 'Earn 75 points each' : 'Join with an invite link', available: true },
  ];

  const { locked: lockedFeatures } = getPlanSummary(tier);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="font-body text-[var(--gold)] text-xs font-semibold uppercase tracking-wider mb-1">Your vault</p>
        <h1 className="font-heading text-3xl font-bold text-[var(--forest)]">{planLabel}</h1>
      </div>

      {/* Vault completion */}
      <div className="bg-white border border-[var(--border)] rounded-2xl p-7 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-body text-sm text-[var(--text-soft)] mb-1">Your vault completion</p>
            <p className="font-heading text-4xl font-bold text-[var(--forest)]">{vaultPct}%</p>
          </div>
          <div className="w-16 h-16 relative">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path stroke="#DCE6D8" strokeWidth="3.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path stroke="#1F3D34" strokeWidth="3.5" fill="none" strokeDasharray={`${vaultPct}, 100`}
                strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                className="transition-all duration-1000" />
            </svg>
          </div>
        </div>
        <div className="dn-progress-track mb-4">
          <div className="dn-progress-bar" style={{ width: `${vaultPct}%` }} />
        </div>
        <ul className="space-y-2">
          {tasks.map((t, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                t.done ? 'border-[var(--forest)] bg-[var(--forest)]' : 'border-[var(--border)]'
              }`}>
                {t.done && <svg viewBox="0 0 12 12" className="w-2.5 h-2.5"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
              </div>
              <span className={`font-body text-sm ${t.done ? 'text-[var(--text-soft)] line-through decoration-[var(--sage)]' : 'text-[var(--text-soft)]'}`}>
                {t.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Executor notice */}
      {!member?.executor_name && (
        <div className="bg-white border border-[var(--gold)]/20 bg-[var(--gold-soft)] rounded-2xl p-5 mb-5 flex items-start gap-3">
          <AlertTriangle size={16} className="text-[var(--gold)] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-body text-sm text-[var(--text-soft)]">
              <strong className="text-[var(--text)]">Action needed:</strong> You haven't designated an executor yet. They're the person who delivers your messages.
            </p>
          </div>
          <Link to="/dashboard/account" className="inline-flex items-center gap-1 bg-[var(--forest)] text-white font-body text-xs font-semibold px-4 py-1.5 rounded-full flex-shrink-0 hover:bg-[var(--forest-600)] transition-colors">Designate Executor</Link>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Letters', value: letterCount, icon: Mail, to: '/dashboard/letters' },
          { label: 'Documents', value: docCount, icon: Archive, to: '/dashboard/vault' },
          { label: 'Recipients', value: recipientCount, icon: Globe, to: '/dashboard/recipients' },
          { label: 'Points', value: (member?.points_balance || 0).toLocaleString(), icon: Star, to: '/dashboard/points' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} to={stat.to} className="bg-white border border-[var(--border)] rounded-2xl p-5 hover:shadow-md transition-shadow">
              <Icon size={16} className="text-[var(--sage)] mb-3" />
              <p className="font-heading text-2xl font-bold text-[var(--text)]">{stat.value}</p>
              <p className="font-body text-[var(--text-mute)] text-xs mt-0.5">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-[var(--border)] rounded-2xl p-6 mb-5">
        <h2 className="font-heading text-lg font-semibold text-[var(--forest)] mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <Link key={action.label} to={action.to}
                className="flex items-center gap-3 p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] hover:border-[var(--forest)]/30 hover:shadow-sm transition-all group">
                <div className="w-9 h-9 rounded-full bg-[var(--sage-soft)] flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-[var(--forest)]" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-[var(--text)] group-hover:text-[var(--forest)] transition-colors">{action.label}</p>
                  <p className="font-body text-xs text-[var(--text-mute)]">{action.desc}</p>
                </div>
                <ArrowRight size={13} className="ml-auto text-[var(--text-mute)] group-hover:text-[var(--forest)] transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Locked features upsell */}
      {lockedFeatures.length > 0 && (
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={14} className="text-[var(--gold)]" />
            <h2 className="font-heading text-lg font-semibold text-[var(--forest)]">Unlock more features</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {lockedFeatures.map(f => (
              <div key={f} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
                <div className="w-7 h-7 rounded-lg bg-[var(--gold-soft)] flex items-center justify-center flex-shrink-0">
                  <Lock size={12} className="text-[var(--gold)]" />
                </div>
                <span className="font-body text-sm text-[var(--text-soft)]">{f}</span>
              </div>
            ))}
          </div>
          <Link to="/plans" className="inline-flex items-center gap-2 bg-[var(--forest)] text-white font-body text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[var(--forest-600)] transition-colors">
            View Plans & Upgrade <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}