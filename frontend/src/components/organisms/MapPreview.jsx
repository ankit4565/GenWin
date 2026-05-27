import React from 'react'

export default function MapPreview({ image }) {
  return (
    <div className="rounded-[24px] border border-white/40 bg-[#d9edf7]/95 p-5 shadow-[0_22px_48px_rgba(0,0,0,0.09)] backdrop-blur-sm sm:p-6">
      <div className="relative overflow-hidden rounded-[18px] border border-sky-100 bg-[#101715]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(39,201,176,0.45),transparent_22%),radial-gradient(circle_at_48%_52%,rgba(70,245,217,0.22),transparent_40%),linear-gradient(135deg,rgba(0,0,0,0.8),rgba(5,29,28,0.95))]" />
        <img src={image} alt="map preview" className="relative h-[340px] w-full object-cover opacity-90 mix-blend-screen sm:h-[420px]" />
        <div className="absolute bottom-4 left-4 max-w-[210px] rounded-[8px] border border-black/5 bg-[#d9d9d9]/95 px-3 py-2 text-sm shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#005312] text-white">
              <span className="material-symbols-outlined text-[16px]">sensors</span>
            </div>
            <div>
              <div className="font-medium text-slate-800 text-[13px]">Live Sensor Data</div>
              <div className="text-[10px] text-slate-600">450+ nodes currently reporting live.</div>
            </div>
          </div>
        </div>
        <div className="absolute right-4 top-4 w-[150px] rounded-[8px] border border-black/5 bg-[#d9d9d9]/95 px-3 py-2 text-xs text-slate-700 shadow-lg backdrop-blur-sm">
          <div className="font-semibold uppercase tracking-wide text-[10px] text-slate-500">Layer Controls</div>
          <div className="mt-1 space-y-1 text-[11px]">
            <div className="flex items-center justify-between gap-2"><span>Traffic Flow</span><span className="inline-flex h-4 w-8 items-center rounded-full bg-[#005312]/10 px-0.5"><span className="h-3 w-3 rounded-full bg-[#005312] ml-auto" /></span></div>
            <div className="flex items-center justify-between gap-2"><span>CCTV Live</span><span className="inline-flex h-4 w-8 items-center rounded-full bg-white px-0.5"><span className="h-3 w-3 rounded-full bg-[#8a9a8b]" /></span></div>
            <div className="flex items-center justify-between gap-2"><span>Waste Routes</span><span className="inline-flex h-4 w-8 items-center rounded-full bg-[#005312]/10 px-0.5"><span className="h-3 w-3 rounded-full bg-[#005312] ml-auto" /></span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
