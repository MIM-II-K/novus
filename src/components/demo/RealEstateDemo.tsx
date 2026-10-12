import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  Calendar,
  Clock,
  Phone,
  Send,
  MapPin,
  Users,
  LayoutDashboard,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  DollarSign,
  Eye,
} from 'lucide-react';
import { Currency } from '../common/Currency';

interface PropertyUnit {
  id: string;
  code: string;
  title: string;
  propertyType: '2BHK Apartment' | '3BHK Penthouse' | 'Luxury Villa' | 'Commercial Office';
  location: string;
  areaSqFt: number;
  floor: string;
  priceNPR: number;
  status: 'Available' | 'Token Locked' | 'Sold';
  parkingSpots: number;
  balconyOrientation: string;
}

interface LeadRecord {
  id: string;
  leadCode: string;
  clientName: string;
  phone: string;
  interestedUnitCode: string;
  budgetRangeNPR: string;
  stage: 'New Lead' | 'Site Visit Booked' | 'Price Negotiation' | 'Token Closed';
  siteVisitDate?: string;
  agentName: string;
}

const INITIAL_UNITS: PropertyUnit[] = [
  {
    id: 'prop-1',
    code: 'HH-APT-402',
    title: 'The Skyview Residence 402',
    propertyType: '2BHK Apartment',
    location: 'Jhamsikhel, Lalitpur',
    areaSqFt: 1350,
    floor: '4th Floor (Corner Unit)',
    priceNPR: 28500000,
    status: 'Available',
    parkingSpots: 1,
    balconyOrientation: 'South-East (Unobstructed Sun)',
  },
  {
    id: 'prop-2',
    code: 'HH-PENT-801',
    title: 'Annapurna Crown Penthouse',
    propertyType: '3BHK Penthouse',
    location: 'Baluwatar, Kathmandu',
    areaSqFt: 2800,
    floor: '8th Floor Penthouse Deck',
    priceNPR: 59000000,
    status: 'Token Locked',
    parkingSpots: 2,
    balconyOrientation: 'North-West (Langtang Mountain Panorama)',
  },
  {
    id: 'prop-3',
    code: 'HH-VIL-12',
    title: 'Lakeside Serenity Villa 12',
    propertyType: 'Luxury Villa',
    location: 'Lakeside, Pokhara',
    areaSqFt: 3400,
    floor: 'G+2 Standalone Plot',
    priceNPR: 48000000,
    status: 'Available',
    parkingSpots: 3,
    balconyOrientation: 'Phewa Lake Direct Facing',
  },
  {
    id: 'prop-4',
    code: 'HH-COMM-201',
    title: 'Central Corporate Suite 201',
    propertyType: 'Commercial Office',
    location: 'Naxal, Kathmandu',
    areaSqFt: 1950,
    floor: '2nd Floor Open Concept',
    priceNPR: 36000000,
    status: 'Available',
    parkingSpots: 2,
    balconyOrientation: 'Araniko Highway Corridor',
  },
];

const INITIAL_LEADS: LeadRecord[] = [
  {
    id: 'lead-101',
    leadCode: 'LEAD-904',
    clientName: 'Prabhat Shrestha',
    phone: '+977 9851088992',
    interestedUnitCode: 'HH-APT-402',
    budgetRangeNPR: 'रू 2.8 – 3.2 Crore',
    stage: 'Site Visit Booked',
    siteVisitDate: 'Tomorrow at 11:30 AM',
    agentName: 'Suman Karki',
  },
  {
    id: 'lead-102',
    leadCode: 'LEAD-905',
    clientName: 'Dr. Anupama Pradhan',
    phone: '+977 9841223344',
    interestedUnitCode: 'HH-PENT-801',
    budgetRangeNPR: 'रू 5.5 – 6.0 Crore',
    stage: 'Price Negotiation',
    siteVisitDate: 'Completed on Oct 06',
    agentName: 'Reena Bajracharya',
  },
  {
    id: 'lead-103',
    leadCode: 'LEAD-906',
    clientName: 'Sunil Gurung (UK Expat)',
    phone: '+977 9801776655',
    interestedUnitCode: 'HH-VIL-12',
    budgetRangeNPR: 'रू 4.5 – 5.0 Crore',
    stage: 'Token Closed',
    siteVisitDate: 'Completed via Video Call',
    agentName: 'Suman Karki',
  },
  {
    id: 'lead-104',
    leadCode: 'LEAD-907',
    clientName: 'Apex Capital Ventures',
    phone: '+977 9811445566',
    interestedUnitCode: 'HH-COMM-201',
    budgetRangeNPR: 'रू 3.5 Crore',
    stage: 'New Lead',
    agentName: 'Reena Bajracharya',
  },
];

export const RealEstateDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'crm' | 'bookVisit'>('inventory');
  const [units, setUnits] = useState<PropertyUnit[]>(INITIAL_UNITS);
  const [leads, setLeads] = useState<LeadRecord[]>(INITIAL_LEADS);
  const [selectedUnitForVisit, setSelectedUnitForVisit] = useState<PropertyUnit | null>(null);

  // Filter state for inventory
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Visit form state
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitDate, setVisitDate] = useState('2026-10-12');
  const [visitTime, setVisitTime] = useState('11:00 AM');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // New Lead form state
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientUnit, setNewClientUnit] = useState(units[0].code);

  const triggerNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleBookVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorPhone.trim() || !selectedUnitForVisit) return;

    const newLead: LeadRecord = {
      id: `lead-${Date.now()}`,
      leadCode: `LEAD-${Math.floor(100 + Math.random() * 900)}`,
      clientName: visitorName.trim(),
      phone: visitorPhone.trim(),
      interestedUnitCode: selectedUnitForVisit.code,
      budgetRangeNPR: `रू ${(selectedUnitForVisit.priceNPR / 10000000).toFixed(2)} Crore`,
      stage: 'Site Visit Booked',
      siteVisitDate: `${visitDate} at ${visitTime}`,
      agentName: 'Suman Karki',
    };

    setLeads([newLead, ...leads]);
    triggerNotification(`Site visit confirmed for ${visitorName} for unit ${selectedUnitForVisit.code}! Lead added to CRM.`);
    setVisitorName('');
    setVisitorPhone('');
    setSelectedUnitForVisit(null);
    setActiveTab('crm');
  };

  const handleStageAdvance = (leadId: string) => {
    setLeads(
      leads.map((l) => {
        if (l.id === leadId) {
          let nextStage: LeadRecord['stage'] = l.stage;
          if (l.stage === 'New Lead') nextStage = 'Site Visit Booked';
          else if (l.stage === 'Site Visit Booked') nextStage = 'Price Negotiation';
          else if (l.stage === 'Price Negotiation') nextStage = 'Token Closed';
          return { ...l, stage: nextStage };
        }
        return l;
      })
    );
    triggerNotification('Lead stage updated successfully in CRM.');
  };

  const handleUnitStatusToggle = (unitId: string) => {
    setUnits(
      units.map((u) => {
        if (u.id === unitId) {
          const nextStatus = u.status === 'Available' ? 'Token Locked' : u.status === 'Token Locked' ? 'Sold' : 'Available';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    triggerNotification('Unit inventory status updated.');
  };

  const filteredUnits = typeFilter === 'All' ? units : units.filter((u) => u.propertyType === typeFilter);

  const totalPipelineSum = leads.length * 35000000;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notificationMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3 rounded-lg shadow-xl border border-neutral-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-medium">{notificationMsg}</p>
        </div>
      )}

      {/* Brand Header & View Switcher */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-900 text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">Himalaya Heights Developments</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  Real Estate CRM Sandbox
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Unit inventory management, buyer site visit scheduler, and multi-stage deal pipeline.
              </p>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'inventory' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Property Units ({units.length})
            </button>
            <button
              onClick={() => setActiveTab('crm')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'crm' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Lead Pipeline ({leads.length})
            </button>
            <button
              onClick={() => {
                setSelectedUnitForVisit(units[0]);
                setActiveTab('bookVisit');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'bookVisit' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Book Site Visit
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: PROPERTY INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-neutral-200 rounded-xl">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-semibold text-neutral-700">Filter Property Type:</span>
              <div className="flex flex-wrap gap-1.5">
                {['All', '2BHK Apartment', '3BHK Penthouse', 'Luxury Villa', 'Commercial Office'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                      typeFilter === t ? 'bg-neutral-900 text-white font-medium' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-neutral-500">
              Showing <span className="font-semibold text-neutral-900">{filteredUnits.length}</span> units
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUnits.map((unit) => (
              <div key={unit.id} className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-all space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded">
                        {unit.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          unit.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : unit.status === 'Token Locked'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                        }`}
                      >
                        {unit.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-900">{unit.title}</h3>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      {unit.location} · {unit.floor}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-neutral-500">Listed Price</div>
                    <div className="text-lg font-bold text-neutral-900">
                      रू {(unit.priceNPR / 10000000).toFixed(2)} Cr
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      (NPR {unit.priceNPR.toLocaleString()})
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-neutral-100 text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Super Built-up</span>
                    <span className="font-semibold text-neutral-800">{unit.areaSqFt} Sq. Ft</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Dedicated Parking</span>
                    <span className="font-semibold text-neutral-800">{unit.parkingSpots} Bay(s)</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Facing View</span>
                    <span className="font-semibold text-neutral-800 truncate block">{unit.balconyOrientation}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    onClick={() => handleUnitStatusToggle(unit.id)}
                    className="text-xs text-neutral-500 hover:text-neutral-900 underline transition-colors"
                  >
                    Change Status
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedUnitForVisit(unit);
                        setActiveTab('bookVisit');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded-md transition-colors inline-flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Inspection</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: CRM DEAL PIPELINE */}
      {activeTab === 'crm' && (
        <div className="space-y-5">
          {/* Top Pipeline Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <span className="text-xs text-neutral-500">Active Inquiries</span>
              <div className="text-2xl font-bold text-neutral-900 mt-1">{leads.length}</div>
              <span className="text-[11px] text-emerald-600 font-medium">Digital Ads & Referrals</span>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <span className="text-xs text-neutral-500">Site Visits Booked</span>
              <div className="text-2xl font-bold text-sky-700 mt-1">
                {leads.filter((l) => l.stage === 'Site Visit Booked').length}
              </div>
              <span className="text-[11px] text-neutral-400">Scheduled on calendar</span>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <span className="text-xs text-neutral-500">In Negotiation</span>
              <div className="text-2xl font-bold text-amber-700 mt-1">
                {leads.filter((l) => l.stage === 'Price Negotiation').length}
              </div>
              <span className="text-[11px] text-neutral-400">Draft contract pending</span>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <span className="text-xs text-neutral-500">Deals Closed (Tokens)</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">
                {leads.filter((l) => l.stage === 'Token Closed').length}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Earnest deposit secured</span>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Commercial Sales Pipeline</h3>
                <p className="text-xs text-neutral-500">
                  Track buyer qualification, scheduled walkthroughs, and token deposit closures.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4 font-medium">Lead Ref</th>
                    <th className="py-3 px-4 font-medium">Client Details</th>
                    <th className="py-3 px-4 font-medium">Interested Unit</th>
                    <th className="py-3 px-4 font-medium">Budget Est.</th>
                    <th className="py-3 px-4 font-medium">Current Deal Stage</th>
                    <th className="py-3 px-4 font-medium">Assigned Agent</th>
                    <th className="py-3 px-4 font-medium text-right">Quick Pipeline Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4 font-mono font-semibold text-neutral-700">{lead.leadCode}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900">{lead.clientName}</div>
                        <div className="text-[11px] text-neutral-500">{lead.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-medium text-sky-800">{lead.interestedUnitCode}</span>
                        {lead.siteVisitDate && (
                          <div className="text-[10px] text-neutral-400">{lead.siteVisitDate}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-neutral-800">{lead.budgetRangeNPR}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            lead.stage === 'Token Closed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : lead.stage === 'Price Negotiation'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : lead.stage === 'Site Visit Booked'
                              ? 'bg-sky-50 text-sky-700 border-sky-200'
                              : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                          }`}
                        >
                          {lead.stage}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">{lead.agentName}</td>
                      <td className="py-3 px-4 text-right">
                        {lead.stage !== 'Token Closed' ? (
                          <button
                            onClick={() => handleStageAdvance(lead.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded transition-colors inline-flex items-center gap-1"
                          >
                            <span>Advance Stage</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Deposit Secured</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: BOOK SITE VISIT FORM */}
      {activeTab === 'bookVisit' && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 max-w-2xl mx-auto shadow-xs space-y-5">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-base font-bold text-neutral-900">Schedule In-Person Site Inspection</h3>
            <p className="text-xs text-neutral-500">
              Provide prospective buyer contact info and preferred walkthrough slot.
            </p>
          </div>

          <form onSubmit={handleBookVisitSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Select Property Unit
              </label>
              <select
                value={selectedUnitForVisit?.code || units[0].code}
                onChange={(e) => {
                  const target = units.find((u) => u.code === e.target.value);
                  if (target) setSelectedUnitForVisit(target);
                }}
                className="w-full text-xs border border-neutral-300 rounded-md p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
              >
                {units.map((u) => (
                  <option key={u.id} value={u.code}>
                    {u.code} — {u.title} (रू {(u.priceNPR / 10000000).toFixed(2)} Cr)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Buyer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Shakya"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full text-xs border border-neutral-300 rounded-md p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Mobile Contact</label>
                <input
                  type="tel"
                  required
                  placeholder="+977 98XXXXXXXX"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="w-full text-xs border border-neutral-300 rounded-md p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Inspection Date</label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full text-xs border border-neutral-300 rounded-md p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Preferred Time Window</label>
                <select
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  className="w-full text-xs border border-neutral-300 rounded-md p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                >
                  <option value="10:00 AM">10:00 AM Morning</option>
                  <option value="11:30 AM">11:30 AM Morning</option>
                  <option value="02:00 PM">02:00 PM Afternoon</option>
                  <option value="04:30 PM">04:30 PM Sunset Walkthrough</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg text-xs text-neutral-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Site visit bookings automatically dispatch SMS calendar invitations to both the buyer and the designated site sales manager.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('inventory')}
                className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded-md transition-colors"
              >
                Confirm Site Walkthrough
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
