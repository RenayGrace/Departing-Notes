import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Users, Edit3, Trash2, Save, X } from 'lucide-react';

export default function MyRecipients() {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState({ full_name: '', email: '', relationship: '', phone: '' });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      const r = await base44.entities.Recipient.filter({ created_by_id: u.id });
      setRecipients(r);
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const u = await base44.auth.me();
    const payload = { ...form, member_id: u.id };
    if (editing) {
      const updated = await base44.entities.Recipient.update(editing, payload);
      setRecipients(prev => prev.map(r => r.id === editing ? updated : r));
    } else {
      const created = await base44.entities.Recipient.create(payload);
      setRecipients(prev => [...prev, created]);
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm({ full_name: '', email: '', relationship: '', phone: '' });
  };

  const openEdit = (r) => {
    setEditing(r.id);
    setForm({ full_name: r.full_name, email: r.email, relationship: r.relationship, phone: r.phone || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this recipient?')) return;
    await base44.entities.Recipient.delete(id);
    setRecipients(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-body text-[var(--gold)] text-xs font-semibold uppercase tracking-wider mb-1">Dashboard</p>
          <h1 className="font-heading text-3xl font-bold text-[var(--forest)]">My Recipients</h1>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm({ full_name: '', email: '', relationship: '', phone: '' }); }}
          className="inline-flex items-center gap-2 bg-[var(--forest)] text-white font-body text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[var(--forest-600)] transition-colors"
        >
          <Plus size={14} /> Add Recipient
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-white border border-[var(--border)] rounded-2xl p-8 mb-8 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-heading text-xl text-[var(--forest)] font-semibold">{editing ? 'Edit Recipient' : 'Add Recipient'}</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-[var(--text-mute)] hover:text-[var(--text)]"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'full_name',    label: 'Full Name',        type: 'text',  required: true },
              { name: 'email',        label: 'Email Address',    type: 'email', required: true },
              { name: 'relationship', label: 'Relationship',     type: 'text',  required: true },
              { name: 'phone',        label: 'Phone (optional)', type: 'tel',   required: false },
            ].map(f => (
              <div key={f.name}>
                <label className="font-body text-[var(--text-mute)] text-xs tracking-wide uppercase block mb-2">
                  {f.label} {f.required && '*'}
                </label>
                <input required={f.required} type={f.type} value={form[f.name]}
                  onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                  className="w-full bg-white border border-[var(--border)] focus:border-[var(--forest)] text-[var(--text)] rounded-xl px-4 py-3 font-body text-sm outline-none transition-colors" />
              </div>
            ))}
          </div>
          {error && <p className="font-body text-red-500 text-xs">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowForm(false)}
              className="border border-[var(--border)] text-[var(--text-soft)] px-6 py-2.5 rounded-full font-body text-sm">Cancel</button>
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 bg-[var(--forest)] text-white px-6 py-2.5 rounded-full font-body text-sm font-semibold hover:bg-[var(--forest-600)] transition-colors disabled:opacity-60">
              <Save size={12} /> {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Recipient'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white border border-[var(--border)] rounded-2xl p-5 h-20 animate-pulse" />)}
        </div>
      ) : recipients.length === 0 ? (
        <div className="bg-white border border-[var(--border)] rounded-2xl p-16 text-center">
          <Users size={32} className="text-[var(--sage)] mx-auto mb-6" />
          <h3 className="font-heading text-2xl text-[var(--forest)] font-semibold mb-3">No recipients yet</h3>
          <p className="font-body text-[var(--text-mute)] text-sm">Add the people you want to receive your letters and documents.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recipients.map(r => (
            <div key={r.id} className="bg-white border border-[var(--border)] rounded-2xl p-5 flex items-center justify-between hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--sage-soft)] flex items-center justify-center flex-shrink-0">
                  <span className="font-heading text-[var(--forest)] font-semibold text-sm">{r.full_name[0]}</span>
                </div>
                <div>
                  <p className="font-heading text-[var(--forest)] font-semibold">{r.full_name}</p>
                  <p className="font-body text-[var(--text-mute)] text-xs">{r.email} · {r.relationship}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(r)}
                  className="w-8 h-8 border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-mute)] hover:border-[var(--forest)] hover:text-[var(--forest)] transition-all">
                  <Edit3 size={12} />
                </button>
                <button onClick={() => handleDelete(r.id)}
                  className="w-8 h-8 border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-mute)] hover:border-red-400 hover:text-red-500 transition-all">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}