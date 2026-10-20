import React, { useState, useEffect } from 'react';
import {
  FileText,
  SquarePen,
  Download,
  Sparkles,
  Clock,
  BookOpen,
  Brain,
  Layers,
  Timer,
  Bell,
  Sparkle
} from 'lucide-react';
import { PageHero } from '../components/common/PageHero';
import { Reveal } from '../components/common/Reveal';
import { useToast } from '../components/common/Toast';
import { addWaitlistSubscriber } from '../services/waitlistService';
import { X, CheckCircle2 } from 'lucide-react';

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const diff = Math.max(0, targetDate.getTime() - Date.now());
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export function ProductsPage() {
  const toast = useToast();
  // 60 days countdown target from now
  const [targetDate] = useState(() => new Date(Date.now() + 60 * 24 * 60 * 60 * 1000));
  const countdown = useCountdown(targetDate);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [productEmail, setProductEmail] = useState('');
  const [productNotified, setProductNotified] = useState(false);

  const handleProductNotify = (e) => {
    e.preventDefault();
    if (!productEmail || !productEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    addWaitlistSubscriber(productEmail, 'Viadocs & KNOWRA Launch');
    setProductNotified(true);
    toast.success("You've been added to the launch waitlist!");
    setTimeout(() => {
      setNotifyModalOpen(false);
      setProductNotified(false);
      setProductEmail('');
    }, 2200);
  };

  const viadocsFeatures = [
    [FileText, "Edit, Convert & Compress PDFs"],
    [SquarePen, "Secure Digital Signatures"],
    [Download, "Merge & Split Documents"],
    [Sparkles, "AI-Powered Document Creation"]
  ];

  const knowraFeatures = [
    [BookOpen, "Smart Learning Tools", "Personalized study plans and progress tracking"],
    [Brain, "AI-Powered Insights", "Intelligent recommendations based on learning patterns"],
    [Layers, "Comprehensive Resources", "Curated educational content for all subjects"],
    [Timer, "Time Management", "Built-in study timers and productivity tools"]
  ];

  const productPhilosophy = [
    ["01", "User-Centric", "Every feature is designed with users in mind"],
    ["02", "Innovation First", "We leverage the latest technology to solve problems"],
    ["03", "Continuous Growth", "Regular updates and improvements based on feedback"]
  ];

  return (
    <>
      <PageHero
        title="Our Products"
        description="We design and develop our own innovative digital platforms that solve real-world problems. Each product is built with cutting-edge technology and user-centric design."
      />

      {/* Viadocs Product Section (Dark Theme) */}
      <section className="px-6 py-20 bg-foreground text-background">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-300 text-xs px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Now Live
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold">Viadocs</h2>
            <p className="mt-3 text-background/70">
              The all-in-one PDF platform with AI-powered document creation
            </p>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2 items-start">
            <Reveal>
              <p className="text-background/70 leading-relaxed">
                Viadocs is our debut product—a comprehensive PDF management platform designed for students, professionals, and businesses who need powerful document tools at their fingertips.
              </p>
              <ul className="mt-6 space-y-3">
                {viadocsFeatures.map(([Icon, label], idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background/5 border border-background/10"
                  >
                    <div className="w-9 h-9 grid place-items-center rounded-lg bg-background/10 shrink-0">
                      <Icon className="w-4 h-4 text-background" />
                    </div>
                    <span className="text-sm">{label}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://viadocs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-background text-foreground rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
              >
                Try Viadocs Now
              </a>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="p-10 rounded-2xl bg-background/5 border border-background/10">
                <div className="aspect-video rounded-xl bg-background/10 grid place-items-center">
                  <FileText className="w-16 h-16 text-background/40" />
                </div>
                <h4 className="mt-5 font-semibold">All-in-One PDF Solution</h4>
                <p className="mt-1 text-sm text-background/60">
                  Edit, convert, compress, and create PDFs with AI assistance. Everything you need in one powerful platform.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* KNOWRA Product Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-secondary text-foreground text-xs px-3 py-1 rounded-full">
              <Clock className="w-3 h-3" /> Coming Soon
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold">KNOWRA</h2>
            <p className="mt-3 text-muted-foreground">
              A revolutionary student-centric platform designed to enhance learning and productivity
            </p>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            <Reveal>
              <h4 className="font-semibold">Empowering Students</h4>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                KNOWRA is our next big innovation—a comprehensive platform built specifically for students. It combines smart learning tools, AI-powered insights, and productivity features to help students achieve their academic goals.
              </p>
              <div className="mt-5 space-y-3">
                {knowraFeatures.map(([Icon, title, desc], idx) => (
                  <div key={idx} className="flex gap-3 p-4 rounded-xl bg-card border border-border">
                    <div className="w-9 h-9 grid place-items-center rounded-lg bg-foreground text-background shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{title}</div>
                      <div className="text-xs text-muted-foreground">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="p-7 rounded-2xl bg-foreground text-background">
                <div className="text-center font-semibold">Launching In</div>
                <div className="mt-5 grid grid-cols-4 gap-3 text-center">
                  {[
                    ["Days", countdown.d],
                    ["Hours", countdown.h],
                    ["Minutes", countdown.m],
                    ["Seconds", countdown.s]
                  ].map(([label, val]) => (
                    <div key={label} className="p-3 rounded-xl bg-background/10">
                      <div className="text-2xl font-bold tabular-nums">
                        {String(val).padStart(2, "0")}
                      </div>
                      <div className="text-[10px] text-background/60 uppercase tracking-wider mt-1">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setNotifyModalOpen(true)}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-background text-foreground rounded-full py-2.5 text-sm font-medium hover:opacity-90 transition cursor-pointer"
                >
                  <Bell className="w-4 h-4" /> Get Notified at Launch
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Product Philosophy */}
      <section className="px-6 py-20 bg-surface">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Product Philosophy</h2>
            <p className="mt-3 text-muted-foreground">
              We don't just build products—we create solutions that make a real difference.
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-3">
            {productPhilosophy.map(([num, title, desc]) => (
              <Reveal key={num}>
                <div className="p-7 rounded-2xl bg-background border border-border text-center h-full">
                  <div className="text-3xl font-bold">{num}</div>
                  <h3 className="mt-3 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stay Updated Banner */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto rounded-3xl bg-foreground text-background p-12 text-center">
          <Sparkle className="w-6 h-6 mx-auto text-background" />
          <h2 className="mt-4 text-3xl md:text-4xl font-bold">Stay Updated on Our Products</h2>
          <p className="mt-3 text-background/70">
            Be the first to know about new features, product launches, and exclusive updates
          </p>
          <button
            type="button"
            onClick={() => setNotifyModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 bg-background text-foreground rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-90 transition cursor-pointer"
          >
            Subscribe for Updates
          </button>
        </div>
      </section>

      {/* Product Launch Waitlist Modal */}
      {notifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setNotifyModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-secondary border border-border grid place-items-center mb-4">
              <Bell className="w-6 h-6 text-foreground" />
            </div>

            <h3 className="text-2xl font-bold text-foreground">Get Notified at Launch</h3>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Join our exclusive waitlist for Viadocs, KNOWRA, and upcoming WWI products.
            </p>

            {productNotified ? (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center gap-2.5 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                You're on the waitlist! We'll notify you as soon as early access unlocks.
              </div>
            ) : (
              <form onSubmit={handleProductNotify} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={productEmail}
                    onChange={(e) => setProductEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition cursor-pointer shadow-xs"
                >
                  Join Launch Waitlist
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ProductsPage;
