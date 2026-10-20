import React from 'react';
import { BackButton } from './BackButton';
import { Reveal } from './Reveal';

export function PageHero({ title, description, kicker, backLabel = "Back" }) {
  return (
    <section className="pt-24 md:pt-28 pb-8 md:pb-12 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-5 md:mb-8">
          <BackButton label={backLabel} />
        </div>
        <Reveal>
          {kicker && (
            <div className="inline-flex items-center text-[10px] md:text-xs uppercase tracking-[0.18em] text-muted-foreground border border-border rounded-full px-2.5 py-0.5 md:px-3 md:py-1 mb-3 md:mb-4">
              {kicker}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-3 md:mt-4 max-w-2xl text-sm md:text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export default PageHero;
