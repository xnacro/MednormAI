'use client';

export default function StatsCard({ label, value, icon: Icon, color = 'text-violet-400', sub, trend }) {
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">{label}</span>
        {Icon && <Icon size={16} className={color} />}
      </div>
      <div>
        <div className={`text-3xl font-black leading-none mb-1 ${color}`} style={{ fontFamily: 'Syne, sans-serif' }}>
          {value}
        </div>
        {sub && <div className="text-xs text-slate-600">{sub}</div>}
      </div>
      {trend != null && (
        <div className={`text-xs font-mono ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
        </div>
      )}
    </div>
  );
}
