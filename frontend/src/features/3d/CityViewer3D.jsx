import React, { useEffect, useRef } from 'react'

const SPLINE_SCRIPT_ID = 'spline-viewer-script'
const SPLINE_URL = 'https://unpkg.com/@splinetool/viewer@1.9.5/build/spline-viewer.js'
const SPLINE_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

function ensureSplineScript() {
  if (document.getElementById(SPLINE_SCRIPT_ID)) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = SPLINE_SCRIPT_ID
    script.type = 'module'
    script.src = SPLINE_URL
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export default function CityViewer3D({ className = '' }) {
  const mountedRef = useRef(false)

  useEffect(() => {
    if (mountedRef.current) return undefined
    mountedRef.current = true
    ensureSplineScript().catch(() => {})
    return undefined
  }, [])

  return (
    <div className={`h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 ${className}`}>
      <spline-viewer url={SPLINE_SCENE} className="h-full w-full" />
    </div>
  )
}
