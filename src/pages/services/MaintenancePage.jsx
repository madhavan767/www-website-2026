import React from 'react';
import {
  Wrench,
  ShieldCheck,
  TrendingUp,
  Headphones,
  Check,
  Zap
} from 'lucide-react';
import { PageHero } from '../../components/common/PageHero';
import { Reveal } from '../../components/common/Reveal';
import { CTASection } from '../../components/common/CTASection';
import {
  maintenanceServices,
  maintenancePlans,
  maintenanceCoverage
} from '../../data/servicesData';

const iconMap = {
  Wrench,
  ShieldCheck,
  TrendingUp,
  Headphones
};

export function MaintenancePage() {
  return (
    <>
      <PageHero
        title="Maintenance & Support"
        description="We don't just build your digital solutions—we ensure they stay secure, performant, and up-to-date. Our pay-as-you-go model gives you full technical support without the burden of a full-time tech team."
      />

      {/* Complete Tech Management */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Complete Tech Management</h2>
            <p className="mt-3 text-muted-foreground">
              From routine maintenance to critical support, we handle all your technical needs
            </p>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {maintenanceServices.map((item, idx) => {
              const IconComp = iconMap[item.iconName] || Wrench;
              return (
                <Reveal key={item.title} delay={idx * 0.05}>
                  <div className="flex gap-4 p-6 rounded-2xl bg-card border border-border h-full">
                    <div className="w-11 h-11 grid place-items-center rounded-xl bg-foreground text-background shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Flexible Support Plans */}
      <section className="px-6 py-20 bg-surface">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Flexible Support Plans</h2>
            <p className="mt-3 text-muted-foreground">
              Choose the level of support that fits your needs with our pay-as-you-go model
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-3">
            {maintenancePlans.map((plan, idx) => (
              <Reveal key={plan.name} delay={idx * 0.05}>
                <div className="p-7 rounded-2xl bg-background border border-border h-full flex flex-col">
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <ul className="mt-5 space-y-2 text-sm flex-1">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-muted-foreground">
                        <Check className="w-4 h-4 mt-0.5 text-foreground shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-5 border-t border-border text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Ideal for: </span>
                    {plan.ideal}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">What We Cover</h2>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {maintenanceCoverage.map((item, idx) => (
              <Reveal key={item} delay={idx * 0.04}>
                <div className="p-4 rounded-xl bg-card border border-border flex items-center gap-3">
                  <div className="w-8 h-8 grid place-items-center rounded-lg bg-foreground text-background shrink-0">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pay-As-You-Go Section */}
      <section className="px-6 py-20 bg-surface">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="p-10 rounded-2xl bg-background border border-border text-center">
              <div className="w-12 h-12 grid place-items-center rounded-full bg-foreground text-background mx-auto">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="mt-5 text-2xl font-bold">Pay-As-You-Go Pricing</h3>
              <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
                No long-term contracts or hidden fees. Pay only for the support and maintenance you need, when you need it. Scale up or down based on your requirements without any commitment.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl mx-auto">
                {[
                  ["No", "Long-term Contracts"],
                  ["24/7", "Monitoring Available"],
                  ["100%", "Transparency"]
                ].map(([val, label]) => (
                  <div key={label} className="p-4 rounded-xl bg-card border border-border">
                    <div className="text-xl font-bold">{val}</div>
                    <div className="text-xs text-muted-foreground mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Need Technical Support?"
        description="Let us handle your tech issues while you focus on growing your business"
        ctaLabel="Get Support Now"
      />
    </>
  );
}

export default MaintenancePage;
