'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CodeTag from './CodeTag';
import { docTypeLabels } from '@/lib/demoData';

export default function NoteCard({ record }) {
  const typeInfo = docTypeLabels[record.type] || { label: 'Document', color: 'text-slate-400' };
  const totalCodes =
    (record.extracted?.diagnoses?.length || 0) +
    (record.extracted?.procedures?.length || 0) +
    (record.extracted?.medications?.length || 0) +
    (record.extracted?.labValues?.length || 0);

  return (
    <Link href={`/record/${record.id}`} className="group block">
      <div className="glass-card rounded-2xl p-5 border border-white/5 hover:border-violet-500/40 transition-all h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">
              {record.type === 'lab_report' ? '🧪' : record.type === 'hospital_bill' ? '🏥' : '📋'}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-200 leading-snug" style={{ fontFamily: 'Syne, sans-serif' }}>
                {record.title}
              </p>
              <p className={`text-xs ${typeInfo.color}`}>{typeInfo.label}</p>
            </div>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono flex-shrink-0 ${
            record.billing?.claimsStatus === 'approved' ? 'badge-done' :
            record.billing?.claimsStatus === 'submitted' ? 'badge-processing' :
            'badge-pending'
          }`}>
            {record.billing?.claimsStatus || 'pending'}
          </span>
        </div>

        {/* Patient + source */}
        <div className="text-xs text-slate-500 mb-3 space-y-0.5">
          <p>{record.patient?.name}, {record.patient?.age}y · {record.patient?.gender}</p>
          <p className="truncate">{record.document?.source}</p>
          <p className="font-mono text-slate-600">{record.document?.date}</p>
        </div>

        {/* Code tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {record.extracted?.diagnoses?.slice(0, 2).map((d) => (
            <CodeTag key={d.code} system="ICD-10-CM" code={d.code} size="xs" />
          ))}
          {record.extracted?.procedures?.slice(0, 1).map((p) => (
            <CodeTag key={p.code} system="CPT" code={p.code} size="xs" />
          ))}
          {record.extracted?.medications?.slice(0, 1).map((m) => (
            <CodeTag key={m.code} system="RxNorm" code={m.code} size="xs" />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs border-t border-white/5 pt-3">
          <div className="flex items-center gap-3 text-slate-600">
            <span className="font-mono">{totalCodes} codes</span>
            <span className={record.confidence > 95 ? 'text-green-400' : 'text-amber-400'}>
              {record.confidence}% confidence
            </span>
          </div>
          <span className="flex items-center gap-1 text-violet-400 group-hover:gap-2 transition-all">
            View <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </Link>
  );
}
