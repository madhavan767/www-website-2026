import React from 'react';
import { PageHero } from '../components/common/PageHero';

export function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms of Service"
        description="Last updated: January 2026"
      />

      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto text-sm text-muted-foreground space-y-5 leading-relaxed">
          <p>
            By accessing or using the Work Wizards Innovations website and services, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-foreground font-semibold text-lg pt-2">
            Use of Services
          </h2>
          <p>
            You agree to use our services only for lawful purposes and in a manner consistent with all applicable laws and regulations.
          </p>

          <h2 className="text-foreground font-semibold text-lg pt-2">
            Intellectual Property
          </h2>
          <p>
            All content, trademarks, and code on this site are the property of Work Wizards Innovations or its licensors and protected by intellectual property laws.
          </p>

          <h2 className="text-foreground font-semibold text-lg pt-2">
            Disclaimer
          </h2>
          <p>
            Services are provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free operation.
          </p>

          <h2 className="text-foreground font-semibold text-lg pt-2">
            Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, Work Wizards Innovations shall not be liable for any indirect or consequential damages arising from your use of the services.
          </p>

          <h2 className="text-foreground font-semibold text-lg pt-2">
            Contact
          </h2>
          <p>
            For questions about these terms, contact official@wwi.org.in.
          </p>
        </div>
      </section>
    </>
  );
}

export default TermsPage;
