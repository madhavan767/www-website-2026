import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Linkedin, Instagram, Twitter, Facebook, Mail, Phone } from 'lucide-react';
import { SubdomainLink } from '../common/SubdomainLink';
import { companyData } from '../../data/companyData';

export function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleAdminDotDoubleClick = (e) => {
    e.preventDefault();
    navigate('/admin/dashboard');
  };

  return (
    <footer className="border-t border-border bg-background mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
        {/* Column 1: Brand Info */}
        <div>
          <SubdomainLink subdomain="main" to="/" className="flex items-center gap-2.5 font-semibold">
            <img
              src="/favicon.svg"
              alt="Work Wizards Innovations logo"
              width={36}
              height={22}
              className="h-6 w-auto"
            />
            <span>Work Wizards Innovations</span>
          </SubdomainLink>
          <p className="text-sm text-muted-foreground mt-3">
            Innovating Web, Apps &amp; Beyond.
          </p>
          <div className="mt-4 text-xs text-muted-foreground">
            Multi-domain architecture powering web, android, maintenance, careers, events, and AI products.
          </div>
        </div>

        {/* Column 2: Quick Links (8 items in two columns: 4 - 4) */}
        <div>
          <div className="text-sm font-semibold mb-3">Quick Links</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {/* Sub-column 1: First 4 */}
            <div className="space-y-2">
              <SubdomainLink subdomain="main" to="/" className="block hover:text-foreground transition-colors">
                Home
              </SubdomainLink>
              <SubdomainLink subdomain="aboutus" to="/" className="block hover:text-foreground transition-colors">
                About Us
              </SubdomainLink>
              <SubdomainLink subdomain="events" to="/" className="block hover:text-foreground transition-colors">
                Events
              </SubdomainLink>
              <SubdomainLink subdomain="careers" to="/" className="block hover:text-foreground transition-colors">
                Careers
              </SubdomainLink>
            </div>

            {/* Sub-column 2: Second 4 */}
            <div className="space-y-2">
              <SubdomainLink subdomain="blog" to="/" className="block hover:text-foreground transition-colors">
                Blogs
              </SubdomainLink>
              <SubdomainLink subdomain="community" to="/" className="block hover:text-foreground transition-colors">
                Community
              </SubdomainLink>
              <SubdomainLink subdomain="support" to="/" className="block hover:text-foreground transition-colors font-medium text-foreground/90">
                Support
              </SubdomainLink>
              <SubdomainLink subdomain="contact" to="/" className="block hover:text-foreground transition-colors">
                Contact
              </SubdomainLink>
            </div>
          </div>
        </div>

        {/* Column 3: Services */}
        <div>
          <div className="text-sm font-semibold mb-3">Services &amp; Portals</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <SubdomainLink subdomain="web" to="/" className="hover:text-foreground transition-colors">
                Web Services
              </SubdomainLink>
            </li>
            <li>
              <SubdomainLink subdomain="android" to="/" className="hover:text-foreground transition-colors">
                Android &amp; Mobile Apps
              </SubdomainLink>
            </li>
            <li>
              <SubdomainLink subdomain="maintenance" to="/" className="hover:text-foreground transition-colors">
                Maintenance &amp; Support
              </SubdomainLink>
            </li>
            <li>
              <SubdomainLink subdomain="socialsphere" to="/" className="hover:text-foreground transition-colors">
                The Social Sphere
              </SubdomainLink>
            </li>
            <li>
              <SubdomainLink subdomain="main" to="/products" className="hover:text-foreground transition-colors">
                Our Products
              </SubdomainLink>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal & Connect */}
        <div>
          <div className="text-sm font-semibold mb-3">Legal &amp; Connect</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <SubdomainLink subdomain="main" to="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </SubdomainLink>
            </li>
            <li>
              <SubdomainLink subdomain="main" to="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </SubdomainLink>
            </li>
          </ul>

          <div className="flex items-center gap-3 mt-4">
            <a
              href={companyData.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 grid place-items-center rounded-full bg-secondary hover:bg-foreground hover:text-background transition"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={companyData.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 grid place-items-center rounded-full bg-secondary hover:bg-foreground hover:text-background transition"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={companyData.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="w-9 h-9 grid place-items-center rounded-full bg-secondary hover:bg-foreground hover:text-background transition"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={companyData.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 grid place-items-center rounded-full bg-secondary hover:bg-foreground hover:text-background transition"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${companyData.emails.official}`}
              aria-label="Email"
              className="w-9 h-9 grid place-items-center rounded-full bg-secondary hover:bg-foreground hover:text-background transition"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="tel:+919618131779"
              aria-label="Phone"
              className="w-9 h-9 grid place-items-center rounded-full bg-secondary hover:bg-foreground hover:text-background transition"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-5 text-xs text-muted-foreground flex flex-wrap justify-between gap-3 items-center">
          <span>© {currentYear} Work Wizards Innovations Pvt Ltd. All rights reserved.</span>
          <span className="flex items-center gap-2">
            Innovating Web, Apps &amp; Beyond
            <button
              type="button"
              onDoubleClick={handleAdminDotDoubleClick}
              aria-label=""
              tabIndex={-1}
              className="w-1.5 h-1.5 rounded-full bg-foreground/35 hover:bg-foreground transition-colors cursor-default select-none inline-block ml-0.5 focus:outline-none"
            />
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
