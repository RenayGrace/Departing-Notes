import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Eyebrow = ({ text }) => (
  <div className="flex items-center gap-3 justify-center mb-4">
    <div className="h-px w-7 bg-[var(--gold)]" />
    <span className="font-body text-[var(--gold)] font-semibold text-xs uppercase tracking-widest">{text}</span>
  </div>
);

const partners = [
  {
    id: 'richard-squire',
    icon: '📖',
    bg: 'bg-[var(--gold-soft)]',
    name: 'Richard Squire',
    role: 'Life Story Narrative Services',
    quote: '"We help you write the story of your life — in your words, for the people you love."',
    bio: 'Richard and his team conduct gentle interviews and turn your memories into a beautifully written narrative, woven directly into your vault for your loved ones to keep forever.',
    cta: 'Connect with Richard',
  },
  {
    id: 'grace-rodriguez',
    icon: '⚖',
    bg: 'bg-[#F3DED8]',
    name: 'R. Grace Rodriguez, Esq.',
    role: 'Estate Planning & Legal Services',
    quote: '"Every vault should be backed by a legally sound estate plan. We make that easy."',
    bio: 'As the founder of DepartingNotes and a practicing attorney, Grace and her firm offer wills, trusts, powers of attorney, and healthcare directives — and a directory of G.H.I.C.A.-verified attorneys in your state.',
    cta: 'Schedule a consultation',
  },
];

export default function Partners() {
  return (
    <div className="bg-[var(--paper)]">

      {/* Hero */}
      <section className="pt-28 pb-16 px-5 md:px-8 text-center">
        <Eyebrow text="Our partners" />
        <h1 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-bold text-[var(--forest)] leading-tight mb-5">
          Your legacy, fully supported
        </h1>
        <p className="font-body text-[var(--text-soft)] text-lg max-w-xl mx-auto leading-relaxed">
          Premium and Family members get direct access to trusted professionals who help you protect everything you've built — in words, in wealth, and in law.
        </p>
      </section>

      {/* Partner cards */}
      <section className="pb-20 px-5 md:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {partners.map((partner) => (
            <div key={partner.id} id={partner.id} className="bg-white border border-[var(--border)] rounded-2xl p-8 md:p-10 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-7">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-2xl ${partner.bg} flex items-center justify-center font-body font-bold text-2xl`}>
                    {partner.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-body text-[var(--gold)] text-xs font-semibold uppercase tracking-widest mb-1">{partner.role}</p>
                  <h2 className="font-heading text-2xl font-semibold text-[var(--forest)] mb-4">{partner.name}</h2>
                  <blockquote className="font-heading text-xl italic text-[var(--text-soft)] leading-relaxed mb-5">
                    {partner.quote}
                  </blockquote>
                  <p className="font-body text-[var(--text-soft)] text-base leading-relaxed mb-6">{partner.bio}</p>
                  <Link to="/contact" className="inline-flex items-center gap-2 bg-[var(--forest)] text-white font-body font-semibold text-sm px-7 py-2.5 rounded-full hover:bg-[var(--forest-600)] transition-colors">
                    {partner.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upgrade CTA */}
      <section className="px-5 md:px-8 pb-20">
        <div className="max-w-4xl mx-auto bg-[var(--forest)] rounded-3xl py-14 px-8 text-center">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="h-px w-7 bg-[var(--gold)]" />
            <span className="font-body text-[var(--gold)] font-semibold text-xs uppercase tracking-widest">Unlock partner access</span>
          </div>
          <h2 className="font-heading text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-white mb-4">Upgrade to Premium or Family</h2>
          <p className="font-body text-white/65 mb-8 max-w-md mx-auto">Connect with our full network of vetted professionals — included with Legacy and Family Legacy plans.</p>
          <Link to="/plans" className="inline-flex items-center gap-2 bg-[var(--gold)] text-white font-body font-semibold px-10 py-4 rounded-full hover:bg-[#a06e25] transition-colors">
            See Plans <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}