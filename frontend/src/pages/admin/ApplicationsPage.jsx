import React, { useState, useEffect } from 'react';
import { Mail, Phone, ExternalLink, Briefcase, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAdminApplications } from '../../lib/api';
import { formatDate } from '../../lib/utils';

export const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminApplications().then((data) => {
      setApplications(data || []);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white">Talent &amp; Career Applications</h2>
        <p className="text-xs text-slate-400">Review engineering candidates, resume links, and hiring pipeline status.</p>
      </div>

      {loading ? (
        <LoadingSpinner label="Retrieving Applications..." />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="glass-card p-6 rounded-2xl border-slate-800 space-y-4 hover:border-gold-500/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">{app.name}</h3>
                  <span className="text-xs text-gold-400 font-mono font-semibold">
                    Position: {app.position}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">{formatDate(app.createdAt)}</span>
                  <select
                    value={app.status || 'Applied'}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-black border border-slate-700 text-blue-400 text-xs font-mono focus:border-gold-500"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {app.coverLetter && (
                <div className="text-xs text-slate-300 bg-black/40 p-3 rounded-xl border border-slate-800/80">
                  <p className="text-[10px] uppercase font-mono text-slate-500 mb-1">Candidate Note:</p>
                  <p className="italic">"{app.coverLetter}"</p>
                </div>
              )}

              {/* Meta & Links */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 border-t border-slate-900">
                <div className="flex flex-wrap gap-4">
                  <a href={`mailto:${app.email}`} className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-gold-500" />
                    {app.email}
                  </a>
                  {app.phone && (
                    <a href={`tel:${app.phone}`} className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
                      <Phone className="w-3.5 h-3.5 text-gold-500" />
                      {app.phone}
                    </a>
                  )}
                  {app.experienceYears && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-500" />
                      Exp: {app.experienceYears}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-gold-400 hover:text-white font-mono font-medium underline"
                    >
                      <span>View Resume / CV</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {applications.length === 0 && (
            <div className="glass-card p-12 text-center rounded-2xl border-slate-800 text-xs text-slate-500">
              No job applications currently on file.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
