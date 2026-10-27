import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import HomePage from '../pages/home/HomePage';

/**
 * Route-level code splitting.
 * Every non-critical page is loaded on demand so the initial bundle stays
 * small and heavy 3D pages do not block first paint.
 */
const ServicesPage = lazy(() => import('../pages/services/ServicesPage'));
const ServiceDetailPage = lazy(() => import('../pages/services/ServiceDetailPage'));
const PortfolioPage = lazy(() => import('../pages/portfolio/PortfolioPage'));
const CaseStudyPage = lazy(() => import('../pages/portfolio/CaseStudyPage'));
const AboutPage = lazy(() => import('../pages/about/AboutPage'));
const BlogPage = lazy(() => import('../pages/blog/BlogPage'));
const BlogArticlePage = lazy(() => import('../pages/blog/BlogArticlePage'));
const CareersPage = lazy(() => import('../pages/careers/CareersPage'));
const JobDetailPage = lazy(() => import('../pages/careers/JobDetailPage'));
const ContactPage = lazy(() => import('../pages/contact/ContactPage'));
const HealthCheckupPage = lazy(() => import('../pages/health-checkup/HealthCheckupPage'));
const ProjectGuidePage = lazy(() => import('../pages/project-guide/ProjectGuidePage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Admin
const AdminLayout = lazy(() => import('../pages/admin/AdminLayout'));
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const EnquiriesPage = lazy(() => import('../pages/admin/EnquiriesPage'));
const ApplicationsPage = lazy(() => import('../pages/admin/ApplicationsPage'));

const RouteFallback = () => (
  <div className="min-h-screen bg-obsidian-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-2 border-gold-500/20 border-t-gold-500 animate-spin" />
      <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Loading</span>
    </div>
  </div>
);

export const AppRouter = () => {
  return (
    <PageTransition>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Core Multi-Page Routes */}
          <Route path="/" element={<HomePage />} />

          {/* Services & Dynamic Architecture */}
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />

          {/* Portfolio & Dynamic Case Studies */}
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:slug" element={<CaseStudyPage />} />

          {/* Company & Knowledge */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogArticlePage />} />

          {/* Careers */}
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/:slug" element={<JobDetailPage />} />

          {/* Lead Generation & Contact */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/business-health-checkup" element={<HealthCheckupPage />} />
          <Route path="/software-project-planning-guide" element={<ProjectGuidePage />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="enquiries" element={<EnquiriesPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </PageTransition>
  );
};

export default AppRouter;
