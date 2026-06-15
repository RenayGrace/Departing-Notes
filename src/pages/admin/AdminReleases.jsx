import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Clock } from 'lucide-react';

const STATUS_BADGE = {
  approved: 'bg-[#DCEBDD] text-[#2F7D43]',
  rejected: 'bg-[#FBE0DA] text-[#A84A3A]',
  held: 'bg-[#FBE9C8] text-[#8A5A12]',
};

export default function AdminReleases() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const all = await base44.entities.ReleaseRequest.list('-reviewed_at');
      setRequests(all.filter(r => ['approved', 'rejected', 'held'].includes(r.status)));
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
      <h3 className="font-heading text-lg font-semibold text-[var(--forest)] mb-5">Release &amp; memorialization log</h3>

      {loading ? (
        <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-[var(--paper-2)] rounded-xl animate-pulse" />)}</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12">
          <Clock size={26} className="text-[var(--sage)] mx-auto mb-3" />
          <p className="font-body text-sm text-[var(--text-mute)]">No reviewed release requests yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Member', 'Executor', 'Reference', 'Reviewed', 'Status'].map(h => (
                  <th key={h} className="font-body text-[11px] uppercase tracking-wider text-[var(--text-mute)] font-semibold py-3 px-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} className="border-b border-[var(--border)] hover:bg-[var(--paper)] transition-colors">
                  <td className="py-3 px-3 font-body text-sm font-semibold text-[var(--text)]">{r.member_full_name}</td>
                  <td className="py-3 px-3 font-body text-sm text-[var(--text-soft)]">{r.executor_name}</td>
                  <td className="py-3 px-3 font-body text-sm text-[var(--text-soft)]">{r.reference_number || '—'}</td>
                  <td className="py-3 px-3 font-body text-sm text-[var(--text-soft)]">{r.reviewed_at ? new Date(r.reviewed_at).toLocaleDateString() : '—'}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[r.status] || 'bg-[#EDEBE4] text-[#6B6457]'}`}>
                      {r.status === 'approved' ? 'Memorialized' : r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-start gap-3 bg-[var(--sage-soft)] rounded-xl p-4 mt-5">
        <Clock size={16} className="text-[var(--forest)] flex-shrink-0 mt-0.5" />
        <p className="font-body text-sm text-[#2F5340]">Approved releases are permanently recorded and the member's account is memorialized.</p>
      </div>
    </div>
  );
}