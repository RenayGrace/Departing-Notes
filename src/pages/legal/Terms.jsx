export default function Terms() {
  const sections = [
    { title: '1. Eligibility', body: 'DepartingNotes is available to individuals who are 18 years of age or older and are residents of the United States. International expansion is planned for Year 2.' },
    { title: '2. Membership Terms', body: 'Membership is available in five tiers: Free, The Peace Plan ($97/yr), The Whole Picture ($197/yr), The Legacy Plan ($297/yr), and The Family Legacy ($397/yr). Paid plans include the QR emergency keychain. The free plan may add the keychain for $25.' },
    { title: '3. Billing & Cancellation', body: 'Subscriptions are billed annually or monthly. You may cancel anytime through your account dashboard. Upon cancellation, your vault and all contents are permanently deleted. This action is irreversible.' },
    { title: '4. Vault Ownership', body: 'You own all content you create and upload. DepartingNotes has no ownership claim over your letters, documents, or personal information. DepartingNotes owns all platform intellectual property.' },
    { title: '5. Death Verification Process', body: "Upon submission of a death certificate by an executor, DepartingNotes will verify the document within 24-48 hours. On approval, vault contents are automatically delivered to designated recipients. The member's account will be memorialized upon successful verification." },
    { title: '6. Limitation of Liability', body: 'DepartingNotes provides the platform on an "as is" basis. We make no warranties regarding uninterrupted service. Our total liability shall not exceed the amount paid by you in the 12 months prior to the claim.' },
    { title: '7. Governing Law', body: 'These Terms are governed by the laws of the State of California. Any disputes shall be resolved in the courts of Los Angeles County, California.' },
    { title: '8. Contact', body: 'legal@departingnotes.com' },
  ];

  return (
    <div className="bg-[var(--paper)]">
      <section className="pt-28 pb-10 px-5 md:px-8 text-center">
        <p className="font-body text-[var(--gold)] font-semibold text-sm uppercase tracking-wider mb-4">Legal</p>
        <h1 className="font-heading text-4xl font-bold text-[var(--text)] mb-3">Terms of Service</h1>
        <p className="font-body text-[var(--text-mute)] text-sm">Last updated: June 8, 2026</p>
      </section>
      <div className="max-w-3xl mx-auto px-5 md:px-8 pb-20 space-y-8">
        {sections.map((s, i) => (
          <div key={i}>
            <h2 className="font-heading text-xl font-semibold text-[var(--text)] mb-3">{s.title}</h2>
            <p className="font-body text-[var(--text-soft)] text-base leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}