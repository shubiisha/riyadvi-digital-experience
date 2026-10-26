import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';

// Pages
import HomePage from '../pages/home/HomePage';
import ServicesPage from '../pages/services/ServicesPage';
import ServiceDetailPage from '../pages/services/ServiceDetailPage';
import PortfolioPage from '../pages/portfolio/PortfolioPage';
import CaseStudyPage from '../pages/portfolio/CaseStudyPage';
import AboutPage from '../pages/about/AboutPage';
import BlogPage from '../pages/blog/BlogPage';
import BlogArticlePage from '../pages/blog/BlogArticlePage';
import CareersPage from '../pages/careers/CareersPage';
import JobDetailPage from '../pages/careers/JobDetailPage';
import ContactPage from '../pages/contact/ContactPage';
import HealthCheckupPage from '../pages/health-checkup/HealthCheckupPage';
import ProjectGuidePage from '../pages/project-guide/ProjectGuidePage';
import NotFoundPage from '../pages/NotFoundPage';

// Admin
import AdminLayout from '../pages/admin/AdminLayout';
import DashboardPage from '../pages/admin/DashboardPage';
import EnquiriesPage from '../pages/admin/EnquiriesPage';
import ApplicationsPage from '../pages/admin/ApplicationsPage';

export const AppRouter = () => {
  return (
    <PageTransition>
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
    </PageTransition>
  );
};

export default AppRouter;
