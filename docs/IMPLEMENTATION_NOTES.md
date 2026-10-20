# Implementation Notes — Work Wizards Innovations (WWI)

**Reconstruction Date:** October 2026  
**Author:** Full-Stack & UI/UX Engineering Team  
**Workspace:** `/Users/venkatnalla/Desktop/website`  
**Deployment Target:** Vercel (Local development + zero-config production build)

---

## 1. Architectural Strategy

The original website `https://wwi.org.in` is a single-page application built on React, Vite, and Tailwind CSS with a clean monochrome aesthetic (`oklch` light palette, dark accents, rounded pill badges, smooth scroll transitions).

To provide the user with the most editable, robust, and clean development experience inside VS Code:
1. **Language:** JavaScript (ES Modules, `.jsx` and `.js`), fulfilling the user requirement to prefer JavaScript over TypeScript for rapid, friction-free editing.
2. **Framework & Bundler:** React 18 + Vite. Fast HMR (Hot Module Replacement) and lean bundle generation.
3. **Styling:** Tailwind CSS with CSS variables for design tokens (`--radius: 16px`, `--background`, `--foreground`, `--card`, `--muted`, `--border`, `--surface`).
4. **Routing:** `react-router-dom` v6 with client-side SPA routing, scroll-to-top on route change, path aliasing for legacy URLs (`/services/web-services` -> `/services/web`, `/services/app-development` -> `/services/app`, `/services/maintenance-support` -> `/services/maintenance`, `/privacy-policy` -> `/privacy`, `/terms-of-service` -> `/terms`).
5. **State & Motion:** `framer-motion` for reveal transitions, hover animations, and dropdown menus; React hooks for form state, countdown timer, and search/filter.
6. **Icons:** `lucide-react` providing lightweight, crisp SVGs corresponding to all icon paths discovered in the original bundle.
7. **Production Deployment:** `vercel.json` rewrite rule to redirect all routes to `/index.html` for single-page application hydration on direct refresh.

---

## 2. Directory Structure

```
/
├── docs/
│   ├── PAGE_INVENTORY.md
│   ├── ASSET_INVENTORY.md
│   ├── IMPLEMENTATION_NOTES.md
│   └── TEST_REPORT.md
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── venkat-nalla.jpg
│   │   │   ├── santhosh-boppudi.jpg
│   │   │   ├── govinda-sai-ram.jpg
│   │   │   ├── charan-teja.jpg
│   │   │   └── prudhvi-duvvu.jpg
│   │   └── logo.svg
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── common/
│   │   │   ├── PageHero.jsx
│   │   │   ├── BackButton.jsx
│   │   │   ├── Reveal.jsx
│   │   │   ├── CTASection.jsx
│   │   │   ├── ContactForm.jsx
│   │   │   └── Toast.jsx
│   │   └── careers/
│   │       └── JobApplicationForm.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── services/
│   │   │   ├── WebServicesPage.jsx
│   │   │   ├── AppDevelopmentPage.jsx
│   │   │   ├── MaintenancePage.jsx
│   │   │   └── SocialSpherePage.jsx
│   │   ├── BlogsPage.jsx
│   │   ├── BlogDetailPage.jsx
│   │   ├── CareersPage.jsx
│   │   ├── JobDetailPage.jsx
│   │   ├── CareerApplyPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── PrivacyPage.jsx
│   │   ├── TermsPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── data/
│   │   ├── companyData.js
│   │   ├── leadershipData.js
│   │   ├── partnersData.js
│   │   ├── servicesData.js
│   │   ├── blogsData.js
│   │   └── jobsData.js
│   ├── services/
│   │   ├── contactService.js
│   │   └── applicationService.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 3. Data Extraction and Modularity

Rather than hardcoding all company copy inside monolithic JSX files, editable content is cleanly organized in `src/data/`:
- `companyData.js`: Company name, taglines, contact numbers, official emails, social media URLs.
- `leadershipData.js`: Executive profiles (Venkat Nalla, Santhosh Boppudi, Govinda Sai Ram Thammisetty, Charan Teja Rajanala, Prudhvi Duvvu) with bios and social links.
- `partnersData.js`: Vaivaanith and Mentneo partner profiles with styling tokens.
- `servicesData.js`: High-end tech stacks, service tiers, Social Sphere pricing packages (Essential, Growth, Premium Brand, Maintenance plan).
- `blogsData.js`: Blog posts with category, content, author, dates, and images.
- `jobsData.js`: Job openings with requirements, departments, salary details, and application paths.

This allows the user to update leadership bios, change pricing, or post new jobs without having to parse complex UI components.

---

## 4. Form Handling & Third-Party Boundaries

1. **Contact Form:**
   - Validates required fields (`name`, `email`, `phone`, `message`).
   - Uses Web3Forms API with default access key fallback (`7d86e3ee-ba58-4a6b-bc41-f9bc831d1a03`), configurable via `VITE_WEB3FORMS_ACCESS_KEY`.
   - Displays real submission progress, success state, and error handling.

2. **Job Application Form:**
   - 3-step progressive application wizard:
     1. Personal Information (Full name, email, phone, DOB, gender, location).
     2. Education & Professional Experience (Qualification, college, passing year, skills, Fresher/Experienced toggle, current role, portfolio links).
     3. Resume link (validates Google Drive link via regex `/google\.com|drive\.google\.com|docs\.google\.com/`) + mandatory consent checkbox.
   - Modularized service boundary (`src/services/applicationService.js`) with client-side fallback demonstration so that submissions work seamlessly in local development and can be wired to Firebase or custom webhooks.

---

## 5. Security & Privacy

- All sensitive dashboard routes (`/vks/dashboard/*`) and private APIs discovered in robots.txt have been omitted from the public frontend.
- No private API keys or admin passwords are committed.
- Environment variable `.env.example` documents optional overrides.
