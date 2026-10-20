import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  Briefcase,
  Clock,
  Heart,
  Lightbulb,
  MapPin,
  Sparkles,
  Users,
  FileText,
  Send,
  Calendar,
  Coins
} from 'lucide-react';
import { BackButton } from '../components/common/BackButton';
import { Reveal } from '../components/common/Reveal';
import { getJobs, subscribeToJobs } from '../services/jobService';

export function CareersPage() {
  const [openPositions, setOpenPositions] = useState(() => getJobs({ includeHidden: false }));

  useEffect(() => {
    setOpenPositions(getJobs({ includeHidden: false }));
    const unsubscribe = subscribeToJobs((updated) => {
      setOpenPositions(updated.filter((j) => !j.hidden));
    });
    return unsubscribe;
  }, []);

  const values = [
    [
      "Fueled by Curiosity",
      "We encourage experimentation and creative problem-solving. Every idea matters, every voice is heard."
    ],
    [
      "Move Fast, Build Smart",
      "We ship with speed and precision, iterating quickly while maintaining high quality standards."
    ],
    [
      "People First",
      "Flexible work, open culture, and genuine care for every team member's growth and wellbeing."
    ],
    [
      "Grow Together",
      "Mentorship, learning budgets, and real ownership. Your career accelerates here."
    ]
  ];

  const perks = [
    { icon: MapPin, label: "Remote First" },
    { icon: Clock, label: "Flexible Hours" },
    { icon: Lightbulb, label: "Learning Budget" },
    { icon: Heart, label: "Team Events" }
  ];

  const teamImages = [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-28 pb-12 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <BackButton />
          </div>

          <div className="grid gap-10 md:grid-cols-2 items-start">
            <Reveal>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Join the company<br />with the bold<br />
                <span className="text-muted-foreground">new vision.</span>
              </h1>
              <a
                href="#positions"
                className="mt-8 inline-flex items-center gap-2 bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
              >
                Job openings <ArrowDown className="w-4 h-4" />
              </a>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="text-muted-foreground leading-relaxed">
                At Work Wizards Innovations, we're shaping the future of digital solutions. Join us to build cutting-edge web and mobile platforms, work with emerging technologies, and solve real-world problems — all while growing your career in a collaborative, remote-first environment.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-14">
            {teamImages.map((src, idx) => (
              <Reveal key={src} delay={idx * 0.05}>
                <img
                  loading="lazy"
                  src={src}
                  alt="Team collaborating"
                  className="rounded-2xl aspect-[4/3] w-full object-cover"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <span className="inline-flex text-xs uppercase tracking-[0.18em] text-muted-foreground border border-border rounded-full px-3 py-1">
              Careers
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold">
              Grounded and ground-breaking.
            </h2>
            <p className="mt-3 text-muted-foreground">
              We're changing the paradigm every day, with curiosity, vision and deep expertise.
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2">
            {values.map(([title, desc], idx) => (
              <Reveal key={title} delay={idx * 0.05}>
                <div className="p-7 rounded-2xl bg-card border border-border h-full">
                  <div className="text-xs text-muted-foreground">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-2 font-semibold text-lg">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Work at WWI Perks */}
      <section className="px-6 py-20 bg-surface">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Why Work at WWI?</h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {perks.map((perk, idx) => (
              <Reveal key={perk.label} delay={idx * 0.05}>
                <div className="p-6 rounded-2xl bg-background border border-border text-center">
                  <div className="w-10 h-10 grid place-items-center rounded-lg bg-secondary mx-auto">
                    <perk.icon className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="mt-3 text-sm font-semibold">{perk.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Positions Section */}
      <section id="positions" className="px-6 py-20 scroll-mt-12">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Open Positions</h2>
            <p className="mt-3 text-muted-foreground">
              Find your next role and start building the future with us
            </p>
          </Reveal>

          {openPositions.length === 0 ? (
            <Reveal>
              <div
                className="mx-auto max-w-2xl rounded-2xl p-10 text-center"
                style={{ background: "#F8F8F8" }}
              >
                <Sparkles className="w-6 h-6 mx-auto text-foreground/70" />
                <h3 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight">
                  Currently We Are Not Hiring
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Stay updated for future opportunities — we'll let you know when new roles open up.
                </p>
                <a
                  href="mailto:careers@wwi.org.in?subject=Subscribe%20to%20WWI%20Careers%20Updates"
                  className="mt-6 inline-flex items-center gap-2 bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
                >
                  Subscribe <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </Reveal>
          ) : (
            <>
              <div className="space-y-3">
                {openPositions.map((job, idx) => (
                  <Reveal key={job.id} delay={idx * 0.04}>
                    <div className="flex flex-wrap gap-4 items-center p-6 rounded-2xl bg-card border border-border hover:border-foreground/40 transition-colors">
                      <div className="flex-1 min-w-[260px]">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        {(job.tagline || job.shortDescription) && (
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {job.tagline || job.shortDescription}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                          {job.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {job.location}
                            </span>
                          )}
                          {job.employmentType && (
                            <span className="inline-flex items-center gap-1">
                              <Briefcase className="w-3 h-3" /> {job.employmentType}
                            </span>
                          )}
                          {job.experience && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {job.experience}
                            </span>
                          )}
                          {job.salary && (
                            <span className="inline-flex items-center gap-1 text-foreground/80 font-medium">
                              <Coins className="w-3 h-3" /> {job.salary}
                            </span>
                          )}
                          {job.deadline && (
                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                              <Calendar className="w-3 h-3" /> {job.deadline}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/careers/${job.id}`}
                          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary transition"
                        >
                          View Details <FileText className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/careers/${job.id}/apply`}
                          className="inline-flex items-center gap-2 bg-foreground text-background rounded-full px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                        >
                          Apply Now <Send className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* General Application Banner */}
              <Reveal>
                <div className="mt-10 rounded-3xl bg-foreground text-background p-10 text-center">
                  <Sparkles className="w-5 h-5 mx-auto" />
                  <h3 className="mt-3 text-2xl font-bold">Don't see your role?</h3>
                  <p className="mt-2 text-sm text-background/70 max-w-xl mx-auto">
                    We're always looking for talented people. Send us a general application and we'll reach out when a matching role opens up.
                  </p>
                  <Link
                    to="/careers/apply"
                    className="mt-6 inline-flex items-center gap-2 bg-background text-foreground rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
                  >
                    <Users className="w-4 h-4" /> Open General Application <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Reveal>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default CareersPage;
