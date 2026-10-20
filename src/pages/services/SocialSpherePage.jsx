import React from 'react';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  ChartColumn,
  Users,
  Zap,
  Check,
  Star,
  Phone,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { BackButton } from '../../components/common/BackButton';
import { Reveal } from '../../components/common/Reveal';
import {
  socialSphereFeatures,
  socialSpherePlans
} from '../../data/servicesData';
import { companyData } from '../../data/companyData';

const iconMap = {
  Megaphone,
  ChartColumn,
  Users,
  Zap
};

export function SocialSpherePage() {
  const maintenanceFeatures = [
    "Social media handle management (posting provided content)",
    "Maintenance of Meta Ads, Google AdSense & Adestra",
    "Dedicated support hours",
    "Regular posting & account activity management",
    "Basic engagement handling"
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-28 pb-12 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <BackButton label="Back" />
          </div>

          <Reveal>
            <div className="inline-flex items-center text-xs uppercase tracking-[0.18em] text-muted-foreground border border-border rounded-full px-3 py-1 mb-4">
              by Work Wizards Innovations
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">The Social Sphere</h1>
            <p className="mt-4 text-base md:text-lg font-medium text-foreground">
              AI-Powered Content Creation &amp; Social Media Management
            </p>
            <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
              A subscription-based AI-powered social media growth engine designed to help businesses scale their digital presence with consistent content, ad management, and audience engagement.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#plans"
                className="inline-flex items-center gap-2 bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
              >
                View Plans →
              </a>
              <a
                href="#enterprise"
                className="inline-flex items-center gap-2 border border-border rounded-full px-5 py-2.5 text-sm font-medium hover:bg-secondary transition"
              >
                Get Started
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Feature Ticker Bar */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4">
          {socialSphereFeatures.map((item) => {
            const IconComp = iconMap[item.iconName] || Zap;
            return (
              <div
                key={item.label}
                className="flex items-center justify-center gap-2 py-5 text-sm border-r last:border-r-0 border-border"
              >
                <IconComp className="w-4 h-4 text-foreground" />
                <span className="font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="px-6 py-20 scroll-mt-12">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Choose Your Plan</h2>
            <p className="mt-3 text-muted-foreground">
              Flexible plans designed for every stage of your social media journey
            </p>
          </Reveal>

          {/* Entry-Level Maintenance Plan */}
          <Reveal>
            <div className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Entry-Level Plan
            </div>
            <div className="max-w-2xl mx-auto p-7 rounded-2xl bg-card border border-border">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Social Media Maintenance Plan</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    For businesses that already have content and need professional management support.
                  </p>
                </div>
                <a
                  href="#enterprise"
                  className="bg-foreground text-background rounded-full px-4 py-2 text-xs font-medium shrink-0 hover:opacity-90 transition"
                >
                  Get Started
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                {[
                  ["₹1,999/mo", "Up to 4 social media handles"],
                  ["₹2,499/mo", "5 or more handles"]
                ].map(([price, desc]) => (
                  <div key={price} className="p-3 rounded-xl bg-background border border-border">
                    <div className="font-bold text-base">{price}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                  </div>
                ))}
              </div>

              <ul className="mt-5 space-y-2 text-sm">
                {maintenanceFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 mt-0.5 text-foreground shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-xs text-muted-foreground italic">
                Discounts available for quarterly, half-yearly &amp; annual plans. Contact The Social Sphere team for offers.
              </p>
            </div>
          </Reveal>

          {/* All-Inclusive Plans */}
          <div className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 mt-16">
            All-Inclusive Plans
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {socialSpherePlans.map((plan, idx) => (
              <Reveal key={plan.name} delay={idx * 0.05}>
                <div
                  className={`relative p-7 rounded-2xl bg-card border h-full flex flex-col ${
                    plan.popular
                      ? "border-foreground ring-2 ring-foreground/10"
                      : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-foreground text-background text-xs px-3 py-1 rounded-full shadow-sm">
                      <Star className="w-3 h-3 fill-current" /> Most Popular
                    </span>
                  )}
                  <div className="text-xs font-semibold tracking-wider text-foreground">
                    {plan.name}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <ul className="mt-6 space-y-2 text-sm flex-1">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-muted-foreground">
                        <Check className="w-4 h-4 mt-0.5 text-foreground shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#enterprise"
                    className="mt-6 inline-flex justify-center bg-foreground text-background rounded-full py-2.5 text-sm font-medium hover:opacity-90 transition"
                  >
                    Get Started
                  </a>
                  <a
                    href="#enterprise"
                    className="mt-2 text-center text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    Contact Us
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Contact Section */}
      <section id="enterprise" className="px-6 py-20 scroll-mt-12">
        <div className="max-w-5xl mx-auto rounded-3xl bg-foreground text-background p-12 md:p-16 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold">WWI Enterprise / Contact</h2>
            <p className="mt-3 text-background/70 max-w-xl mx-auto">
              For large businesses, agencies, and custom requirements — reach out to our team.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <a
                href="tel:+919618131779"
                className="inline-flex items-center gap-2 bg-background/10 border border-background/20 rounded-full px-5 py-2.5 text-sm hover:bg-background/20 transition"
              >
                <Phone className="w-4 h-4" /> +91 96181 31779
              </a>
            </div>
            <div className="mt-3 flex justify-center">
              <a
                href={`mailto:${companyData.emails.socialSphere}`}
                className="inline-flex items-center gap-2 bg-background/10 border border-background/20 rounded-full px-5 py-2.5 text-sm hover:bg-background/20 transition"
              >
                <Mail className="w-4 h-4" /> {companyData.emails.socialSphere}
              </a>
            </div>
            <p className="mt-10 text-sm text-background/60 italic">
              "The Social Sphere by Work Wizards Innovations — A premium AI-powered social media growth solution for modern businesses."
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default SocialSpherePage;
