import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { FileText, Eye, Check, Heart } from 'lucide-react';

const STATUS_BADGE = {
  pending: 'bg-[#FBE9C8] text-[#8A5A12]',
  under_review: 'bg-[var(--sage-soft)] text-[var(--forest)]',
  held: 'bg-[#FBE0DA] text-[#A84A3A]',
};

export default function AdminQueue() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);

  useEffect(() => {
    const load = async () => {
      const all = await base44.entities.ReleaseRequest.list('-created_date');
      setRequests(all.filter(r => ['pending', 'under_review', 'held'].includes(r.status)));
      setLoading(false);
    };
    load();
  }, []);

  const act = async (req, status) => {
    setActing(req.id);
    const me = await base44.auth.me();
    await base44.entities.ReleaseRequest.update(req.id, {
      status,
      reviewed_by: me.email,
      reviewed_at: new Date().toISOString(),
    });
    // Notify the executor of the decision (best effort)
    if (req.executor_email && (status === 'approved' || status === 'held')) {
      try {
        await base44.integrations.Core.SendEmail({
          to: req.executor_email,
          from_name: 'DepartingNotes',
          subject: status === 'approved'
            ? `Release approved — Reference ${req.reference_number}`
            : `More information needed — Reference ${req.reference_number}`,
          body: status === 'approved'
            ? `Dear ${req.executor_name},\n\nYour release request for ${req.member_full_name} has been verified and approved. The member's letters and documents will now be delivered according to their wishes.\n\nReference: ${req.reference_number}\n\nWith care,\nThe DepartingNotes Team`
            : `Dear ${req.executor_name},\n\nWe are reviewing your release request for ${req.member_full_name} and need additional information to complete verification. Our team will contact you shortly with details.\n\nReference: ${req.reference_number}\n\nWith care,\nThe DepartingNotes Team`,
        });
      } catch {
        // Email failure should not block the status update
      }
    }
    setRequests(prev => prev.filter(r => r.id !== req.id));
    setActing(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 bg-[var(--sage-soft)] rounded-xl p-4">
        <Heart size={18} className="text-[var(--forest)] flex-shrink-0 mt-0.5" />
        <p className="font-body text-sm text-[#2F5340] leading-relaxed">
          Each submission represents a family in mourning. Verify name, date, official seal, and signature before approving.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(2)].map((_, i) => <div key={i} className="bg-white border border-[var(--border)] rounded-2xl h-40 animate-pulse" />)}</div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-[var(--border)] rounded-2xl p-14 text-center">
          <Check size={28} className="text-[var(--sage)] mx-auto mb-4" />
          <h3 className="font-heading text-xl font-semibold text-[var(--forest)] mb-2">Queue is clear</h3>
          <p className="font-body text-sm text-[var(--text-mute)]">No release requests are awaiting verification.</p>
        </div>
      ) : (
        requests.map(req => (
          <div key={req.id} className="bg-white border border-[var(--border)] border-l-4 border-l-[var(--gold)] rounded-2xl p-6">
            <div className="flex gap-4">
              <div className="w-16 h-20 rounded-lg bg-[var(--paper-2)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                <FileText size={24} className="text-[var(--text-mute)]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-heading text-lg font-semibold text-[var(--forest)]">{req.member_full_name}</h3>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[req.status] || STATUS_BADGE.pending}`}>
                    {req.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="font-body text-xs text-[var(--text-mute)] mb-2">
                  {req.member_email && <>Member: {req.member_email} · </>}Ref: {req.reference_number}
                </p>
                <div className="font-body text-sm text-[var(--text-soft)] space-y-0.5">
                  {req.date_of_passing && <p>Date of passing: <strong>{req.date_of_passing}</strong></p>}
                  <p>Executor: <strong>{req.executor_name}</strong>{req.executor_relationship ? ` (${req.executor_relationship})` : ''} · {req.executor_email}</p>
                  <p>Submitted: {req.created_date ? new Date(req.created_date).toLocaleString() : '—'}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {req.death_certificate_url && (
                <a href={req.death_certificate_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-[var(--border)] text-[var(--forest)] hover:border-[var(--forest)] font-body text-xs font-semibold px-4 py-2 rounded-full transition-colors">
                  <Eye size={13} /> View certificate
                </a>
              )}
              <button onClick={() => act(req, 'approved')} disabled={acting === req.id}
                className="inline-flex items-center gap-1.5 bg-[#2F7D43] text-white font-body text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#286b39] transition-colors disabled:opacity-50">
                <Check size={13} /> Approve &amp; Release
              </button>
              <button onClick={() => act(req, 'held')} disabled={acting === req.id}
                className="bg-[var(--gold-soft)] text-[#6B4A18] font-body text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#e3c79a] transition-colors disabled:opacity-50">
                Hold — request info
              </button>
              <button onClick={() => act(req, 'rejected')} disabled={acting === req.id}
                className="bg-[#FBE0DA] text-[#A84A3A] font-body text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#f3cabf] transition-colors disabled:opacity-50">
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}