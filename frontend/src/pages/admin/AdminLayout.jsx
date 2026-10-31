import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Briefcase, ArrowLeft, ShieldCheck, KeyRound, LogOut, FileJson } from 'lucide-react';
import Container from '../../components/common/Container';
import {
  getAdminKey,
  setAdminKey,
  clearAdminKey,
  validateAdminKey,
  onAdminUnauthorized,
} from '../../lib/api';

/**
 * Admin gate: the operator must supply the backend `ADMIN_SECRET_KEY` before any
 * admin data is requested. The key is validated against /api/admin/metrics and
 * is never hard-coded into the frontend bundle.
 */
const AdminGate = ({ onAuthenticated }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setChecking(true);
    const result = await validateAdminKey(key.trim());
    setChecking(false);

    if (result.ok) {
      setAdminKey(key.trim());
      onAuthenticated();
      return;
    }
    if (result.reason === 'network') {
      setError('Unable to reach the admin API. Confirm the backend is running and try again.');
    } else if (result.reason === 'error') {
      setError('The admin API responded with an unexpected error. Try again shortly.');
    } else {
      setError('Invalid administrator key. Check the ADMIN_SECRET_KEY configured on the server.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl border-slate-800 space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-gold-400" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">Restricted Access</h2>
            <p className="text-xs text-slate-400">Enter the administrator key to continue.</p>
          </div>
        </div>

        <div>
          <label htmlFor="admin-key" className="block text-xs font-mono text-slate-400 mb-2">
            ADMIN SECRET KEY
          </label>
          <input
            id="admin-key"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="••••••••••••••••"
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-xl bg-black border border-slate-800 text-white text-sm font-mono focus:border-gold-500 focus:outline-none transition-colors"
          />
        </div>

        {error && (
          <p role="alert" className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={checking || !key.trim()}
          className="w-full py-3 rounded-xl bg-gold-500 text-black font-bold text-sm hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {checking ? 'Verifying...' : 'Unlock Dashboard'}
        </button>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          The key is validated server-side against the <span className="font-mono text-slate-400">ADMIN_SECRET_KEY</span>{' '}
          environment variable. Requests without a valid key are rejected with HTTP 401.
        </p>
      </form>
    </div>
  );
};

export const AdminLayout = () => {
  const [authenticated, setAuthenticated] = useState(() => Boolean(getAdminKey()));

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', end: true, icon: LayoutDashboard },
    { name: 'Enquiries & RFPs', path: '/admin/enquiries', icon: MessageSquare },
    { name: 'Job Applications', path: '/admin/applications', icon: Briefcase },
    { name: 'Content Studio', path: '/admin/content', icon: FileJson },
  ];

  // A 401 from any admin request drops the session back to the key gate.
  useEffect(() => {
    return onAdminUnauthorized(() => {
      clearAdminKey();
      setAuthenticated(false);
    });
  }, []);

  const handleSignOut = useCallback(() => {
    clearAdminKey();
    setAuthenticated(false);
  }, []);

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

          <div className="flex items-center gap-4">
            {authenticated && (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-gold-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Public Site</span>
            </Link>
          </div>
        </div>

        {!authenticated ? (
          <AdminGate onAuthenticated={() => setAuthenticated(true)} />
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex gap-2 p-1.5 rounded-2xl bg-obsidian-850 border border-slate-800 mb-8 max-w-3xl">
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
          </>
        )}
      </Container>
    </div>
  );
};

export default AdminLayout;
