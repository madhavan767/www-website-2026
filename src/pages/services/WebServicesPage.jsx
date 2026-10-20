import React from 'react';
import {
  CodeXml,
  Palette,
  Zap,
  Globe,
  CheckCircle2
} from 'lucide-react';
import { PageHero } from '../../components/common/PageHero';
import { Reveal } from '../../components/common/Reveal';
import { CTASection } from '../../components/common/CTASection';
import { webTechnologies, webDeliverables, webProcess } from '../../data/servicesData';

const iconMap = {
  CodeXml,
  Palette,
  Zap,
  Globe
};

export function WebServicesPage() {
  return (
    <>
      <PageHero
        title="Web Services"
        description="We craft exceptional web experiences using cutting-edge technologies and frameworks. From concept to deployment, we deliver high-performance web solutions tailored to your business needs."
      />

      {/* High-End Technologies */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">High-End Technologies</h2>
            <p className="mt-3 text-muted-foreground">
              We leverage the most powerful and modern frameworks to build robust, scalable web applications
            </p>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {webTechnologies.map(([name, desc], idx) => (
              <Reveal key={name} delay={idx * 0.04}>
                <div className="p-6 rounded-2xl bg-card border border-border h-full">
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground" /> {name}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What We Deliver */}
      <section className="px-6 py-20 bg-surface">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">What We Deliver</h2>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {webDeliverables.map((item, idx) => {
              const IconComp = iconMap[item.iconName] || Globe;
              return (
                <Reveal key={item.title} delay={idx * 0.05}>
                  <div className="flex gap-4 p-6 rounded-2xl bg-background border border-border h-full">
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

      {/* Our Development Process */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Development Process</h2>
            <p className="mt-3 text-muted-foreground">
              A proven methodology that ensures quality and timely delivery
            </p>
          </Reveal>

          <div className="space-y-3">
            {webProcess.map(([title, desc], idx) => (
              <Reveal key={title} delay={idx * 0.04}>
                <div className="flex items-center gap-5 p-5 rounded-2xl bg-card border border-border">
                  <div className="w-10 h-10 grid place-items-center rounded-full bg-foreground text-background text-sm font-bold shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{title}</div>
                    <div className="text-sm text-muted-foreground">{desc}</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Build Your Web Presence?"
        description="Let's create something amazing together with cutting-edge technology"
      />
    </>
  );
}

export default WebServicesPage;
