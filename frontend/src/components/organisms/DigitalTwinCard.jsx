import React from 'react'
import Button from '@/components/atoms/Button'
import CityViewer3D from '@/features/3d/CityViewer3D'

export default function DigitalTwinCard() {
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-[#07110a] shadow-[0_20px_45px_rgba(0,0,0,0.2)] border border-black/20">
      <div className="absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full bg-[#0b5a17]/20 blur-[90px] pointer-events-none" />
      <div className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#005312] text-white shadow-lg">
        <span className="material-symbols-outlined text-[18px]">sync</span>
      </div>
      <div className="grid grid-cols-1 gap-6 p-6 relative z-10 lg:grid-cols-[1.05fr_0.95fr] lg:p-8 lg:items-center">
        <div className="space-y-6">
          <h2 className="text-[34px] sm:text-[40px] font-bold leading-tight text-[#acf4a4] lg:text-[44px]">
            Interactive Digital Twin
          </h2>
          <p className="max-w-xl text-[13px] sm:text-[14px] leading-5 text-white/70">
            Experience the city like never before. Our 3D infrastructure model allows you to zoom, rotate, and interact with live sensor data in a fully immersive environment. Track building health, utility networks, and environmental metrics in real-time.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button to="/digital-twin" variant="primary" className="px-4 py-2.5 text-[13px] rounded-[8px] shadow-none">Initialize View</Button>
            <Button to="/digital-twin/info" variant="ghost" className="px-4 py-2.5 text-[13px] rounded-[8px] border border-white/10 bg-transparent text-white/90 hover:bg-white/5">Learn More</Button>
          </div>
        </div>

        <div className="relative h-[360px] w-full overflow-hidden rounded-[16px] bg-[#111111] border border-white/10 lg:h-[420px]">
          <CityViewer3D className="h-full w-full rounded-none border-0 bg-transparent" />
        </div>
      </div>
    </div>
  )
}
