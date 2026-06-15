import { Link } from 'react-router-dom';
import { Shield, QrCode, Lock, Clock, ArrowRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Eyebrow = ({ text }) => (
  <div className="flex items-center gap-3 justify-center mb-4">
    <div className="h-px w-7 bg-[var(--gold)]" />
    <span className="font-body text-[var(--gold)] font-semibold text-xs uppercase tracking-widest">{text}</span>
  </div>
);

const steps = [
  {
    num: '1', title: 'Create your account',
    items: ['Choose your plan — Free, Peace, Whole Picture, Legacy, or Family Legacy', 'Your QR emergency keychain is included with paid plans ($25 on Free)', 'Verify your email and set up optional two‑factor security', 'Your keychain ships within 7 days']
  },
  {
    num: '2', title: 'Build your vault',
    items: ['Write letters — unlimited edits, forever', 'Upload your will, trust, directives, policies & photos', 'Designate recipients for each letter and document', 'Schedule Milestone Delivery — letters held for graduations, weddings, birthdays', 'Update anything, anytime — your vault is always yours']
  },
  {
    num: '3', title: 'Designate your executor',
    items: ['Name the trusted person who will notify us when you pass', 'Give them the DepartingNotes.com/release link', 'Or — they simply scan the QR code on your keychain', 'No legal requirement — it can be anyone you trust']
  },
  {
    num: '4', title: 'When you pass',
    items: ['In an emergency, first responders scan your keychain to alert your contacts', 'Your executor visits the Release Portal', 'They submit your name, member ID, and death certificate', 'Our team verifies within 24–48 hours', 'Each recipient receives their messages — automatically, with love']
  },
];

const faqs = [
  { q: 'What if my executor loses my card?', a: 'No problem. They can use your full name and email address at DepartingNotes.com/release to begin the verification process.' },
  { q: 'Can I change my recipients after I set them?', a: 'Yes — anytime. Add, edit, or remove recipients and reassign letters and documents whenever you like.' },
  { q: 'What if I want to cancel?', a: 'You can cancel anytime from your account. Your vault and its contents are permanently deleted upon cancellation.' },
  { q: 'How long does release take after the death certificate is submitted?', a: 'Our team verifies each submission within 24–48 hours. Once approved, recipients receive their messages automatically.' },
  { q: 'Is this a legal document service?', a: 'No. DepartingNotes stores your personal messages and documents. For legal estate planning, connect with our partner attorney, R. Grace Rodriguez, Esq.' },
  { q: "Is my vault private from my family while I'm alive?", a: 'Yes. 100%. Always. Your vault unlocks only after a death certificate is verified — never before.' },
  { q: 'What is the keychain, and how does it work?', a: "It's a physical QR‑code tag that first responders can scan in an emergency. When scanned, your emergency contacts are notified and your designated letters can be triggered for release. Included with every paid plan, or $25 on the free plan." },
  { q: 'Can I have a letter delivered at a future milestone?', a: "Yes — that's Milestone Delivery. Write letters to be held and delivered at future life moments, like a child's graduation, wedding, birthday, or another meaningful milestone. They're entrusted to a designated distributor who chooses the right moment." },
  { q: 'When exactly are my letters released?', a: 'Nothing is released until your death is confirmed by documentation — that rule is set by the platform and is non‑negotiable. After confirmation, your own timing rules apply.' },
];

export default function HowItWorks() {
  return (
    <div className="bg-[var(--paper)]">

      {/* Hero */}
      <section className="pt-28 pb-16 px-5 md:px-8 text-center">
        <Eyebrow text="How it works" />
        <h1 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-bold text-[var(--forest)] leading-tight mb-5">
          Simple. Secure. Permanent.
        </h1>
        <p className="font-body text-[var(--text-soft)] text-lg max-w-xl mx-auto leading-relaxed">
          Here's exactly how DepartingNotes protects your legacy and delivers your final messages — to the people who need them most.
        </p>
      </section>

      {/* Steps */}
      <section className="pb-20 px-5 md:px-8">
        <div className="max-w-3xl mx-auto space-y-0">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-6 pb-12 last:pb-0 relative">
              {i < steps.length - 1 && (
                <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-[var(--border)]" />
              )}
              <div className="w-10 h-10 rounded-full bg-[var(--forest)] text-white font-body font-bold flex items-center justify-center flex-shrink-0 z-10 text-sm">
                {step.num}
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-2xl font-semibold text-[var(--forest)] mb-4">{step.title}</h2>
                <ul className="space-y-2.5">
                  {step.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] flex-shrink-0 mt-2" />
                      <span className="font-body text-[var(--text-soft)] text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="bg-[var(--paper-2)] py-16 md:py-20 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow text="Security you can trust" />
            <h2 className="font-heading text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-[var(--forest)] leading-tight">
              Built like a vault. Felt like a letter.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { Icon: Lock, title: 'AES‑256 encryption', body: 'Military‑grade protection for everything you store, at rest and in transit.' },
              { Icon: Shield, title: '100% private while you\'re alive', body: 'No one can access your vault — not your family, not even DepartingNotes staff.' },
              { Icon: Shield, title: 'Compliant & audited', body: 'CCPA & GDPR compliant, daily automated backups, annual third‑party audits.' },
              { Icon: Clock, title: 'Ethical release rules', body: 'Your vault stays sealed until death is confirmed by documentation. Non‑negotiable. Always.' },
            ].map((item, i) => {
              const Icon = item.Icon;
              return (
                <div key={i} className="bg-white border border-[var(--border)] rounded-2xl p-7 flex gap-4 hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-[var(--sage-soft)] flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[var(--forest)]" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-[var(--forest)] mb-2">{item.title}</h3>
                    <p className="font-body text-[var(--text-soft)] text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* QR Keychain feature */}
      <section className="py-16 md:py-20 px-5 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--forest)] rounded-3xl px-10 py-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-7 bg-[var(--gold)]" />
                <span className="font-body text-[var(--gold)] font-semibold text-xs uppercase tracking-widest">The keychain</span>
              </div>
              <h2 className="font-heading text-[clamp(1.6rem,3vw,2.4rem)] font-bold text-white mb-4 leading-tight">
                Always with you.<br />Always ready.
              </h2>
              <p className="font-body text-white/70 text-sm leading-relaxed mb-6">
                The QR‑code keychain rides on your keys. In an emergency, first responders scan it — your emergency contacts are notified and your designated letters can be triggered for release.
              </p>
              <ul className="space-y-2 text-sm">
                {['$25 add-on, or included with every paid plan', 'Replacement tag $15', 'Links directly to DepartingNotes.com/release'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <p className="font-body text-[var(--text-mute)] text-xs font-semibold uppercase tracking-wider mb-4">DepartingNotes Member</p>
              <p className="font-heading text-xl font-semibold text-[var(--forest)] mb-1">Maya Rodriguez</p>
              <p className="font-body text-[var(--text-mute)] text-xs mb-1">Member ID</p>
              <p className="font-mono text-[var(--forest)] text-sm font-bold mb-4">DN‑0042‑7841</p>
              <p className="font-body text-[var(--gold)] text-xs font-medium">DepartingNotes.com/release</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--paper-2)] py-16 md:py-20 px-5 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow text="Questions, answered" />
            <h2 className="font-heading text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-[var(--forest)] leading-tight">Frequently asked questions</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden px-1">
                <AccordionTrigger className="px-5 py-4 font-body font-medium text-[var(--text)] text-base hover:no-underline hover:text-[var(--forest)] transition-colors text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 font-body text-[var(--text-soft)] text-sm leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 py-16">
        <div className="max-w-3xl mx-auto bg-[var(--forest)] rounded-3xl py-14 px-8 text-center">
          <h2 className="font-heading text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-white mb-4">Ready to start?</h2>
          <p className="font-body text-white/65 mb-8">Create your free account in five minutes. Your loved ones will thank you for it.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-[var(--gold)] text-white font-body font-semibold px-10 py-4 rounded-full hover:bg-[#a06e25] transition-colors">
            Create Your Free Account <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}