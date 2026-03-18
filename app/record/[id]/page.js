'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { demoRecords, docTypeLabels, generateFHIRBundle } from '../../../lib/demoData';
import Footer from '../../../components/Footer';
import { ArrowLeft, Copy, Check, FileText, User, Stethoscope, Pill, FlaskConical, HeartPulse, Receipt, Braces, ChevronRight } from 'lucide-react';

const tabConfig = [
  { key: 'overview', label: 'Overview', icon: FileText },
  { key: 'diagnoses', label: 'Diagnoses', icon: Stethoscope },
  { key: 'medications', label: 'Medications', icon: Pill },
  { key: 'labs', label: 'Lab Values', icon: FlaskConical },
  { key: 'billing', label: 'Billing', icon: Receipt },
  { key: 'fhir', label: 'FHIR R4', icon: Braces },
];

export default function RecordPage({ params }) {
  const { id } = params;
  const [record, setRecord] = useState(null);
  const [tab, setTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [fhir, setFhir] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const demo = demoRecords.find(r => r.id === id);
    if (demo) {
      setRecord(demo);
      setFhir(generateFHIRBundle(demo));
      setLoading(false);
    } else {
      fetch(`http://localhost:8000/api/notes/${id}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) { setRecord(data); setFhir(data.fhir || null); } })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  const copyFhir = () => {
    navigator.clipboard.writeText(JSON.stringify(fhir, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#060e1e' }}>
        <Navbar />
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4" />
          <p style={{ color: '#94a3b8' }}>Loading record…</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#060e1e' }}>
        <Navbar />
        <div className="text-center glass-card rounded-2xl p-12">
          <FileText size={40} className="mx-auto mb-4" style={{ color: '#475569' }} />
          <h2 className="text-xl font-bold text-slate-200 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Record not found</h2>
          <p className="text-sm mb-6" style={{ color: '#64748b' }}>This record doesn't exist in demo data or the backend.</p>
          <Link href="/dashboard" className="btn-primary px-6 py-3 rounded-xl text-sm font-medium text-white inline-flex items-center gap-2">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const labVals = record.extracted.labValues || record.extracted.lab_values || [];
  const vitals = record.extracted.vitals || [];
  const typeInfo = docTypeLabels[record.type] || { label: record.type, icon: '📋' };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#060e1e' }}>
      <Navbar />

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute rounded-full ambient-animate" style={{ width: 350, height: 350, top: '15%', right: '10%', background: 'radial-gradient(circle, rgba(37,99,235,0.05), transparent 65%)', filter: 'blur(60px)' }} />
      </div>

      <main className="relative z-10 pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-6 animate-fade-in-down" style={{ color: '#64748b' }}>
          <Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">{record.title}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8 animate-fade-in-up">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{typeInfo.icon}</span>
              <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                {record.title}
              </h1>
            </div>
            <p className="text-sm" style={{ color: '#64748b' }}>
              {record.document.source} · {record.document.pages} page{record.document.pages !== 1 ? 's' : ''} ·{' '}
              Processed in {record.processingTime || (record.processing_time_s ? record.processing_time_s + 's' : '—')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-black" style={{ fontFamily: 'Syne, sans-serif', color: record.confidence > 95 ? '#34d399' : '#fbbf24' }}>
                {record.confidence}%
              </div>
              <div className="text-xs" style={{ color: '#64748b' }}>Confidence</div>
            </div>
            <div className="w-20 h-3 rounded-full overflow-hidden" style={{ background: '#142a4e' }}>
              <div className="h-full rounded-full" style={{
                width: `${record.confidence}%`,
                background: record.confidence > 95 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #d97706, #fbbf24)',
              }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2 animate-fade-in-up stagger-2">
          {tabConfig.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
              style={tab === key
                ? {
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(6,182,212,0.1))',
                    color: '#93c5fd',
                    border: '1px solid rgba(59,130,246,0.3)',
                    boxShadow: '0 2px 8px rgba(37,99,235,0.15)',
                  }
                : { color: '#94a3b8', border: '1px solid transparent' }
              }>
              <Icon size={14} />{label}
            </button>
          ))}
        </div>

        {/* ─── Overview ─── */}
        {tab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6 animate-fade-in-up stagger-3">
            {/* Patient info */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <User size={16} style={{ color: '#60a5fa' }} />
                <h3 className="font-bold text-sm text-white uppercase tracking-widest">Patient</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Name', value: record.patient.name },
                  { label: 'Age', value: `${record.patient.age} yrs` },
                  { label: 'Gender', value: record.patient.gender },
                  { label: 'UHID', value: record.patient.uhid },
                  ...(record.patient.aadhar ? [{ label: 'Aadhaar', value: record.patient.aadhar }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-xs" style={{ color: '#64748b' }}>{label}</span>
                    <span className="text-sm text-slate-200 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Document info */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={16} style={{ color: '#a78bfa' }} />
                <h3 className="font-bold text-sm text-white uppercase tracking-widest">Document</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Report ID', value: record.document.reportId },
                  { label: 'Source', value: record.document.source },
                  { label: 'Date', value: record.document.date },
                  { label: 'Pages', value: record.document.pages },
                  { label: 'Type', value: typeInfo.label },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-xs" style={{ color: '#64748b' }}>{label}</span>
                    <span className="text-sm text-slate-200 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code summary */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope size={16} style={{ color: '#34d399' }} />
                <h3 className="font-bold text-sm text-white uppercase tracking-widest">Extracted Codes</h3>
              </div>
              <div className="space-y-3">
                {[
                  { system: 'ICD-10-CM', count: record.extracted.diagnoses.length, tagClass: 'tag-icd' },
                  { system: 'CPT', count: record.extracted.procedures.length, tagClass: 'tag-cpt' },
                  { system: 'RxNorm', count: record.extracted.medications.length, tagClass: 'tag-rx' },
                  { system: 'LOINC', count: labVals.length, tagClass: 'tag-loinc' },
                ].map(({ system, count, tagClass }) => (
                  <div key={system} className="flex items-center justify-between">
                    <span className={`${tagClass} text-xs px-2 py-0.5 rounded font-mono`}>{system}</span>
                    <span className="text-sm font-bold text-slate-200">{count}</span>
                  </div>
                ))}
                <div className="pt-2 mt-2" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold" style={{ color: '#64748b' }}>Total Codes</span>
                    <span className="text-lg font-black gradient-text-cyan" style={{ fontFamily: 'Syne, sans-serif' }}>
                      {record.extracted.diagnoses.length + record.extracted.procedures.length + record.extracted.medications.length + labVals.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Diagnoses ─── */}
        {tab === 'diagnoses' && (
          <div className="space-y-3 animate-fade-in-up stagger-3">
            {record.extracted.diagnoses.map((d, i) => (
              <div key={i} className="glass-card rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="tag-icd text-base font-mono font-bold px-3 py-1.5 rounded-lg">{d.code}</span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-200">{d.description}</p>
                  <p className="text-xs font-mono mt-1" style={{ color: '#64748b' }}>ICD-10-CM · Confidence: {Math.round(d.confidence * 100)}%</p>
                </div>
                <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: '#142a4e' }}>
                  <div className="h-full rounded-full" style={{ width: `${d.confidence * 100}%`, background: 'linear-gradient(90deg, #06d6f2, #3b82f6)' }} />
                </div>
              </div>
            ))}
            {record.extracted.diagnoses.length === 0 && (
              <div className="text-center py-12" style={{ color: '#64748b' }}>
                <Stethoscope size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No diagnoses extracted</p>
              </div>
            )}
          </div>
        )}

        {/* ─── Medications ─── */}
        {tab === 'medications' && (
          <div className="space-y-3 animate-fade-in-up stagger-3">
            {record.extracted.medications.map((m, i) => (
              <div key={i} className="glass-card rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="tag-rx text-base font-mono font-bold px-3 py-1.5 rounded-lg">{m.code}</span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-200">{m.name}</p>
                  <p className="text-xs mt-1" style={{ color: '#64748b' }}>
                    {m.dose} · {m.route}
                  </p>
                </div>
                <span className="text-xs font-mono" style={{ color: '#475569' }}>RxNorm</span>
              </div>
            ))}
            {record.extracted.medications.length === 0 && (
              <div className="text-center py-12" style={{ color: '#64748b' }}>
                <Pill size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No medications extracted</p>
              </div>
            )}
          </div>
        )}

        {/* ─── Lab Values ─── */}
        {tab === 'labs' && (
          <div>
            {labVals.length > 0 && (
              <div className="glass-card rounded-2xl overflow-hidden mb-6">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                      {['LOINC', 'Test Name', 'Value', 'Unit', 'Reference', 'Status'].map(h => (
                        <th key={h} className="text-left text-xs uppercase tracking-widest px-5 py-3 font-medium" style={{ color: '#64748b' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {labVals.map((l, i) => (
                      <tr key={i}
                        className="transition-colors hover:bg-blue-500/[0.03]"
                        style={{ borderBottom: i === labVals.length - 1 ? 'none' : '1px solid rgba(59,130,246,0.06)' }}>
                        <td className="px-5 py-3"><span className="tag-loinc text-xs px-2 py-0.5 rounded font-mono">{l.code}</span></td>
                        <td className="px-5 py-3 text-sm text-slate-200 font-medium">{l.name}</td>
                        <td className="px-5 py-3 text-sm font-bold" style={{ color: l.status === 'normal' ? '#34d399' : l.status === 'high' ? '#f43f5e' : '#fbbf24' }}>{l.value}</td>
                        <td className="px-5 py-3 text-xs font-mono" style={{ color: '#94a3b8' }}>{l.unit}</td>
                        <td className="px-5 py-3 text-xs font-mono" style={{ color: '#475569' }}>{l.refRange || l.ref_range}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-semibold ${
                            l.status === 'normal' ? 'badge-done'
                            : l.status === 'high' ? 'badge-error'
                            : 'badge-processing'
                          }`}>{l.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Vitals */}
            {vitals.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-3 uppercase tracking-widest">
                  <HeartPulse size={14} style={{ color: '#f43f5e' }} /> Vital Signs
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {vitals.map((v, i) => (
                    <div key={i} className="glass-card rounded-xl p-4 text-center">
                      <p className="text-xs mb-2" style={{ color: '#64748b' }}>{v.name}</p>
                      <p className="text-2xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{v.value}</p>
                      <p className="text-xs font-mono mt-1" style={{ color: '#475569' }}>{v.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {labVals.length === 0 && vitals.length === 0 && (
              <div className="text-center py-12" style={{ color: '#64748b' }}>
                <FlaskConical size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No lab values or vitals extracted</p>
              </div>
            )}
          </div>
        )}

        {/* ─── Billing ─── */}
        {tab === 'billing' && (
          <div className="grid lg:grid-cols-3 gap-6 animate-fade-in-up stagger-3">
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Line Items</h3>
                  <span className="text-xs font-mono" style={{ color: '#64748b' }}>{record.billing.lineItems.length} items</span>
                </div>
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                      {['Code', 'Description', 'Amount'].map(h => (
                        <th key={h} className="text-left text-xs uppercase tracking-widest px-5 py-3 font-medium" style={{ color: '#64748b' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {record.billing.lineItems.map((item, i) => (
                      <tr key={i} style={{ borderBottom: i === record.billing.lineItems.length - 1 ? 'none' : '1px solid rgba(59,130,246,0.04)' }}>
                        <td className="px-5 py-3"><span className="tag-cpt text-xs px-2 py-0.5 rounded font-mono">{item.cpt}</span></td>
                        <td className="px-5 py-3 text-sm text-slate-300">{item.description}</td>
                        <td className="px-5 py-3 text-sm font-bold text-slate-200 font-mono">₹{item.amount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-5 py-4 flex justify-between" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
                  <span className="text-sm font-semibold text-white">Total</span>
                  <span className="text-lg font-black gradient-text-cyan font-mono" style={{ fontFamily: 'Syne, sans-serif' }}>
                    ₹{record.billing.totalCharges.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Insurance */}
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Insurance / Payer</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Payer', value: record.billing.payerInfo.name },
                    { label: 'Policy #', value: record.billing.payerInfo.policyNo },
                    ...(record.billing.payerInfo.preAuth ? [{ label: 'Pre-Auth', value: record.billing.payerInfo.preAuth }] : []),
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs mb-0.5" style={{ color: '#64748b' }}>{label}</p>
                      <p className="text-sm text-slate-200 font-mono">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="stat-card-blue rounded-2xl p-6">
                <h3 className="text-sm text-white/70 mb-2">Claim Status</h3>
                <p className="text-2xl font-black text-white capitalize" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {record.billing.claimsStatus}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── FHIR R4 ─── */}
        {tab === 'fhir' && fhir && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white">FHIR R4 Document Bundle</h3>
                <p className="text-xs" style={{ color: '#64748b' }}>
                  {fhir.entry?.length || 0} resources · Ready for TPA portal ingestion
                </p>
              </div>
              <button
                onClick={copyFhir}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: copied ? 'rgba(16,185,129,0.12)' : 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.08))',
                  color: copied ? '#34d399' : '#93c5fd',
                  border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.25)'}`,
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
            </div>
            <div className="glass-card rounded-2xl overflow-hidden">
              <pre className="p-6 text-xs leading-relaxed overflow-x-auto font-mono"
                style={{ color: '#94a3b8', maxHeight: '600px' }}>
                {JSON.stringify(fhir, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
