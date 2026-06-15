/**
 * Exact plan feature map — mirrors the Plans page pricing table precisely.
 *
 * FREE            $0:   1 letter (to many), statutory will, letter templates,
 *                       join tribes only, $25 QR keychain add-on.
 *                       NO: basic estate, milestone delivery, budget review, AI review, GHICA, consult, trust discount.
 *
 * PEACE           $97:  Everything free + Unlimited letters, create tribes,
 *                       basic estate package, milestone delivery, 10% off Nara-Story.
 *                       QR keychain INCLUDED. NO: budget review, AI review, GHICA, consult, trust discount.
 *
 * WHOLE PICTURE   $197: Everything Peace + annual budget review,
 *                       upload redacted bank statements.
 *                       NO: AI review, GHICA, consult, trust discount.
 *
 * LEGACY          $297: Everything Whole Picture + AI estate review,
 *                       GHICA attorney network, free consultation, 20% off trust packages.
 *
 * FAMILY LEGACY   $397: Two full Legacy memberships — everything in Legacy × 2 members.
 */

export const PLAN_FEATURES = {
  free: {
    // Letters
    maxLetters: 1,
    unlimitedLetters: false,
    // Documents
    statutoryWill: true,
    letterTemplates: true,
    basicEstatePackage: false,
    uploadBankStatements: false,
    // Delivery
    milestoneDelivery: false,
    // Tribes
    canCreateTribe: false,
    canJoinTribe: true,
    // Financial / Legal
    annualBudgetReview: false,
    aiEstateReview: false,
    ghicaNetwork: false,
    freeConsultation: false,
    trustDiscount: false,
    naraStoryDiscount: false,
    // Keychain
    keychainIncluded: false,   // $25 add-on
    // Membership
    membersCount: 1,
    // Pricing
    annualPrice: 0,
    monthlyPrice: 0,
  },
  peace: {
    maxLetters: Infinity,
    unlimitedLetters: true,
    statutoryWill: true,
    letterTemplates: true,
    basicEstatePackage: true,
    uploadBankStatements: false,
    milestoneDelivery: true,
    canCreateTribe: true,
    canJoinTribe: true,
    annualBudgetReview: false,
    aiEstateReview: false,
    ghicaNetwork: false,
    freeConsultation: false,
    trustDiscount: false,
    naraStoryDiscount: true,   // 10% off Nara-Story
    keychainIncluded: true,
    membersCount: 1,
    annualPrice: 97,
    monthlyPrice: 9.97,
  },
  'whole-picture': {
    maxLetters: Infinity,
    unlimitedLetters: true,
    statutoryWill: true,
    letterTemplates: true,
    basicEstatePackage: true,
    uploadBankStatements: true,
    milestoneDelivery: true,
    canCreateTribe: true,
    canJoinTribe: true,
    annualBudgetReview: true,
    aiEstateReview: false,
    ghicaNetwork: false,
    freeConsultation: false,
    trustDiscount: false,
    naraStoryDiscount: true,
    keychainIncluded: true,
    membersCount: 1,
    annualPrice: 197,
    monthlyPrice: 19.97,
  },
  legacy: {
    maxLetters: Infinity,
    unlimitedLetters: true,
    statutoryWill: true,
    letterTemplates: true,
    basicEstatePackage: true,
    uploadBankStatements: true,
    milestoneDelivery: true,
    canCreateTribe: true,
    canJoinTribe: true,
    annualBudgetReview: true,
    aiEstateReview: true,
    ghicaNetwork: true,
    freeConsultation: true,
    trustDiscount: true,
    naraStoryDiscount: true,
    keychainIncluded: true,
    membersCount: 1,
    annualPrice: 297,
    monthlyPrice: 29.97,
  },
  'family-legacy': {
    maxLetters: Infinity,
    unlimitedLetters: true,
    statutoryWill: true,
    letterTemplates: true,
    basicEstatePackage: true,
    uploadBankStatements: true,
    milestoneDelivery: true,
    canCreateTribe: true,
    canJoinTribe: true,
    annualBudgetReview: true,
    aiEstateReview: true,
    ghicaNetwork: true,
    freeConsultation: true,
    trustDiscount: true,
    naraStoryDiscount: true,
    keychainIncluded: true,
    membersCount: 2,
    annualPrice: 397,
    monthlyPrice: 39.97,
  },
};

export function getPlanFeatures(tier) {
  return PLAN_FEATURES[tier] || PLAN_FEATURES['free'];
}

export const PLAN_LABELS = {
  free: 'Free',
  peace: 'The Peace Plan',
  'whole-picture': 'The Whole Picture',
  legacy: 'The Legacy Plan',
  'family-legacy': 'The Family Legacy',
};

// Human-readable feature list for a given plan — what you get vs. what's locked
export function getPlanSummary(tier) {
  const p = getPlanFeatures(tier);
  return {
    included: [
      p.unlimitedLetters ? 'Unlimited letters' : '1 letter (to many recipients)',
      p.statutoryWill && 'Statutory will',
      p.letterTemplates && 'Letter-writing templates',
      p.keychainIncluded ? 'QR emergency keychain (included)' : null,
      p.basicEstatePackage && 'Basic estate package',
      p.milestoneDelivery && 'Milestone delivery',
      p.canCreateTribe ? 'Create & join Tribes' : 'Join Tribes (invite only)',
      p.uploadBankStatements && 'Upload redacted bank statements',
      p.annualBudgetReview && 'Annual budget review',
      p.aiEstateReview && 'AI estate plan review',
      p.ghicaNetwork && 'GHICA attorney network',
      p.freeConsultation && 'Free attorney consultation',
      p.trustDiscount && '20% off trust packages',
      p.naraStoryDiscount && '10% off Nara-Story',
      p.membersCount === 2 && '2 full memberships (couple)',
    ].filter(Boolean),
    locked: [
      !p.keychainIncluded && 'QR emergency keychain — $25 add-on',
      !p.unlimitedLetters && 'Unlimited letters',
      !p.basicEstatePackage && 'Basic estate package',
      !p.milestoneDelivery && 'Milestone delivery',
      !p.canCreateTribe && 'Create your own Tribe',
      !p.annualBudgetReview && 'Annual budget review',
      !p.aiEstateReview && 'AI estate plan review',
      !p.ghicaNetwork && 'GHICA attorney network',
      !p.freeConsultation && 'Free attorney consultation',
      !p.trustDiscount && '20% off trust packages',
    ].filter(Boolean),
  };
}