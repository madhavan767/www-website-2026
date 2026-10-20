import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Bot, 
  ArrowRight,
  Headphones,
  CheckCircle2
} from 'lucide-react';
import { PageHero } from '../components/common/PageHero';
import { Reveal } from '../components/common/Reveal';
import { SupportChatbot } from '../components/support/SupportChatbot';
import { companyData } from '../data/companyData';
import { getSubdomainUrl } from '../utils/subdomains';

const FAQS = [
  {
    q: "How fast does WWI respond to technical support requests?",
    a: "Under our active Maintenance & Support contracts, critical production outages receive guaranteed response within 1 hour. General support tickets, feature inquiries, and code updates are handled within 2-4 business hours."
  },
  {
    q: "Can I request custom feature additions under a maintenance plan?",
    a: "Yes. Our Maintenance plans include regular minor enhancements, UI tweaks, performance audits, and security updates. Larger new feature modules can be seamlessly added via dedicated milestone sprints."
  },
  {
    q: "What technologies does the WWI support team cover?",
    a: "We support the full modern tech stack: React, Next.js, Vite, Node.js, Tailwind CSS, TypeScript, Kotlin, Flutter, React Native, Firebase, PostgreSQL, MongoDB, Vercel, and Cloudflare infrastructures."
  },
  {
    q: "How do I report an urgent production bug or downtime?",
    a: "For immediate assistance, call our direct engineering helpline at +91 96181 31779 or email official@wwi.org.in with '[URGENT]' in the subject line for automated priority routing."
  }
];

export function SupportPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <>
      <PageHero
        title="Customer &amp; Technical Support"
        description="Experience 24/7 intelligent assistance, direct engineering helplines, and guaranteed SLAs for all WWI digital platforms and services."
      />

      <div className="space-y-20 py-16 px-6 max-w-7xl mx-auto">
        {/* Support Chatbot Interactive Section */}
        <section id="chat-assistant">
          <Reveal className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-muted-foreground border border-border mb-3">
              <Bot className="w-3.5 h-3.5 text-foreground" />
              Interactive Helpdesk
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Chat With WWI Support
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
              Get instant answers regarding web services, mobile apps, maintenance plans, SLAs, careers, or hackathons.
            </p>
          </Reveal>

          <Reveal>
            <SupportChatbot />
          </Reveal>
        </section>

        {/* Support Channels Grid */}
        <section id="channels">
          <Reveal className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
              Direct Support Channels
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Prefer speaking with a human? Connect directly with our engineering and operations team.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Phone */}
            <Reveal delay={0.05}>
              <div className="h-full p-7 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-secondary border border-border text-foreground grid place-items-center mb-5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold">Direct Phone Helpline</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Speak directly with our technical support and project operations desk.
                  </p>
                  <div className="mt-4 font-mono font-bold text-foreground text-sm">
                    +91 96181 31779
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Mon - Sat, 9:00 AM - 8:00 PM IST
                  </div>
                </div>
                <a
                  href="tel:+919618131779"
                  className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background font-semibold text-xs hover:opacity-90 transition"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Now
                </a>
              </div>
            </Reveal>

            {/* Email */}
            <Reveal delay={0.1}>
              <div className="h-full p-7 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-secondary border border-border text-foreground grid place-items-center mb-5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold">Official Support Desk</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Email detailed bug reports, project specifications, or contract queries.
                  </p>
                  <div className="mt-4 font-mono font-bold text-foreground text-sm break-all">
                    official@wwi.org.in
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Guaranteed reply within 2-4 business hours
                  </div>
                </div>
                <a
                  href="mailto:official@wwi.org.in?subject=Technical+Support+Inquiry"
                  className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-foreground font-semibold text-xs border border-border hover:bg-secondary/80 transition"
                >
                  <Mail className="w-3.5 h-3.5" /> Send Email
                </a>
              </div>
            </Reveal>

            {/* SLA Response */}
            <Reveal delay={0.15}>
              <div className="h-full p-7 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-secondary border border-border text-foreground grid place-items-center mb-5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold">Emergency Downtime SLA</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Active client production infrastructure monitored 24/7 with rapid resolution SLAs.
                  </p>
                  <div className="mt-4 font-mono font-bold text-foreground text-sm">
                    &lt; 1-Hour SLA Resolution
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Automated heartbeat health monitoring
                  </div>
                </div>
                <a
                  href={getSubdomainUrl('maintenance', '/')}
                  className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-foreground font-semibold text-xs border border-border hover:bg-secondary/80 transition"
                >
                  View Maintenance Plans <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FAQs */}
        <section id="faqs" className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-muted-foreground border border-border mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-foreground" />
              Frequently Asked Questions
            </div>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
              Support FAQs
            </h3>
          </Reveal>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <Reveal key={idx} delay={idx * 0.05}>
                <div className="rounded-2xl border border-border bg-card overflow-hidden transition">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm hover:text-foreground cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default SupportPage;
