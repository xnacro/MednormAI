'use client';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { UserPlus, Trash2, Shield, Users, Stethoscope, KeyRound, ChevronDown, Search, Plus, X, Check, AlertTriangle } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   Admin Panel — Users, Doctors & Access Management
   Dark navy theme matching the rest of MedNorm AI
   ═══════════════════════════════════════════════════════════════════════════ */

const INITIAL_USERS = [
  { id: 1, name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@aiims.edu.in', role: 'doctor', status: 'active', department: 'Pathology' },
  { id: 2, name: 'Sunita Devi', email: 'sunita.d@fortis.com', role: 'staff', status: 'active', department: 'Billing' },
  { id: 3, name: 'Aryan Sharma', email: 'aryan.s@apollo.com', role: 'admin', status: 'active', department: 'IT' },
  { id: 4, name: 'Priya Patel', email: 'priya.p@maxhealth.in', role: 'doctor', status: 'active', department: 'Cardiology' },
  { id: 5, name: 'Vikram Singh', email: 'vikram.s@aiims.edu.in', role: 'staff', status: 'revoked', department: 'Reception' },
];

const INITIAL_DOCTORS = [
  { id: 1, name: 'Dr. Rajesh Kumar', specialization: 'Pathology', department: 'Lab Sciences', access: 'full', license: 'MCI-2024-44821' },
  { id: 2, name: 'Dr. Priya Patel', specialization: 'Cardiology', department: 'Heart Center', access: 'records_only', license: 'MCI-2024-55932' },
  { id: 3, name: 'Dr. Anand Mehta', specialization: 'Orthopedics', department: 'Trauma', access: 'full', license: 'MCI-2023-33710' },
  { id: 4, name: 'Dr. Kavita Reddy', specialization: 'Neurology', department: 'Neuro Sciences', access: 'read_only', license: 'MCI-2024-66143' },
];

const MODULES = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'upload', label: 'Document Upload', icon: '📤' },
  { key: 'records', label: 'Clinical Records', icon: '📋' },
  { key: 'billing', label: 'Billing & Claims', icon: '💰' },
  { key: 'fhir', label: 'FHIR R4 Export', icon: '🔗' },
  { key: 'admin', label: 'Admin Panel', icon: '🛡️' },
];

const ROLE_ACCESS = {
  admin:   { dashboard: true, upload: true, records: true, billing: true, fhir: true, admin: true },
  doctor:  { dashboard: true, upload: true, records: true, billing: false, fhir: true, admin: false },
  staff:   { dashboard: true, upload: true, records: true, billing: true, fhir: false, admin: false },
  patient: { dashboard: true, upload: false, records: true, billing: false, fhir: false, admin: false },
};

export default function AdminPage() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState(INITIAL_USERS);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [accessRules, setAccessRules] = useState(ROLE_ACCESS);
  const [search, setSearch] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'staff', department: '' });
  const [newDoctor, setNewDoctor] = useState({ name: '', specialization: '', department: '', license: '' });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── User Management ────────────────────────────────────────────────
  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    setUsers(prev => [...prev, { ...newUser, id: Date.now(), status: 'active' }]);
    setNewUser({ name: '', email: '', role: 'staff', department: '' });
    setShowAddUser(false);
    showToast(`${newUser.name} added successfully`);
  };

  const removeUser = (id) => {
    const u = users.find(x => x.id === id);
    setUsers(prev => prev.filter(x => x.id !== id));
    showToast(`${u?.name} removed`, 'warning');
  };

  const toggleUserStatus = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'revoked' : 'active' } : u
    ));
    const u = users.find(x => x.id === id);
    showToast(`${u?.name} ${u?.status === 'active' ? 'revoked' : 'reactivated'}`);
  };

  const updateUserRole = (id, role) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  };

  // ─── Doctor Management ──────────────────────────────────────────────
  const addDoctor = () => {
    if (!newDoctor.name || !newDoctor.specialization) return;
    setDoctors(prev => [...prev, { ...newDoctor, id: Date.now(), access: 'full' }]);
    setNewDoctor({ name: '', specialization: '', department: '', license: '' });
    setShowAddDoctor(false);
    showToast(`${newDoctor.name} registered`);
  };

  const removeDoctor = (id) => {
    const d = doctors.find(x => x.id === id);
    setDoctors(prev => prev.filter(x => x.id !== id));
    showToast(`${d?.name} removed`, 'warning');
  };

  const updateDoctorAccess = (id, access) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, access } : d));
  };

  // ─── Access Control ─────────────────────────────────────────────────
  const toggleAccess = (role, module) => {
    setAccessRules(prev => ({
      ...prev,
      [role]: { ...prev[role], [module]: !prev[role][module] },
    }));
  };

  const tabs = [
    { key: 'users', label: 'Users', icon: Users, count: users.length },
    { key: 'doctors', label: 'Doctors', icon: Stethoscope, count: doctors.length },
    { key: 'access', label: 'Access Control', icon: KeyRound, count: Object.keys(accessRules).length },
  ];

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDoctors = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-grid" style={{ backgroundColor: '#060e1e' }}>
      <Navbar />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute rounded-full ambient-animate" style={{ width: 400, height: 400, top: '15%', left: '10%', background: 'radial-gradient(circle, rgba(139,92,246,0.05), transparent 65%)', filter: 'blur(60px)' }} />
        <div className="absolute rounded-full ambient-animate" style={{ width: 300, height: 300, bottom: '20%', right: '15%', background: 'radial-gradient(circle, rgba(37,99,235,0.05), transparent 65%)', filter: 'blur(60px)', animationDelay: '7s' }} />
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-slide-up">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
            style={{
              background: toast.type === 'warning' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
              color: toast.type === 'warning' ? '#fbbf24' : '#34d399',
              border: `1px solid ${toast.type === 'warning' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
              backdropFilter: 'blur(16px)',
            }}>
            {toast.type === 'warning' ? <AlertTriangle size={14} /> : <Check size={14} />}
            {toast.msg}
          </div>
        </div>
      )}

      <main className="relative z-10 pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
          <div className="p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.1))', border: '1px solid rgba(139,92,246,0.3)' }}>
            <Shield size={22} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Admin Panel</h1>
            <p style={{ color: '#94a3b8' }} className="text-sm">Manage users, doctors, and access control</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 animate-fade-in-up stagger-2">
          {tabs.map(({ key, label, icon: Icon, count }) => (
            <button key={key} onClick={() => setTab(key)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all"
              style={tab === key
                ? { background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.1))', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 2px 8px rgba(139,92,246,0.15)' }
                : { color: '#94a3b8', border: '1px solid transparent' }
              }>
              <Icon size={15} /> {label}
              <span className="text-xs font-mono px-1.5 py-0.5 rounded-md"
                style={{
                  background: tab === key ? 'rgba(139,92,246,0.2)' : 'rgba(100,116,139,0.15)',
                  color: tab === key ? '#c4b5fd' : '#64748b',
                }}>{count}</span>
            </button>
          ))}
        </div>

        {/* Search + Add bar */}
        <div className="flex flex-wrap gap-3 mb-6 animate-fade-in-up stagger-3">
          <div className="flex items-center gap-2 glass-card rounded-xl px-4 py-2.5 flex-1 min-w-48">
            <Search size={15} style={{ color: '#64748b' }} />
            <input
              type="text"
              placeholder={tab === 'users' ? 'Search users…' : tab === 'doctors' ? 'Search doctors…' : 'Search modules…'}
              className="bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none flex-1"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {tab === 'users' && (
            <button onClick={() => setShowAddUser(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 24px rgba(37,99,235,0.4)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 16px rgba(37,99,235,0.3)'; }}>
              <UserPlus size={15} /> Add User
            </button>
          )}
          {tab === 'doctors' && (
            <button onClick={() => setShowAddDoctor(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 16px rgba(16,185,129,0.3)' }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}>
              <Plus size={15} /> Add Doctor
            </button>
          )}
        </div>

        {/* ─── Users Table ─── */}
        {tab === 'users' && (
          <>
            {/* Add User Modal */}
            {showAddUser && (
              <div className="glass-card-md rounded-2xl p-6 mb-6 animate-slide-up"
                style={{ border: '1px solid rgba(59,130,246,0.25)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-sm uppercase tracking-widest">Add New User</h3>
                  <button onClick={() => setShowAddUser(false)} className="text-slate-500 hover:text-white transition-colors"><X size={16} /></button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <input placeholder="Full Name" value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))}
                    className="bg-navy-900/50 text-sm text-slate-200 placeholder-slate-600 px-4 py-2.5 rounded-xl outline-none border border-blue-500/10 focus:border-blue-500/40 transition-colors" />
                  <input placeholder="Email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))}
                    className="bg-navy-900/50 text-sm text-slate-200 placeholder-slate-600 px-4 py-2.5 rounded-xl outline-none border border-blue-500/10 focus:border-blue-500/40 transition-colors" />
                  <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}
                    className="bg-navy-900/50 text-sm text-slate-200 px-4 py-2.5 rounded-xl outline-none border border-blue-500/10 focus:border-blue-500/40 cursor-pointer appearance-none transition-colors">
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="staff">Staff</option>
                    <option value="patient">Patient</option>
                  </select>
                  <input placeholder="Department" value={newUser.department} onChange={e => setNewUser(p => ({ ...p, department: e.target.value }))}
                    className="bg-navy-900/50 text-sm text-slate-200 placeholder-slate-600 px-4 py-2.5 rounded-xl outline-none border border-blue-500/10 focus:border-blue-500/40 transition-colors" />
                </div>
                <button onClick={addUser}
                  className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)' }}>
                  <span className="flex items-center gap-2"><Check size={14} /> Add User</span>
                </button>
              </div>
            )}

            <div className="glass-card rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                    {['User', 'Email', 'Role', 'Department', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs uppercase tracking-widest px-5 py-4 font-medium" style={{ color: '#64748b' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, i) => (
                    <tr key={u.id} className="transition-colors hover:bg-blue-500/[0.03]"
                      style={{ borderBottom: i === filteredUsers.length - 1 ? 'none' : '1px solid rgba(59,130,246,0.06)' }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: u.role === 'admin' ? '#8b5cf6' : u.role === 'doctor' ? '#06b6d4' : u.role === 'staff' ? '#f59e0b' : '#64748b' }}>
                            {u.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-slate-200">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-mono" style={{ color: '#64748b' }}>{u.email}</td>
                      <td className="px-5 py-4">
                        <select value={u.role} onChange={e => updateUserRole(u.id, e.target.value)}
                          className="text-xs font-mono px-2.5 py-1 rounded-lg cursor-pointer appearance-none outline-none transition-colors"
                          style={{
                            background: u.role === 'admin' ? 'rgba(139,92,246,0.15)' : u.role === 'doctor' ? 'rgba(6,182,212,0.15)' : u.role === 'staff' ? 'rgba(245,158,11,0.15)' : 'rgba(100,116,139,0.15)',
                            color: u.role === 'admin' ? '#c4b5fd' : u.role === 'doctor' ? '#67e8f9' : u.role === 'staff' ? '#fcd34d' : '#94a3b8',
                            border: `1px solid ${u.role === 'admin' ? 'rgba(139,92,246,0.3)' : u.role === 'doctor' ? 'rgba(6,182,212,0.3)' : u.role === 'staff' ? 'rgba(245,158,11,0.3)' : 'rgba(100,116,139,0.25)'}`,
                          }}>
                          <option value="admin">Admin</option>
                          <option value="doctor">Doctor</option>
                          <option value="staff">Staff</option>
                          <option value="patient">Patient</option>
                        </select>
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: '#94a3b8' }}>{u.department}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => toggleUserStatus(u.id)}
                          className={`text-xs px-2.5 py-1 rounded-full font-mono cursor-pointer transition-all ${
                            u.status === 'active' ? 'badge-done' : 'badge-error'
                          }`}>
                          {u.status}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => removeUser(u.id)}
                          className="text-slate-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="py-12 text-center" style={{ color: '#64748b' }}>
                  <Users size={24} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No users found</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ─── Doctors Table ─── */}
        {tab === 'doctors' && (
          <>
            {showAddDoctor && (
              <div className="glass-card-md rounded-2xl p-6 mb-6 animate-slide-up"
                style={{ border: '1px solid rgba(16,185,129,0.25)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-sm uppercase tracking-widest">Register New Doctor</h3>
                  <button onClick={() => setShowAddDoctor(false)} className="text-slate-500 hover:text-white transition-colors"><X size={16} /></button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <input placeholder="Doctor Name" value={newDoctor.name} onChange={e => setNewDoctor(p => ({ ...p, name: e.target.value }))}
                    className="bg-navy-900/50 text-sm text-slate-200 placeholder-slate-600 px-4 py-2.5 rounded-xl outline-none border border-emerald-500/10 focus:border-emerald-500/40 transition-colors" />
                  <input placeholder="Specialization" value={newDoctor.specialization} onChange={e => setNewDoctor(p => ({ ...p, specialization: e.target.value }))}
                    className="bg-navy-900/50 text-sm text-slate-200 placeholder-slate-600 px-4 py-2.5 rounded-xl outline-none border border-emerald-500/10 focus:border-emerald-500/40 transition-colors" />
                  <input placeholder="Department" value={newDoctor.department} onChange={e => setNewDoctor(p => ({ ...p, department: e.target.value }))}
                    className="bg-navy-900/50 text-sm text-slate-200 placeholder-slate-600 px-4 py-2.5 rounded-xl outline-none border border-emerald-500/10 focus:border-emerald-500/40 transition-colors" />
                  <input placeholder="License No." value={newDoctor.license} onChange={e => setNewDoctor(p => ({ ...p, license: e.target.value }))}
                    className="bg-navy-900/50 text-sm text-slate-200 placeholder-slate-600 px-4 py-2.5 rounded-xl outline-none border border-emerald-500/10 focus:border-emerald-500/40 transition-colors" />
                </div>
                <button onClick={addDoctor}
                  className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
                  <span className="flex items-center gap-2"><Check size={14} /> Register Doctor</span>
                </button>
              </div>
            )}

            <div className="glass-card rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                    {['Doctor', 'Specialization', 'Department', 'License', 'Access Level', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs uppercase tracking-widest px-5 py-4 font-medium" style={{ color: '#64748b' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((d, i) => (
                    <tr key={d.id} className="transition-colors hover:bg-blue-500/[0.03]"
                      style={{ borderBottom: i === filteredDoctors.length - 1 ? 'none' : '1px solid rgba(59,130,246,0.06)' }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                            {d.name.replace('Dr. ', '').charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-slate-200">{d.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: '#94a3b8' }}>{d.specialization}</td>
                      <td className="px-5 py-4 text-sm" style={{ color: '#94a3b8' }}>{d.department}</td>
                      <td className="px-5 py-4 text-xs font-mono" style={{ color: '#64748b' }}>{d.license}</td>
                      <td className="px-5 py-4">
                        <select value={d.access} onChange={e => updateDoctorAccess(d.id, e.target.value)}
                          className="text-xs font-mono px-2.5 py-1 rounded-lg cursor-pointer appearance-none outline-none transition-colors"
                          style={{
                            background: d.access === 'full' ? 'rgba(16,185,129,0.15)' : d.access === 'records_only' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)',
                            color: d.access === 'full' ? '#34d399' : d.access === 'records_only' ? '#60a5fa' : '#fbbf24',
                            border: `1px solid ${d.access === 'full' ? 'rgba(16,185,129,0.3)' : d.access === 'records_only' ? 'rgba(59,130,246,0.3)' : 'rgba(245,158,11,0.3)'}`,
                          }}>
                          <option value="full">Full Access</option>
                          <option value="records_only">Records Only</option>
                          <option value="read_only">Read Only</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => removeDoctor(d.id)}
                          className="text-slate-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredDoctors.length === 0 && (
                <div className="py-12 text-center" style={{ color: '#64748b' }}>
                  <Stethoscope size={24} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No doctors found</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ─── Access Control Matrix ─── */}
        {tab === 'access' && (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Module Access by Role</h3>
              <p className="text-xs mt-1" style={{ color: '#64748b' }}>Toggle access for each role × module combination</p>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                  <th className="text-left text-xs uppercase tracking-widest px-5 py-4 font-medium" style={{ color: '#64748b' }}>Module</th>
                  {Object.keys(accessRules).map(role => (
                    <th key={role} className="text-center text-xs uppercase tracking-widest px-5 py-4 font-medium" style={{ color: '#64748b' }}>
                      <span className="inline-flex items-center gap-1.5">
                        {role === 'admin' ? '🛡️' : role === 'doctor' ? '🩺' : role === 'staff' ? '👤' : '🧑'}
                        {role}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MODULES.map((mod, i) => (
                  <tr key={mod.key}
                    className="transition-colors hover:bg-blue-500/[0.03]"
                    style={{ borderBottom: i === MODULES.length - 1 ? 'none' : '1px solid rgba(59,130,246,0.06)' }}>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-2.5 text-sm text-slate-200">
                        <span className="text-base">{mod.icon}</span>
                        {mod.label}
                      </span>
                    </td>
                    {Object.keys(accessRules).map(role => (
                      <td key={role} className="px-5 py-4 text-center">
                        <button
                          onClick={() => toggleAccess(role, mod.key)}
                          className="w-10 h-6 rounded-full transition-all duration-300 relative"
                          style={{
                            background: accessRules[role][mod.key]
                              ? 'linear-gradient(135deg, #10b981, #059669)'
                              : 'rgba(100,116,139,0.2)',
                            border: `1px solid ${accessRules[role][mod.key] ? 'rgba(16,185,129,0.5)' : 'rgba(100,116,139,0.3)'}`,
                            boxShadow: accessRules[role][mod.key] ? '0 0 8px rgba(16,185,129,0.3)' : 'none',
                          }}
                        >
                          <div className="absolute top-0.5 w-4.5 h-4.5 rounded-full transition-all duration-300"
                            style={{
                              width: 18, height: 18,
                              background: 'white',
                              left: accessRules[role][mod.key] ? 'calc(100% - 20px)' : '2px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            }}
                          />
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
