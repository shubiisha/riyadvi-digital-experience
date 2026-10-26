import React from 'react';
import HeroSection from './sections/HeroSection';
import TransformationSection from './sections/TransformationSection';
import ServicesSection from './sections/ServicesSection';
import TechnologySection from './sections/TechnologySection';
import PortfolioSection from './sections/PortfolioSection';
import WhyRiyadviSection from './sections/WhyRiyadviSection';
import CTASection from './sections/CTASection';

export const HomePage = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <TransformationSection />
      <ServicesSection />
      <TechnologySection />
      <PortfolioSection />
      <WhyRiyadviSection />
      <CTASection />
    </div>
  );
};

export default HomePage;
