import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Eyebrow = ({ text }) => (
  <div className="flex items-center gap-3 justify-center mb-4">
    <div className="h-px w-7 bg-[var(--gold)]" />
    <span className="font-body text-[var(--gold)] font-semibold text-xs uppercase tracking-widest">{text}</span>
  </div>
);

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'general', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[var(--paper)]">

      {/* Hero */}
      <section className="pt-28 pb-16 px-5 md:px-8 text-center">
        <Eyebrow text="We're here for you" />
        <h1 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-bold text-[var(--forest)] leading-tight mb-5">
          Let's talk
        </h1>
        <p className="font-body text-[var(--text-soft)] text-lg max-w-md mx-auto leading-relaxed">
          Whether you have a question, need a hand, or just want to share your story — we'd love to hear from you.
        </p>
      </section>

      <section className="pb-24 px-5 md:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact info */}
          <div>
            <h2 className="font-heading text-xl font-semibold text-[var(--forest)] mb-6">Reach us directly</h2>
            <div className="space-y-5 mb-8">
              {[
                { Icon: Mail, label: 'hello@departingnotes.com' },
                { Icon: Phone, label: '(818) 734-7223' },
                { Icon: MapPin, label: '21000 Devonshire St, Suite 111\nChatsworth, CA 91311' },
              ].map(({ Icon, label }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--sage-soft)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={15} className="text-[var(--forest)]" />
                  </div>
                  <p className="font-body text-[var(--text-soft)] text-sm leading-relaxed whitespace-pre-line">{label}</p>
                </div>
              ))}
            </div>

            {/* Reporting a passing */}
            <div className="bg-[var(--gold-soft)] border border-[var(--gold)]/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={14} className="text-[var(--gold)]" />
                <p className="font-body font-semibold text-[var(--text)] text-sm">Reporting a passing?</p>
              </div>
              <p className="font-body text-[var(--text-soft)] text-sm leading-relaxed">
                Please use the{' '}
                <Link to="/release" className="text-[var(--gold)] font-semibold hover:underline">Release Portal</Link>
                {' '}— it's the fastest, most secure path for executors.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white border border-[var(--border)] rounded-2xl p-12 text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--sage-soft)] flex items-center justify-center mx-auto mb-5">
                  <Send size={20} className="text-[var(--forest)]" />
                </div>
                <h3 className="font-heading text-2xl font-semibold text-[var(--forest)] mb-3">Message received</h3>
                <p className="font-body text-[var(--text-soft)] text-sm leading-relaxed">
                  Thank you for reaching out. A member of our team will respond within 1–2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-[var(--border)] rounded-2xl p-8 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Your name *</label>
                    <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full border border-[var(--border)] focus:border-[var(--forest)] rounded-xl px-4 py-3 font-body text-sm outline-none transition-colors"
                      placeholder="Full name" />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Email address *</label>
                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full border border-[var(--border)] focus:border-[var(--forest)] rounded-xl px-4 py-3 font-body text-sm outline-none transition-colors"
                      placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">How can we help?</label>
                  <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                    className="w-full border border-[var(--border)] focus:border-[var(--forest)] rounded-xl px-4 py-3 font-body text-sm outline-none transition-colors bg-white">
                    {['General question', 'Membership & billing', 'Partner services', 'Press & media', 'Something else'].map(o => (
                      <option key={o} value={o.toLowerCase().replace(/\s+/g, '-')}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Your message *</label>
                  <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    rows={5}
                    className="w-full border border-[var(--border)] focus:border-[var(--forest)] rounded-xl px-4 py-3 font-body text-sm outline-none transition-colors resize-none"
                    placeholder="Write a short message..." />
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-[var(--forest)] text-white font-body font-semibold py-3.5 rounded-full hover:bg-[var(--forest-600)] transition-colors">
                  Send Message <Send size={15} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}