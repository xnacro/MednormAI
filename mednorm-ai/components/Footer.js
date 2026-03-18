'use client';
import Link from 'next/link';
import { Activity, UploadCloud, LayoutDashboard, Shield, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-20" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
                M
              </div>
              <span className="font-bold text-base text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                MedNorm <span style={{ background: 'linear-gradient(135deg, #60a5fa, #06d6f2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#64748b', maxWidth: 360 }}>
              AI-Powered Clinical Data Normalization Engine for Hospital Billing & Claims Processing.
              Transforming unstructured medical documents into structured, standards-compliant data.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'FastAPI', 'FHIR R4', 'ICD-10', 'GPT-4o'].map(tag => (
                <span key={tag} className="text-xs font-mono px-2.5 py-1 rounded-lg"
                  style={{
                    background: 'rgba(37,99,235,0.08)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59,130,246,0.15)',
                  }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#94a3b8' }}>Navigation</h4>
            <div className="space-y-2.5">
              {[
                { href: '/', label: 'Home', icon: Activity },
                { href: '/upload', label: 'Upload', icon: UploadCloud },
                { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { href: '/admin', label: 'Admin', icon: Shield },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-2.5 text-sm transition-colors hover:text-blue-400"
                  style={{ color: '#64748b' }}>
                  <Icon size={13} />{label}
                </Link>
              ))}
            </div>
          </div>

          {/* Team */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#94a3b8' }}>Team</h4>
            <div className="glass-card rounded-xl p-4 mb-3">
              <p className="font-bold text-sm mb-1" style={{
                fontFamily: 'Syne, sans-serif',
                background: 'linear-gradient(135deg, #60a5fa, #06d6f2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                LegacyCoderz
              </p>
              <p className="text-xs" style={{ color: '#64748b' }}>HackMatrix 2.0 — Track 2</p>
              <p className="text-xs mt-1" style={{ color: '#475569' }}>Data Normalization Engine</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(59,130,246,0.06)' }}>
          <p className="text-xs" style={{ color: '#475569' }}>
            © {new Date().getFullYear()} MedNorm AI · Built with <Heart size={10} className="inline text-rose-400 mx-0.5" /> by Team LegacyCoderz
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-3 py-1.5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(6,182,212,0.08))',
                color: '#93c5fd',
                border: '1px solid rgba(59,130,246,0.2)',
              }}>
              v1.0.0
            </span>
            <span className="text-xs font-mono px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(16,185,129,0.1)',
                color: '#34d399',
                border: '1px solid rgba(16,185,129,0.2)',
              }}>
              ● Live
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
