'use client';
import { CheckCircle, Loader, Circle } from 'lucide-react';
import { pipelineSteps } from '@/lib/demoData';

/**
 * Animated pipeline progress component.
 * Props:
 *   currentStep: index of the active step (-1 = not started)
 *   completedSteps: array of completed step indices
 *   compact: show compact horizontal version
 */
export default function PipelineProgress({ currentStep = -1, completedSteps = [], compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {pipelineSteps.map((step, idx) => {
          const done = completedSteps.includes(idx);
          const active = currentStep === idx && !done;
          return (
            <div key={step.id} className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                done ? 'bg-green-500/20 border border-green-500/40' :
                active ? 'bg-cyan-500/20 border border-cyan-500/50 pipeline-step-active' :
                'bg-white/5 border border-white/10'
              }`}>
                {done ? <CheckCircle size={12} className="text-green-400" /> :
                 active ? <Loader size={12} className="text-cyan-400 animate-spin" /> :
                 <span className="text-slate-600 text-xs">{idx + 1}</span>}
              </div>
              {idx < pipelineSteps.length - 1 && (
                <div className={`w-4 h-px transition-all ${done ? 'bg-green-500/40' : 'bg-white/10'}`} />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {pipelineSteps.map((step, idx) => {
        const done = completedSteps.includes(idx);
        const active = currentStep === idx && !done;
        const pending = !done && !active;

        return (
          <div
            key={step.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
              done ? 'bg-green-500/5 border-green-500/25' :
              active ? 'bg-cyan-500/8 border-cyan-500/35 pipeline-step-active' :
              'bg-white/2 border-white/5 opacity-40'
            }`}
          >
            {/* Icon */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base ${
              done ? 'bg-green-500/15' : active ? 'bg-cyan-500/15' : 'bg-white/5'
            }`}>
              {step.icon}
            </div>

            {/* Label + desc */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${done ? 'text-green-300' : active ? 'text-cyan-300' : 'text-slate-400'}`}>
                {step.label}
              </p>
              <p className="text-xs text-slate-600 truncate">{step.desc}</p>
            </div>

            {/* Status icon */}
            <div className="flex-shrink-0">
              {done ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : active ? (
                <Loader size={16} className="text-cyan-400 animate-spin" />
              ) : (
                <Circle size={16} className="text-slate-700" />
              )}
            </div>
          </div>
        );
      })}

      {/* Progress bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-mono">
          <span>Pipeline progress</span>
          <span>{completedSteps.length}/{pipelineSteps.length}</span>
        </div>
        <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full transition-all duration-700"
            style={{ width: `${(completedSteps.length / pipelineSteps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
