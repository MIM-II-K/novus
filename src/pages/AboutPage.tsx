import React from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '../config/solutionsData';
import { ShieldCheck, Code, Cpu, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Our Philosophy
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 mt-1">
          Bridging the Gap Between Generic SaaS & Blank Slates
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 mt-2 leading-relaxed">
          {BUSINESS_INFO.companyName} was founded with a singular conviction: businesses in Nepal and South Asia deserve software that fits their operations without the astronomical cost and delays of traditional custom development.
        </p>
      </div>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed bg-white p-8 rounded-xl border border-neutral-200">
          <h2 className="text-base font-bold text-neutral-900">The Problem with Generic Foreign SaaS</h2>
          <p>
            When a local salon, futsal arena, or retail business attempts to use Silicon Valley SaaS tools, they quickly hit roadblocks: monthly subscriptions billed in USD on credit cards most local businesses don't have, no integration with eSewa or Khalti, and zero support for local SMS gateways like Sparrow SMS.
          </p>
          <p>
            Furthermore, foreign platforms lock customer data inside walled gardens, charging punitive fees as staff numbers grow.
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed bg-white p-8 rounded-xl border border-neutral-200">
          <h2 className="text-base font-bold text-neutral-900">The Problem with Traditional Software Agencies</h2>
          <p>
            The alternative has traditionally been hiring a local software agency. But agencies start from a blank canvas every single time. They spend 3 months charging for wireframes, another 4 months coding basic auth and calendar widgets, and frequently deliver brittle code with months of delays.
          </p>
          <p>
            The small or medium business owner ends up exhausted, over-budget, and frustrated.
          </p>
        </div>
      </div>

      {/* Our Solution Approach */}
      <div className="bg-neutral-900 text-white p-8 sm:p-12 rounded-xl space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Our Architectural Model
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">The Configurable Solution Paradigm</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
            We pre-engineer modular, production-ready software solutions for specific industries. When you partner with us, 70% of the core architecture is already tested, secure, and ready. We spend our engineering time tailoring the remaining 30%: your branding, workflows, pricing rules, staff commissions, and local payment gateways.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-neutral-800 text-xs">
          <div className="space-y-1">
            <h3 className="font-bold text-white text-sm">Predictable Timeline</h3>
            <p className="text-neutral-400">Deployments delivered in 1 to 2 weeks, not half a year.</p>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-sm">Fixed Transparent NPR</h3>
            <p className="text-neutral-400">Clear itemized pricing upfront with milestone protection.</p>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-sm">Complete Data Sovereignty</h3>
            <p className="text-neutral-400">Isolated database storage where you retain 100% of your records.</p>
          </div>
        </div>
      </div>

      {/* Contact Callout */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-neutral-900">Have questions about an upcoming software project?</h3>
          <p className="text-xs text-neutral-600">
            Our team is available in Kathmandu for direct discussions and technical consultations.
          </p>
        </div>
        <Link
          to="/contact"
          className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors whitespace-nowrap"
        >
          Contact Our Engineering Desk
        </Link>
      </div>
    </div>
  );
};
