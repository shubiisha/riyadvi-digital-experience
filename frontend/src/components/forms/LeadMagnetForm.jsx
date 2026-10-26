import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Download, CheckCircle2, FileText, AlertCircle, Sparkles } from 'lucide-react';
import Button from '../common/Button';
import { postLeadMagnet } from '../../lib/api';

export const LeadMagnetForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await postLeadMagnet(formData);
    if (res && res.success) {
      setDownloadReady(true);
      try {
        confetti({ particleCount: 80, spread: 65, origin: { y: 0.6 } });
      } catch {}
    } else {
      setError(res?.message || 'Error processing download request. Please retry.');
    }
    setLoading(false);
  };

  const handleSimulatedDownload = () => {
    // Generate text/markdown file download blob
    const content = `# RIYADVI SOFTWARE TECHNOLOGIES
## Comprehensive Software Project Planning Guide (2025 Edition)

Thank you for downloading this blueprint, ${formData.name || 'Visionary Leader'}!

### Key Architecture Milestones:
1. Product Discovery & Problem Definition
2. High-Converting UX Wireframing & Design Systems
3. Scalable Full-Stack Engineering (React + Node.js + Microservices)
4. Interactive 3D & WebGL Engagement Strategy
5. CI/CD Zero-Downtime Deployment
6. Conversion Rate Optimization & Enterprise Analytics

Need tailored execution? Connect with us:
Website: https://riyadvisoftwaretechnologies.com
Email: contact@riyadvisoftwaretechnologies.com
Phone: +91 98450 12890
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Riyadvi_Software_Project_Planning_Guide_2025.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (downloadReady) {
    return (
      <div className="glass-card p-8 md:p-10 rounded-2xl border-gold-500/40 text-center space-y-5 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white">Your Guide is Ready!</h3>
        <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
          We have registered your corporate copy of the <span className="text-gold-400 font-semibold">Software Project Planning Guide 2025</span> and dispatched access details to {formData.email}.
        </p>

        <div className="p-4 rounded-xl bg-obsidian-850 border border-slate-800 max-w-sm mx-auto flex items-center gap-3 text-left">
          <FileText className="w-8 h-8 text-gold-400 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-white">Riyadvi_Project_Planning_Guide_2025.pdf</p>
            <p className="text-slate-400">48 Pages • Enterprise Edition • 4.2 MB</p>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            icon={Download}
            onClick={handleSimulatedDownload}
          >
            Download Guide PDF Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl border-gold-500/30 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-gold-400" />
        <span className="text-xs font-mono uppercase tracking-widest text-gold-400">Instant Access</span>
      </div>

      <h4 className="text-xl font-bold text-white">Download Free Executive Guide</h4>
      <p className="text-xs text-slate-400">
        Enter your details to receive our 48-page enterprise blueprint on software estimation, 3D web adoption, and tech stack selection.
      </p>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Alex Mercer"
          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">Company / Organization *</label>
        <input
          type="text"
          required
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder="Tech Innovations Ltd"
          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">Work Email *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="alex@techinnovations.com"
          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+91 98765 43210"
          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        loading={loading}
        icon={Download}
        className="w-full mt-2"
      >
        Unlock & Download Blueprint
      </Button>

      <p className="text-[10px] text-slate-500 text-center">
        Zero spam guarantee. We respect your privacy and never share your data.
      </p>
    </form>
  );
};

export default LeadMagnetForm;
