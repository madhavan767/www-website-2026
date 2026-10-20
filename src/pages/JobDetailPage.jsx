import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  Clock,
  BadgeCheck,
  Coins,
  Send,
  Briefcase,
  Calendar,
  FileCheck
} from 'lucide-react';
import { Reveal } from '../components/common/Reveal';
import { BackButton } from '../components/common/BackButton';
import { getJobById, subscribeToJobs } from '../services/jobService';

export function JobDetailPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(() => getJobById(jobId));
  const [isResolving, setIsResolving] = useState(() => !getJobById(jobId));

  useEffect(() => {
    const found = getJobById(jobId);
    setJob(found);
    if (!found) {
      const timer = setTimeout(() => {
        setIsResolving(false);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setIsResolving(false);
    }
  }, [jobId]);

  useEffect(() => {
    const unsubscribe = subscribeToJobs(() => {
      const updated = getJobById(jobId);
      setJob(updated);
      if (updated) setIsResolving(false);
    });
    return unsubscribe;
  }, [jobId]);

  if (isResolving && !job) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-6 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-10 h-10 rounded-full border-2 border-foreground border-t-transparent animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Loading position details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">Role Not Found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The job opening you are looking for is no longer active.
          </p>
          <Link
            to="/careers"
            className="mt-6 inline-flex items-center gap-2 bg-foreground text-background rounded-full px-5 py-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Careers
          </Link>
        </div>
      </div>
    );
  }

  const salaryDisplay = [job.salaryRange, job.salary].filter(Boolean).join(" • ");
  const typeDisplay = [job.type, job.employmentType].filter(Boolean).join(" • ");

  const metrics = [
    { label: "Location", value: job.location || (job.remote ? "Remote" : "Not specified"), icon: MapPin },
    { label: "Type", value: typeDisplay || "Not specified", icon: BadgeCheck },
    { label: "Experience", value: job.experience || "Not specified", icon: Clock },
    { label: "Salary", value: salaryDisplay || "Not specified", icon: Coins }
  ];

  return (
    <>
      <section className="px-6 pt-28 pb-12 border-b border-border bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <BackButton label="Back" />
          </div>

          <Reveal>
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <Sparkles className="w-3 h-3" /> Open Role
              </div>
              <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight">
                {job.title}
              </h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                {job.tagline || job.shortDescription || job.roleSummary || "Detailed job information for this role."}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[1.3fr_0.9fr] items-start">
          {/* Main Info */}
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-2xl border border-border bg-card p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                    <m.icon className="w-3.5 h-3.5" /> {m.label}
                  </div>
                  <div className="mt-3 text-sm font-semibold">{m.value}</div>
                </div>
              ))}
            </div>

            {(job.roleSummary || job.description) && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                <h2 className="text-xl font-bold text-foreground">Role Summary</h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {job.roleSummary || job.description}
                </p>
              </div>
            )}

            {job.qualifications && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-foreground" /> Qualifications &amp; Notes
                </h2>
                <div className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {job.qualifications}
                </div>
              </div>
            )}

            {job.skills && !job.qualifications && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                <h2 className="text-xl font-bold text-foreground">Required Skills</h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {job.skills}
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-foreground" /> Application Information
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground list-disc pl-5">
                <li><strong className="text-foreground">Application Deadline:</strong> {job.deadline || "Open / Rolling Basis"}</li>
                <li>Submit your 3-stage application online with your resume link (Cloudflare R2, Google Drive, or public PDF).</li>
                <li>Our talent team reviews candidates promptly and will reach out for initial rounds.</li>
              </ul>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Quick Apply
              </div>
              <h2 className="mt-2 text-2xl font-bold">Apply to this role</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                The application opens as a full page so you can complete the form without losing your place.
              </p>
              <Link
                to={`/careers/${job.id}/apply`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background hover:opacity-90 transition"
              >
                Apply Now <Send className="w-4 h-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Briefcase className="w-4 h-4" /> Role Snapshot
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-2">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">
                    Department
                  </span>
                  <span className="text-sm font-medium text-right">
                    {job.department || "Engineering"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-2">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">
                    Remote
                  </span>
                  <span className="text-sm font-medium text-right">
                    {job.remote ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">
                    Skills
                  </span>
                  <span className="text-sm font-medium text-right truncate max-w-[180px]">
                    {job.skills || "Not specified"}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export default JobDetailPage;
