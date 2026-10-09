import React from 'react';
import { BUSINESS_INFO } from '../config/solutionsData';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-950">Privacy Policy</h1>
      <p className="text-xs text-neutral-500">Last updated: October 2026</p>

      <div className="prose prose-sm max-w-none text-xs text-neutral-600 space-y-4 leading-relaxed">
        <h2 className="text-sm font-bold text-neutral-900">1. Information Collection</h2>
        <p>
          {BUSINESS_INFO.companyName} collects customer and business contact information submitted through our website configurators, project intake forms, and inquiries. This data is used solely to evaluate technical requirements, prepare implementation proposals, and communicate regarding project deliverables.
        </p>

        <h2 className="text-sm font-bold text-neutral-900">2. Client Data Sovereignty</h2>
        <p>
          Unlike closed SaaS vendors, we deploy dedicated application instances and database schemas for each client. We do not sell, rent, or aggregate client business data for advertising or third-party monetization.
        </p>

        <h2 className="text-sm font-bold text-neutral-900">3. Security Standards</h2>
        <p>
          We employ industry-standard TLS encryption, credential hashing, and access controls for all hosted systems and administrative dashboards.
        </p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-950">Terms of Implementation</h1>
      <p className="text-xs text-neutral-500">Last updated: October 2026</p>

      <div className="prose prose-sm max-w-none text-xs text-neutral-600 space-y-4 leading-relaxed">
        <h2 className="text-sm font-bold text-neutral-900">1. Nature of the Engagement</h2>
        <p>
          {BUSINESS_INFO.companyName} provides configurable business software implementation services. Website visitors purchase tailored, deployed software solutions configured for their business requirements.
        </p>

        <h2 className="text-sm font-bold text-neutral-900">2. Milestone-Based Payments</h2>
        <p>
          Unless otherwise stated in an official written proposal, implementations require a 30% initial kickoff deposit, 40% upon staging demonstration approval, and 30% upon production deployment and domain cutover.
        </p>

        <h2 className="text-sm font-bold text-neutral-900">3. Technical Warranty & SLA</h2>
        <p>
          All implementations include a minimum 30-day technical warranty against software defects. Ongoing maintenance, security updates, and SLA support are governed by our optional monthly support packages.
        </p>
      </div>
    </div>
  );
};
