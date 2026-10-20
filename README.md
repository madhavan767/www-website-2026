# Work Wizards Innovations (WWI) — Website Reconstruction

A complete, faithful local reconstruction of the official **Work Wizards Innovations Pvt. Ltd.** website ([https://wwi.org.in](https://wwi.org.in)). Built with modern React, Vite, Tailwind CSS, React Router, Lucide icons, and Framer Motion.

---

## 🚀 Quick Start (Local Development)

The project is preconfigured for local development in VS Code.

### 1. Install Dependencies
Open your integrated terminal in VS Code (`Ctrl + \`` or `Cmd + \``) and run:
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

The Vite dev server will start instantly and output your local development URL (typically `http://localhost:3000`). Open it in your browser. Any edits made to the code will update in real time with Hot Module Replacement (HMR).

### 3. Build for Production
To test the production build locally:
```bash
npm run build
npm run preview
```

---

## 📂 Project Architecture

```
/
├── docs/                      # Reconstruction documentation & QA audits
│   ├── PAGE_INVENTORY.md      # All discovered routes & replication details
│   ├── ASSET_INVENTORY.md     # Brand assets, team photos, SVGs
│   ├── IMPLEMENTATION_NOTES.md# Architecture, decisions, and security
│   └── TEST_REPORT.md         # Automated & manual test verification
├── public/                    # Static assets served at root
│   ├── assets/
│   │   ├── images/            # Recovered leadership & executive portraits
│   │   └── logo.svg           # High-precision vector emblem
│   ├── favicon.svg            # Site favicon
│   ├── robots.txt             # Disallowed administrative crawlers
│   └── sitemap.xml            # Production sitemap
├── src/
│   ├── components/
│   │   ├── layout/            # Navbar & Footer
│   │   ├── common/            # PageHero, BackButton, Reveal, CTASection, ContactForm, Toast
│   │   └── careers/           # Multi-step JobApplicationForm
│   ├── pages/                 # Full route pages
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── services/          # Web, App, Maintenance & The Social Sphere
│   │   ├── BlogsPage.jsx & BlogDetailPage.jsx
│   │   ├── CareersPage.jsx, JobDetailPage.jsx & CareerApplyPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── PrivacyPage.jsx & TermsPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── data/                  # Clean, editable JavaScript data files
│   │   ├── companyData.js     # Phone numbers, emails, social handles
│   │   ├── leadershipData.js  # Executive bios, titles, photos
│   │   ├── servicesData.js    # Service offerings, process, pricing tiers
│   │   ├── blogsData.js       # Blog articles & metadata
│   │   └── jobsData.js        # Active job openings & requirements
│   ├── services/              # API and backend integration boundary
│   │   ├── contactService.js  # Web3Forms API integration
│   │   └── applicationService.js # Career submission handler
│   ├── styles/
│   │   └── index.css          # Design tokens & Tailwind imports
│   ├── App.jsx                # Main route controller & title updates
│   └── main.jsx               # React entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json                # Single-page application rewrites
└── .env.example               # Configurable environment keys
```

---

## ✏️ How to Edit Content in VS Code

All site copy is cleanly separated from UI components into simple JavaScript files in `src/data/`:

- **Change Company Phone, Email or Socials:**  
  Edit `src/data/companyData.js`.
- **Update Executive Profiles or Add Team Members:**  
  Edit `src/data/leadershipData.js`.
- **Modify Service Offerings or Social Sphere Pricing:**  
  Edit `src/data/servicesData.js`.
- **Post or Edit Blog Articles:**  
  Edit `src/data/blogsData.js`.
- **Add or Remove Career Openings:**  
  Edit `src/data/jobsData.js`.
- **Styling & Colors:**  
  Edit design token variables in `src/styles/index.css`.

---

## 🌐 Deploying to Vercel

The project includes `vercel.json` configured with rewrite rules so that client-side routes (e.g., `/services/social-sphere`, `/careers/full-stack-engineer`, `/about`) reload smoothly without 404 errors.

### Deploy via Vercel CLI:
```bash
npm install -g vercel
vercel
```

### Deploy via GitHub:
1. Push this repository to GitHub or GitLab.
2. In your [Vercel Dashboard](https://vercel.com/new), click **Add New Project**.
3. Select this repository. Vercel will automatically detect **Vite** as the framework preset.
4. (Optional) Add your `VITE_WEB3FORMS_ACCESS_KEY` in Environment Variables if you have a custom key.
5. Click **Deploy**.

---

## 🔒 Security & Admin Routes Note

In alignment with production guidelines, private administrative dashboard routes (`/vks/dashboard/*`) and authentication secrets discovered in `robots.txt` are excluded from the public frontend distribution.
