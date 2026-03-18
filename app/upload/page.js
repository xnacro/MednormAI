'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { demoRecords, pipelineSteps } from '../../lib/demoData';
import { runFullPipeline } from '../../lib/api';
import { UploadCloud, FileText, CheckCircle, Loader, ChevronRight, X, FileImage, File, AlertCircle, WifiOff } from 'lucide-react';

const STEP_LABELS = [
  'Parsing document…',
  'Running Clinical NLP…',
  'Mapping ICD-10 / CPT / RxNorm / LOINC…',
  'Generating FHIR R4 bundle…',
  'Reconciling billing & claims…',
];

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [error, setError] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [backendDown, setBackendDown] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) { setSelectedFile(file); setError(null); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setSelectedFile(file); setError(null); }
  };

  const animateSteps = async (stopAtStep = 4) => {
    const delays = [900, 1300, 1000, 800, 600];
    for (let i = 0; i <= stopAtStep; i++) {
      setCurrentStep(i);
      setStatusMsg(STEP_LABELS[i]);
      await new Promise(r => setTimeout(r, delays[i]));
      setCompletedSteps(prev => [...prev, i]);
    }
  };

  const processRealFile = async () => {
    setProcessing(true);
    setCurrentStep(0);
    setCompletedSteps([]);
    setError(null);
    setBackendDown(false);

    const animPromise = animateSteps(3);

    try {
      const data = await runFullPipeline(selectedFile);
      await animPromise;

      setCurrentStep(4);
      setStatusMsg(STEP_LABELS[4]);
      await new Promise(r => setTimeout(r, 600));
      setCompletedSteps(prev => [...prev, 4]);
      setStatusMsg('Done!');

      await new Promise(r => setTimeout(r, 400));
      router.push(`/record/${data.record_id}`);

    } catch (err) {
      await animPromise;
      const msg = err.message || String(err);
      const isOffline = msg.includes('fetch') || msg.includes('Failed') || msg.includes('NetworkError') || msg.includes('ECONNREFUSED');
      setBackendDown(isOffline);
      setError(isOffline
        ? 'Backend not running. Start it with: uvicorn backend.main:app --reload --port 8000'
        : msg
      );
      setProcessing(false);
      setCurrentStep(-1);
      setCompletedSteps([]);
    }
  };

  const runDemoCase = async (targetId) => {
    setProcessing(true);
    setCurrentStep(0);
    setCompletedSteps([]);
    setError(null);
    await animateSteps(4);
    await new Promise(r => setTimeout(r, 400));
    router.push(`/record/${targetId}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#060e1e' }}>
      <Navbar />

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full ambient-animate" style={{ width: 350, height: 350, background: 'radial-gradient(circle, rgba(37,99,235,0.06), transparent 65%)', top: '20%', left: '18%', filter: 'blur(60px)' }} />
        <div className="absolute rounded-full ambient-animate" style={{ width: 280, height: 280, background: 'radial-gradient(circle, rgba(6,214,242,0.05), transparent 65%)', bottom: '25%', right: '18%', filter: 'blur(60px)', animationDelay: '7s' }} />
      </div>

      <main className="relative z-10 pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-4xl font-black mb-2 text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            Document Ingestion
          </h1>
          <p style={{ color: '#94a3b8' }}>Upload a real health record PDF or pick a demo case — the AI pipeline extracts every clinical code.</p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl flex items-start gap-3"
            style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)' }}>
            {backendDown ? <WifiOff size={16} style={{ color: '#fb7185' }} className="flex-shrink-0 mt-0.5" /> : <AlertCircle size={16} style={{ color: '#fb7185' }} className="flex-shrink-0 mt-0.5" />}
            <div>
              <p className="text-sm font-semibold" style={{ color: '#fda4af' }}>{backendDown ? 'Backend offline' : 'Processing failed'}</p>
              <p className="text-xs mt-1 font-mono" style={{ color: 'rgba(251,113,133,0.7)' }}>{error}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 animate-fade-in-up stagger-2">
          {/* Upload Zone */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#64748b' }}>Upload Real Document</h2>

            <div
              className="rounded-2xl p-10 text-center cursor-pointer transition-all"
              style={{
                border: `2px dashed ${dragging ? 'rgba(59,130,246,0.7)' : 'rgba(59,130,246,0.3)'}`,
                background: dragging ? 'rgba(37,99,235,0.06)' : 'transparent',
              }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => !processing && fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.tiff,.txt" onChange={handleFileChange} />
              {selectedFile ? (
                <div className="space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(6,214,242,0.1))', border: '1px solid rgba(59,130,246,0.3)' }}>
                    <FileText size={24} style={{ color: '#60a5fa' }} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">{selectedFile.name}</p>
                    <p className="text-xs font-mono mt-1" style={{ color: '#64748b' }}>
                      {selectedFile.type || 'document'} · {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  {!processing && (
                    <button onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setError(null); }}
                      className="inline-flex items-center gap-1 text-xs hover:text-red-400 transition-colors" style={{ color: '#64748b' }}>
                      <X size={12} /> Remove
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <UploadCloud size={40} className="mx-auto" style={{ color: 'rgba(59,130,246,0.5)' }} />
                  <div>
                    <p className="font-semibold text-slate-300 mb-1">Drop your medical PDF here</p>
                    <p className="text-sm" style={{ color: '#64748b' }}>Lab report · Hospital bill · Discharge summary</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['PDF', 'PNG', 'JPG', 'TIFF', 'TXT'].map(t => (
                      <span key={t} className="text-xs font-mono px-2 py-1 rounded"
                        style={{ background: 'rgba(59,130,246,0.06)', color: '#64748b', border: '1px solid rgba(59,130,246,0.12)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedFile && !processing && (
              <button
                onClick={processRealFile}
                className="btn-primary w-full mt-4 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
              >
                <UploadCloud size={16} /> Process Real PDF with AI <ChevronRight size={16} />
              </button>
            )}

            {/* Info card */}
            <div className="mt-6 rounded-xl p-4 glass-card">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#64748b' }}>What gets extracted</p>
              <div className="space-y-2">
                {[
                  { dot: '#06d6f2', label: 'ICD-10-CM', desc: 'Diagnoses & conditions' },
                  { dot: '#a78bfa', label: 'CPT Codes', desc: 'Procedures & surgeries' },
                  { dot: '#34d399', label: 'RxNorm', desc: 'Medications & doses' },
                  { dot: '#fbbf24', label: 'LOINC', desc: 'Lab tests & vitals' },
                ].map(({ dot, label, desc }) => (
                  <div key={label} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot, boxShadow: `0 0 6px ${dot}40` }} />
                    <span className="text-slate-300 font-mono text-xs font-medium">{label}</span>
                    <span className="text-xs" style={{ color: '#475569' }}>— {desc}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 text-xs" style={{ borderTop: '1px solid rgba(59,130,246,0.08)', color: '#475569' }}>
                ⚠️ Needs backend running on <span className="font-mono" style={{ color: '#64748b' }}>localhost:8000</span>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div>
            {!processing ? (
              <>
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#64748b' }}>Or Try a Demo Case</h2>
                <div className="space-y-3">
                  {demoRecords.map((rec) => (
                    <button
                      key={rec.id}
                      onClick={() => runDemoCase(rec.id)}
                      className="w-full text-left rounded-xl p-4 transition-all card-hover glass-card"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0">
                          {rec.type === 'lab_report' ? '🧪' : rec.type === 'hospital_bill' ? '🏥' : '📋'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-200 text-sm">{rec.title}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{rec.patient.name} · {rec.document.source}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {rec.extracted.diagnoses.slice(0, 2).map(d => (
                              <span key={d.code} className="tag-icd text-xs px-1.5 py-0.5 rounded font-mono">{d.code}</span>
                            ))}
                            <span className="text-xs font-mono" style={{ color: '#475569' }}>{rec.document.pages}pp · {rec.processingTime}</span>
                          </div>
                        </div>
                        <ChevronRight size={16} style={{ color: '#475569' }} className="flex-shrink-0 mt-1 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-center mt-4" style={{ color: '#475569' }}>Demo cases work offline — no backend needed</p>
              </>
            ) : (
              <>
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#64748b' }}>AI Pipeline Running</h2>
                <div className="space-y-2">
                  {pipelineSteps.map((step, idx) => {
                    const done = completedSteps.includes(idx);
                    const active = currentStep === idx && !done;
                    return (
                      <div key={step.id} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                        style={{
                          background: done ? 'rgba(16,185,129,0.06)' : active ? 'rgba(59,130,246,0.08)' : 'rgba(15,29,56,0.4)',
                          border: `1px solid ${done ? 'rgba(16,185,129,0.25)' : active ? 'rgba(59,130,246,0.35)' : 'rgba(59,130,246,0.06)'}`,
                          opacity: !done && !active ? 0.4 : 1,
                          animation: active ? 'pipePulse 1.8s ease-in-out infinite' : 'none',
                        }}>
                        <div className="text-lg w-7 text-center">{step.icon}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: done ? '#86efac' : active ? '#93c5fd' : '#94a3b8' }}>{step.label}</p>
                          <p className="text-xs" style={{ color: '#475569' }}>{done ? 'Complete' : active ? statusMsg : step.desc}</p>
                        </div>
                        {done
                          ? <CheckCircle size={16} style={{ color: '#34d399' }} className="flex-shrink-0" />
                          : active
                          ? <Loader size={16} style={{ color: '#60a5fa' }} className="flex-shrink-0 animate-spin" />
                          : <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ border: '1px solid #1a3768' }} />
                        }
                      </div>
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div className="mt-4 rounded-xl p-4" style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <div className="flex justify-between text-xs font-mono mb-2" style={{ color: '#64748b' }}>
                    <span>{statusMsg || 'Initialising…'}</span>
                    <span>{completedSteps.length}/{pipelineSteps.length}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#142a4e' }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(completedSteps.length / pipelineSteps.length) * 100}%`, background: 'linear-gradient(90deg, #2563eb, #06b6d4)' }} />
                  </div>
                </div>

                {selectedFile && (
                  <div className="mt-3 text-xs text-center font-mono" style={{ color: '#475569' }}>
                    Processing: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <style>{`
        @keyframes pipePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.3); }
          50% { box-shadow: 0 0 0 6px rgba(59,130,246,0); }
        }
      `}</style>
    </div>
  );
}
