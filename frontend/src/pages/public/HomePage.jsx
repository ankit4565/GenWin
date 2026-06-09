import { useEffect, useRef, useState } from 'react'
import NavBar from '@/components/organisms/NavBar'
import TopBanner from '@/components/organisms/TopBanner'
import DigitalTwinCard from '@/components/organisms/DigitalTwinCard'
import AnnouncementCard from '@/components/molecules/AnnouncementCard'
import MetricCard from '@/components/molecules/MetricCard'
import Button from '@/components/atoms/Button'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { ArrowRight, MapPinned, MessageSquareText, TriangleAlert, Share2, Mail } from 'lucide-react'
import heroImg from '@/assets/maxresdefault.jpg'
import lakeimg from '@/assets/lakeview.jpg'
import CityMap from '@/features/map/CityMap'

/* ─────────────────────────────────────────
   Shared animation utilities
───────────────────────────────────────── */

/**
 * useInView – fires once when element enters viewport.
 * Returns [ref, isVisible].
 */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/** Wraps any element with scroll-triggered fade + slide. */
function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
  const [ref, visible] = useInView()
  const translate = direction === 'up' ? 'translateY(32px)' : direction === 'left' ? 'translateX(-32px)' : 'translateX(32px)'
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : translate,
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/** 3-D tilt card on mouse move. */
function TiltCard({ children, className = '', style = {} }) {
  const ref = useRef(null)
  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14
    el.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.025,1.025,1.025)`
    el.style.boxShadow = `${-x * 2}px ${y * 2}px 40px rgba(0,69,13,0.13)`
  }
  const handleLeave = (e) => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    el.style.boxShadow = ''
  }
  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s', willChange: 'transform', ...style }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  )
}

/** Floating particle canvas for hero. */
function ParticleCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const W = () => canvas.width = canvas.offsetWidth
    const H = () => canvas.height = canvas.offsetHeight
    W(); H()
    const resize = () => { W(); H() }
    window.addEventListener('resize', resize)

    const count = 48
    const dots = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.4 + 0.1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy
        if (d.x < 0) d.x = canvas.width
        if (d.x > canvas.width) d.x = 0
        if (d.y < 0) d.y = canvas.height
        if (d.y > canvas.height) d.y = 0
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,83,18,${d.alpha})`
        ctx.fill()
      })
      // draw connecting lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.strokeStyle = `rgba(0,83,18,${(1 - dist / 120) * 0.12})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf) }
  }, [])
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />
}

/** Animated counter that counts up when visible. */
function CountUp({ target, suffix = '' }) {
  const [ref, visible] = useInView(0.5)
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!visible) return
    const isNum = typeof target === 'number'
    if (!isNum) { setVal(target); return }
    let start = 0
    const step = target / 40
    const id = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(id) }
      else setVal(Math.floor(start))
    }, 30)
    return () => clearInterval(id)
  }, [visible, target])
  return <span ref={ref}>{typeof target === 'number' ? val.toLocaleString() : val}{suffix}</span>
}

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const announcements = [
  {
    tag: 'Sustainability',
    title: 'Upper Lake conservation project phase 3 begins next month.',
    excerpt: 'New filtration systems and bio-remediation zones will be added to preserve biodiversity.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  },
  {
    tag: 'Innovation',
    title: 'Bhopal Digital Twin achieves 99.9% uptime for traffic sensors.',
    excerpt: 'Enhanced infrastructure allows near-instantaneous rerouting of public transport during peak hours.',
    image: heroImg,
  },
  {
    tag: 'Public Service',
    title: 'New Citizen First portal integrated for grievance tracking.',
    excerpt: 'Track your reports from submission to resolution with photo-proof documentation.',
    image: heroImg,
  },
]

/* ─────────────────────────────────────────
   Global CSS (injected once)
───────────────────────────────────────── */
const GLOBAL_CSS = `
  @keyframes heroFadeUp   { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:none } }
  @keyframes badgePop     { from { opacity:0; transform:scale(0.85) } to { opacity:1; transform:scale(1) } }
  @keyframes floatY       { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-10px) } }
  @keyframes shimmer      { 0% { background-position:200% 0 } 100% { background-position:-200% 0 } }
  @keyframes rotateGlobe  { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
  @keyframes pulseRing    { 0%,100% { box-shadow:0 0 0 0 rgba(0,83,18,0.25) } 60% { box-shadow:0 0 0 10px rgba(0,83,18,0) } }
  @keyframes scanline     { 0% { top:-4px } 100% { top:100% } }
  @keyframes gradShift    { 0%,100% { background-position:0% 50% } 50% { background-position:100% 50% } }
  @keyframes meteors      { 0% { opacity:0; transform:translate(0,0) rotate(-45deg) scaleX(0.3) }
                            20% { opacity:1 }
                            100% { opacity:0; transform:translate(-600px,300px) rotate(-45deg) scaleX(1) } }

  .hero-badge   { animation: badgePop 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both }
  .hero-h1      { animation: heroFadeUp 0.7s 0.2s cubic-bezier(0.22,1,0.36,1) both }
  .hero-p       { animation: heroFadeUp 0.7s 0.35s cubic-bezier(0.22,1,0.36,1) both }
  .hero-btns    { animation: heroFadeUp 0.7s 0.48s cubic-bezier(0.22,1,0.36,1) both }
  .hero-metrics { animation: heroFadeUp 0.7s 0.55s cubic-bezier(0.22,1,0.36,1) both }

  .metric-tilt  { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s; will-change: transform; }

  .shimmer-text {
    background: linear-gradient(90deg, #071e27 30%, #00450d 50%, #071e27 70%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  .announcement-card-wrap {
    transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s;
    will-change: transform;
  }
  .announcement-card-wrap:hover {
    transform: translateY(-6px) scale(1.015);
    box-shadow: 0 20px 60px rgba(0,69,13,0.13);
  }

  .stat-bar-fill {
    transform-origin: left;
    animation: scaleX 1.2s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes scaleX { from { transform:scaleX(0) } to { transform:scaleX(1) } }

  .btn-glow:hover {
    box-shadow: 0 0 20px rgba(0,69,13,0.35), 0 4px 16px rgba(0,0,0,0.12);
    transform: translateY(-2px);
  }
  .btn-glow { transition: box-shadow 0.25s, transform 0.25s; }

  .floating { animation: floatY 5s ease-in-out infinite; }

  .section-title-line::after {
    content: '';
    display: block;
    width: 48px;
    height: 3px;
    background: linear-gradient(90deg, #00450d, #91d78a);
    border-radius: 999px;
    margin: 10px auto 0;
  }

  .grid-bg {
    background-image:
      linear-gradient(rgba(0,83,18,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,83,18,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }
`

function GlobalStyles() {
  return <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
}

/* ─────────────────────────────────────────
   Stat strip
───────────────────────────────────────── */
const stats = [
  { label: 'Citizens Served', value: 1400000, suffix: '+' },
  { label: 'Sensors Online', value: 3820, suffix: '' },
  { label: 'Avg Resolution', value: 72, suffix: 'h' },
  { label: 'Uptime', value: 99.9, suffix: '%' },
]

function StatStrip() {
  const [ref, visible] = useInView(0.2)
  return (
    <div ref={ref} className="relative overflow-hidden border-y border-slate-200/60 bg-white/60 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(20px)',
                transition: `opacity 0.6s ${i * 100}ms, transform 0.6s ${i * 100}ms`,
              }}
              className="text-center"
            >
              <div className="font-['Hanken_Grotesk'] text-3xl font-bold tracking-tight text-[#00450d]">
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">{s.label}</div>
              <div className="mx-auto mt-2 h-0.5 w-8 rounded-full bg-gradient-to-r from-[#00450d] to-[#91d78a]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   HomePage
───────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#eaf7ff] text-slate-900">
      <GlobalStyles />
      <TopBanner />
      <NavBar />

      <main>
        {/* ── HERO ── */}
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-[#eef8fd] to-[#eaf7ff] grid-bg">
          {/* Particle mesh */}
          <ParticleCanvas />

          {/* Lake background */}
          <div
            className="absolute inset-0 pointer-events-none bg-cover bg-center bg-no-repeat opacity-[0.26] lg:bg-[position:60%_top] lg:opacity-[0.55]"
            style={{ backgroundImage: `url(${lakeimg})` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(127deg,rgba(66,66,66,0.01),rgba(34,34,34,0.02)),radial-gradient(circle_at_top,rgba(215,203,203,0.01),transparent_95%)]" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(145,152,155,0.7),transparent_30%)]" />

          {/* Floating orbs */}
          <div style={{ position: 'absolute', top: '15%', right: '8%', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(145,215,138,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} className="floating" />
          <div style={{ position: 'absolute', bottom: '20%', left: '3%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,98,158,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1, animationDelay: '2s' }} className="floating" />

          <div className="relative z-10 container mx-auto px-4 py-12 lg:px-6 lg:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
              <div>
                {/* Live badge */}
                <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-[#c7d7c4] bg-[#dbead8]/90 px-3 py-1 text-xs font-medium text-[#41493e] shadow-sm backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-[#005312] shadow-[0_0_0_3px_rgba(0,83,18,0.12)]" style={{ animation: 'pulseRing 2s ease-in-out infinite' }} />
                  Bhopal City Live Status
                </div>

                <h1 className="hero-h1 mt-5 max-w-2xl text-[34px] font-extrabold leading-[1.08] tracking-tight sm:text-[42px] lg:text-[52px]">
                  <span className="block text-[#071e27]">
                    A Visionary Lens Into{' '}
                    <span className="shimmer-text">Bhopal's</span>
                  </span>
                  <span className="block text-primary">Digital Future.</span>
                </h1>

                <p className="hero-p mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                  Monitor infrastructure, traffic, and environmental metrics in real-time. GenWin is the authoritative platform for citizen transparency and municipal efficiency.
                </p>

                <div className="hero-btns mt-8 flex flex-wrap gap-3">
                  <span className="btn-glow">
                    <Button to="/grievance/submit" variant="primary" icon={<TriangleAlert size={18} strokeWidth={2.3} />}>
                      Report Issue
                    </Button>
                  </span>
                  <span className="btn-glow">
                    <Button to="/map" variant="secondary" icon={<MapPinned size={18} strokeWidth={2.3} />}>
                      View Map
                    </Button>
                  </span>
                  <span className="btn-glow">
                    <Button to="/chatbot" variant="ghost" icon={<MessageSquareText size={18} strokeWidth={2.3} />}>
                      Chatbot
                    </Button>
                  </span>
                </div>
              </div>

              {/* Metric cards – 3D tilt */}
              <div className="hero-metrics grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                {[
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="#00629e"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 8l8 8" /></svg>,
                    title: 'Traffic Index', value: '42', hint: 'Average congestion across 12 zones.', badge: 'Real-time', variant: 'info', delta: '↑ 12%',
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#ba1a1a" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4l9 16H3L12 4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 16h.01" /></svg>,
                    title: 'Active Alerts', value: '03', hint: 'Waterlogging and power maintenance.', badge: 'Critical', variant: 'danger',
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#00450d" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M7 13l3 3 7-7" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 19h16" /></svg>,
                    title: 'Open Cases', value: '1,248', hint: '85% resolution rate this month.', badge: 'Public', variant: 'success',
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 0116 0" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8" /></svg>,
                    title: 'Flood Risk', value: 'Low', hint: 'Monitoring Upper Lake levels hourly.', badge: 'Normal', variant: 'neutral',
                  },
                ].map((m, i) => (
                  <TiltCard key={m.title} style={{ animationDelay: `${0.55 + i * 0.08}s` }}>
                    <MetricCard {...m} />
                  </TiltCard>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-white/70 pointer-events-none z-10" />
        </section>

        {/* ── STAT STRIP ── */}
        <StatStrip />

        {/* ── DIGITAL TWIN SECTION ── */}
        <section className="container mx-auto px-6 py-16 lg:px-12 lg:py-24">
          <Reveal>
            <DigitalTwinCard />
          </Reveal>
        </section>

        {/* ── MAP SECTION ── */}
        <section className="bg-gradient-to-b from-[#eaf7ff] to-[#d7e9f3]">
          <ContainerScroll
            titleComponent={
              <Reveal>
                <>
                  <h2 className="text-3xl font-semibold tracking-tight text-[#071e27] md:text-5xl section-title-line">
                    Interactive City Map
                  </h2>
                  <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                    Explore Bhopal's infrastructure layers. Toggle between traffic density, flood risk zones, and municipal waste collection routes in a single interface.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <span className="btn-glow">
                      <Button to="/map" variant="ghost">Launch Full Map <ArrowRight size={16} /></Button>
                    </span>
                  </div>
                </>
              </Reveal>
            }
          >
            <div className="mx-auto h-full w-full rounded-2xl overflow-hidden" style={{ boxShadow: '0 40px 100px rgba(0,69,13,0.15), 0 0 0 1px rgba(0,69,13,0.07)' }}>
              <CityMap allowZoom={false} />
            </div>
          </ContainerScroll>
        </section>

        {/* ── ANNOUNCEMENTS ── */}
        <section className="bg-white/70 backdrop-blur-[2px]">
          <div className="container mx-auto px-4 py-10 lg:px-6 lg:py-14">
            <Reveal>
              <div className="text-center">
                <h2 className="text-2xl font-semibold tracking-tight section-title-line">City Announcements</h2>
                <p className="mt-2 text-sm text-slate-500">Stay updated with the latest from the Smart City Commission.</p>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {announcements.map((item, i) => (
                <Reveal key={item.title} delay={i * 100} direction="up">
                  <div className="announcement-card-wrap h-full">
                    <AnnouncementCard {...item} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-slate-200 bg-[#dbeef8]">
          <div className="container mx-auto flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-start sm:justify-between">
            <Reveal direction="left">
              <div>
                <div className="text-lg font-semibold">GenWin</div>
                <p className="mt-2 max-w-sm text-sm text-slate-600">
                  The official digital twin and smart city management platform for the city of Bhopal.
                </p>
                <p className="mt-4 text-xs text-slate-500">© 2026 Bhopal Smart City Development Corporation Ltd.</p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                  <div className="font-semibold uppercase tracking-wide text-slate-500 text-xs">Platform</div>
                  <ul className="mt-3 space-y-2 text-slate-700">
                    <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                    <li><a href="#" className="hover:underline">Terms of Service</a></li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold uppercase tracking-wide text-slate-500 text-xs">Support</div>
                  <ul className="mt-3 space-y-2 text-slate-700">
                    <li><a href="#" className="hover:underline">Emergency Contacts</a></li>
                    <li><a href="#" className="hover:underline">Grievance Portal</a></li>
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right" delay={150}>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                {[{ icon: <Share2 size={16} />, label: 'Share' }, { icon: <Mail size={16} />, label: 'Mail' }].map(b => (
                  <button
                    key={b.label}
                    type="button"
                    aria-label={b.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/50 text-slate-600 shadow-sm transition hover:bg-white btn-glow"
                  >
                    {b.icon}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        </footer>
      </main>
    </div>
  )
}