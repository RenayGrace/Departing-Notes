import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Check } from 'lucide-react';

const Logo = () => (
  <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
    <rect x="3" y="14" width="34" height="22" rx="6" fill="#1F3D34"/>
    <path d="M6 17.5 20 27l14-9.5" stroke="#FBF8F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 14c0-4 2.4-6.8 0-11-2.4 4.2 0 7 0 11Z" fill="#8BA888"/>
    <path d="M20 14c.2-3 2.6-4.6 5-5.2-1 2.8-2.6 4.4-5 5.2Z" fill="#B9802F"/>
    <circle cx="20" cy="5" r="1.8" fill="#EAD9BC"/>
  </svg>
);

const plans = [
  { name: 'The Peace Plan', price: '$97', period: '/ year', features: ['Unlimited letters & Tribes', 'Basic estate package', 'Keychain included'] },
  { name: 'The Whole Picture', price: '$197', period: '/ year', features: ['Everything in Peace Plan', 'Annual budget review', 'Financial clarity, no judgment'] },
  { name: 'The Legacy Plan', price: '$297', period: '/ year', features: ['AI estate review', 'GHICA attorneys · free consult', '20% off trusts'], popular: true },
  { name: 'The Family Legacy', price: '$397', period: '/ year', features: ['Two full Legacy memberships', 'Everything, for both of you', 'Plan together'] },
];

const testimonials = [
  { quote: "I wrote letters to each of my grandchildren. Knowing they'll receive them someday gives me a peace I can't describe.", name: "Eleanor M.", role: "Premium member, Ohio", initials: "EM", color: "bg-[var(--sage-soft)] text-[var(--forest)]" },
  { quote: "Setting it up took ten minutes. The relief has lasted ever since. This is the kindest thing I've done for my family.", name: "David R.", role: "Family plan, Texas", initials: "DR", color: "bg-[var(--forest)] text-white" },
  { quote: "When my mother passed, her letter arrived two days later. I'll treasure those words for the rest of my life.", name: "Sofia P.", role: "Recipient, California", initials: "SP", color: "bg-[var(--rose)] text-white" },
];

const partners = [
  { icon: '📖', bg: 'bg-[var(--gold-soft)]', name: 'Richard Squire', role: 'Life Story Narrative Services', quote: '"We help you write the story of your life — in your words, for the people you love."', slug: 'richard-squire' },
  { icon: '⌂', bg: 'bg-[#F3DED8]', name: 'R. Grace Rodriguez, Esq.', role: 'Estate Planning & Legal Services', quote: '"Every vault should be backed by a legally sound estate plan. We make that easy."', slug: 'grace-rodriguez' },
];

const Eyebrow = ({ text }) => (
  <div className="flex items-center gap-3 justify-center mb-4">
    <div className="h-px w-7 bg-[var(--gold)]" />
    <span className="font-body text-[var(--gold)] font-semibold text-xs uppercase tracking-widest">{text}</span>
  </div>
);

export default function Home() {
  return (
    <div className="bg-[var(--paper)]">

      {/* ── HERO ── */}
      <section className="pt-24 pb-20 md:pt-32 md:pb-28 px-5 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 border border-[var(--border)] bg-white rounded-full px-4 py-2 font-body text-sm text-[var(--text-soft)] mb-8">
              <Shield size={14} className="text-[var(--sage)]" />
              Trusted, encrypted, attorney-backed
            </span>

            <h1 className="font-heading text-[clamp(2.8rem,6vw,5rem)] font-bold text-[var(--forest)] leading-[1.08] mb-6">
              Leave a note.<br />
              <span style={{ fontFamily: 'var(--font-hand)', fontWeight: 400 }} className="text-[var(--gold)] italic">Just in case.</span>
            </h1>

            <p className="font-body text-[var(--text-soft)] text-lg leading-relaxed max-w-md mb-10">
              Your words. Your legacy. Delivered to the people you love — exactly when it matters most.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-10">
              <Link to="/register" className="inline-flex items-center gap-2 bg-[var(--forest)] text-white font-body font-semibold text-base px-7 py-3.5 rounded-full hover:bg-[var(--forest-600)] transition-colors">
                Create Your Free Account <ArrowRight size={16} />
              </Link>
              <Link to="/how-it-works" className="inline-flex items-center gap-2 bg-white border border-[var(--border)] text-[var(--text)] font-body font-medium text-base px-7 py-3.5 rounded-full hover:border-[var(--forest)] transition-colors">
                See How It Works
              </Link>
            </div>

            <div className="flex flex-wrap gap-5 font-body text-sm text-[var(--text-mute)]">
              {['AES-256 encrypted', 'Private while you\'re alive', 'Free to start'].map(f => (
                <span key={f} className="flex items-center gap-1.5">
                  <Check size={13} className="text-[var(--sage)]" strokeWidth={2.5} />
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Right — letter card */}
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl border border-[var(--border)] p-8 max-w-sm w-full">
                <p className="font-body text-[var(--text-mute)] text-xs uppercase tracking-widest mb-3">To my daughter, Maya</p>
                <p className="font-heading text-[var(--forest)] text-lg leading-relaxed mb-5">
                  If you're reading this, know that every good thing I ever did, I did thinking of you...
                </p>
                <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.4rem' }} className="text-[var(--gold)]">
                  — With all my love, Mom
                </p>
              </div>
              {/* DN badge */}
              <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-[var(--rose)] flex items-center justify-center shadow-md">
                <span className="font-body font-bold text-white text-xs">DN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY THIS MATTERS ── */}
      <section className="bg-[var(--paper-2)] py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow text="Why this matters" />
          <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold text-[var(--forest)] mb-7 leading-tight">
            What happens to your words<br />when you're gone?
          </h2>
          <p className="font-body text-[var(--text-soft)] text-lg leading-relaxed mb-5">
            Most people leave behind bills to pay and closets to clean out. Very few leave behind the words
            that matter — the goodbye, the <em className="text-[var(--gold)] not-italic font-medium">I love you</em>, the final message to the people who needed to
            hear it most.
          </p>
          <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.5rem' }} className="text-[var(--gold)]">
            DepartingNotes changes that.
          </p>
        </div>
      </section>

      {/* ── THREE STEPS ── */}
      <section className="py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Eyebrow text="Simple as 1, 2, 3" />
            <h2 className="font-heading text-[clamp(2rem,5vw,3rem)] font-bold text-[var(--forest)] leading-tight">
              Three steps to peace of mind
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { num: '1', title: 'Write', desc: 'Write letters, upload documents, and record your final wishes in a beautiful, private space made just for them.' },
              { num: '2', title: 'Store', desc: "Everything is locked in your encrypted vault. While you're alive, only you can open it — no exceptions, ever." },
              { num: '3', title: 'Release', desc: 'When you pass, your executor submits your death certificate — and your messages are delivered, automatically.' },
            ].map((s) => (
              <div key={s.num} className="bg-white border border-[var(--border)] rounded-2xl p-8 hover:shadow-md transition-shadow">
                <div className="w-9 h-9 rounded-full bg-[var(--forest)] text-white font-body font-bold flex items-center justify-center text-sm mb-5">
                  {s.num}
                </div>
                <h3 className="font-heading text-xl font-semibold text-[var(--forest)] mb-3">{s.title}</h3>
                <p className="font-body text-[var(--text-soft)] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/register" className="inline-flex items-center gap-2 bg-[var(--gold)] text-white font-body font-semibold px-8 py-3.5 rounded-full hover:bg-[#a06e25] transition-colors">
              Start for Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── PLANS (dark) ── */}
      <section className="bg-[var(--ink-deep)] py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center gap-3 justify-center mb-4">
              <div className="h-px w-7 bg-[var(--gold)]" />
              <span className="font-body text-[var(--gold)] font-semibold text-xs uppercase tracking-widest">Choose your plan</span>
            </div>
            <h2 className="font-heading text-[clamp(2rem,5vw,3rem)] font-bold text-white mb-4 leading-tight">
              Start free. Grow when you're ready.
            </h2>
            <p className="font-body text-white/55 max-w-xl mx-auto">
              Begin free, or choose a plan. Every <strong className="text-white/80">paid plan includes your QR emergency keychain</strong> — free members can add it for $25.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-7 flex flex-col border ${
                plan.popular
                  ? 'bg-[var(--forest)] border-[var(--gold)] border-opacity-60'
                  : 'bg-white/5 border-white/10'
              }`}>
                {plan.popular && (
                  <span className="inline-block bg-[var(--gold)] text-white font-body font-semibold text-xs px-3 py-1 rounded-full mb-4 self-start">Most complete</span>
                )}
                <h3 className="font-heading text-xl font-bold text-white mb-2 leading-tight">{plan.name}</h3>
                <p className="font-body text-white/55 text-sm mb-5">{plan.price} {plan.period}</p>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`font-body text-sm ${plan.popular ? 'text-[var(--gold-soft)]' : 'text-white/65'}`}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/plans" className="inline-flex items-center gap-2 bg-white text-[var(--forest)] font-body font-semibold px-8 py-3.5 rounded-full hover:bg-[var(--paper)] transition-colors">
              See Full Plans
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRIBES ── */}
      <section className="py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-7 bg-[var(--gold)]" />
              <span className="font-body text-[var(--gold)] font-semibold text-xs uppercase tracking-widest">Tribes</span>
            </div>
            <h2 className="font-heading text-[clamp(2rem,5vw,3rem)] font-bold text-[var(--forest)] leading-tight mb-6">
              Stay connected —<br />even after you're gone.
            </h2>
            <p className="font-body text-[var(--text-soft)] text-base leading-relaxed mb-4">
              Tribes are communities of people who want to be remembered together. Your church family. Your high-school class. Your book club.
            </p>
            <p className="font-body text-[var(--text-soft)] text-sm leading-relaxed mb-8">
              Create a Tribe and invite the people who matter to you — so when it's time, no one is left wondering. <strong className="text-[var(--text)]">No one is left to find out three months too late.</strong>
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-[var(--forest)] text-white font-body font-semibold px-7 py-3.5 rounded-full hover:bg-[var(--forest-600)] transition-colors">
              Create Your Tribe
            </Link>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-2xl p-8 shadow-sm">
            {/* Avatars */}
            <div className="flex items-center mb-5">
              {['JM','RS','AL','KP'].map((init, i) => (
                <div key={init} className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-body font-semibold text-xs text-[var(--forest)] bg-[var(--sage-soft)]" style={{ marginLeft: i === 0 ? 0 : '-8px', zIndex: 4-i }}>
                  {init}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-body font-semibold text-xs text-[var(--gold)] bg-[var(--gold-soft)]" style={{ marginLeft: '-8px' }}>
                +74
              </div>
            </div>
            <h3 className="font-heading text-xl font-semibold text-[var(--text)] mb-1">Riverside Book Club</h3>
            <p className="font-body text-[var(--text-mute)] text-sm mb-5">78 members · founded 2019</p>
            <blockquote className="font-body text-[var(--gold)] text-sm italic leading-relaxed">
              "We read 200 books together. Now we'll remember each other forever."
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── PARTNERS ── */}
      <section className="bg-[var(--paper-2)] py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow text="Trusted partners" />
            <h2 className="font-heading text-[clamp(2rem,5vw,3rem)] font-bold text-[var(--forest)] mb-4">
              Your legacy, fully supported
            </h2>
            <p className="font-body text-[var(--text-soft)] max-w-xl mx-auto">
              Premium and Family members get direct access to vetted professionals who help protect what you've built.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {partners.map((p) => (
              <div key={p.name} className="bg-white border border-[var(--border)] rounded-2xl p-7">
                <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center font-body font-semibold text-sm text-[var(--text)] mb-5`}>
                  {p.icon}
                </div>
                <h3 className="font-heading text-xl font-semibold text-[var(--forest)] mb-1">{p.name}</h3>
                <p className="font-body text-[var(--gold)] text-sm mb-3">{p.role}</p>
                <p className="font-body text-[var(--text-soft)] text-sm leading-relaxed italic mb-5">{p.quote}</p>
                <Link to={`/partners#${p.slug}`} className="font-body text-sm text-[var(--forest)] font-semibold hover:underline flex items-center gap-1">
                  Learn more <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center mb-14">
            {[
              { val: '12,480+', label: 'accounts already created' },
              { val: '38,200', label: 'letters safely stored' },
              { val: '4.9★', label: 'average member rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-[clamp(1.8rem,4vw,3.2rem)] font-bold text-[var(--gold)]">{stat.val}</p>
                <p className="font-body text-[var(--text-mute)] text-xs md:text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-[var(--border)] rounded-2xl p-7">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} viewBox="0 0 20 20" className="w-4 h-4 fill-[var(--gold)]"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p className="font-body text-[var(--text-soft)] text-sm leading-relaxed italic mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-body font-bold text-xs flex-shrink-0 ${t.color}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-body text-[var(--text)] text-sm font-semibold">{t.name}</p>
                    <p className="font-body text-[var(--text-mute)] text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="font-body text-[var(--text-mute)] text-xs text-center italic">
            Member stories shown are illustrative as we welcome our founding community.
          </p>
        </div>
      </section>

      {/* ── CORE PROMISE ── */}
      <section className="bg-[var(--paper-2)] py-16 md:py-20 px-5 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--forest)] rounded-3xl px-10 py-14 text-center">
            <p className="font-heading text-[clamp(1.1rem,2.5vw,1.5rem)] text-white/90 leading-relaxed italic max-w-2xl mx-auto">
              "Imagine lying in a car accident, unable to reach anyone. DepartingNotes gives you the peace of knowing your letters are already written, already sealed, already on their way to the people you love."
            </p>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-5 md:px-8 py-20 md:py-28">
        <div className="max-w-4xl mx-auto bg-[var(--forest)] rounded-3xl py-20 px-8 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 justify-center mb-5">
              <div className="h-px w-7 bg-[var(--gold)]" />
              <span className="font-body text-[var(--gold)] font-semibold text-xs uppercase tracking-widest">It takes 5 minutes</span>
            </div>
            <h2 className="font-heading text-[clamp(2rem,5vw,3.2rem)] font-bold text-white mb-5 leading-tight">
              Don't wait. Start your note today.
            </h2>
            <p className="font-body text-white/65 text-base leading-relaxed mb-10 max-w-lg mx-auto">
              It takes less than five minutes to create your free account. Your loved ones will thank you
              for it — in a moment you'll never see, but they'll never forget.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-[var(--gold)] text-white font-body font-semibold text-base px-10 py-4 rounded-full hover:bg-[#a06e25] transition-colors">
              Create Your Free Account — It's Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}