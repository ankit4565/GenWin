import { useState, useEffect } from 'react';
import { RssIcon, Clock, MapPin, Filter, Phone, PhoneForwarded, AlertTriangle, AlertCircle, Droplet, Zap, Wind } from 'lucide-react';
import Navbar from '../../components/organisms/NavBar';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'EMERGENCY',
      title: 'Flash Flood Warning: Zone 4 (Lake Catchment)',
      description: 'Heavy monsoon rainfall has caused water levels in Upper Lake to reach critical thresholds. Residents in low-lying areas near Koh-e-Fiza are advised to move to higher ground. Drainage systems are currently at 95% capacity.',
      category: 'Environmental / Safety',
      timeAgo: '2 mins ago',
      severity: 'emergency',
      icon: Droplet,
      color: 'error',
    },
    {
      id: 2,
      type: 'CRITICAL WARNING',
      title: 'Major Congestion: Arera Colony Main Road',
      description: 'A multi-vehicle accident near 10 Number Bus Stop has resulted in significant traffic blockage. Commuters are advised to take the Link Road 1 diversion. Emergency services are on-site clearing the debris.',
      category: 'Transport / Infrastructure',
      timeAgo: '45 mins ago',
      severity: 'warning',
      icon: AlertTriangle,
      color: 'warning',
    },
    {
      id: 3,
      type: 'INFO',
      title: 'Pollution Level Advisory: MP Nagar',
      description: 'AQI has risen to 185 (Unhealthy) in the MP Nagar commercial district. Sensitive groups are advised to limit prolonged outdoor exertion. Smart filters are being activated in public hubs.',
      category: 'Environmental / Health',
      timeAgo: '2 hours ago',
      severity: 'info',
      icon: Wind,
      color: 'info',
    },
  ]);

  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [lastUpdate, setLastUpdate] = useState('Just Now');

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate('Just Now');
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const emergencyContacts = [
    { label: 'Central Helpline', number: '100 / 112', icon: PhoneForwarded, highlight: true },
    { label: 'BMC Flood Control', number: '0755-2542222', icon: Phone, highlight: false },
    { label: 'Fire Services', number: '101', icon: Phone, highlight: false },
  ];

  const getAlertStyles = (severity) => {
    switch (severity) {
      case 'emergency':
        return {
          glow: 'emergency-glow',
          badge: 'bg-red-600 text-white',
          container: 'bg-red-50/30',
          icon: 'text-red-600',
        };
      case 'warning':
        return {
          glow: 'warning-glow',
          badge: 'bg-orange-600 text-white',
          container: 'bg-orange-50/30',
          icon: 'text-orange-600',
        };
      case 'info':
        return {
          glow: 'info-glow',
          badge: 'bg-blue-600 text-white',
          container: 'bg-blue-50/30',
          icon: 'text-blue-600',
        };
      default:
        return {};
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    if (categoryFilter !== 'All Categories' && !alert.category.includes(categoryFilter)) return false;
    return true;
  });

  return (
    <>
      <style>{`
        .glass-panel {
          background: rgba(247, 251, 242, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .emergency-glow {
          box-shadow: 0 0 15px rgba(220, 38, 38, 0.4);
          border-left: 4px solid #dc2626;
        }
        .warning-glow {
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.2);
          border-left: 4px solid #f59e0b;
        }
        .info-glow {
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
          border-left: 4px solid #3b82f6;
        }
      `}</style>

      <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen flex flex-col">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex-grow">
          {/* Hero Section */}
          <section className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-green-700 p-8 md:p-12 text-white shadow-lg">
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">City Alerts Public Feed</h1>
              <p className="text-lg md:text-xl text-green-100 leading-relaxed mb-6">
                Live updates on city infrastructure, weather, and emergency services.
                Real-time data synchronization with Bhopal's digital twin for proactive safety.
              </p>
              <div className="flex gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-900 rounded-full font-semibold">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  2 ACTIVE EMERGENCIES
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-900 rounded-full font-semibold">
                  SYSTEMS NORMAL
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Live Feed Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <RssIcon className="w-6 h-6 text-green-600" />
                  Live Incident Log
                </h2>
                <span className="text-sm text-gray-600 italic">Updated: {lastUpdate}</span>
              </div>

              {/* Alert Cards */}
              {filteredAlerts.map((alert) => {
                const IconComponent = alert.icon;
                const styles = getAlertStyles(alert.severity);

                return (
                  <article
                    key={alert.id}
                    className={`glass-panel rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${styles.glow}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 ${styles.badge} text-sm font-bold rounded`}>
                        {alert.type}
                      </span>
                      <time className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {alert.timeAgo}
                      </time>
                    </div>

                    <div className="flex gap-6">
                      <div className="hidden md:flex w-12 h-12 rounded-full bg-opacity-10 items-center justify-center flex-shrink-0" style={{ backgroundColor: styles.color === 'error' ? '#dc2626' : styles.color === 'warning' ? '#f59e0b' : '#3b82f6' }}>
                        <IconComponent className={`w-6 h-6 ${styles.icon}`} />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">{alert.title}</h3>
                        <p className="text-gray-700 mb-4 leading-relaxed">{alert.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-300/30">
                          <span className="text-sm text-gray-600">Category: {alert.category}</span>
                          <div className="flex gap-3">
                            <button className="px-4 py-2 text-green-600 font-semibold hover:bg-green-50 rounded-full transition-colors">
                              Acknowledge
                            </button>
                            <a className="px-4 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-all shadow-md" href="#">
                              View Details
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              {/* Load More Button */}
              <div className="pt-6 text-center">
                <button className="px-8 py-3 border-2 border-green-600 text-green-600 rounded-full font-bold hover:bg-green-600 hover:text-white transition-all">
                  LOAD HISTORICAL ALERTS
                </button>
              </div>
            </div>

            {/* Side Panel Column */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Affected Zone Map Widget */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <div className="p-4 bg-green-600 text-white flex justify-between items-center">
                  <h3 className="font-bold text-lg">Affected Zones</h3>
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="h-64 relative group cursor-pointer">
                  <img
                    alt="Bhopal digital twin map showing emergency zones"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPccqAYaDty2ZLS5uNEAUAVP6YTU77-EVNi4dUzD8JSMddIxCTcH0T9MmrAzfD8RRI3Wx1DH2-6--lYE3BB-_udE-OAblJoEPzyu5ahN_mab6gptjnW1Sv2SGCNTPoQC8uoCE80098JUZjIjUFPmegEYdAPmc_Qxgym2T-vqEa9wOVoOOixyNmEIpij4IP9G09xicuuqur4Q4qJya8l7oaJGNM9VeWeljev20WeZCPptrsAxR89kyODpJDckm6YMu71t3FR-gcANU"
                  />
                  <div className="absolute inset-0 bg-green-600/20 group-hover:bg-transparent transition-colors duration-500"></div>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded shadow-lg text-center">
                    <p className="text-sm font-semibold text-gray-800">TAP TO INTERACT WITH 3D TWIN</p>
                  </div>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-green-600" /> Filters
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase">Severity</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSeverityFilter('all')}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${severityFilter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setSeverityFilter('emergency')}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${severityFilter === 'emergency' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        Emergency
                      </button>
                      <button
                        onClick={() => setSeverityFilter('warning')}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${severityFilter === 'warning' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        Warning
                      </button>
                      <button
                        onClick={() => setSeverityFilter('info')}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${severityFilter === 'info' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        Info
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase">Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2 focus:ring-2 focus:ring-green-600"
                    >
                      <option>All Categories</option>
                      <option>Infrastructure</option>
                      <option>Environmental</option>
                      <option>Public Safety</option>
                      <option>Transportation</option>
                    </select>
                  </div>

                  <button className="w-full py-2 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-all">
                    Apply View Options
                  </button>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-white rounded-xl p-6 border border-red-200 shadow-lg">
                <h3 className="font-bold text-lg mb-4 text-red-600 flex items-center gap-2">
                  <Phone className="w-5 h-5" /> Quick Emergency
                </h3>
                <ul className="space-y-3">
                  {emergencyContacts.map((contact, idx) => {
                    const ContactIcon = contact.icon;
                    return (
                      <li
                        key={idx}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all cursor-pointer ${
                          contact.highlight
                            ? 'bg-red-50 border border-red-200 hover:bg-red-100'
                            : 'hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-semibold text-gray-700 uppercase">{contact.label}</p>
                          <p className={`text-lg font-bold ${contact.highlight ? 'text-red-600' : 'text-gray-800'}`}>
                            {contact.number}
                          </p>
                        </div>
                        <ContactIcon className={`w-5 h-5 ${contact.highlight ? 'text-red-600' : 'text-gray-600'}`} />
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-4 text-xs text-gray-600 italic">Available 24/7 for Bhopal residents.</p>
              </div>
            </aside>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 border-t border-gray-300 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-8">
            <div className="mb-6 md:mb-0">
              <span className="text-xl font-bold text-green-600 block mb-2">Bhopal Smart City</span>
              <p className="text-sm text-gray-600">© 2024 Bhopal Smart City Development Corporation Ltd.</p>
            </div>
            <div className="flex gap-6 flex-wrap justify-center mb-6 md:mb-0">
              <a className="text-sm text-gray-600 hover:text-green-600 hover:underline" href="#">Privacy Policy</a>
              <a className="text-sm text-gray-600 hover:text-green-600 hover:underline" href="#">Terms of Service</a>
              <a className="text-sm text-gray-600 hover:text-green-600 hover:underline" href="#">Emergency Contacts</a>
              <a className="text-sm text-gray-600 hover:text-green-600 hover:underline" href="#">Grievance Portal</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
