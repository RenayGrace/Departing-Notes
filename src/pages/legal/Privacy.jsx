export default function Privacy() {
  const sections = [
    { title: '1. Information We Collect', body: 'We collect information you provide when you create an account: name, email, date of birth, state of residence, payment information (processed by Stripe), and vault contents (letters, documents, photos).' },
    { title: '2. How We Use Your Information', body: 'We use your information solely to provide the DepartingNotes service. Vault contents are used exclusively to deliver them to your designated recipients upon verified death certificate submission. We never use vault contents for marketing or analytics.' },
    { title: '3. How We Store Your Information', body: 'All vault contents are encrypted using AES-256 encryption, at rest and in transit. Your vault is 100% private while you are alive — not even DepartingNotes staff can access its contents. We maintain daily automated backups and conduct annual third-party security audits.' },
    { title: '4. Third-Party Sharing', body: 'We do not sell, rent, or share your personal information or vault contents with any third parties. The only exception is when you explicitly designate a recipient and your vault is lawfully released following death certificate verification.' },
    { title: '5. CCPA Rights (California Residents)', body: 'You have the right to know what personal information we collect, the right to delete your personal information, and the right to opt out of the sale of personal information. DepartingNotes does not sell data. To submit a request: privacy@departingnotes.com. We respond within 45 days.' },
    { title: '6. GDPR Rights', body: 'You have the right to access your personal data, the right to rectification, the right to erasure, the right to data portability, and the right to object to processing. Contact privacy@departingnotes.com to exercise these rights.' },
    { title: '7. Contact', body: 'privacy@departingnotes.com\nDepartingNotes Co.\n21000 Devonshire Street, Suite 111\nChatsworth, California 91311' },
  ];

  return (
    <div className="bg-[var(--paper)]">
      <section className="pt-28 pb-10 px-5 md:px-8 text-center">
        <p className="font-body text-[var(--gold)] font-semibold text-sm uppercase tracking-wider mb-4">Legal</p>
        <h1 className="font-heading text-4xl font-bold text-[var(--text)] mb-3">Privacy Policy</h1>
        <p className="font-body text-[var(--text-mute)] text-sm">Last updated: June 8, 2026</p>
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