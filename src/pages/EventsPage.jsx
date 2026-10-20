import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Sparkles, 
  Play, 
  ExternalLink, 
  Handshake, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  Maximize2,
  X,
  Bell,
  Mail,
  ChevronLeft,
  ChevronRight,
  Pause
} from 'lucide-react';
import { PageHero } from '../components/common/PageHero';
import { Reveal } from '../components/common/Reveal';
import { addWaitlistSubscriber } from '../services/waitlistService';
import { 
  collaboratorsData, 
  upcomingEvent, 
  promptwarsEvent,
  eventCarouselItems
} from '../data/eventsData';

export function EventsPage() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  // Carousel state: swipeable gallery with 2-second auto-scroll
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const isMouseDown = useRef(false);
  const mouseStartX = useRef(null);
  const resumeTimer = useRef(null);

  // Auto-scroll every 2 seconds when not interacting
  useEffect(() => {
    if (isInteracting) return;

    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % eventCarouselItems.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isInteracting]);

  const handleTouchStart = (e) => {
    setIsInteracting(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 40) {
        setSliderIndex((prev) => (prev + 1) % eventCarouselItems.length);
      } else if (diff < -40) {
        setSliderIndex((prev) => (prev - 1 + eventCarouselItems.length) % eventCarouselItems.length);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    resumeTimer.current = setTimeout(() => {
      setIsInteracting(false);
    }, 2000);
  };

  const handleMouseDown = (e) => {
    setIsInteracting(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    isMouseDown.current = true;
    mouseStartX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    if (isMouseDown.current && mouseStartX.current !== null) {
      const diff = mouseStartX.current - e.clientX;
      if (diff > 40) {
        setSliderIndex((prev) => (prev + 1) % eventCarouselItems.length);
      } else if (diff < -40) {
        setSliderIndex((prev) => (prev - 1 + eventCarouselItems.length) % eventCarouselItems.length);
      }
    }
    isMouseDown.current = false;
    mouseStartX.current = null;
    resumeTimer.current = setTimeout(() => {
      setIsInteracting(false);
    }, 2000);
  };

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!notifyEmail || !notifyEmail.includes('@')) return;

    try {
      addWaitlistSubscriber(notifyEmail, 'Promptwars Hackathon');
      const existing = JSON.parse(localStorage.getItem('wwi_hackathon_notify_emails') || '[]');
      if (!existing.some(item => item.email === notifyEmail)) {
        existing.push({ email: notifyEmail, date: new Date().toISOString() });
        localStorage.setItem('wwi_hackathon_notify_emails', JSON.stringify(existing));
      }
    } catch {
      // Local storage fallback
    }

    setNotifySuccess(true);
    setTimeout(() => {
      setNotifyModalOpen(false);
      setNotifySuccess(false);
      setNotifyEmail('');
    }, 2800);
  };

  const openYouTubeVideo = () => {
    window.open(promptwarsEvent.youtube.videoUrl, '_blank', 'noopener,noreferrer');
  };

  const activeSlide = eventCarouselItems[sliderIndex];

  return (
    <>
      <PageHero
        title="Events &amp; Hackathons"
        description="Fostering the next generation of engineers, creators, and builders through high-impact hackathons, cutting-edge competitions, and premier tech collaborations."
      />

      <div className="space-y-24 py-16 px-6 max-w-7xl mx-auto">
        {/* ======================================================== */}
        {/* 1. UPCOMING HACKATHON: COMING SOON BANNER */}
        {/* ======================================================== */}
        <section id="upcoming">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 text-white p-8 md:p-12 shadow-xl">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-black tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    {upcomingEvent.badge}
                  </span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 border border-zinc-800 px-3 py-1 rounded-full bg-zinc-900">
                    {upcomingEvent.edition}
                  </span>
                </div>

                <div className="max-w-3xl">
                  <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                    {upcomingEvent.title}
                  </h2>
                  <p className="mt-4 text-base md:text-lg text-zinc-300 leading-relaxed">
                    {upcomingEvent.description}
                  </p>
                </div>

                {/* Highlights Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  {upcomingEvent.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-zinc-800 text-white grid place-items-center mb-3 border border-zinc-700">
                        {item.icon === 'Handshake' && <Handshake className="w-4 h-4" />}
                        {item.icon === 'Trophy' && <Trophy className="w-4 h-4" />}
                        {item.icon === 'Cpu' && <Cpu className="w-4 h-4" />}
                        {item.icon === 'Sparkles' && <Sparkles className="w-4 h-4" />}
                      </div>
                      <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Notify Me Bar */}
                <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-zinc-400" />
                      Get Early Updates &amp; Registration Alerts
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Join the priority notification list to receive problem statements, schedules, and perks.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setNotifyModalOpen(true)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition text-sm cursor-pointer shadow-sm"
                    >
                      <Bell className="w-4 h-4" />
                      Notify Me
                    </button>
                    <Link
                      to="/contact?subject=Hackathon+Partnership"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white transition text-sm"
                    >
                      Partner with Us <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ======================================================== */}
        {/* 2. PARTNERS */}
        {/* ======================================================== */}
        <section id="partners" className="scroll-mt-24">
          <div id="collaborators" />
          <Reveal className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Partners</h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {collaboratorsData.map((partner, idx) => (
              <Reveal key={partner.name} delay={idx * 0.05}>
                <div className="group block rounded-2xl border border-border overflow-hidden bg-card hover:shadow-lg transition-all duration-300">
                  {/* Partner Logo Box */}
                  <div className="h-36 md:h-44 bg-white flex items-center justify-center p-6 border-b border-border/80">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="max-h-20 md:max-h-24 w-auto max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Partner Name Under Logo */}
                  <div className="p-5 text-center">
                    <h3 className="text-base md:text-lg font-bold text-foreground">
                      {partner.name}
                    </h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. FIRST MILESTONE: PROMPTWARS X WWI */}
        {/* ======================================================== */}
        <section id="completed-event" className="scroll-mt-24">
          <Reveal className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-foreground border border-border mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {promptwarsEvent.milestoneTitle}
            </span>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
              {promptwarsEvent.milestoneBadge}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {promptwarsEvent.title}
            </h2>
            <p className="mt-3 text-muted-foreground max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
              {promptwarsEvent.description}
            </p>
          </Reveal>

          {/* Event Official Banner */}
          <Reveal className="mb-12">
            <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-lg group">
              <img
                src={promptwarsEvent.banner}
                alt="Promptwars X Work Wizards Innovations Official Banner"
                className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 md:p-10">
                <div className="text-white">
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-wider">
                    First Milestone Event
                  </span>
                  <div className="text-xl md:text-3xl font-extrabold mt-2">
                    Promptwars X Work Wizards Innovations
                  </div>
                  <div className="text-xs md:text-sm text-zinc-300 mt-1">
                    Organized in collaboration with Hack2skill, Google for Developers &amp; KIET Group of Institutions
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {promptwarsEvent.stats.map((stat, idx) => (
              <Reveal key={idx} delay={idx * 0.05}>
                <div className="p-6 rounded-2xl bg-card border border-border text-center shadow-xs">
                  <div className="text-3xl md:text-4xl font-extrabold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-foreground/90 mt-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* ======================================================== */}
          {/* WATCH FULL EVENT ON YOUTUBE BUTTON */}
          {/* ======================================================== */}
          <div className="flex justify-center mb-16">
            <Reveal>
              <button
                type="button"
                onClick={openYouTubeVideo}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-foreground text-background hover:opacity-90 font-semibold text-sm transition shadow-sm cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Full Event in YT
                <ExternalLink className="w-4 h-4" />
              </button>
            </Reveal>
          </div>

          {/* ======================================================== */}
          {/* 4. PRIZE WINNERS: 1ST, 2ND, 3RD PRIZE (CROPPED & FRAMED) */}
          {/* ======================================================== */}
          <div className="mb-20">
            <Reveal className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-muted-foreground border border-border mb-3">
                <Trophy className="w-3.5 h-3.5 text-foreground" />
                ₹53,000 Prize Pool Breakdown
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                Podium Winners &amp; Honors
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Celebrating the standout innovators who built high-impact solutions during Promptwars.
              </p>
            </Reveal>

            {/* 1st, 2nd, 3rd Prize Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {promptwarsEvent.podiumPrizes.map((prize, idx) => (
                <Reveal key={prize.rank} delay={idx * 0.1}>
                  <div className="h-full flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-md transition-all group">
                    {/* Cropped People-View Photo Box */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 border-b border-border">
                      <img
                        loading="lazy"
                        src={prize.image}
                        alt={`${prize.rank} - ${prize.title}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Rank Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-md border border-border text-xs font-bold shadow-xs">
                          {prize.badge}
                        </span>
                      </div>

                      {/* Prize Amount Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="px-3 py-1 rounded-full bg-foreground text-background text-xs font-extrabold shadow-sm">
                          {prize.amount}
                        </span>
                      </div>

                      {/* Enlarge button */}
                      <button
                        type="button"
                        onClick={() => setSelectedPhoto({ src: prize.image, title: `${prize.rank} — ${prize.title}` })}
                        aria-label="Enlarge winner photo"
                        className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                          {prize.rank}
                        </div>
                        <h4 className="text-xl font-bold text-foreground mt-1">{prize.title}</h4>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                          {prize.desc}
                        </p>
                      </div>
                      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">Prize Cheque</span>
                        <span className="text-foreground font-mono text-base">{prize.amount}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* 5. UNIFIED EVENT CAROUSEL (TOP PERFORMERS + ACTION SHOTS) */}
          {/* ======================================================== */}
          <div>
            <Reveal className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-muted-foreground border border-border mb-3">
                <Sparkles className="w-3.5 h-3.5 text-foreground" />
                Live Gallery &amp; Top Performers
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                Hackathon Atmosphere &amp; Honors
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
                Swipe or drag to browse. Auto-scrolls every 2 seconds when idle.
              </p>
            </Reveal>

            {/* Contained Carousel (Width restricted to max-w-4xl for elegant proportion) */}
            <div 
              className="max-w-4xl mx-auto rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm select-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              {/* Carousel Image Container with Swipe / Drag */}
              <div
                className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center cursor-grab active:cursor-grabbing shadow-inner group"
                onClick={() => setSelectedPhoto(activeSlide)}
              >
                {/* Ambient Blurred Background */}
                <img
                  src={activeSlide.src}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 pointer-events-none"
                />

                {/* Main Slide Photo (Contained to ensure full view) */}
                <img
                  src={activeSlide.src}
                  alt={activeSlide.title}
                  draggable={false}
                  className="relative z-10 w-full h-full object-contain p-2 transition-transform duration-300 pointer-events-none group-hover:scale-[1.02]"
                />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full bg-black/80 text-white text-xs font-semibold backdrop-blur-md border border-white/20">
                    {activeSlide.tag}
                  </span>
                </div>

                {/* Floating Navigation Arrows on Image */}
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSliderIndex((prev) => (prev - 1 + eventCarouselItems.length) % eventCarouselItems.length);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white grid place-items-center backdrop-blur-sm border border-white/10 opacity-70 hover:opacity-100 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSliderIndex((prev) => (prev + 1) % eventCarouselItems.length);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white grid place-items-center backdrop-blur-sm border border-white/10 opacity-70 hover:opacity-100 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Enlarge Hint */}
                <div className="absolute bottom-4 right-4 z-20 w-8 h-8 rounded-full bg-black/80 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Description Below the Image (Clean, without play button) */}
              <div className="mt-4 p-4 rounded-xl bg-secondary/50 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-foreground text-background">
                      {activeSlide.tag}
                    </span>
                    <h4 className="text-base font-bold text-foreground">{activeSlide.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {activeSlide.desc}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-muted-foreground px-2 py-1 rounded-md bg-background border border-border">
                    {sliderIndex + 1} / {eventCarouselItems.length}
                  </span>
                </div>
              </div>

              {/* Carousel Navigation Strip & Controls */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => setSliderIndex((prev) => (prev - 1 + eventCarouselItems.length) % eventCarouselItems.length)}
                  className="w-9 h-9 rounded-full bg-card border border-border hover:bg-secondary text-foreground grid place-items-center shrink-0 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Thumbnails strip */}
                <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 py-1">
                  {eventCarouselItems.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSliderIndex(idx)}
                      className={`relative shrink-0 h-12 w-16 rounded-md overflow-hidden border transition-all ${
                        idx === sliderIndex
                          ? 'border-foreground ring-2 ring-foreground/20 scale-105 opacity-100'
                          : 'border-border opacity-40 hover:opacity-80'
                      }`}
                    >
                      <img src={item.src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => setSliderIndex((prev) => (prev + 1) % eventCarouselItems.length)}
                  className="w-9 h-9 rounded-full bg-card border border-border hover:bg-secondary text-foreground grid place-items-center shrink-0 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 6. CO-HOST AN EVENT / CTA BANNER */}
        {/* ======================================================== */}
        <section id="host-cta">
          <Reveal>
            <div className="rounded-3xl border border-border bg-surface p-8 md:p-14 text-center max-w-4xl mx-auto shadow-xs">
              <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Partner With Us
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-foreground">
                Want to Host a Hackathon or Partner With WWI?
              </h2>
              <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We collaborate with colleges, developer ecosystems, and enterprises to design, manage, and promote premier hackathons, tech bootcamps, and developer challenges.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition text-sm"
                >
                  Get in Touch to Collaborate <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-medium transition text-sm"
                >
                  Learn More About WWI
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </div>

      {/* ======================================================== */}
      {/* NOTIFY ME MODAL (CLASSIC LIGHT MINIMAL THEME) */}
      {/* ======================================================== */}
      {notifyModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setNotifyModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-border bg-background p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setNotifyModalOpen(false)}
              aria-label="Close notification modal"
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-secondary border border-border text-foreground grid place-items-center mb-4">
              <Bell className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-bold text-foreground">Get Notified</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Enter your email address to receive confirmed dates, registration links, and problem statements for our upcoming flagship hackathon.
            </p>

            {notifySuccess ? (
              <div className="mt-6 p-4 rounded-xl bg-secondary border border-border text-center">
                <CheckCircle2 className="w-8 h-8 text-foreground mx-auto mb-2" />
                <h4 className="font-bold text-foreground text-sm">You are on the priority list!</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  We'll email you the moment registrations and confirmed details go live.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="notify-email-input" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="notify-email-input"
                      type="email"
                      required
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-foreground text-background font-semibold hover:opacity-90 transition text-sm cursor-pointer shadow-xs"
                >
                  Send Me Hackathon Updates
                </button>

                <p className="text-[11px] text-muted-foreground text-center">
                  Zero spam. Only official hackathon announcements and registration links.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LIGHTBOX MODAL FOR IMAGES */}
      {/* ======================================================== */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close photo preview"
              className="absolute -top-12 right-0 text-white/80 hover:text-white transition p-1"
            >
              <X className="w-7 h-7" />
            </button>
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.title || 'Event photo'}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain border border-white/10 shadow-2xl"
            />
            {selectedPhoto.title && (
              <div className="mt-3 text-center text-white text-sm font-medium">
                {selectedPhoto.title}
                {selectedPhoto.desc && (
                  <span className="block text-xs text-white/70 mt-0.5">
                    {selectedPhoto.desc}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default EventsPage;
