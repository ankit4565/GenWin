import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/organisms/NavBar';

export default function GrievancesPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
const navigate = useNavigate();
  const grievances = [
    {
      id: 1,
      title: 'Water Leakage on Link Road 3',
      description: 'Significant water main burst near the metro construction site. Causing low pressure in surrounding residential areas.',
      status: 'In Progress',
      icon: 'water_damage',
      category: 'Water',
      date: 'Oct 24, 2024',
      location: 'Arera Colony',
      ticketId: '#GRV-2024-8921',
      color: 'secondary',
    },
    {
      id: 2,
      title: 'Garbage Collection Delay',
      description: 'Routine garbage collection has missed our sector for the last two days. Bin is overflowing.',
      status: 'Submitted',
      icon: 'delete',
      category: 'Waste',
      date: 'Oct 26, 2024',
      location: 'Indrapuri',
      ticketId: '#GRV-2024-9104',
      color: 'surface-variant',
    },
    {
      id: 3,
      title: 'Street Light Repair',
      description: 'Street light pole #BPL-44 was flickering and making a buzzing noise at night.',
      status: 'Resolved',
      icon: 'lightbulb',
      category: 'Infrastructure',
      date: 'Oct 20, 2024',
      location: 'Fixed Oct 22',
      ticketId: '#GRV-2024-8711',
      color: 'primary',
    },
  ];

  const featuredGrievance = {
    id: 4,
    title: 'Sewerage Blockage in New Market Area',
    description: 'The main line near the heritage gate is overflowing. Our technical team is on-site using sensor-guided maintenance tools to identify the blockage point.',
    status: 'In Progress',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhnY6MM0wAaxjjDhxIFmyazT7_qu00CJKbZPmzEnoIJz7S7WJ6hs--mxN2HuLA93sG7gQEr_6hIq4loHMzQZpPeH_DTS7I8wOT3WUxY85gqocOv2GKLWXu5YZuihbXFQTk7b0uL7-HJaTiBzTLvip3Dovcgjc_y_3eMNBd2CLRmFZUxHSpoahA071WpUVwGHExZr1JQkwZMQyc2eCf9dmKaxHRU2kr2DIl-TLQWOYIfAQ3wokxnwutwhIZApU8Z57MmAaGrHFrYf8',
    date: 'Updated 2h ago',
    priority: 'High',
    liveUpdates: true,
    ticketId: '#GRV-2024-9552',
    tags: ['Team Dispatched', 'Sensors Active'],
  };

  const statusFilters = ['All (12)', 'Submitted', 'In Progress', 'Resolved'];

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-secondary-container';
      case 'Submitted':
        return 'bg-surface-variant';
      case 'Resolved':
        return 'bg-primary';
      default:
        return 'bg-surface-variant';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'text-on-secondary-container';
      case 'Submitted':
        return 'text-on-surface-variant';
      case 'Resolved':
        return 'text-white';
      default:
        return 'text-on-surface-variant';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background font-body-lg">
      <Navbar />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex-grow">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md mb-stack-lg">
          <div className="space-y-1">
            <h1 className="font-headline-lg text-headline-lg text-primary">My Grievances</h1>
            <p className="text-on-surface-variant font-body-sm">Track and manage your submitted service requests and complaints.</p>
          </div>
         <button
       onClick={() => navigate('/grievances/new')}
        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-md transition-all active:scale-95 w-fit"
         >
        <span className="material-symbols-outlined">add</span>
        <span className="font-title-md text-body-lg font-semibold">
        Submit New Grievance
       </span>
       </button>

        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 p-4 mb-stack-lg flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-body-sm font-medium whitespace-nowrap transition-all ${
                  activeFilter === filter
                    ? 'bg-primary text-white'
                    : 'hover:bg-surface-variant/50 text-on-surface-variant'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input
                className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-body-sm"
                placeholder="Search tickets..."
                type="text"
              />
            </div>
            <button className="border border-outline-variant p-2 rounded-lg hover:bg-surface-variant/50 flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined">tune</span>
              <span className="hidden md:inline text-body-sm">Sort</span>
            </button>
          </div>
        </div>

        {/* Grievance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-stack-lg">
          {/* Cards 1-3 */}
          {grievances.map((grievance) => (
            <div
              key={grievance.id}
              className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow relative"
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${getStatusBgColor(grievance.status)}`}></div>
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg`} style={{ backgroundColor: `var(--${grievance.color}-container)` }}>
                    <span className="material-symbols-outlined">{grievance.icon}</span>
                  </div>
                  <span className={`${getStatusBgColor(grievance.status)} ${getStatusTextColor(grievance.status)} px-3 py-1 rounded-full text-label-data font-bold`}>
                    {grievance.status}
                  </span>
                </div>
                <h3 className="font-title-md text-on-surface mb-2">{grievance.title}</h3>
                <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-4">{grievance.description}</p>
                <div className="flex items-center gap-4 text-on-surface-variant">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    <span className="font-label-data text-label-data">{grievance.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span className="font-label-data text-label-data">{grievance.location}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/20 flex justify-between items-center">
                <span className="font-label-data text-label-data text-outline">{grievance.ticketId}</span>
                <a className="text-primary font-semibold text-body-sm flex items-center gap-1 hover:underline" href="#">
                  View Details
                  <span className="material-symbols-outlined">arrow_forward</span>
                </a>
              </div>
            </div>
          ))}

          {/* Featured Large Card */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
            <div className="md:w-1/3 bg-surface-container-high relative overflow-hidden h-48 md:h-auto">
              <img className="w-full h-full object-cover" alt="Street in Bhopal" src={featuredGrievance.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <span className="bg-error text-white text-label-data font-bold px-2 py-0.5 rounded uppercase mb-2 inline-block">
                  Priority: {featuredGrievance.priority}
                </span>
                <p className="font-label-data text-label-data">Live Updates Active</p>
              </div>
            </div>
            <div className="md:w-2/3 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`${getStatusBgColor(featuredGrievance.status)} ${getStatusTextColor(featuredGrievance.status)} px-3 py-1 rounded-full text-label-data font-bold`}>
                    {featuredGrievance.status}
                  </span>
                  <span className="text-outline font-label-data text-label-data">{featuredGrievance.date}</span>
                </div>
                <h3 className="font-headline-lg text-[24px] text-on-surface mb-3">{featuredGrievance.title}</h3>
                <p className="text-body-sm text-on-surface-variant mb-4">{featuredGrievance.description}</p>
                <div className="flex flex-wrap gap-4 mb-4">
                  {featuredGrievance.tags.map((tag, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border border-outline-variant/30">
                      <span className="material-symbols-outlined text-primary">
                        {tag === 'Team Dispatched' ? 'engineering' : 'monitoring'}
                      </span>
                      <span className="text-body-sm font-medium">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                <span className="font-label-data text-label-data text-outline">{featuredGrievance.ticketId}</span>
                <div className="flex gap-3">
                  <button className="text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">chat_bubble</span>
                  </button>
                  <button className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-full text-body-sm font-semibold hover:opacity-90 transition-opacity">
                    Track Live
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Card */}
          <div className="bg-primary text-white rounded-xl p-6 flex flex-col justify-between overflow-hidden relative">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-on-primary-container/20 rounded-full blur-3xl"></div>
            <div>
              <h3 className="font-title-md mb-2">Resolution Rate</h3>
              <div className="text-headline-lg font-bold leading-none mb-1">84%</div>
              <p className="text-on-primary-container text-body-sm mb-6">of your grievances were resolved within 48 hours this year.</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-body-sm">
                <span>Total Submitted</span>
                <span className="font-label-data">42</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-on-primary-container h-full w-[84%]"></div>
              </div>
              <button className="w-full py-2 border border-white/30 rounded-lg text-body-sm hover:bg-white/10 transition-colors">
                View Annual Report
              </button>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-stack-lg flex items-center justify-between border-t border-outline-variant/30 pt-6">
          <p className="text-body-sm text-outline">Showing 1 to 5 of 12 entries</p>
          <div className="flex gap-2">
            <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-variant/50 disabled:opacity-30" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-body-sm font-bold ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'hover:bg-surface-variant/50'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-variant/50">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-stack-lg w-full max-w-container-max mx-auto">
          <div className="flex flex-col gap-2 mb-6 md:mb-0">
            <span className="font-title-md text-title-md font-bold text-primary">Bhopal Twin</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
              Empowering citizens through data-driven governance and sustainable urban planning.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex flex-col gap-3">
              <span className="font-label-data text-label-data font-bold text-on-surface">Policies</span>
              <a className="text-on-surface-variant hover:underline text-body-sm" href="#">
                Privacy Policy
              </a>
              <a className="text-on-surface-variant hover:underline text-body-sm" href="#">
                Terms of Service
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-label-data text-label-data font-bold text-on-surface">Support</span>
              <a className="text-on-surface-variant hover:underline text-body-sm" href="#">
                Emergency Contacts
              </a>
              <a className="text-on-surface-variant hover:underline text-body-sm" href="#">
                Grievance Portal
              </a>
            </div>
          </div>
        </div>
        <div className="px-margin-desktop py-4 border-t border-outline-variant/30 text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            © 2024 Bhopal Smart City Development Corporation Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
