import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Clock,
  Send,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { storageService } from '../../services/storageService';
import { Currency } from '../../components/common/Currency';
import { ProjectRequest, RequestStatus } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [requests, setRequests] = useState<ProjectRequest[]>(() => storageService.getRequests());

  // Pipeline Metrics Calculation
  const newCount = requests.filter((r) => r.status === 'New').length;
  const contactedCount = requests.filter((r) => r.status === 'Contacted' || r.status === 'Requirements Review').length;
  const proposalsSentCount = requests.filter((r) => r.status === 'Proposal Sent' || r.status === 'Negotiation').length;
  const acceptedCount = requests.filter((r) => r.status === 'Accepted' || r.status === 'In Development').length;
  const inDevCount = requests.filter((r) => r.status === 'In Development').length;

  // Pipeline total value (calculated strictly as potential pipeline, not collected revenue)
  const pipelineValueNPR = requests
    .filter((r) => r.status !== 'Rejected')
    .reduce((sum, r) => sum + (r.finalQuotedPriceNPR || r.costBreakdown.oneTimeTotalNPR), 0);

  const handleStatusChange = (requestId: string, newStatus: RequestStatus) => {
    storageService.updateRequestStatus(requestId, newStatus);
    setRequests(storageService.getRequests());
  };

  return (
    <AdminLayout
      title="Commercial Overview & Pipeline"
      subtitle="Track incoming solution enquiries, proposal milestones, and development readiness."
    >
      <div className="space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-1">
            <span className="text-xs text-neutral-500 flex items-center justify-between">
              <span>New Inbound Enquiries</span>
              <Users className="w-4 h-4 text-neutral-400" />
            </span>
            <p className="text-2xl font-bold font-mono text-neutral-900">{newCount}</p>
            <span className="text-[11px] text-neutral-500">Awaiting architectural triage</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-1">
            <span className="text-xs text-neutral-500 flex items-center justify-between">
              <span>Under Review / Contacted</span>
              <Clock className="w-4 h-4 text-neutral-400" />
            </span>
            <p className="text-2xl font-bold font-mono text-neutral-900">{contactedCount}</p>
            <span className="text-[11px] text-neutral-500">Discovery in progress</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-1">
            <span className="text-xs text-neutral-500 flex items-center justify-between">
              <span>Proposals Sent</span>
              <Send className="w-4 h-4 text-neutral-400" />
            </span>
            <p className="text-2xl font-bold font-mono text-neutral-900">{proposalsSentCount}</p>
            <span className="text-[11px] text-neutral-500">Awaiting client sign-off</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-1">
            <span className="text-xs text-neutral-500 flex items-center justify-between">
              <span>Accepted / In Delivery</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </span>
            <p className="text-2xl font-bold font-mono text-neutral-900">{acceptedCount}</p>
            <span className="text-[11px] text-neutral-500">{inDevCount} currently in development</span>
          </div>
        </div>

        {/* Pipeline Value Strip (Strictly labeled as estimated pipeline, not collected revenue) */}
        <div className="bg-neutral-900 text-white rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                Estimated Commercial Pipeline Value
              </span>
              <span className="text-[11px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-mono">
                Active Enquiries
              </span>
            </div>
            <Currency amount={pipelineValueNPR} className="text-3xl font-bold text-white block" />
            <p className="text-[11px] text-neutral-400">
              * Note: Estimated potential contract value across non-rejected pipeline leads. Not recognized as collected revenue until milestone payment confirmation.
            </p>
          </div>

          <Link
            to="/admin/leads"
            className="px-4 py-2.5 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 rounded-md transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>Manage All Leads</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Recent Enquiries Table */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-neutral-900">Recent Customer Enquiries</h2>
              <p className="text-xs text-neutral-500">Live requests submitted via website configurator.</p>
            </div>
            <Link
              to="/admin/leads"
              className="text-xs font-semibold text-neutral-900 hover:underline"
            >
              View Full Pipeline ({requests.length}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 bg-neutral-50">
                  <th className="py-3 px-4 font-semibold">Reference</th>
                  <th className="py-3 px-4 font-semibold">Client & Business</th>
                  <th className="py-3 px-4 font-semibold">Solution</th>
                  <th className="py-3 px-4 font-semibold">Tier</th>
                  <th className="py-3 px-4 font-semibold">Est. Total</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {requests.slice(0, 5).map((req) => (
                  <tr key={req.id} className="hover:bg-neutral-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                      <Link to={`/admin/leads?id=${req.id}`} className="hover:underline">
                        {req.referenceNumber}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-neutral-900">{req.businessName}</p>
                      <p className="text-[11px] text-neutral-500">
                        {req.clientName} · {req.phone}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700">{req.solutionTitle}</td>
                    <td className="py-3.5 px-4 font-medium text-neutral-800">{req.packageName}</td>
                    <td className="py-3.5 px-4">
                      <Currency
                        amount={req.finalQuotedPriceNPR || req.costBreakdown.oneTimeTotalNPR}
                        className="font-semibold text-neutral-900"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                          req.status === 'New'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : req.status === 'Proposal Sent'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : req.status === 'In Development' || req.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value as any)}
                        className="text-[11px] border border-neutral-200 rounded px-2 py-1 bg-white font-medium"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Requirements Review">Requirements Review</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Accepted">Accepted</option>
                        <option value="In Development">In Development</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
