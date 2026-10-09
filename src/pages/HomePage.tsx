import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Check, Sliders, Shield, RefreshCw, HelpCircle, Laptop } from 'lucide-react';
import { INITIAL_SOLUTIONS, HERO_IMAGE_URL } from '../config/solutionsData';
import { SolutionCategory } from '../types';
import { SolutionCard } from '../components/catalog/SolutionCard';
import { Currency } from '../components/common/Currency';

const CATEGORIES: SolutionCategory[] = [
  'Booking & Appointments',
  'Retail & Inventory',
  'Hospitality',
  'Restaurant Management',
  'Customer Management',
  'Education',
  'Business Operations',
];

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [heroImgError, setHeroImgError] = useState(false);

  const featuredSolutions = INITIAL_SOLUTIONS.slice(0, 3);

  const filteredSolutions =
    selectedCategory === 'All'
      ? INITIAL_SOLUTIONS
      : INITIAL_SOLUTIONS.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="pt-8 sm:pt-14 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left copy column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 bg-neutral-100 px-3 py-1 rounded-md">
                <span>Production-Minded Software Implementation</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-neutral-900">Kathmandu, Nepal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-950 text-balance leading-[1.1]">
                Software That Fits the Way Your Business Works.
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
                Explore business software, try interactive demos, choose the features you need, and request a solution tailored to your business. Transparent NPR pricing with full ownership.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/solutions"
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors inline-flex items-center gap-2 shadow-xs whitespace-nowrap"
                >
                  <span>Explore Solutions</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/how-it-works"
                  className="px-6 py-3.5 text-sm font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap"
                >
                  See How It Works
                </Link>
              </div>

              {/* Core Principles Strip */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200/80 text-neutral-700">
                <div>
                  <p className="text-xs text-neutral-500">Demo Testing</p>
                  <p className="text-sm font-semibold text-neutral-900 mt-0.5">Test Before Buying</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Pricing Transparency</p>
                  <p className="text-sm font-semibold text-neutral-900 mt-0.5">Fixed NPR Estimates</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Tailored Setup</p>
                  <p className="text-sm font-semibold text-neutral-900 mt-0.5">Custom Implemented</p>
                </div>
              </div>
            </div>

            {/* Right visual preview column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl border border-neutral-200/80 bg-white p-3 shadow-sm overflow-hidden">
                {!heroImgError ? (
                  <img
                    src={HERO_IMAGE_URL}
                    alt="Buildwise Software Architecture and Implementation Studio"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="w-full aspect-[4/3] object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full aspect-[4/3] bg-neutral-100 rounded-lg flex flex-col items-center justify-center p-6 text-neutral-500">
                    <Laptop className="w-12 h-12 stroke-[1.5] mb-2" />
                    <p className="text-sm font-medium">Bespoke Software Architecture</p>
                  </div>
                )}

                {/* Overlay card previewing interactive configurator */}
                <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">
                      Salon & Spa Management System
                    </span>
                    <span className="text-xs text-neutral-500">
                      Live interactive customer + admin demo available
                    </span>
                  </div>
                  <Link
                    to="/solutions/salon-appointment-management/demo"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    Launch Demo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Featured Marquee: Salon Solution */}
      <section className="bg-white border-y border-neutral-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Primary Featured Solution
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight mt-1">
              Salon & Beauty Appointment Management
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-2 leading-relaxed">
              Eliminate double bookings, organize stylist schedules, and give your clients a modern booking portal that takes less than 60 seconds to complete. Fully customizable to your salon brand.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-neutral-50 rounded-xl border border-neutral-200 p-6 sm:p-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>Production Ready</span>
                <span aria-hidden="true">·</span>
                <span>Includes Customer & Staff Portals</span>
                <span aria-hidden="true">·</span>
                <span>Delivery: 1–2 Weeks</span>
              </div>

              <h3 className="text-xl font-bold text-neutral-900">
                Experience Velvet Studio — Full Working Demo
              </h3>

              <p className="text-sm text-neutral-600 leading-relaxed">
                Test the complete journey in our demo sandbox: browse beauty services, choose a stylist, pick a time slot, and simulate a confirmed booking. Then switch to the Business Admin View to see live dispatch, stylist load, and reports.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-800">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real-time slot lock engine</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-800">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Stylist commission & load tracking</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-800">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Optional WhatsApp automated reminders</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-800">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>eSewa & Khalti QR deposit support</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <Link
                  to="/solutions/salon-appointment-management/demo"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors inline-flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Try Interactive Demo Now</span>
                </Link>

                <Link
                  to="/solutions/salon-appointment-management/customize"
                  className="px-5 py-2.5 text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-md transition-colors inline-flex items-center gap-2"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Customize & Estimate Pricing</span>
                </Link>

                <div className="ml-auto text-right">
                  <span className="text-xs text-neutral-500 block">Starting Implementation</span>
                  <Currency amount={25000} className="text-sm font-bold text-neutral-900" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <img
                src={featuredSolutions[0]?.imagePath}
                alt="Salon Management System Interface"
                className="w-full aspect-[4/3] object-cover rounded-lg border border-neutral-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Solutions Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Solution Discovery
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight mt-1">
              Engineered Solutions Ready for Customization
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Select a solution to inspect deliverables, test demos, and configure modules.
            </p>
          </div>

          <Link
            to="/solutions"
            className="text-xs font-semibold text-neutral-900 hover:text-neutral-700 inline-flex items-center gap-1.5"
          >
            <span>View all {INITIAL_SOLUTIONS.length} solutions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-neutral-200">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Solution Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSolutions.map((solution) => (
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </div>
      </section>

      {/* How It Works (4 Clear Transparent Steps) */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Purchasing & Delivery Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              How You Get Your Software Built & Live
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              No vague agency quotes. No starting from blank canvas. A predictable, tested implementation cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <span className="font-mono text-2xl font-bold text-neutral-500">01</span>
              <h3 className="text-base font-semibold text-white">Choose a Solution</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Browse our catalog of domain-specific business software systems. Review feature breakdowns, package inclusions, and baseline NPR prices.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-2xl font-bold text-neutral-500">02</span>
              <h3 className="text-base font-semibold text-white">Explore the Live Demo</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Test the actual software in an interactive sandbox. Verify customer-facing flows and test administrative dashboard controls without committing.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-2xl font-bold text-neutral-500">03</span>
              <h3 className="text-base font-semibold text-white">Configure Features & Branding</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Use our multi-step configurator to select tiers, WhatsApp/SMS add-ons, business colors, domain preference, and hosting plans with an instant cost estimate.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-2xl font-bold text-neutral-500">04</span>
              <h3 className="text-base font-semibold text-white">Proposal & Deployment</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Our architect reviews your specs, validates external API requirements, issues an official proposal, and implements your tailored system in 1–3 weeks.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-400">
              Need custom third-party integrations or legacy database migrations?
            </p>
            <Link
              to="/contact"
              className="text-xs font-semibold text-white hover:text-neutral-300 inline-flex items-center gap-1.5"
            >
              <span>Speak with a Solution Architect</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Engineering Transparency Section (No fake testimonials) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg border border-neutral-200 space-y-3">
            <Shield className="w-6 h-6 text-neutral-900" />
            <h3 className="text-base font-bold text-neutral-900">Your Data, Your Ownership</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Unlike generic closed SaaS platforms where your business data is locked away, we deploy isolated databases for each customer. You retain full ownership of customer lists and records.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-neutral-200 space-y-3">
            <RefreshCw className="w-6 h-6 text-neutral-900" />
            <h3 className="text-base font-bold text-neutral-900">Tested Foundation vs Blank Agency Slates</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Generic agencies spend months rebuilding authentication, calendars, and tables from scratch with bugs. We start from hardened, tested solution architectures and spend time tailoring them to your exact workflow.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-neutral-200 space-y-3">
            <Laptop className="w-6 h-6 text-neutral-900" />
            <h3 className="text-base font-bold text-neutral-900">Local Nepal Support & Integrations</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Built to integrate natively with local payment providers (eSewa, Khalti, Fonepay Dynamic QR), local SMS gateways (Sparrow SMS, Aakash SMS), and custom domain configurations (.np or .com).
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight mt-1">
            Clear Answers Before You Order
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-5 bg-white rounded-lg border border-neutral-200">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-neutral-500" />
              Do I pay a monthly subscription or a one-time fee?
            </h3>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              You pay a one-time setup and implementation fee (e.g. NPR 25,000–60,000 depending on package). For hosting, you can either host it on your own server for NPR 0/month recurring, or choose our Managed Cloud Hosting & Maintenance plans starting at NPR 2,500/month.
            </p>
          </div>

          <div className="p-5 bg-white rounded-lg border border-neutral-200">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-neutral-500" />
              How long does implementation take?
            </h3>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Standard solutions like Salon Appointment Management are delivered within 1 to 2 weeks. Custom workflows, multi-branch setups, or complex ERP synchronizations typically take 2 to 4 weeks with weekly staging demos.
            </p>
          </div>

          <div className="p-5 bg-white rounded-lg border border-neutral-200">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-neutral-500" />
              Can my staff use this on their phones?
            </h3>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Yes. All customer booking portals and business management dashboards are responsive web applications optimized for touchscreens, mobile phones, iPads, and desktop computers.
            </p>
          </div>

          <div className="p-5 bg-white rounded-lg border border-neutral-200">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-neutral-500" />
              What happens if our business processes change later?
            </h3>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Because your solution is built on clean, modular code rather than a rigid third-party closed SaaS, our engineering team can add new service flows, custom reports, or branch locations anytime under our maintenance plans or hourly add-on rates.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-neutral-900 text-white rounded-xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Ready to modernize your business operations?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Test the live interactive salon demo or configure your project parameters to receive a formal implementation estimate.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/solutions/salon-appointment-management/demo"
              className="px-5 py-3 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 rounded-md transition-colors"
            >
              Test Salon Demo
            </Link>
            <Link
              to="/solutions"
              className="px-5 py-3 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md transition-colors"
            >
              Browse All Solutions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
