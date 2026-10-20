import React from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * BackButton
 * Navigates back in browser history. Falls back to canonical home if opened directly in a new tab.
 */
export function BackButton({ label = "Back", className = "" }) {
  const handleBack = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      // Safe fallback if opened in a fresh tab with no prior history
      window.location.href = "https://wwi.org.in";
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none group ${className}`}
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
      <span>{label}</span>
    </button>
  );
}

export default BackButton;
