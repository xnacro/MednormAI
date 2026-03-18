'use client';

const SYSTEM_STYLES = {
  'ICD-10-CM': 'tag-icd',
  'CPT':       'tag-cpt',
  'RxNorm':    'tag-rx',
  'LOINC':     'tag-loinc',
};

const SYSTEM_LABELS = {
  'ICD-10-CM': 'ICD',
  'CPT':       'CPT',
  'RxNorm':    'Rx',
  'LOINC':     'LOINC',
};

/**
 * Renders a colour-coded pill for a clinical code.
 * <CodeTag system="ICD-10-CM" code="E11.9" label="T2DM" />
 */
export default function CodeTag({ system, code, label, showSystem = false, size = 'sm' }) {
  const cls = SYSTEM_STYLES[system] || 'glass-card text-slate-300 border border-white/10';
  const sysLabel = SYSTEM_LABELS[system] || system;
  const textSize = size === 'xs' ? 'text-xs' : 'text-xs sm:text-sm';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono ${cls} ${textSize}`}>
      {showSystem && <span className="opacity-60 text-xs">{sysLabel}·</span>}
      <span>{code}</span>
      {label && <span className="hidden sm:inline opacity-70 truncate max-w-32">— {label}</span>}
    </span>
  );
}
