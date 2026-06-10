import React, { useState } from 'react';

import Navbar from '../../components/organisms/NavBar';

export default function GrievanceDetailPage() {
  const [activeTab, setActiveTab] = useState('public');
  const [commentText, setCommentText] = useState('');

  const grievance = {
    id: '#GRV-2024-8921',
    title: 'Intermittent Water Supply - Arera Colony',
    priority: 'High',
    description: 'The water supply has been extremely erratic for the past 3 days in Sector B, Arera Colony. We are only receiving water for 15-20 minutes in the morning, and the pressure is too low to fill overhead tanks. This is affecting approximately 45 households in this block. Preliminary checks by the local plumber suggest a potential blockage or a faulty valve near the main pumping station.',
    location: 'Block B, Near Hanuman Mandir, Arera Colony, Bhopal',
    coordinates: '23.2307° N, 77.4252° E',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXcI6CS-cVZqGPppkG0cqGw6wzhieUlDXsZOssVABdnKHo3mlr3EfHru3-y8aCxE6KwhMytD7tmODZJf8y41yRDOVymRvJp89z_jEgYKcBL1SE0TKaO6zijEbFrqvi5n9AccCUDsm7lrC4ezVlrE13cS9nZdNRjex5lRhgt9fPzgLBlNEHOn3Fyy-lpRTIYpXcoxgZ_shuGpphbcq0p2ZTRzlOfpWBmpd3UmpfPD9xVATggRz1zA81JGrRNBarf317D6kHM4gFGnU',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDtVJq9Ecv79yoqWDOaH0jcHLTkmNNXS7owmjgpNbLr5hlyGRxjwSGyxH0owMrnG-TYtCYi6Jh3Z981AS0vQGAMNFFyP-3TNQihEgbrsmZBgcD5HDMLRJF6GN7fWXi6ZPGbDjGePlCBiNCpQ0eAeYJwolzrv-Q_DK2F03d0smNRyDWJZWWjuA6vn_XU3VDvfG38qaGjB6KafSiMbFgjeP1n_SYa0_4PC83HT-XqgkCNVNPYBzNmQeCpxDor4zoItYk01hmhZjebzbY',
    ],
    mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZSUk2jrn4C4tjvDMqPC2QxJaUhbLhxfenVpjmNFcpBuC4EZZO5l3JU_XNIjeboB8VptEV2samAkrc93Ted0fKklpgHPj-xes7giQECAECQPfX0_pUNrbMI5P90DuSQvXE7Oe8umdKRf_WRmxaNhEtr-V_r7Cv5ZA5IbWEgATJiFIln3baRyX6AzZesK79iLGhRg-tTItUyBQBH_5oSl0gSDIjkuhxUwxwyEANYr2kJ9fCxPVyA92eThR2VNdUKRGsKlN_9q43HhU',
  };

  const timeline = [
    { step: 'Submitted', date: 'Oct 12, 09:30 AM', status: 'completed' },
    { step: 'Assigned', date: 'Oct 12, 11:45 AM', status: 'completed' },
    { step: 'In Progress', date: 'Oct 13, 08:00 AM', status: 'active' },
    { step: 'Resolved', date: 'Estimated Oct 15', status: 'pending' },
  ];

  const comments = [
    {
      id: 1,
      author: 'Officer Rajesh K.',
      role: 'Official',
      time: '2h ago',
      text: 'Maintenance team has been dispatched to the Sector B pump house. We are investigating a possible pressure drop in the distribution line. Expect updates by 2 PM.',
      isOfficer: true,
    },
    {
      id: 2,
      author: 'Rahul Sharma (You)',
      time: '1h ago',
      text: 'Thank you for the quick response. The water today was slightly muddy as well. Please check if there\'s a leak nearby.',
      isUser: true,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD31oELYQyBCkRsy1rbjg_Hkf_xoY1HFk7HVU56z9hrCngPHUPG6B40oxZby8CsrH-CgGiwLICpTpTPheRtn7_temROyRLvtrDYhDpzKI6nJTeyKw6LWMnJGQevLN4B17VfXkHngYS0UU6QyO94LC4pU2-TKnkThFEGnRwGK7JQ8i3J1kNnXa8AKTzGy5OEs-HbTtGL5F8aKuvUvxi7-XQr00Gqx9T7jMaXzUlyd-A3kG-fbZGhPmc6zqam4RNl-GvLa6EtIePCU4o',
    },
  ];

  const relatedIssues = [
    { id: '#GRV-2024-8890', title: 'Low Pressure - Sector C', status: 'In Progress', distance: '200m away yesterday' },
    { id: '#GRV-2024-8712', title: 'Pipe Leakage - Main Road', status: 'Resolved', distance: 'Resolved 3 days ago' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface font-body-lg">
      <Navbar />

      <main className="flex-grow pt-24 pb-stack-lg px-gutter max-w-container-max mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-stack-lg">
          {/* Ticket Header */}
          <div className="bg-surface-container-low p-stack-lg rounded-xl border border-outline-variant/20 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-label-data text-label-data text-on-surface-variant uppercase tracking-widest bg-surface-container-highest px-2 py-1 rounded">
                    {grievance.id}
                  </span>
                  <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-body-sm font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined">priority_high</span>
                    {grievance.priority} Priority
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">{grievance.title}</h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined">edit</span>
                  Update Status
                </button>
                <button className="bg-surface-container-highest text-on-surface px-6 py-2.5 rounded-full font-semibold border border-outline-variant/30 hover:bg-surface-container-high transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined">group_add</span>
                  Assign Team
                </button>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="relative flex items-center justify-between w-full py-6">
              <div className="absolute h-0.5 bg-outline-variant w-[85%] left-[7.5%] top-1/2 -translate-y-1/2 z-0"></div>
              <div className="absolute h-0.5 bg-primary w-[55%] left-[7.5%] top-1/2 -translate-y-1/2 z-0"></div>
              {timeline.map((item, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 transition-all ${
                      item.status === 'completed'
                        ? 'bg-primary text-on-primary border-background'
                        : item.status === 'active'
                        ? 'bg-background text-primary border-primary animate-pulse'
                        : 'bg-surface-container-highest text-on-surface-variant border-background'
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {item.status === 'completed' ? 'check' : item.status === 'active' ? 'engineering' : 'task_alt'}
                    </span>
                  </div>
                  <span className={`text-body-sm font-bold ${item.status === 'completed' || item.status === 'active' ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {item.step}
                  </span>
                  <span className="text-label-data text-on-surface-variant">{item.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description & Gallery */}
          <div className="bg-surface-container-low p-stack-lg rounded-xl border border-outline-variant/20 shadow-sm space-y-6">
            <div>
              <h3 className="font-title-md text-title-md text-primary mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined">description</span>
                Issue Description
              </h3>
              <p className="text-body-lg text-on-surface-variant leading-relaxed">{grievance.description}</p>
            </div>
            <div className="pt-4 border-t border-outline-variant/30">
              <h3 className="font-title-md text-title-md text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">photo_library</span>
                Attached Evidence
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {grievance.images.map((img, idx) => (
                  <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-outline-variant hover:ring-2 hover:ring-primary transition-all cursor-zoom-in">
                    <img className="w-full h-full object-cover" alt="Evidence" src={img} />
                  </div>
                ))}
                <div className="aspect-video rounded-lg overflow-hidden border border-outline-variant bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:ring-2 hover:ring-primary transition-all cursor-pointer">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-[32px]">add</span>
                    <span className="font-medium block text-body-sm">Add Photo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
            <div className="flex border-b border-outline-variant/20">
              <button
                onClick={() => setActiveTab('public')}
                className={`flex-1 py-4 font-bold transition-all ${
                  activeTab === 'public'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Public Discussion
              </button>
              <button
                onClick={() => setActiveTab('internal')}
                className={`flex-1 py-4 font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'internal'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-sm">lock</span>
                Internal Notes
              </button>
            </div>
            <div className="p-stack-lg space-y-6 max-h-[400px] overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className={`flex gap-4 ${comment.isUser ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      comment.isOfficer
                        ? 'bg-primary-fixed text-on-primary-fixed'
                        : 'bg-secondary-fixed text-on-secondary-fixed overflow-hidden'
                    }`}
                  >
                    {comment.isOfficer ? (
                      <span className="material-symbols-outlined">support_agent</span>
                    ) : (
                      <img className="w-full h-full object-cover" alt={comment.author} src={comment.avatar} />
                    )}
                  </div>
                  <div className={`space-y-1 ${comment.isUser ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 ${comment.isUser ? 'justify-end' : ''}`}>
                      <span className="font-bold text-on-surface">{comment.author}</span>
                      {comment.role && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-label-data font-bold uppercase">{comment.role}</span>}
                      <span className={`text-label-data text-on-surface-variant ${comment.isUser ? 'order-first mr-2' : 'ml-2'}`}>{comment.time}</span>
                    </div>
                    <div
                      className={`${
                        comment.isUser
                          ? 'bg-primary text-on-primary rounded-xl rounded-tr-none'
                          : 'bg-surface-container-high rounded-xl rounded-tl-none'
                      } p-4`}
                    >
                      <p className="text-body-sm">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <div className="p-gutter bg-surface-container border-t border-outline-variant/20">
              <div className="flex gap-4">
                <div className="flex-grow relative">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-body-sm focus:ring-2 focus:ring-primary/20 min-h-[80px] resize-none"
                    placeholder="Type your update..."
                  />
                  <div className="absolute right-3 bottom-3 flex gap-2">
                    <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
                      attach_file
                    </button>
                    <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
                      sentiment_satisfied
                    </button>
                  </div>
                </div>
                <button className="bg-primary text-on-primary w-12 h-12 rounded-xl flex items-center justify-center self-end shadow-md active:scale-95 transition-transform">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="lg:col-span-4 space-y-stack-lg">
          {/* Mini Map */}
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between">
              <h3 className="font-title-md text-title-md text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">map</span>
                Report Location
              </h3>
              <span className="text-label-data text-on-surface-variant bg-surface-container px-2 py-1 rounded">{grievance.coordinates}</span>
            </div>
            <div className="h-64 relative">
              <img className="w-full h-full object-cover" alt="Map" src={grievance.mapImage} />
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center pointer-events-none">
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary rounded-full animate-ping opacity-25"></div>
                  <div className="relative w-8 h-8 bg-primary rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-white">location_on</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-surface-container-high/30">
              <p className="text-body-sm font-medium">{grievance.location}</p>
            </div>
          </div>

          {/* Related Issues */}
          <div className="bg-surface-container-low p-stack-lg rounded-xl border border-outline-variant/20 shadow-sm">
            <h3 className="font-title-md text-title-md text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">hub</span>
              Related Clusters
            </h3>
            <div className="space-y-4">
              {relatedIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="group cursor-pointer hover:bg-surface-container rounded-lg p-3 border border-transparent hover:border-outline-variant/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-label-data text-on-surface-variant">{issue.id}</span>
                    <span
                      className={`text-label-data px-2 py-0.5 rounded font-bold uppercase ${
                        issue.status === 'In Progress'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>
                  <h4 className="text-body-sm font-bold text-on-surface group-hover:text-primary transition-colors">{issue.title}</h4>
                  <p className="text-label-data text-on-surface-variant line-clamp-1">{issue.distance}</p>
                </div>
              ))}
              <button className="w-full py-3 mt-2 text-primary font-bold text-body-sm border-2 border-primary/20 rounded-xl hover:bg-primary/5 transition-all">
                View All Nearby Issues
              </button>
            </div>
          </div>

          {/* AI Insight */}
          <div className="bg-gradient-to-br from-primary-container to-primary/80 p-stack-lg rounded-xl shadow-lg text-on-primary-container relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <span className="material-symbols-outlined text-[120px]">smart_toy</span>
            </div>
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">auto_awesome</span>
                <h4 className="font-bold font-title-md">Smart Twin Insight</h4>
              </div>
              <p className="text-body-sm opacity-90 leading-snug">
                Sensors detected a 15% pressure drop at the Arera Pumping Station Valve #4 at 05:40 AM today. This correlates with 4 other reports in a 500m radius.
              </p>
              <div className="pt-2">
                <span className="text-label-data font-bold uppercase tracking-wider bg-on-primary-container/20 px-2 py-1 rounded inline-block">
                  Likely Cause: Mechanical Failure
                </span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest border-t border-outline-variant mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-gutter py-stack-md w-full max-w-container-max mx-auto gap-4">
          <div className="flex items-center gap-4">
            <span className="font-title-md text-title-md font-bold text-primary">Bhopal Twin</span>
            <span className="text-body-sm text-on-surface-variant">© 2024 Bhopal Smart City Development Corp.</span>
          </div>
          <div className="flex gap-6">
            <a className="text-body-sm text-on-surface-variant hover:text-primary transition-all underline decoration-transparent hover:decoration-primary" href="#">
              Privacy Policy
            </a>
            <a className="text-body-sm text-on-surface-variant hover:text-primary transition-all underline decoration-transparent hover:decoration-primary" href="#">
              Terms of Service
            </a>
            <a className="text-body-sm text-on-surface-variant hover:text-primary transition-all underline decoration-transparent hover:decoration-primary" href="#">
              Open Data Portal
            </a>
            <a className="text-body-sm text-on-surface-variant hover:text-primary transition-all underline decoration-transparent hover:decoration-primary" href="#">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
