import { Link } from 'react-router-dom';
import { ArrowRight, QrCode, Lock, Calendar, UserCheck, Package } from 'lucide-react';

const Eyebrow = ({ text }) => (
  <div className="flex items-center gap-3 justify-center mb-4">
    <div className="h-px w-7 bg-[var(--gold)]" />
    <span className="font-body text-[var(--gold)] font-semibold text-xs uppercase tracking-widest">{text}</span>
  </div>
);

const uniqueFeatures = [
  {
    Icon: QrCode,
    title: 'Physical Keychain QR Code',
    desc: 'First responders scan it and trigger an automatic notification chain — so even in the worst moment, your people are reached immediately.',
    color: 'bg-[var(--sage-soft)] text-[var(--forest)]',
  },
  {
    Icon: Lock,
    title: 'Encrypted Vault',
    desc: 'AES-256 encrypted. Letters are released only after a death certificate is submitted and verified by your executor — never before.',
    color: 'bg-[var(--forest)] text-white',
  },
  {
    Icon: Calendar,
    title: 'Milestone Delivery',
    desc: 'Letters held for graduations, weddings, anniversaries — delivered automatically, decades later, exactly when it matters most.',
    color: 'bg-[var(--gold-soft)] text-[var(--gold)]',
  },
  {
    Icon: UserCheck,
    title: 'Trusted Distributor Role',
    desc: 'Designate a trusted person who holds and delivers letters at the right moment — on your behalf, with grace and intention.',
    color: 'bg-[var(--sage-soft)] text-[var(--forest)]',
  },
  {
    Icon: Package,
    title: 'Physical Sealed Envelope',
    desc: 'A tangible heirloom that sits on a shelf — a real letter, sealed and delivered to your loved ones when the time comes.',
    color: 'bg-[#F3DED8] text-[var(--rose)]',
  },
];

export default function About() {
  return (
    <div className="bg-[var(--paper)]">

      {/* HERO */}
      <section className="pt-28 pb-16 px-5 md:px-8 text-center">
        <Eyebrow text="Our mission" />
        <h1 className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-[var(--forest)] leading-[1.08] mb-6">
          Wouldn't it be a shame if all<br />of your love died with you?
        </h1>
        <p className="font-body text-[var(--text-soft)] text-xl max-w-2xl mx-auto leading-relaxed">
          DepartingNotes is a love vault — giving people the peace of knowing their words will reach the people they love, no matter what happens.
        </p>
      </section>

      {/* CORE PROMISE */}
      <section className="px-5 md:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--forest)] rounded-3xl px-10 py-14 text-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="font-heading text-[clamp(1.2rem,2.5vw,1.6rem)] text-white/90 leading-relaxed italic max-w-2xl mx-auto">
                "Imagine lying in a car accident, unable to reach anyone. DepartingNotes gives you the peace of knowing your letters are already written, already sealed, already on their way to the people you love."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ORIGIN STORY */}
      <section className="bg-[var(--paper-2)] py-16 md:py-24 px-5 md:px-8">
        <div className="max-w-3xl mx-auto">
          <Eyebrow text="The story behind it" />
          <h2 className="font-heading text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-[var(--forest)] text-center mb-10 leading-tight">
            78 people who loved him.<br />Not one got to say goodbye.
          </h2>
          <div className="font-body text-[var(--text-soft)] text-lg leading-relaxed space-y-5">
            <p>
              Years ago, our founder had a friend she only knew online. He was part of a community of 78 people — real friendships, real love, built over years of shared experiences. One day, he simply disappeared.
            </p>
            <p>
              Three months later, his wife found the community and told them he had passed away suddenly.
            </p>
            <p className="font-semibold text-[var(--text)] text-xl">
              78 people who loved him. Not one got to say goodbye.
            </p>
            <p>
              That is the problem DepartingNotes exists to solve. We are a membership-based digital legacy platform — a place where anyone, regardless of income, can leave letters, documents, photos, and final messages for the people they love.
            </p>
            <p>
              Everything is stored in an encrypted vault and released to designated recipients only when a member passes away — triggered by a death certificate submitted by their executor.
            </p>
            <p className="font-semibold text-[var(--forest)] text-lg">This is not a tech project. This is a mission.</p>
          </div>
        </div>
      </section>

      {/* UNIQUE FEATURES */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Eyebrow text="What makes us different" />
            <h2 className="font-heading text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-[var(--forest)] leading-tight">
              Features built for real life
            </h2>
            <p className="font-body text-[var(--text-soft)] mt-3 max-w-xl mx-auto">
              Every feature was born from a real need — people who wanted to make sure their love arrived, on time, exactly when it was needed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {uniqueFeatures.map(({ Icon, title, desc, color }) => (
              <div key={title} className="bg-white border border-[var(--border)] rounded-2xl p-7 hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-5`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[var(--forest)] mb-3">{title}</h3>
                <p className="font-body text-[var(--text-soft)] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
            {/* 6th card — the promise */}
            <div className="bg-[var(--forest)] rounded-2xl p-7 flex flex-col justify-between">
              <p className="font-heading text-white text-lg leading-relaxed italic">
                "We don't want to leave without leaving a note behind. But we want the note to stay private until we're gone."
              </p>
              <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem' }} className="text-[var(--gold-soft)] mt-4">
                — The DepartingNotes promise
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-[var(--paper-2)] py-16 md:py-20 px-5 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow text="What we believe" />
            <h2 className="font-heading text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-[var(--forest)] leading-tight">
              The values we build on
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: 'Dignity for all', body: 'Saying goodbye should not be a luxury. A free plan will always exist, for everyone.' },
              { title: 'Privacy is sacred', body: 'Your vault is yours alone while you live. No exceptions, no back doors, ever.' },
              { title: 'Love, delivered', body: 'The right words at the right moment can heal a lifetime of hurt.' },
            ].map((v) => (
              <div key={v.title} className="bg-white border border-[var(--border)] rounded-2xl p-7 text-center">
                <div className="w-10 h-10 rounded-full bg-[var(--sage-soft)] mx-auto mb-4 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[var(--sage)]" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-[var(--forest)] mb-3">{v.title}</h3>
                <p className="font-body text-[var(--text-soft)] text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-16 md:py-20 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow text="The team" />
            <h2 className="font-heading text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-[var(--forest)] leading-tight">
              Built by people who care
            </h2>
            <p className="font-body text-[var(--text-soft)] mt-3">
              Founded by R. Grace (Renay) Rodriguez, Esq., with co-founder Mike Medina and CTO Jude Vicentillo — a small team on a large mission.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { initials: 'RGR', name: 'R. Grace (Renay) Rodriguez, Esq.', title: 'Founder & CEO', bio: 'Estate planning attorney and the visionary behind DepartingNotes — built from a deeply personal place.' },
              { initials: 'MM', name: 'Mike Medina', title: 'Co-Founder & VP Marketing', bio: "Ensures the platform's mission reaches every person who needs it — across every channel and community." },
              { initials: 'JV', name: 'Jude Vicentillo', title: 'Chief Technology Officer', bio: 'Architect of the platform — responsible for security, reliability, and the innovation that makes the vault impenetrable.' },
            ].map((person) => (
              <div key={person.name} className="bg-white border border-[var(--border)] rounded-2xl p-7 text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--sage-soft)] text-[var(--forest)] font-heading font-bold flex items-center justify-center mx-auto mb-4 text-sm">
                  {person.initials}
                </div>
                <p className="font-body text-[var(--gold)] text-xs font-semibold uppercase tracking-wide mb-1">{person.title}</p>
                <h3 className="font-heading text-lg font-semibold text-[var(--text)] mb-3">{person.name}</h3>
                <p className="font-body text-[var(--text-soft)] text-sm leading-relaxed">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 pb-20">
        <div className="max-w-4xl mx-auto bg-[var(--forest)] rounded-3xl py-16 px-8 text-center">
          <div className="flex items-center gap-3 justify-center mb-5">
            <div className="h-px w-7 bg-[var(--gold)]" />
            <span className="font-body text-[var(--gold)] font-semibold text-xs uppercase tracking-widest">It's free to start</span>
          </div>
          <h2 className="font-heading text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-white mb-5 leading-tight">
            Join the mission today.
          </h2>
          <p className="font-body text-white/65 mb-8 max-w-md mx-auto">
            Create your free account in five minutes. Your loved ones will thank you for it.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-[var(--gold)] text-white font-body font-semibold px-10 py-4 rounded-full hover:bg-[#a06e25] transition-colors">
            Create Your Free Account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}