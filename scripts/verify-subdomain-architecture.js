/**
 * Comprehensive Architecture Verification Test Script
 * Work Wizards Innovations (WWI) Multi-Subdomain Architecture
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

console.log('\n========================================================');
console.log('🧪 RUNNING WWI ARCHITECTURE VERIFICATION TEST SUITE');
console.log('========================================================\n');

// TEST SUITE 1: Subdomain Definitions
console.log('--- Test Suite 1: Subdomain Definitions & Hostnames ---');
const expectedSubdomains = [
  'web',
  'android',
  'maintenance',
  'socialsphere',
  'careers',
  'contact',
  'support',
  'events',
  'community',
  'blog',
  'aboutus'
];

import { SUBDOMAINS, PRIMARY_DOMAIN, CANONICAL_ORIGIN, getSubdomainUrl } from '../src/utils/subdomains.js';

assert(PRIMARY_DOMAIN === 'wwi.org.in', 'Primary domain is wwi.org.in');
assert(CANONICAL_ORIGIN === 'https://wwi.org.in', 'Canonical origin is https://wwi.org.in');

for (const sub of expectedSubdomains) {
  assert(SUBDOMAINS[sub] !== undefined, `Subdomain config exists for: ${sub}`);
  assert(SUBDOMAINS[sub].host === `${sub}.wwi.org.in`, `Hostname is ${sub}.wwi.org.in`);
}

// TEST SUITE 2: Vercel Rewrites Configuration
console.log('\n--- Test Suite 2: Vercel Configuration & Host Matchers ---');
const vercelConfig = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'vercel.json'), 'utf-8'));
assert(Array.isArray(vercelConfig.rewrites), 'vercel.json has rewrites array');

for (const sub of expectedSubdomains) {
  const host = `${sub}.wwi.org.in`;
  const sitemapRewrite = vercelConfig.rewrites.find(
    r => r.source === '/sitemap.xml' && r.has && r.has.some(h => h.type === 'host' && h.value === host)
  );
  assert(!!sitemapRewrite, `Vercel has host rewrite for ${host} -> /sitemap.xml`);
  assert(sitemapRewrite?.destination === `/sitemaps/${sub}.xml`, `Sitemap destination is /sitemaps/${sub}.xml`);

  const robotsRewrite = vercelConfig.rewrites.find(
    r => r.source === '/robots.txt' && r.has && r.has.some(h => h.type === 'host' && h.value === host)
  );
  assert(!!robotsRewrite, `Vercel has host rewrite for ${host} -> /robots.txt`);
  assert(robotsRewrite?.destination === `/robots/${sub}.txt`, `Robots destination is /robots/${sub}.txt`);
}

const fallbackRewrite = vercelConfig.rewrites[vercelConfig.rewrites.length - 1];
assert(fallbackRewrite.source === '/(.*)' && fallbackRewrite.destination === '/index.html', 'SPA fallback rewrite /(.*) -> /index.html is active');

// TEST SUITE 3: Sitemap XML Validation
console.log('\n--- Test Suite 3: Sitemap XML Files & Host Canonical URLs ---');
const publicDir = path.resolve(rootDir, 'public');
const sitemapsDir = path.resolve(publicDir, 'sitemaps');

// Test sitemap index
const sitemapIndexContent = fs.readFileSync(path.resolve(publicDir, 'sitemap.xml'), 'utf-8');
assert(sitemapIndexContent.includes('<sitemapindex'), 'sitemap.xml is a valid sitemapindex root');
assert(sitemapIndexContent.includes('https://wwi.org.in/sitemap-main.xml'), 'sitemap.xml indexes main domain sitemap');

for (const sub of expectedSubdomains) {
  assert(sitemapIndexContent.includes(`https://${sub}.wwi.org.in/sitemap.xml`), `sitemap.xml indexes ${sub}.wwi.org.in/sitemap.xml`);

  const subXmlPath = path.resolve(sitemapsDir, `${sub}.xml`);
  assert(fs.existsSync(subXmlPath), `${sub}.xml exists in public/sitemaps/`);

  const subXmlContent = fs.readFileSync(subXmlPath, 'utf-8');
  assert(subXmlContent.includes('<urlset'), `${sub}.xml has <urlset> root`);
  assert(subXmlContent.includes(`https://${sub}.wwi.org.in`), `${sub}.xml contains canonical https://${sub}.wwi.org.in URLs`);
  assert(!subXmlContent.includes('https://wwi.org.in/careers') || sub === 'careers', 'No cross-host URL contamination in subdomain sitemap');
}

// TEST SUITE 4: Robots.txt Validation
console.log('\n--- Test Suite 4: Robots.txt Configuration ---');
const robotsDir = path.resolve(publicDir, 'robots');

for (const sub of expectedSubdomains) {
  const robotsPath = path.resolve(robotsDir, `${sub}.txt`);
  assert(fs.existsSync(robotsPath), `Robots file exists for ${sub}: robots/${sub}.txt`);

  const content = fs.readFileSync(robotsPath, 'utf-8');
  assert(content.includes(`Sitemap: https://${sub}.wwi.org.in/sitemap.xml`), `${sub}.txt points to its own sitemap`);
  assert(content.includes('Disallow: /admin/'), `${sub}.txt disallows /admin/`);
}

// TEST SUITE 5: Application Service & Careers Flow
console.log('\n--- Test Suite 5: Application Service & API Integration ---');
import { submitJobApplication } from '../src/services/applicationService.js';

const mockApplication = {
  jobId: 'full-stack-engineer',
  fullName: 'Test Candidate',
  email: 'candidate@example.com',
  phone: '9876543210',
  portfolio: 'https://github.com/candidate'
};

const submissionResult = await submitJobApplication(mockApplication);
assert(submissionResult.success === true, 'submitJobApplication returns success: true');
assert(typeof submissionResult.message === 'string', 'submitJobApplication returns confirmation message');

console.log('\n========================================================');
console.log(`🏁 TEST EXECUTION COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('========================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
