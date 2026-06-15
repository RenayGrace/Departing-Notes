import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { UsersRound, Lock } from 'lucide-react';

export default function AdminTribes() {
  const [tribes, setTribes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setTribes(await base44.entities.Tribe.list('-created_date'));
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
      <h3 className="font-heading text-lg font-semibold text-[var(--forest)] mb-5">All Tribes ({tribes.length})</h3>

      {loading ? (
        <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-[var(--paper-2)] rounded-xl animate-pulse" />)}</div>
      ) : tribes.length === 0 ? (
        <div className="text-center py-12">
          <UsersRound size={26} className="text-[var(--sage)] mx-auto mb-3" />
          <p className="font-body text-sm text-[var(--text-mute)]">No tribes created yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Tribe', 'Members', 'Privacy', 'Status', 'Created'].map(h => (
                  <th key={h} className="font-body text-[11px] uppercase tracking-wider text-[var(--text-mute)] font-semibold py-3 px-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tribes.map(t => (
                <tr key={t.id} className="border-b border-[var(--border)] hover:bg-[var(--paper)] transition-colors">
                  <td className="py-3 px-3 font-body text-sm font-semibold text-[var(--text)]">{t.name}</td>
                  <td className="py-3 px-3 font-body text-sm text-[var(--text-soft)]">{t.member_count || 0}</td>
                  <td className="py-3 px-3 font-body text-sm text-[var(--text-soft)] capitalize">{t.privacy || 'public'}</td>
                  <td className="py-3 px-3 font-body text-sm text-[var(--text-soft)] capitalize">{t.status || 'active'}</td>
                  <td className="py-3 px-3 font-body text-sm text-[var(--text-soft)]">{t.created_date ? new Date(t.created_date).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-start gap-3 bg-[var(--sage-soft)] rounded-xl p-4 mt-5">
        <Lock size={16} className="text-[var(--forest)] flex-shrink-0 mt-0.5" />
        <p className="font-body text-sm text-[#2F5340]">Tribes never expose member vaults. The directory shows names only — architecturally enforced.</p>
      </div>
    </div>
  );
}