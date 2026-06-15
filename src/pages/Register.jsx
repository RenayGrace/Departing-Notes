import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const plans = [
  { key: 'free', label: 'Free', price: '$0', period: '/yr', desc: 'One letter to many · statutory will · templates · $25 keychain' },
  { key: 'peace', label: 'The Peace Plan', price: '$97', period: '/yr', desc: 'Unlimited letters · Tribes · basic estate package · keychain included' },
  { key: 'whole-picture', label: 'The Whole Picture', price: '$197', period: '/yr', desc: '+ annual budget review with redacted bank statements' },
  { key: 'legacy', label: 'The Legacy Plan', price: '$297', period: '/yr', desc: 'AI estate review · Integrous wealth module · GHICA attorneys · 20% off trusts', popular: true },
  { key: 'family-legacy', label: 'The Family Legacy', price: '$397', period: '/yr', desc: 'Two full Legacy Plan memberships · keychain access' },
];

const pricedPlans = { free: 0, peace: 97, 'whole-picture': 197, legacy: 297, 'family-legacy': 397 };
const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

const Logo = () => (
  <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
    <rect x="3" y="14" width="34" height="22" rx="6" fill="#1F3D34"/>
    <path d="M6 17.5 20 27l14-9.5" stroke="#FBF8F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 14c0-4 2.4-6.8 0-11-2.4 4.2 0 7 0 11Z" fill="#8BA888"/>
    <path d="M20 14c.2-3 2.6-4.6 5-5.2-1 2.8-2.6 4.4-5 5.2Z" fill="#B9802F"/>
    <circle cx="20" cy="5" r="1.8" fill="#EAD9BC"/>
  </svg>
);

export default function Register() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(searchParams.get('plan') || 'free');
  const [annual, setAnnual] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '', confirm_password: '',
    date_of_birth: '', state: '', agree_terms: false, age_confirm: false
  });

  const [addKeychain, setAddKeychain] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [regError, setRegError] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const planData = plans.find(p => p.key === selectedPlan) || plans[0];
  const planPrice = pricedPlans[selectedPlan] || 0;
  const keychainFee = selectedPlan === 'free' && addKeychain ? 25 : 0;
  const total = planPrice + keychainFee;

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) { setRegError('Passwords do not match.'); return; }
    setRegistering(true);
    setRegError('');
    try {
      await base44.auth.register({ email: form.email, password: form.password });
      setOtpStep(true);
    } catch (err) {
      setRegError(err?.message || 'Registration failed. This email may already be registered.');
    } finally {
      setRegistering(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setOtpError('');
    try {
      const res = await base44.auth.verifyOtp({ email: form.email, otpCode });
      base44.auth.setToken(res.access_token);
      // Create Member record with plan info
      await base44.entities.Member.create({
        user_id: res.user?.id || '',
        first_name: form.first_name,
        last_name: form.last_name,
        date_of_birth: form.date_of_birth,
        state_of_residence: form.state,
        tier: selectedPlan === 'free' ? 'free' : selectedPlan === 'peace' ? 'essential' : selectedPlan === 'whole-picture' ? 'premium' : 'family',
        billing_cycle: annual ? 'annual' : 'monthly',
        status: 'active',
      });
      setStep(3);
    } catch (err) {
      setOtpError('Invalid verification code. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const stepLabels = ['Plan', 'Account', 'Payment', 'Done'];

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border)] px-5 md:px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-body font-semibold text-[var(--forest)]">DepartingNotes</span>
          </Link>
          {/* Progress */}
          <div className="hidden md:flex items-center gap-3">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold font-body transition-all ${
                  step > i + 1 ? 'bg-[var(--forest)] text-white' :
                  step === i + 1 ? 'bg-[var(--forest)] text-white' :
                  'bg-[var(--sage-soft)] text-[var(--text-mute)]'
                }`}>
                  {step > i + 1 ? <Check size={10} /> : i + 1}
                </div>
                <span className={`font-body text-xs ${step === i + 1 ? 'text-[var(--forest)] font-medium' : 'text-[var(--text-mute)]'}`}>
                  {label}
                </span>
                {i < 3 && <div className="w-6 h-px bg-[var(--border)] mx-1" />}
              </div>
            ))}
          </div>
          <Link to="/login" className="font-body text-sm text-[var(--text-soft)] hover:text-[var(--forest)] transition-colors">Log in</Link>
        </div>
      </div>

      <div className="flex-1 px-5 md:px-8 py-10">
        <div className="max-w-3xl mx-auto">

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h1 className="font-heading text-3xl font-bold text-[var(--text)] mb-2">Choose your plan</h1>
              <p className="font-body text-[var(--text-soft)] text-sm mb-8">
                The QR keychain is included with every paid plan, or $25 on the free plan. You can upgrade anytime.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {plans.map(plan => (
                  <div
                    key={plan.key}
                    onClick={() => setSelectedPlan(plan.key)}
                    className={`dn-card p-5 cursor-pointer transition-all hover:shadow-md ${
                      selectedPlan === plan.key ? 'ring-2 ring-[var(--forest)]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        {plan.popular && <span className="badge-forest text-xs block mb-1">Most complete</span>}
                        <p className="font-heading text-base font-semibold text-[var(--text)]">{plan.label}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        selectedPlan === plan.key ? 'border-[var(--forest)] bg-[var(--forest)]' : 'border-[var(--border)]'
                      }`}>
                        {selectedPlan === plan.key && <Check size={10} className="text-white" />}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="font-heading text-2xl font-bold text-[var(--text)]">{plan.price}</span>
                      <span className="font-body text-xs text-[var(--text-mute)]">{plan.period}</span>
                    </div>
                    <p className="font-body text-[var(--text-mute)] text-xs leading-snug">{plan.desc}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="btn-primary w-full justify-center py-3.5 text-base">
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 2 — OTP verification */}
          {step === 2 && otpStep && (
            <form onSubmit={handleVerifyOtp}>
              <h1 className="font-heading text-3xl font-bold text-[var(--text)] mb-3">Check your email</h1>
              <p className="font-body text-[var(--text-soft)] text-sm mb-8">We sent a verification code to <strong>{form.email}</strong>.</p>
              <div className="dn-card p-8 space-y-5">
                {otpError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body rounded-xl px-4 py-3">{otpError}</div>}
                <div>
                  <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Verification Code *</label>
                  <input required type="text" value={otpCode} onChange={e => setOtpCode(e.target.value)}
                    className="dn-input text-center text-2xl tracking-widest" placeholder="000000" maxLength={6} />
                </div>
                <button type="submit" disabled={verifying} className="btn-primary w-full justify-center py-3 disabled:opacity-50">
                  {verifying ? 'Verifying...' : 'Verify & Continue'} <ArrowRight size={15} />
                </button>
                <button type="button" onClick={() => base44.auth.resendOtp(form.email)}
                  className="font-body text-xs text-[var(--gold)] hover:underline w-full text-center">
                  Resend code
                </button>
              </div>
            </form>
          )}

          {/* STEP 2 — Account form */}
          {step === 2 && !otpStep && (
            <form onSubmit={handleAccountSubmit}>
              <h1 className="font-heading text-3xl font-bold text-[var(--text)] mb-8">Create your account</h1>
              <div className="dn-card p-8 space-y-5">
                {regError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body rounded-xl px-4 py-3">{regError}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">First name *</label>
                    <input required type="text" value={form.first_name}
                      onChange={e => setForm({...form, first_name: e.target.value})} className="dn-input" />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Last name *</label>
                    <input required type="text" value={form.last_name}
                      onChange={e => setForm({...form, last_name: e.target.value})} className="dn-input" />
                  </div>
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Email address *</label>
                  <input required type="email" value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})} className="dn-input" />
                </div>
                <div className="relative">
                  <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Password *</label>
                  <input required type={showPw ? 'text' : 'password'} minLength={8}
                    value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                    className="dn-input pr-12" placeholder="Min 8 chars, 1 number, 1 symbol" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-9 text-[var(--text-mute)] hover:text-[var(--forest)]">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Confirm password *</label>
                  <input required type="password" value={form.confirm_password}
                    onChange={e => setForm({...form, confirm_password: e.target.value})} className="dn-input" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Date of birth *</label>
                    <input required type="date" value={form.date_of_birth}
                      onChange={e => setForm({...form, date_of_birth: e.target.value})} className="dn-input" />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">State of residence *</label>
                    <select required value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="dn-input">
                      <option value="">Select state</option>
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <div onClick={() => setForm({...form, agree_terms: !form.agree_terms})}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      form.agree_terms ? 'bg-[var(--forest)] border-[var(--forest)]' : 'border-[var(--border)]'
                    }`}>
                    {form.agree_terms && <Check size={10} className="text-white" />}
                  </div>
                  <span className="font-body text-sm text-[var(--text-soft)]">
                    I agree to the <Link to="/terms" className="text-[var(--gold)] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[var(--gold)] hover:underline">Privacy Policy</Link>. I am 18 years of age or older.
                  </span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(1)} className="btn-outline flex-shrink-0 py-3">Back</button>
                  <button type="submit" disabled={!form.agree_terms || registering} className="btn-primary flex-1 justify-center py-3 disabled:opacity-40">
                    {registering ? 'Creating account...' : 'Continue'} <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h1 className="font-heading text-3xl font-bold text-[var(--text)] mb-8">Payment</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="dn-card p-7">
                  <h3 className="font-heading text-lg font-semibold text-[var(--text)] mb-5">Order summary</h3>
                  {/* Billing toggle */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className={`font-body text-sm ${!annual ? 'text-[var(--text)] font-medium' : 'text-[var(--text-mute)]'}`}>Monthly</span>
                    <button onClick={() => setAnnual(!annual)}
                      className={`relative w-11 h-5 rounded-full transition-colors ${annual ? 'bg-[var(--forest)]' : 'bg-[var(--sage-soft)]'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${annual ? 'left-6' : 'left-0.5'}`} />
                    </button>
                    <span className={`font-body text-sm ${annual ? 'text-[var(--text)] font-medium' : 'text-[var(--text-mute)]'}`}>Annual <span className="text-[var(--forest)] font-semibold">Save 17%</span></span>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between font-body text-sm text-[var(--text-soft)]">
                      <span>Plan fee</span>
                      <strong className="text-[var(--text)]">${planPrice}.00</strong>
                    </div>
                    {selectedPlan === 'free' ? (
                      <div className="space-y-2">
                        <div className="flex justify-between font-body text-sm text-[var(--text-soft)]">
                          <span>QR emergency keychain</span>
                          <strong className="text-[var(--text)]">{addKeychain ? '$25.00' : '$0.00'}</strong>
                        </div>
                        <div className="flex items-center gap-2 bg-[var(--paper)] border border-[var(--border)] rounded-xl p-3">
                          <span className="font-body text-xs text-[var(--text-soft)] flex-1">Add keychain? ($25 one-time)</span>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => setAddKeychain(true)}
                              className={`font-body text-xs px-3 py-1 rounded-full border transition-all ${addKeychain ? 'bg-[var(--forest)] text-white border-[var(--forest)]' : 'border-[var(--border)] text-[var(--text-mute)]'}`}>
                              Yes
                            </button>
                            <button type="button" onClick={() => setAddKeychain(false)}
                              className={`font-body text-xs px-3 py-1 rounded-full border transition-all ${!addKeychain ? 'bg-[var(--forest)] text-white border-[var(--forest)]' : 'border-[var(--border)] text-[var(--text-mute)]'}`}>
                              No
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between font-body text-sm text-[var(--text-soft)]">
                        <span>QR emergency keychain</span>
                        <strong className="text-[var(--forest)]">Included</strong>
                      </div>
                    )}
                    <div className="border-t border-[var(--border)] pt-3 flex justify-between font-body font-semibold text-[var(--text)]">
                      <span>Total due today</span>
                      <strong className="text-lg">${total}.00</strong>
                    </div>
                  </div>
                  <p className="font-body text-[var(--text-mute)] text-xs">Secured by Stripe · 256-bit encryption</p>
                </div>
                <div className="dn-card p-7 space-y-4">
                  {total > 0 ? (
                    <>
                      <div>
                        <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Card number *</label>
                        <input type="text" className="dn-input" placeholder="•••• •••• •••• ••••" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">Expiry *</label>
                          <input type="text" className="dn-input" placeholder="MM / YY" />
                        </div>
                        <div>
                          <label className="font-body text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide block mb-2">CVC *</label>
                          <input type="text" className="dn-input" placeholder="•••" />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={() => setStep(2)} className="btn-outline py-3">Back</button>
                        <button onClick={() => setStep(4)} className="btn-primary flex-1 justify-center py-3">
                          Pay & Activate Account
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-4 h-full justify-center py-4">
                      <p className="font-body text-sm text-[var(--text-soft)] leading-relaxed">
                        No payment required. Your free account will be created instantly.
                      </p>
                      <div className="flex gap-3">
                        <button onClick={() => setStep(2)} className="btn-outline py-3">Back</button>
                        <button onClick={() => setStep(4)} className="btn-primary flex-1 justify-center py-3">
                          Create Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="dn-card p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--sage-soft)] flex items-center justify-center mx-auto mb-6">
                <Check size={28} className="text-[var(--forest)]" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-[var(--text)] mb-3">Welcome to DepartingNotes.</h1>
              <p className="font-body text-[var(--text-soft)] mb-8">Your legacy starts now. We've sent a verification link to your email.</p>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-body text-sm text-[var(--text-soft)]">Vault completion</p>
                  <p className="font-body text-sm font-semibold text-[var(--forest)]">0%</p>
                </div>
                <div className="dn-progress-track">
                  <div className="dn-progress-bar" style={{width: '0%'}} />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => { window.location.href = '/dashboard/letters'; }} className="btn-primary text-sm py-2.5 px-6">Write Your First Letter</button>
                <button onClick={() => { window.location.href = '/dashboard/vault'; }} className="btn-outline text-sm py-2.5 px-6">Upload a Document</button>
                <button onClick={() => { window.location.href = '/dashboard'; }} className="btn-outline text-sm py-2.5 px-6">Go to Dashboard</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}