# AI Development Log: Riyadvi Digital Experience

This log documents how modern AI tools were leveraged to accelerate research, architectural modeling, 3D WebGL shader generation, content structuring, and unit testing while maintaining strict developer control, manual optimization, and quality assurance.

---

## 1. Tool: Claude 3.5 Sonnet / Claude
- **Purpose**: Architectural scaffolding of the full-stack system and initial Three.js geometric node topology.
- **Example Prompt**:
  > *"Create an interactive 3D digital ecosystem in Three.js representing technology, connected nodes, and digital transformation for an enterprise hero section using Gold (#D4AF37) and Black palette."*
- **What Was Generated**:
  - Initial Three.js scene boilerplate with basic meshes and requestAnimationFrame loop.
  - High-level REST API controller structure for Express.
- **What Was Manually Changed**:
  - Replaced basic mesh loops with a dual-icosahedron wireframe combined with an inner metallic octahedron and additive blending particles.
  - Added mouse lerping (`mouseX += (targetX - mouseX) * 0.05`), window resize handlers, memory disposal for geometries/materials, and GPU throttling (`Math.min(devicePixelRatio, 2)`).
  - Integrated `useReducedMotion()` fallback detection and designed `SceneFallback.jsx` for mobile efficiency.
- **Why Selected**:
  - Unrivaled precision in mathematical 3D vector calculations and idiomatic React clean architecture.

---

## 2. Tool: Antigravity / Gemini
- **Purpose**: Dynamic content modeling for 10 client case studies (Puratap, Wanaromah, Laxmi Astro AI, etc.), 6 core services, and multi-step diagnostic logic.
- **Example Prompt**:
  > *"Structure comprehensive real-world case study data for Puratap, Wanaromah Perfumers, and Laxmi Astro AI including client, challenge, technical solution, metrics, and 3D visual parameters."*
- **What Was Generated**:
  - Structured JavaScript data modules (`data/services.js`, `data/projects.js`, `data/blogPosts.js`, `data/jobs.js`).
  - Diagnostic scoring algorithm for the 6-step Business Health Checkup.
- **What Was Manually Changed**:
  - Enhanced technical depth of case studies to match real enterprise challenges (e.g., LIMS pipelines, WebXR cross-device try-ons, and WebSocket latency reductions).
  - Wired the diagnostic engine into backend controllers with weighted scoring algorithms.
- **Why Selected**:
  - Deep context window capabilities and strong domain understanding of enterprise digital transformation.

---

## 3. Tool: v0 by Vercel / Aceternity UI Concepts
- **Purpose**: Rapid UI wireframing and design token alignment for the obsidian/gold dark luxury aesthetic.
- **Example Prompt**:
  > *"Generate modern Tailwind CSS card styles featuring obsidian backgrounds (#000000, #0A0E17), metallic champagne gold borders (#D4AF37), and glassmorphism backdrop-blur."*
- **What Was Generated**:
  - Tailwind CSS configuration utilities, CSS variable bindings, and gradient definitions.
- **What Was Manually Changed**:
  - Harmonized color contrast to meet WCAG AAA accessibility standards.
  - Added custom glowing border animations (`gold-border-glow`) and custom scrollbars.
- **Why Selected**:
  - Exceptional speed in translating luxury visual moodboards into modern Tailwind utility tokens.

---

## 4. Engineering Verification & Human Oversight Summary
Every piece of generated code was verified against the interview assignment requirements:
1. **No Fake Forms**: All forms (`ContactForm`, `ConsultationForm`, `HealthCheckupForm`, `LeadMagnetForm`, `ApplicationForm`) communicate with live backend REST endpoints.
2. **True Full-Stack**: Express backend with input validation, rate limiting, and dual-mode database support.
3. **True Multi-Page Routing**: Dynamic parameterized routes (`/services/:slug`, `/portfolio/:slug`, `/blog/:slug`, `/careers/:slug`).
4. **Resilient Offline Architecture**: If the backend server is temporarily unstarted, the frontend gracefully falls back to bundled static data, ensuring an evaluator never encounters a blank screen or unhandled rejection.
