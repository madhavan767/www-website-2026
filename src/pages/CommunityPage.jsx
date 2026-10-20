import React from 'react';
import { 
  Users, 
  Sparkles, 
  Trophy, 
  CodeXml, 
  GraduationCap, 
  Handshake, 
  ArrowRight, 
  Mail, 
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { PageHero } from '../components/common/PageHero';
import { Reveal } from '../components/common/Reveal';
import { getSubdomainUrl } from '../utils/subdomains';

export function CommunityPage() {
  const pillars = [
    {
      icon: GraduationCap,
      title: "Campus Innovation Network",
      desc: "Partnering with colleges, universities, and student developer clubs to nurture top engineering talent and bridge academia with industry-grade software engineering."
    },
    {
      icon: Trophy,
      title: "National Hackathons & Battles",
      desc: "Organizing high-impact hackathons like Promptwars in alliance with Google for Developers, Hack2skill, and KIET Group, awarding major cash prizes and recognition."
    },
    {
      icon: CodeXml,
      title: "Open Source & Product Sprints",
      desc: "Engaging developers in building open-source developer tooling, modern web templates, generative AI prompt pipelines, and real-world utility software."
    },
    {
      icon: Handshake,
      title: "Mentorship & Career Acceleration",
      desc: "1-on-1 engineering guidance, portfolio code reviews, tech talks, and fast-track hiring pipelines for internship and full-time roles at Work Wizards Innovations."
    }
  ];

  const stats = [
    { value: "1,500+", label: "Community Members", desc: "Passionate student hackers & builders" },
    { value: "700+", label: "Hackathon Participants", desc: "Competed in Promptwars X WWI" },
    { value: "₹53,000+", label: "Prizes Awarded", desc: "Direct cash cheques & honours" },
    { value: "20+", label: "Campus Chapters", desc: "Active university clubs & partners" }
  ];

  return (
    <>
      <PageHero
        title="WWI Developer &amp; Innovator Community"
        description="Empowering the next generation of engineers, creators, and technology pioneers through collaborative hackathons, open-source initiatives, and industry mentorship."
      />

      <div className="space-y-24 py-16 px-6 max-w-7xl mx-auto">
        {/* Mission & Stats */}
        <section id="community-stats">
          <Reveal className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-muted-foreground border border-border mb-3">
              <Users className="w-3.5 h-3.5 text-foreground" />
              Ecosystem At Scale
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              A Thriving Community of Builders
            </h2>
            <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Work Wizards Innovations believes true innovation begins when talented individuals unite to solve difficult problems.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, idx) => (
              <Reveal key={idx} delay={idx * 0.05}>
                <div className="p-6 rounded-2xl bg-card border border-border text-center shadow-xs">
                  <div className="text-3xl md:text-4xl font-extrabold text-foreground">
                    {s.value}
                  </div>
                  <div className="text-sm font-semibold text-foreground/90 mt-1">
                    {s.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Pillars Grid */}
        <section id="pillars">
          <Reveal className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-muted-foreground border border-border mb-3">
              <Sparkles className="w-3.5 h-3.5 text-foreground" />
              Our Community Pillars
            </div>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
              What We Do Together
            </h3>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <Reveal key={idx} delay={idx * 0.08}>
                  <div className="h-full p-8 rounded-2xl border border-border bg-card shadow-xs hover:shadow-md transition">
                    <div className="w-12 h-12 rounded-xl bg-secondary border border-border text-foreground grid place-items-center mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-foreground">{p.title}</h4>
                    <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Featured Collaboration Banner */}
        <section id="hackathon-spotlight">
          <Reveal>
            <div className="rounded-3xl border border-border bg-surface p-8 md:p-12 shadow-xs">
              <div className="max-w-3xl">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Flagship Milestone
                </span>
                <h3 className="text-2xl md:text-4xl font-extrabold text-foreground mt-2">
                  Promptwars X Work Wizards Innovations
                </h3>
                <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                  Our premier nationwide hackathon in collaboration with Google for Developers, Hack2skill, and KIET Group brought together 700+ hackers to build breakthrough prompt engineering and generative AI solutions.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href={getSubdomainUrl('events', '/')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition shadow-xs"
                  >
                    Explore Events &amp; Winners <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={getSubdomainUrl('events', '#upcoming')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-secondary border border-border text-foreground text-sm font-semibold hover:bg-secondary/80 transition"
                  >
                    Upcoming Hackathon Alert
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Get Involved / CTA */}
        <section id="join-community">
          <Reveal>
            <div className="rounded-3xl border border-border bg-card p-8 md:p-14 text-center max-w-4xl mx-auto shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-secondary border border-border text-foreground grid place-items-center mx-auto mb-5">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl md:text-4xl font-extrabold text-foreground">
                Join the WWI Community Today
              </h3>
              <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Whether you are a student developer looking for mentorship, a club leader wanting to co-host a hackathon, or an engineer wanting to build open source with us—there is a place for you.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href={`mailto:official@wwi.org.in?subject=Join+WWI+Community`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition shadow-xs"
                >
                  <Mail className="w-4 h-4" /> Connect with Community Team
                </a>
                <a
                  href={getSubdomainUrl('careers', '/')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary border border-border text-foreground font-semibold text-sm hover:bg-secondary/80 transition"
                >
                  View Open Roles &amp; Internships
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
}

export default CommunityPage;
