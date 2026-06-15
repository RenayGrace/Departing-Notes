import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload, FileText, Lock, Heart, Shield, Home, DollarSign, Image, X, Trash2, Search, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { getPlanFeatures } from '@/lib/planPermissions';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { key: 'will',                 label: 'Will',                 Icon: FileText },
  { key: 'trust',                label: 'Trust',                Icon: FileText },
  { key: 'poa',                  label: 'Power of Attorney',    Icon: FileText },
  { key: 'healthcare_directive', label: 'Healthcare Directive', Icon: Heart },
  { key: 'insurance',            label: 'Insurance',            Icon: Shield },
  { key: 'property',             label: 'Property',             Icon: Home },
  { key: 'financial',            label: 'Financial',            Icon: DollarSign },
  { key: 'personal',             label: 'Personal',             Icon: Image },
];

// Categories that require basicEstatePackage (Peace+)
const ESTATE_CATEGORIES = ['trust', 'poa', 'healthcare_directive', 'property'];

const TOTAL_STORAGE_GB = 10;

export default function MyVault() {
  const [docs, setDocs]           = useState([]);
  const [member, setMember]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm]           = useState({ title: '', category: 'will', notes: '', recipient_ids: [] });
  const [file, setFile]           = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch]       = useState('');

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      const [d, members] = await Promise.all([
        base44.entities.VaultDocument.filter({ created_by_id: u.id }),
        base44.entities.Member.filter({ user_id: u.id }),
      ]);
      setDocs(d);
      if (members.length > 0) setMember(members[0]);
      setLoading(false);
    };
    load();
  }, []);

  const perms = getPlanFeatures(member?.tier);

  const isCategoryLocked = (catKey) => {
    // basic estate docs locked on free
    if (ESTATE_CATEGORIES.includes(catKey) && !perms.basicEstatePackage) return true;
    // financial upload (bank statements) locked below whole-picture
    if (catKey === 'financial' && !perms.uploadBankStatements) return false; // financial allowed, but bank stmt note shown
    return false;
  };

  const openUpload = (catKey) => {
    if (isCategoryLocked(catKey)) return;
    setForm({ title: '', category: catKey, notes: '', recipient_ids: [] });
    setFile(null);
    setShowUpload(true);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const u = await base44.auth.me();
    const created = await base44.entities.VaultDocument.create({
      ...form,
      file_url,
      file_name: file.name,
      file_size: file.size,
      created_by_id: u.id,
    });
    setDocs(prev => [created, ...prev]);
    setShowUpload(false);
    setFile(null);
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this document?')) return;
    await base44.entities.VaultDocument.delete(id);
    setDocs(prev => prev.filter(d => d.id !== id));
  };

  const totalSizeBytes = docs.reduce((sum, d) => sum + (d.file_size || 0), 0);
  const usedGB  = totalSizeBytes / (1024 ** 3);
  const usedPct = Math.min((usedGB / TOTAL_STORAGE_GB) * 100, 100);
  const displayGB = usedGB < 0.1 ? (totalSizeBytes / (1024 ** 2)).toFixed(1) + ' MB' : usedGB.toFixed(1) + ' GB';

  const filteredDocs = docs.filter(d => {
    const matchCat    = activeCategory ? d.category === activeCategory : true;
    const matchSearch = search ? (d.title || '').toLowerCase().includes(search.toLowerCase()) : true;
    return matchCat && matchSearch;
  });

  const catCount = (key) => docs.filter(d => d.category === key).length;

  // Donut
  const r = 54, cx = 70, cy = 70, stroke = 14;
  const circ = 2 * Math.PI * r;
  const dash  = (usedPct / 100) * circ;

  // Available categories for upload modal filtered by plan
  const availableCategories = CATEGORIES.filter(c => !isCategoryLocked(c.key));

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[var(--forest)]">My Vault</h1>
          <p className="font-body text-[var(--text-mute)] text-sm mt-1">Your private, encrypted document library.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[var(--border)] rounded-full px-4 py-2 min-w-[200px]">
          <Search size={14} className="text-[var(--text-mute)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your vault..."
            className="bg-transparent outline-none font-body text-sm text-[var(--text)] w-full" />
        </div>
      </div>

      {/* Free plan notice */}
      {!perms.basicEstatePackage && (
        <div className="flex items-start gap-3 bg-[var(--gold-soft)] border border-[var(--gold)]/20 rounded-xl p-4 mb-6">
          <Lock size={14} className="text-[var(--gold)] flex-shrink-0 mt-0.5" />
          <p className="font-body text-sm text-[var(--text-soft)]">
            <strong className="text-[var(--text)]">Free plan:</strong> You can upload a Will and personal documents. Trust, POA, Healthcare Directive, and Property documents require{' '}
            <strong>The Peace Plan</strong> or above.{' '}
            <Link to="/plans" className="text-[var(--gold)] font-semibold hover:underline">Upgrade →</Link>
          </p>
        </div>
      )}

      {/* Whole Picture bank-statement notice */}
      {perms.basicEstatePackage && !perms.uploadBankStatements && (
        <div className="flex items-start gap-3 bg-[var(--paper-2)] border border-[var(--border)] rounded-xl p-4 mb-6">
          <AlertTriangle size={14} className="text-[var(--gold)] flex-shrink-0 mt-0.5" />
          <p className="font-body text-sm text-[var(--text-soft)]">
            Uploading <strong>redacted bank statements</strong> for the annual budget review is available from{' '}
            <strong>The Whole Picture</strong> plan.{' '}
            <Link to="/plans" className="text-[var(--gold)] font-semibold hover:underline">Upgrade →</Link>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
        {/* Left: Category grid */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl text-[var(--forest)] font-semibold">Document categories</h2>
            <button onClick={() => openUpload('will')}
              className="flex items-center gap-2 bg-[var(--forest)] text-white font-body text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[var(--forest-600)] transition-colors">
              <Upload size={14} /> Upload
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-[var(--paper)] animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map(({ key, label, Icon }) => {
                const count  = catCount(key);
                const locked = isCategoryLocked(key);
                const isActive = activeCategory === key;
                return (
                  <button key={key}
                    onClick={() => !locked && setActiveCategory(isActive ? null : key)}
                    className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all relative ${
                      locked
                        ? 'border-[var(--border)] bg-[var(--paper-2)] opacity-60 cursor-not-allowed'
                        : isActive
                        ? 'border-[var(--forest)] bg-[var(--sage-soft)]'
                        : 'border-[var(--border)] bg-[var(--paper)] hover:border-[var(--sage)]'
                    }`}
                  >
                    {locked && <Lock size={12} className="absolute top-2 right-2 text-[var(--gold)]" />}
                    <Icon size={20} className={isActive ? 'text-[var(--forest)]' : locked ? 'text-[var(--text-mute)]' : 'text-[var(--text-soft)]'} />
                    <span className="font-body font-semibold text-sm text-[var(--text)] leading-tight">{label}</span>
                    <span className={`font-body text-xs ${locked ? 'text-[var(--gold)]' : count > 0 ? 'text-[var(--gold)]' : 'text-[var(--text-mute)]'}`}>
                      {locked ? 'Upgrade' : `${count} ${count === 1 ? 'file' : 'files'}`}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Document list for selected category */}
          {activeCategory && (
            <div className="mt-6 border-t border-[var(--border)] pt-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-base text-[var(--forest)] font-semibold">
                  {CATEGORIES.find(c => c.key === activeCategory)?.label}
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => openUpload(activeCategory)}
                    className="text-xs font-body text-[var(--forest)] border border-[var(--forest)] px-3 py-1 rounded-full hover:bg-[var(--sage-soft)] transition-colors">
                    + Add file
                  </button>
                  <button onClick={() => setActiveCategory(null)} className="text-[var(--text-mute)] hover:text-[var(--text)]">
                    <X size={16} />
                  </button>
                </div>
              </div>
              {filteredDocs.length === 0 ? (
                <p className="font-body text-[var(--text-mute)] text-sm">No documents in this category yet.</p>
              ) : (
                <div className="space-y-2">
                  {filteredDocs.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] hover:border-[var(--sage)] transition-all">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-[var(--gold)]" />
                        <div>
                          <p className="font-body text-sm font-medium text-[var(--text)]">{doc.title}</p>
                          <p className="font-body text-xs text-[var(--text-mute)]">
                            {doc.file_name && `${doc.file_name} · `}
                            {doc.created_date && format(new Date(doc.created_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-[var(--text-mute)] hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Storage + plan info */}
        <div className="flex flex-col gap-5">
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <h2 className="font-heading text-xl text-[var(--forest)] font-semibold">Storage</h2>
            <div className="flex flex-col items-center gap-2">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--sage-soft)" strokeWidth={stroke} />
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--gold)" strokeWidth={stroke}
                  strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
                <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--forest)" fontFamily="Playfair Display, serif">
                  {usedGB < 0.1 ? '<0.1' : usedGB.toFixed(1)}
                </text>
                <text x={cx} y={cy + 14} textAnchor="middle" fontSize="12" fill="var(--text-mute)" fontFamily="Inter, sans-serif">GB</text>
              </svg>
              <p className="font-body text-sm text-[var(--text-mute)] text-center">{displayGB} of {TOTAL_STORAGE_GB} GB used</p>
            </div>
            <div className="flex items-start gap-3 bg-[var(--sage-soft)] rounded-xl p-4">
              <Lock size={16} className="text-[var(--forest)] mt-0.5 flex-shrink-0" />
              <p className="font-body text-xs text-[var(--forest)] leading-relaxed">AES-256 encrypted. Locked until release is verified.</p>
            </div>
          </div>

          {/* What's available on this plan */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-5 shadow-sm">
            <h3 className="font-heading text-base font-semibold text-[var(--forest)] mb-3">Your plan's vault access</h3>
            <div className="space-y-2">
              {[
                { label: 'Will & personal docs', ok: true },
                { label: 'Trust, POA, directives', ok: perms.basicEstatePackage },
                { label: 'Bank statement uploads', ok: perms.uploadBankStatements },
                { label: 'Milestone letter delivery', ok: perms.milestoneDelivery },
              ].map(f => (
                <div key={f.label} className="flex items-center justify-between">
                  <span className="font-body text-xs text-[var(--text-soft)]">{f.label}</span>
                  <span className={`font-body text-xs font-semibold ${f.ok ? 'text-[var(--forest)]' : 'text-[var(--text-mute)]'}`}>
                    {f.ok ? '✓' : '—'}
                  </span>
                </div>
              ))}
            </div>
            {!perms.basicEstatePackage && (
              <Link to="/plans" className="inline-flex items-center gap-1 mt-4 text-xs font-body font-semibold text-[var(--gold)] hover:underline">
                Upgrade for full access →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleUpload} className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl text-[var(--forest)] font-semibold">Upload Document</h2>
              <button type="button" onClick={() => setShowUpload(false)} className="text-[var(--text-mute)] hover:text-[var(--text)]">
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="font-body text-[var(--text-mute)] text-xs uppercase tracking-wide block mb-1.5">Document Title *</label>
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full border border-[var(--border)] focus:border-[var(--forest)] rounded-lg px-3 py-2.5 font-body text-sm outline-none transition-colors" />
            </div>

            <div>
              <label className="font-body text-[var(--text-mute)] text-xs uppercase tracking-wide block mb-1.5">Category *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-[var(--border)] focus:border-[var(--forest)] rounded-lg px-3 py-2.5 font-body text-sm outline-none transition-colors bg-white">
                {availableCategories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>

            {/* Bank statement notice */}
            {form.category === 'financial' && !perms.uploadBankStatements && (
              <div className="flex items-center gap-2 bg-[var(--gold-soft)] rounded-lg p-3">
                <AlertTriangle size={13} className="text-[var(--gold)] flex-shrink-0" />
                <p className="font-body text-xs text-[var(--text-soft)]">
                  Uploading redacted bank statements for budget review requires <strong>The Whole Picture</strong> plan.
                </p>
              </div>
            )}

            <div>
              <label className="font-body text-[var(--text-mute)] text-xs uppercase tracking-wide block mb-1.5">File *</label>
              <div className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors ${file ? 'border-[var(--forest)] bg-[var(--sage-soft)]' : 'border-[var(--border)]'}`}>
                <FileText size={20} className="text-[var(--text-mute)] mx-auto mb-2" />
                <p className="font-body text-sm text-[var(--text-mute)] mb-3">{file ? file.name : 'Choose a file to upload'}</p>
                <label className="cursor-pointer bg-[var(--forest)] text-white font-body text-xs px-4 py-2 rounded-lg hover:bg-[var(--forest-600)] transition-colors">
                  Browse Files
                  <input type="file" className="hidden" onChange={e => setFile(e.target.files[0])} />
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setShowUpload(false)}
                className="flex-1 border border-[var(--border)] text-[var(--text-soft)] py-2.5 rounded-lg font-body text-sm hover:border-[var(--forest)] transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={uploading || !file}
                className="flex-1 bg-[var(--forest)] text-white py-2.5 rounded-lg font-body text-sm font-semibold hover:bg-[var(--forest-600)] transition-colors disabled:opacity-50">
                {uploading ? 'Uploading...' : 'Upload to Vault'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}