'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { demoRecords, docTypeLabels } from '../../lib/demoData';
import { Search, Filter, TrendingUp, FileText, CheckCircle, Clock, ArrowRight, IndianRupee } from 'lucide-react';

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const totalCharges = demoRecords.reduce((s, r) => s + r.billing.totalCharges, 0);
  const avgConfidence = (demoRecords.reduce((s, r) => s + r.confidence, 0) / demoRecords.length).toFixed(1);
  const totalCodes = demoRecords.reduce((s, r) =>
    s + r.extracted.diagnoses.length + r.extracted.procedures.length + r.extracted.medications.length + (r.extracted.labValues || r.extracted.lab_values || []).length, 0);

  const filtered = demoRecords.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.patient.name.toLowerCase().includes(search.toLowerCase()) ||
      r.document.source.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || r.type === filterType;
    return matchSearch && matchType;
  });

  const statCards = [
    { label: 'Total Records', value: demoRecords.length, icon: FileText, sub: '3 demo cases', cardClass: 'stat-card-blue' },
    { label: 'Avg Confidence', value: `${avgConfidence}%`, icon: CheckCircle, sub: 'AI extraction accuracy', cardClass: 'stat-card-emerald' },
    { label: 'Codes Extracted', value: totalCodes, icon: TrendingUp, sub: 'ICD + CPT + RxNorm + LOINC', cardClass: 'stat-card-indigo' },
    { label: 'Total Billed', value: `₹${(totalCharges / 100000).toFixed(1)}L`, icon: IndianRupee, sub: 'across all records', cardClass: 'stat-card-amber' },
  ];

  const claimsPipeline = [
    { label: 'Ready to Submit', count: 1, dotColor: '#3b82f6', textColor: '#60a5fa' },
    { label: 'Submitted', count: 1, dotColor: '#f59e0b', textColor: '#fbbf24' },
    { label: 'Approved', count: 1, dotColor: '#10b981', textColor: '#34d399' },
    { label: 'Denied', count: 0, dotColor: '#ef4444', textColor: '#f87171' },
  ];

  return (
    <div className="min-h-screen bg-grid" style={{ backgroundColor: '#060e1e' }}>
      <Navbar />

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute rounded-full ambient-animate" style={{ width: 400, height: 400, top: '20%', right: '15%', background: 'radial-gradient(circle, rgba(37,99,235,0.05), transparent 65%)', filter: 'blur(40px)' }} />
      </div>

      <main className="relative z-10 pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-black mb-2 text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Clinical Records Dashboard</h1>
          <p style={{ color: '#94a3b8' }}>All normalized documents, extracted codes, and billing status</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up stagger-2">
          {statCards.map(({ label, value, icon: Icon, sub, cardClass }) => (
            <div key={label} className={`${cardClass} rounded-2xl p-5 transition-transform hover:scale-[1.02]`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/60 uppercase tracking-wide">{label}</span>
                <Icon size={16} className="text-white/70" />
              </div>
              <div className="text-3xl font-black mb-0.5 text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</div>
              <div className="text-xs text-white/50">{sub}</div>
            </div>
          ))}
        </div>

        {/* Claims Pipeline */}
        <div className="glass-card rounded-2xl p-6 mb-8 animate-fade-in-up stagger-3">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-widest">Claims Pipeline</h3>
          <div className="flex flex-wrap gap-6">
            {claimsPipeline.map(({ label, count, dotColor, textColor }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: dotColor, boxShadow: `0 0 8px ${dotColor}40` }} />
                <span className="text-xl font-black" style={{ fontFamily: 'Syne, sans-serif', color: textColor }}>{count}</span>
                <span className="text-sm" style={{ color: '#94a3b8' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 animate-fade-in-up stagger-4">
          <div className="flex items-center gap-2 glass-card rounded-xl px-4 py-2.5 flex-1 min-w-48">
            <Search size={15} style={{ color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search records, patients, hospitals…"
              className="bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none flex-1"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} style={{ color: '#64748b' }} />
            {['all', 'lab_report', 'hospital_bill', 'discharge_summary'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
                style={filterType === t
                  ? { background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(6,182,212,0.1))', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' }
                  : { color: '#94a3b8', border: '1px solid rgba(59,130,246,0.08)' }
                }
              >
                {t === 'all' ? 'All Types' : t.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Records Table */}
        <div className="glass-card rounded-2xl overflow-hidden animate-fade-in-up stagger-5">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                {['Document', 'Patient', 'Codes', 'Billing', 'Confidence', 'Claims Status', ''].map(h => (
                  <th key={h} className="text-left text-xs uppercase tracking-widest px-5 py-4 font-medium" style={{ color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((rec, i) => {
                const typeInfo = docTypeLabels[rec.type];
                const labVals = rec.extracted.labValues || rec.extracted.lab_values || [];
                const codeCounts = rec.extracted.diagnoses.length + rec.extracted.procedures.length +
                  rec.extracted.medications.length + labVals.length;
                return (
                  <tr key={rec.id}
                    className="transition-colors hover:bg-blue-500/[0.03]"
                    style={{ borderBottom: i === filtered.length - 1 ? 'none' : '1px solid rgba(59,130,246,0.06)' }}>
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <span className="text-xl flex-shrink-0">
                          {rec.type === 'lab_report' ? '🧪' : rec.type === 'hospital_bill' ? '🏥' : '📋'}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-200 leading-tight">{rec.title}</p>
                          <p className="text-xs font-mono mt-0.5" style={{ color: '#475569' }}>{rec.document.reportId}</p>
                          <span className={`text-xs font-mono mt-1 inline-block`} style={{ color: typeInfo.color === 'text-cyan-400' ? '#06d6f2' : typeInfo.color === 'text-violet-400' ? '#a78bfa' : '#34d399' }}>
                            {typeInfo.label}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-300">{rec.patient.name}</p>
                      <p className="text-xs" style={{ color: '#475569' }}>{rec.patient.age}y · {rec.patient.gender}</p>
                      <p className="text-xs font-mono" style={{ color: '#475569' }}>{rec.patient.uhid}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        <span className="tag-icd text-xs px-1.5 py-0.5 rounded font-mono">{rec.extracted.diagnoses.length} ICD</span>
                        {rec.extracted.procedures.length > 0 && (
                          <span className="tag-cpt text-xs px-1.5 py-0.5 rounded font-mono">{rec.extracted.procedures.length} CPT</span>
                        )}
                        <span className="tag-rx text-xs px-1.5 py-0.5 rounded font-mono">{rec.extracted.medications.length} Rx</span>
                        <span className="tag-loinc text-xs px-1.5 py-0.5 rounded font-mono">{labVals.length} LOINC</span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: '#475569' }}>{codeCounts} total</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-200">₹{rec.billing.totalCharges.toLocaleString('en-IN')}</p>
                      <p className="text-xs" style={{ color: '#475569' }}>{rec.billing.payerInfo.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-bold" style={{ color: rec.confidence > 95 ? '#34d399' : '#fbbf24' }}>
                          {rec.confidence}%
                        </div>
                      </div>
                      <div className="w-16 h-1.5 rounded-full mt-1 overflow-hidden" style={{ background: '#142a4e' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${rec.confidence}%`, background: rec.confidence > 95 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #d97706, #fbbf24)' }}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-mono ${
                        rec.billing.claimsStatus === 'approved' ? 'badge-done'
                        : rec.billing.claimsStatus === 'submitted' ? 'badge-processing'
                        : 'badge-pending'
                      }`}>
                        {rec.billing.claimsStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/record/${rec.id}`}
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        View <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center" style={{ color: '#64748b' }}>
              <Search size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No records match your search</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
