import React from 'react';
import Container from '../../../components/common/Container';
import SectionHeading from '../../../components/common/SectionHeading';
import TechnologyOrbit from '../../../components/3d/TechnologyOrbit';

export const TechnologySection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-black via-obsidian-900/60 to-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gold-glow opacity-30 blur-3xl pointer-events-none" />

      <Container size="wide" className="relative z-10">
        <SectionHeading
          badge="Technology Ecosystem"
          title="Engineered With"
          highlight="Next-Gen Architecture"
          description="Explore our interactive 3D technology constellation. Drag to rotate the orbital sphere or click on nodes to inspect our engineering stack."
        />

        <TechnologyOrbit />
      </Container>
    </section>
  );
};

export default TechnologySection;
