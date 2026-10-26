import React, { useState, useEffect } from 'react';
import { Mail, Phone, Building, Calendar, Tag, Check, Filter } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAdminEnquiries } from '../../lib/api';
import { formatDate } from '../../lib/utils';

export const EnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    getAdminEnquiries().then((data) => {
      setEnquiries(data || []);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setEnquiries((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
    );
  };

  const filtered = enquiries.filter((e) => {
    if (statusFilter === 'All') return true;
    return e.status === statusFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Project Enquiries &amp; RFPs</h2>
          <p className="text-xs text-slate-400">Manage client inbound requirements, dates, and engagement status.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Status:</span>
          {['All', 'New', 'In Progress', 'Contacted', 'Closed'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                statusFilter === s
                  ? 'border-gold-500 bg-gold-500/20 text-gold-300'
                  : 'border-slate-800 bg-obsidian-850 text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Retrieving Inquiries..." />
      ) : (
        <div className="space-y-4">
          {filtered.map((enq) => (
            <div
              key={enq._id}
              className="glass-card p-6 rounded-2xl border-slate-800 space-y-4 hover:border-gold-500/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-white">{enq.name}</h3>
                  {enq.company && (
                    <span className="text-xs px-2.5 py-0.5 rounded bg-black border border-slate-800 text-slate-300 font-mono">
                      {enq.company}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">
                    {formatDate(enq.createdAt)}
                  </span>

                  <select
                    value={enq.status || 'New'}
                    onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-black border border-slate-700 text-gold-400 text-xs font-mono focus:border-gold-500"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Requirement & Message */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-gold-400 font-mono">
                  Requirement: <span className="text-white">{enq.requirement}</span>
                </p>
                {enq.message && (
                  <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-slate-800/80">
                    "{enq.message}"
                  </p>
                )}
              </div>

              {/* Contact meta footer */}
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400 border-t border-slate-900">
                <a href={`mailto:${enq.email}`} className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-gold-500" />
                  {enq.email}
                </a>
                {enq.phone && (
                  <a href={`tel:${enq.phone}`} className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-gold-500" />
                    {enq.phone}
                  </a>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="glass-card p-12 text-center rounded-2xl border-slate-800 text-xs text-slate-500">
              No inquiries found in this status category.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnquiriesPage;
