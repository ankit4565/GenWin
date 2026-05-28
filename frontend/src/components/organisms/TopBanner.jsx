import React from 'react'

export default function TopBanner() {
  return (
    <div className="sticky top-0 z-[60] w-full overflow-hidden whitespace-nowrap bg-[#00450d] px-4 py-2 text-center text-[12px] font-medium text-white">
      <div className="flex items-center gap-12 animate-marquee">
        <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px]">campaign</span> <strong>EMERGENCY:</strong> Flood alert in Zone 4. Citizens are advised to avoid waterlogging-prone areas.</span>
        <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px]">info</span> New Smart Meter installations starting next week in Arera Colony.</span>
        <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px]">celebration</span> Bhopal achieves "Cleanest State Capital" award for the 3rd consecutive year.</span>
      </div>
    </div>
  )
}
