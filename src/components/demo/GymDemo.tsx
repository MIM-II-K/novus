import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  CheckCircle2,
  Clock,
  Send,
  Users,
  LayoutDashboard,
  RotateCcw,
  Sparkles,
  Phone,
  AlertTriangle,
  QrCode,
} from 'lucide-react';
import { Currency } from '../common/Currency';

interface GymMember {
  id: string;
  memberNo: string;
  name: string;
  phone: string;
  plan: string;
  daysRemaining: number;
  lockerNo: string;
  lastCheckIn: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

const INITIAL_MEMBERS: GymMember[] = [
  {
    id: 'mem-1',
    memberNo: 'ATH-204',
    name: 'Saurav Gurung',
    phone: '+977 9841002233',
    plan: '3-Month Unlimited + Sauna',
    daysRemaining: 19,
    lockerNo: 'Locker 24',
    lastCheckIn: 'Today at 6:15 AM',
    status: 'Active',
  },
  {
    id: 'mem-2',
    memberNo: 'ATH-205',
    name: 'Pooja Shakya',
    phone: '+977 9851123400',
    plan: '1-Month Morning Cardio Pass',
    daysRemaining: 2,
    lockerNo: 'Locker 12',
    lastCheckIn: 'Yesterday at 7:30 AM',
    status: 'Expiring Soon',
  },
  {
    id: 'mem-3',
    memberNo: 'ATH-206',
    name: 'Dipesh Shrestha',
    phone: '+977 9801998877',
    plan: 'Annual Elite Fitness VIP',
    daysRemaining: 214,
    lockerNo: 'VIP Locker 02',
    lastCheckIn: 'Today at 7:00 AM',
    status: 'Active',
  },
];

export const GymDemo: React.FC = () => {
  const [viewMode, setViewMode] = useState<'kiosk' | 'manager'>('kiosk');
  const [members, setMembers] = useState<GymMember[]>(() => {
    const raw = localStorage.getItem('buildwise_gym_demo_v1');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return INITIAL_MEMBERS;
      }
    }
    return INITIAL_MEMBERS;
  });

  const [inputPhone, setInputPhone] = useState('+977 9841002233');
  const [checkedInNotice, setCheckedInNotice] = useState<GymMember | null>(null);
  const [whatsappSentNotice, setWhatsappSentNotice] = useState<string | null>(null);

  const handleMemberCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const found = members.find((m) => m.phone === inputPhone.trim() || m.memberNo === inputPhone.trim());
    if (found) {
      setCheckedInNotice(found);
      const updated = members.map((m) =>
        m.id === found.id ? { ...m, lastCheckIn: 'Just now' } : m
      );
      setMembers(updated);
      localStorage.setItem('buildwise_gym_demo_v1', JSON.stringify(updated));
    } else {
      alert('Member not found. Please verify phone number or member ID.');
    }
  };

  const handleSendWhatsappRenewal = (member: GymMember) => {
    setWhatsappSentNotice(`WhatsApp renewal link simulated for ${member.name} (${member.phone})`);
    setTimeout(() => setWhatsappSentNotice(null), 3500);
  };

  const handleReset = () => {
    if (confirm('Reset gym member records?')) {
      setMembers(INITIAL_MEMBERS);
      localStorage.setItem('buildwise_gym_demo_v1', JSON.stringify(INITIAL_MEMBERS));
      setCheckedInNotice(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-neutral-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900 text-sm">Athletika Fitness Hub</span>
            <span className="text-neutral-300" aria-hidden="true">·</span>
            <span className="text-xs text-neutral-500">Gym Membership & Access Demo</span>
          </div>
          <p className="text-xs text-neutral-500">
            Interactive demo: turnstile check-in terminal, automated WhatsApp renewal alerts, and attendance ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-neutral-100 rounded-lg border border-neutral-200">
            <button
              onClick={() => setViewMode('kiosk')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                viewMode === 'kiosk'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              Member Check-In Kiosk
            </button>
            <button
              onClick={() => setViewMode('manager')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                viewMode === 'manager'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Gym Desk Console
            </button>
          </div>

          <button
            onClick={handleReset}
            title="Reset sample gym data"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {whatsappSentNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
          <Send className="w-3.5 h-3.5" />
          <span>{whatsappSentNotice}</span>
        </div>
      )}

      {/* MEMBER CHECK-IN KIOSK VIEW */}
      {viewMode === 'kiosk' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-neutral-500 uppercase">Self Check-In Station</span>
              <h2 className="text-lg font-bold text-neutral-900 mt-0.5">
                Athletika Fitness — Turnstile Entry
              </h2>
              <p className="text-xs text-neutral-500">
                Enter your mobile number or member code to validate entry.
              </p>
            </div>
            <Dumbbell className="w-8 h-8 text-neutral-400 stroke-[1.5]" />
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-8 space-y-6 shadow-xs">
            <form onSubmit={handleMemberCheckIn} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-800 block mb-1">
                  Mobile Number or Member ID
                </label>
                <input
                  type="text"
                  required
                  value={inputPhone}
                  onChange={(e) => setInputPhone(e.target.value)}
                  placeholder="e.g. +977 9841002233 or ATH-204"
                  className="w-full px-3 py-2.5 border border-neutral-200 rounded-md font-mono text-sm focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors text-xs"
              >
                Scan & Check In
              </button>
            </form>

            {checkedInNotice && (
              <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Access Granted — Welcome, {checkedInNotice.name}!</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-neutral-700 pt-1">
                  <div>
                    <span className="text-neutral-500 block">Plan:</span>
                    <span className="font-semibold">{checkedInNotice.plan}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Assigned Locker:</span>
                    <span className="font-mono font-bold text-neutral-900">{checkedInNotice.lockerNo}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Validity Remaining:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {checkedInNotice.daysRemaining} days left
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Timestamp:</span>
                    <span className="font-mono">{checkedInNotice.lastCheckIn}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GYM MANAGER VIEW */}
      {viewMode === 'manager' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Active Gym Members</span>
              <p className="text-2xl font-bold font-mono text-neutral-900">{members.length}</p>
              <span className="text-[11px] text-neutral-500">Registered passes</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Expiring in &lt; 5 Days</span>
              <p className="text-2xl font-bold font-mono text-amber-700">
                {members.filter((m) => m.daysRemaining <= 5).length}
              </p>
              <span className="text-[11px] text-neutral-500">Auto-reminder ready</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Today's Footfall</span>
              <p className="text-2xl font-bold font-mono text-neutral-900">42 check-ins</p>
              <span className="text-[11px] text-neutral-500">Peak hours 6am–9am</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Turnstile Device</span>
              <p className="text-2xl font-bold font-mono text-emerald-700">Online</p>
              <span className="text-[11px] text-neutral-500">RFID scanner linked</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="p-5 border-b border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-900">Member Directory & Subscription Monitor</h3>
              <p className="text-xs text-neutral-500">Trigger WhatsApp renewal pings for expiring memberships.</p>
            </div>

            <div className="overflow-x-auto p-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500">
                    <th className="pb-3 font-semibold">Member #</th>
                    <th className="pb-3 font-semibold">Name & Mobile</th>
                    <th className="pb-3 font-semibold">Plan</th>
                    <th className="pb-3 font-semibold">Days Left</th>
                    <th className="pb-3 font-semibold">Locker</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 font-mono font-bold text-neutral-900">{m.memberNo}</td>
                      <td className="py-3">
                        <span className="font-semibold text-neutral-900 block">{m.name}</span>
                        <span className="text-[11px] text-neutral-500">{m.phone}</span>
                      </td>
                      <td className="py-3 text-neutral-700">{m.plan}</td>
                      <td className="py-3 font-mono font-bold">{m.daysRemaining} days</td>
                      <td className="py-3 font-mono text-neutral-600">{m.lockerNo}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                            m.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {m.daysRemaining <= 5 && (
                          <button
                            onClick={() => handleSendWhatsappRenewal(m)}
                            className="px-2.5 py-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 inline-flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>WhatsApp Renewal</span>
                          </button>
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
    </div>
  );
};
