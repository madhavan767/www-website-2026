import React from 'react';
import { Linkedin, Instagram, Globe } from 'lucide-react';
import { PageHero } from '../components/common/PageHero';
import { Reveal } from '../components/common/Reveal';
import { leadershipData } from '../data/leadershipData';
import { partnersData } from '../data/partnersData';

export function AboutPage() {
  return (
    <>
      <PageHero
        title="Our Story & Leadership"
        description="The visionary leadership behind Work Wizards Innovations, committed to driving digital transformation and delivering excellence."
      />

      {/* Leadership Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Leadership & Vision</h2>
          </Reveal>

          <div className="space-y-16">
            {leadershipData.map((leader, idx) => (
              <Reveal key={leader.name}>
                <div
                  className={`grid md:grid-cols-[260px_1fr] gap-8 items-start ${
                    idx % 2 ? "md:[direction:rtl]" : ""
                  }`}
                >
                  <div className="md:[direction:ltr] w-full aspect-square rounded-2xl overflow-hidden bg-card border border-border">
                    <img
                      loading="lazy"
                      src={leader.image}
                      alt={`${leader.name} portrait`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:[direction:ltr]">
                    <h3 className="text-2xl font-bold">{leader.name}</h3>
                    <div className="text-sm font-medium text-muted-foreground mt-1">
                      {leader.role}
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                      {leader.bio}
                    </p>
                    <div className="mt-5 flex gap-2">
                      {leader.links.linkedin && (
                        <a
                          aria-label="LinkedIn"
                          href={leader.links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 grid place-items-center rounded-full bg-secondary hover:bg-foreground hover:text-background transition"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {leader.links.instagram && (
                        <a
                          aria-label="Instagram"
                          href={leader.links.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 grid place-items-center rounded-full bg-secondary hover:bg-foreground hover:text-background transition"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {leader.links.web && (
                        <a
                          aria-label="Website"
                          href={leader.links.web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 grid place-items-center rounded-full bg-secondary hover:bg-foreground hover:text-background transition"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="px-6 py-20 bg-surface">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-3">
            <h2 className="text-3xl md:text-4xl font-bold">Our Partners</h2>
          </Reveal>
          <Reveal className="text-center mb-10">
            <p className="text-sm md:text-base text-muted-foreground">
              Collaborating with brands that share our vision for innovation and growth.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-6">
            {partnersData.map((partner, idx) => (
              <Reveal key={partner.name} delay={idx * 0.05}>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl border border-border overflow-hidden bg-background hover:shadow-lg transition-shadow"
                >
                  <div
                    className="h-40 md:h-48 grid place-items-center px-6 transition-transform group-hover:scale-[1.02]"
                    style={{ background: partner.bg }}
                  >
                    <span className="text-2xl md:text-4xl" style={partner.textStyle}>
                      {partner.text}
                    </span>
                  </div>
                  <div className="p-5 text-center">
                    <div className="text-lg font-semibold">{partner.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                      {partner.role}
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
