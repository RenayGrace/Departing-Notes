import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Mail, Trash2, Edit3, Save, X, FileText, Lock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { getPlanFeatures, PLAN_LABELS } from '@/lib/planPermissions';
import { Link } from 'react-router-dom';

// ── Milestone Delivery modal (Peace+ only) ─────────────────────────────────
function MilestoneSelector({ value, onChange }) {
  const occasions = ['Graduation', 'Wedding', 'Birthday', 'New Baby', 'Anniversary', 'Other'];
  return (
    <div className="bg-[var(--sage-soft)] border border-[var(--sage)]/40 rounded-xl p-4">
      <p className="font-body text-xs font-semibold text-[var(--forest)] uppercase tracking-wide mb-3 flex items-center gap-2">
        <Calendar size={13} /> Milestone Delivery (optional)
      </p>
      <p className="font-body text-xs text-[var(--text-soft)] mb-3">
        Hold this letter until a future life moment. Your designated distributor decides the exact timing.
      </p>
      <div className="flex flex-wrap gap-2">
        {occasions.map(o => (
          <button key={o} type="button" onClick={() => onChange(value === o ? '' : o)}
            className={`px-3 py-1 rounded-full text-xs font-body font-semibold border transition-all ${
              value === o ? 'bg-[var(--forest)] text-white border-[var(--forest)]' : 'border-[var(--border)] text-[var(--text-soft)] hover:border-[var(--forest)]'
            }`}>{o}</button>
        ))}
      </div>
    </div>
  );
}

export default function MyLetters() {
  const [letters, setLetters] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [member, setMember] = useState(null);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', content: '', recipient_ids: [], status: 'draft', milestone_occasion: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const u = await base44.auth.me();
        const [l, r, members] = await Promise.all([
          base44.entities.Letter.filter({ created_by_id: u.id }),
          base44.entities.Recipient.filter({ created_by_id: u.id }),
          base44.entities.Member.filter({ user_id: u.id }),
        ]);
        setLetters(l);
        setRecipients(r);
        if (members.length > 0) setMember(members[0]);
      } catch (err) {
        console.error('Failed to load letters:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const perms = getPlanFeatures(member?.tier);
  const atLetterLimit = !perms.unlimitedLetters && letters.length >= perms.maxLetters;

  const startNew = () => {
    if (atLetterLimit) return;
    setEditing('new');
    setForm({ title: '', content: '', recipient_ids: [], status: 'draft', milestone_occasion: '' });
  };

  const handleSave = async (status) => {
    const u = await base44.auth.me();
    const data = {
      ...form,
      status,
      last_edited: new Date().toISOString(),
      created_by_id: u.id,
      // Only save milestone if plan allows it
      milestone_occasion: perms.milestoneDelivery ? form.milestone_occasion : '',
    };
    if (editing === 'new') {
      const created = await base44.entities.Letter.create(data);
      setLetters(prev => [created, ...prev]);
    } else {
      const updated = await base44.entities.Letter.update(editing, data);
      setLetters(prev => prev.map(l => l.id === editing ? updated : l));
    }
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this letter? This cannot be undone.')) return;
    await base44.entities.Letter.delete(id);
    setLetters(prev => prev.filter(l => l.id !== id));
  };

  const openEdit = (letter) => {
    setEditing(letter.id);
    setForm({
      title: letter.title,
      content: letter.content || '',
      recipient_ids: letter.recipient_ids || [],
      status: letter.status,
      milestone_occasion: letter.milestone_occasion || '',
    });
  };

  // ── Editor view ────────────────────────────────────────────────────────────
  if (editing) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-body text-[var(--gold)] text-xs font-semibold uppercase tracking-wider mb-1">My Letters</p>
            <h1 className="font-heading text-3xl font-bold text-[var(--forest)]">
              {editing === 'new' ? 'Write a New Letter' : 'Edit Letter'}
            </h1>
          </div>
          <button onClick={() => setEditing(null)} className="text-[var(--text-mute)] hover:text-[var(--text)] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="font-body text-[var(--text-mute)] text-xs tracking-wide uppercase block mb-2">Letter Title *</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full bg-white border border-[var(--border)] focus:border-[var(--forest)] text-[var(--text)] rounded-xl px-4 py-3 font-body text-sm outline-none transition-colors"
              placeholder="e.g. A Letter to My Daughter"
            />
          </div>

          {/* Recipients */}
          <div>
            <label className="font-body text-[var(--text-mute)] text-xs tracking-wide uppercase block mb-2">Recipients</label>
            <div className="flex flex-wrap gap-2">
              {recipients.map(r => (
                <button key={r.id} type="button"
                  onClick={() => {
                    const ids = form.recipient_ids.includes(r.id)
                      ? form.recipient_ids.filter(id => id !== r.id)
                      : [...form.recipient_ids, r.id];
                    setForm({ ...form, recipient_ids: ids });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-body transition-all border ${
                    form.recipient_ids.includes(r.id)
                      ? 'bg-[var(--sage-soft)] border-[var(--sage)] text-[var(--forest)]'
                      : 'border-[var(--border)] text-[var(--text-soft)] hover:border-[var(--sage)]'
                  }`}
                >
                  {r.full_name}
                </button>
              ))}
              {recipients.length === 0 && (
                <p className="font-body text-[var(--text-mute)] text-xs">
                  No recipients yet.{' '}
                  <Link to="/dashboard/recipients" className="text-[var(--gold)] hover:underline">Add recipients first.</Link>
                </p>
              )}
            </div>
          </div>

          {/* Milestone Delivery — Peace+ only */}
          {perms.milestoneDelivery ? (
            <MilestoneSelector value={form.milestone_occasion} onChange={v => setForm({ ...form, milestone_occasion: v })} />
          ) : (
            <div className="flex items-center gap-3 bg-[var(--gold-soft)] border border-[var(--gold)]/20 rounded-xl p-4">
              <Lock size={14} className="text-[var(--gold)] flex-shrink-0" />
              <p className="font-body text-sm text-[var(--text-soft)]">
                <strong>Milestone Delivery</strong> (hold letters for graduations, weddings, etc.) is available from{' '}
                <strong>The Peace Plan</strong> and above.{' '}
                <Link to="/plans" className="text-[var(--gold)] font-semibold hover:underline">Upgrade →</Link>
              </p>
            </div>
          )}

          {/* Content */}
          <div>
            <label className="font-body text-[var(--text-mute)] text-xs tracking-wide uppercase block mb-2">Your Letter</label>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              placeholder="Write your letter here..."
              rows={16}
              className="w-full bg-white border border-[var(--border)] focus:border-[var(--forest)] rounded-xl px-4 py-3 font-body text-sm text-[var(--text)] outline-none transition-colors resize-y leading-relaxed"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSave('draft')}
              className="border border-[var(--border)] text-[var(--text-soft)] hover:border-[var(--forest)] hover:text-[var(--forest)] transition-all px-6 py-3 rounded-full font-body text-sm flex items-center gap-2">
              <Save size={14} /> Save Draft
            </button>
            <button onClick={() => handleSave('published')}
              className="inline-flex items-center gap-2 bg-[var(--forest)] text-white px-6 py-3 rounded-full font-body text-sm font-semibold hover:bg-[var(--forest-600)] transition-colors">
              <FileText size={14} /> Publish to Vault
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-body text-[var(--gold)] text-xs font-semibold uppercase tracking-wider mb-1">Dashboard</p>
          <h1 className="font-heading text-3xl font-bold text-[var(--forest)]">My Letters</h1>
        </div>
        {atLetterLimit ? (
          <div className="flex items-center gap-2 bg-[var(--gold-soft)] border border-[var(--gold)]/20 rounded-xl px-4 py-2">
            <Lock size={14} className="text-[var(--gold)]" />
            <span className="font-body text-xs text-[var(--text-soft)]">1-letter limit on Free plan —</span>
            <Link to="/plans" className="font-body text-xs text-[var(--gold)] font-semibold hover:underline">Upgrade</Link>
          </div>
        ) : (
          <button onClick={startNew}
            className="inline-flex items-center gap-2 bg-[var(--forest)] text-white font-body text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[var(--forest-600)] transition-colors">
            <Plus size={14} /> Write New Letter
          </button>
        )}
      </div>

      {/* Free plan notice */}
      {member?.tier === 'free' && (
        <div className="flex items-start gap-3 bg-[var(--paper-2)] border border-[var(--border)] rounded-xl p-4 mb-6">
          <Lock size={14} className="text-[var(--gold)] flex-shrink-0 mt-0.5" />
          <p className="font-body text-sm text-[var(--text-soft)]">
            <strong className="text-[var(--text)]">Free plan:</strong> You can write 1 letter addressed to as many recipients as you like.{' '}
            <Link to="/plans" className="text-[var(--gold)] font-semibold hover:underline">Upgrade for unlimited letters + milestone delivery</Link>
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-[var(--border)] rounded-2xl p-6 animate-pulse">
              <div className="h-4 w-48 bg-[var(--paper-2)] rounded mb-2" />
              <div className="h-3 w-32 bg-[var(--paper-2)] rounded" />
            </div>
          ))}
        </div>
      ) : letters.length === 0 ? (
        <div className="bg-white border border-[var(--border)] rounded-2xl p-16 text-center">
          <Mail size={32} className="text-[var(--sage)] mx-auto mb-6" />
          <h3 className="font-heading text-2xl text-[var(--forest)] font-semibold mb-3">No letters yet</h3>
          <p className="font-body text-[var(--text-mute)] text-sm mb-8">Write your first letter to someone you love.</p>
          <button onClick={startNew}
            className="inline-flex items-center gap-2 bg-[var(--forest)] text-white font-body text-sm font-semibold px-8 py-3 rounded-full hover:bg-[var(--forest-600)] transition-colors">
            Write Your First Letter
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {letters.map(letter => {
            const letterRecipients = recipients.filter(r => (letter.recipient_ids || []).includes(r.id));
            return (
              <div key={letter.id} className="bg-white border border-[var(--border)] rounded-2xl p-6 flex items-center justify-between hover:shadow-sm transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-heading text-lg text-[var(--forest)] font-semibold truncate">{letter.title}</h3>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-body font-semibold ${
                      letter.status === 'published' ? 'bg-[var(--sage-soft)] text-[var(--forest)]' : 'bg-[var(--paper-2)] text-[var(--text-mute)]'
                    }`}>
                      {letter.status === 'published' ? 'In Vault' : 'Draft'}
                    </span>
                    {letter.milestone_occasion && (
                      <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body font-semibold bg-[var(--gold-soft)] text-[var(--gold)]">
                        <Calendar size={10} /> {letter.milestone_occasion}
                      </span>
                    )}
                  </div>
                  <p className="font-body text-[var(--text-mute)] text-xs">
                    {letterRecipients.length > 0 ? `For: ${letterRecipients.map(r => r.full_name).join(', ')}` : 'No recipients assigned'}
                    {letter.last_edited && ` · Edited ${format(new Date(letter.last_edited), 'MMM d, yyyy')}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={() => openEdit(letter)}
                    className="w-8 h-8 border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-mute)] hover:border-[var(--forest)] hover:text-[var(--forest)] transition-all">
                    <Edit3 size={12} />
                  </button>
                  <button onClick={() => handleDelete(letter.id)}
                    className="w-8 h-8 border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-mute)] hover:border-red-400 hover:text-red-500 transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}