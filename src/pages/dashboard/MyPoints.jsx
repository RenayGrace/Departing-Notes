import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Star, DollarSign, Timer, Search } from 'lucide-react';
import { format } from 'date-fns';

const REDEMPTIONS = [
  { points: 500,  value: '$5 off'  },
  { points: 1000, value: '$10 off' },
  { points: 2500, value: '$25 off' },
];

export default function MyPoints() {
  const [transactions, setTransactions] = useState([]);
  const [member, setMember]             = useState(null);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      const [txs, members] = await Promise.all([
        base44.entities.PointsTransaction.filter({ member_id: u.id }),
        base44.entities.Member.filter({ user_id: u.id }),
      ]);
      setTransactions(txs.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
      if (members.length > 0) setMember(members[0]);
      setLoading(false);
    };
    load();
  }, []);

  const balance       = member?.points_balance || 0;
  const redeemable    = REDEMPTIONS.filter(r => balance >= r.points).slice(-1)[0];
  const nextMilestone = REDEMPTIONS.find(r => r.points > balance) || REDEMPTIONS[REDEMPTIONS.length - 1];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[var(--forest)]">My Points</h1>
          <p className="font-body text-[var(--text-mute)] text-sm mt-1">Rewards for protecting your legacy.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[var(--border)] rounded-full px-4 py-2 min-w-[200px]">
          <Search size={14} className="text-[var(--text-mute)]" />
          <span className="font-body text-sm text-[var(--text-mute)]">Search your vault...</span>
        </div>
      </div>

      {/* 3 stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Current balance */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <div className="w-10 h-10 bg-[var(--gold-soft)] rounded-xl flex items-center justify-center mb-4">
            <Star size={18} className="text-[var(--gold)]" fill="currentColor" />
          </div>
          <p className="font-heading text-4xl font-bold text-[var(--text)]">{balance.toLocaleString()}</p>
          <p className="font-body text-sm text-[var(--text-mute)] mt-1">current balance</p>
        </div>

        {/* Redeemable now */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <div className="w-10 h-10 bg-[var(--sage-soft)] rounded-xl flex items-center justify-center mb-4">
            <DollarSign size={18} className="text-[var(--forest)]" />
          </div>
          <p className="font-heading text-4xl font-bold text-[var(--text)]">
            {redeemable ? redeemable.value : '$0'}
          </p>
          <p className="font-body text-sm text-[var(--text-mute)] mt-1">
            redeemable now{redeemable ? ` (${redeemable.points.toLocaleString()} pts)` : ''}
          </p>
        </div>

        {/* Next milestone */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <div className="w-10 h-10 bg-[var(--forest)] rounded-xl flex items-center justify-center mb-4">
            <Timer size={18} className="text-white" />
          </div>
          <p className="font-heading text-4xl font-bold text-[var(--text)]">{nextMilestone.points.toLocaleString()}</p>
          <p className="font-body text-sm text-[var(--text-mute)] mt-1">
            next milestone · {nextMilestone.value}
          </p>
        </div>
      </div>

      {/* Bottom: history + redeem */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

        {/* Points history */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <h2 className="font-heading text-xl text-[var(--forest)] font-semibold mb-5">Points history</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-[var(--paper)] rounded-lg animate-pulse" />)}
            </div>
          ) : transactions.length === 0 ? (
            <p className="font-body text-sm text-[var(--text-mute)] py-6">No transactions yet. Points will appear here as you use the platform.</p>
          ) : (
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left text-xs font-semibold text-[var(--text-mute)] uppercase tracking-wider pb-3 pr-4">Activity</th>
                  <th className="text-left text-xs font-semibold text-[var(--text-mute)] uppercase tracking-wider pb-3 pr-4">Date</th>
                  <th className="text-right text-xs font-semibold text-[var(--text-mute)] uppercase tracking-wider pb-3">Points</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-4 pr-4 font-medium text-[var(--text)]">{tx.description || tx.action}</td>
                    <td className="py-4 pr-4 text-[var(--text-mute)]">
                      {tx.created_date ? format(new Date(tx.created_date), 'MMM d') : '—'}
                    </td>
                    <td className={`py-4 text-right font-semibold ${tx.transaction_type === 'earn' ? 'text-[var(--forest)]' : 'text-red-500'}`}>
                      {tx.transaction_type === 'earn' ? '+' : '-'}{tx.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Redeem panel */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <h2 className="font-heading text-xl text-[var(--forest)] font-semibold mb-2">Redeem points</h2>
          <p className="font-body text-sm text-[var(--text-mute)] mb-6">
            Apply toward your next annual renewal. Max 50% of your fee per year.
          </p>
          <div className="space-y-3">
            {REDEMPTIONS.map(r => {
              const unlocked = balance >= r.points;
              return (
                <div key={r.points} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  unlocked ? 'border-[var(--border)] hover:border-[var(--forest)]' : 'border-[var(--border)] opacity-50'
                }`}>
                  <div>
                    <p className="font-body text-sm font-semibold text-[var(--text)]">{r.points.toLocaleString()} pts</p>
                    <p className="font-body text-xs text-[var(--text-mute)]">{r.value}</p>
                  </div>
                  {unlocked ? (
                    <button className="bg-[var(--forest)] text-white font-body text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[var(--forest-600)] transition-colors">
                      Redeem
                    </button>
                  ) : (
                    <span className="font-body text-xs text-[var(--text-mute)]">Locked</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}