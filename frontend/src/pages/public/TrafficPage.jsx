import { useState, useEffect } from 'react';
import { Search, Bell, BarChart3, AlertTriangle, AlertCircle, CheckCircle, Cloud } from 'lucide-react';
import Navbar from "../../components/organisms/NavBar"
import TrafficMap from "../../components/organisms/TrafficMap";
import { getWeather } from "../../services/weatherService";
console.log(import.meta.env.VITE_OPENWEATHER_KEY);

export default function TrafficPage() {
  const [congestionIndex, setCongestionIndex] = useState(42);
  const [lastSync, setLastSync] = useState('14:32:01');
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [weather, setWeather] = useState(null);

 useEffect(() => {
  const fetchWeather = async () => {
    try {
      const data = await getWeather();
      setWeather(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchWeather();

  const interval = setInterval(() => {
    setLastSync(new Date().toLocaleTimeString());
     fetchWeather();
  }, 300000);

  return () => clearInterval(interval);
}, []);

  const zones = [
    {
      id: 1,
      name: 'Arera Hills Crossing',
      description: 'High frequency of blind-spot merging',
      severity: 'ACTIVE',
      icon: AlertTriangle,
      color: 'accent-orange',
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-100/50',
    },
    {
      id: 2,
      name: 'New Market Corridor',
      description: 'Pedestrian-heavy / Speeding risk',
      severity: 'CRITICAL',
      icon: AlertCircle,
      color: 'accent-red',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-100/50',
    },
    {
      id: 3,
      name: 'Link Road No. 1',
      description: 'Cleared recently. Monitoring flow.',
      severity: 'NORMAL',
      icon: CheckCircle,
      color: 'text-green-600',
      borderColor: 'border-green-300',
      bgColor: 'bg-green-100/50',
    },
  ];

  return (
    <>
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', background: '#f7fbf2', overflow: 'hidden' }}>
        <Navbar />

        <main className="flex-grow flex flex-col md:flex-row h-full overflow-hidden">
          {/* BEGIN: Traffic Content Area */}
          <div className="flex-grow relative h-full bg-slate-100">
            {/* Traffic Map Container */}
            <div className="map-container relative w-full h-full bg-slate-200 overflow-hidden" data-purpose="traffic-map-container">
              {/* Map Placeholder Image */}
              <TrafficMap />

              {/* Floating Map HUD Elements */}
              {/* City-wide Congestion Badge */}
              <div className="absolute top-6 left-6 z-10">
                <div className="bg-white/90 backdrop-blur p-4 rounded-xl border-l-4 border-green-600 shadow-lg flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold text-xl">{congestionIndex}</span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold opacity-60">Congestion Index</p>
                    <h3 className="text-lg font-bold text-green-700">Moderate Flow</h3>
                  </div>
                </div>
              </div>

              {/* Refresh Indicator */}
              <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-gray-300/50 text-xs font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live Updating (30s)
              </div>

              {/* Weather/Condition Widget */}
              <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
                <div className="bg-white/90 backdrop-blur p-3 rounded-lg flex items-center gap-3 shadow-md">
                  <Cloud className="w-6 h-6 text-green-700" />
                  <div className="text-xs">
                     <div className="bg-white/90 backdrop-blur p-3 rounded-lg flex items-center gap-3 shadow-md">
  <Cloud className="w-6 h-6 text-green-700" />

  {weather ? (
    <div className="text-xs">
      <span>
      {weather?.current?.temperature_2m || "--"}°C</span>
    </div>
  ) : (
    <span>Loading...</span>
  )}
</div>
                  </div>
                </div>

                {/* Officer CTA */}
                <button className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-xl flex items-center gap-2 hover:bg-green-800 transition-all hover:translate-y-[-2px]">
                  <BarChart3 className="w-4 h-4" />
                  Open Traffic Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* BEGIN: Data Sidebar (Right) */}
          <aside className="w-full md:w-[400px] bg-white border-l border-gray-300/30 flex flex-col max-h-screen overflow-y-auto" data-purpose="traffic-data-panel">
            {/* Prediction Cards Section */}
            <section className="p-6 border-b border-gray-300/20">
              <h4 className="text-sm font-bold uppercase tracking-widest text-green-700/60 mb-4">AI Traffic Prediction</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-100 p-3 rounded-lg border border-green-100 text-center hover:bg-slate-200 transition-colors cursor-pointer">
                  <span className="block text-xs font-bold opacity-60 mb-1">1HR</span>
                  <span className="text-lg font-bold text-green-600">Stable</span>
                </div>
                <div className="bg-slate-100 p-3 rounded-lg border border-green-100 text-center hover:bg-slate-200 transition-colors cursor-pointer">
                  <span className="block text-xs font-bold opacity-60 mb-1">3HR</span>
                  <span className="text-lg font-bold text-orange-600">+12%</span>
                </div>
                <div className="bg-slate-100 p-3 rounded-lg border border-green-100 text-center hover:bg-slate-200 transition-colors cursor-pointer">
                  <span className="block text-xs font-bold opacity-60 mb-1">6HR</span>
                  <span className="text-lg font-bold text-red-600">Peak</span>
                </div>
              </div>
            </section>

            {/* Peak Hour Trend Chart Section */}
            <section className="p-6 border-b border-gray-300/20">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-green-700/60">Flow Trends (24h)</h4>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Chart</span>
              </div>
              <div className="h-40 w-full bg-white rounded-lg p-2 relative border border-gray-200">
                {/* Mock Chart Visual */}
                <svg className="w-full h-full" viewBox="0 0 300 100">
                  <path
                    d="M0 80 Q 50 70, 75 40 T 100 30 T 125 60 T 150 75 T 175 45 T 200 10 T 225 35 T 250 80 T 300 90"
                    fill="none"
                    stroke="#1b5e20"
                    strokeWidth="2"
                  />
                  <rect fill="rgba(27, 94, 32, 0.05)" height="90" width="40" x="180" y="5" />
                  <text fill="#44483f" fontSize="8" x="185" y="100">
                    Peak Hours
                  </text>
                </svg>
              </div>
              
            </section>

            {/* Accident/High-Risk Zones List */}
            <section className="p-6 flex-grow overflow-y-auto">
              <h4 className="text-sm font-bold uppercase tracking-widest text-green-700/60 mb-4">Critical High-Risk Zones</h4>
              <div className="space-y-3">
                {zones.map((zone) => {
                  const IconComponent = zone.icon;
                  const statusColorMap = {
                    ACTIVE: 'text-orange-600',
                    CRITICAL: 'text-red-600',
                    NORMAL: 'text-green-600',
                  };
                  const statusBgMap = {
                    ACTIVE: 'bg-orange-50',
                    CRITICAL: 'bg-red-50',
                    NORMAL: 'bg-green-50',
                  };

                  return (
                    <div
                      key={zone.id}
                      className={`flex items-center gap-4 p-3 hover:${statusBgMap[zone.severity]} transition-colors rounded-lg group cursor-pointer border-l-4 ${zone.borderColor}`}
                    >
                      <div className={`w-10 h-10 rounded ${zone.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={`w-6 h-6 ${statusColorMap[zone.severity]}`} />
                      </div>
                      <div className="flex-grow">
                        <h5 className="text-sm font-bold text-gray-800">{zone.name}</h5>
                        <p className="text-[11px] opacity-60">{zone.description}</p>
                      </div>
                      <span className={`text-xs font-bold ${statusColorMap[zone.severity]}`}>
                        {zone.severity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Refetch Summary */}
            <footer className="p-6 bg-slate-50 border-t border-gray-300/20">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest opacity-50">
                <span>Last Sync: {lastSync}</span>
                <span>Bhopal Smart City IT</span>
              </div>
            </footer>
          </aside>
          {/* END: Data Sidebar */}
        </main>

        {/* BEGIN: Footer */}
        <footer className="w-full  h-[80px] bg-slate-100 border-t border-gray-300 mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center px-8 py-6 max-w-7xl mx-auto">
            <div className="mb-4 md:mb-0">
              <span className="text-lg font-bold text-green-700">Bhopal Twin</span>
              <p className="text-xs text-gray-600 mt-1 opacity-70">© 2024 Bhopal Smart City Development Corporation Ltd.</p>
            </div>
            <div className="flex gap-6 flex-wrap justify-center md:justify-end">
              <a className="text-sm text-gray-600 hover:text-green-700 hover:underline" href="#">Privacy Policy</a>
              <a className="text-sm text-gray-600 hover:text-green-700 hover:underline" href="#">Terms of Service</a>
              <a className="text-sm text-gray-600 hover:text-green-700 hover:underline" href="#">Emergency Contacts</a>
              <a className="text-sm text-gray-600 hover:text-green-700 hover:underline" href="#">Grievance Portal</a>
            </div>
          </div>
        </footer>
        {/* END: Footer */}
      </div>
    </>
  );
}