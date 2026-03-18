'use client';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { demoRecords, pipelineSteps } from '../lib/demoData';
import { ArrowRight, FileText, Zap, Shield, BarChart3, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const stats = [
    { label: 'Documents Processed', value: '12,400+', icon: FileText, cardClass: 'stat-card-blue' },
    { label: 'Extraction Accuracy', value: '96.8%', icon: CheckCircle, cardClass: 'stat-card-emerald' },
    { label: 'Codes Mapped/hr', value: '3,200', icon: Zap, cardClass: 'stat-card-indigo' },
    { label: 'Revenue Recovered', value: '₹2.1Cr', icon: TrendingUp, cardClass: 'stat-card-amber' },
  ];

  const features = [
    {
      icon: FileText,
      gradient: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,214,242,0.08))',
      border: 'rgba(59,130,246,0.25)',
      iconColor: '#60a5fa',
      title: 'Multi-Format Ingestion',
      desc: 'PDF, scanned images, printed lab slips — OCR + layout detection handles all Indian hospital document formats.',
    },
    {
      icon: Zap,
      gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.08))',
      border: 'rgba(139,92,246,0.25)',
      iconColor: '#a78bfa',
      title: 'Clinical NLP Engine',
      desc: 'GPT-4 powered entity extraction maps raw text to ICD-10-CM, CPT, RxNorm, and LOINC codes with confidence scoring.',
    },
    {
      icon: Shield,
      gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,214,242,0.08))',
      border: 'rgba(16,185,129,0.25)',
      iconColor: '#34d399',
      title: 'FHIR R4 Compliance',
      desc: 'Every extracted record is converted to HL7 FHIR R4 JSON bundles — ready for TPA portals and insurance APIs.',
    },
    {
      icon: BarChart3,
      gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(249,115,22,0.08))',
      border: 'rgba(245,158,11,0.25)',
      iconColor: '#fbbf24',
      title: 'Revenue Reconciliation',
      desc: 'Automated billing validation detects undercoding, duplicate charges, and missing pre-auth — maximizing reimbursement.',
    },
  ];

  return (
    <div className="min-h-screen bg-grid" style={{ backgroundColor: '#060e1e' }}>
      <Navbar />

      {/* Ambient background effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute rounded-full ambient-animate" style={{ width: 500, height: 500, top: '10%', left: '15%', background: 'radial-gradient(circle, rgba(37,99,235,0.06), transparent 65%)', filter: 'blur(40px)' }} />
        <div className="absolute rounded-full ambient-animate" style={{ width: 400, height: 400, top: '30%', right: '15%', background: 'radial-gradient(circle, rgba(6,214,242,0.05), transparent 65%)', filter: 'blur(40px)', animationDelay: '5s' }} />
        <div className="absolute rounded-full ambient-animate" style={{ width: 300, height: 300, bottom: '20%', left: '40%', background: 'radial-gradient(circle, rgba(139,92,246,0.04), transparent 65%)', filter: 'blur(40px)', animationDelay: '10s' }} />
      </div>

      <main className="relative z-10 pt-24 pb-20">
        {/* ─── Hero ─── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 text-center py-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 font-mono"
            style={{
              background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(99,102,241,0.08))',
              color: '#93c5fd',
              border: '1px solid rgba(59,130,246,0.25)',
            }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            HackMatrix 2.0 · Team LegacyCoderz — Track 2: Data Normalization Engine
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6 leading-none text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            Unstructured Records.{' '}
            <span className="gradient-text-cyan block mt-2">Structured Intelligence.</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: '#94a3b8' }}>
            Upload any Indian hospital document — lab report, discharge summary, or itemized bill —
            and MedNorm AI extracts ICD-10, CPT, RxNorm & LOINC codes in seconds,
            generating FHIR R4 bundles ready for billing & insurance claims.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/upload"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white">
              Try Demo Cases <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 glass-card-md rounded-xl font-medium text-slate-200 hover:border-blue-500/30 transition-all">
              View Dashboard <BarChart3 size={18} />
            </Link>
          </div>
        </section>

        {/* ─── Stats ─── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20 animate-fade-in-up stagger-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon, cardClass }) => (
              <div key={label} className={`${cardClass} rounded-2xl p-6 text-center transition-transform hover:scale-[1.02]`}>
                <Icon size={22} className="text-white/80 mx-auto mb-3" />
                <div className="text-3xl font-black mb-1 text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</div>
                <div className="text-xs text-white/60">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Pipeline Visualization ─── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20 animate-fade-in-up stagger-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-3 text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              5-Stage AI Pipeline
            </h2>
            <p style={{ color: '#94a3b8' }}>From raw document to billable claim — fully automated</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {pipelineSteps.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className="glass-card rounded-2xl p-5 w-full text-center card-hover h-full flex flex-col justify-center">
                  <div className="text-2xl mb-2 mx-auto">{step.icon}</div>
                  <div className="text-sm font-semibold text-slate-200 mb-1">{step.label}</div>
                  <div className="text-xs" style={{ color: '#64748b' }}>{step.desc}</div>
                </div>
                {idx < pipelineSteps.length - 1 && (
                  <ArrowRight size={16} className="text-blue-500/50 rotate-90 lg:rotate-0 mt-4 lg:hidden" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ─── Features ─── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20 animate-fade-in-up stagger-5">
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, gradient, border, iconColor, title, desc }) => (
              <div key={title} className="rounded-2xl p-6 card-hover"
                style={{ background: gradient, border: `1px solid ${border}` }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl flex-shrink-0"
                    style={{ background: gradient, border: `1px solid ${border}` }}>
                    <Icon size={20} style={{ color: iconColor }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Demo Cases ─── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20 animate-fade-in-up stagger-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-3 text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Demo Cases</h2>
            <p style={{ color: '#94a3b8' }}>3 pre-loaded Indian healthcare documents ready to explore</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {demoRecords.map((rec) => (
              <Link key={rec.id} href={`/record/${rec.id}`} className="group block">
                <div className="glass-card rounded-2xl p-6 card-hover h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">
                      {rec.type === 'lab_report' ? '🧪' : rec.type === 'hospital_bill' ? '🏥' : '📋'}
                    </span>
                    <span className="badge-done text-xs px-2.5 py-1 rounded-full font-mono">
                      {rec.confidence}%
                    </span>
                  </div>
                  <h3 className="font-bold text-white mb-1 text-sm" style={{ fontFamily: 'Syne, sans-serif' }}>{rec.title}</h3>
                  <p className="text-xs mb-3" style={{ color: '#64748b' }}>{rec.patient.name}, {rec.patient.age}y · {rec.document.source}</p>
                  <div className="flex flex-wrap gap-1">
                    {rec.extracted.diagnoses.slice(0, 2).map((d) => (
                      <span key={d.code} className="tag-icd text-xs px-2 py-0.5 rounded font-mono">{d.code}</span>
                    ))}
                    {rec.extracted.procedures.slice(0, 1).map((p) => (
                      <span key={p.code} className="tag-cpt text-xs px-2 py-0.5 rounded font-mono">{p.code}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-xs text-blue-400 group-hover:gap-2 transition-all">
                    View extracted data <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center animate-fade-in-up stagger-7">
          <div className="glass-card-bright rounded-3xl p-12">
            <AlertTriangle size={32} className="text-amber-400 mx-auto mb-4" />
            <h2 className="text-3xl font-black mb-3 text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              ₹2,500 Cr+ Lost Annually
            </h2>
            <p className="mb-8 max-w-xl mx-auto" style={{ color: '#94a3b8' }}>
              Indian hospitals lose crores every year to manual billing errors, claim denials, and undercoding.
              MedNorm AI automates the entire revenue cycle — from document to claim in under 5 seconds.
            </p>
            <Link href="/upload"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white">
              Start Normalizing <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
