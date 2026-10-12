import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Play, Sliders, Layers, RefreshCw } from 'lucide-react';
import { Currency } from '../components/common/Currency';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Delivery Model & Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 mt-1">
          How LumniscateSolutions Works
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 mt-2 leading-relaxed">
          We bridge the gap between expensive blank-slate software agencies and inflexible closed SaaS platforms. Here is how your tailored business software gets created, customized, and deployed.
        </p>
      </div>

      {/* 4-Step Process Deep Dive */}
      <div className="space-y-12">
        {/* Step 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start p-8 bg-white rounded-xl border border-neutral-200">
          <div className="md:col-span-4 space-y-2">
            <span className="font-mono text-3xl font-bold text-neutral-400">01</span>
            <h2 className="text-xl font-bold text-neutral-900">Discover & Explore</h2>
            <p className="text-xs text-neutral-500">Find the solution built for your industry vertical.</p>
          </div>
          <div className="md:col-span-8 space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            <p>
              Traditional agencies force you to pay for months of generic wireframing and discovery workshops just to design basic tables and appointment grids.
            </p>
            <p>
              At LumniscateSolutions, we have already engineered proven architectural foundations for appointment booking, inventory management, restaurant operations, and sports facility scheduling. You start from a hardened, functional software system with zero blank-slate risk.
            </p>
            <div className="pt-2">
              <Link to="/solutions" className="text-xs font-semibold text-neutral-900 hover:underline inline-flex items-center gap-1">
                <span>Browse our solution catalog →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start p-8 bg-white rounded-xl border border-neutral-200">
          <div className="md:col-span-4 space-y-2">
            <span className="font-mono text-3xl font-bold text-neutral-400">02</span>
            <h2 className="text-xl font-bold text-neutral-900">Test the Live Sandbox</h2>
            <p className="text-xs text-neutral-500">Simulate real operations before spending a single rupee.</p>
          </div>
          <div className="md:col-span-8 space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            <p>
              Never buy software based on static marketing screenshots or polished sales slide decks. We provide live, interactive sandbox environments for our solutions.
            </p>
            <p>
              In our Salon Solution Demo, you can place a real test appointment from the client perspective, then switch to the Business Admin View to see how walk-ins, daily registers, and stylist shifts operate in practice.
            </p>
            <div className="pt-2">
              <Link to="/solutions/salon-appointment-management/demo" className="text-xs font-semibold text-neutral-900 hover:underline inline-flex items-center gap-1">
                <span>Launch the Velvet Studio Demo →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start p-8 bg-white rounded-xl border border-neutral-200">
          <div className="md:col-span-4 space-y-2">
            <span className="font-mono text-3xl font-bold text-neutral-400">03</span>
            <h2 className="text-xl font-bold text-neutral-900">Configure & Estimate</h2>
            <p className="text-xs text-neutral-500">Transparent NPR calculation with no hidden retainers.</p>
          </div>
          <div className="md:col-span-8 space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            <p>
              Use our interactive configurator to specify exactly what your business requires: choose an implementation tier (Starter, Professional, Custom), add optional WhatsApp or SMS notification hooks, choose payment gateways (eSewa, Khalti), set your branding colors, and pick a hosting plan.
            </p>
            <p>
              Our pricing engine calculates a transparent breakdown in Nepalese Rupee (NPR), separating one-time implementation from optional recurring maintenance.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start p-8 bg-white rounded-xl border border-neutral-200">
          <div className="md:col-span-4 space-y-2">
            <span className="font-mono text-3xl font-bold text-neutral-400">04</span>
            <h2 className="text-xl font-bold text-neutral-900">Proposal & Deployment</h2>
            <p className="text-xs text-neutral-500">Dedicated staging preview, staff training, and live launch.</p>
          </div>
          <div className="md:col-span-8 space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            <p>
              Upon enquiry submission, a lead software architect reviews your specifications and provides an official proposal.
            </p>
            <p>
              Commercial milestones: 30% initial deposit on kickoff, 40% upon staging demo approval, and 30% upon final production deployment on your custom domain. Standard delivery takes 1 to 2 weeks, accompanied by 30–60 days of technical warranty.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison: Custom Agency vs Generic SaaS vs Lumniscate*/}
      <div className="bg-white rounded-xl border border-neutral-200 p-8 space-y-6">
        <h2 className="text-xl font-bold text-neutral-950 tracking-tight">
          Why Choose Configurable Solutions?
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500">
                <th className="pb-3 font-semibold">Aspect</th>
                <th className="pb-3 font-semibold">Generic Software Agency</th>
                <th className="pb-3 font-semibold">Foreign Closed SaaS</th>
                <th className="pb-3 font-semibold text-neutral-950 font-bold">LumniscateSolutions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <tr>
                <td className="py-3 font-semibold text-neutral-900">Delivery Time</td>
                <td className="py-3 text-neutral-500">3 to 6 months</td>
                <td className="py-3 text-neutral-500">Immediate, but rigid</td>
                <td className="py-3 font-semibold text-neutral-900">1 to 2 weeks</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-neutral-900">Pricing Predictability</td>
                <td className="py-3 text-neutral-500">Hourly overruns, high rates</td>
                <td className="py-3 text-neutral-500">USD per-user monthly rent forever</td>
                <td className="py-3 font-semibold text-neutral-900">Fixed NPR estimate upfront</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-neutral-900">Data Ownership</td>
                <td className="py-3 text-neutral-500">Yours, but untested code</td>
                <td className="py-3 text-neutral-500">Locked inside vendor cloud</td>
                <td className="py-3 font-semibold text-neutral-900">Isolated database, full ownership</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-neutral-900">Local Integrations</td>
                <td className="py-3 text-neutral-500">Requires custom billing</td>
                <td className="py-3 text-neutral-500">None (no eSewa / Sparrow SMS)</td>
                <td className="py-3 font-semibold text-neutral-900">Native Nepal gateways configured</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="bg-neutral-900 text-white rounded-xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Ready to test a real solution?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Explore the live Velvet Studio Salon demo or request a tailored estimate for your business.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/solutions/salon-appointment-management/demo"
            className="px-5 py-3 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 rounded-md transition-colors"
          >
            Launch Interactive Demo
          </Link>
          <Link
            to="/solutions"
            className="px-5 py-3 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md transition-colors"
          >
            Browse Solutions
          </Link>
        </div>
      </div>
    </div>
  );
};
