import NavBar from '@/components/organisms/NavBar'
import TopBanner from '@/components/organisms/TopBanner'
import DigitalTwinCard from '@/components/organisms/DigitalTwinCard'
import AnnouncementCard from '@/components/molecules/AnnouncementCard'
import MetricCard from '@/components/molecules/MetricCard'
import Button from '@/components/atoms/Button'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { ArrowRight, MapPinned, MessageSquareText, TriangleAlert, Share2, Mail } from 'lucide-react'
import heroImg from '@/assets/maxresdefault.jpg'
import lakeimg  from '@/assets/lakeview.jpg'
import CityMap from '@/features/map/CityMap'

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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#eaf7ff] text-slate-900">
      <TopBanner />
      <NavBar />

      <main>
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-[#eef8fd] to-[#eaf7ff]">
          {/* hero background image on the right */}
          <div
            className="absolute inset-0 pointer-events-none bg-cover bg-center bg-no-repeat opacity-[0.26] lg:bg-[position:60%_top] lg:opacity-[0.55]"
            style={{ backgroundImage: `url(${lakeimg})` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(127deg,rgba(66,66,66,0.01),rgba(34,34,34,0.02)),radial-gradient(circle_at_top,rgba(215,203,203,0.01),transparent_95%)]" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(145, 152, 155, 0.7),transparent_30%)]" />
          <div className="relative container mx-auto px-4 py-12 lg:px-6 lg:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#c7d7c4] bg-[#dbead8]/90 px-3 py-1 text-xs font-medium text-[#41493e] shadow-sm backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-[#005312] shadow-[0_0_0_3px_rgba(0,83,18,0.12)]" />
                  Bhopal City Live Status
                </div>

                <h1 className="mt-5 max-w-2xl text-[34px] font-extrabold leading-[1.08] tracking-tight sm:text-[42px] lg:text-[52px] display-lg">
                  <span className="block text-[#071e27]">A Visionary Lens Into <span className="text-primary">Bhopal's</span></span>
                  <span className="block text-primary">Digital Future.</span>
                </h1>

                <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                  Monitor infrastructure, traffic, and environmental metrics in real-time. Bhopal Twin is the authoritative platform for citizen transparency and municipal efficiency.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button to="/grievance/submit" variant="primary" icon={<TriangleAlert size={18} strokeWidth={2.3} />}>
                    Report Issue
                  </Button>
                  <Button to="/map" variant="secondary" icon={<MapPinned size={18} strokeWidth={2.3} />}>
                    View Map
                  </Button>
                  <Button to="/chatbot" variant="ghost" icon={<MessageSquareText size={18} strokeWidth={2.3} />}>
                    Chatbot
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                <MetricCard icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="#00629e" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 8l8 8" /></svg>} title="Traffic Index" value="42" hint="Average congestion across 12 zones." badge="Real-time" variant="info" delta="↑ 12%" />
                <MetricCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="#ba1a1a" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4l9 16H3L12 4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 16h.01" /></svg>} title="Active Alerts" value="03" hint="Waterlogging and power maintenance." badge="Critical" variant="danger" />
                <MetricCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-700" viewBox="0 0 24 24" fill="none" stroke="#00450d" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M7 13l3 3 7-7" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 19h16" /></svg>} title="Open Cases" value="1,248" hint="85% resolution rate this month." badge="Public" variant="success" />
                <MetricCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 0116 0" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8" /></svg>} title="Flood Risk" value="Low" hint="Monitoring Upper Lake levels hourly." badge="Normal" variant="neutral" />
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-white/70 pointer-events-none" />
        </section>

        <section className="container mx-auto px-6 py-16 lg:px-12 lg:py-24">
          <DigitalTwinCard />
        </section>

        <section className="bg-gradient-to-b from-[#eaf7ff] to-[#d7e9f3]">
          <ContainerScroll
            titleComponent={
              <>
                <h2 className="text-3xl font-semibold tracking-tight text-[#071e27] md:text-5xl">Interactive City Map</h2>
                <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                  Explore Bhopal's infrastructure layers. Toggle between traffic density, flood risk zones, and municipal waste collection routes in a single interface.
                </p>
                <div className="mt-6 flex justify-center">
                  <Button to="/map" variant="ghost">Launch Full Map <ArrowRight size={16} /></Button>
                </div>
              </>
            }
          >
            <div className="mx-auto h-full w-full rounded-2xl overflow-hidden">
              <CityMap allowZoom={false} />
            </div>
          </ContainerScroll>
        </section>

        <section className="bg-white/70 backdrop-blur-[2px]">
          <div className="container mx-auto px-4 py-10 lg:px-6 lg:py-14">
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight">City Announcements</h2>
              <p className="mt-2 text-sm text-slate-500">Stay updated with the latest from the Smart City Commission.</p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {announcements.map((item) => (
                <AnnouncementCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-[#dbeef8]">
          <div className="container mx-auto flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-lg font-semibold">Bhopal Twin</div>
              <p className="mt-2 max-w-sm text-sm text-slate-600">
                The official digital twin and smart city management platform for the city of Bhopal.
              </p>
              <p className="mt-4 text-xs text-slate-500">© 2026 Bhopal Smart City Development Corporation Ltd.</p>
            </div>

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

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button type="button" aria-label="Share" className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/50 text-slate-600 shadow-sm transition hover:bg-white">
                <Share2 size={16} />
              </button>
              <button type="button" aria-label="Mail" className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/50 text-slate-600 shadow-sm transition hover:bg-white">
                <Mail size={16} />
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
