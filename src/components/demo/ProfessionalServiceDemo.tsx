import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  DollarSign,
  Plus,
  Users,
  ShieldCheck,
  Send,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Download,
} from 'lucide-react';
import { Currency } from '../common/Currency';

interface ClientProject {
  id: string;
  code: string;
  clientName: string;
  projectTitle: string;
  leadPartner: string;
  budgetNPR: number;
  billedNPR: number;
  status: 'In Progress' | 'Review Stage' | 'Completed';
  milestonesTotal: number;
  milestonesCompleted: number;
  retainerMonthlyNPR?: number;
}

interface TimeEntry {
  id: string;
  consultant: string;
  projectCode: string;
  taskDescription: string;
  hours: number;
  hourlyRateNPR: number;
  date: string;
  isBilled: boolean;
}

const INITIAL_PROJECTS: ClientProject[] = [
  {
    id: 'proj-1',
    code: 'PRJ-2026-08',
    clientName: 'Himalayan FinTech Ltd.',
    projectTitle: 'Regulatory Compliance & NRB Payment License Advisory',
    leadPartner: 'Adv. Suman K. Malla (Senior Partner)',
    budgetNPR: 450000,
    billedNPR: 280000,
    status: 'In Progress',
    milestonesTotal: 5,
    milestonesCompleted: 3,
    retainerMonthlyNPR: 75000,
  },
  {
    id: 'proj-2',
    code: 'PRJ-2026-11',
    clientName: 'Everest Infrastructure Consortium',
    projectTitle: 'Cross-Border EPC Contract Drafting & Tax Structuring',
    leadPartner: 'Anupama Shakya, FCA (Tax Lead)',
    budgetNPR: 820000,
    billedNPR: 560000,
    status: 'Review Stage',
    milestonesTotal: 4,
    milestonesCompleted: 3,
  },
  {
    id: 'proj-3',
    code: 'PRJ-2026-14',
    clientName: 'Kathmandu Solar Energy Corp',
    projectTitle: 'Corporate Governance & Series-A Term Sheet Negotiation',
    leadPartner: 'Pradip Shrestha (Corporate Counsel)',
    budgetNPR: 350000,
    billedNPR: 120000,
    status: 'In Progress',
    milestonesTotal: 3,
    milestonesCompleted: 1,
    retainerMonthlyNPR: 60000,
  },
];

const INITIAL_TIMESHEETS: TimeEntry[] = [
  {
    id: 'time-1',
    consultant: 'Adv. Suman K. Malla',
    projectCode: 'PRJ-2026-08',
    taskDescription: 'Drafted NRB regulatory sandbox submission responses and KYC AML guidelines',
    hours: 4.5,
    hourlyRateNPR: 8000,
    date: 'Today',
    isBilled: false,
  },
  {
    id: 'time-2',
    consultant: 'Anupama Shakya, FCA',
    projectCode: 'PRJ-2026-11',
    taskDescription: 'Double Taxation Avoidance Agreement (DTAA) treaty analysis and withholding matrix',
    hours: 3.0,
    hourlyRateNPR: 9500,
    date: 'Yesterday',
    isBilled: false,
  },
  {
    id: 'time-3',
    consultant: 'Rohan Joshi (Associate)',
    projectCode: 'PRJ-2026-14',
    taskDescription: 'Shareholders Agreement (SHA) anti-dilution clause verification & cap table audit',
    hours: 5.5,
    hourlyRateNPR: 4500,
    date: 'Oct 07, 2026',
    isBilled: true,
  },
];

export const ProfessionalServiceDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'timesheet' | 'invoice'>('projects');
  const [projects, setProjects] = useState<ClientProject[]>(INITIAL_PROJECTS);
  const [timesheets, setTimesheets] = useState<TimeEntry[]>(INITIAL_TIMESHEETS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Timesheet Form
  const [newConsultant, setNewConsultant] = useState('Adv. Suman K. Malla');
  const [newProjectCode, setNewProjectCode] = useState(projects[0].code);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newHours, setNewHours] = useState('2.5');
  const [newRate, setNewRate] = useState('8000');

  // Invoice generator state
  const [selectedInvoiceProject, setSelectedInvoiceProject] = useState(projects[0]);
  const [invoiceSuccess, setInvoiceSuccess] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleLogHours = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDesc.trim()) return;

    const entry: TimeEntry = {
      id: `time-${Date.now()}`,
      consultant: newConsultant,
      projectCode: newProjectCode,
      taskDescription: newTaskDesc.trim(),
      hours: parseFloat(newHours) || 1,
      hourlyRateNPR: parseFloat(newRate) || 5000,
      date: 'Just now',
      isBilled: false,
    };

    setTimesheets([entry, ...timesheets]);
    setNewTaskDesc('');
    showToast(`Logged ${entry.hours} billable hours for project ${entry.projectCode}!`);
  };

  const unbilledHoursTotal = timesheets
    .filter((t) => !t.isBilled)
    .reduce((sum, t) => sum + t.hours * t.hourlyRateNPR, 0);

  const handleGenerateInvoice = () => {
    setInvoiceSuccess(true);
    showToast(`Invoice generated for ${selectedInvoiceProject.clientName}! Dispatched to client portal.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3 rounded-lg shadow-xl border border-neutral-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-medium">{toastMsg}</p>
        </div>
      )}

      {/* Brand Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-900 text-white flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">Veritas Legal & Strategic Advisory</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Professional Services Sandbox
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Client engagement workspaces, billable hours tracking, milestone deliverables, and automated retainer billing.
              </p>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'projects' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Active Engagements ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('timesheet')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'timesheet' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Billable Hours Log ({timesheets.length})
            </button>
            <button
              onClick={() => setActiveTab('invoice')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'invoice' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Fee Invoicing
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: PROJECTS & ENGAGEMENTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <span className="text-xs text-neutral-500">Total Contract Value</span>
              <div className="text-xl font-bold text-neutral-900 mt-1">रू 16,20,000</div>
              <span className="text-[11px] text-emerald-600 font-medium">3 active retained corporate accounts</span>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <span className="text-xs text-neutral-500">Unbilled WIP Timesheets</span>
              <div className="text-xl font-bold text-indigo-700 mt-1">रू {unbilledHoursTotal.toLocaleString()}</div>
              <span className="text-[11px] text-neutral-400">Ready for end-of-month invoice cycle</span>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <span className="text-xs text-neutral-500">Monthly Retainer Revenue</span>
              <div className="text-xl font-bold text-emerald-700 mt-1">रू 1,35,000 / mo</div>
              <span className="text-[11px] text-neutral-400">Recurring advisory contracts</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-all space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-neutral-100 rounded text-neutral-700">
                      {proj.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        proj.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : proj.status === 'Review Stage'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 leading-snug">{proj.projectTitle}</h3>
                  <div className="text-xs text-neutral-500">Client: <span className="font-semibold text-neutral-800">{proj.clientName}</span></div>
                  <div className="text-xs text-neutral-500">Lead: <span className="text-neutral-700">{proj.leadPartner}</span></div>
                </div>

                <div className="space-y-3 pt-3 border-t border-neutral-100">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-neutral-500">Milestone Deliverables</span>
                      <span className="font-semibold text-neutral-800">
                        {proj.milestonesCompleted} of {proj.milestonesTotal} Signed Off
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${(proj.milestonesCompleted / proj.milestonesTotal) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Total Budget</span>
                      <span className="font-bold text-neutral-900">रू {proj.budgetNPR.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 block">Billed to Date</span>
                      <span className="font-bold text-emerald-700">रू {proj.billedNPR.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedInvoiceProject(proj);
                      setActiveTab('invoice');
                    }}
                    className="w-full py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Client Invoices</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: TIMESHEETS & BILLABLE HOURS */}
      {activeTab === 'timesheet' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form: Log New Hours (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Record Billable Consultant Time</h3>
              <p className="text-xs text-neutral-500">
                Log hours against active client matters with automated hourly rate multipliers.
              </p>
            </div>

            <form onSubmit={handleLogHours} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Fee Earner / Consultant</label>
                <select
                  value={newConsultant}
                  onChange={(e) => setNewConsultant(e.target.value)}
                  className="w-full text-xs border border-neutral-300 rounded-md p-2 focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="Adv. Suman K. Malla">Adv. Suman K. Malla (Senior Partner)</option>
                  <option value="Anupama Shakya, FCA">Anupama Shakya, FCA (Tax Lead)</option>
                  <option value="Pradip Shrestha">Pradip Shrestha (Corporate Counsel)</option>
                  <option value="Rohan Joshi (Associate)">Rohan Joshi (Associate)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Matter / Project Code</label>
                <select
                  value={newProjectCode}
                  onChange={(e) => setNewProjectCode(e.target.value)}
                  className="w-full text-xs border border-neutral-300 rounded-md p-2 focus:ring-1 focus:ring-neutral-900"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.code}>
                      {p.code} — {p.clientName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Time (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="12"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded-md p-2 focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Rate (NPR / Hr)</label>
                  <input
                    type="number"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded-md p-2 focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Work Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Conducted legal review of vendor master agreement and drafted warranty disclaimer clauses..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full text-xs border border-neutral-300 rounded-md p-2 focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg text-xs text-neutral-600 flex items-center justify-between">
                <span>Calculated Entry Amount:</span>
                <span className="font-bold text-neutral-900">
                  रू {((parseFloat(newHours) || 0) * (parseFloat(newRate) || 0)).toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Billable Entry</span>
              </button>
            </form>
          </div>

          {/* Timesheet List (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Audit Trail of Billable Hours</h3>
                <p className="text-xs text-neutral-500">Daily consultant submissions ready for fee billing.</p>
              </div>
            </div>

            <div className="divide-y divide-neutral-100">
              {timesheets.map((entry) => (
                <div key={entry.id} className="p-4 hover:bg-neutral-50/50 transition-colors space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-900">{entry.consultant}</span>
                      <span className="text-xs font-mono px-2 py-0.5 bg-neutral-100 rounded text-neutral-700">
                        {entry.projectCode}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-neutral-900">
                        रू {(entry.hours * entry.hourlyRateNPR).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-neutral-400 block font-mono">
                        {entry.hours} hrs @ रू {entry.hourlyRateNPR.toLocaleString()}/hr
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600">{entry.taskDescription}</p>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                    <span>Logged: {entry.date}</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                        entry.isBilled
                          ? 'bg-neutral-100 text-neutral-600'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {entry.isBilled ? 'Invoice Settled' : 'Unbilled WIP'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: INVOICING & RETAINER */}
      {activeTab === 'invoice' && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 max-w-2xl mx-auto shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Professional Fee Invoice Preview</h3>
              <p className="text-xs text-neutral-500">
                VAT compliant tax invoice generated from logged billable hours and monthly retainer.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-neutral-100 rounded text-neutral-800">
              INV-2026-LAW-042
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Select Client Account</label>
              <select
                value={selectedInvoiceProject.code}
                onChange={(e) => {
                  const target = projects.find((p) => p.code === e.target.value);
                  if (target) {
                    setSelectedInvoiceProject(target);
                    setInvoiceSuccess(false);
                  }
                }}
                className="w-full text-xs border border-neutral-300 rounded-md p-2.5 focus:ring-1 focus:ring-neutral-900"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.code}>
                    {p.clientName} — {p.projectTitle}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-neutral-200 font-semibold text-neutral-700">
                <span>Fee Item Description</span>
                <span>Amount (NPR)</span>
              </div>
              <div className="flex justify-between text-neutral-700">
                <span>Partner Advisory Time (12.5 Billable Hours)</span>
                <span>रू 1,06,250</span>
              </div>
              <div className="flex justify-between text-neutral-700">
                <span>Regulatory Filing Disbursements & Documentation</span>
                <span>रू 18,500</span>
              </div>
              {selectedInvoiceProject.retainerMonthlyNPR && (
                <div className="flex justify-between text-neutral-700">
                  <span>Monthly Retainer Standby Fee (October 2026)</span>
                  <span>रू {selectedInvoiceProject.retainerMonthlyNPR.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-neutral-200 font-semibold text-neutral-800">
                <span>Subtotal Before VAT</span>
                <span>
                  रू {(124750 + (selectedInvoiceProject.retainerMonthlyNPR || 0)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Value Added Tax (13% VAT)</span>
                <span>
                  रू {Math.round((124750 + (selectedInvoiceProject.retainerMonthlyNPR || 0)) * 0.13).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-300 text-sm font-bold text-neutral-900">
                <span>Total Due Payable</span>
                <span className="text-base text-indigo-900">
                  रू {Math.round((124750 + (selectedInvoiceProject.retainerMonthlyNPR || 0)) * 1.13).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
              >
                Back to Projects
              </button>

              <button
                onClick={handleGenerateInvoice}
                className="px-5 py-2.5 text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-2 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Issue & Send Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
