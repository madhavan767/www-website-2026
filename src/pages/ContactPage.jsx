import React from 'react';
import {
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Phone,
  Mail
} from 'lucide-react';
import { PageHero } from '../components/common/PageHero';
import { ContactForm } from '../components/common/ContactForm';
import { Reveal } from '../components/common/Reveal';
import { companyData } from '../data/companyData';

export function ContactPage() {
  const contactChannels = [
    { icon: Linkedin, label: "LinkedIn", href: companyData.socialLinks.linkedin },
    { icon: Twitter, label: "X (Twitter)", href: companyData.socialLinks.twitter },
    { icon: Instagram, label: "Instagram", href: companyData.socialLinks.instagram },
    { icon: Facebook, label: "Facebook", href: companyData.socialLinks.facebook },
    { icon: Phone, label: "+91 96181 31779", href: "tel:+919618131779" },
    { icon: Mail, label: companyData.emails.official, href: `mailto:${companyData.emails.official}` }
  ];

  return (
    <>
      <PageHero
        title="Get In Touch"
        description="Have a project in mind? Let's discuss how we can help bring your ideas to life."
      />

      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto grid gap-6 md:gap-8 md:grid-cols-2 items-start">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="p-6 md:p-7 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold text-lg">Connect With Us</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Follow us on social media to stay updated with our latest innovations and products.
              </p>
              <ul className="mt-6 space-y-4 text-sm">
                {contactChannels.map(({ icon: Icon, label, href }) => (
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
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
