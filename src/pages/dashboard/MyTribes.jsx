import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Globe, Plus, Users, Copy, Check, X, Lock } from 'lucide-react';
import { getPlanFeatures } from '@/lib/planPermissions';
import { Link } from 'react-router-dom';

export default function MyTribes() {
  const [tribes, setTribes] = useState([]);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [copied, setCopied] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', privacy: 'public' });

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      const [myTribes, members] = await Promise.all([
        base44.entities.Tribe.filter({ creator_member_id: u.id }),
        base44.entities.Member.filter({ user_id: u.id }),
      ]);
      setTribes(myTribes);
      if (members.length > 0) setMember(members[0]);
      setLoading(false);
    };
    load();
  }, []);

  const perms = getPlanFeatures(member?.tier);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!perms.canCreateTribe) return;
    const u = await base44.auth.me();
    const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const created = await base44.entities.Tribe.create({
      ...form,
      creator_member_id: u.id,
      invite_code: inviteCode,
      member_count: 1,
    });
    await base44.entities.TribeMembership.create({ tribe_id: created.id, member_id: u.id, role: 'creator' });
    setTribes(prev => [created, ...prev]);
    setShowCreate(false);
    setForm({ name: '', description: '', privacy: 'public' });
  };

  const copyInvite = (tribe) => {
    navigator.clipboard.writeText(`https://departingnotes.com/join/${tribe.invite_code}`);
    setCopied(tribe.id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-body text-[var(--gold)] text-xs font-semibold uppercase tracking-wider mb-1">Dashboard</p>
          <h1 className="font-heading text-3xl font-bold text-[var(--forest)]">My Tribes</h1>
        </div>
        {perms.canCreateTribe ? (
          <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 bg-[var(--forest)] text-white font-body text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[var(--forest-600)] transition-colors">
            <Plus size={14} /> Create Tribe
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-[var(--gold-soft)] border border-[var(--gold)]/20 rounded-xl px-4 py-2">
            <Lock size={14} className="text-[var(--gold)]" />
            <span className="font-body text-xs text-[var(--text-soft)]">Creating tribes requires Peace Plan —</span>
            <Link to="/plans" className="font-body text-xs text-[var(--gold)] font-semibold hover:underline">Upgrade</Link>
          </div>
        )}
      </div>

      {/* Free plan notice */}
      {!perms.canCreateTribe && (
        <div className="flex items-start gap-3 bg-[var(--paper-2)] border border-[var(--border)] rounded-xl p-4 mb-6">
          <Lock size={14} className="text-[var(--gold)] flex-shrink-0 mt-0.5" />
          <p className="font-body text-sm text-[var(--text-soft)]">
            <strong className="text-[var(--text)]">Free plan:</strong> You can <strong>join</strong> tribes using an invite link, but creating your own tribe requires The Peace Plan or above.{' '}
            <Link to="/plans" className="text-[var(--gold)] font-semibold hover:underline">See plans</Link>
          </p>
        </div>
      )}

      {/* Privacy notice */}
      <div className="bg-[var(--sage-soft)] border border-[var(--sage)]/30 rounded-xl p-4 mb-6 flex items-start gap-3">
        <div className="w-1 h-full bg-[var(--sage)] flex-shrink-0 rounded-full min-h-[40px]" />
        <p className="font-body text-[var(--forest)] text-xs leading-relaxed">
          <strong>Privacy guaranteed:</strong> Joining a Tribe never shares your vault, letters, or documents with any tribe member. This is architecturally enforced — not just policy.
        </p>
      </div>

      {/* Create Form */}
      {showCreate && perms.canCreateTribe && (
        <form onSubmit={handleCreate} className="bg-white border border-[var(--border)] rounded-2xl p-8 mb-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-heading text-xl text-[var(--forest)] font-semibold">Create a New Tribe</h2>
            <button type="button" onClick={() => setShowCreate(false)} className="text-[var(--text-mute)] hover:text-[var(--text)]"><X size={18} /></button>
          </div>
          <div>
            <label className="font-body text-[var(--text-mute)] text-xs tracking-wide uppercase block mb-2">Tribe Name *</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white border border-[var(--border)] focus:border-[var(--forest)] text-[var(--text)] rounded-xl px-4 py-3 font-body text-sm outline-none transition-colors"
              placeholder="e.g. The Rivera Family, Class of '89, Sunday Book Club" />
          </div>
          <div>
            <label className="font-body text-[var(--text-mute)] text-xs tracking-wide uppercase block mb-2">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full bg-white border border-[var(--border)] focus:border-[var(--forest)] text-[var(--text)] rounded-xl px-4 py-3 font-body text-sm outline-none transition-colors resize-none"
              placeholder="Tell people what this Tribe is about..." />
          </div>
          <div>
            <label className="font-body text-[var(--text-mute)] text-xs tracking-wide uppercase block mb-2">Privacy</label>
            <div className="flex gap-3">
              {['public', 'private'].map(p => (
                <button key={p} type="button" onClick={() => setForm({ ...form, privacy: p })}
                  className={`px-5 py-2 rounded-full text-xs font-body font-semibold capitalize transition-all border ${
                    form.privacy === p ? 'bg-[var(--forest)] border-[var(--forest)] text-white' : 'border-[var(--border)] text-[var(--text-soft)]'
                  }`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="border border-[var(--border)] text-[var(--text-soft)] px-6 py-2.5 rounded-full font-body text-sm">Cancel</button>
            <button type="submit" className="bg-[var(--forest)] text-white px-6 py-2.5 rounded-full font-body text-sm font-semibold hover:bg-[var(--forest-600)] transition-colors">Create Tribe</button>
          </div>
        </form>
      )}

      {/* Tribes List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => <div key={i} className="bg-white border border-[var(--border)] rounded-2xl p-6 h-24 animate-pulse" />)}
        </div>
      ) : tribes.length === 0 ? (
        <div className="bg-white border border-[var(--border)] rounded-2xl p-16 text-center">
          <Globe size={32} className="text-[var(--sage)] mx-auto mb-6" />
          <h3 className="font-heading text-2xl text-[var(--forest)] font-semibold mb-3">No Tribes yet</h3>
          <p className="font-body text-[var(--text-mute)] text-sm mb-8">
            {perms.canCreateTribe
              ? 'Create a Tribe to connect with the people who matter to you.'
              : 'Join a Tribe using an invite link, or upgrade to create your own.'}
          </p>
          {perms.canCreateTribe && (
            <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 bg-[var(--forest)] text-white font-body text-sm font-semibold px-8 py-3 rounded-full hover:bg-[var(--forest-600)] transition-colors">
              Create Your First Tribe
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="font-heading text-xl text-[var(--forest)] font-semibold mb-4">Tribes I Created</h2>
          {tribes.map(tribe => (
            <div key={tribe.id} className="bg-white border border-[var(--border)] rounded-2xl p-6 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-heading text-xl text-[var(--forest)] font-semibold">{tribe.name}</h3>
                    <span className={`text-xs font-body font-semibold px-2 py-0.5 rounded-full border ${
                      tribe.privacy === 'public' ? 'border-[var(--sage)] text-[var(--forest)] bg-[var(--sage-soft)]' : 'border-[var(--border)] text-[var(--text-mute)]'
                    }`}>{tribe.privacy}</span>
                  </div>
                  {tribe.description && <p className="font-body text-[var(--text-soft)] text-sm mb-3">{tribe.description}</p>}
                  <div className="flex items-center gap-4 text-xs font-body text-[var(--text-mute)]">
                    <span className="flex items-center gap-1"><Users size={12} />{tribe.member_count || 1} member{tribe.member_count !== 1 ? 's' : ''}</span>
                    <span>Invite code: <span className="text-[var(--gold)] font-mono font-semibold">{tribe.invite_code}</span></span>
                  </div>
                </div>
                <button onClick={() => copyInvite(tribe)}
                  className="flex-shrink-0 flex items-center gap-2 border border-[var(--border)] hover:border-[var(--forest)] text-[var(--text-soft)] hover:text-[var(--forest)] px-4 py-2 rounded-full font-body text-xs transition-all">
                  {copied === tribe.id ? <Check size={12} className="text-[var(--forest)]" /> : <Copy size={12} />}
                  {copied === tribe.id ? 'Copied!' : 'Copy Invite'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}