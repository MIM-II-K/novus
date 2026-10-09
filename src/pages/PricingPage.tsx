import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, HelpCircle, ShieldCheck } from 'lucide-react';
import { HOSTING_OPTIONS, INITIAL_SOLUTIONS } from '../config/solutionsData';
import { Currency } from '../components/common/Currency';

export const PricingPage: React.FC = () => {
  const sampleSolution = INITIAL_SOLUTIONS[0]; // Salon solution packages

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Commercial Model & Transparency
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 mt-1">
          Simple, Transparent Pricing in NPR
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 mt-2 leading-relaxed">
          No hidden hourly billing surprises or foreign currency per-seat fees. You pay a clear one-time implementation fee, with optional managed hosting and support plans.
        </p>
      </div>

      {/* Package Tiers Grid (Sampled on Salon Solution) */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Implementation Tiers (Salon Solution Example)
          </h2>
          <p className="text-xs text-neutral-500">
            Baseline starting prices. Final quotes depend on scope and requested custom workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleSolution.packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-xl border p-6 flex flex-col justify-between bg-white ${
                pkg.isPopular ? 'border-neutral-950 ring-1 ring-neutral-950 shadow-sm' : 'border-neutral-200'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-neutral-950">{pkg.name}</h3>
                  {pkg.isPopular && (
                    <span className="text-[11px] font-semibold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                      Most Selected
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">{pkg.tagline}</p>

                <div className="py-2 border-y border-neutral-100">
                  <span className="text-xs text-neutral-500 block">One-time Implementation:</span>
                  <Currency amount={pkg.basePriceNPR} className="text-2xl font-bold text-neutral-950" />
                </div>

                <div className="space-y-2 pt-2 text-xs">
                  <p className="font-semibold text-neutral-900">What's included:</p>
                  <ul className="space-y-2 text-neutral-600">
                    {pkg.featuresIncluded.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100">
                <Link
                  to={`/solutions/${sampleSolution.slug}/customize?pkg=${pkg.id}`}
                  className="w-full py-2.5 px-4 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 bg-neutral-950 text-white hover:bg-neutral-800 transition-colors"
                >
                  <span>Configure This Package</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hosting & Maintenance Plans */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Hosting & Support Plans
          </h2>
          <p className="text-xs text-neutral-500">
            Choose whether to self-host on your own infrastructure or let Buildwise manage production reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOSTING_OPTIONS.map((host) => (
            <div key={host.id} className="bg-white rounded-lg border border-neutral-200 p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-neutral-900">{host.name}</h3>
                <div className="py-1">
                  {host.monthlyNPR === 0 ? (
                    <span className="font-mono text-base font-bold text-emerald-700">NPR 0 / mo</span>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <Currency amount={host.monthlyNPR} className="text-lg font-bold text-neutral-950" />
                      <span className="text-xs text-neutral-500">/ mo</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">{host.description}</p>
              </div>

              <div className="pt-3 border-t border-neutral-100 space-y-1.5 text-[11px] text-neutral-700">
                {host.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <Check className="w-3 h-3 text-neutral-900 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment & Commercial Milestones */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8 space-y-4">
        <h2 className="text-lg font-bold text-neutral-950">Milestone-Based Payment Schedule</h2>
        <p className="text-xs text-neutral-600 leading-relaxed max-w-3xl">
          To protect your investment, projects are paid in verified stages based on working software milestones. We never ask for full payment upfront.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-neutral-100">
          <div className="space-y-1">
            <span className="font-mono text-xl font-bold text-neutral-900">30%</span>
            <p className="text-xs font-bold text-neutral-900">Project Kickoff Deposit</p>
            <p className="text-[11px] text-neutral-500">Paid upon agreement of technical specification and target domain setup.</p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xl font-bold text-neutral-900">40%</span>
            <p className="text-xs font-bold text-neutral-900">Staging Milestone Approval</p>
            <p className="text-[11px] text-neutral-500">Paid after you test and approve the working staging system with your data.</p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xl font-bold text-neutral-900">30%</span>
            <p className="text-xs font-bold text-neutral-900">Final Production Go-Live</p>
            <p className="text-[11px] text-neutral-500">Paid upon domain live cutover, staff training, and handover of admin credentials.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
