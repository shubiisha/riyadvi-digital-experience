import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import { postContact } from '../../lib/api';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    requirement: 'Web Development',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const requirements = [
    'Web Development',
    'Mobile App Development',
    'Performance Marketing',
    'AR / VR Solutions',
    '3D Modeling & Digital Twins',
    'UI/UX Design & Design Systems',
    'Enterprise Cloud Modernization',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await postContact(formData);

    if (result && result.success) {
      setSuccess(true);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        requirement: 'Web Development',
        message: '',
      });
    } else {
      setError(result?.message || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="glass-card p-8 md:p-10 rounded-2xl border-gold-500/40 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-gold-500/20 text-gold-400 mx-auto flex items-center justify-center border border-gold-500/40">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white">Inquiry Received!</h3>
        <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
          Thank you for reaching out to Riyadvi Software Technologies. Our senior technology solutions team will review your specifications and contact you within 24 hours.
        </p>
        <Button variant="outline" size="sm" onClick={() => setSuccess(false)}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 rounded-2xl border-gold-500/20 space-y-5">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
            Your Name <span className="text-gold-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-xl bg-black/60 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
            Work Email <span className="text-gold-400">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@company.com"
            className="w-full px-4 py-3 rounded-xl bg-black/60 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="w-full px-4 py-3 rounded-xl bg-black/60 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
            Company / Organization
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Acme Corp"
            className="w-full px-4 py-3 rounded-xl bg-black/60 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
          Primary Requirement <span className="text-gold-400">*</span>
        </label>
        <select
          value={formData.requirement}
          onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors"
        >
          {requirements.map((r) => (
            <option key={r} value={r} className="bg-obsidian-900 text-white">
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
          Project Details / Challenges
        </label>
        <textarea
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Briefly describe your objectives, timelines, and technical requirements..."
          className="w-full px-4 py-3 rounded-xl bg-black/60 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500 transition-colors resize-none"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        icon={Send}
        className="w-full mt-2"
      >
        Submit Project Inquiry
      </Button>
    </form>
  );
};

export default ContactForm;
