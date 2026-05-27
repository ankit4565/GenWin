import React from 'react'

export default function MetricCard({ title, value, hint, variant = 'neutral', badge, icon, delta }) {
  const borderMap = {
    neutral: { border: '#0f7760', shadow: '0_12px_30px_rgba(15,119,96,0.04)', tint: '#dff6ef' },
    success: { border: '#055f18', shadow: '0_12px_30px_rgba(5,95,24,0.04)', tint: '#e7f7ea' },
    danger: { border: '#ba1a1a', shadow: '0_12px_30px_rgba(186,26,26,0.04)', tint: '#fff0f0' },
    info: { border: '#00629e', shadow: '0_12px_30px_rgba(0,98,158,0.04)', tint: '#eaf6ff' },
  }

  const v = borderMap[variant] || borderMap.neutral

  return (
    <div className="relative rounded-[12px] bg-white/95 p-4 backdrop-blur-[1px] transition-all duration-200 hover:-translate-y-[1px]" style={{ border: `1.5px solid ${v.border}`, boxShadow: `${v.shadow.replaceAll('_', ' ')}` }}>
      {badge && (
        <div className={`absolute right-4 top-3 text-[12px] font-medium`} style={{ color: v.border }}>
          {badge}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-md flex items-center justify-center" style={{ background: v.tint }}>
            {typeof icon === 'string' ? (
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: v.border }}>{icon}</span>
            ) : (
              icon || null
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#41493e]">{title}</div>
      <div className="mt-2 flex items-center gap-3">
        <div className="text-[34px] font-extrabold text-[#071e27] lg:text-[40px]">{value}</div>
        {delta && <div className="text-[13px] font-semibold" style={{ color: '#ba1a1a' }}>{delta}</div>}
      </div>

      {hint && <div className="mt-3 text-[13px] text-[#6b746b]">{hint}</div>}
    </div>
  )
}
