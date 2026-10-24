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

function setOrUpdateJsonLd(id, data) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(data);
}

const GLOBAL_DEFAULT_KEYWORDS = 'WWI, Work Wizards Innovations, work wizards inovations, tech startup in AP, tech startup, startup, Web development, App development, Hackathons, promptwars X wwi, Promptwars, Andhra Pradesh tech startups, software company AP, web developement, app developemnt, Promptwars hackathon, Work Wizards';

export function SeoHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const subdomainKey = getCurrentSubdomain();
    let title = 'Work Wizards Innovations (WWI) — Tech Startup in AP | Web & App Development';
    let description = 'Work Wizards Innovations (WWI) is a leading tech startup in AP (Andhra Pradesh), delivering modern web development, mobile app development, AI solutions, and national hackathons like Promptwars X WWI.';
    let canonicalUrl = `${CANONICAL_ORIGIN}${pathname === '/' ? '' : pathname}`;
    let siteName = 'Work Wizards Innovations (WWI)';
    let keywords = GLOBAL_DEFAULT_KEYWORDS;
    let ogImage = 'https://wwi.org.in/assets/logo.svg';
    let schemaData = null;

    if (subdomainKey !== 'main' && SUBDOMAINS[subdomainKey]) {
      const config = SUBDOMAINS[subdomainKey];
      siteName = `Work Wizards Innovations | ${config.sectionName}`;
      canonicalUrl = `https://${config.host}${pathname === '/' ? '' : pathname}`;

      switch (subdomainKey) {
        case 'web':
          title = 'Web Development Services — Work Wizards Innovations (WWI)';
          description = 'Full-stack custom web development, modern React runtimes, and performant cloud architectures engineered by Work Wizards Innovations (WWI), tech startup in AP.';
          keywords = 'Web development, web developement, custom web development, React js, website development company, full stack web development, Work Wizards Innovations, WWI, tech startup in AP';
          schemaData = {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Web Development Services',
            provider: {
              '@type': 'Organization',
              name: 'Work Wizards Innovations'
            },
            serviceType: 'Custom Web Development, Full-Stack Engineering, Cloud Architecture',
            areaServed: 'Worldwide'
          };
          break;

        case 'android':
          title = 'Mobile App Development (Android & iOS) — Work Wizards Innovations (WWI)';
          description = 'High-performance native Android and cross-platform mobile app development with Kotlin, Flutter, and React Native by Work Wizards Innovations.';
          keywords = 'App development, App developemnt, mobile app development, Android app development, Flutter app development, mobile applications, WWI, Work Wizards Innovations, tech startup in AP';
          schemaData = {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Mobile App Development Services',
            provider: {
              '@type': 'Organization',
              name: 'Work Wizards Innovations'
            },
            serviceType: 'Native Android Development, Flutter, React Native Cross-Platform',
            areaServed: 'Worldwide'
          };
          break;

        case 'maintenance':
          title = 'Website Maintenance & Tech Support SLAs — Work Wizards Innovations (WWI)';
          description = '24/7 uptime monitoring, security patching, SLA guarantees, and enterprise maintenance plans by Work Wizards Innovations.';
          keywords = 'Website maintenance, tech support, SLA guarantees, security patching, WWI, Work Wizards Innovations';
          break;

        case 'socialsphere':
          title = 'The SocialSphere — Digital Growth & Social Media by WWI';
          description = 'Full-scale digital marketing, social media branding, content creation, and growth strategies by Work Wizards Innovations.';
          keywords = 'Social media management, digital marketing, AI content creation, The SocialSphere, Work Wizards Innovations';
          break;

        case 'careers':
          if (pathname.includes('/apply')) {
            title = 'Job Application — Work Wizards Innovations Careers';
            description = 'Submit your application and resume for engineering and design roles at Work Wizards Innovations.';
            keywords = 'Apply to WWI, tech jobs AP, software engineering application, Work Wizards Innovations careers';
          } else if (pathname !== '/') {
            const cleanJobId = pathname.replace(/^\/careers\//, '').replace(/^\//, '').replace(/\/apply$/, '');
            const job = getJobById(cleanJobId);
            if (job) {
              title = `${job.title} — Work Wizards Innovations Careers`;
              description = job.shortDescription || description;
              keywords = `${job.title}, WWI jobs, tech careers AP, software engineering hiring, Work Wizards Innovations`;
              schemaData = {
                '@context': 'https://schema.org',
                '@type': 'JobPosting',
                title: job.title,
                description: job.description || job.shortDescription,
                hiringOrganization: {
                  '@type': 'Organization',
                  name: 'Work Wizards Innovations',
                  sameAs: 'https://wwi.org.in/'
                },
                jobLocationType: 'TELECOMMUTE',
                employmentType: 'FULL_TIME'
              };
            } else {
              title = 'Career Opportunities — Work Wizards Innovations';
            }
          } else {
            title = 'Careers & Job Openings — Work Wizards Innovations (WWI)';
            description = 'Explore open engineering roles, remote opportunities, and developer internships at Work Wizards Innovations, tech startup in AP.';
            keywords = 'WWI careers, tech startup jobs AP, web developer jobs, software engineer jobs, Work Wizards Innovations hiring';
          }
          break;

        case 'contact':
          title = 'Contact Us — Work Wizards Innovations (WWI)';
          description = 'Get in touch with Work Wizards Innovations (WWI) for web development, app development, hackathons, and tech partnerships.';
          keywords = 'Contact Work Wizards Innovations, WWI contact, tech startup AP contact, hire web developers, hire app developers';
          break;

        case 'support':
          title = 'Customer & Technical Support Helpdesk — Work Wizards Innovations (WWI)';
          description = '24/7 intelligent AI support assistant, engineer helpline (+91 96181 31779), and mission-critical SLAs.';
          keywords = 'WWI support, technical support, customer care, Work Wizards Innovations helpline';
          break;

        case 'events':
          title = 'Events & Hackathons — Promptwars X WWI | Work Wizards Innovations';
          description = 'Promptwars X WWI, national developer hackathons, and technology alliances with Google for Developers, Hack2skill, and KIET Group.';
          keywords = 'Hackathons, Hackthons promptwars X wwi, promptwars X wwi, Promptwars, developer hackathons, AI hackathon, coding competitions, Work Wizards Innovations, WWI';
          schemaData = {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: 'Promptwars X Work Wizards Innovations',
            description: 'Flagship AI & Prompt Engineering Hackathon organized by Work Wizards Innovations with Google for Developers, Hack2skill, and KIET.',
            startDate: '2026-10-18T09:00:00+05:30',
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
            organizer: {
              '@type': 'Organization',
              name: 'Work Wizards Innovations',
              url: 'https://wwi.org.in/'
            }
          };
          break;

        case 'community':
          title = 'Developer Community — Work Wizards Innovations (WWI)';
          description = 'Empowering 1,500+ builders, student hackers, and engineering mentors across India with Work Wizards Innovations.';
          keywords = 'WWI community, developer community AP, student developers, hackathon community, Work Wizards Innovations';
          break;

        case 'blog':
          if (pathname !== '/') {
            const slug = pathname.replace(/^\/blogs\//, '').replace(/^\//, '');
            const post = getBlogBySlug(slug);
            if (post) {
              title = `${post.title} — Work Wizards Innovations (WWI)`;
              description = post.shortDescription || description;
              keywords = `${post.category || 'Technology'}, ${post.title}, WWI blog, tech startup in AP, web development, app development, Work Wizards Innovations`;
              if (post.featuredImage) ogImage = post.featuredImage;
              schemaData = {
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: post.title,
                description: post.shortDescription,
                image: post.featuredImage || ogImage,
                datePublished: post.createdAt,
                dateModified: post.updatedAt || post.createdAt,
                author: {
                  '@type': 'Person',
                  name: post.author || 'Work Wizards Innovations'
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'Work Wizards Innovations',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://wwi.org.in/assets/logo.svg'
                  }
                }
              };
            } else {
              title = 'Blog & Articles — Work Wizards Innovations (WWI)';
            }
          } else {
            title = 'Tech Blog & Engineering Insights — Work Wizards Innovations (WWI)';
            description = 'Articles, engineering patterns, and product updates from the builders at Work Wizards Innovations.';
            keywords = 'WWI blog, tech blog, web development articles, app development guides, tech startup in AP, Work Wizards Innovations';
          }
          break;

        case 'aboutus':
          title = 'About Us — Work Wizards Innovations (WWI) | Tech Startup in AP';
          description = 'Discover the mission, philosophy, and executive leadership behind Work Wizards Innovations Pvt Ltd, a pioneering tech startup in Andhra Pradesh.';
          keywords = 'About Work Wizards Innovations, WWI, tech startup in AP, Govinda Sai Ram, Andhra Pradesh startup, Work Wizards';
          break;

        default:
          title = config.title;
          description = config.description;
      }
    } else if (subdomainKey === 'unknown') {
      title = '404 — Subdomain Not Found | Work Wizards Innovations';
      description = 'The requested subdomain is not configured or does not exist.';
    } else {
      // Primary main domain routes (wwi.org.in)
      const mainMetadata = {
        '/': {
          title: 'Work Wizards Innovations (WWI) — Tech Startup in AP | Web & App Development',
          description: 'Work Wizards Innovations (WWI) is a premier tech startup in AP (Andhra Pradesh), delivering modern web development, mobile app development, AI solutions, and national hackathons like Promptwars X WWI.',
          keywords: 'WWI, Work Wizards Innovations, work wizards inovations, tech startup in AP, tech startup, startup, Web development, App development, Hackathons, promptwars X wwi, Promptwars, Andhra Pradesh tech startups, software company in AP'
        },
        '/about': {
          title: 'About Us — Work Wizards Innovations (WWI) | Tech Startup in AP',
          description: 'Learn about Work Wizards Innovations (WWI), our visionary leadership, and our journey as a leading tech startup in Andhra Pradesh (AP), India.',
          keywords: 'About Work Wizards Innovations, WWI, tech startup in AP, Govinda Sai Ram, AP startup, software engineering Andhra Pradesh, Work Wizards'
        },
        '/products': {
          title: 'Our Products — Work Wizards Innovations (WWI)',
          description: 'Explore homegrown digital platforms and productivity tools developed by Work Wizards Innovations.',
          keywords: 'WWI products, software platforms, AI platforms, Work Wizards Innovations'
        },
        '/services/web': {
          title: 'Web Development Services — Work Wizards Innovations (WWI)',
          description: 'Full-stack custom web development, high-performance React architectures, and cloud solutions engineered by WWI, a leading tech startup in AP.',
          keywords: 'Web development, Web developement, custom web development, React js, website development company, full stack web development, Work Wizards Innovations, WWI, tech startup in AP'
        },
        '/services/app': {
          title: 'Mobile App Development (Android & iOS) — Work Wizards Innovations (WWI)',
          description: 'Native Android and cross-platform mobile app development with Kotlin, Flutter, and React Native by Work Wizards Innovations.',
          keywords: 'App development, App developemnt, mobile app development, Android app development, Flutter app development, mobile applications, WWI, Work Wizards Innovations, tech startup in AP'
        },
        '/services/maintenance': {
          title: 'Website Maintenance & Tech Support — Work Wizards Innovations (WWI)',
          description: '24/7 uptime monitoring, security updates, SLA management, and ongoing technical support for your digital assets.',
          keywords: 'Website maintenance, technical support, server maintenance, SLA support, Work Wizards Innovations'
        },
        '/services/social-sphere': {
          title: 'The Social Sphere — Digital Growth & Social Branding | WWI',
          description: 'AI-assisted digital marketing, creative social media strategies, and content scaling by Work Wizards Innovations.',
          keywords: 'The Social Sphere, digital marketing, social media marketing, content creation, Work Wizards Innovations'
        },
        '/blogs': {
          title: 'Tech Blog & Articles — Work Wizards Innovations (WWI)',
          description: 'Read expert engineering articles on web development, mobile apps, AI hackathons, and tech startups in AP from Work Wizards Innovations.',
          keywords: 'WWI blog, tech blog, web development articles, app development blog, tech startup in AP, Work Wizards Innovations'
        },
        '/careers': {
          title: 'Careers & Job Openings — Work Wizards Innovations (WWI)',
          description: 'Explore engineering roles, internships, and tech opportunities at Work Wizards Innovations, a premier tech startup in AP.',
          keywords: 'WWI careers, tech startup jobs AP, web developer jobs, software engineer jobs, Work Wizards Innovations hiring'
        },
        '/careers/apply': {
          title: 'Apply for Career Roles — Work Wizards Innovations (WWI)',
          description: 'Submit your resume and job application to join Work Wizards Innovations as a software engineer or designer.',
          keywords: 'Job application, tech careers, software jobs AP, Work Wizards Innovations'
        },
        '/contact': {
          title: 'Contact Us — Work Wizards Innovations (WWI)',
          description: 'Get in touch with Work Wizards Innovations (WWI) for web development, app development, hackathons, and tech partnerships.',
          keywords: 'Contact Work Wizards Innovations, WWI contact, tech startup AP contact, hire web developers, hire app developers'
        },
        '/support': {
          title: 'Customer & Technical Support — Work Wizards Innovations (WWI)',
          description: '24/7 AI-assisted technical support, engineering helpline (+91 96181 31779), and mission-critical SLAs by WWI.',
          keywords: 'WWI support, technical support, website maintenance support, Work Wizards Innovations'
        },
        '/community': {
          title: 'Developer Community — Work Wizards Innovations (WWI)',
          description: 'Join 1,500+ builders, student innovators, and engineering mentors across India with Work Wizards Innovations.',
          keywords: 'WWI community, developer community AP, student developers, hackathon community, Work Wizards Innovations'
        },
        '/events': {
          title: 'Events & Hackathons — Promptwars X WWI | Work Wizards Innovations',
          description: 'Promptwars X WWI and flagship developer hackathons organized by Work Wizards Innovations with Google for Developers and Hack2skill.',
          keywords: 'Hackathons, Hackthons promptwars X wwi, promptwars X wwi, Promptwars, developer hackathons, AI hackathon, coding competitions, Work Wizards Innovations, WWI'
        },
        '/privacy': {
          title: 'Privacy Policy — Work Wizards Innovations (WWI)',
          description: 'Learn how Work Wizards Innovations Pvt Ltd handles, protects, and respects your privacy and personal data.',
          keywords: 'WWI privacy policy, terms and privacy, Work Wizards Innovations'
        },
        '/terms': {
          title: 'Terms of Service — Work Wizards Innovations (WWI)',
          description: 'Official terms of service governing the use of Work Wizards Innovations websites, platforms, and services.',
          keywords: 'WWI terms of service, legal terms, Work Wizards Innovations'
        }
      };

      if (mainMetadata[pathname]) {
        title = mainMetadata[pathname].title;
        description = mainMetadata[pathname].description;
        keywords = mainMetadata[pathname].keywords;

        if (pathname === '/') {
          schemaData = {
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebSite',
                name: 'Work Wizards Innovations',
                alternateName: ['WWI', 'Work Wizards', 'Work Wizards Innovations Pvt Ltd'],
                url: 'https://wwi.org.in/',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://blog.wwi.org.in/?search={search_term_string}',
                  'query-input': 'required name=search_term_string'
                }
              },
              {
                '@type': 'SiteNavigationElement',
                name: 'Web Development',
                url: 'https://web.wwi.org.in/'
              },
              {
                '@type': 'SiteNavigationElement',
                name: 'App Development',
                url: 'https://android.wwi.org.in/'
              },
              {
                '@type': 'SiteNavigationElement',
                name: 'Hackathons & Events',
                url: 'https://events.wwi.org.in/'
              },
              {
                '@type': 'SiteNavigationElement',
                name: 'Tech Blog',
                url: 'https://blog.wwi.org.in/'
              },
              {
                '@type': 'SiteNavigationElement',
                name: 'About Us',
                url: 'https://aboutus.wwi.org.in/'
              },
              {
                '@type': 'SiteNavigationElement',
                name: 'Careers',
                url: 'https://careers.wwi.org.in/'
              },
              {
                '@type': 'SiteNavigationElement',
                name: 'Contact Us',
                url: 'https://contact.wwi.org.in/'
              },
              {
                '@type': 'SiteNavigationElement',
                name: 'Maintenance & Support',
                url: 'https://maintenance.wwi.org.in/'
              }
            ]
          };
        } else if (pathname === '/events') {
          schemaData = {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: 'Promptwars X Work Wizards Innovations',
            description: 'Flagship AI & Prompt Engineering Hackathon organized by Work Wizards Innovations with Google for Developers, Hack2skill, and KIET.',
            startDate: '2026-10-18T09:00:00+05:30',
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
            organizer: {
              '@type': 'Organization',
              name: 'Work Wizards Innovations',
              url: 'https://wwi.org.in/'
            }
          };
        } else if (pathname === '/services/web') {
          schemaData = {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Web Development Services',
            provider: {
              '@type': 'Organization',
              name: 'Work Wizards Innovations'
            },
            serviceType: 'Custom Web Development, React Runtimes, Full-Stack Architecture'
          };
        } else if (pathname === '/services/app') {
          schemaData = {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Mobile App Development Services',
            provider: {
              '@type': 'Organization',
              name: 'Work Wizards Innovations'
            },
            serviceType: 'Native Android Development, Flutter, React Native Cross-Platform'
          };
        }
      } else if (pathname.startsWith('/careers/')) {
        const cleanJobId = pathname.replace(/^\/careers\//, '').replace(/\/apply$/, '');
        const job = getJobById(cleanJobId);
        if (job) {
          title = `${job.title} — Work Wizards Innovations Careers`;
          description = job.shortDescription || description;
          keywords = `${job.title}, WWI careers, tech jobs AP, Work Wizards Innovations hiring`;
          schemaData = {
            '@context': 'https://schema.org',
            '@type': 'JobPosting',
            title: job.title,
            description: job.description || job.shortDescription,
            hiringOrganization: {
              '@type': 'Organization',
              name: 'Work Wizards Innovations',
              sameAs: 'https://wwi.org.in/'
            },
            jobLocationType: 'TELECOMMUTE',
            employmentType: 'FULL_TIME'
          };
        } else {
          title = 'Career Details — Work Wizards Innovations';
        }
      } else if (pathname.startsWith('/blogs/')) {
        const slug = pathname.replace(/^\/blogs\//, '').replace(/\/$/, '');
        const post = getBlogBySlug(slug);
        if (post) {
          title = `${post.title} — Work Wizards Innovations (WWI)`;
          description = post.shortDescription || description;
          keywords = `${post.category || 'Technology'}, ${post.title}, WWI blog, tech startup in AP, web development, app development, Work Wizards Innovations`;
          if (post.featuredImage) ogImage = post.featuredImage;
          schemaData = {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.shortDescription,
            image: post.featuredImage || ogImage,
            datePublished: post.createdAt,
            dateModified: post.updatedAt || post.createdAt,
            author: {
              '@type': 'Person',
              name: post.author || 'Work Wizards Innovations'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Work Wizards Innovations',
              logo: {
                '@type': 'ImageObject',
                url: 'https://wwi.org.in/assets/logo.svg'
              }
            }
          };
        } else {
          title = 'Tech Blog — Work Wizards Innovations (WWI)';
        }
      } else {
        title = '404 — Page Not Found | Work Wizards Innovations';
      }
    }

    // Apply document title
    document.title = title;

    // Apply Meta Tags
    setOrUpdateMeta('meta[name="description"]', 'content', description);
    setOrUpdateMeta('meta[name="keywords"]', 'content', keywords);
    setOrUpdateMeta('meta[name="author"]', 'content', 'Work Wizards Innovations');
    setOrUpdateMeta('meta[name="robots"]', 'content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setOrUpdateMeta('meta[name="geo.region"]', 'content', 'IN-AP');
    setOrUpdateMeta('meta[name="geo.placename"]', 'content', 'Andhra Pradesh, India');

    // Open Graph
    setOrUpdateMeta('meta[property="og:title"]', 'content', title);
    setOrUpdateMeta('meta[property="og:description"]', 'content', description);
    setOrUpdateMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setOrUpdateMeta('meta[property="og:site_name"]', 'content', siteName);
    setOrUpdateMeta('meta[property="og:image"]', 'content', ogImage);

    // Twitter Card
    setOrUpdateMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setOrUpdateMeta('meta[name="twitter:site"]', 'content', '@workwizards26');
    setOrUpdateMeta('meta[name="twitter:title"]', 'content', title);
    setOrUpdateMeta('meta[name="twitter:description"]', 'content', description);
    setOrUpdateMeta('meta[name="twitter:image"]', 'content', ogImage);

    // Apply Canonical Link
    setOrUpdateLink('canonical', canonicalUrl);

    // Apply Dynamic JSON-LD Structured Data
    if (schemaData) {
      setOrUpdateJsonLd('wwi-dynamic-jsonld', schemaData);
    }
  }, [pathname]);

  return null;
}

export default SeoHead;
