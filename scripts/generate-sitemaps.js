/**
 * Sitemaps & Robots.txt Generator for WWI Multi-Subdomain Architecture
 * Generates valid XML sitemaps for primary domain and all 11 subdomains.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
      { path: '/apply', priority: '0.8', changefreq: 'weekly' }
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
      { path: '/', priority: '1.0', changefreq: 'daily' }
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
  const blocks = conf.urls.map(u => createUrlBlock(`https://${conf.host}${u.path}`, u.priority, u.changefreq));
  fs.writeFileSync(path.resolve(sitemapsDir, `${key}.xml`), wrapUrlset(blocks));

  const robotsContent = `User-agent: *
Allow: /
Sitemap: https://${conf.host}/sitemap.xml
Disallow: /admin
Disallow: /admin/
Disallow: /admin/dashboard
Disallow: /admin/login
Disallow: /vks/
Disallow: /vks/dashboard/
`;
  fs.writeFileSync(path.resolve(robotsDir, `${key}.txt`), robotsContent);
}

// 2. Main Domain Canonical Sitemap (sitemaps/sitemap-main.xml)
const mainUrls = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.9', changefreq: 'monthly' },
  { path: '/events', priority: '0.9', changefreq: 'weekly' },
  { path: '/products', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/web', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/app', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/maintenance', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/social-sphere', priority: '0.8', changefreq: 'monthly' },
  { path: '/careers', priority: '0.9', changefreq: 'weekly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/support', priority: '0.9', changefreq: 'weekly' },
  { path: '/community', priority: '0.9', changefreq: 'weekly' },
  { path: '/blogs', priority: '0.9', changefreq: 'weekly' },
  { path: '/privacy', priority: '0.4', changefreq: 'yearly' },
  { path: '/terms', priority: '0.4', changefreq: 'yearly' }
];

const mainBlocks = mainUrls.map(u => createUrlBlock(`https://wwi.org.in${u.path}`, u.priority, u.changefreq));
fs.writeFileSync(path.resolve(sitemapsDir, 'sitemap-main.xml'), wrapUrlset(mainBlocks));
fs.writeFileSync(path.resolve(publicDir, 'sitemap-main.xml'), wrapUrlset(mainBlocks));

// 3. Sitemap Index on Primary Domain (public/sitemap.xml)
const sitemapIndexEntries = [
  'https://wwi.org.in/sitemap-main.xml',
  ...Object.keys(subdomainsConfig).map(key => `https://${subdomainsConfig[key].host}/sitemap.xml`)
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
Sitemap: https://wwi.org.in/sitemap.xml
Disallow: /admin
Disallow: /admin/
Disallow: /admin/dashboard
Disallow: /admin/login
Disallow: /vks/
Disallow: /vks/dashboard/
`;
fs.writeFileSync(path.resolve(publicDir, 'robots.txt'), primaryRobots);

console.log('✅ All 12 sitemaps, sitemap index, and robots.txt files successfully generated!');
