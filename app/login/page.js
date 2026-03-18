'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ChevronDown } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   MedNorm AI — Premium Glassmorphism Login Page
   Blob characters with SPRING PHYSICS cursor tracking
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── Blob character definitions ──────────────────────────────────────────
// Each blob has a base position, size, parallax strength, and face features
const BLOBS = [
  {
    id: 'orange',
    color: '#FF8C42',
    shadow: 'rgba(255,140,66,0.5)',
    width: 240, height: 280,
    baseX: 90, baseY: 200,
    radius: '60% 40% 50% 50% / 50% 60% 40% 50%',
    eyes: [{ cx: 90, cy: 105, r: 7, fill: '#fff' }, { cx: 130, cy: 100, r: 7, fill: '#fff' }],
    mouth: { cx: 108, cy: 140, rx: 20, ry: 6 },
    parallaxStrength: 1,
    springStiffness: 0.035,
    damping: 0.88,
    floatDelay: 0,
    zIndex: 3,
  },
  {
    id: 'purple',
    color: '#7C5CFC',
    shadow: 'rgba(124,92,252,0.4)',
    width: 170, height: 260,
    baseX: 50, baseY: 30,
    radius: '45% 55% 60% 40% / 55% 45% 55% 45%',
    eyes: [{ cx: 68, cy: 120, r: 5, fill: '#fff' }, { cx: 100, cy: 118, r: 5, fill: '#fff' }],
    mouth: null,
    parallaxStrength: 1,
    springStiffness: 0.03,
    damping: 0.90,
    floatDelay: 0.8,
    zIndex: 4,
  },
  {
    id: 'dark',
    color: '#2D2D3A',
    shadow: 'rgba(45,45,58,0.35)',
    width: 150, height: 170,
    baseX: 240, baseY: 120,
    radius: '50% 50% 45% 55% / 45% 55% 50% 50%',
    eyes: [{ cx: 52, cy: 70, r: 8, fill: '#fff' }, { cx: 92, cy: 68, r: 8, fill: '#fff' }],
    mouth: null,
    parallaxStrength: 2,
    springStiffness: 0.04,
    damping: 0.86,
    floatDelay: 0.4,
    zIndex: 2,
  },
  {
    id: 'yellow',
    color: '#FFD23F',
    shadow: 'rgba(255,210,63,0.4)',
    width: 130, height: 150,
    baseX: 290, baseY: 310,
    radius: '55% 45% 50% 50% / 50% 50% 45% 55%',
    eyes: [{ cx: 45, cy: 58, r: 6, fill: '#fff' }, { cx: 78, cy: 56, r: 6, fill: '#fff' }],
    mouth: { cx: 60, cy: 85, rx: 14, ry: 5 },
    parallaxStrength: 1,
    springStiffness: 0.045,
    damping: 0.84,
    floatDelay: 1.2,
    zIndex: 1,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [ripple, setRipple] = useState(null);

  // ─── Spring physics state ────────────────────────────────────────────
  // We use refs (not state) for animation data to avoid re-renders
  const mouseRef = useRef({ x: 0, y: 0 });     // raw mouse position in px
  const blobPhysics = useRef(
    BLOBS.map(b => ({
      // Current position offset from base
      x: 0, y: 0,
      // Velocity for spring physics
      vx: 0, vy: 0,
      // Current rotation
      rotation: 0,
      rotationV: 0,
      // Current scale
      scale: 1,
    }))
  );
  const containerRef = useRef(null);
  const containerRect = useRef({ left: 0, top: 0, width: 1, height: 1 });
  const rafRef = useRef(null);
  const blobRefs = useRef([]);
  const pupilRefs = useRef([]);

  // ─── Spring physics animation loop ───────────────────────────────────
  // Uses requestAnimationFrame for 60fps smooth animation
  // Each blob has independent spring constants for varied, organic feel
  const animate = useCallback(() => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const rect = containerRect.current;

    BLOBS.forEach((blob, i) => {
      const physics = blobPhysics.current[i];

      // Calculate target offset: how far blob should move toward cursor
      // The cursor position is relative to the container center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const targetX = (mx - centerX) * (blob.parallaxStrength / 100);
      const targetY = (my - centerY) * (blob.parallaxStrength / 100);

      // Spring physics: F = -k * (position - target)
      // Acceleration = spring force, then apply damping to velocity
      const forceX = (targetX - physics.x) * blob.springStiffness;
      const forceY = (targetY - physics.y) * blob.springStiffness;

      physics.vx = (physics.vx + forceX) * blob.damping;
      physics.vy = (physics.vy + forceY) * blob.damping;

      physics.x += physics.vx;
      physics.y += physics.vy;

      // Rotation based on horizontal velocity (tilt when moving)
      const targetRotation = physics.vx * 0.8;  // tilt proportional to speed
      physics.rotationV = (physics.rotationV + (targetRotation - physics.rotation) * 0.06) * 0.9;
      physics.rotation += physics.rotationV;

      // Scale based on cursor proximity (grow when cursor is near)
      const blobCenterX = rect.left + blob.baseX + blob.width / 2;
      const blobCenterY = rect.top + blob.baseY + blob.height / 2;
      const dist = Math.sqrt((mx - blobCenterX) ** 2 + (my - blobCenterY) ** 2);
      const proximityScale = 1 + Math.max(0, (300 - dist) / 300) * 0.08;
      physics.scale += (proximityScale - physics.scale) * 0.05;

      // Apply transforms to DOM element
      const el = blobRefs.current[i];
      if (el) {
        el.style.transform = `translate(${physics.x}px, ${physics.y}px) rotate(${physics.rotation}deg) scale(${physics.scale})`;
      }
    });

    // Update eye pupils — eyes track cursor independently
    pupilRefs.current.forEach(pupil => {
      if (!pupil) return;
      const baseCx = parseFloat(pupil.dataset.baseCx);
      const baseCy = parseFloat(pupil.dataset.baseCy);
      const blobEl = pupil.closest('[data-blob]');
      if (!blobEl) return;
      const blobRect = blobEl.getBoundingClientRect();
      const eyeWorldX = blobRect.left + (baseCx / parseFloat(blobEl.dataset.blobW)) * blobRect.width;
      const eyeWorldY = blobRect.top + (baseCy / parseFloat(blobEl.dataset.blobH)) * blobRect.height;
      const angle = Math.atan2(my - eyeWorldY, mx - eyeWorldX);
      const maxMove = 6;
      const moveX = Math.cos(angle) * maxMove;
      const moveY = Math.sin(angle) * maxMove;
      pupil.setAttribute('cx', baseCx + moveX);
      pupil.setAttribute('cy', baseCy + moveY);
    });

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [animate]);

  // Track mouse globally
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cache container rect (update on resize)
  useEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        containerRect.current = { left: r.left, top: r.top, width: r.width, height: r.height };
      }
    };
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, []);

  // Collect pupil refs after mount
  useEffect(() => {
    if (containerRef.current) {
      pupilRefs.current = Array.from(containerRef.current.querySelectorAll('[data-pupil]'));
    }
  }, []);

  // ─── Login handler (mock auth) ───────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    localStorage.setItem('mednorm_user', JSON.stringify({ email, role, loggedIn: true }));
    router.push('/dashboard');
  };

  // ─── Ripple effect ───────────────────────────────────────────────────
  const handleRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 600);
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: '#060e1e',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full ambient-animate" style={{ width: 400, height: 400, top: '15%', left: '8%', background: 'radial-gradient(circle, rgba(37,99,235,0.06), transparent 65%)', filter: 'blur(60px)' }} />
        <div className="absolute rounded-full ambient-animate" style={{ width: 300, height: 300, bottom: '20%', right: '10%', background: 'radial-gradient(circle, rgba(6,214,242,0.05), transparent 65%)', filter: 'blur(60px)', animationDelay: '7s' }} />
      </div>

      {/* ═══ LEFT PANEL — Spring-Physics Blob Characters ═══ */}
      <div
        ref={containerRef}
        className="hidden md:flex w-1/2 relative items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0b1529, #0f1d38)' }}
      >
        {/* Subtle background grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Blob characters with spring physics */}
        <div className="relative" style={{ width: 460, height: 500 }}>
          {BLOBS.map((blob, index) => (
            <div
              key={blob.id}
              ref={el => blobRefs.current[index] = el}
              data-blob={blob.id}
              data-blob-w={blob.width}
              data-blob-h={blob.height}
              className="absolute"
              style={{
                left: blob.baseX,
                top: blob.baseY,
                width: blob.width,
                height: blob.height,
                zIndex: blob.zIndex,
                willChange: 'transform',
                transition: 'none',
              }}
            >
              {/* Blob body with floating idle animation */}
              <div
                className="w-full h-full"
                style={{
                  background: blob.color,
                  borderRadius: blob.radius,
                  boxShadow: `0 24px 80px ${blob.shadow}, inset 0 -6px 16px rgba(0,0,0,0.15)`,
                  animation: `blobFloat 4.5s ease-in-out infinite`,
                  animationDelay: `${blob.floatDelay}s`,
                }}
              />

              {/* Eye + Mouth SVG overlay */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox={`0 0 ${blob.width} ${blob.height}`}
                style={{ pointerEvents: 'none' }}
              >
                {blob.eyes.map((eye, i) => (
                  <g key={i}>
                    {/* Eye white (dark blob only) */}
                    {eye.fill && (
                      <circle cx={eye.cx} cy={eye.cy} r={eye.r + 3} fill={eye.fill} />
                    )}
                    {/* Pupil — always in DOM for cursor tracking, squashes flat when password shown */}
                    <circle
                      data-pupil="true"
                      data-base-cx={eye.cx}
                      data-base-cy={eye.cy}
                      cx={eye.cx}
                      cy={eye.cy}
                      r={eye.r}
                      fill={eye.fill ? '#2D2D3A' : '#1a1a2e'}
                      style={{
                        transition: 'transform 0.25s ease',
                        transformOrigin: `${eye.cx}px ${eye.cy}px`,
                        transform: showPassword ? 'scaleY(0.15)' : 'scaleY(1)',
                      }}
                    />
                  </g>
                ))}
                {/* Mouth */}
                {/* Mouth — changes to shocked "O" when password is revealed */}
                {blob.mouth ? (
                  showPassword ? (
                    /* Shocked O mouth */
                    <ellipse
                      cx={blob.mouth.cx}
                      cy={blob.mouth.cy}
                      rx={blob.mouth.rx * 0.45}
                      ry={blob.mouth.ry * 1.6}
                      fill={blob.id === 'yellow' ? '#c4a020' : '#1a1a2e'}
                      style={{ transition: 'all 0.3s ease' }}
                    />
                  ) : (
                    /* Normal smile */
                    <ellipse
                      cx={blob.mouth.cx}
                      cy={blob.mouth.cy}
                      rx={blob.mouth.rx}
                      ry={blob.mouth.ry}
                      fill="none"
                      stroke={blob.id === 'yellow' ? '#c4a020' : '#1a1a2e'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{ clipPath: 'inset(50% 0 0 0)', transition: 'all 0.3s ease' }}
                    />
                  )
                ) : (
                  /* Blobs without a mouth — show a small gasp only when password visible */
                  <ellipse
                    cx={blob.eyes[0].cx + (blob.eyes[1].cx - blob.eyes[0].cx) / 2}
                    cy={blob.eyes[0].cy + 25}
                    rx={4}
                    ry={5}
                    fill={blob.id === 'dark' ? '#fff' : '#1a1a2e'}
                    style={{
                      transition: 'all 0.3s ease',
                      opacity: showPassword ? 1 : 0,
                      transform: showPassword ? 'scale(1)' : 'scale(0)',
                      transformOrigin: `${blob.eyes[0].cx + (blob.eyes[1].cx - blob.eyes[0].cx) / 2}px ${blob.eyes[0].cy + 25}px`,
                    }}
                  />
                )}
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ RIGHT PANEL — Dark Glassmorphism Login Form ═══ */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div
          className="w-full max-w-md p-8 sm:p-10 rounded-3xl animate-fade-in-up"
          style={{
            background: 'rgba(15, 29, 56, 0.65)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(59, 130, 246, 0.12)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', boxShadow: '0 4px 12px rgba(37,99,235,0.35)' }}>
              M
            </div>
            <span className="font-bold text-lg tracking-tight text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              MedNorm <span style={{ background: 'linear-gradient(135deg, #60a5fa, #06d6f2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
            </span>
          </div>

          <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Welcome back!</h1>
          <p className="text-sm mb-8" style={{ color: '#94a3b8' }}>Please enter your details</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#64748b' }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="login-input w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#64748b' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="login-input w-full pl-10 pr-11 py-3 rounded-xl text-sm outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#475569' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#64748b' }}>Sign in as</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="login-input w-full appearance-none px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 cursor-pointer"
                >
                  <option value="admin">🛡️ Admin</option>
                  <option value="doctor">🩺 Doctor</option>
                  <option value="staff">👤 Staff</option>
                  <option value="patient">🧑 Patient</option>
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }} />
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  className="rounded-md flex items-center justify-center transition-all border"
                  style={{
                    width: 18, height: 18,
                    background: remember ? '#2563eb' : 'rgba(15,29,56,0.8)',
                    borderColor: remember ? '#2563eb' : 'rgba(59,130,246,0.2)',
                  }}
                  onClick={() => setRemember(!remember)}
                >
                  {remember && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-xs" style={{ color: '#94a3b8' }}>Remember for 30 days</span>
              </label>
              <button type="button" className="text-xs font-semibold transition-colors" style={{ color: '#60a5fa' }}>
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              onClick={handleRipple}
              className="login-btn btn-primary relative w-full py-3.5 rounded-xl font-semibold text-white text-sm overflow-hidden transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Log in'}
              {ripple && (
                <span
                  className="absolute rounded-full animate-ping"
                  style={{
                    left: ripple.x - 10, top: ripple.y - 10,
                    width: 20, height: 20,
                    background: 'rgba(255,255,255,0.3)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </button>

            {/* Google Login */}
            <button
              type="button"
              className="login-google w-full py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Log in with Google
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm mt-6" style={{ color: '#94a3b8' }}>
            Don't have an account?{' '}
            <button className="font-semibold transition-colors" style={{ color: '#60a5fa' }}>
              Sign up
            </button>
          </p>

          {/* Demo credentials hint */}
          <div className="mt-4 p-3 rounded-xl text-center"
            style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: '#60a5fa' }}>🔑 Demo Credentials</p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-xs font-mono" style={{ color: '#94a3b8' }}>
              <span>admin@mednorm.ai</span>
              <span>admin123</span>
            </div>
            <p className="text-xs mt-1" style={{ color: '#475569' }}>Any email/password works — this is a demo login</p>
          </div>

          {/* Created by */}
          <p className="text-center text-xs mt-5" style={{ color: '#475569' }}>
            Created by{' '}
            <span className="font-bold" style={{
              background: 'linear-gradient(135deg, #60a5fa, #06d6f2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>LegacyCoderz</span>
            {' '}· HackMatrix 2.0
          </p>
        </div>
      </div>

      {/* ═══ Styles ═══ */}
      <style jsx>{`
        @keyframes blobFloat {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-8px) translateX(3px) rotate(1.5deg); }
          50% { transform: translateY(-12px) translateX(-2px) rotate(-1deg); }
          75% { transform: translateY(-5px) translateX(4px) rotate(1deg); }
        }
        .login-input {
          background: rgba(15, 29, 56, 0.8);
          border: 1.5px solid rgba(59, 130, 246, 0.12);
          color: #e2e8f0;
        }
        .login-input::placeholder {
          color: #475569;
        }
        .login-input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important;
          background: rgba(15, 29, 56, 1);
        }
        select.login-input option {
          background: #0f1d38;
          color: #e2e8f0;
        }
        .login-google {
          background: rgba(15, 29, 56, 0.6);
          border: 1.5px solid rgba(59, 130, 246, 0.12);
          color: #94a3b8;
        }
        .login-google:hover {
          background: rgba(15, 29, 56, 0.9);
          border-color: rgba(59, 130, 246, 0.25);
          color: #e2e8f0;
        }
      `}</style>
    </div>
  );
}

