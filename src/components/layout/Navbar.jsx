import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubdomainLink } from '../common/SubdomainLink';
import { getCurrentSubdomain } from '../../utils/subdomains';

const servicesNav = [
  { name: "Web Services", subdomain: "web", to: "/" },
  { name: "App Development", subdomain: "android", to: "/" },
  { name: "Maintenance & Support", subdomain: "maintenance", to: "/" },
  { name: "The Social Sphere", subdomain: "socialsphere", to: "/" },
  { name: "Our Products", subdomain: "main", to: "/products" }
];

export function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const currentSubdomain = getCurrentSubdomain();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const isLinkActive = (subdomainKey, path = '/') => {
    if (subdomainKey === 'main') {
      return currentSubdomain === 'main' && (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path));
    }
    return currentSubdomain === subdomainKey;
  };

  const navClass = (subdomainKey, path = '/') => {
    const active = isLinkActive(subdomainKey, path);
    return `text-sm transition-colors ${
      active ? "text-foreground font-semibold" : "text-foreground/80 hover:text-foreground"
    }`;
  };

  const isServicesActive = ['web', 'android', 'maintenance', 'socialsphere'].includes(currentSubdomain) ||
    (currentSubdomain === 'main' && (location.pathname.startsWith('/services') || location.pathname === '/products'));

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-xs"
          : "bg-background border-b border-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Name (Always identical across all pages) */}
        <SubdomainLink
          subdomain="main"
          to="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight group"
        >
          <img
            src="/favicon.svg"
            alt="Work Wizards Innovations logo"
            width={36}
            height={22}
            className="h-6 w-auto transition-transform group-hover:scale-110"
          />
          <span className="hidden sm:inline">Work Wizards Innovations</span>
          <span className="sm:hidden">WWI</span>
        </SubdomainLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <SubdomainLink subdomain="main" to="/" className={navClass('main', '/')}>
            Home
          </SubdomainLink>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className={`flex items-center gap-1 text-sm transition-colors cursor-pointer ${
                isServicesActive
                  ? "text-foreground font-semibold"
                  : "text-foreground/80 hover:text-foreground"
              }`}
            >
              Services <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
                >
                  <div className="bg-background border border-border rounded-2xl shadow-lg p-2 min-w-[240px]">
                    {servicesNav.map((item) => (
                      <SubdomainLink
                        key={item.name}
                        subdomain={item.subdomain}
                        to={item.to}
                        className="block px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors"
                      >
                        {item.name}
                      </SubdomainLink>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <SubdomainLink subdomain="aboutus" to="/" className={navClass('aboutus', '/')}>
            About Us
          </SubdomainLink>

          <SubdomainLink subdomain="events" to="/" className={navClass('events', '/')}>
            Events
          </SubdomainLink>

          <SubdomainLink subdomain="careers" to="/" className={navClass('careers', '/')}>
            Careers
          </SubdomainLink>

          <SubdomainLink subdomain="contact" to="/" className={navClass('contact', '/')}>
            Contact
          </SubdomainLink>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          className="md:hidden p-1 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border overflow-hidden bg-background"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              <SubdomainLink
                subdomain="main"
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm py-1 font-medium"
              >
                Home
              </SubdomainLink>

              <div className="text-xs uppercase tracking-wider text-muted-foreground pt-2 font-semibold">
                Services
              </div>
              {servicesNav.map((item) => (
                <SubdomainLink
                  key={item.name}
                  subdomain={item.subdomain}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm py-1 pl-2 text-muted-foreground hover:text-foreground"
                >
                  {item.name}
                </SubdomainLink>
              ))}

              <SubdomainLink
                subdomain="aboutus"
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm py-1 font-medium pt-2"
              >
                About Us
              </SubdomainLink>

              <SubdomainLink
                subdomain="events"
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm py-1 font-medium"
              >
                Events
              </SubdomainLink>

              <SubdomainLink
                subdomain="careers"
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm py-1 font-medium"
              >
                Careers
              </SubdomainLink>

              <SubdomainLink
                subdomain="contact"
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm py-1 font-medium"
              >
                Contact
              </SubdomainLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
