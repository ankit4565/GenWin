import React, { useState } from 'react';
import Navbar from '../../components/organisms/NavBar';

export default function DrainagePage() {
  const [alertVisible, setAlertVisible] = useState(true);
  const [toastVisible, setToastVisible] = useState(true);

  const criticalZones = [
    { name: 'MP Nagar Zone 1', risk: 9.2, status: 'Overflow', statusColor: 'text-error' },
    { name: 'Arera Colony', risk: 8.7, status: 'Blocked', statusColor: 'text-error' },
    { name: 'Shahpura Lake', risk: 4.5, status: 'Normal', statusColor: 'text-secondary' },
    { name: 'Bairagarh', risk: 3.1, status: 'Normal', statusColor: 'text-secondary' },
  ];

  const weatherForecast = [
    { time: '14:00', icon: 'rainy' },
    { time: '18:00', icon: 'thunderstorm' },
    { time: '22:00', icon: 'cloudy' },
    { time: '02:00', icon: 'nights_stay' },
  ];

  return (
    <div className="flex flex-col h-screen bg-background text-on-background font-body-lg overflow-hidden">
      {/* Navigation */}
      <Navbar />

      <main className="flex-grow relative overflow-hidden flex">
        {/* Left Sidebar */}
        <aside className="hidden md:flex flex-col gap-3 py-6 bg-surface dark:bg-surface-container-low border-r border-outline-variant/50 w-64 h-full shrink-0 px-4">
          <nav className="flex flex-col gap-2">
            <a
              href="#"
              className="flex items-center gap-3 py-3 px-4 mx-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all"
            >
              <span className="material-symbols-outlined">traffic</span>
              <span className="font-label-data text-label-data">Traffic</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 py-3 px-4 mx-2 bg-primary-container text-on-primary-container rounded-full"
            >
              <span className="material-symbols-outlined">water_damage</span>
              <span className="font-label-data text-label-data">Drainage</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 py-3 px-4 mx-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all"
            >
              <span className="material-symbols-outlined">delete</span>
              <span className="font-label-data text-label-data">Waste</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 py-3 px-4 mx-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all"
            >
              <span className="material-symbols-outlined">warning</span>
              <span className="font-label-data text-label-data">Disaster</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 py-3 px-4 mx-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all"
            >
              <span className="material-symbols-outlined">insights</span>
              <span className="font-label-data text-label-data">Analytics</span>
            </a>
          </nav>

          <div className="mt-auto px-4 pb-4 space-y-3">
            <button className="w-full bg-secondary-container text-on-secondary-container py-3 rounded-xl font-label-data text-label-data flex items-center justify-center gap-2 hover:shadow-md transition-all">
              <span className="material-symbols-outlined">add_alert</span>
              <span>Quick Report</span>
            </button>
            <div className="flex flex-col gap-1">
              <a
                href="#"
                className="flex items-center gap-3 py-2 px-4 text-outline font-label-data text-label-data hover:underline"
              >
                <span className="material-symbols-outlined text-sm">settings</span>
                <span>Settings</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 py-2 px-4 text-outline font-label-data text-label-data hover:underline"
              >
                <span className="material-symbols-outlined text-sm">contact_support</span>
                <span>Support</span>
              </a>
            </div>
          </div>
        </aside>

        {/* Main Map Section */}
        <section className="flex-grow relative" style={{ backgroundImage: 'radial-gradient(#717a6d 0.5px, transparent 0.5px)', backgroundSize: '24px 24px', backgroundColor: '#e0e4db' }}>
          {/* Map Background Image */}
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full opacity-40 bg-cover grayscale"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
              }}
            />
            <div className="absolute inset-0 pointer-events-none border-[12px] border-surface-container-highest/20"></div>

            {/* Pulsing Risk Hotspots */}
            <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-error/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-error/10 rounded-full blur-3xl animate-pulse"></div>

            {/* SVG Lines for Stormwater Network */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
              <path d="M100 200 L300 400 L600 350 L800 600" fill="none" stroke="#00548e" strokeDasharray="8 4" strokeWidth="4" />
              <path d="M0 500 L400 550 L700 800" fill="none" stroke="#00548e" strokeWidth="3" />
              <circle cx="300" cy="400" fill="#ba1a1a" r="6" />
              <circle cx="800" cy="600" fill="#ba1a1a" r="6" />
            </svg>
          </div>

          {/* Top Left HUD: Status Panels */}
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-4 w-80">
            {/* Flood Risk Gauge */}
            <div className="bg-white/70 backdrop-blur-[12px] p-6 rounded-xl shadow-md border-l-4 border-primary">
              <h3 className="font-title-md text-title-md text-primary mb-2 flex items-center justify-between">
                Flood Risk Gauge
                <span className="material-symbols-outlined text-primary">waves</span>
              </h3>
              <div className="relative h-4 bg-surface-container-highest rounded-full overflow-hidden mb-2">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#acf4a4] via-[#f2f5ec] to-[#ba1a1a]"
                  style={{ width: '65%' }}
                />
              </div>
              <div className="flex justify-between font-label-data text-label-data text-outline">
                <span className="text-label-data">Low</span>
                <span className="text-error font-bold text-label-data">6.5 / 10 (High)</span>
                <span className="text-label-data">Severe</span>
              </div>
              <p className="text-body-sm text-on-surface-variant mt-4 leading-tight">
                Current alert level elevated due to upstream release from Bhadbhada Dam.
              </p>
            </div>

            {/* Weather Update */}
            <div className="bg-white/70 backdrop-blur-[12px] p-6 rounded-xl shadow-md border-l-4 border-tertiary">
              <h3 className="font-title-md text-title-md text-tertiary mb-4 flex items-center justify-between">
                Weather Update
                <span className="material-symbols-outlined">cloudy_snowing</span>
              </h3>
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <p className="font-headline-lg text-headline-lg leading-none">28°C</p>
                  <p className="text-body-sm text-outline">Thunderstorms</p>
                </div>
                <div className="text-right font-label-data text-label-data">
                  <p className="text-tertiary font-bold text-body-sm">Rain: 12.4mm</p>
                  <p className="text-on-surface-variant text-body-sm">Wind: 14km/h</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 border-t border-outline-variant pt-4">
                {weatherForecast.map((item, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-label-data font-label-data text-outline uppercase">{item.time}</p>
                    <span className="material-symbols-outlined text-sm flex justify-center">{item.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Right: Critical Zones */}
          <div className="absolute bottom-6 right-6 z-10 w-96 flex flex-col gap-4">
            <div className="bg-white/70 backdrop-blur-[12px] rounded-xl shadow-md overflow-hidden">
              <div className="bg-primary-container/10 p-4 border-b border-outline-variant/30 flex justify-between items-center">
                <h3 className="font-title-md text-title-md text-on-surface">Critical Zones</h3>
                <span className="bg-error text-on-error px-2 py-1 rounded text-label-data font-label-data font-bold animate-pulse">LIVE ALERT</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-surface-container font-label-data text-label-data uppercase text-outline">
                    <tr>
                      <th className="px-4 py-2">Ward Name</th>
                      <th className="px-4 py-2">Risk</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm">
                    {criticalZones.map((zone, idx) => (
                      <tr key={idx} className="border-b border-outline-variant/20 hover:bg-surface-variant/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-body-sm">{zone.name}</td>
                        <td className="px-4 py-3 text-error font-bold text-body-sm">{zone.risk}</td>
                        <td className={`px-4 py-3 flex items-center gap-1 ${zone.statusColor} text-body-sm`}>
                          <span className="w-2 h-2 rounded-full bg-current"></span>
                          {zone.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Citizen Grievance Portal */}
            <div className="bg-white/70 backdrop-blur-[12px] p-4 rounded-xl flex items-center justify-between border border-outline-variant/50">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline">account_circle</span>
                <div>
                  <p className="text-body-sm font-medium">Citizen Grievance Portal</p>
                  <p className="text-label-data text-outline">Login to submit reports</p>
                </div>
              </div>
              <button className="bg-surface-container-highest text-outline px-4 py-2 rounded-lg text-label-data font-label-data flex items-center gap-2 cursor-not-allowed opacity-70">
                <span className="material-symbols-outlined text-sm">lock</span>
                Report Blockage
              </button>
            </div>
          </div>

          {/* Bottom Left: Map Controls */}
          <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2">
            <button className="bg-white/70 backdrop-blur-[12px] p-3 rounded-full shadow-md hover:bg-surface-container-high transition-all text-on-surface">
              <span className="material-symbols-outlined">layers</span>
            </button>
            <button className="bg-white/70 backdrop-blur-[12px] p-3 rounded-full shadow-md hover:bg-surface-container-high transition-all text-on-surface">
              <span className="material-symbols-outlined">my_location</span>
            </button>
            <div className="flex flex-col bg-white/70 backdrop-blur-[12px] rounded-full shadow-md overflow-hidden">
              <button className="p-3 hover:bg-surface-container-high text-on-surface border-b border-outline-variant/30">
                <span className="material-symbols-outlined">add</span>
              </button>
              <button className="p-3 hover:bg-surface-container-high text-on-surface">
                <span className="material-symbols-outlined">remove</span>
              </button>
            </div>
          </div>

          {/* Top Right: Legend */}
          <div className="absolute top-6 right-6 z-10 bg-white/70 backdrop-blur-[12px] px-4 py-2 rounded-full flex items-center gap-6 shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#00548e]"></span>
              <span className="font-label-data text-label-data uppercase text-on-surface">Stormwater Network</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-error"></span>
              <span className="font-label-data text-label-data uppercase text-on-surface">Critical Incident</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-2 bg-gradient-to-r from-[#acf4a4] via-[#f2f5ec] to-[#ba1a1a] rounded-full"></div>
              <span className="font-label-data text-label-data uppercase text-on-surface">Risk Scale</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface border-t border-outline-variant z-50 flex flex-col md:flex-row justify-between items-center px-16 py-3 w-full shrink-0">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <span className="font-title-md text-title-md font-bold text-primary">Bhopal Smart City</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">© 2024 Bhopal Smart City Development Corporation Ltd.</span>
        </div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a className="font-label-data text-label-data text-on-surface-variant hover:underline" href="#">
            Privacy Policy
          </a>
          <a className="font-label-data text-label-data text-on-surface-variant hover:underline" href="#">
            Terms of Service
          </a>
          <a className="font-label-data text-label-data text-on-surface-variant hover:underline" href="#">
            Emergency Contacts
          </a>
          <a className="font-label-data text-label-data text-primary font-bold hover:underline" href="#">
            Grievance Portal
          </a>
        </div>
      </footer>

      {/* Alert Toast */}
      {toastVisible && (
        <div className="fixed top-20 right-6 z-[100] transform transition-transform">
          <div className="bg-error-container text-on-error-container p-4 rounded-xl shadow-xl border border-error/20 flex items-start gap-4 max-w-sm">
            <span className="material-symbols-outlined text-error flex-shrink-0">warning</span>
            <div>
              <p className="font-bold font-title-md text-title-md">Severe Flood Risk</p>
              <p className="text-body-sm">Water levels at Upper Lake have exceeded 1666.80ft. Bhadbhada gates opening at 16:00 HRS.</p>
            </div>
            <button onClick={() => setToastVisible(false)} className="text-on-error-container">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
