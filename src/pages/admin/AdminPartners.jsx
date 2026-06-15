import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Handshake } from 'lucide-react';

const CATEGORY_LABEL = {
  life_story: 'Life Story Services',
  financial_planning: 'Financial Planning',
  estate_planning: 'Estate Planning',
  other: 'Other',
};

export default function AdminPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setPartners(await base44.entities.Partner.list());
      setLoading(false);
    };
    load();
  }, []);

  const toggleActive = async (p) => {
    const updated = await base44.entities.Partner.update(p.id, { is_active: !p.is_active });
    setPartners(prev => prev.map(x => x.id === p.id ? updated : x));
  };

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(2)].map((_, i) => <div key={i} className="bg-white border border-[var(--border)] rounded-2xl h-44 animate-pulse" />)}</div>;
  }

  return partners.length === 0 ? (
    <div className="bg-white border border-[var(--border)] rounded-2xl p-14 text-center">
      <Handshake size={26} className="text-[var(--sage)] mx-auto mb-3" />
      <p className="font-body text-sm text-[var(--text-mute)]">No partners in the directory yet.</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {partners.map(p => (
        <div key={p.id} className="bg-white border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-[var(--forest)] text-[var(--gold-soft)] flex items-center justify-center font-heading text-lg font-bold flex-shrink-0">
              {p.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
            </div>
            <div className="min-w-0">
              <h3 className="font-heading text-lg font-semibold text-[var(--forest)] leading-tight">{p.name}</h3>
              <p className="font-body text-xs text-[var(--gold)]">{p.title || CATEGORY_LABEL[p.category] || ''}</p>
              {p.organization && <p className="font-body text-xs text-[var(--text-mute)]">{p.organization}</p>}
            </div>
          </div>
          <div className="flex items-center justify-between font-body text-sm py-2 border-t border-[var(--border)]">
            <span className="text-[var(--text-mute)]">Category</span>
            <strong className="text-[var(--text)]">{CATEGORY_LABEL[p.category] || '—'}</strong>
          </div>
          <div className="flex items-center justify-between font-body text-sm py-2 border-t border-[var(--border)]">
            <span className="text-[var(--text-mute)]">Status</span>
            <button onClick={() => toggleActive(p)}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                p.is_active ? 'bg-[#DCEBDD] text-[#2F7D43]' : 'bg-[#EDEBE4] text-[#6B6457]'
              }`}>
              {p.is_active ? 'Active — click to deactivate' : 'Inactive — click to activate'}
            </button>
          </div>
          {p.email && (
            <div className="flex items-center justify-between font-body text-sm py-2 border-t border-[var(--border)]">
              <span className="text-[var(--text-mute)]">Contact</span>
              <span className="text-[var(--text)] truncate ml-3">{p.email}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}