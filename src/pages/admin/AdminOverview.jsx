import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Users, FileCheck, UsersRound, DollarSign, ArrowRight } from 'lucide-react';

const TIER_PRICE = { free: 0, essential: 97, premium: 197, family: 397 };
const TIER_LABEL = { free: 'Free', essential: 'The Peace Plan', premium: 'The Whole Picture', family: 'The Family Legacy' };

export default function AdminOverview() {
  const [members, setMembers] = useState([]);
  const [pending, setPending] = useState([]);
  const [tribes, setTribes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [m, p, t] = await Promise.all([
        base44.entities.Member.list('-created_date'),
        base44.entities.ReleaseRequest.filter({ status: 'pending' }),
        base44.entities.Tribe.filter({ status: 'active' }),
      ]);
      setMembers(m);
      setPending(p);
      setTribes(t);
      setLoading(false);
    };
    load();
  }, []);

  const annualRevenue = members.reduce((sum, m) => sum + (TIER_PRICE[m.tier] || 0), 0);
  const recent = members.slice(0, 5);

  const kpis = [
    { icon: Users, bg: 'bg-[var(--forest)] text-white', value: members.length, label: 'total members' },
    { icon: DollarSign, bg: 'bg-[var(--gold-soft)] text-[var(--gold)]', value: `$${annualRevenue.toLocaleString()}`, label: 'annual revenue (est.)' },
    { icon: FileCheck, bg: 'bg-[#F3DED8] text-[var(--rose)]', value: pending.length, label: 'pending verifications', link: '/admin/queue' },
    { icon: UsersRound, bg: 'bg-[var(--sage-soft)] text-[var(--forest)]', value: tribes.length, label: 'active Tribes' },
  ];

  if (loading) {
    return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="bg-white border border-[var(--border)] rounded-2xl h-32 animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white border border-[var(--border)] rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${k.bg}`}><k.icon size={18} /></div>
            <p className="font-heading text-2xl font-bold text-[var(--text)]">{k.value}</p>
            <p className="font-body text-xs text-[var(--text-mute)]">{k.label}</p>
            {k.link && (
              <Link to={k.link} className="font-body text-xs text-[var(--forest)] font-semibold flex items-center gap-1 mt-1 hover:underline">
                Review now <ArrowRight size={11} />
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
        <h3 className="font-heading text-lg font-semibold text-[var(--forest)] mb-4">Newest members</h3>
        {recent.length === 0 ? (
          <p className="font-body text-sm text-[var(--text-mute)]">No members yet.</p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {recent.map(m => (
              <div key={m.id} className="flex items-center gap-3 py-3">
                <span className="w-9 h-9 rounded-full bg-[var(--sage-soft)] text-[var(--forest)] flex items-center justify-center font-heading font-semibold text-sm flex-shrink-0">
                  {(m.first_name || '?')[0]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-semibold text-[var(--text)] truncate">{m.first_name} {m.last_name}</p>
                  <p className="font-body text-xs text-[var(--text-mute)]">{TIER_LABEL[m.tier] || 'Free'}</p>
                </div>
                <span className="font-body text-xs text-[var(--text-mute)]">{m.created_date ? new Date(m.created_date).toLocaleDateString() : ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}