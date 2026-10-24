import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Globe,
  Smartphone,
  Wrench,
  Package,
  ShieldCheck,
  Brain,
  HeartHandshake,
  Zap,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Phone,
  Mail
} from 'lucide-react';
import { Reveal } from '../components/common/Reveal';
import { ContactForm } from '../components/common/ContactForm';
import { homeServices, whyChooseUs } from '../data/servicesData';
import { companyData } from '../data/companyData';

const iconMap = {
  Globe,
  Smartphone,
  Wrench,
  Package,
  Sparkles,
  ShieldCheck,
  Brain,
  HeartHandshake,
  Zap
};

export function HomePage() {
  const contactLinks = [
    { icon: Linkedin, label: "LinkedIn", href: companyData.socialLinks.linkedin },
    { icon: Twitter, label: "X (Twitter)", href: companyData.socialLinks.twitter },
    { icon: Instagram, label: "Instagram", href: companyData.socialLinks.instagram },
    { icon: Facebook, label: "Facebook", href: companyData.socialLinks.facebook },
    { icon: Phone, label: "+91 96181 31779", href: "tel:+919618131779" },
    { icon: Mail, label: companyData.emails.official, href: `mailto:${companyData.emails.official}` }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="px-4 sm:px-6 pt-16 sm:pt-20 pb-16 sm:pb-24 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto">
          {/* WWI Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <img
              src="/assets/logo.svg"
              alt="Work Wizards Innovations logo"
              className="w-32 sm:w-48 md:w-60 lg:w-72 h-auto max-w-full drop-shadow-sm transition-transform duration-300 hover:scale-105"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontWeight: 800, letterSpacing: "-0.03em" }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground leading-[1.1] sm:leading-[1.02]"
          >
            Work Wizards<br />Innovations
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground"
          >
            Innovating Web, Apps &amp; Beyond • Leading Tech Startup in AP
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-3 justify-center"
          >
            <a
              href="#services"
              className="inline-flex items-center gap-2 bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              Explore Our Services <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-border rounded-full px-5 py-2.5 text-sm font-medium hover:bg-secondary transition"
            >
              Get In Touch
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5"
          >
            <Sparkles className="w-3 h-3" /> Tech Startup in AP • Web &amp; App Development • Promptwars X WWI
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="px-6 py-20 scroll-mt-12">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Our Services</h2>
            <p className="mt-3 text-muted-foreground">
              Comprehensive digital solutions designed to elevate your business
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {homeServices.map((service, idx) => {
              const IconComp = iconMap[service.iconName] || Globe;
              return (
                <Reveal key={service.title} delay={idx * 0.05}>
                  <Link
                    to={service.to}
                    className="group block h-full p-7 rounded-2xl bg-card border border-border hover:border-foreground/40 hover:-translate-y-1 transition-all"
                  >
                    <IconComp className="w-6 h-6 text-foreground" />
                    <h3 className="mt-5 font-semibold text-lg">{service.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {service.desc}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-6 py-20 bg-surface">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Why Choose Us</h2>
            <p className="mt-3 text-muted-foreground">
              We deliver excellence through innovation, reliability, and unwavering commitment.
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2">
            {whyChooseUs.map((item, idx) => {
              const IconComp = iconMap[item.iconName] || Sparkles;
              return (
                <Reveal key={item.title} delay={idx * 0.05}>
                  <div className="p-7 rounded-2xl bg-background border border-border h-full flex gap-5">
                    <div className="w-11 h-11 grid place-items-center rounded-xl bg-foreground text-background shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Us Preview Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">About Us</h2>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="p-8 rounded-2xl bg-card border border-border h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Turning Ideas Into Digital Reality</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    At Work Wizards Innovations (WWI), we are a fast-growing tech startup in AP (Andhra Pradesh) dedicated to building innovative digital solutions that empower businesses and developers. Our core expertise spans full-stack web development, mobile app development, ongoing technical support, and organizing flagship competitive hackathons like Promptwars X WWI.
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 bg-foreground text-background rounded-full px-4 py-2 text-sm"
                  >
                    Get there <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </Reveal>

            <div className="grid gap-6">
              <Reveal delay={0.1}>
                <div className="p-7 rounded-2xl bg-card border border-border">
                  <h4 className="font-semibold">Our Mission</h4>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    To deliver cutting-edge digital solutions that drive innovation, efficiency, and growth for our clients and users.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="p-7 rounded-2xl bg-card border border-border">
                  <h4 className="font-semibold">Our Vision</h4>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    To be the leading force in digital transformation, creating products and services that shape the future of technology.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team Preview Section */}
      <section className="px-6 py-20 bg-surface">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Join Our Team</h2>
            <p className="mt-3 text-muted-foreground">
              Be part of the next generation of digital innovators
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="p-7 rounded-2xl bg-background border border-border h-full">
                <Zap className="w-5 h-5 text-foreground" />
                <h3 className="mt-4 font-semibold">Why Work With Us?</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                  <li>Work on cutting-edge technologies</li>
                  <li>Flexible, remote-work options</li>
                  <li>Continuous learning opportunities</li>
                  <li>Collaborative team environment</li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="p-7 rounded-2xl bg-background border border-border h-full flex flex-col justify-between">
                <div>
                  <Sparkles className="w-5 h-5 text-foreground" />
                  <h3 className="mt-4 font-semibold">We're Hiring!</h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    We're always looking for talented individuals to join our growing team. Explore open positions and start your journey with us.
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    to="/careers"
                    className="inline-flex items-center gap-2 bg-foreground text-background rounded-full px-4 py-2 text-sm"
                  >
                    Explore Careers at WWI <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Transform Digital Presence CTA Banner */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto rounded-3xl bg-foreground text-background p-12 md:p-16">
          <Reveal className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="mt-3 text-background/70 max-w-xl mx-auto">
              Join forces with Work Wizards Innovations and bring your vision to life.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-background text-foreground rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
              >
                Work With Us <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/careers"
                className="inline-flex items-center border border-background/30 rounded-full px-5 py-2.5 text-sm font-medium hover:bg-background/10 transition"
              >
                Join the Journey
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6 max-w-xl mx-auto pt-10 border-t border-background/15 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold">24/7</div>
                <div className="mt-1 text-xs text-background/60">Support Available</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold">Strategic</div>
                <div className="mt-1 text-xs text-background/60">Planning</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-6 py-20 scroll-mt-12">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Get In Touch</h2>
            <p className="mt-3 text-muted-foreground">
              Have a project in mind? Let's discuss how we can help bring your ideas to life.
            </p>
          </Reveal>

          <Reveal>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
              <ContactForm />
              <div className="p-6 md:p-7 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-lg">Connect With Us</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Follow us on social media to stay updated with our latest innovations and products.
                </p>
                <ul className="mt-6 space-y-4 text-sm">
                  {contactLinks.map(({ icon: Icon, label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 hover:text-foreground transition"
                      >
                        <span className="w-9 h-9 grid place-items-center rounded-lg bg-foreground text-background group-hover:opacity-90 transition shrink-0">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="font-medium">{label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default HomePage;
