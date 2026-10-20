import React from 'react';
import { AlertCircle, ArrowRight, Home } from 'lucide-react';
import { CANONICAL_ORIGIN } from '../utils/subdomains';

export function UnknownSubdomainPage() {
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'wwi.org.in';

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md mx-auto p-8 rounded-3xl border border-border bg-card shadow-lg">
        <div className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 grid place-items-center mx-auto mb-5">
          <AlertCircle className="w-7 h-7" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Hostname Not Found
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-2">
          Unrecognized Subdomain
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          The requested hostname <code className="font-mono text-foreground font-semibold px-1.5 py-0.5 rounded bg-secondary border border-border">{currentHost}</code> is not an active WWI subdomain or service endpoint.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={CANONICAL_ORIGIN}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition shadow-xs"
          >
            <Home className="w-4 h-4" /> Go to Main Website
          </a>
          <a
            href={`${CANONICAL_ORIGIN}/contact`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-secondary border border-border text-foreground font-semibold text-sm hover:bg-secondary/80 transition"
          >
            Contact Support <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default UnknownSubdomainPage;
