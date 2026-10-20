import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getCurrentSubdomain, SUBDOMAINS, PRIMARY_DOMAIN, CANONICAL_ORIGIN } from '../../utils/subdomains';
import { getBlogBySlug } from '../../services/blogService';
import { getJobById } from '../../services/jobService';

function setOrUpdateMeta(selector, attribute, value) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    const [attrName, attrVal] = selector.replace(/[\[\]]/g, '').split('=');
    element.setAttribute(attrName, attrVal.replace(/['"]/g, ''));
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

function setOrUpdateLink(rel, href) {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function SeoHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const subdomainKey = getCurrentSubdomain();
    let title = 'Work Wizards Innovations — Innovating Web, Apps & Beyond';
    let description = 'Work Wizards Innovations Pvt Ltd builds cutting-edge web, mobile, and AI-powered products for modern businesses.';
    let canonicalUrl = `${CANONICAL_ORIGIN}${pathname === '/' ? '' : pathname}`;
    let siteName = 'Work Wizards Innovations';

    if (subdomainKey !== 'main' && SUBDOMAINS[subdomainKey]) {
      const config = SUBDOMAINS[subdomainKey];
      siteName = `Work Wizards Innovations | ${config.sectionName}`;
      canonicalUrl = `https://${config.host}${pathname === '/' ? '' : pathname}`;

      switch (subdomainKey) {
        case 'web':
          title = 'Web Development Services — Work Wizards Innovations';
          description = 'Full-stack web application engineering, modern React runtimes, and performant cloud architectures by WWI.';
          break;
        case 'android':
          title = 'Android & Mobile App Development — Work Wizards Innovations';
          description = 'Scalable native Android and cross-platform mobile apps engineered with Kotlin, Flutter, and React Native by WWI.';
          break;
        case 'maintenance':
          title = 'Website Maintenance & Tech Support SLAs — Work Wizards Innovations';
          description = '24/7 uptime monitoring, security patching, SLA guarantees, and enterprise maintenance plans by WWI.';
          break;
        case 'socialsphere':
          title = 'The SocialSphere — Digital Growth & Social Media by WWI';
          description = 'Full-scale digital marketing, social media branding, content creation, and growth strategies by WWI.';
          break;
        case 'careers':
          if (pathname.includes('/apply')) {
            title = 'Job Application — Work Wizards Innovations Careers';
            description = 'Submit your application and resume for engineering and design roles at Work Wizards Innovations.';
          } else if (pathname !== '/') {
            const cleanJobId = pathname.replace(/^\/careers\//, '').replace(/^\//, '').replace(/\/apply$/, '');
            const job = getJobById(cleanJobId);
            if (job) {
              title = `${job.title} — Work Wizards Innovations Careers`;
              description = job.shortDescription || description;
            } else {
              title = 'Career Opportunities — Work Wizards Innovations';
            }
          } else {
            title = 'Careers & Job Openings — Work Wizards Innovations';
            description = 'Explore open engineering roles, remote opportunities, and developer internships at Work Wizards Innovations.';
          }
          break;
        case 'contact':
          title = 'Contact Us — Work Wizards Innovations';
          description = 'Get in touch with Work Wizards Innovations for web, mobile, and digital engineering inquiries.';
          break;
        case 'support':
          title = 'Customer & Technical Support Helpdesk — Work Wizards Innovations';
          description = '24/7 intelligent AI support assistant, engineer helpline (+91 96181 31779), and mission-critical SLAs.';
          break;
        case 'events':
          title = 'Events & Hackathons — Work Wizards Innovations';
          description = 'Promptwars, developer hackathons, and technology alliances with Google for Developers, Hack2skill, and KIET Group.';
          break;
        case 'community':
          title = 'Developer Community — Work Wizards Innovations';
          description = 'Empowering 1,500+ builders, student hackers, and engineering mentors across India.';
          break;
        case 'blog':
          if (pathname !== '/') {
            const slug = pathname.replace(/^\/blogs\//, '').replace(/^\//, '');
            const post = getBlogBySlug(slug);
            if (post) {
              title = `${post.title} — WWI Tech Blog`;
              description = post.shortDescription || description;
            } else {
              title = 'Blog & Articles — Work Wizards Innovations';
            }
          } else {
            title = 'Tech Blog & Engineering Insights — Work Wizards Innovations';
            description = 'Articles, engineering patterns, and product updates from the builders at Work Wizards Innovations.';
          }
          break;
        case 'aboutus':
          title = 'About Us — Work Wizards Innovations';
          description = 'Discover the mission, philosophy, and executive leadership behind Work Wizards Innovations Pvt Ltd.';
          break;
        default:
          title = config.title;
          description = config.description;
      }
    } else if (subdomainKey === 'unknown') {
      title = '404 — Subdomain Not Found | Work Wizards Innovations';
      description = 'The requested subdomain is not configured or does not exist.';
    } else {
      // Primary main domain routes
      const mainTitles = {
        '/': 'Work Wizards Innovations — Innovating Web, Apps & Beyond',
        '/about': 'About Us — Work Wizards Innovations',
        '/products': 'Our Products — Work Wizards Innovations',
        '/services/web': 'Web Services — Work Wizards Innovations',
        '/services/app': 'App Development — Work Wizards Innovations',
        '/services/maintenance': 'Maintenance & Support — Work Wizards Innovations',
        '/services/social-sphere': 'The Social Sphere — Work Wizards Innovations',
        '/blogs': 'Blog — Work Wizards Innovations',
        '/careers': 'Careers — Work Wizards Innovations',
        '/careers/apply': 'Apply — Work Wizards Innovations',
        '/contact': 'Contact — Work Wizards Innovations',
        '/support': 'Customer & Technical Support — Work Wizards Innovations',
        '/community': 'Developer Community — Work Wizards Innovations',
        '/events': 'Events & Hackathons — Work Wizards Innovations',
        '/privacy': 'Privacy Policy — Work Wizards Innovations',
        '/terms': 'Terms of Service — Work Wizards Innovations'
      };

      if (mainTitles[pathname]) {
        title = mainTitles[pathname];
      } else if (pathname.startsWith('/careers/')) {
        title = 'Career Details — Work Wizards Innovations';
      } else if (pathname.startsWith('/blogs/')) {
        title = 'Blog — Work Wizards Innovations';
      } else {
        title = '404 — Page Not Found | Work Wizards Innovations';
      }
    }

    // Apply document title
    document.title = title;

    // Apply Meta Tags
    setOrUpdateMeta('meta[name="description"]', 'content', description);
    setOrUpdateMeta('meta[property="og:title"]', 'content', title);
    setOrUpdateMeta('meta[property="og:description"]', 'content', description);
    setOrUpdateMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setOrUpdateMeta('meta[property="og:site_name"]', 'content', siteName);
    setOrUpdateMeta('meta[name="twitter:title"]', 'content', title);
    setOrUpdateMeta('meta[name="twitter:description"]', 'content', description);

    // Apply Canonical Link
    setOrUpdateLink('canonical', canonicalUrl);
  }, [pathname]);

  return null;
}

export default SeoHead;
