import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, Activity, FileText, Briefcase, TrendingUp, CheckCircle2, Database, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAdminMetrics } from '../../lib/api';

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    getAdminMetrics().then((res) => {
      setData(res);
      setUnauthorized(!res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingSpinner label="Aggregating System Metrics..." />;
  }

  if (unauthorized) {
    return (
      <div className="glass-card p-12 text-center rounded-2xl border-slate-800">
        <p className="text-sm font-semibold text-red-400">Administrator key rejected or expired.</p>
        <p className="text-xs text-slate-400 mt-2">Re-enter the admin secret to load live metrics.</p>
      </div>
    );
  }

  const { metrics, system, recentEnquiries, recentApplications } = data || {
    metrics: {
      totalEnquiries: 0,
      totalConsultations: 0,
      totalHealthCheckups: 0,
      totalLeadMagnets: 0,
      totalApplications: 0,
      overallLeads: 0,
    },
    system: { connected: false, type: 'Standalone Evaluation Mode' },
    recentEnquiries: [],
    recentApplications: [],
  };

  const metricCards = [
    { title: 'Total Inquiries & RFPs', count: metrics.totalEnquiries, icon: MessageSquare, color: 'text-gold-400', link: '/admin/enquiries' },
    { title: 'Consultation Bookings', count: metrics.totalConsultations, icon: Calendar, color: 'text-blue-400', link: '/admin/enquiries' },
    { title: 'Health Checkup Audits', count: metrics.totalHealthCheckups, icon: Activity, color: 'text-emerald-400', link: '/business-health-checkup' },
    { title: 'Lead Magnet Downloads', count: metrics.totalLeadMagnets, icon: FileText, color: 'text-purple-400', link: '/software-project-planning-guide' },
    { title: 'Career Job Applications', count: metrics.totalApplications, icon: Briefcase, color: 'text-amber-400', link: '/admin/applications' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* System Status Banner */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-gold-500" />
          <div>
            <p className="font-semibold text-white">Database Engine: {system?.type || 'MongoDB Enterprise Store'}</p>
            <p className="text-slate-400">{system?.connected ? 'Live MongoDB Connected' : 'Resilient High-Availability Datastore Active'}</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono">
          System Status: Operational
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              to={card.link}
              className="glass-card p-6 rounded-2xl border-slate-800 glass-card-hover flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-slate-400 font-medium">{card.title}</span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-3xl font-black text-white group-hover:text-gold-300 transition-colors">
                  {card.count}
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">Live Database Records</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Submissions Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gold-400" />
              Recent Project Inquiries
            </h3>
            <Link to="/admin/enquiries" className="text-xs font-semibold text-gold-400 hover:text-white transition-colors">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {recentEnquiries && recentEnquiries.length > 0 ? (
              recentEnquiries.slice(0, 4).map((enq) => (
                <div key={enq._id} className="p-3.5 rounded-xl bg-obsidian-850 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{enq.name} ({enq.company || 'Private'})</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-gold-500/10 text-gold-400 border border-gold-500/20">
                      {enq.status || 'New'}
                    </span>
                  </div>
                  <p className="text-slate-400 truncate">{enq.requirement}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No inquiries logged yet.</p>
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gold-400" />
              Recent Talent Applications
            </h3>
            <Link to="/admin/applications" className="text-xs font-semibold text-gold-400 hover:text-white transition-colors">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {recentApplications && recentApplications.length > 0 ? (
              recentApplications.slice(0, 4).map((app) => (
                <div key={app._id} className="p-3.5 rounded-xl bg-obsidian-850 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{app.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {app.status || 'Applied'}
                    </span>
                  </div>
                  <p className="text-slate-400">{app.position}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No applications logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
