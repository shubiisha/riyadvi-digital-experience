import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Clock, ArrowRight, Sparkles, Filter } from 'lucide-react';
import Container from '../../components/common/Container';
import SectionHeading from '../../components/common/SectionHeading';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getJobs } from '../../lib/api';

export const CareersPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [department, setDepartment] = useState('All');
  const [designation, setDesignation] = useState('All');
  const [experience, setExperience] = useState('All');

  const departments = ['All', 'Engineering', 'Creative Technology', 'Design'];
  const designations = ['All', 'Senior Lead', 'Specialist', 'Senior Designer'];
  const experiences = ['All', '2-5', '3-6', '4-7'];

  useEffect(() => {
    setLoading(true);
    getJobs({ department, designation, experience }).then((data) => {
      setJobs(data || []);
      setLoading(false);
    });
  }, [department, designation, experience]);

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <Container size="wide">
        <SectionHeading
          badge="Careers at Riyadvi Software Technologies"
          title="Build the Future of"
          highlight="3D & Full-Stack Web"
          description="We are assembling an elite team of engineers, spatial computing specialists, and visual perfectionists. Join us in setting global standards."
        />

        {/* Filter Bar */}
        <div className="glass-card p-6 rounded-2xl border-slate-800 mb-12 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-gold-400 uppercase tracking-widest">
            <Filter className="w-3.5 h-3.5" />
            Filter Career Opportunities
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-800 text-white text-xs focus:border-gold-500"
              >
                {departments.map((d) => (
                  <option key={d} value={d} className="bg-obsidian-900 text-white">{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Designation</label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-800 text-white text-xs focus:border-gold-500"
              >
                {designations.map((d) => (
                  <option key={d} value={d} className="bg-obsidian-900 text-white">{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Experience Bracket</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-800 text-white text-xs focus:border-gold-500"
              >
                {experiences.map((exp) => (
                  <option key={exp} value={exp} className="bg-obsidian-900 text-white">{exp === 'All' ? 'All Experience Levels' : `${exp} Years`}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Job Listings Grid */}
        {loading ? (
          <LoadingSpinner label="Loading Open Roles..." />
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job.slug}
                className="glass-card p-6 sm:p-8 rounded-3xl border-slate-800 glass-card-hover group flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400">
                      {job.department}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-300">{job.experience}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-emerald-400 font-semibold">{job.salaryRange}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-gold-300 transition-colors">
                    {job.title}
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {job.overview}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold-500" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold-500" />
                      {job.type}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-3 shrink-0">
                  <Button to={`/careers/${job.slug}`} variant="primary" size="md" icon={ArrowRight}>
                    View Role &amp; Apply
                  </Button>
                </div>
              </div>
            ))}

            {jobs.length === 0 && (
              <div className="glass-card p-12 text-center rounded-2xl border-slate-800 space-y-3">
                <Briefcase className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-lg font-bold text-white">No Positions Match Your Current Filters</h4>
                <p className="text-xs text-slate-400">Try broadening your department or experience selection.</p>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default CareersPage;
