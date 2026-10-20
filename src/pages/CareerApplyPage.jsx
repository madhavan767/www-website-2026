import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { BackButton } from '../components/common/BackButton';
import { Reveal } from '../components/common/Reveal';
import { JobApplicationForm } from '../components/careers/JobApplicationForm';
import { getJobById, subscribeToJobs } from '../services/jobService';

export function CareerApplyPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(() => (jobId ? getJobById(jobId) : null));

  useEffect(() => {
    if (jobId) {
      setJob(getJobById(jobId));
      const unsubscribe = subscribeToJobs(() => {
        setJob(getJobById(jobId));
      });
      return unsubscribe;
    }
  }, [jobId]);

  const roleTitle = job ? job.title : "General Application";
  const backPath = job ? `/careers/${job.id}` : "/careers";
  const backLabel = job ? "Back to role details" : "Back to Careers";

  return (
    <>
      <section className="px-6 pt-28 pb-8 border-b border-border bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <BackButton label="Back" />
          </div>

          <Reveal>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <ShieldCheck className="w-3 h-3" />{" "}
                  {job ? "Full-page application" : "General application"}
                </div>
                <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
                  {job ? `Apply for ${job.title}` : "Apply for the role you want"}
                </h1>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {job
                    ? "Complete the full application form below. The form is laid out to keep every input visible and comfortable on desktop and mobile."
                    : "Use this full-page form to apply even when you do not see an exact opening. Tell us what kind of role you want and we will route it to the right team."}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="w-4 h-4" /> Application flow
                </div>
                <div className="mt-4 grid gap-3 text-sm">
                  <div className="flex items-center gap-2 rounded-xl bg-background border border-border px-3 py-2">
                    <CheckCircle2 className="w-4 h-4 text-foreground shrink-0" />
                    <span>Personal details</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-background border border-border px-3 py-2">
                    <CheckCircle2 className="w-4 h-4 text-foreground shrink-0" />
                    <span>Education and experience</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-background border border-border px-3 py-2">
                    <CheckCircle2 className="w-4 h-4 text-foreground shrink-0" />
                    <span>Resume and review</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-12 bg-surface">
        <div className="max-w-7xl mx-auto">
          <JobApplicationForm
            role={roleTitle}
            jobId={jobId}
            onSuccess={() => navigate(backPath)}
          />
        </div>
      </section>
    </>
  );
}

export default CareerApplyPage;
