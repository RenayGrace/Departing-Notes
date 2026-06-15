import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Mail, Download, RefreshCw, Check, Truck, Package, MapPin, Bell, Plus, Trash2, Search } from 'lucide-react';

const SHIPPING_STEPS = [
  { key: 'pending',    label: 'Order placed',      icon: Check,   date: 'May 28, 2026' },
  { key: 'processing', label: 'Printed & produced', icon: Check,   date: 'May 30, 2026' },
  { key: 'shipped',    label: 'In transit',         icon: Truck,   sub: 'Arriving in 3–5 business days' },
  { key: 'delivered',  label: 'Delivered',          icon: MapPin,  sub: 'Pending' },
];

export default function MyCard() {
  const [member, setMember] = useState(null);
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [contactForm, setContactForm] = useState({ full_name: '', relationship: '', phone: '', email: '' });

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      setUser(u);
      const [members, recipients] = await Promise.all([
        base44.entities.Member.filter({ user_id: u.id }),
        base44.entities.Recipient.filter({ created_by_id: u.id }),
      ]);
      if (members.length > 0) setMember(members[0]);
      setContacts(recipients);
      setLoading(false);
    };
    load();
  }, []);

  const statusIndex = SHIPPING_STEPS.findIndex(s => s.key === (member?.card_shipping_status || 'shipped'));
  const currentStep = statusIndex === -1 ? 2 : statusIndex;

  const handleAddContact = async (e) => {
    e.preventDefault();
    const u = await base44.auth.me();
    const created = await base44.entities.Recipient.create({ ...contactForm, member_id: u.id, created_by_id: u.id });
    setContacts(prev => [...prev, created]);
    setShowAddContact(false);
    setContactForm({ full_name: '', relationship: '', phone: '', email: '' });
  };

  const handleDeleteContact = async (id) => {
    if (!confirm('Remove this contact?')) return;
    await base44.entities.Recipient.delete(id);
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const memberId = member?.member_id || 'DN-0042-7841';
  const memberName = user?.full_name || 'Member Name';

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[var(--forest)]">My Keychain</h1>
          <p className="font-body text-[var(--text-mute)] text-sm mt-1">Your QR emergency keychain.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[var(--border)] rounded-full px-4 py-2 min-w-[200px]">
          <Search size={14} className="text-[var(--text-mute)]" />
          <span className="font-body text-sm text-[var(--text-mute)]">Search your vault...</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-6">
        {/* Left: Keychain card */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <h2 className="font-heading text-xl text-[var(--forest)] font-semibold mb-5">Your keychain</h2>

          {/* Card previews */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            {/* Front */}
            <div className="aspect-[1.586/1] bg-[var(--forest)] rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Mail size={16} className="text-white" />
                </div>
                <span className="font-heading text-white text-sm font-semibold tracking-wide">DepartingNotes</span>
              </div>
              <div>
                <p className="font-body text-white/50 text-xs mb-0.5">Member</p>
                <p className="font-heading text-[var(--gold-soft)] text-base font-light">{memberName}</p>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <p className="font-body text-white/40 text-xs mb-0.5">Member ID</p>
                    <p className="font-body text-white/80 text-xs tracking-widest">{memberId}</p>
                  </div>
                  {/* QR placeholder */}
                  <div className="w-10 h-10 bg-white/90 rounded p-1 grid grid-cols-3 gap-px">
                    {[1,1,0,1,0,1,0,1,1].map((v,i) => (
                      <div key={i} className={`rounded-sm ${v ? 'bg-[var(--forest)]' : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Back */}
            <div className="aspect-[1.586/1] bg-[var(--ink-deep)] rounded-xl p-4 flex flex-col justify-between">
              <p className="font-body text-white/40 text-xs">Back of card</p>
              <p className="font-body text-white/75 text-xs leading-relaxed italic">
                "I am a DepartingNotes member. In the event of my passing, please visit DepartingNotes.com/release and submit a copy of my death certificate to release my final messages to my loved ones."
              </p>
              <p className="font-body text-[var(--gold-soft)]/60 text-xs">DepartingNotes.com/release</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mb-5">
            <button className="border border-[var(--border)] text-[var(--text)] font-body text-sm font-medium px-4 py-2 rounded-full hover:border-[var(--forest)] transition-colors flex items-center gap-2">
              <Download size={14} /> Download QR
            </button>
            <button className="border border-[var(--border)] text-[var(--text)] font-body text-sm font-medium px-4 py-2 rounded-full hover:border-[var(--forest)] transition-colors flex items-center gap-2">
              <RefreshCw size={14} /> Order Replacement · $15
            </button>
          </div>

          {/* Info notice */}
          <div className="flex items-start gap-3 bg-[var(--sage-soft)] rounded-xl p-4">
            <div className="w-8 h-8 bg-[var(--forest)] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bell size={14} className="text-white" />
            </div>
            <p className="font-body text-sm text-[var(--forest)] leading-relaxed">
              In an emergency, first responders scan your keychain — your emergency contacts are notified, your emergency vault opens by the platform's rules, and your designated letters can be triggered for release.
            </p>
          </div>
        </div>

        {/* Right: Shipping status */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <h2 className="font-heading text-xl text-[var(--forest)] font-semibold mb-6">Shipping status</h2>
          <div className="flex flex-col gap-0">
            {SHIPPING_STEPS.map((step, i) => {
              const done = i < currentStep;
              const active = i === currentStep;
              const pending = i > currentStep;
              const StepIcon = step.icon;
              return (
                <div key={step.key} className="flex gap-4 pb-6 last:pb-0 relative">
                  {/* Vertical line */}
                  {i < SHIPPING_STEPS.length - 1 && (
                    <div className={`absolute left-[15px] top-8 bottom-0 w-0.5 ${done ? 'bg-[var(--forest)]' : 'bg-[var(--border)]'}`} />
                  )}
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    done ? 'bg-[var(--forest)]' :
                    active ? 'bg-[var(--gold)]' :
                    'bg-[var(--paper-2)] border border-[var(--border)]'
                  }`}>
                    <StepIcon size={14} className={done || active ? 'text-white' : 'text-[var(--text-mute)]'} />
                  </div>
                  {/* Text */}
                  <div className="pt-0.5">
                    <p className={`font-body text-sm font-semibold ${pending ? 'text-[var(--text-mute)]' : 'text-[var(--text)]'}`}>
                      {step.label}
                    </p>
                    <p className="font-body text-xs text-[var(--text-mute)] mt-0.5">
                      {step.date || step.sub || ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Emergency contacts */}
      <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading text-xl text-[var(--forest)] font-semibold">Emergency contacts</h2>
          <button
            onClick={() => setShowAddContact(true)}
            className="border border-[var(--border)] text-[var(--text)] font-body text-sm px-4 py-2 rounded-full hover:border-[var(--forest)] transition-colors flex items-center gap-2"
          >
            <Plus size={14} /> Add contact
          </button>
        </div>
        <p className="font-body text-sm text-[var(--text-mute)] mb-6">Notified in order the moment your keychain is scanned.</p>

        {/* Add contact form */}
        {showAddContact && (
          <form onSubmit={handleAddContact} className="bg-[var(--paper)] rounded-xl p-5 mb-5 grid grid-cols-2 gap-3">
            {[
              { name: 'full_name', label: 'Full Name', type: 'text', required: true },
              { name: 'relationship', label: 'Relationship', type: 'text', required: true },
              { name: 'phone', label: 'Phone', type: 'tel' },
              { name: 'email', label: 'Email', type: 'email' },
            ].map(f => (
              <div key={f.name}>
                <label className="font-body text-[var(--text-mute)] text-xs uppercase tracking-wide block mb-1">{f.label}</label>
                <input
                  required={f.required}
                  type={f.type}
                  value={contactForm[f.name]}
                  onChange={e => setContactForm({ ...contactForm, [f.name]: e.target.value })}
                  className="w-full border border-[var(--border)] focus:border-[var(--forest)] rounded-lg px-3 py-2 font-body text-sm outline-none"
                />
              </div>
            ))}
            <div className="col-span-2 flex gap-3 mt-1">
              <button type="button" onClick={() => setShowAddContact(false)} className="border border-[var(--border)] text-[var(--text-mute)] px-4 py-2 rounded-lg font-body text-sm">Cancel</button>
              <button type="submit" className="bg-[var(--forest)] text-white px-4 py-2 rounded-lg font-body text-sm font-semibold hover:bg-[var(--forest-600)] transition-colors">Add Contact</button>
            </div>
          </form>
        )}

        {/* Contacts table */}
        {contacts.length === 0 && !showAddContact ? (
          <p className="font-body text-sm text-[var(--text-mute)] py-4">No emergency contacts added yet.</p>
        ) : (
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left text-xs font-semibold text-[var(--text-mute)] uppercase tracking-wider pb-3 pr-4">Order</th>
                <th className="text-left text-xs font-semibold text-[var(--text-mute)] uppercase tracking-wider pb-3 pr-4">Name</th>
                <th className="text-left text-xs font-semibold text-[var(--text-mute)] uppercase tracking-wider pb-3 pr-4">Relationship</th>
                <th className="text-left text-xs font-semibold text-[var(--text-mute)] uppercase tracking-wider pb-3 pr-4">Phone</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => (
                <tr key={c.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-3 pr-4 text-[var(--text-mute)]">{i + 1}</td>
                  <td className="py-3 pr-4 font-medium text-[var(--text)]">{c.full_name}</td>
                  <td className="py-3 pr-4 text-[var(--text-mute)]">{c.relationship}</td>
                  <td className="py-3 pr-4 text-[var(--text-mute)]">{c.phone || '—'}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => handleDeleteContact(c.id)} className="text-[var(--text-mute)] hover:text-red-500 transition-colors p-1">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}