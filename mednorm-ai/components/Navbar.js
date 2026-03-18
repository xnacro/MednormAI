'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, UploadCloud, LayoutDashboard, Menu, X, Shield, LogIn, ChevronDown, Users, Stethoscope, KeyRound } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const adminRef = useRef(null);

  // Close admin dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (adminRef.current && !adminRef.current.contains(e.target)) {
        setAdminOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const links = [
    { href: '/', label: 'Home', icon: Activity },
    { href: '/upload', label: 'Ingest', icon: UploadCloud },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const adminLinks = [
    { href: '/admin#users', label: 'Manage Users', icon: Users, desc: 'Add, remove & assign roles' },
    { href: '/admin#doctors', label: 'Manage Doctors', icon: Stethoscope, desc: 'Register & set access' },
    { href: '/admin#access', label: 'Access Control', icon: KeyRound, desc: 'Module permissions by role' },
  ];

  const isAdminActive = pathname?.startsWith('/admin');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 animate-fade-in-down"
      style={{
        background: 'rgba(6,14,30,0.88)',
        borderBottom: '1px solid rgba(59,130,246,0.1)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.03]">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', boxShadow: '0 4px 12px rgba(37,99,235,0.35)' }}>
              M
            </div>
            <span className="font-bold text-lg tracking-tight text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              MedNorm{' '}
              <span style={{
                background: 'linear-gradient(135deg, #60a5fa, #06d6f2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
                  style={active
                    ? {
                        background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(6,182,212,0.12))',
                        color: '#93c5fd',
                        border: '1px solid rgba(59,130,246,0.3)',
                        boxShadow: '0 2px 8px rgba(37,99,235,0.15)',
                      }
                    : { color: '#94a3b8', border: '1px solid transparent' }
                  }
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(37,99,235,0.06)'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  <Icon size={15} />{label}
                </Link>
              );
            })}

            {/* Admin Dropdown */}
            <div ref={adminRef} className="relative">
              <button
                onClick={() => setAdminOpen(!adminOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={isAdminActive
                  ? {
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.12))',
                      color: '#c4b5fd',
                      border: '1px solid rgba(139,92,246,0.3)',
                      boxShadow: '0 2px 8px rgba(139,92,246,0.15)',
                    }
                  : { color: '#94a3b8', border: '1px solid transparent' }
                }
              >
                <Shield size={15} />
                Admin
                <ChevronDown size={12} className={`transition-transform duration-200 ${adminOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {adminOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(11,21,41,0.95)',
                    border: '1px solid rgba(139,92,246,0.2)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                    animation: 'dropdownIn 0.2s ease-out',
                  }}>
                  <div className="p-2">
                    {adminLinks.map(({ href, label, icon: Icon, desc }) => (
                      <Link key={href} href={href}
                        onClick={() => setAdminOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-xl transition-all hover:bg-violet-500/10">
                        <div className="p-1.5 rounded-lg mt-0.5"
                          style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}>
                          <Icon size={14} style={{ color: '#a78bfa' }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{label}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}>
                    <Link href="/admin" onClick={() => setAdminOpen(false)}
                      className="text-xs font-medium transition-colors" style={{ color: '#a78bfa' }}>
                      Open Full Panel →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side: Login + Track Badge */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={pathname === '/login'
                ? { background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(6,182,212,0.12))', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' }
                : { color: '#94a3b8', border: '1px solid transparent' }
              }>
              <LogIn size={15} /> Login
            </Link>
            <span className="text-xs font-mono px-3 py-1.5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(99,102,241,0.1))',
                color: '#93c5fd',
                border: '1px solid rgba(59,130,246,0.25)',
              }}>
              LegacyCoderz · HackMatrix 2.0
            </span>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-slate-400 hover:text-white transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden py-2 px-4"
          style={{
            borderTop: '1px solid rgba(59,130,246,0.1)',
            background: 'rgba(11,21,41,0.95)',
            backdropFilter: 'blur(16px)',
          }}>
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 py-3 text-sm text-slate-300 hover:text-white transition-colors"
              style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
              <Icon size={16} />{label}
            </Link>
          ))}
          {/* Admin links in mobile */}
          <div className="py-2" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
            <p className="text-xs font-semibold uppercase tracking-widest py-2" style={{ color: '#64748b' }}>Admin</p>
            {adminLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-2.5 text-sm text-slate-300 hover:text-white transition-colors pl-2">
                <Icon size={14} />{label}
              </Link>
            ))}
          </div>
          <Link href="/login" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 py-3 text-sm text-slate-300 hover:text-white transition-colors">
            <LogIn size={16} /> Login
          </Link>
        </div>
      )}

      {/* Dropdown animation */}
      <style jsx>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        nav a, nav button {
          position: relative;
        }
      `}</style>
    </nav>
  );
}
