import React from 'react';
import {
  Smartphone,
  Layers,
  Cpu,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { PageHero } from '../../components/common/PageHero';
import { Reveal } from '../../components/common/Reveal';
import { CTASection } from '../../components/common/CTASection';
import {
  appPlatforms,
  appFeatures,
  applicationsWeBuild,
  appTools
} from '../../data/servicesData';

const iconMap = {
  Smartphone,
  Layers,
  Cpu,
  Zap
};

export function AppDevelopmentPage() {
  return (
    <>
      <PageHero
        title="App Development"
        description="We create powerful mobile applications for Android and iOS that deliver exceptional user experiences. From business solutions to consumer apps, we bring your mobile vision to life."
      />

      {/* Multi-Platform Expertise */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Multi-Platform Expertise</h2>
            <p className="mt-3 text-muted-foreground">
              Whether you need native performance or cross-platform efficiency, we've got you covered
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-3">
            {appPlatforms.map((item, idx) => (
              <Reveal key={item.title} delay={idx * 0.05}>
                <div className="p-8 rounded-2xl bg-card border border-border h-full text-center">
                  <div className="w-12 h-12 grid place-items-center rounded-full bg-foreground text-background mx-auto">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="mt-5 font-semibold text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* App Features We Excel At */}
      <section className="px-6 py-20 bg-surface">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">App Features We Excel At</h2>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {appFeatures.map((item, idx) => {
              const IconComp = iconMap[item.iconName] || Smartphone;
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

      {/* Applications We Build */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Applications We Build</h2>
          </Reveal>

          <div className="space-y-4">
            {applicationsWeBuild.map(([title, desc, tags], idx) => (
              <Reveal key={title} delay={idx * 0.05}>
                <div className="p-7 rounded-2xl bg-card border border-border">
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-background border border-border"
                      >
                        <CheckCircle2 className="w-3 h-3 text-foreground" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies & Tools */}
      <section className="px-6 py-20 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold">Technologies &amp; Tools</h2>
            <div className="mt-8 flex flex-wrap gap-2 justify-center">
              {appTools.map((tool) => (
                <span
                  key={tool}
                  className="px-4 py-2 rounded-full bg-background border border-border text-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Let's Build Your Next App"
        description="Turn your app idea into reality with our expert development team"
        ctaLabel="Start Your Project"
      />
    </>
  );
}

export default AppDevelopmentPage;
