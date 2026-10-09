import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { INITIAL_SOLUTIONS } from '../../config/solutionsData';
import { SolutionItem, SolutionStatus } from '../../types';
import { Currency } from '../../components/common/Currency';
import { Play, Check, Edit2, Save, ExternalLink } from 'lucide-react';

export const AdminSolutionsPage: React.FC = () => {
  const [solutions, setSolutions] = useState<SolutionItem[]>(INITIAL_SOLUTIONS);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Edit fields for active solution
  const [editStatus, setEditStatus] = useState<SolutionStatus>('Available');
  const [editDemo, setEditDemo] = useState<boolean>(true);
  const [editStarterPrice, setEditStarterPrice] = useState<number>(25000);
  const [editProPrice, setEditProPrice] = useState<number>(40000);

  const startEdit = (sol: SolutionItem) => {
    setEditingId(sol.id);
    setEditStatus(sol.status);
    setEditDemo(sol.demoAvailable);
    setEditStarterPrice(sol.packages.find((p) => p.id === 'starter')?.basePriceNPR || 25000);
    setEditProPrice(sol.packages.find((p) => p.id === 'professional')?.basePriceNPR || 40000);
  };

  const saveEdit = (solId: string) => {
    const updated = solutions.map((s) => {
      if (s.id === solId) {
        return {
          ...s,
          status: editStatus,
          demoAvailable: editDemo,
          startingPriceNPR: editStarterPrice,
          packages: s.packages.map((pkg) => {
            if (pkg.id === 'starter') return { ...pkg, basePriceNPR: editStarterPrice };
            if (pkg.id === 'professional') return { ...pkg, basePriceNPR: editProPrice };
            return pkg;
          }),
        };
      }
      return s;
    });

    setSolutions(updated);
    setEditingId(null);
    alert('Solution parameters updated for storefront.');
  };

  return (
    <AdminLayout
      title="Solutions Catalog Management"
      subtitle="Configure product listings, package baseline pricing, and interactive demo visibility."
    >
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-5 border-b border-neutral-200">
            <h2 className="text-sm font-bold text-neutral-900">Configurable Product Offerings</h2>
            <p className="text-xs text-neutral-500">
              Update availability or package rates across the public storefront.
            </p>
          </div>

          <div className="divide-y divide-neutral-100">
            {solutions.map((sol) => {
              const isEditing = editingId === sol.id;
              return (
                <div key={sol.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-neutral-900">{sol.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-neutral-500">Slug: /{sol.slug}</span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-950">{sol.title}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">{sol.shortDescription}</p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                      {isEditing ? (
                        <div className="flex items-center gap-4 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                          <div>
                            <label className="text-[11px] font-semibold text-neutral-600 block mb-0.5">
                              Status:
                            </label>
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value as SolutionStatus)}
                              className="px-2 py-1 text-xs border border-neutral-200 rounded bg-white"
                            >
                              <option value="Available">Available</option>
                              <option value="In Development">In Development</option>
                              <option value="Coming Soon">Coming Soon</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-neutral-600 block mb-0.5">
                              Demo Online:
                            </label>
                            <select
                              value={editDemo ? 'yes' : 'no'}
                              onChange={(e) => setEditDemo(e.target.value === 'yes')}
                              className="px-2 py-1 text-xs border border-neutral-200 rounded bg-white"
                            >
                              <option value="yes">Enabled</option>
                              <option value="no">Disabled</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-neutral-600 block mb-0.5">
                              Starter Price (NPR):
                            </label>
                            <input
                              type="number"
                              value={editStarterPrice}
                              onChange={(e) => setEditStarterPrice(Number(e.target.value))}
                              className="w-24 px-2 py-1 text-xs border border-neutral-200 rounded font-mono"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                              sol.status === 'Available'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                            }`}
                          >
                            {sol.status}
                          </span>
                          <span className="text-neutral-500">
                            Demo: {sol.demoAvailable ? 'Active Sandbox' : 'Preview Only'}
                          </span>
                          <span className="text-neutral-500">
                            Starter Base: <Currency amount={sol.startingPriceNPR} className="font-semibold text-neutral-900" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isEditing ? (
                      <button
                        onClick={() => saveEdit(sol.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(sol)}
                          className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Rates</span>
                        </button>
                        <a
                          href={`/solutions/${sol.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
