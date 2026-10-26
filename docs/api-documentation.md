# REST API Documentation: Riyadvi Software Technologies

Base URL: `http://localhost:5000/api`

---

## 1. System Health
### `GET /api/health`
Returns the operational status of the API, timestamp, and database engine mode.
- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "timestamp": "2025-02-26T12:00:00.000Z",
  "service": "Riyadvi Software Technologies Backend API",
  "database": {
    "connected": true,
    "fallbackMode": false,
    "type": "MongoDB"
  },
  "version": "1.0.0"
}
```

---

## 2. Inbound Lead Endpoints

### `POST /api/contact`
Submits a client enquiry or RFP.
- **Request Body**:
```json
{
  "name": "Marcus Vance",
  "email": "m.vance@puratap.com.au",
  "phone": "+61 8 8345 6789",
  "company": "Puratap Australia",
  "requirement": "Web Development",
  "message": "Looking to revamp our customer subscription portal."
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Thank you for reaching out to Riyadvi Software Technologies! Our solutions architect will connect within 24 hours.",
  "data": {
    "id": "mem_1740000000000",
    "name": "Marcus Vance",
    "email": "m.vance@puratap.com.au"
  }
}
```

---

### `POST /api/consultation`
Books a 1-on-1 strategy and architecture consultation.
- **Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "phone": "+1 415 555 2671",
  "company": "Apex Global",
  "preferredDate": "2025-03-05",
  "preferredTime": "10:00 AM - 11:00 AM IST",
  "budgetRange": "$25,000 - $50,000",
  "serviceInterested": "Full-Stack Web Development"
}
```

---

### `POST /api/health-checkup`
Submits the 6-step interactive diagnostic assessment and calculates a digital maturity score.
- **Request Body**:
```json
{
  "companyName": "Aurora Global Logistics",
  "contactPerson": "Alexander Wright",
  "email": "a.wright@aurora.com",
  "industry": "Supply Chain / Logistics",
  "companySize": "51-200 employees",
  "hasWebsite": "Yes",
  "isMobileFriendly": "Moderate",
  "currentMarketingChannels": ["SEO & Organic Search", "Google Paid Ads"],
  "techStack": ["React / Modern Frontend", "Node.js / Express"],
  "biggestPainPoint": "Low Conversion / Leaky Funnel"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Your Digital Health Checkup diagnostic report has been generated successfully!",
  "data": {
    "companyName": "Aurora Global Logistics",
    "digitalReadinessScore": 84,
    "readinessLevel": "Accelerated Growth Ready",
    "recommendedServices": ["Modern Web & WebApp Development", "Custom 3D Interactive Solutions & AI Integration"]
  }
}
```

---

### `POST /api/lead-magnet`
Registers a lead and provides immediate access to the Software Project Planning Guide.
- **Request Body**:
```json
{
  "name": "Sarah Connor",
  "company": "Cyberdyne Systems",
  "email": "sarah@cyberdyne.io",
  "phone": "+1 800 555 0199"
}
```

---

### `POST /api/applications`
Submits a job application for an active vacancy.
- **Request Body**:
```json
{
  "name": "David Chen",
  "email": "david@chen.dev",
  "phone": "+91 98765 43210",
  "position": "Senior Full Stack Engineer (React + Node.js)",
  "experienceYears": "5-8 years",
  "portfolioUrl": "https://github.com/davidchen",
  "resumeUrl": "https://drive.google.com/file/d/sample-resume",
  "coverLetter": "Excited about building high-performance 3D web systems."
}
```

---

## 3. Dynamic Catalog Endpoints

- `GET /api/services` - List all 6 engineering disciplines.
- `GET /api/services/:slug` - Get detail for a specific service.
- `GET /api/projects` - List all 10 portfolio case studies.
- `GET /api/projects/:slug` - Get detail for a specific case study.
- `GET /api/blogs?category=...&search=...` - Query blog articles.
- `GET /api/blogs/:slug` - Get article and related suggestions.
- `GET /api/jobs?department=...` - Query active vacancies.
- `GET /api/jobs/:slug` - Get vacancy details.

---

## 4. Admin Management Endpoints
- `GET /api/admin/metrics` - Aggregated KPIs for total enquiries, consultations, checkups, downloads, and applications.
- `GET /api/admin/enquiries` - Detailed list of client inquiries.
- `PATCH /api/admin/enquiries/:id/status` - Update status (`New` -> `In Progress` -> `Contacted` -> `Closed`).
- `GET /api/admin/applications` - List submitted candidate applications.
- `PATCH /api/admin/applications/:id/status` - Update candidate status.
