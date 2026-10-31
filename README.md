# Riyadvi Software Technologies - Modern 3D Corporate Digital Platform

> **A Technology & Digital Solutions Partner – Not Simply a Software Vendor.**  
> Dynamic Multi-Page Website + 3D Interactive Experience + Full-Stack Architecture + AI-Assisted Development.

---

## 1. Project Overview
This repository contains the revamped digital experience for **Riyadvi Software Technologies** (Founded in 2021). The platform transcends traditional corporate brochure websites by delivering an interactive, hardware-accelerated 3D digital ecosystem combined with robust full-stack engineering, dynamic data modeling, automated lead intelligence, and a dedicated executive admin portal.

---

## 2. Key Features

- **Interactive 3D Digital Ecosystem (Hero)**: Real-time Three.js canvas featuring a rotating dual-icosahedron core, metallic octahedron, orbital golden rings, and mouse-reactive particle constellation with smooth lerping.
- **Dynamic Multi-Page Architecture**: Full client-side routing via React Router v6:
  - Dynamic Service Catalogue & Individual Detail Templates (`/services/:slug`)
  - Dynamic Case Studies with 3D Models (`/portfolio/:slug` including Puratap, Wanaromah, Laxmi Astro AI, Pearl Housing, etc.)
  - Interactive Company Journey & Milestones Since 2021 (`/about`)
  - Technical Insights & Blog Engine with Search & Filtering (`/blog` and `/blog/:slug`)
  - Career Openings with Department/Experience Filters & Application Portal (`/careers` and `/careers/:slug`)
  - Multi-Channel Contact & Calendar Concierge (`/contact`)
- **6-Step Interactive Business Health Checkup (`/business-health-checkup`)**: Enterprise diagnostic assessment analyzing digital maturity, technology debt, and funnel velocity with real-time score calculation and backend database persistence.
- **Lead Magnet Engine (`/software-project-planning-guide`)**: Executive 48-page blueprint download gate that captures verified leads and triggers automatic client delivery.
- **Executive Admin Portal (`/admin`)**:
  - Live metric KPI cards (Total inquiries, consultations, health checkups, lead magnets, applications)
  - Inquiry status pipeline (`New` → `In Progress` → `Contacted` → `Closed`)
  - Job application manager with candidate CV/resume links and hiring stages
- **Live Stack Console (`/live-stack`)**: A public, self-describing page that polls `/api/stack` every 8s and renders the real state of the running system — datastore driver and document counts per collection, request/latency/error telemetry, and an interactive explorer for all 18 API endpoints that fires genuine requests and prints the live status, latency and raw JSON body. Nothing on this page is mocked: when the API is unreachable it says so.
- **Content Studio (`/admin/content`)**: Authenticated CRUD over the same collections the public pages read from — pick a collection, edit a document as JSON, publish, and the change appears on the public site with no rebuild and no redeploy. Includes per-collection templates, validation feedback, `409`/`401` handling and a link through to the affected public page.
- **Obsidian & Gold Design System**: Built with Tailwind CSS utilizing Riyadvi’s signature Gold (`#D4AF37`) and obsidian dark-mode palette (`#000000`, `#0A0E17`), glassmorphism cards, and micro-animations.
- **Robust Mobile & Accessibility Fallbacks**: Built-in WebGL detection, `useReducedMotion()` accessibility support, and lightweight SVG geometric fallbacks (`SceneFallback.jsx`).

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM v6
- **3D & Graphics**: Three.js, React Three Fiber principles
- **Animations**: Framer Motion, custom CSS keyframes, Canvas Confetti
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM + Durable File-Backed Fallback Datastore (persisted to disk) for instant zero-dependency local evaluation
- **Security**: Helmet, CORS, Express Rate Limit
- **Utilities**: Custom Async Handler, ApiError class, Email & Upload service emulators

---

## 4. Installation Instructions

### Prerequisites
- Node.js (v18.0.0 or higher recommended; v20+ supported)
- npm (v9.0.0 or higher)
- Optional: Local MongoDB daemon (optional; backend includes automatic fail-safe in-memory store)

### Quick Start (Single Command)
```bash
# 1. Clone repository
git clone https://github.com/riyadvi/riyadvi-digital-experience.git
cd riyadvi-digital-experience

# 2. Install all dependencies (root, backend, and frontend)
npm run install:all

# 3. Start full-stack application (runs backend on 5000 and frontend on 5173 concurrently)
npm run dev
```

Run the full-stack verification suite from the repository root (it bootstraps the API, exercises auth, validation, the live stack endpoint, an authenticated content CRUD round trip and datastore durability):

```bash
npm test          # same as: npm test --prefix backend
npm run build     # production build of the frontend
```

Visit the application in your browser:
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Admin Dashboard**: [http://localhost:5173/admin](http://localhost:5173/admin)

---

## 5. Environment Variables

### Backend (`backend/.env`)
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/riyadvi_db
FRONTEND_URL=http://localhost:5173
ADMIN_SECRET_KEY=riyadvi_admin_super_secret_2025   # demo default; override in production
ADMIN_EMAIL=contact@riyadvisoftwaretechnologies.com
# Path of the JSON fallback datastore (only used when MongoDB is unreachable).
# Local: ./backend/data/riyadvi-store.json  |  Container: /data/riyadvi-store.json
DATA_STORE_PATH=./backend/data/riyadvi-store.json
```

### Frontend (`frontend/.env`)
```ini
VITE_API_URL=http://localhost:5000/api
VITE_ENABLE_3D=true
VITE_CALENDLY_URL=https://calendly.com/riyadvisoftware
VITE_WHATSAPP_NUMBER=919845012890
```

---

## 6. Database Setup & Seeding

The application features an intelligent dual-mode database layer:
1. **Live MongoDB**: Automatically connects to `MONGODB_URI` if a MongoDB daemon is active.
2. **Durable File-Backed Fallback Datastore**: If MongoDB is not running locally, the server logs a notice and operates via a disk-persisted JSON datastore (path configurable with `DATA_STORE_PATH`), ensuring evaluators can test 100% of the API endpoints, form submissions, and admin views without needing to install or configure MongoDB. Leads survive process restarts.

To manually run the seed script:
```bash
npm run seed
# or
node backend/scripts/seed.js
```

### Automated Verification

A focused regression check covers admin authentication, the public write endpoints and datastore durability:

```bash
cd backend
npm test        # or: npm run verify
```

It asserts that `/api/admin/*` returns `401` without a valid key and `200` with one, that all five public POST endpoints answer `success:true` (and `400` with `errors[]` on invalid input), that `/api/stack` reports a live datastore with document counts and request telemetry, and that an authenticated create → public read → update → delete round trip really changes what `/api/services` serves. The check exits non-zero on the first failed assertion.

The same end-to-end narrative can be replayed against a **deployed** instance (it creates one document, proves the public API serves it without a rebuild, edits it, deletes it and proves it is gone):

```bash
npm run verify:live -- https://your-deployed-host
```

---

## 7. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and database engine type |
| `POST` | `/api/contact` | Submit project enquiry or RFP |
| `POST` | `/api/consultation` | Book 1-on-1 strategy session |
| `POST` | `/api/health-checkup` | Submit 6-step diagnostic audit & get score |
| `POST` | `/api/lead-magnet` | Download Software Project Planning Guide |
| `POST` | `/api/applications` | Submit career job application |
| `GET` | `/api/services` | Retrieve catalogue of 6 services |
| `GET` | `/api/services/:slug` | Retrieve detailed service architecture |
| `GET` | `/api/projects` | Retrieve all 10 portfolio case studies |
| `GET` | `/api/projects/:slug` | Retrieve single case study with 3D parameters |
| `GET` | `/api/blogs` | Query publications with category & search filters |
| `GET` | `/api/jobs` | Query active jobs with department & experience filters |
| `GET` | `/api/admin/metrics` | Aggregated dashboard KPIs |
| `GET` | `/api/admin/enquiries` | List all inquiries |
| `PATCH`| `/api/admin/enquiries/:id/status`| Update inquiry status |
| `GET` | `/api/admin/applications` | List submitted candidate CVs |
| `GET` | `/api/stack` | **Live stack introspection**: datastore mode, per-collection document counts, runtime telemetry (requests, 4xx vs 5xx error rates, p50/p95 latency, memory) and the full endpoint catalogue |
| `GET` | `/api/admin/content/:collection` | List documents in a content collection (`services` \| `projects` \| `blogs` \| `jobs`) |
| `POST` | `/api/admin/content/:collection` | Create a document (required fields validated, duplicate slug → `409`) |
| `PATCH` | `/api/admin/content/:collection/:id` | Update an existing document |
| `DELETE` | `/api/admin/content/:collection/:id` | Delete a document (removed from the public API immediately) |

> **Admin route authentication** — every `/api/admin/*` endpoint is protected by `authMiddleware`. Requests must include the operator secret in the `x-admin-key` header (or `Authorization: Bearer <key>`). Missing or invalid credentials return `401` with `{ success: false, message, errors[] }`. The frontend never bundles the secret: the `/admin` route presents a key gate, validates it against `GET /api/admin/metrics`, and keeps it in `localStorage` for the session only.

> **Note on the default admin key** — `riyadvi_admin_super_secret_2025` is a deliberately published demo credential so an evaluator can open `/admin` without any setup. It is not a claim of production security: the server logs a warning at boot whenever `ADMIN_SECRET_KEY` is unset, and setting `ADMIN_SECRET_KEY` in the environment replaces the default entirely. A real deployment would also put `/api/admin/*` behind SSO.

> **Reading the error rate** — `/api/stack` reports `clientErrorRate` (4xx) and `serverErrorRate` (5xx) separately. The verification suites intentionally fire `401`, `400` and `409` requests to prove the API rejects bad input, so a non-zero 4xx rate is the validation layer working. `serverErrorRate` is the number that indicates genuine instability.

---

## 8. Deployment Instructions

### Frontend (Vercel)
1. Link repository to Vercel.
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Set Environment Variable: `VITE_API_URL=https://your-backend-api.onrender.com/api`.
5. Deploy.

### Backend (Render / Railway)
1. Create a new Web Service pointing to `backend`.
2. Build Command: `npm install`.
3. Start Command: `npm start`.
4. Add environment variables (`MONGODB_URI`, `PORT`, `NODE_ENV=production`).
5. Deploy.

---

## 9. AI Tools Used (Mandatory Documentation)

In compliance with Section 7 of the assignment specification, each major AI tool is documented with its purpose, an example prompt, what was generated, what was manually changed, and why it was selected.

### 1. Claude (Anthropic) — AI coding assistant / agent
- **Purpose**: Primary engineering partner across the whole build: scaffolding the Express API and Mongoose models, generating the React component library and design-token system, authoring the content datasets (10 case studies, 6 services, blog posts, job listings), and debugging/refactoring existing modules.
- **Example Prompt**: *"Create an interactive 3D digital ecosystem in Three.js representing technology, connected nodes, and digital transformation for an enterprise hero section using Gold (#D4AF37) and Black palette."*
- **What Was Generated**: Base Three.js canvas setup, initial mesh primitives, Express route/controller boilerplate, Tailwind glassmorphism utility pairings.
- **What Was Manually Changed**: Replaced basic mesh loops with dual-icosahedron wireframes, an inner metallic octahedron, additive-blending particle clouds, smoothed mouse lerping, resize debouncers, explicit memory cleanup, and GPU throttling (`Math.min(devicePixelRatio, 2)`). Later in the project the same pattern was applied to wire GSAP ScrollTrigger into a Lenis-driven scroll clock, and to add route-level code splitting — neither of which the assistant produced correctly unaided.
- **Why Selected**: Strongest reasoning over 3D maths, React architecture and build tooling; and because the assistant's output is inspectable and patchable rather than opaque.

### 2. Antigravity / Gemini
- **Purpose**: Dynamic data modelling for all 10 case studies (Puratap, Wanaromah, Laxmi Astro AI, Tony & Guy, Studio11, Sivam Physio Care, Pearl Housing, Nugenica Biotech Lab, VisDoc, Cube Dental), the 6 core services, and the diagnostic scoring algorithm behind the Business Health Checkup.
- **Example Prompt**: *"Structure comprehensive real-world case study data for Puratap, Wanaromah Perfumers, and Laxmi Astro AI including client, challenge, technical solution, metrics, and 3D visual parameters."*
- **What Was Generated**: Structured data schemas, initial questionnaire steps, and a first-pass readiness-scoring heuristic.
- **What Was Manually Changed**: Added deep engineering parameters (WebXR specifications, LIMS pipeline specs, WebSocket chart latencies), replaced the placeholder scoring with a weighted heuristic in `backend/src/services/leadService.js`, and aligned every payload with the Mongoose model and validator schemas.
- **Why Selected**: Large context window and strong domain understanding of enterprise digital transformation.

### 3. v0 by Vercel
- **Purpose**: Design-token exploration for the obsidian/gold glassmorphism card surfaces and the metallic typography treatment.
- **Example Prompt**: *"Generate modern Tailwind CSS card styles featuring obsidian backgrounds (#000000, #0A0E17), metallic champagne gold borders (#D4AF37), and glassmorphism backdrop-blur."*
- **What Was Generated**: CSS utility class pairings and gradient utilities.
- **What Was Manually Changed**: Adjusted colour contrast to meet WCAG AAA on the dark surfaces, added the custom `text-gradient-gold` and `bg-gold-glow` tokens, and re-tuned the shimmer/rotation keyframes so they respect `prefers-reduced-motion`.
- **Why Selected**: Fast turnaround translating a luxury visual moodboard into Tailwind utility tokens.

### 4. AI-assisted debugging & verification
- **Purpose**: Reading stack traces and API responses to isolate real defects rather than guessing.
- **Example**: After wiring the new scroll provider, the assistant was asked to *rebuild the frontend and read the compiler output* rather than assume the integration worked; the build confirmed the GSAP/ScrollTrigger/Lenis imports resolved. Similarly, a failing `/api/health-checkup` POST was diagnosed by reading `backend/src/validators/healthCheckupValidator.js` and `frontend/src/components/forms/HealthCheckupForm.jsx`, which revealed the API expected `companyName` / `contactPerson` — the client form was already correct and the test payload was wrong, so no code change was warranted.
- **Why Selected**: Documenting that an AI-generated or AI-modified path was *verified* rather than assumed, and that some investigations correctly concluded "no change required".

---

## 10. 3D Libraries Used
- **Three.js (`^0.164.1`)**: Powers every real-time WebGL 3D canvas experience. Raw Three.js (not R3F) is used so the render loop, resource disposal and raycasting are explicit and auditable.
  - **Hero Scene (`components/3d/DigitalEcosystem.jsx`)** — Home: an `EffectComposer` pipeline (`RenderPass` → `UnrealBloomPass` → `OutputPass`) with ACES filmic tone mapping; metallic wireframe icosahedrons around an inner core wrapped in a **custom GLSL energy shell** (value-noise vertex displacement + fresnel/pulse fragment shader, additive blending); a 420-point shader particle constellation with per-particle phase; three additive orbital rings with orbiting node pivots; pointer move/down/up with drag inertia, scroll-driven camera dolly, `IntersectionObserver` frame-loop pausing when off-screen, and full disposables cleanup on unmount.
  - **Technology Constellation (`components/3d/TechnologyOrbit.jsx`)** — Home "Technology Ecosystem": a gold dodecahedron core with three orbiting rings whose nodes are raycast-picked on click to focus a technology.
  - **Case Study Visualizer (`components/3d/InteractiveModel.jsx`)** — Portfolio case studies: rotatable, wireframe-toggleable 3D product geometries (Wanaromah perfume flacon, Laxmi celestial sphere, geometric gemstone).
  - **Service Hero 3D (`ServiceDetailPage.jsx`)** — Service pages reuse the same visualizer with a per-service `modelType`, so all six service pages render a distinct interactive object.
  - **About 3D (`AboutPage.jsx`)** — About page mounts the rotatable model to support the company timeline narrative.
  - **Shared runtime (`components/3d/SceneCanvas.jsx`)**: owns the renderer lifecycle — resize handling, pixel-ratio capping (`min(devicePixelRatio, 2)`), animation-frame cancellation, and full geometry/material/renderer disposal on unmount. It renders `SceneFallback` when WebGL is unavailable.

---

## 11. Animation Libraries Used
Five of the assignment's mandated animation technologies are meaningfully implemented:
- **GSAP (`^3.15.0`)** — Core timeline engine for scroll-driven storytelling in the Digital Transformation journey (`TransformationSection.jsx`), where each stage (Challenge → Strategy → Design → Technology → Launch → Growth) is a scrubbed timeline.
- **GSAP ScrollTrigger (`^3.15.0`)** — Drives every scroll-position dependency: the transformation journey, the reusable `useScrollReveal` hook (entrance reveals for About milestones/values/team/awards and Service features/process/stack), and the `ScrollTrigger.refresh()` calls that keep trigger positions correct after fonts and lazy images settle.
- **Lenis (`^1.3.27`)** — Smooth, momentum-based scrolling wired into GSAP's ticker (`lib/scrollProvider.jsx`) so Lenis and ScrollTrigger share a single clock and scrubbed timelines never desync from the real scrollbar. Disabled entirely for `prefers-reduced-motion` users, who keep native scrolling.
- **Framer Motion / Motion (`^11.1.7`)** — Page transitions between routes (`layout/PageTransition.jsx`), staggered entrance animations, and UI micro-states (hover, tap, expand).
- **Canvas Confetti (`^1.9.3`)** — Celebratory feedback on successful enquiry, consultation, and diagnostic submissions.

### 3D & animation coverage (not limited to the hero)
| Surface | Technology |
| --- | --- |
| Home — hero | Three.js interactive ecosystem (cursor + hover + scroll reactive) |
| Home — digital transformation | GSAP ScrollTrigger scrubbed storytelling |
| Home — technology ecosystem | Three.js orbit constellation with raycast picking |
| Services — all 6 detail pages | Three.js rotatable model + GSAP reveal |
| Portfolio — case studies | Three.js interactive product visualizer |
| About | Three.js model + GSAP timeline reveals |
| Home — hero | Bloom post-processing (EffectComposer) + custom GLSL shader shell + shader particles |

Mobile strategy: `SceneCanvas` detects reduced-power devices / failed WebGL context and swaps to the `SceneFallback` static-gradient alternative; GSAP and Lenis honour `prefers-reduced-motion`; pixel ratio is capped at 2 to protect mobile GPUs.

---

## 12. Third-Party Assets
- **Photography**: High-resolution curated photography via Unsplash for portfolio case studies and blog headers.
- **Typography**: Google Fonts (Inter, Montserrat, Poppins).
- **Icons**: Lucide React vector icons.

---

## 13. Performance Optimization
- **WebGL Throttling**: Canvas pixel ratio capped at 2.0 to conserve mobile GPU cycles.
- **Memory Management**: Comprehensive Three.js disposal lifecycle disposing of all buffers, geometries, materials, and cancelling animation frame loops on component unmount.
- **Zero Heavy Assets**: 3D scenes are mathematically rendered via Three.js primitives rather than heavy 20MB GLTF model downloads, guaranteeing instantaneous sub-second load times.
- **Code Splitting & Lazy Loading**: Vite chunks dependencies cleanly to ensure sub-800ms initial paint.

---

## 14. Known Limitations
- **Database dual-mode**: the backend attempts a MongoDB connection on boot; if `MONGODB_URI` is unreachable it falls back to a disk-persisted JSON datastore (path set by `DATA_STORE_PATH`) seeded from `backend/scripts/seed.js`. This keeps the demo fully functional without a local database and now **survives process restarts** (in production the file lives on the mounted `/data/` volume). The Mongoose models and controllers are the same in both modes; the real MongoDB path remains unexercised in the current sandbox because no MongoDB instance is reachable here.
- **Simulated upload service**: stores document references rather than uploading to an external S3 bucket.
- **Email service**: logs dispatches to the console rather than requiring production SendGrid / AWS SES SMTP credentials.
- **Job-board integrations** (LinkedIn / Indeed / Naukri) are not live — the careers data is curated in-repo.
- **Content management**: Services, projects, blog posts and jobs are fully editable at runtime through the authenticated Content Studio (`/admin/content`) and the `/api/admin/content/*` API — no rebuild required. An external headless CMS (Strapi/Sanity) is not connected; the in-repo Mongoose models are the system of record.

---

## 15. Future Improvements
- Multi-language localization (i18n) for global enterprise clients (Arabic, Japanese, German).
- Headless CMS integration (Strapi / Sanity.io) for non-technical content editor publishing.
- WebXR VR headset mode for Apple Vision Pro and Meta Quest exploration of architectural case studies.
- Live WebSockets for real-time admin lead notification toasts.
