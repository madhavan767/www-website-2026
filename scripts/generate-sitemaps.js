/**
 * Sitemaps & Robots.txt Generator for WWI Multi-Subdomain Architecture
 * Generates valid XML sitemaps for primary domain and all 11 subdomains.
 * Fixes Vercel 308 redirect and ensures Google Search Console can fetch all child sitemaps.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogsData } from '../src/data/blogsData.js';
import { jobsData } from '../src/data/jobsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');
const sitemapsDir = path.resolve(publicDir, 'sitemaps');
const robotsDir = path.resolve(publicDir, 'robots');

if (!fs.existsSync(sitemapsDir)) fs.mkdirSync(sitemapsDir, { recursive: true });
if (!fs.existsSync(robotsDir)) fs.mkdirSync(robotsDir, { recursive: true });

const currentDate = new Date().toISOString().split('T')[0];

function createUrlBlock(loc, priority = '0.8', changefreq = 'monthly', lastmod = currentDate) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function wrapUrlset(urlBlocks) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlBlocks.join('\n')}
</urlset>
`;
}

// Load blogs and jobs, including any added in liveStore.json
let allBlogs = [...blogsData];
let allJobs = [...jobsData];
const liveStorePath = path.resolve(rootDir, 'src/data/liveStore.json');
if (fs.existsSync(liveStorePath)) {
  try {
    const liveStore = JSON.parse(fs.readFileSync(liveStorePath, 'utf-8'));
    if (Array.isArray(liveStore.wwi_blogs_store_v2)) {
      liveStore.wwi_blogs_store_v2.forEach(b => {
        if (b && (b.slug || b.id) && !allBlogs.some(x => (x.slug || x.id) === (b.slug || b.id))) {
          allBlogs.push(b);
        }
      });
    }
    if (Array.isArray(liveStore.wwi_jobs_store_v2)) {
      liveStore.wwi_jobs_store_v2.forEach(j => {
        if (j && j.id && !allJobs.some(x => x.id === j.id)) {
          allJobs.push(j);
        }
      });
    }
  } catch (err) {
    console.warn('Could not parse liveStore.json:', err);
  }
}

// 1. Individual Subdomain Sitemaps
const subdomainsConfig = {
  web: {
    host: 'web.wwi.org.in',
    urls: [
      { path: '/', priority: '1.0', changefreq: 'weekly' }
    ]
  },
  android: {
    host: 'android.wwi.org.in',
    urls: [
      { path: '/', priority: '1.0', changefreq: 'weekly' }
    ]
  },
  maintenance: {
    host: 'maintenance.wwi.org.in',
    urls: [
      { path: '/', priority: '1.0', changefreq: 'weekly' }
    ]
  },
  socialsphere: {
    host: 'socialsphere.wwi.org.in',
    urls: [
      { path: '/', priority: '1.0', changefreq: 'weekly' }
    ]
  },
  careers: {
    host: 'careers.wwi.org.in',
    urls: [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/apply', priority: '0.8', changefreq: 'weekly' },
      ...allJobs.filter(j => !j.hidden).map(j => ({
        path: `/${j.id}`,
        priority: '0.7',
        changefreq: 'weekly',
        lastmod: (j.updatedAt || j.createdAt || currentDate).split('T')[0]
      }))
    ]
  },
  contact: {
    host: 'contact.wwi.org.in',
    urls: [
      { path: '/', priority: '1.0', changefreq: 'monthly' }
    ]
  },
  support: {
    host: 'support.wwi.org.in',
    urls: [
      { path: '/', priority: '1.0', changefreq: 'weekly' }
    ]
  },
  events: {
    host: 'events.wwi.org.in',
    urls: [
      { path: '/', priority: '1.0', changefreq: 'daily' }
    ]
  },
  community: {
    host: 'community.wwi.org.in',
    urls: [
      { path: '/', priority: '1.0', changefreq: 'weekly' }
    ]
  },
  blog: {
    host: 'blog.wwi.org.in',
    urls: [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      ...allBlogs.filter(b => !b.hidden).map(b => ({
        path: `/${b.slug || b.id}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: (b.updatedAt || b.createdAt || currentDate).split('T')[0]
      }))
    ]
  },
  aboutus: {
    host: 'aboutus.wwi.org.in',
    urls: [
      { path: '/', priority: '1.0', changefreq: 'monthly' }
    ]
  }
};

// Write each subdomain sitemap and robots.txt
for (const [key, conf] of Object.entries(subdomainsConfig)) {
  const blocks = conf.urls.map(u => createUrlBlock(`https://${conf.host}${u.path}`, u.priority, u.changefreq, u.lastmod || currentDate));
  fs.writeFileSync(path.resolve(sitemapsDir, `${key}.xml`), wrapUrlset(blocks));

  const robotsContent = `User-agent: *
Allow: /
Sitemap: https://www.wwi.org.in/sitemaps/${key}.xml
Disallow: /admin
Disallow: /admin/
Disallow: /admin/dashboard
Disallow: /admin/login
Disallow: /vks/
Disallow: /vks/dashboard/
`;
  fs.writeFileSync(path.resolve(robotsDir, `${key}.txt`), robotsContent);
}

// 2. Main Domain Canonical Sitemap (sitemaps/sitemap-main.xml and public/sitemap-main.xml)
// Note: We use https://www.wwi.org.in because Vercel 308-redirects apex wwi.org.in to www.wwi.org.in
const mainUrls = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.9', changefreq: 'monthly' },
  { path: '/events', priority: '0.9', changefreq: 'weekly' },
  { path: '/products', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/web', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/app', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/maintenance', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/social-sphere', priority: '0.8', changefreq: 'monthly' },
  { path: '/careers', priority: '0.9', changefreq: 'weekly' },
  { path: '/careers/apply', priority: '0.8', changefreq: 'weekly' },
  ...allJobs.filter(j => !j.hidden).map(j => ({
    path: `/careers/${j.id}`,
    priority: '0.7',
    changefreq: 'weekly',
    lastmod: (j.updatedAt || j.createdAt || currentDate).split('T')[0]
  })),
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/support', priority: '0.9', changefreq: 'weekly' },
  { path: '/community', priority: '0.9', changefreq: 'weekly' },
  { path: '/blogs', priority: '0.9', changefreq: 'weekly' },
  ...allBlogs.filter(b => !b.hidden).map(b => ({
    path: `/blogs/${b.slug || b.id}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: (b.updatedAt || b.createdAt || currentDate).split('T')[0]
  })),
  { path: '/privacy', priority: '0.4', changefreq: 'yearly' },
  { path: '/terms', priority: '0.4', changefreq: 'yearly' }
];

const mainBlocks = mainUrls.map(u => createUrlBlock(`https://www.wwi.org.in${u.path}`, u.priority, u.changefreq, u.lastmod || currentDate));
fs.writeFileSync(path.resolve(sitemapsDir, 'sitemap-main.xml'), wrapUrlset(mainBlocks));
fs.writeFileSync(path.resolve(publicDir, 'sitemap-main.xml'), wrapUrlset(mainBlocks));

// 3. Sitemap Index on Primary Domain (public/sitemap.xml)
// Uses direct static sitemap URLs that return HTTP 200 without redirects or circular loops
const sitemapIndexEntries = [
  'https://www.wwi.org.in/sitemap-main.xml',
  ...Object.keys(subdomainsConfig).map(key => `https://www.wwi.org.in/sitemaps/${key}.xml`)
];

const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapIndexEntries.map(loc => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>
`;

fs.writeFileSync(path.resolve(publicDir, 'sitemap.xml'), sitemapIndexXml);

// 4. Primary Domain robots.txt
const primaryRobots = `User-agent: *
Allow: /
Sitemap: https://www.wwi.org.in/sitemap.xml
Disallow: /admin
Disallow: /admin/
Disallow: /admin/dashboard
Disallow: /admin/login
Disallow: /vks/
Disallow: /vks/dashboard/
`;
fs.writeFileSync(path.resolve(publicDir, 'robots.txt'), primaryRobots);

console.log(`✅ All 12 sitemaps, sitemap index, and robots.txt successfully generated!`);
