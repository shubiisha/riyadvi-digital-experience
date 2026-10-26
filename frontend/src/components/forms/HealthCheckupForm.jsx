import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ChevronRight, ChevronLeft, Sparkles, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import Button from '../common/Button';
import { postHealthCheckup } from '../../lib/api';

export const HealthCheckupForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    // Step 1
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    industry: 'Technology / SaaS',
    companySize: '11-50 employees',

    // Step 2
    hasWebsite: 'Yes',
    websiteUrl: '',
    websiteAge: '1-3 years old',
    isMobileFriendly: 'Yes',

    // Step 3
    currentMarketingChannels: ['SEO & Organic Search', 'LinkedIn / Social'],
    monthlyVisitors: '10,000 - 50,000',
    monthlyAdSpend: '$1,000 - $5,000',

    // Step 4
    techStack: ['React / Modern Frontend', 'Node.js / Express'],
    cloudHosting: 'AWS / Google Cloud',
    usesCrm: 'Yes',

    // Step 5
    biggestPainPoint: 'Low Conversion / Leaky Funnel',
    growthTarget: 'Double Revenue in 12 Months',
    timeline: 'Immediate (Within 30 Days)',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await postHealthCheckup(formData);
    if (res && res.success) {
      setResult(res.data);
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
      } catch {}
    } else {
      setError(res?.message || 'Error submitting diagnostic. Please retry.');
    }
    setLoading(false);
  };

  const toggleMarketingChannel = (channel) => {
    const current = formData.currentMarketingChannels;
    if (current.includes(channel)) {
      setFormData({ ...formData, currentMarketingChannels: current.filter((c) => c !== channel) });
    } else {
      setFormData({ ...formData, currentMarketingChannels: [...current, channel] });
    }
  };

  const toggleTech = (tech) => {
    const current = formData.techStack;
    if (current.includes(tech)) {
      setFormData({ ...formData, techStack: current.filter((t) => t !== tech) });
    } else {
      setFormData({ ...formData, techStack: [...current, tech] });
    }
  };

  if (result) {
    return (
      <div className="glass-card p-8 md:p-12 rounded-3xl border-gold-500/40 space-y-8 animate-fadeIn max-w-3xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-gold-500/20 border-2 border-gold-500/50 flex items-center justify-center mx-auto text-gold-400">
          <Activity className="w-10 h-10 animate-pulse" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono uppercase tracking-widest">
            Diagnostic Complete
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-3">
            Digital Health Audit: {result.companyName || formData.companyName}
          </h2>
          <p className="text-slate-400 text-sm mt-1">Classification: <span className="text-gold-400 font-semibold">{result.readinessLevel}</span></p>
        </div>

        {/* Score Ring / Gauge */}
        <div className="p-6 rounded-2xl bg-black/60 border border-gold-500/20 max-w-sm mx-auto flex items-center justify-center gap-6">
          <div className="text-5xl font-black text-gradient-gold">
            {result.digitalReadinessScore}
            <span className="text-xl text-slate-500 font-normal">/100</span>
          </div>
          <div className="text-left text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-white">Digital Maturity Index</p>
            <p className="text-emerald-400">Top 18% of Growth Contenders</p>
          </div>
        </div>

        {/* Tailored Recommendations */}
        <div className="text-left space-y-3 bg-obsidian-850 p-6 rounded-2xl border border-slate-800">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-400" />
            Recommended Growth Interventions:
          </h4>
          <ul className="space-y-2">
            {result.recommendedServices?.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button to="/contact" variant="primary" size="lg" icon={ArrowRight}>
            Book Technical Strategy Session
          </Button>
          <Button variant="outline" size="lg" onClick={() => { setResult(null); setCurrentStep(1); }}>
            Retake Diagnostic
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 md:p-10 rounded-3xl border-gold-500/20 max-w-3xl mx-auto space-y-8">
      {/* Progress Bar & Header */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
          <span>STEP {currentStep} OF {totalSteps}</span>
          <span className="text-gold-400">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gold-gradient transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="space-y-6 min-h-[300px]">
        {/* Step 1: Business Information */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gold-500 text-black text-xs font-black flex items-center justify-center">1</span>
              Business Information
            </h3>
            <p className="text-xs text-slate-400">Tell us about your organization and primary stakeholders.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Apex Global"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contact Person Name *</label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="Sarah Connor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Corporate Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah@apex.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
                >
                  <option value="Technology / SaaS">Technology / SaaS</option>
                  <option value="E-Commerce / Retail">E-Commerce / Retail</option>
                  <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                  <option value="Real Estate & Infrastructure">Real Estate & Infrastructure</option>
                  <option value="Finance & FinTech">Finance & FinTech</option>
                  <option value="Luxury & Lifestyle">Luxury & Lifestyle</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company Size</label>
                <select
                  value={formData.companySize}
                  onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
                >
                  <option value="1-10 employees">1-10 employees (Startup)</option>
                  <option value="11-50 employees">11-50 employees (Growing)</option>
                  <option value="51-200 employees">51-200 employees (Scaleup)</option>
                  <option value="200+ employees">200+ employees (Enterprise)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Website & Digital Presence */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gold-500 text-black text-xs font-black flex items-center justify-center">2</span>
              Website & Digital Presence
            </h3>
            <p className="text-xs text-slate-400">Evaluate your current consumer-facing touchpoints.</p>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Do you have an active website or web portal?</label>
              <div className="flex gap-4">
                {['Yes', 'No, in development', 'No, outdated / inactive'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData({ ...formData, hasWebsite: opt })}
                    className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                      formData.hasWebsite === opt ? 'border-gold-500 bg-gold-500/20 text-gold-300' : 'border-slate-800 bg-black/40 text-slate-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Current Website URL (if any)</label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Website Age</label>
                <select
                  value={formData.websiteAge}
                  onChange={(e) => setFormData({ ...formData, websiteAge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
                >
                  <option value="Brand New (< 1 year)">Brand New (&lt; 1 year)</option>
                  <option value="1-3 years old">1-3 years old</option>
                  <option value="3-5 years old">3-5 years old</option>
                  <option value="5+ years old (Legacy)">5+ years old (Legacy)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Is it fully mobile optimized & responsive?</label>
                <select
                  value={formData.isMobileFriendly}
                  onChange={(e) => setFormData({ ...formData, isMobileFriendly: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
                >
                  <option value="Yes">Yes, flawless mobile UX</option>
                  <option value="Moderate">Moderate, has minor glitches</option>
                  <option value="No">No, difficult on mobile screens</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Marketing & Sales */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gold-500 text-black text-xs font-black flex items-center justify-center">3</span>
              Marketing & Growth Channels
            </h3>
            <p className="text-xs text-slate-400">Select all channels currently driving your business pipeline.</p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                'SEO & Organic Search',
                'Google Paid Ads',
                'Meta / Social Ads',
                'LinkedIn B2B Outreach',
                'Email Automation & Newsletters',
                'Word of Mouth / Direct Referral',
              ].map((channel) => {
                const active = formData.currentMarketingChannels.includes(channel);
                return (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => toggleMarketingChannel(channel)}
                    className={`p-3 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                      active ? 'border-gold-500 bg-gold-500/20 text-gold-300' : 'border-slate-800 bg-black/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{channel}</span>
                    {active && <CheckCircle2 className="w-4 h-4 text-gold-400" />}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Monthly Website Visitors</label>
                <select
                  value={formData.monthlyVisitors}
                  onChange={(e) => setFormData({ ...formData, monthlyVisitors: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
                >
                  <option value="< 5,000">&lt; 5,000</option>
                  <option value="5,000 - 25,000">5,000 - 25,000</option>
                  <option value="25,000 - 100,000">25,000 - 100,000</option>
                  <option value="100,000+">100,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Monthly Digital Ad Spend</label>
                <select
                  value={formData.monthlyAdSpend}
                  onChange={(e) => setFormData({ ...formData, monthlyAdSpend: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
                >
                  <option value="$0 (Pure Organic)">$0 (Pure Organic)</option>
                  <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                  <option value="$5,000 - $20,000">$5,000 - $20,000</option>
                  <option value="$20,000+">$20,000+</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Technology & Infrastructure */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gold-500 text-black text-xs font-black flex items-center justify-center">4</span>
              Technology & Infrastructure
            </h3>
            <p className="text-xs text-slate-400">Assess code architecture, hosting, and data management.</p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                'React / Modern Frontend',
                'Next.js / SSR',
                'Node.js / Express',
                'WordPress / PHP',
                'Python / FastAPI',
                'No-Code / Webflow / Shopify',
              ].map((tech) => {
                const active = formData.techStack.includes(tech);
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={`p-3 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                      active ? 'border-gold-500 bg-gold-500/20 text-gold-300' : 'border-slate-800 bg-black/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{tech}</span>
                    {active && <CheckCircle2 className="w-4 h-4 text-gold-400" />}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cloud Hosting Platform</label>
                <select
                  value={formData.cloudHosting}
                  onChange={(e) => setFormData({ ...formData, cloudHosting: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
                >
                  <option value="AWS / Google Cloud">AWS / Google Cloud</option>
                  <option value="Vercel / Netlify Edge">Vercel / Netlify Edge</option>
                  <option value="DigitalOcean / VPS">DigitalOcean / VPS</option>
                  <option value="Shared Hosting (cPanel)">Shared Hosting (cPanel)</option>
                  <option value="None / Not Sure">None / Not Sure</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Automated CRM Connected?</label>
                <select
                  value={formData.usesCrm}
                  onChange={(e) => setFormData({ ...formData, usesCrm: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
                >
                  <option value="Yes">Yes (HubSpot, Salesforce, Zoho)</option>
                  <option value="No">No, managed via manual emails / sheets</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Business Challenges */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gold-500 text-black text-xs font-black flex items-center justify-center">5</span>
              Challenges & Growth Objectives
            </h3>
            <p className="text-xs text-slate-400">Pinpoint your critical bottlenecks and target milestones.</p>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Primary Digital Challenge</label>
              <select
                value={formData.biggestPainPoint}
                onChange={(e) => setFormData({ ...formData, biggestPainPoint: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
              >
                <option value="Low Conversion / Leaky Funnel">Low Conversion / Leaky Funnel</option>
                <option value="Outdated Brand & Visual Identity">Outdated Brand & Visual Identity</option>
                <option value="Sluggish Load Speed & Technical Debt">Sluggish Load Speed & Technical Debt</option>
                <option value="Lack of Scalable Mobile App">Lack of Scalable Mobile App</option>
                <option value="Need 3D / Spatial Product Visualization">Need 3D / Spatial Product Visualization</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Growth Milestone</label>
              <select
                value={formData.growthTarget}
                onChange={(e) => setFormData({ ...formData, growthTarget: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
              >
                <option value="Double Revenue in 12 Months">Double Revenue in 12 Months</option>
                <option value="Expand into Global / Tier-1 Markets">Expand into Global / Tier-1 Markets</option>
                <option value="Automate Customer Onboarding 10x">Automate Customer Onboarding 10x</option>
                <option value="Secure Enterprise Funding / Series A">Secure Enterprise Funding / Series A</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Desired Rollout Timeline</label>
              <select
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-white text-sm focus:border-gold-500"
              >
                <option value="Immediate (Within 30 Days)">Immediate (Within 30 Days)</option>
                <option value="1-3 Months">1-3 Months</option>
                <option value="Next Quarter Planning">Next Quarter Planning</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 6: Submission & Review */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gold-500 text-black text-xs font-black flex items-center justify-center">6</span>
              Audit Summary & Instant Computation
            </h3>
            <p className="text-xs text-slate-400">Review your parameters before our diagnostic engine evaluates your profile.</p>

            <div className="bg-obsidian-850 p-5 rounded-2xl border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Company:</span>
                <span className="font-semibold text-white">{formData.companyName || 'Not specified'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Contact:</span>
                <span className="font-semibold text-white">{formData.contactPerson} ({formData.email})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Industry:</span>
                <span>{formData.industry}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Pain Point:</span>
                <span className="text-gold-400">{formData.biggestPainPoint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Milestone:</span>
                <span>{formData.growthTarget}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed text-center">
              By submitting, your diagnostic answers will be processed by Riyadvi's enterprise evaluation engine and stored in the database.
            </p>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        {currentStep > 1 ? (
          <Button variant="ghost" size="sm" icon={ChevronLeft} iconPosition="left" onClick={handleBack}>
            Previous
          </Button>
        ) : <div />}

        {currentStep < totalSteps ? (
          <Button variant="primary" size="md" icon={ChevronRight} onClick={handleNext}>
            Continue to Step {currentStep + 1}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            loading={loading}
            icon={Sparkles}
            onClick={handleSubmit}
          >
            Compute Diagnostic Report
          </Button>
        )}
      </div>
    </div>
  );
};

export default HealthCheckupForm;
