import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, DollarSign, CheckCircle2, Award, Sparkles, Send } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ApplicationForm from '../../components/forms/ApplicationForm';
import { getJobBySlug } from '../../lib/api';

export const JobDetailPage = () => {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getJobBySlug(slug).then((data) => {
      setJob(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-36 pb-24 min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner label="Loading Position Details..." />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="pt-36 pb-24 min-h-screen bg-black text-center">
        <Container>
          <h2 className="text-3xl font-bold text-white mb-4">Position Not Found</h2>
          <p className="text-slate-400 mb-6">The specified opening is no longer accepting new applicants.</p>
          <Button to="/careers" variant="primary">
            Explore Active Careers
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-black min-h-screen">
      <Container size="wide">
        {/* Back Link */}
        <Link
          to="/careers"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-gold-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Open Roles</span>
        </Link>

        {/* Job Header */}
        <div className="glass-card p-8 md:p-12 rounded-3xl border-gold-500/20 mb-12 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono uppercase tracking-widest">
              {job.department}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Designation: <strong className="text-white font-medium">{job.designation}</strong>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {job.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-sm text-slate-300 font-mono pt-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gold-500" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gold-500" />
              {job.type} ({job.experience})
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <DollarSign className="w-4 h-4" />
              {job.salaryRange}
            </span>
          </div>
        </div>

        {/* Content & Application Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Details */}
          <div className="lg:col-span-7 space-y-10">
            {/* Overview */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-400" />
                Role Overview
              </h3>
              <p className="text-slate-300 text-base leading-relaxed">
                {job.overview}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Key Responsibilities</h3>
              <div className="space-y-2.5">
                {job.responsibilities?.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-obsidian-850 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Qualifications &amp; Requirements</h3>
              <div className="space-y-2.5">
                {job.requirements?.map((req, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-obsidian-850 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-200">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Perks */}
            {job.perks && (
              <div className="glass-card p-6 rounded-2xl border-gold-500/20 space-y-3">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-gold-400" />
                  Riyadvi Benefits &amp; Growth Perks
                </h4>
                <ul className="space-y-2">
                  {job.perks.map((p, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Application Form */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-gold-400">Direct Application</span>
              <h3 className="text-2xl font-bold text-white">Apply for this Role</h3>
            </div>
            <ApplicationForm defaultPosition={job.title} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default JobDetailPage;
