import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Calendar, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import Container from '../../components/common/Container';
import SectionHeading from '../../components/common/SectionHeading';
import ContactForm from '../../components/forms/ContactForm';
import ConsultationForm from '../../components/forms/ConsultationForm';

export const ContactPage = () => {
  const [activeTab, setActiveTab] = useState('inquiry'); // 'inquiry' | 'consultation'

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gold-glow opacity-30 blur-3xl pointer-events-none" />

      <Container size="wide" className="relative z-10">
        <SectionHeading
          badge="Connect With Our Leadership"
          title="Let's Initiate Your"
          highlight="Digital Evolution"
          description="Whether you have an immediate RFP, require technical architectural scoping, or want a 1-on-1 strategy session, our solutions team is at your service."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contact & Integrations */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick Contact Cards */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border-gold-500/20 space-y-6">
              <h3 className="text-xl font-bold text-white">Direct Communication Channels</h3>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/20">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-mono">General &amp; Enterprise RFPs</p>
                    <a href="mailto:contact@riyadvisoftwaretechnologies.com" className="font-semibold text-white hover:text-gold-400 transition-colors">
                      contact@riyadvisoftwaretechnologies.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/20">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-mono">Direct Phone Hotline</p>
                    <a href="tel:+919845012890" className="font-semibold text-white hover:text-gold-400 transition-colors">
                      +91 98450 12890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/20">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-mono">Engineering Centers</p>
                    <p className="font-medium text-white">Bengaluru &amp; Hyderabad, India</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct chat integration */}
              <div className="pt-4 border-t border-slate-900 space-y-3">
                <a
                  href="https://wa.me/919845012890?text=Hello%20Riyadvi%20Team%2C%20I%20would%20like%20to%20discuss%20a%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Instant WhatsApp Solutions Desk
                </a>

                <a
                  href="https://calendly.com/riyadvisoftware"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl border border-gold-500/30 bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Calendar className="w-4 h-4 text-gold-400" />
                  Book via Direct Calendly Calendar
                </a>
              </div>
            </div>

            {/* Guarantees */}
            <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                The Riyadvi Client Guarantee
              </h4>
              <ul className="text-xs text-slate-400 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  Mutual Non-Disclosure Agreement (NDA) executed before deep discovery.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  Written technical scope estimate returned within 24 business hours.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  Direct access to Principal Architects—no intermediary sales account reps.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive Tabbed Form (Contact Form vs Consultation Booking) */}
          <div className="lg:col-span-7">
            {/* Form Mode Selector */}
            <div className="flex p-1.5 rounded-2xl bg-obsidian-850 border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('inquiry')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'inquiry'
                    ? 'bg-gold-500 text-black shadow-gold-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Submit Project RFP / Inquiry
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('consultation')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'consultation'
                    ? 'bg-gold-500 text-black shadow-gold-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Schedule Free 1-on-1 Consultation
              </button>
            </div>

            {/* Active Form */}
            {activeTab === 'inquiry' ? <ContactForm /> : <ConsultationForm />}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;
