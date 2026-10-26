const Service = require('../src/models/Service');
const Project = require('../src/models/Project');
const BlogPost = require('../src/models/BlogPost');
const Job = require('../src/models/Job');
const ContactEnquiry = require('../src/models/ContactEnquiry');
const Consultation = require('../src/models/Consultation');
const HealthCheckup = require('../src/models/HealthCheckup');
const LeadMagnet = require('../src/models/LeadMagnet');
const JobApplication = require('../src/models/JobApplication');

const initialServices = [
  {
    slug: 'web-development',
    title: 'Custom Web & Enterprise WebApps',
    tagline: 'High-performance, scalable web systems engineered for business growth.',
    description: 'We architect and build full-stack web platforms using modern React, Next.js, Node.js, and cloud native architectures tailored for high concurrency, security, and exceptional user delight.',
    icon: 'Globe',
    problem: 'Outdated legacy architectures, slow load times, poor conversion funnels, and unscalable monoliths impairing growth.',
    solution: 'Engineered modular web apps featuring reactive UI, micro-frontends, edge-caching, and ultra-secure REST/GraphQL backends.',
    keyFeatures: [
      'Next-generation React / Vite / Next.js reactive frontend',
      'Ultra-fast server response and sub-second Core Web Vitals',
      'Cloud-native backend API microservices (Node/Express/Cloud)',
      'Enterprise role-based security and OAuth 2.0 / JWT integration',
      'SEO-dominant SSR & SSG indexing capability',
    ],
    industryUseCases: ['Enterprise SaaS', 'High-Growth Fintech', 'Healthcare Portals', 'Omnichannel E-commerce'],
    technologyStack: ['React.js', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'MongoDB', 'Docker'],
    process: [
      { step: 1, name: 'Architecture Blueprint', desc: 'System modeling, user journey mapping, and technical feasibility audit.' },
      { step: 2, name: 'Interactive Prototyping', desc: 'Figma high-fidelity interactive wireframing and design tokenization.' },
      { step: 3, name: 'Sprint Engineering', desc: 'Agile 2-week iterations with continuous integration and automated test suites.' },
      { step: 4, name: 'Cloud Deployment', desc: 'Zero-downtime deployment, CDN edge caching, and automated telemetry.' },
    ],
    relatedPortfolioSlugs: ['puratap', 'wanaromah', 'nugenica-biotech'],
  },
  {
    slug: 'app-development',
    title: 'Cross-Platform Mobile Application Development',
    tagline: 'Fluid iOS and Android experiences tailored for consumer and enterprise retention.',
    description: 'We develop native and cross-platform mobile applications using Flutter and React Native, delivering 60 FPS silky interactions, offline resilience, and robust biometric security.',
    icon: 'Smartphone',
    problem: 'Segmented codebase overhead, fragmented OS performance, high user churn rates, and sluggish offline functionality.',
    solution: 'Unified single-codebase architectures with native compilation, background sync, and delightful micro-interactions.',
    keyFeatures: [
      'Native-feel 60 FPS performance on iOS and Android',
      'Offline-first data sync with local encrypted caching',
      'Push notification automation with contextual deep linking',
      'Seamless hardware integration (Biometrics, Camera, Bluetooth, GPS)',
      'Automated App Store & Google Play release pipelines',
    ],
    industryUseCases: ['On-Demand Services', 'Healthcare & Telemedicine', 'Fintech Wallets', 'Field Service Management'],
    technologyStack: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'GraphQL', 'Redux Toolkit'],
    process: [
      { step: 1, name: 'Product Scope & User Flow', desc: 'Defining user archetypes and core conversion loops.' },
      { step: 2, name: 'UX/UI & Prototype', desc: 'Mobile-first component design with touch ergonomics.' },
      { step: 3, name: 'Core Engine Build', desc: 'State architecture, native bridge bindings, and API connectors.' },
      { step: 4, name: 'Store Submission & Launch', desc: 'App review compliance, beta flight testing, and analytics.' },
    ],
    relatedPortfolioSlugs: ['visdoc', 'sivam-physio', 'cube-dental'],
  },
  {
    slug: 'digital-marketing',
    title: 'Performance Digital Marketing & Growth Engineering',
    tagline: 'Data-backed acquisition and conversion ecosystems that maximize ROI.',
    description: 'We combine rigorous analytics, search engine dominance, high-converting funnel architecture, and performance paid campaigns to turn digital visibility into predictable revenue.',
    icon: 'TrendingUp',
    problem: 'Wasted ad budget, rising customer acquisition costs (CAC), unmeasurable attribution, and leaky conversion funnels.',
    solution: 'Full-funnel growth engineering with conversion rate optimization (CRO), multi-touch attribution, and algorithmic bidding.',
    keyFeatures: [
      'Multi-touch attribution modeling and conversion tracking',
      'Hyper-targeted search & social advertising (Google, Meta, LinkedIn)',
      'Technical SEO audit and high-authority content strategy',
      'Automated email lifecycle sequences and lead nurturing',
      'Continuous A/B testing and landing page conversion optimization',
    ],
    industryUseCases: ['Direct-to-Consumer Brands', 'B2B Professional Services', 'Luxury Lifestyle & Salons', 'Real Estate'],
    technologyStack: ['Google Analytics 4', 'Meta Pixel', 'Semrush', 'HubSpot', 'Segment', 'Hotjar'],
    process: [
      { step: 1, name: 'Audience & Channel Audit', desc: 'Competitive research and persona profiling.' },
      { step: 2, name: 'Funnel Engineering', desc: 'High-converting landing pages, lead magnets, and tracking tags.' },
      { step: 3, name: 'Campaign Launch & Scale', desc: 'Multi-variant testing and automated bid optimization.' },
      { step: 4, name: 'Iterative Refinement', desc: 'Weekly cohort analysis, CAC reduction, and LTV enhancement.' },
    ],
    relatedPortfolioSlugs: ['tony-and-guy', 'studio11', 'pearl-housing'],
  },
  {
    slug: 'ar-vr',
    title: 'Immersive AR & VR Spatial Experiences',
    tagline: 'Step beyond flat screens into photorealistic spatial computing.',
    description: 'From web-based WebXR applications to fully interactive virtual showrooms and training simulations, we build spatial experiences that captivate clients and empower decision-making.',
    icon: 'Layers',
    problem: 'Inability to visualize complex 3D products remotely, high physical showroom overhead, and static catalog fatigue.',
    solution: 'WebXR zero-install augmented reality viewer and immersive spatial walkthroughs that run directly in any modern browser.',
    keyFeatures: [
      'Zero-install WebXR directly accessible via mobile Safari & Chrome',
      'Spatial lighting estimation and real-world surface anchoring',
      'Virtual product try-ons and real-time customizers',
      'Photorealistic PBR textures and optimized 3D geometry',
      'Cross-headset compatibility (Apple Vision Pro, Meta Quest, Vive)',
    ],
    industryUseCases: ['Luxury Fragrances & Retail', 'High-End Architecture & Real Estate', 'Industrial Training', 'Automotive'],
    technologyStack: ['Three.js', 'WebXR', 'React Three Fiber', 'A-Frame', 'Blender', 'GLTF/USDZ', 'Unity'],
    process: [
      { step: 1, name: 'Spatial Concept & Storyboard', desc: 'Defining the 3D environment and interaction parameters.' },
      { step: 2, name: '3D Asset Optimization', desc: 'Low-poly retopology, baking 4K PBR maps, and GLTF Draco compression.' },
      { step: 3, name: 'Interaction Logic', desc: 'Raycasting, pinch-to-scale, spatial audio, and physics implementation.' },
      { step: 4, name: 'Cross-Device Deployment', desc: 'Testing across mobile iOS AR QuickLook, Android SceneViewer, and WebGL.' },
    ],
    relatedPortfolioSlugs: ['wanaromah', 'pearl-housing'],
  },
  {
    slug: '3d-modeling',
    title: 'Photorealistic 3D Modeling & Digital Twins',
    tagline: 'High-fidelity 3D assets, product visualizations, and digital twin simulation.',
    description: 'Our 3D studio crafts game-ready and WebGL-optimized 3D assets, architectural visualizations, and animated product teasers that bring digital concepts to breathtaking life.',
    icon: 'Box',
    problem: 'Extremely high costs of traditional photography/videography, static flat images failing to convey product craftsmanship.',
    solution: 'Digital twin generation, interactive 360-degree exploded product views, and cinematic WebGL rendering.',
    keyFeatures: [
      'Sub-millimeter accurate CAD to polygonal mesh retopology',
      'Substance Painter PBR procedural texturing and micro-details',
      'Real-time WebGL asset optimization with Draco compression',
      'Configurable materials (metallic, glass, matte, leather, carbon fiber)',
      'Cinematic lighting setup and real-time render shaders',
    ],
    industryUseCases: ['Consumer Electronics', 'Luxury Goods & Perfumery', 'Industrial Machinery', 'Medical Devices'],
    technologyStack: ['Blender', 'Substance 3D Painter', 'ZBrush', 'Three.js', 'Draco Compression', 'GLTF 2.0'],
    process: [
      { step: 1, name: 'Mesh Generation', desc: 'Clean quad-topology modeling from CAD files or design drawings.' },
      { step: 2, name: 'Texture & PBR Baking', desc: 'Crafting normal, roughness, metallic, and ambient occlusion passes.' },
      { step: 3, name: 'Real-Time Rigging', desc: 'Setting pivot hierarchies and animation kinematics.' },
      { step: 4, name: 'Web Pipeline Export', desc: 'Baking lighting and compressing to sub-2MB GLTF packages.' },
    ],
    relatedPortfolioSlugs: ['wanaromah', 'puratap', 'cube-dental'],
  },
  {
    slug: 'ui-ux-design',
    title: 'Enterprise UI/UX Design & Design Systems',
    tagline: 'Human-centric digital interfaces that balance visual luxury with effortless usability.',
    description: 'We architect comprehensive design systems, high-converting customer journeys, and stunning digital interfaces backed by cognitive psychology, accessibility standards (WCAG AAA), and aesthetic perfection.',
    icon: 'Figma',
    problem: 'Confusing user interfaces, low conversion velocity, visual inconsistency across multi-platform products, and lack of brand distinction.',
    solution: 'Systematic atomic design libraries, deep user research, interactive micro-prototypes, and frictionless conversion flows.',
    keyFeatures: [
      'Atomic design systems with comprehensive tokenization (Figma to Code)',
      'Cognitive wireframing and user journey friction elimination',
      'Micro-interactions and fluid motion design principles',
      'WCAG 2.1 AAA accessibility and responsive cross-screen typography',
      'Usability testing and live user heat-map validation',
    ],
    industryUseCases: ['SaaS B2B Dashboards', 'Consumer Mobile Apps', 'AI-Driven Platforms', 'Luxury Brands'],
    technologyStack: ['Figma', 'Framer', 'Design Tokens', 'Tailwind Design System', 'Protopie', 'Lottie'],
    process: [
      { step: 1, name: 'Discovery & Research', desc: 'Stakeholder interviews, user empathy maps, and competitive matrix.' },
      { step: 2, name: 'Information Architecture', desc: 'Card sorting, wireframing, and interaction blueprints.' },
      { step: 3, name: 'Visual Luxury Design', desc: 'Color theory, custom typography, micro-states, and 3D integration.' },
      { step: 4, name: 'Design System Handoff', desc: 'Component specs, animation curve tokens, and engineering alignment.' },
    ],
    relatedPortfolioSlugs: ['laxmi-astro-ai', 'visdoc', 'studio11'],
  },
];

const initialProjects = [
  {
    slug: 'puratap',
    title: 'Puratap Water Filtration Platform',
    client: 'Puratap Australia',
    industry: 'CleanTech & Consumer Appliances',
    summary: 'Next-generation web portal, customer subscription engine, and smart service booking system for Australia’s premier water purification provider.',
    challenge: 'Puratap managed a legacy monolithic system that suffered high bounce rates during quote calculations, sluggish mobile performance, and cumbersome offline scheduling for technicians.',
    solution: 'Riyadvi engineered a headless React + Node.js web architecture coupled with a live postal-code service locator, instant filter-replacement subscription checkout, and an interactive 3D filter anatomy showcase.',
    technologies: ['React', 'Node.js', 'Three.js', 'Tailwind CSS', 'Stripe Subscriptions', 'PostgreSQL'],
    results: [
      { metric: '+142%', label: 'Online Filter Subscriptions' },
      { metric: '< 0.8s', label: 'Average Page Load Time' },
      { metric: '+64%', label: 'Mobile Conversion Rate' },
      { metric: '99.98%', label: 'Platform Uptime' },
    ],
    visuals: ['https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1200&q=80'],
    featured3d: true,
    modelType: 'geometric-nodes',
    relatedServices: ['web-development', 'ui-ux-design', '3d-modeling'],
    testimonial: {
      quote: 'Riyadvi modernized our entire digital customer journey. The interactive product experience and frictionless subscription flow exceeded our quarterly growth targets in month one.',
      author: 'Marcus Vance',
      designation: 'VP of Digital Operations, Puratap',
    },
  },
  {
    slug: 'wanaromah',
    title: 'Wanaromah Perfumers Luxury 3D Boutique',
    client: 'Wanaromah Parfums',
    industry: 'Luxury Fragrance & E-Commerce',
    summary: 'An opulent, sensory digital boutique featuring interactive 3D crystal flacons, bespoke olfactory quiz engines, and gold-leaf interactive aesthetics.',
    challenge: 'Selling ultra-premium artisanal perfumes online is notoriously difficult without touch and scent. Wanaromah required a visual and interactive experience as evocative as physical haute parfumerie.',
    solution: 'We constructed an interactive WebGL digital flacon customizer where customers can explore glass refractions, customize engraved gold plaques, and discover bespoke fragrances via an AI scent profile engine.',
    technologies: ['React Three Fiber', 'Three.js', 'GLSL Shaders', 'Next.js', 'Tailwind CSS'],
    results: [
      { metric: '+210%', label: 'Average Session Duration' },
      { metric: '3.8x', label: 'ROI on E-Commerce Sales' },
      { metric: '48%', label: 'Custom Engraving Add-On Rate' },
      { metric: '0', label: 'Plugin Installs Required' },
    ],
    visuals: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80'],
    featured3d: true,
    modelType: 'perfume-flacon',
    relatedServices: ['ar-vr', '3d-modeling', 'web-development'],
    testimonial: {
      quote: 'The 3D interactive bottle viewer and gold aesthetic designed by Riyadvi elevated our brand to global luxury echelon. Our clients are mesmerized.',
      author: 'Soraya Al-Khatib',
      designation: 'Creative Director, Wanaromah',
    },
  },
  {
    slug: 'laxmi-astro-ai',
    title: 'Laxmi Astro AI Predictive Platform',
    client: 'Laxmi Technologies Inc',
    industry: 'AI & Vedic Astrology Tech',
    summary: 'A futuristic artificial intelligence application synthesizing planetary celestial data with advanced natural language prediction models.',
    challenge: 'Translating millions of historical planetary trajectory calculations into instantaneous, visually captivating interactive charts and conversational guidance for over 500,000 monthly users.',
    solution: 'Architected a scalable microservices backend with WebSockets for live planetary calculations, dynamic SVG horoscope wheels, and a cosmic glassmorphism interface.',
    technologies: ['React', 'Python FastApi', 'Node.js', 'MongoDB', 'Canvas 2D', 'Framer Motion'],
    results: [
      { metric: '650K+', label: 'Active Monthly App Users' },
      { metric: '180ms', label: 'Chart Computation Latency' },
      { metric: '4.9★', label: 'App Store Rating' },
      { metric: '+85%', label: 'Paid Subscription Retention' },
    ],
    visuals: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'],
    featured3d: true,
    modelType: 'planetary-orbit',
    relatedServices: ['app-development', 'ui-ux-design', 'web-development'],
    testimonial: {
      quote: 'Riyadvi took an extraordinarily intricate mathematical model and rendered it into a mesmerizing, lightning-fast digital platform that our users adore.',
      author: 'Rajesh Kulkarni',
      designation: 'Founder & CEO, Laxmi Astro AI',
    },
  },
  {
    slug: 'tony-and-guy',
    title: 'Toni & Guy Digital Salon Experience',
    client: 'Toni & Guy Regional Franchise',
    industry: 'Luxury Beauty & Hospitality',
    summary: 'Omnichannel salon reservation engine, stylist portfolio system, and digital loyalty rewards app.',
    challenge: 'High appointment no-shows, fragmented phone reservations across multiple branches, and no unified customer lifetime history.',
    solution: 'Designed an elegant appointment concierge with automated SMS/WhatsApp reminders, stylist booking calendars, and loyalty rewards integration.',
    technologies: ['React', 'Node.js', 'Express', 'Twilio API', 'MongoDB', 'Tailwind CSS'],
    results: [
      { metric: '-72%', label: 'Appointment No-Show Rate' },
      { metric: '+90%', label: 'Repeat Online Bookings' },
      { metric: '12', label: 'Salons Unified Under 1 Dashboard' },
    ],
    visuals: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80'],
    featured3d: false,
    relatedServices: ['web-development', 'digital-marketing', 'app-development'],
  },
  {
    slug: 'studio11',
    title: 'Studio11 Salon & Spa Growth Engine',
    client: 'Studio11 Salon Network',
    industry: 'Wellness & Lifestyle',
    summary: 'High-conversion customer acquisition funnel and multi-location localized SEO marketing machine.',
    challenge: 'Intense local market competition and low organic search visibility across suburban franchise locations.',
    solution: 'Deployed programmatic local landing pages, targeted Google Ads campaigns with micro-geolocation bidding, and automated review syndication.',
    technologies: ['React', 'Next.js', 'Google Maps API', 'Tailwind CSS', 'Semrush'],
    results: [
      { metric: '+320%', label: 'Organic Search Impressions' },
      { metric: '4.8x', label: 'Ad Spend Return (ROAS)' },
      { metric: '15,000+', label: 'New Client Bookings in 6 Months' },
    ],
    visuals: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80'],
    featured3d: false,
    relatedServices: ['digital-marketing', 'ui-ux-design'],
  },
  {
    slug: 'sivam-physio',
    title: 'Sivam Physio Care Tele-Rehab Hub',
    client: 'Sivam Healthcare Network',
    industry: 'Healthcare & Physiotherapy',
    summary: 'HIPAA-compliant telemedicine platform with interactive video exercise routines and digital rehabilitation tracking.',
    challenge: 'Patients struggled to maintain adherence to home physiotherapy exercises between in-clinic visits, delaying recovery times.',
    solution: 'Built an interactive progressive web app with step-by-step 3D-assisted exercise tutorials, recovery logs, and direct video consultations.',
    technologies: ['React', 'WebRTC', 'Node.js', 'MongoDB', 'PWA'],
    results: [
      { metric: '+82%', label: 'Patient Home Exercise Adherence' },
      { metric: '35%', label: 'Faster Average Recovery Milestone' },
      { metric: '2,400+', label: 'Tele-Rehab Sessions Conducted' },
    ],
    visuals: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80'],
    featured3d: false,
    relatedServices: ['app-development', 'web-development'],
  },
  {
    slug: 'pearl-housing',
    title: 'Pearl Housing 3D Interactive Virtual Residences',
    client: 'Pearl Housing & Infrastructure',
    industry: 'Real Estate & Property Development',
    summary: 'Virtual 3D architectural explorer allowing high-net-worth buyers to tour penthouse layouts and customize luxury interior finishes in real time.',
    challenge: 'Selling multi-million dollar luxury apartments off-plan before construction began required an extraordinary visualization tool beyond static CAD renders.',
    solution: 'Developed an immersive browser-based 3D architectural viewer with sun-position simulation, floorplan transitions, and material customizers.',
    technologies: ['Three.js', 'React Three Fiber', 'Drei', 'GSAP', 'Tailwind CSS'],
    results: [
      { metric: '85%', label: 'Off-Plan Units Sold in Phase 1' },
      { metric: '$42M', label: 'Property Sales Facilitated' },
      { metric: '12 min', label: 'Average User Exploration Time' },
    ],
    visuals: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
    featured3d: true,
    modelType: 'architectural-structure',
    relatedServices: ['ar-vr', '3d-modeling', 'web-development'],
  },
  {
    slug: 'nugenica-biotech',
    title: 'Nugenica Biotech Molecular Diagnostics Suite',
    client: 'Nugenica Laboratories',
    industry: 'Biotechnology & Medical Research',
    summary: 'Secure clinical trial data pipeline, laboratory information management system (LIMS), and real-time specimen analytics portal.',
    challenge: 'Manual specimen handoffs and fragmented legacy spreadsheets created operational bottlenecks in processing genomic sequencing data.',
    solution: 'Engineered an automated laboratory analytics suite with role-based audit logs, barcode specimen tracking, and interactive genomics visualization.',
    technologies: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'Chart.js'],
    results: [
      { metric: '-65%', label: 'Specimen Turnaround Time' },
      { metric: '100%', label: 'Regulatory Compliance Passed' },
      { metric: '500,000+', label: 'Diagnostics Tests Processed' },
    ],
    visuals: ['https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80'],
    featured3d: false,
    relatedServices: ['web-development', 'ui-ux-design'],
  },
  {
    slug: 'visdoc',
    title: 'VisDoc Enterprise Document Intelligence',
    client: 'VisDoc Technologies',
    industry: 'AI & FinTech SaaS',
    summary: 'AI-powered optical document extraction and contract lifecycle intelligence platform.',
    challenge: 'Financial institutions spending hundreds of manual hours reviewing complex legal agreements and invoices.',
    solution: 'Created an intelligent OCR pipeline that parses multi-page PDFs, categorizes clauses, and highlights risk vectors with 99.4% accuracy.',
    technologies: ['React', 'Python', 'Node.js', 'FastAPI', 'Tailwind CSS'],
    results: [
      { metric: '90%', label: 'Reduction in Document Review Time' },
      { metric: '$1.2M', label: 'Operational Costs Saved Annually' },
      { metric: '99.4%', label: 'OCR Data Extraction Accuracy' },
    ],
    visuals: ['https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80'],
    featured3d: false,
    relatedServices: ['app-development', 'ui-ux-design', 'web-development'],
  },
  {
    slug: 'cube-dental',
    title: 'Cube Dental Smart Practice Management',
    client: 'Cube Dental Network',
    industry: 'Healthcare & Dentistry',
    summary: 'Modern cloud practice management software with 3D dental charting, automated treatment plan financing, and patient portals.',
    challenge: 'Traditional dental software was locked to local desktop servers with rigid interfaces that could not display tooth scans dynamically.',
    solution: 'Built a responsive cloud platform featuring an interactive 3D odontogram chart, automated digital intake kiosks, and integrated payment processing.',
    technologies: ['React', 'Three.js', 'Node.js', 'MongoDB', 'Stripe'],
    results: [
      { metric: '+45%', label: 'Treatment Plan Acceptance' },
      { metric: '100%', label: 'Cloud Accessibility from Any Clinic' },
      { metric: '30,000+', label: 'Patients Managed Seamlessly' },
    ],
    visuals: ['https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80'],
    featured3d: true,
    modelType: 'geometric-nodes',
    relatedServices: ['web-development', '3d-modeling', 'app-development'],
  },
];

const initialBlogPosts = [
  {
    slug: 'the-future-of-enterprise-3d-web-experiences',
    title: 'The Future of Enterprise Web: Why 3D & Spatial Interactions are Dominating 2025',
    excerpt: 'How modern WebGL, React Three Fiber, and hardware acceleration are converting static websites into immersive storytelling engines that command premium pricing.',
    content: `In an era where digital noise is ubiquitous, enterprise websites can no longer afford to resemble generic Bootstrap templates. Discerning clients make subconscious evaluations of your technical capability within the first 3 seconds of visiting your domain.

## The Paradigm Shift: From Pages to Experiences
When companies adopt real-time 3D and spatial elements, visitor dwell time multiplies by an average of 210%. Instead of merely reading about software architecture or medical devices, prospects touch, rotate, and interact with living digital models.

### Key Performance Principles
1. **Demand-Driven Rendering:** Utilizing Three.js with 'frameloop="demand"' ensures GPU overhead drops to 0% when the viewport is stationary.
2. **Adaptive Level of Detail (LOD):** Serving simplified meshes to mobile devices while unleashing photorealistic PBR shaders on modern desktop GPUs.
3. **Meaningful Storytelling:** 3D should never be gratuitous; it must directly communicate system integration, security, or craftsmanship.

At Riyadvi Software Technologies, we engineer web experiences where cinematic beauty meets sub-second load times.`,
    author: { name: 'Riyadvi Engineering Team', role: 'Head of Creative Technology', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    category: 'Technology & 3D',
    tags: ['Three.js', 'React Three Fiber', 'Web Development', 'Digital Transformation'],
    readTime: '6 min read',
    publishedAt: '2025-02-15',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'architecting-high-scale-microservices-nodejs',
    title: 'Architecting Resilient Microservices with Node.js and Distributed Caching',
    excerpt: 'Best practices for decoupling monolithic backends into fault-tolerant, horizontally scalable microservices built for millions of concurrent requests.',
    content: `Scaling a digital product beyond the initial prototype requires deliberate architecture from day one. In this guide, we dissect the battle-tested engineering patterns we employ at Riyadvi to ensure high uptime and sub-50ms API response windows.

## Core Architectural Pillars
- **Strict Separation of Concerns:** Decoupling controllers, validation pipelines, and business logic services.
- **Fail-Safe Graceful Degradation:** Providing in-memory fallback queues and circuit breakers to prevent cascading outages.
- **Stateless Authentication:** Leveraging JWT tokens with short TTLs and asymmetric encryption.`,
    author: { name: 'Shubham Sharma', role: 'Lead Solutions Architect', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    category: 'Backend & Cloud',
    tags: ['Node.js', 'Microservices', 'Express', 'Architecture'],
    readTime: '8 min read',
    publishedAt: '2025-02-10',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'why-business-health-checkup-matters',
    title: 'Is Your Tech Stack Slowing Your Valuation? The 5-Point Business Diagnostic',
    excerpt: 'Discover why technical debt is the silent killer of enterprise growth and how our diagnostic methodology pinpoints hidden ROI leaks.',
    content: `Most mid-market organizations lose between 15% and 28% of their potential annual revenue due to friction in their digital customer journey. From slow mobile checkout sequences to unintegrated CRM silos, digital inefficiency compounds exponentially.

Conducting a structured Business Health Checkup allows leadership teams to replace guesswork with concrete performance data.`,
    author: { name: 'Anita Patel', role: 'VP of Digital Strategy', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
    category: 'Business Strategy',
    tags: ['Digital Transformation', 'Growth', 'Enterprise'],
    readTime: '5 min read',
    publishedAt: '2025-01-28',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  },
];

const initialJobs = [
  {
    slug: 'senior-full-stack-engineer',
    title: 'Senior Full Stack Engineer (React + Node.js)',
    department: 'Engineering',
    designation: 'Senior Lead',
    experience: '4-7 Years',
    location: 'Bengaluru, India (Hybrid)',
    type: 'Full-time',
    salaryRange: '₹18,00,000 - ₹28,00,000 PA',
    overview: 'Lead the architecture and development of enterprise web applications and dynamic customer platforms. You will work directly with our CTO to build scalable cloud systems and interactive 3D digital experiences.',
    responsibilities: [
      'Architect robust full-stack web applications using React, Vite, Node.js, and TypeScript',
      'Design clean RESTful and GraphQL APIs with rock-solid security and validation',
      'Collaborate with UI/UX designers to implement pixel-perfect, responsive interfaces',
      'Optimize WebGL and 3D rendering pipelines for cross-device mobile smoothness',
      'Mentor junior engineers and champion clean code standards and automated testing',
    ],
    requirements: [
      '4+ years of proven production experience with React, Node.js, and Express',
      'Proficiency with MongoDB and PostgreSQL relational database design',
      'Hands-on experience with Three.js, React Three Fiber, or GSAP is a major plus',
      'Strong grasp of state management, Git workflows, and Docker containerization',
      'Exceptional communication and proactive problem-solving abilities',
    ],
    perks: [
      'Competitive compensation package + Performance bonus',
      'Hybrid flexible work culture with ergonomic home-office stipend',
      'Comprehensive health insurance for self and family',
      'Annual learning allowance for certifications and developer conferences',
    ],
    isActive: true,
  },
  {
    slug: 'creative-3d-web-developer',
    title: 'Creative 3D Web Developer (Three.js & WebGL)',
    department: 'Creative Technology',
    designation: 'Specialist',
    experience: '2-5 Years',
    location: 'Bengaluru, India / Remote',
    type: 'Full-time',
    salaryRange: '₹14,00,000 - ₹24,00,000 PA',
    overview: 'Build industry-defining WebGL and 3D interactive experiences for global luxury brands, architectural firms, and tech leaders.',
    responsibilities: [
      'Develop interactive 3D models and digital ecosystems in Three.js and React Three Fiber',
      'Implement custom GLSL shaders, particle systems, and dynamic lighting rigs',
      'Optimize 3D assets, textures, and draw calls for mobile 60 FPS performance',
      'Collaborate with 3D modelers working in Blender and Substance Painter',
    ],
    requirements: [
      'Strong portfolio demonstrating interactive WebGL / Three.js websites',
      'Familiarity with React, Vite, and GSAP ScrollTrigger',
      'Understanding of PBR workflows, GLTF compression, and WebXR fundamentals',
      'Passion for futuristic, luxury, and cinematic visual design',
    ],
    perks: [
      'Top-tier M3 Max MacBook Pro workstation provided',
      'High-impact creative autonomy on award-winning projects',
      'Flexible working hours and remote flexibility',
    ],
    isActive: true,
  },
  {
    slug: 'ui-ux-product-designer',
    title: 'Senior UI/UX Product Designer',
    department: 'Design',
    designation: 'Senior Designer',
    experience: '3-6 Years',
    location: 'Bengaluru, India (Hybrid)',
    type: 'Full-time',
    salaryRange: '₹12,00,000 - ₹20,00,000 PA',
    overview: 'Craft the future visual language for Riyadvi and our enterprise clientele. You will pioneer our Obsidian & Gold futuristic design systems and lead UX research.',
    responsibilities: [
      'Create high-fidelity wireframes, interactive Figma prototypes, and design tokens',
      'Conduct user testing and synthesize diagnostic data into conversion-oriented workflows',
      'Establish comprehensive design systems compatible with Tailwind CSS',
      'Work closely with full-stack engineers to ensure exact execution fidelity',
    ],
    requirements: [
      'Exceptional portfolio showcasing web and mobile enterprise SaaS or luxury digital design',
      'Mastery of Figma, component variants, auto-layout, and prototyping',
      'Experience in micro-interactions, motion curves, and spatial layout principles',
      'Deep understanding of typography, contrast accessibility, and dark mode design',
    ],
    perks: ['Comprehensive benefits', 'Wellness allowance', 'Latest design software licenses'],
    isActive: true,
  },
];

const initialEnquiries = [
  {
    name: 'Alexander Wright',
    email: 'a.wright@aurora-logistics.com',
    phone: '+1 415 892 3401',
    company: 'Aurora Global Logistics',
    requirement: 'Enterprise Web Portal & Real-time Fleet Tracking',
    message: 'We are seeking a reliable technology partner to rebuild our carrier booking portal with interactive 3D fleet telemetry. Budget allocated: $85,000.',
    status: 'New',
  },
  {
    name: 'Dr. Meera Nambiar',
    email: 'dr.meera@carewellclinics.in',
    phone: '+91 98450 12890',
    company: 'Carewell Health Networks',
    requirement: 'Telemedicine App & Multi-Clinic Management',
    message: 'Looking for a secure, HIPAA-compliant patient consultation app with video streaming and billing.',
    status: 'In Progress',
  },
];

const seedInitialData = async () => {
  try {
    const existingServices = await Service.find();
    if (existingServices.length === 0) {
      console.log('[SEED] Populating initial services...');
      for (const item of initialServices) {
        await Service.create(item);
      }
    }

    const existingProjects = await Project.find();
    if (existingProjects.length === 0) {
      console.log('[SEED] Populating initial portfolio projects...');
      for (const item of initialProjects) {
        await Project.create(item);
      }
    }

    const existingBlogs = await BlogPost.find();
    if (existingBlogs.length === 0) {
      console.log('[SEED] Populating initial blog posts...');
      for (const item of initialBlogPosts) {
        await BlogPost.create(item);
      }
    }

    const existingJobs = await Job.find();
    if (existingJobs.length === 0) {
      console.log('[SEED] Populating initial job positions...');
      for (const item of initialJobs) {
        await Job.create(item);
      }
    }

    const existingEnquiries = await ContactEnquiry.find();
    if (existingEnquiries.length === 0) {
      console.log('[SEED] Populating initial sample inquiries for admin dashboard...');
      for (const item of initialEnquiries) {
        await ContactEnquiry.create(item);
      }
    }

    console.log('[SEED] Database verification & seeding completed successfully.');
  } catch (err) {
    console.error('[SEED] Warning during seeding:', err.message);
  }
};

// Allow standalone execution via `node scripts/seed.js`
if (require.main === module) {
  const { connectDB } = require('../src/config/database');
  connectDB().then(() => {
    seedInitialData().then(() => {
      console.log('Seed completed successfully. Exiting.');
      process.exit(0);
    });
  });
}

module.exports = {
  seedInitialData,
  initialServices,
  initialProjects,
  initialBlogPosts,
  initialJobs,
};
