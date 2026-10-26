import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, AlertCircle, UploadCloud } from 'lucide-react';
import Button from '../common/Button';
import { postJobApplication } from '../../lib/api';

export const ApplicationForm = ({ defaultPosition = 'Senior Full Stack Engineer (React + Node.js)' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: defaultPosition,
    experienceYears: '3-5 years',
    portfolioUrl: '',
    resumeUrl: '',
    coverLetter: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await postJobApplication(formData);
    if (res && res.success) {
      setSuccess(true);
      try {
        confetti({ particleCount: 80, spread: 60 });
      } catch {}
    } else {
      setError(res?.message || 'Error submitting application. Please retry.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="glass-card p-8 md:p-10 rounded-2xl border-gold-500/40 text-center space-y-4 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-gold-500/20 text-gold-400 mx-auto flex items-center justify-center border border-gold-500/40">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white">Application Submitted!</h3>
        <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
          Thank you for applying for <span className="text-gold-400 font-semibold">{formData.position}</span> at Riyadvi Software Technologies. Our talent acquisitions team will review your portfolio and reach out.
        </p>
        <Button variant="outline" size="sm" onClick={() => setSuccess(false)}>
          Submit Another Application
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
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">Full Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">Email Address *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">Phone Number *</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">Target Position *</label>
          <input
            type="text"
            required
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">Years of Experience</label>
          <select
            value={formData.experienceYears}
            onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
          >
            <option value="1-2 years">1-2 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5-8 years">5-8 years</option>
            <option value="8+ years">8+ years</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">Portfolio / GitHub / LinkedIn</label>
          <input
            type="url"
            value={formData.portfolioUrl}
            onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">
          Resume Link (Google Drive / Dropbox / Hosted PDF)
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.resumeUrl}
            onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
            placeholder="https://drive.google.com/file/d/your-resume-link"
            className="w-full px-3.5 py-2.5 pl-10 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
          />
          <UploadCloud className="w-4 h-4 text-gold-500 absolute left-3.5 top-3 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">
          Why Riyadvi? (Cover Letter / Message)
        </label>
        <textarea
          rows={3}
          value={formData.coverLetter}
          onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
          placeholder="Share your technical passions and what excites you about building high-impact products..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500 resize-none"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        loading={loading}
        icon={Send}
        className="w-full mt-2"
      >
        Submit Job Application
      </Button>
    </form>
  );
};

export default ApplicationForm;
