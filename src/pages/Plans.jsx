import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, QrCode, Lock, Calendar } from 'lucide-react';

const Eyebrow = ({ text, light }) => (
  <div className="flex items-center gap-3 justify-center mb-4">
    <div className="h-px w-7 bg-[var(--gold)]" />
    <span className={`font-body font-semibold text-xs uppercase tracking-widest ${light ? 'text-[var(--gold-soft)]' : 'text-[var(--gold)]'}`}>{text}</span>
  </div>
);

const plans = [
  { key: 'free', label: 'Free', annual: 0, monthly: 0, keychain: '$25 add-on', tagline: 'Free forever', features: ['One letter to many', 'Statutory will', 'Letter-writing templates', '$25 QR keychain available'], cta: 'Get Started Free' },
  { key: 'peace', label: 'The Peace Plan', annual: 97, monthly: 9.97, keychain: 'Included', tagline: 'For individuals', features: ['Unlimited letters', 'Tribes', 'Basic estate package', '10% off Nara‑Story'], cta: 'Choose Peace Plan' },
  { key: 'whole-picture', label: 'The Whole Picture', annual: 197, monthly: 19.97, keychain: 'Included', tagline: 'Emotional + legal + financial', features: ['Everything in Peace Plan', 'Annual budget review', 'Upload redacted bank statements', 'Financial clarity, no judgment'], cta: 'Choose Whole Picture' },
  { key: 'legacy', label: 'The Legacy Plan', annual: 297, monthly: 29.97, keychain: 'Included', tagline: 'The full life plan', features: ['Everything in Whole Picture', 'AI estate review', 'GHICA attorneys · free consult', '20% off trust packages'], popular: true, cta: 'Choose Legacy Plan' },
  { key: 'family-legacy', label: 'The Family Legacy', annual: 397, monthly: 39.97, keychain: 'Included*', tagline: 'For two, together', features: ['Two full Legacy Plan memberships', 'Everything in Legacy Plan, ×2', 'Plan together as a couple'], cta: 'Choose Family Legacy' },
];

const features = [
  { label: 'Price (annual)', free: '$0', peace: '$97', whole: '$197', legacy: '$297', family: '$397' },
  { label: 'QR keychain', free: '$25 add-on', peace: '✓', whole: '✓', legacy: '✓', family: '✓*' },
  { label: 'Letters', free: '1 (to many)', peace: 'Unlimited', whole: 'Unlimited', legacy: 'Unlimited', family: 'Unlimited' },
  { label: 'Statutory will', free: true, peace: true, whole: true, legacy: true, family: true },
  { label: 'Letter templates', free: true, peace: true, whole: true, legacy: true, family: true },
  { label: 'Tribes', free: 'Join', peace: 'Create', whole: 'Create', legacy: 'Create', family: 'Create' },
  { label: 'Basic estate package', free: false, peace: true, whole: true, legacy: true, family: true },
  { label: 'Milestone Delivery', free: false, peace: true, whole: true, legacy: true, family: true },
  { label: 'Annual budget review', free: false, peace: false, whole: true, legacy: true, family: true },
  { label: 'AI estate plan review', free: false, peace: false, whole: false, legacy: true, family: true },
  { label: 'GHICA attorney network', free: false, peace: false, whole: false, legacy: true, family: true },
  { label: 'Free consultation', free: false, peace: false, whole: false, legacy: true, family: true },
  { label: '20% off trust packages', free: false, peace: false, whole: false, legacy: true, family: true },
  { label: 'Members covered', free: '1', peace: '1', whole: '1', legacy: '1', family: '2' },
];

function Cell({ val }) {
  if (val === true) return <Check size={15} className="text-[var(--forest)] mx-auto" />;
  if (val === false) return <span className="text-[var(--border)] mx-auto block text-center">—</span>;
  return <span className="font-body text-[var(--text-soft)] text-xs block text-center">{val}</span>;
}

export default function Plans() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="bg-[var(--paper)]">

      {/* Hero */}
      <section className="pt-28 pb-16 px-5 md:px-8 text-center">
        <Eyebrow text="Membership plans" />
        <h1 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-bold text-[var(--forest)] leading-tight mb-5">
          Choose your plan.<br />Leave your legacy.
        </h1>
        <p className="font-body text-[var(--text-soft)] text-base max-w-xl mx-auto">
          Every paid plan includes your <strong>QR emergency keychain</strong>. On the free plan, add it for a one‑time <strong>$25</strong>.
        </p>
      </section>

      {/* Toggle */}
      <div className="flex items-center justify-center gap-4 pb-10 px-5">
        <span className={`font-body text-sm ${!annual ? 'text-[var(--text)] font-medium' : 'text-[var(--text-mute)]'}`}>Monthly</span>
        <button onClick={() => setAnnual(!annual)} className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-[var(--forest)]' : 'bg-[var(--sage-soft)]'}`}>
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${annual ? 'left-6' : 'left-0.5'}`} />
        </button>
        <span className={`font-body text-sm ${annual ? 'text-[var(--text)] font-medium' : 'text-[var(--text-mute)]'}`}>
          Annual <span className="text-[var(--forest)] font-semibold ml-1">Save 17%</span>
        </span>
      </div>

      {/* Plan cards */}
      <section className="pb-16 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {plans.map(plan => (
            <div key={plan.key} className={`bg-white border rounded-2xl p-6 flex flex-col relative ${
              plan.popular ? 'border-[var(--gold)] shadow-lg' : 'border-[var(--border)]'
            }`}>
              {plan.popular && (
                <span className="inline-block bg-[var(--gold)] text-white font-body font-semibold text-xs px-3 py-1 rounded-full mb-3 self-start">Most complete</span>
              )}
              <p className="font-heading text-base font-semibold text-[var(--forest)] mb-1">{plan.label}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-heading text-2xl font-bold text-[var(--text)]">${annual ? plan.annual : plan.monthly}</span>
                <span className="font-body text-xs text-[var(--text-mute)]">{annual ? '/year' : '/month'}</span>
              </div>
              <p className="font-body text-[var(--text-mute)] text-xs mb-1">{plan.tagline}</p>
              <p className="font-body text-xs text-[var(--gold)] font-medium mb-4">Keychain: {plan.keychain}</p>
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 font-body text-xs text-[var(--text-soft)] leading-snug">
                    <span className="text-[var(--sage)] flex-shrink-0 mt-0.5">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link to={`/register?plan=${plan.key}`} className={`text-center py-2.5 rounded-full font-body font-semibold text-xs transition-all ${
                plan.popular
                  ? 'bg-[var(--forest)] text-white hover:bg-[var(--forest-600)]'
                  : plan.key === 'free'
                  ? 'border border-[var(--border)] text-[var(--text-soft)] hover:border-[var(--forest)] hover:text-[var(--forest)]'
                  : 'border border-[var(--forest)] text-[var(--forest)] hover:bg-[var(--forest)] hover:text-white'
              }`}>{plan.cta}</Link>
            </div>
          ))}
        </div>
        <p className="text-center mt-6">
          <Link to="/register?plan=free" className="font-body text-sm text-[var(--text-soft)] hover:text-[var(--forest)] transition-colors">
            Not sure? <span className="text-[var(--gold)] font-medium">Start free — upgrade anytime</span>
          </Link>
        </p>
      </section>

      {/* Signature features */}
      <section className="bg-[var(--paper-2)] py-16 md:py-20 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow text="Signature features" />
            <h2 className="font-heading text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-[var(--forest)] leading-tight">
              Built to protect what matters most
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { Icon: QrCode, color: 'bg-[var(--sage-soft)] text-[var(--forest)]', title: 'The Keychain · $25', body: 'A physical QR‑code tag that first responders can scan in an emergency. Your emergency contacts are notified and your designated letters can be triggered for release.' },
              { Icon: Lock, color: 'bg-[var(--forest)] text-white', title: 'The vault stays sealed', body: 'Your vault stays sealed until death is confirmed by documentation. This rule is non‑negotiable. After death is confirmed, your own timing rules apply.' },
              { Icon: Calendar, color: 'bg-[var(--gold-soft)] text-[var(--gold)]', title: 'Milestone Delivery', body: "Write letters held and delivered at future life moments — a graduation, wedding, birthday. Entrusted to a designated distributor who decides the right moment." },
            ].map(({ Icon, color, title, body }) => (
              <div key={title} className="bg-white border border-[var(--border)] rounded-2xl p-7">
                <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-5`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[var(--forest)] mb-3">{title}</h3>
                <p className="font-body text-[var(--text-soft)] text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 md:py-20 px-5 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow text="Compare every feature" />
            <h2 className="font-heading text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-[var(--forest)] leading-tight">The full picture</h2>
          </div>
          <div className="overflow-x-auto bg-white border border-[var(--border)] rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-4 px-5 font-body text-[var(--text-mute)] font-normal text-xs">Feature</th>
                  {['Free', 'Peace', 'Whole Picture', 'Legacy', 'Family Legacy'].map((h, i) => (
                    <th key={i} className={`text-center py-4 px-3 font-heading font-semibold text-sm ${h === 'Legacy' ? 'text-[var(--forest)]' : 'text-[var(--text)]'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((row, i) => (
                  <tr key={i} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--paper)] transition-colors">
                    <td className="py-3.5 px-5 font-body text-[var(--text-soft)] text-sm">{row.label}</td>
                    <td className="py-3.5 px-3"><Cell val={row.free} /></td>
                    <td className="py-3.5 px-3"><Cell val={row.peace} /></td>
                    <td className="py-3.5 px-3"><Cell val={row.whole} /></td>
                    <td className="py-3.5 px-3 bg-[var(--sage-soft)]/20"><Cell val={row.legacy} /></td>
                    <td className="py-3.5 px-3"><Cell val={row.family} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-body text-[var(--text-mute)] text-xs mt-4 italic">*Family Legacy keychain quantity to be confirmed.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 pb-20">
        <div className="max-w-4xl mx-auto bg-[var(--forest)] rounded-3xl py-16 px-8 text-center">
          <Eyebrow text="Start today" light />
          <h2 className="font-heading text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-white mb-4 leading-tight">Start free. Upgrade when you're ready.</h2>
          <p className="font-body text-white/65 mb-8 max-w-md mx-auto">No pressure, ever. Begin with a free account and grow your legacy at your own pace.</p>
          <Link to="/register?plan=free" className="inline-flex items-center gap-2 bg-[var(--gold)] text-white font-body font-semibold px-10 py-4 rounded-full hover:bg-[#a06e25] transition-colors">
            Create Your Free Account <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}