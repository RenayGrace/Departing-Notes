import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';

const TIER_PRICE = { free: 0, essential: 97, premium: 197, family: 397 };
const TIER_LABEL = { free: 'Free', essential: 'Peace', premium: 'Whole', family: 'Family' };

export default function AdminRevenue() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setMembers(await base44.entities.Member.list());
      setLoading(false);
    };
    load();
  }, []);

  const annual = members.reduce((s, m) => s + (TIER_PRICE[m.tier] || 0), 0);
  const mrr = Math.round(annual / 12);
  const keychainFees = members.filter(m => m.tier === 'free' && m.card_fee_paid).length * 25;

  const byTier = ['free', 'essential', 'premium', 'family'].map(t => {
    const tierMembers = members.filter(m => (m.tier || 'free') === t);
    return { tier: t, label: TIER_LABEL[t], count: tierMembers.length, revenue: tierMembers.length * TIER_PRICE[t] };
  });
  const maxRevenue = Math.max(...byTier.map(t => t.revenue), 1);

  if (loading) {
    return <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="bg-white border border-[var(--border)] rounded-2xl h-32 animate-pulse" />)}</div>;
  }

  const kpis = [
    { icon: DollarSign, bg: 'bg-[var(--forest)] text-white', value: `$${mrr.toLocaleString()}`, label: 'MRR (estimated)' },
    { icon: TrendingUp, bg: 'bg-[var(--gold-soft)] text-[var(--gold)]', value: `$${annual.toLocaleString()}`, label: 'ARR (estimated)' },
    { icon: CreditCard, bg: 'bg-[var(--sage-soft)] text-[var(--forest)]', value: `$${keychainFees.toLocaleString()}`, label: 'keychain fees collected' },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-white border border-[var(--border)] rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${k.bg}`}><k.icon size={18} /></div>
            <p className="font-heading text-2xl font-bold text-[var(--text)]">{k.value}</p>
            <p className="font-body text-xs text-[var(--text-mute)]">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
        <h3 className="font-heading text-lg font-semibold text-[var(--forest)] mb-6">Revenue by tier</h3>
        <div className="flex items-end gap-4 h-44">
          {byTier.map(t => (
            <div key={t.tier} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
              <span className="font-body text-xs font-semibold text-[var(--text)]">${t.revenue.toLocaleString()}</span>
              <div
                className={`w-full max-w-[52px] rounded-t-lg transition-all ${t.tier === 'premium' || t.tier === 'family' ? 'bg-[var(--gold)]' : 'bg-[var(--forest)]'}`}
                style={{ height: `${Math.max((t.revenue / maxRevenue) * 100, 3)}%` }}
              />
              <span className="font-body text-xs text-[var(--text-mute)]">{t.label} ({t.count})</span>
            </div>
          ))}
        </div>
        <p className="font-body text-xs text-[var(--text-mute)] mt-5">
          Estimates based on each member's plan tier and annual pricing. Connect Stripe for exact billing figures.
        </p>
      </div>
    </div>
  );
}