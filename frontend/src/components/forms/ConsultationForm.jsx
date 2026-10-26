import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import { postConsultation } from '../../lib/api';

export const ConsultationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    preferredDate: '',
    preferredTime: '10:00 AM - 11:00 AM IST',
    budgetRange: '$10k - $25k',
    serviceInterested: 'Full-Stack Web Development',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const timeSlots = [
    '10:00 AM - 11:00 AM IST',
    '02:00 PM - 03:00 PM IST',
    '04:30 PM - 05:30 PM IST',
    '07:00 PM - 08:00 PM IST (US Friendly)',
  ];

  const budgetOptions = [
    '< $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000 - $100,000+',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await postConsultation(formData);
    if (res && res.success) {
      setSuccess(true);
      try {
        confetti({ particleCount: 75, spread: 60 });
      } catch {}
    } else {
      setError(res?.message || 'Failed to book consultation. Please try again.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="glass-card p-8 rounded-2xl border-gold-500/40 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-gold-500/20 text-gold-400 mx-auto flex items-center justify-center border border-gold-500/40">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white">Consultation Reserved!</h3>
        <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
          We have blocked time on our solutions engineering calendar for {formData.preferredDate || 'upcoming session'}. An invite and Google Meet link have been prepared for {formData.email}.
        </p>
        <Button variant="outline" size="sm" onClick={() => setSuccess(false)}>
          Schedule Another Slot
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl border-gold-500/20 space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">
            Name <span className="text-gold-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Jane Smith"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">
            Email <span className="text-gold-400">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jane@company.com"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">
            Preferred Date
          </label>
          <input
            type="date"
            value={formData.preferredDate}
            onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">
            Preferred Time Slot
          </label>
          <select
            value={formData.preferredTime}
            onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
          >
            {timeSlots.map((s) => (
              <option key={s} value={s} className="bg-obsidian-900 text-white">{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">
            Budget Range
          </label>
          <select
            value={formData.budgetRange}
            onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
          >
            {budgetOptions.map((b) => (
              <option key={b} value={b} className="bg-obsidian-900 text-white">{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Enterprise Inc."
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        loading={loading}
        icon={Calendar}
        className="w-full mt-2"
      >
        Confirm 1-on-1 Consultation
      </Button>
    </form>
  );
};

export default ConsultationForm;
