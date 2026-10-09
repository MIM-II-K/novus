import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { HOSTING_OPTIONS, INITIAL_SOLUTIONS } from '../../config/solutionsData';
import { Currency } from '../../components/common/Currency';
import { Save, AlertCircle, Check } from 'lucide-react';

export const AdminPricingPage: React.FC = () => {
  const [currency, setCurrency] = useState('NPR');
  const [depositPct, setDepositPct] = useState(30);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <AdminLayout
      title="Global Pricing Engine Configuration"
      subtitle="Configure default currency, baseline add-on rates, and hosting plans."
    >
      <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
        {savedNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Pricing rules updated successfully.</span>
          </div>
        )}

        {/* Currency & Commercial Policies */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-neutral-900">Currency & Milestone Rules</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-neutral-800 block mb-1">
                Storefront Base Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-md bg-white font-mono"
              >
                <option value="NPR">NPR — Nepalese Rupee (रू)</option>
                <option value="INR">INR — Indian Rupee (₹)</option>
                <option value="USD">USD — US Dollar ($)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-neutral-800 block mb-1">
                Initial Project Kickoff Deposit (%)
              </label>
              <input
                type="number"
                min={10}
                max={100}
                value={depositPct}
                onChange={(e) => setDepositPct(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-200 rounded-md font-mono"
              />
            </div>
          </div>
        </div>

        {/* Default Add-On Rates */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-neutral-900">Standard Add-On Rate Card</h2>
          <p className="text-neutral-500">
            These figures are queried dynamically by the public configurator for project estimates.
          </p>

          <div className="space-y-3">
            {INITIAL_SOLUTIONS[0].addons.map((addon) => (
              <div
                key={addon.id}
                className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-neutral-900 block">{addon.name}</span>
                  <span className="text-neutral-500">{addon.category} · {addon.description}</span>
                </div>
                <div className="text-right">
                  {addon.isCustomQuote ? (
                    <span className="font-mono font-semibold text-neutral-600">Manual Scoping</span>
                  ) : (
                    <Currency amount={addon.priceNPR} className="font-bold text-neutral-900" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hosting & SLA Rates */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-neutral-900">Managed Hosting & Maintenance Tiers</h2>

          <div className="space-y-3">
            {HOSTING_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-neutral-900 block">{opt.name}</span>
                  <span className="text-neutral-500">{opt.description}</span>
                </div>
                <div className="text-right shrink-0">
                  {opt.monthlyNPR === 0 ? (
                    <span className="font-mono text-emerald-700 font-bold">NPR 0 / mo</span>
                  ) : (
                    <Currency amount={opt.monthlyNPR} className="font-bold text-neutral-900" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Pricing Engine Rules</span>
        </button>
      </form>
    </AdminLayout>
  );
};
