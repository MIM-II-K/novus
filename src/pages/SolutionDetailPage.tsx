import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Play, Sliders, Check, ArrowRight, ShieldCheck, Clock, Users, Calendar, AlertCircle } from 'lucide-react';
import { INITIAL_SOLUTIONS } from '../config/solutionsData';
import { Currency } from '../components/common/Currency';

export const SolutionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const solution = INITIAL_SOLUTIONS.find((s) => s.slug === slug);

  if (!solution) {
    return <Navigate to="/solutions" replace />;
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Solution Breadcrumb & Header */}
      <section className="bg-white border-b border-neutral-200 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
            <Link to="/solutions" className="hover:text-neutral-900">
              Solutions
            </Link>
            <span aria-hidden="true">/</span>
            <span>{solution.category}</span>
            <span aria-hidden="true">/</span>
            <span className="text-neutral-900 font-medium">{solution.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2 text-xs text-neutral-600">
                <span className="font-semibold text-neutral-900">{solution.category}</span>
                <span aria-hidden="true">·</span>
                <span>Delivery: {solution.estimatedDeliveryWeeks}</span>
                <span aria-hidden="true">·</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                    solution.status === 'Available'
                      ? 'border-emerald-200 text-emerald-800 bg-emerald-50'
                      : 'border-amber-200 text-amber-800 bg-amber-50'
                  }`}
                >
                  {solution.status}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 text-balance">
                {solution.title}
              </h1>

              <p className="text-base text-neutral-600 leading-relaxed">
                {solution.longDescription}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {solution.demoAvailable && (
                  <Link
                    to={solution.demoPath || `/solutions/${solution.slug}/demo`}
                    className="px-5 py-3 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors inline-flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Launch Interactive Demo</span>
                  </Link>
                )}

                <Link
                  to={`/solutions/${solution.slug}/customize`}
                  className="px-5 py-3 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors inline-flex items-center gap-2"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Customize This Solution</span>
                </Link>

                <div className="sm:ml-auto text-left sm:text-right">
                  <span className="text-xs text-neutral-500 block">Baseline Implementation</span>
                  <Currency amount={solution.startingPriceNPR} className="text-lg font-bold text-neutral-900" />
                </div>
              </div>
            </div>

            {/* Visual Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-neutral-200 overflow-hidden bg-neutral-50 p-2 shadow-xs">
                <img
                  src={solution.imagePath}
                  alt={solution.title}
                  className="w-full aspect-[4/3] object-cover rounded-lg"
                />
                <div className="p-3 text-xs text-neutral-500 flex items-center justify-between">
                  <span>Targeted for: {solution.targetAudience}</span>
                  {solution.demoAvailable && (
                    <Link
                      to={solution.demoPath!}
                      className="text-neutral-900 font-semibold hover:underline"
                    >
                      View Live Sandbox →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Problems Solved & Feature Deep Dive */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-white rounded-lg border border-neutral-200 space-y-2">
            <Calendar className="w-5 h-5 text-neutral-900" />
            <h3 className="text-base font-bold text-neutral-900">Zero Schedule Collisions</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              When a client selects a time slot, the system locks that specific stylist's schedule in real-time, preventing awkward double-booked chairs and customer delays.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-neutral-200 space-y-2">
            <Clock className="w-5 h-5 text-neutral-900" />
            <h3 className="text-base font-bold text-neutral-900">Reduced Client No-Shows</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Automated reminder hooks via WhatsApp or SMS send friendly reminder pings 24 hours and 2 hours before the appointment, keeping attendance rates above 90%.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-neutral-200 space-y-2">
            <Users className="w-5 h-5 text-neutral-900" />
            <h3 className="text-base font-bold text-neutral-900">Clear Staff Accounting</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every completed treatment is logged against the specific stylist, giving salon managers automated service totals, daily cash intake, and accurate commission numbers.
            </p>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="bg-white rounded-xl border border-neutral-200 p-8 space-y-6">
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Complete Feature Specification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {solution.keyFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-md bg-neutral-50/80">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs font-medium text-neutral-800">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Implementation Tiers
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight mt-1">
            Choose Your Implementation Package
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2">
            Baseline starting prices in NPR. All tiers include domain configuration, branding setup, staff training, and deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solution.packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-xl border p-6 flex flex-col justify-between transition-all ${
                pkg.isPopular
                  ? 'border-neutral-900 bg-white ring-1 ring-neutral-900 shadow-sm'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-neutral-950">{pkg.name}</h3>
                  {pkg.isPopular && (
                    <span className="text-[11px] font-semibold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                      Most Popular
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">{pkg.tagline}</p>

                <div className="pt-2 pb-2 border-y border-neutral-100">
                  <span className="text-xs text-neutral-500 block">Implementation Fee</span>
                  <Currency amount={pkg.basePriceNPR} className="text-2xl font-bold text-neutral-950" />
                </div>

                <p className="text-[11px] font-medium text-neutral-500">
                  Ideal for: {pkg.idealFor}
                </p>

                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold text-neutral-900">Included deliverables:</p>
                  <ul className="space-y-2 text-xs text-neutral-600">
                    {pkg.featuresIncluded.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100">
                <Link
                  to={`/solutions/${solution.slug}/customize?pkg=${pkg.id}`}
                  className={`w-full py-2.5 px-4 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    pkg.isPopular
                      ? 'bg-neutral-950 text-white hover:bg-neutral-800'
                      : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                  }`}
                >
                  <span>Select & Configure</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Optional Add-Ons & Integration Modules */}
      {solution.addons.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Optional Add-Ons
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight mt-1">
              Add-On Modules & External Connectors
            </h2>
            <p className="text-xs text-neutral-600 mt-1">
              Enhance your software with local payment gateways, automated WhatsApp pings, and multi-branch support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {solution.addons.map((addon) => (
              <div key={addon.id} className="p-4 bg-white rounded-lg border border-neutral-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-sm font-bold text-neutral-900">{addon.name}</h3>
                    <div className="text-right shrink-0">
                      {addon.isCustomQuote ? (
                        <span className="text-xs font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                          Custom Quote
                        </span>
                      ) : (
                        <Currency amount={addon.priceNPR} className="text-xs font-bold text-neutral-900" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">{addon.description}</p>
                  {addon.requiresExternalAccount && (
                    <p className="text-[11px] text-neutral-500 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{addon.externalProviderNote}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to={`/solutions/${solution.slug}/customize`}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors"
            >
              <span>Launch Full Configurator & Cost Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};
