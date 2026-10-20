/**
 * WWI Multi-Subdomain Architecture Configuration & Utilities
 * Work Wizards Innovations Pvt Ltd (WWI)
 */

export const PRIMARY_DOMAIN = 'wwi.org.in';
export const CANONICAL_ORIGIN = `https://${PRIMARY_DOMAIN}`;

export const SUBDOMAINS = {
  web: {
    key: 'web',
    subdomain: 'web',
    host: 'web.wwi.org.in',
    title: 'Web Development Services — Work Wizards Innovations',
    description: 'Enterprise & high-performance web application development, React, Next.js, and modern full-stack architectures by WWI.',
    canonicalPath: '/',
    sectionName: 'Web Services'
  },
  android: {
    key: 'android',
    subdomain: 'android',
    host: 'android.wwi.org.in',
    title: 'Android & Mobile App Development — Work Wizards Innovations',
    description: 'Native Android and cross-platform mobile app development with Kotlin, Flutter, and React Native by WWI.',
    canonicalPath: '/',
    sectionName: 'Android Development'
  },
  maintenance: {
    key: 'maintenance',
    subdomain: 'maintenance',
    host: 'maintenance.wwi.org.in',
    title: 'Website Maintenance & Tech Support — Work Wizards Innovations',
    description: '24/7 website maintenance, uptime monitoring, security patching, and technical support SLAs by WWI.',
    canonicalPath: '/',
    sectionName: 'Maintenance & Support'
  },
  socialsphere: {
    key: 'socialsphere',
    subdomain: 'socialsphere',
    host: 'socialsphere.wwi.org.in',
    title: 'The SocialSphere — Digital Growth & Social Media by WWI',
    description: 'Complete digital branding, social media marketing, content creation, and influencer growth services by WWI.',
    canonicalPath: '/',
    sectionName: 'The Social Sphere'
  },
  careers: {
    key: 'careers',
    subdomain: 'careers',
    host: 'careers.wwi.org.in',
    title: 'Careers & Job Openings — Work Wizards Innovations',
    description: 'Join Work Wizards Innovations. Explore open engineering, design, and product roles and internships.',
    canonicalPath: '/',
    sectionName: 'Careers'
  },
  contact: {
    key: 'contact',
    subdomain: 'contact',
    host: 'contact.wwi.org.in',
    title: 'Contact Us — Work Wizards Innovations',
    description: 'Get in touch with Work Wizards Innovations. Let us discuss your web, mobile, or AI engineering projects.',
    canonicalPath: '/',
    sectionName: 'Contact'
  },
  support: {
    key: 'support',
    subdomain: 'support',
    host: 'support.wwi.org.in',
    title: 'Customer & Technical Support — Work Wizards Innovations',
    description: '24/7 intelligent AI assistant, customer helpdesk, escalation SLAs, and live technical support for WWI clients.',
    canonicalPath: '/',
    sectionName: 'Support'
  },
  events: {
    key: 'events',
    subdomain: 'events',
    host: 'events.wwi.org.in',
    title: 'Events & Hackathons — Work Wizards Innovations',
    description: 'Promptwars, developer hackathons, tech bootcamps, and developer community alliances by WWI.',
    canonicalPath: '/',
    sectionName: 'Events'
  },
  community: {
    key: 'community',
    subdomain: 'community',
    host: 'community.wwi.org.in',
    title: 'Developer Community — Work Wizards Innovations',
    description: 'Join the WWI community of builders, student hackers, and engineering mentors across India.',
    canonicalPath: '/',
    sectionName: 'Community'
  },
  blog: {
    key: 'blog',
    subdomain: 'blog',
    host: 'blog.wwi.org.in',
    title: 'Tech Blog & Engineering Insights — Work Wizards Innovations',
    description: 'Engineering articles, React architecture deep-dives, and AI product development insights from WWI.',
    canonicalPath: '/',
    sectionName: 'Blog'
  },
  aboutus: {
    key: 'aboutus',
    subdomain: 'aboutus',
    host: 'aboutus.wwi.org.in',
    title: 'About Us — Work Wizards Innovations',
    description: 'Learn about Work Wizards Innovations, our leadership team, vision, values, and client partnerships.',
    canonicalPath: '/',
    sectionName: 'About Us'
  }
};

/**
 * Determines the active subdomain based on window.location.hostname
 * or development query parameter / test overrides.
 */
export function getCurrentSubdomain() {
  if (typeof window === 'undefined') {
    return 'main';
  }

  const hostname = window.location.hostname.toLowerCase();

  // 1. Check for manual development query parameter override: ?subdomain=xyz or ?host=xyz.wwi.org.in
  const searchParams = new URLSearchParams(window.location.search);
  const paramOverride = searchParams.get('subdomain') || searchParams.get('host');
  if (paramOverride) {
    const cleanKey = paramOverride.replace(/\.wwi\.org\.in$/, '').replace(/\.localhost$/, '').toLowerCase();
    if (SUBDOMAINS[cleanKey]) {
      return cleanKey;
    }
    if (cleanKey === 'main' || cleanKey === 'wwi' || cleanKey === 'www') {
      return 'main';
    }
  }

  // 2. Exact match against known production subdomain hosts
  for (const [key, config] of Object.entries(SUBDOMAINS)) {
    if (hostname === config.host) {
      return key;
    }
  }

  // 3. Localhost subdomain matching: e.g. "careers.localhost", "web.localhost"
  for (const key of Object.keys(SUBDOMAINS)) {
    if (hostname === `${key}.localhost` || hostname.startsWith(`${key}.`)) {
      return key;
    }
  }

  // 4. Root / primary domain matching
  if (
    hostname === PRIMARY_DOMAIN ||
    hostname === `www.${PRIMARY_DOMAIN}` ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.vercel.app')
  ) {
    return 'main';
  }

  // 5. Unknown subdomain of wwi.org.in or unexpected external hostname
  if (hostname.endsWith(`.${PRIMARY_DOMAIN}`)) {
    return 'unknown';
  }

  return 'main';
}

/**
 * Generates an absolute or environment-aware URL for a given subdomain and path.
 */
export function getSubdomainUrl(subdomainKey, path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (typeof window === 'undefined') {
    if (!subdomainKey || subdomainKey === 'main') {
      return `${CANONICAL_ORIGIN}${normalizedPath}`;
    }
    return `https://${subdomainKey}.${PRIMARY_DOMAIN}${normalizedPath}`;
  }

  const currentHost = window.location.hostname.toLowerCase();
  const isLocal = currentHost === 'localhost' || currentHost === '127.0.0.1' || currentHost.endsWith('.localhost');
  const port = window.location.port ? `:${window.location.port}` : '';

  // Local development behavior
  if (isLocal) {
    if (!subdomainKey || subdomainKey === 'main') {
      return `http://localhost${port}${normalizedPath}`;
    }
    // Modern browsers support *.localhost loopback natively
    return `http://${subdomainKey}.localhost${port}${normalizedPath}`;
  }

  // Vercel preview domain fallback (e.g. *.vercel.app)
  if (currentHost.endsWith('.vercel.app')) {
    if (!subdomainKey || subdomainKey === 'main') {
      return `${window.location.origin}${normalizedPath}`;
    }
    const glue = normalizedPath.includes('?') ? '&' : '?';
    return `${window.location.origin}${normalizedPath}${glue}subdomain=${subdomainKey}`;
  }

  // Production absolute HTTPS URLs
  if (!subdomainKey || subdomainKey === 'main') {
    return `${CANONICAL_ORIGIN}${normalizedPath}`;
  }

  return `https://${subdomainKey}.${PRIMARY_DOMAIN}${normalizedPath}`;
}

/**
 * Returns canonical metadata for a given subdomain and route path.
 */
export function getCanonicalMeta(subdomainKey, path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const config = SUBDOMAINS[subdomainKey];

  if (!config) {
    return {
      title: 'Work Wizards Innovations — Innovating Web, Apps & Beyond',
      description: 'Work Wizards Innovations Pvt Ltd builds cutting-edge web, mobile, and AI-powered products for modern businesses.',
      canonicalUrl: `${CANONICAL_ORIGIN}${normalizedPath}`,
      siteName: 'Work Wizards Innovations'
    };
  }

  const canonicalUrl = `https://${config.host}${normalizedPath === '/' ? '' : normalizedPath}`;

  return {
    title: config.title,
    description: config.description,
    canonicalUrl,
    siteName: `Work Wizards Innovations | ${config.sectionName}`
  };
}
