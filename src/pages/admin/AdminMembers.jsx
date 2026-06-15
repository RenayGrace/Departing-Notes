import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Users } from 'lucide-react';

const TIER_BADGE = {
  free: 'bg-[#EDEBE4] text-[#6B6457]',
  essential: 'bg-[var(--sage-soft)] text-[#2F5340]',
  premium: 'bg-[var(--gold-soft)] text-[#6B4A18]',
  family: 'bg-[#E5DBF1] text-[#5B3E84]',
};
const TIER_LABEL = { free: 'Free', essential: 'The Peace Plan', premium: 'The Whole Picture', family: 'The Family Legacy' };
const STATUS_DOT = { active: 'bg-[#3F9C5A]', suspended: 'bg-[var(--gold)]', memorialized: 'bg-[var(--rose)]', cancelled: 'bg-[var(--text-mute)]' };

export default function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setMembers(await base44.entities.Member.list('-created_date'));
      setLoading(false);
    };
    load();
  }, []);

  const filtered = members.filter(m =>
    `${m.first_name} ${m.last_name} ${m.member_id || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h3 className="font-heading text-lg font-semibold text-[var(--forest)]">All members ({members.length})</h3>
        <div className="flex items-center gap-2 border border-[var(--border)] rounded-full px-4 py-2 bg-[var(--paper)]">
          <Search size={14} className="text-[var(--text-mute)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members…"
            className="bg-transparent outline-none font-body text-sm w-40" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-[var(--paper-2)] rounded-xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Users size={26} className="text-[var(--sage)] mx-auto mb-3" />
          <p className="font-body text-sm text-[var(--text-mute)]">{members.length === 0 ? 'No members yet.' : 'No members match your search.'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Member', 'Tier', 'Status', 'State', 'Joined'].map(h => (
                  <th key={h} className="font-body text-[11px] uppercase tracking-wider text-[var(--text-mute)] font-semibold py-3 px-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="border-b border-[var(--border)] hover:bg-[var(--paper)] transition-colors">
                  <td className="py-3 px-3 font-body text-sm font-semibold text-[var(--text)]">{m.first_name} {m.last_name}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${TIER_BADGE[m.tier] || TIER_BADGE.free}`}>
                      {TIER_LABEL[m.tier] || 'Free'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-body text-sm text-[var(--text-soft)]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${STATUS_DOT[m.status] || STATUS_DOT.active}`} />
                      {m.status || 'active'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-body text-sm text-[var(--text-soft)]">{m.state_of_residence || '—'}</td>
                  <td className="py-3 px-3 font-body text-sm text-[var(--text-soft)]">{m.created_date ? new Date(m.created_date).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}