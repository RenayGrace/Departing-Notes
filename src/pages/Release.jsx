import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload, CheckCircle, Heart, Shield } from 'lucide-react';

export default function Release() {
  const [form, setForm] = useState({
    member_full_name: '', member_email: '', member_id_card: '',
    date_of_passing: '', executor_name: '', executor_email: '', executor_relationship: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleFileChange = (f) => {
    setError('');
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setError('File is too large. Please upload a file under 10MB.');
      return;
    }
    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let death_certificate_url = '';
      if (file) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        death_certificate_url = file_url;
      }
      const refNum = 'DN-' + Date.now().toString().slice(-8);
      await base44.entities.ReleaseRequest.create({ ...form, death_certificate_url, reference_number: refNum, status: 'pending' });

      // Best-effort confirmation email to the executor
      try {
        await base44.integrations.Core.SendEmail({
          to: form.executor_email,
          from_name: 'DepartingNotes',
          subject: `Release request received — Reference ${refNum}`,
          body: `Dear ${form.executor_name},\n\nWe are so sorry for your loss, and we thank you for honoring ${form.member_full_name}'s wishes.\n\nYour release request has been received and is now under review. Our team will personally verify the documentation within 24-48 hours.\n\nYour reference number: ${refNum}\n\nPlease keep this number for your records. You will receive another email once the review is complete.\n\nWith care,\nThe DepartingNotes Team`,
        });
        setEmailSent(true);
      } catch {
        // Email failure should not block the submission confirmation
      }

      setRefNumber(refNum);
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong while submitting your request. Please try again, or contact us if the problem continues.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--paper)] min-h-screen">

      {/* Hero */}
      <section className="pt-28 pb-10 px-5 md:px-8 text-center">
        <div className="flex items-center gap-3 justify-center mb-4">
          <div className="h-px w-7 bg-[var(--gold)]" />
          <span className="font-body text-[var(--gold)] font-semibold text-xs uppercase tracking-widest">For executors</span>
        </div>
        <h1 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-bold text-[var(--forest)] leading-tight mb-5">Release Portal</h1>
        <p className="font-body text-[var(--text-soft)] text-lg max-w-xl mx-auto leading-relaxed">
          If you are here, someone trusted you with their final messages. We are honored to help you honor them — gently, securely, and with care.
        </p>
        <p className="font-body text-[var(--text-mute)] text-sm max-w-xl mx-auto mt-3">
          Take your time. There is no rush. Our team will personally review your submission within 24–48 hours.
        </p>
      </section>

      {/* Notice */}
      <div className="max-w-xl mx-auto px-5 md:px-8 mb-6">
        <div className="flex items-start gap-3 bg-[var(--gold-soft)] border border-[var(--gold)]/20 rounded-2xl p-5">
          <Heart size={16} className="text-[var(--gold)] flex-shrink-0 mt-0.5" />
          <p className="font-body text-[var(--text-soft)] text-sm leading-relaxed">
            We are so sorry for your loss. You are in the right place. Our team is here to guide you through every step with care.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-5 md:px-8 pb-20">
        {submitted ? (
          <div className="bg-white border border-[var(--border)] rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--sage-soft)] flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={28} className="text-[var(--forest)]" />
            </div>
            <h2 className="font-heading text-2xl font-semibold text-[var(--forest)] mb-3">Submission Received</h2>
            <p className="font-body text-[var(--text-soft)] text-sm leading-relaxed mb-6">
              Thank you. We have received your submission. Our team will verify the death certificate within 24–48 hours. You will receive a confirmation email when the release is complete.
            </p>
            <div className="bg-[var(--paper-2)] rounded-xl p-5 mb-5">
              <p className="font-body text-[var(--text-mute)] text-xs uppercase tracking-wide mb-1">Your Reference Number</p>
              <p className="font-heading text-2xl font-bold text-[var(--forest)]">{refNumber}</p>
            </div>
            <p className="font-body text-[var(--text-mute)] text-xs">
              {emailSent
                ? `A confirmation has been sent to ${form.executor_email}`
                : 'Please save your reference number — you will need it for any follow-up.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-[var(--border)] rounded-2xl p-8 space-y-7">
            <h2 className="font-heading text-xl font-semibold text-[var(--forest)]">Submit a release request</h2>

            {/* Member info */}
            <div className="space-y-4">
              <p className="font-body text-xs font-semibold text-[var(--text-mute)] uppercase tracking-widest">Member information</p>
              <div>
                <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Member's full legal name *</label>
                <input required type="text" value={form.member_full_name}
                  onChange={e => setForm({...form, member_full_name: e.target.value})}
                  className="w-full border border-[var(--border)] focus:border-[var(--forest)] rounded-xl px-4 py-3 font-body text-sm outline-none transition-colors"
                  placeholder="As it appears on their account" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Member's email or Member ID</label>
                  <input type="text" value={form.member_email}
                    onChange={e => setForm({...form, member_email: e.target.value})}
                    className="w-full border border-[var(--border)] focus:border-[var(--forest)] rounded-xl px-4 py-3 font-body text-sm outline-none transition-colors"
                    placeholder="Email or Member ID from card" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Date of passing *</label>
                  <input required type="date" value={form.date_of_passing}
                    onChange={e => setForm({...form, date_of_passing: e.target.value})}
                    className="w-full border border-[var(--border)] focus:border-[var(--forest)] rounded-xl px-4 py-3 font-body text-sm outline-none transition-colors" />
                </div>
              </div>
            </div>

            {/* Executor info */}
            <div className="space-y-4">
              <p className="font-body text-xs font-semibold text-[var(--text-mute)] uppercase tracking-widest">Your information (executor)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Your full name *</label>
                  <input required type="text" value={form.executor_name}
                    onChange={e => setForm({...form, executor_name: e.target.value})}
                    className="w-full border border-[var(--border)] focus:border-[var(--forest)] rounded-xl px-4 py-3 font-body text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Your email address *</label>
                  <input required type="email" value={form.executor_email}
                    onChange={e => setForm({...form, executor_email: e.target.value})}
                    className="w-full border border-[var(--border)] focus:border-[var(--forest)] rounded-xl px-4 py-3 font-body text-sm outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Your relationship to the member *</label>
                <input required type="text" value={form.executor_relationship}
                  onChange={e => setForm({...form, executor_relationship: e.target.value})}
                  className="w-full border border-[var(--border)] focus:border-[var(--forest)] rounded-xl px-4 py-3 font-body text-sm outline-none transition-colors"
                  placeholder="e.g. Spouse, Child, Sibling, Friend" />
              </div>
            </div>

            {/* Upload */}
            <div>
              <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Death certificate *</label>
              <label className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
                file ? 'border-[var(--forest)] bg-[var(--sage-soft)]' : 'border-[var(--border)] hover:border-[var(--forest)]/40'
              }`}>
                <Upload size={22} className="text-[var(--text-mute)] mb-2" />
                <p className="font-body text-[var(--text-soft)] text-sm font-medium">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="font-body text-[var(--text-mute)] text-xs mt-1">PDF, JPG or PNG · max 10MB</p>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => handleFileChange(e.target.files[0])} />
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading || !file}
              className="w-full inline-flex items-center justify-center gap-2 bg-[var(--forest)] text-white font-body font-semibold py-3.5 rounded-full hover:bg-[var(--forest-600)] transition-colors disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Release Request'}
            </button>

            <div className="flex items-center gap-2 justify-center">
              <Shield size={13} className="text-[var(--sage)]" />
              <p className="font-body text-[var(--text-mute)] text-xs">Your submission is encrypted and reviewed only by authorized DepartingNotes staff.</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}