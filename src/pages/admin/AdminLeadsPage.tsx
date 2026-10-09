import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Calendar,
  Phone,
  Mail,
  Edit3,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Plus,
  ArrowRight,
  X,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { storageService } from '../../services/storageService';
import { Currency } from '../../components/common/Currency';
import { ProjectRequest, RequestStatus } from '../../types';

export const AdminLeadsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [requests, setRequests] = useState<ProjectRequest[]>(() => storageService.getRequests());
  const [selectedLead, setSelectedLead] = useState<ProjectRequest | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Lead detail edit states
  const [newNoteText, setNewNoteText] = useState('');
  const [quotedPriceInput, setQuotedPriceInput] = useState<string>('');
  const [leadStatusInput, setLeadStatusInput] = useState<RequestStatus>('New');

  // If URL has ?id=xxx, open that lead automatically
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const found = requests.find((r) => r.id === id || r.referenceNumber === id);
      if (found) {
        openLeadDrawer(found);
      }
    }
  }, [searchParams, requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.referenceNumber.toLowerCase().includes(q) ||
        r.clientName.toLowerCase().includes(q) ||
        r.businessName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.solutionTitle.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [requests, statusFilter, searchQuery]);

  const openLeadDrawer = (lead: ProjectRequest) => {
    setSelectedLead(lead);
    setLeadStatusInput(lead.status);
    setQuotedPriceInput(String(lead.finalQuotedPriceNPR || lead.costBreakdown.oneTimeTotalNPR));
    setNewNoteText('');
  };

  const handleUpdateStatus = (newStatus: RequestStatus) => {
    if (!selectedLead) return;
    const updated = storageService.updateRequestStatus(selectedLead.id, newStatus);
    if (updated) {
      setRequests(storageService.getRequests());
      setSelectedLead(updated);
      setLeadStatusInput(newStatus);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;

    const updated = storageService.addRequestNote(selectedLead.id, newNoteText.trim(), 'Lead Architect');
    if (updated) {
      setRequests(storageService.getRequests());
      setSelectedLead(updated);
      setNewNoteText('');
    }
  };

  const handleSaveQuotedPrice = () => {
    if (!selectedLead) return;
    const priceNum = Number(quotedPriceInput);
    if (isNaN(priceNum) || priceNum <= 0) return;

    const updated = storageService.updateRequestQuotedPrice(selectedLead.id, priceNum);
    if (updated) {
      setRequests(storageService.getRequests());
      setSelectedLead(updated);
      alert('Official quoted price recorded.');
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Reference',
      'Created At',
      'Client Name',
      'Business Name',
      'Phone',
      'Email',
      'Solution',
      'Package',
      'Hosting',
      'OneTime Total (NPR)',
      'Quoted Price (NPR)',
      'Status',
    ];

    const rows = requests.map((r) => [
      r.referenceNumber,
      r.createdAt,
      `"${r.clientName}"`,
      `"${r.businessName}"`,
      r.phone,
      r.email,
      `"${r.solutionTitle}"`,
      r.packageName,
      r.hostingOptionId,
      r.costBreakdown.oneTimeTotalNPR,
      r.finalQuotedPriceNPR || '',
      r.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `buildwise_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout
      title="Enquiries & Pipeline Management"
      subtitle="Inspect customer requirements, log architectural notes, update statuses, and record quotations."
    >
      <div className="space-y-6">
        {/* Filters & Actions Header */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reference, client, business, or solution..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-200 rounded-md focus:outline-hidden focus:border-neutral-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-neutral-200 rounded-md px-2.5 py-1.5 bg-white text-neutral-800"
              >
                <option value="All">All Statuses ({requests.length})</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Requirements Review">Requirements Review</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Accepted">Accepted</option>
                <option value="In Development">In Development</option>
                <option value="Delivered">Delivered</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <button
            onClick={exportToCSV}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to CSV</span>
          </button>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 bg-neutral-50">
                  <th className="py-3 px-4 font-semibold">Reference</th>
                  <th className="py-3 px-4 font-semibold">Submission Date</th>
                  <th className="py-3 px-4 font-semibold">Business & Contact</th>
                  <th className="py-3 px-4 font-semibold">Solution & Tier</th>
                  <th className="py-3 px-4 font-semibold">Est. Pipeline</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => openLeadDrawer(req)}
                    className="hover:bg-neutral-50/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                      {req.referenceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-500">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-neutral-900">{req.businessName}</p>
                      <p className="text-[11px] text-neutral-500">
                        {req.clientName} · {req.phone}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-neutral-800 font-medium">{req.solutionTitle}</p>
                      <p className="text-[11px] text-neutral-500">{req.packageName} Package</p>
                    </td>
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
                            : req.status === 'Accepted' || req.status === 'In Development'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLeadDrawer(req);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-in Detail Drawer for Selected Lead */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Drawer Header */}
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-neutral-900">
                    {selectedLead.referenceNumber}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-xs text-neutral-500">
                    Received {new Date(selectedLead.createdAt).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-neutral-950 mt-1">
                  {selectedLead.businessName}
                </h2>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-md hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Quick Status Control */}
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Pipeline Status:
                  </label>
                  <select
                    value={leadStatusInput}
                    onChange={(e) => {
                      const val = e.target.value as RequestStatus;
                      setLeadStatusInput(val);
                      handleUpdateStatus(val);
                    }}
                    className="px-3 py-1.5 border border-neutral-200 rounded-md bg-white font-medium"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Requirements Review">Requirements Review</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Accepted">Accepted</option>
                    <option value="In Development">In Development</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Official Quoted Price (NPR):
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={quotedPriceInput}
                      onChange={(e) => setQuotedPriceInput(e.target.value)}
                      className="w-32 px-2.5 py-1.5 border border-neutral-200 rounded-md font-mono"
                    />
                    <button
                      onClick={handleSaveQuotedPrice}
                      className="px-2.5 py-1.5 font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>

              {/* Client & Business Contacts */}
              <div className="space-y-3">
                <h3 className="font-bold text-neutral-900 text-sm">Client Contact & Business Profile</h3>
                <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded-lg border border-neutral-200">
                  <div>
                    <span className="text-neutral-500 block">Contact Name:</span>
                    <span className="font-semibold text-neutral-900">{selectedLead.clientName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Phone:</span>
                    <span className="font-semibold text-neutral-900">{selectedLead.phone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Email:</span>
                    <span className="font-semibold text-neutral-900">{selectedLead.email}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Organization Scale:</span>
                    <span className="font-semibold text-neutral-900">
                      {selectedLead.staffCount} staff · {selectedLead.branchCount} branches
                    </span>
                  </div>
                  {selectedLead.preferredDomain && (
                    <div className="col-span-2">
                      <span className="text-neutral-500 block">Target Domain:</span>
                      <span className="font-mono text-neutral-900">{selectedLead.preferredDomain}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Scope & Cost Specification */}
              <div className="space-y-3">
                <h3 className="font-bold text-neutral-900 text-sm">Requested Solution Architecture</h3>
                <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Solution:</span>
                    <span className="font-semibold text-neutral-900">{selectedLead.solutionTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Package Tier:</span>
                    <span className="font-semibold text-neutral-900">{selectedLead.packageName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Selected Add-Ons ({selectedLead.selectedAddonIds.length}):</span>
                    <span className="font-semibold text-neutral-900">
                      {selectedLead.selectedAddonIds.join(', ') || 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Hosting Selection:</span>
                    <span className="font-semibold text-neutral-900">{selectedLead.hostingOptionId}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-neutral-100 font-bold text-neutral-950">
                    <span>Configured One-Time Total:</span>
                    <Currency amount={selectedLead.costBreakdown.oneTimeTotalNPR} />
                  </div>
                </div>
              </div>

              {/* Custom Requirements Text */}
              {selectedLead.customRequirements && (
                <div className="space-y-2">
                  <h3 className="font-bold text-neutral-900 text-sm">Custom Workflow Notes from Client</h3>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-neutral-700 leading-relaxed">
                    {selectedLead.customRequirements}
                  </div>
                </div>
              )}

              {/* Internal Notes & Communications Log */}
              <div className="space-y-3">
                <h3 className="font-bold text-neutral-900 text-sm">Internal Architectural Notes</h3>

                <div className="space-y-2.5">
                  {selectedLead.internalNotes.map((note) => (
                    <div key={note.id} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                        <span>{note.author}</span>
                        <span>{new Date(note.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-neutral-800 leading-relaxed">{note.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNote} className="space-y-2 pt-2">
                  <textarea
                    rows={3}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Log discovery call notes, client agreements, or technical questions..."
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md"
                  >
                    Add Internal Note
                  </button>
                </form>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <a
                href={`/request/${selectedLead.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-neutral-800 hover:underline flex items-center gap-1"
              >
                <span>Client Status Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-md"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
