# Page Inventory — Work Wizards Innovations (WWI) Reconstruction

**Source Website:** https://wwi.org.in  
**Status:** Reconstructed & Locally Verifiable  
**Technology Stack:** React 18, Vite, React Router v6, Tailwind CSS, Lucide React, Framer Motion

---

## Discovered Routes & Implementation Mapping

| # | Route URL | Page Title | Discovered From | Type | Implementation Status | Notes |
|---|---|---|---|---|---|---|
| 1 | `/` | Work Wizards Innovations — Innovating Web, Apps & Beyond | Homepage, Sitemap | Public Route | Reconstructed | Full hero, services grid, why choose us, about snippet, careers hiring snippet, digital presence CTA, contact form & contact channels. |
| 2 | `/about` | About Us — Work Wizards Innovations | Navbar, Footer, Sitemap | Public Route | Reconstructed | PageHero, Leadership & Vision (Govinda Sai Ram as Founder & Director), Our Partners (Vaivaanith, Mentneo). |
| 3 | `/events` | Events & Hackathons — Work Wizards Innovations | Navbar, Footer, Sitemap | Public Route | Reconstructed | Upcoming Hackathon (Coming Soon spotlight with bigger collabs & prizes), Collaborators (Google for Developers, Hack2skill, KIET), Promptwars X WWI event showcase (700+ participants, ₹53k prize pool, video player + YouTube link, podium winners, top performers, action gallery). |
| 4 | `/products` | Our Products — Work Wizards Innovations | Navbar, Services, Sitemap | Public Route | Reconstructed | PageHero, Viadocs (Now Live with features & link), KNOWRA (Coming Soon with live countdown & feature preview), Product Philosophy (3 pillars), newsletter CTA. |
| 4 | `/services/web` | Web Services — Work Wizards Innovations | Navbar dropdown, Footer, Sitemap | Public Route | Reconstructed | PageHero, High-End Technologies grid, What We Deliver, 6-Step Development Process, CTASection. |
| 5 | `/services/web-services` | Redirect -> `/services/web` | Route table | Alias Route | Reconstructed | Permanent redirect to `/services/web`. |
| 6 | `/services/app` | App Development — Work Wizards Innovations | Navbar dropdown, Footer, Sitemap | Public Route | Reconstructed | PageHero, Multi-Platform Expertise (Android, iOS, Cross-Platform), App Features We Excel At, Applications We Build, Technologies & Tools, CTASection. |
| 7 | `/services/app-development` | Redirect -> `/services/app` | Route table | Alias Route | Reconstructed | Permanent redirect to `/services/app`. |
| 8 | `/services/maintenance` | Maintenance & Support — Work Wizards Innovations | Navbar dropdown, Footer, Sitemap | Public Route | Reconstructed | PageHero, Complete Tech Management, Flexible Support Plans (Basic, Premium, Enterprise), What We Cover, Pay-As-You-Go Pricing, CTASection. |
| 9 | `/services/maintenance-support` | Redirect -> `/services/maintenance` | Route table | Alias Route | Reconstructed | Permanent redirect to `/services/maintenance`. |
| 10 | `/services/social-sphere` | The Social Sphere — Work Wizards Innovations | Navbar dropdown, Footer, Sitemap | Public Route | Reconstructed | PageHero ("by Work Wizards Innovations"), Feature ticker, Entry-Level Maintenance plan, All-Inclusive Plans (Essential, Growth [Popular], Premium Brand), Enterprise contact numbers & email. |
| 11 | `/blogs` | Blog — Work Wizards Innovations | Footer, Sitemap | Public Route | Reconstructed | PageHero, Blog posts grid with categories, thumbnails, descriptions, read more link, graceful empty state handling. |
| 12 | `/blogs/:slug` | [Blog Title] — Work Wizards Innovations | Dynamic route | Public Route | Reconstructed | Featured hero image, Back to blogs, category, title, author, date, dynamic reading time calculator, article prose, social share buttons (FB, LinkedIn, X, WhatsApp). |
| 13 | `/careers` | Careers — Work Wizards Innovations | Navbar, Footer, Sitemap | Public Route | Reconstructed | PageHero with team collaboration gallery, Grounded and Ground-Breaking values, Why Work at WWI benefits grid, Open Positions list with fallback "Currently We Are Not Hiring" + subscribe mailto, General application banner. |
| 14 | `/careers/:jobId` | [Job Title] — Work Wizards Innovations | Dynamic route | Public Route | Reconstructed | Back link, Open Role badge, title, summary, quick snapshot metrics (Location, Type, Experience, Salary), Role Summary, Required Skills, Application Notes, Quick Apply sidebar. |
| 15 | `/careers/apply` | Apply — Work Wizards Innovations | Careers CTA | Public Route | Reconstructed | Full-page 3-step application form for general applications (Personal details -> Education & Experience -> Resume Google Drive link + confirmation). |
| 16 | `/careers/:jobId/apply` | Apply — Work Wizards Innovations | Job detail CTA | Public Route | Reconstructed | Full-page 3-step application form tailored for the specific selected job role. |
| 17 | `/contact` | Contact — Work Wizards Innovations | Navbar, Footer, Sitemap | Public Route | Reconstructed | PageHero, ContactForm with live Web3Forms submission & validation, Connect With Us direct phone, email, and social media channels. |
| 18 | `/privacy` | Privacy Policy — Work Wizards Innovations | Footer, Sitemap | Public Route | Reconstructed | Complete legal policy (Information We Collect, How We Use Information, Cookies, Your Rights, Contact). |
| 19 | `/privacy-policy` | Redirect -> `/privacy` | Route table | Alias Route | Reconstructed | Permanent redirect to `/privacy`. |
| 20 | `/terms` | Terms of Service — Work Wizards Innovations | Footer, Sitemap | Public Route | Reconstructed | Complete legal terms (Use of Services, Intellectual Property, Disclaimer, Limitation of Liability, Contact). |
| 21 | `/terms-of-service` | Redirect -> `/terms` | Route table | Alias Route | Reconstructed | Permanent redirect to `/terms`. |
| 22 | `*` (Splat) | 404 — Page Not Found | Error boundary | Public Route | Reconstructed | Minimalist 404 error page with Back to Home navigation. |

---

## Protected / Admin Routes Discovered in `robots.txt`

The live site specifies in `robots.txt`:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin/login
Disallow: /vks/
Disallow: /vks/dashboard/
```

In strict accordance with the master prompt ("Do not accidentally make private dashboards, internal APIs, secrets, or administrative routes publicly accessible through the reconstructed frontend"), internal administrative dashboard routes (`/vks/dashboard/*`) are excluded from public navigation and bundles. The discreet footer admin link to `/admin/login` is preserved as on the live site.
