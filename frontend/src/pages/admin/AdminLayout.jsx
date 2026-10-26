import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Briefcase, Activity, FileText, ArrowLeft, ShieldCheck } from 'lucide-react';
import Container from '../../components/common/Container';

export const AdminLayout = () => {
  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', end: true, icon: LayoutDashboard },
    { name: 'Enquiries & RFPs', path: '/admin/enquiries', icon: MessageSquare },
    { name: 'Job Applications', path: '/admin/applications', icon: Briefcase },
  ];

  return (
    <div className="pt-24 pb-24 bg-black min-h-screen text-slate-100">
      <Container size="wide">
        {/* Admin Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-gold-400">Riyadvi Internal Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2 mt-1">
              <ShieldCheck className="w-7 h-7 text-gold-400" />
              Executive Admin Portal
            </h1>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Site</span>
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1.5 rounded-2xl bg-obsidian-850 border border-slate-800 mb-8 max-w-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex-1 justify-center ${
                    isActive
                      ? 'bg-gold-500 text-black shadow-gold-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Child Views */}
        <Outlet />
      </Container>
    </div>
  );
};

export default AdminLayout;
