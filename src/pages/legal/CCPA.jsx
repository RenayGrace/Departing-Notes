export default function CCPA() {
  const sections = [
    { title: 'Categories of Personal Information Collected', body: 'Identifiers (name, email address, IP address)\nPersonal information (date of birth, state of residence)\nFinancial information (payment method, processed by Stripe)\nInternet activity (platform usage, login history)\nContent you create (letters, documents, photos in your vault)' },
    { title: 'Purpose of Collection', body: 'Personal information is collected solely to provide the DepartingNotes service, process payments, deliver vault contents to designated recipients upon verified death, and improve platform security and functionality.' },
    { title: 'Right to Know', body: 'You have the right to request disclosure of the specific pieces of personal information we have collected about you, the categories of sources, our business purpose, and the categories of third parties with whom we share it.' },
    { title: 'Right to Delete', body: 'You have the right to request deletion of personal information we have collected. Deletion requires deletion of your account and vault. This action is irreversible.' },
    { title: 'Right to Opt Out of Sale', body: 'DepartingNotes does not sell personal information. We never have, and we never will. Your data — and especially your vault contents — will never be sold to any third party for any purpose.' },
    { title: 'How to Submit a CCPA Request', body: 'Email: privacy@departingnotes.com\nSubject line: CCPA Request\n\nWe will respond within 45 days of receiving a verifiable consumer request.' },
    { title: 'Non-Discrimination', body: 'We will not discriminate against you for exercising any of your CCPA rights.' },
  ];

  return (
    <div className="bg-[var(--paper)]">
      <section className="pt-28 pb-10 px-5 md:px-8 text-center">
        <p className="font-body text-[var(--gold)] font-semibold text-sm uppercase tracking-wider mb-4">Legal</p>
        <h1 className="font-heading text-4xl font-bold text-[var(--text)] mb-3">CCPA Notice</h1>
        <p className="font-body text-[var(--text-mute)] text-sm">California Consumer Privacy Act — Last updated: June 8, 2026</p>
      </section>
      <div className="max-w-3xl mx-auto px-5 md:px-8 pb-20 space-y-8">
        {sections.map((s, i) => (
          <div key={i}>
            <h2 className="font-heading text-xl font-semibold text-[var(--text)] mb-3">{s.title}</h2>
            <p className="font-body text-[var(--text-soft)] text-base leading-relaxed whitespace-pre-line">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}