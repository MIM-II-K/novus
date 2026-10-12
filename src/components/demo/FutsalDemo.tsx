import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Shield,
  CheckCircle2,
  Users,
  Trophy,
  LayoutDashboard,
  RotateCcw,
  Plus,
  Sparkles,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { Currency } from '../common/Currency';

interface FutsalMatch {
  id: string;
  matchCode: string;
  court: 'Court 1 (5A-Side)' | 'Court 2 (7A-Side)';
  teamName: string;
  captainName: string;
  phone: string;
  date: string;
  slot: string; // e.g. "06:00 PM - 07:00 PM"
  isPeak: boolean;
  rentalBibs: boolean;
  rentalBall: boolean;
  totalNPR: number;
  depositPaidNPR: number;
  status: 'Confirmed' | 'In Play' | 'Completed' | 'Cancelled';
}

const COURTS = [
  {
    id: 'court-1',
    name: 'Court 1 (5A-Side)',
    turf: 'FIFA Pro 50mm Synthetic Turf',
    offPeakNPR: 1400,
    peakNPR: 1800,
  },
  {
    id: 'court-2',
    name: 'Court 2 (7A-Side)',
    turf: 'Floodlit Premium Arena Turf',
    offPeakNPR: 2000,
    peakNPR: 2500,
  },
];

const TIME_SLOTS = [
  { time: '06:00 AM - 07:00 AM', isPeak: false },
  { time: '07:00 AM - 08:00 AM', isPeak: false },
  { time: '08:00 AM - 09:00 AM', isPeak: false },
  { time: '11:00 AM - 12:00 PM', isPeak: false },
  { time: '02:00 PM - 03:00 PM', isPeak: false },
  { time: '04:00 PM - 05:00 PM', isPeak: true },
  { time: '05:00 PM - 06:00 PM', isPeak: true },
  { time: '06:00 PM - 07:00 PM', isPeak: true },
  { time: '07:00 PM - 08:00 PM', isPeak: true },
  { time: '08:00 PM - 09:00 PM', isPeak: true },
  { time: '09:00 PM - 10:00 PM', isPeak: true },
];

const INITIAL_MATCHES: FutsalMatch[] = [
  {
    id: 'm-1',
    matchCode: 'KTM-FUT-801',
    court: 'Court 1 (5A-Side)',
    teamName: 'Boudha United FC',
    captainName: 'Tenzing Lama',
    phone: '+977 9841998877',
    date: new Date().toISOString().split('T')[0],
    slot: '05:00 PM - 06:00 PM',
    isPeak: true,
    rentalBibs: true,
    rentalBall: false,
    totalNPR: 2000,
    depositPaidNPR: 500,
    status: 'Completed',
  },
  {
    id: 'm-2',
    matchCode: 'KTM-FUT-802',
    court: 'Court 1 (5A-Side)',
    teamName: 'Patan Warriors',
    captainName: 'Sagar Maharjan',
    phone: '+977 9851029384',
    date: new Date().toISOString().split('T')[0],
    slot: '06:00 PM - 07:00 PM',
    isPeak: true,
    rentalBibs: false,
    rentalBall: true,
    totalNPR: 1900,
    depositPaidNPR: 500,
    status: 'In Play',
  },
  {
    id: 'm-3',
    matchCode: 'KTM-FUT-803',
    court: 'Court 2 (7A-Side)',
    teamName: 'Jhamsikhel Veterans',
    captainName: 'Prabin Thapa',
    phone: '+977 9801239988',
    date: new Date().toISOString().split('T')[0],
    slot: '07:00 PM - 08:00 PM',
    isPeak: true,
    rentalBibs: true,
    rentalBall: true,
    totalNPR: 2800,
    depositPaidNPR: 500,
    status: 'Confirmed',
  },
];

export const FutsalDemo: React.FC = () => {
  const [viewMode, setViewMode] = useState<'customer' | 'admin'>('customer');
  const [matches, setMatches] = useState<FutsalMatch[]>(() => {
    const raw = localStorage.getItem('buildwise_futsal_matches_v1');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return INITIAL_MATCHES;
      }
    }
    return INITIAL_MATCHES;
  });

  // Customer booking state
  const [selectedCourtId, setSelectedCourtId] = useState<string>('court-1');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>('06:00 PM - 07:00 PM');
  const [teamName, setTeamName] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [phone, setPhone] = useState('');
  const [rentalBibs, setRentalBibs] = useState(false);
  const [rentalBall, setRentalBall] = useState(false);
  const [confirmedMatch, setConfirmedMatch] = useState<FutsalMatch | null>(null);

  // Next 7 days
  const nextDays = useMemo(() => {
    const days: Array<{ dateStr: string; label: string; dayName: string }> = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days.push({ dateStr, label, dayName });
    }
    return days;
  }, []);

  const selectedCourt = COURTS.find((c) => c.id === selectedCourtId) || COURTS[0];
  const activeSlotObj = TIME_SLOTS.find((s) => s.time === selectedSlot) || TIME_SLOTS[0];
  const courtPrice = activeSlotObj.isPeak ? selectedCourt.peakNPR : selectedCourt.offPeakNPR;
  const addonsPrice = (rentalBibs ? 200 : 0) + (rentalBall ? 100 : 0);
  const totalCost = courtPrice + addonsPrice;

  const isSlotBooked = (courtName: string, slotTime: string) => {
    return matches.some(
      (m) =>
        m.date === selectedDate &&
        m.court === courtName &&
        m.slot === slotTime &&
        m.status !== 'Cancelled'
    );
  };

  const handleBookMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !captainName.trim() || !phone.trim()) {
      alert('Please fill in team name, captain name, and contact number.');
      return;
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newMatch: FutsalMatch = {
      id: `match-${Date.now()}`,
      matchCode: `KTM-FUT-${randomSuffix}`,
      court: selectedCourt.name as any,
      teamName,
      captainName,
      phone,
      date: selectedDate,
      slot: selectedSlot,
      isPeak: activeSlotObj.isPeak,
      rentalBibs,
      rentalBall,
      totalNPR: totalCost,
      depositPaidNPR: 500,
      status: 'Confirmed',
    };

    const updated = [newMatch, ...matches];
    setMatches(updated);
    localStorage.setItem('buildwise_futsal_matches_v1', JSON.stringify(updated));
    setConfirmedMatch(newMatch);
  };

  const handleStatusChange = (matchId: string, status: FutsalMatch['status']) => {
    const updated = matches.map((m) => (m.id === matchId ? { ...m, status } : m));
    setMatches(updated);
    localStorage.setItem('buildwise_futsal_matches_v1', JSON.stringify(updated));
  };

  const handleReset = () => {
    if (confirm('Reset futsal court bookings to seeded demo state?')) {
      setMatches(INITIAL_MATCHES);
      localStorage.setItem('buildwise_futsal_matches_v1', JSON.stringify(INITIAL_MATCHES));
      setConfirmedMatch(null);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMatches = matches.filter((m) => m.date === todayStr);
  const todayRevenue = todayMatches
    .filter((m) => m.status !== 'Cancelled')
    .reduce((sum, m) => sum + m.totalNPR, 0);

  return (
    <div className="space-y-6">
      {/* Control Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-neutral-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900 text-sm">Kathmandu Sports Arena</span>
            <span className="text-neutral-300" aria-hidden="true">·</span>
            <span className="text-xs text-neutral-500">Futsal Court Booking Demo</span>
          </div>
          <p className="text-xs text-neutral-500">
            Interactive demonstration: dynamic peak pricing, slot lock, and turf manager schedule.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-neutral-100 rounded-lg border border-neutral-200">
            <button
              onClick={() => setViewMode('customer')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                viewMode === 'customer'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Player Booking View
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                viewMode === 'admin'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Turf Admin Console
            </button>
          </div>

          <button
            onClick={handleReset}
            title="Reset sample matches"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CUSTOMER PLAYER VIEW */}
      {viewMode === 'customer' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-lg font-mono">
                ⚽
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                  Kathmandu Sports Arena — Futsal & Turf
                </h2>
                <p className="text-xs text-neutral-500">
                  Ring Road, Chabahil · Open 6:00 AM – 10:00 PM · Floodlit Grounds
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-neutral-600">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tournament Certified Turf</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>+977 1 4820110</span>
              </div>
            </div>
          </div>

          {confirmedMatch ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-8 max-w-2xl mx-auto text-center space-y-6">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                  Match Slot Locked!
                </span>
                <h3 className="text-2xl font-bold text-neutral-950 mt-2">
                  Match Confirmed for {confirmedMatch.teamName}
                </h3>
                <p className="text-xs text-neutral-500">
                  Captain: {confirmedMatch.captainName} · Simulated SMS token sent to {confirmedMatch.phone}.
                </p>
              </div>

              <div className="bg-neutral-50 rounded-lg p-5 border border-neutral-200 text-left space-y-3 text-xs">
                <div className="flex justify-between pb-3 border-b border-neutral-200">
                  <span className="text-neutral-500">Match Reservation Code:</span>
                  <span className="font-mono font-bold text-neutral-900 text-sm">
                    {confirmedMatch.matchCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Pitch:</span>
                  <span className="font-semibold text-neutral-900">{confirmedMatch.court}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Date & Slot:</span>
                  <span className="font-semibold text-neutral-900">
                    {confirmedMatch.date} · {confirmedMatch.slot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Deposit Paid:</span>
                  <Currency amount={confirmedMatch.depositPaidNPR} className="font-semibold text-emerald-700" />
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200">
                  <span className="text-neutral-500">Balance Due at Arena Counter:</span>
                  <Currency amount={confirmedMatch.totalNPR - confirmedMatch.depositPaidNPR} className="font-bold text-neutral-900 text-sm" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setConfirmedMatch(null);
                    setTeamName('');
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
                >
                  Book Another Match
                </button>
                <button
                  onClick={() => setViewMode('admin')}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Inspect in Turf Admin Schedule →</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookMatch} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Court & Slot */}
              <div className="lg:col-span-7 space-y-6">
                {/* Court Choice */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span className="font-mono text-neutral-400">01.</span>
                    Select Pitch / Court
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {COURTS.map((court) => (
                      <div
                        key={court.id}
                        onClick={() => setSelectedCourtId(court.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedCourtId === court.id
                            ? 'border-neutral-900 bg-neutral-50/80 ring-1 ring-neutral-900'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <span className="text-xs font-bold text-neutral-950 block">{court.name}</span>
                        <p className="text-[11px] text-neutral-500 mt-0.5">{court.turf}</p>
                        <div className="pt-3 mt-3 border-t border-neutral-100 flex items-baseline justify-between text-xs">
                          <span className="text-neutral-500">Off-Peak / Peak:</span>
                          <span className="font-mono font-semibold text-neutral-900">
                            NPR {court.offPeakNPR.toLocaleString()} / {court.peakNPR.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date Picker */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span className="font-mono text-neutral-400">02.</span>
                    Select Date
                  </h3>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {nextDays.map((d) => (
                      <button
                        key={d.dateStr}
                        type="button"
                        onClick={() => setSelectedDate(d.dateStr)}
                        className={`px-3 py-2 rounded-lg border text-center shrink-0 transition-all ${
                          selectedDate === d.dateStr
                            ? 'border-neutral-900 bg-neutral-900 text-white'
                            : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold block opacity-75">
                          {d.dayName}
                        </span>
                        <span className="text-xs font-semibold block">{d.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timetable Grid */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                      <span className="font-mono text-neutral-400">03.</span>
                      Available Match Slots
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-neutral-500">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Off-Peak (NPR {selectedCourt.offPeakNPR.toLocaleString()})
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Evening Peak (NPR {selectedCourt.peakNPR.toLocaleString()})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {TIME_SLOTS.map((slotObj) => {
                      const booked = isSlotBooked(selectedCourt.name, slotObj.time);
                      const isSelected = selectedSlot === slotObj.time;

                      return (
                        <button
                          key={slotObj.time}
                          type="button"
                          disabled={booked}
                          onClick={() => setSelectedSlot(slotObj.time)}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            booked
                              ? 'bg-neutral-100 text-neutral-400 border-neutral-100 line-through cursor-not-allowed'
                              : isSelected
                              ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                              : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-800'
                          }`}
                        >
                          <span className="text-xs font-bold block truncate">{slotObj.time}</span>
                          <span
                            className={`text-[10px] font-medium block mt-0.5 ${
                              isSelected
                                ? 'text-neutral-300'
                                : slotObj.isPeak
                                ? 'text-amber-700'
                                : 'text-emerald-700'
                            }`}
                          >
                            {slotObj.isPeak ? '★ Evening Peak' : 'Standard Rate'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Team Details & Deposit */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 text-xs">
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span className="font-mono text-neutral-400">04.</span>
                    Team Details & Equipment
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="font-medium text-neutral-700 block mb-1">
                        Team / Club Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. Thunder Strikers FC"
                        className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-medium text-neutral-700 block mb-1">
                          Team Captain *
                        </label>
                        <input
                          type="text"
                          required
                          value={captainName}
                          onChange={(e) => setCaptainName(e.target.value)}
                          placeholder="e.g. Suman Karki"
                          className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="font-medium text-neutral-700 block mb-1">
                          Captain Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+977 98XXXXXXXX"
                          className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Add-on rentals */}
                    <div className="pt-2 border-t border-neutral-100 space-y-2">
                      <span className="font-semibold text-neutral-800 block">
                        Optional Equipment Rentals:
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rentalBibs}
                          onChange={(e) => setRentalBibs(e.target.checked)}
                          className="rounded text-neutral-900"
                        />
                        <span>10 Match Bibs Set (+NPR 200)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rentalBall}
                          onChange={(e) => setRentalBall(e.target.checked)}
                          className="rounded text-neutral-900"
                        />
                        <span>Tournament Match Ball (+NPR 100)</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200 space-y-2">
                    <div className="flex justify-between text-neutral-600">
                      <span>Court:</span>
                      <span className="font-semibold text-neutral-900">{selectedCourt.name}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Rate:</span>
                      <Currency amount={courtPrice} className="font-semibold text-neutral-900" />
                    </div>
                    {addonsPrice > 0 && (
                      <div className="flex justify-between text-neutral-600">
                        <span>Equipment:</span>
                        <Currency amount={addonsPrice} className="font-semibold text-neutral-900" />
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-neutral-100 text-sm font-bold text-neutral-950">
                      <span>Match Total:</span>
                      <Currency amount={totalCost} />
                    </div>
                    <div className="flex justify-between text-xs text-emerald-800 bg-emerald-50 p-2 rounded">
                      <span>Simulated Advance Deposit Lock:</span>
                      <span className="font-mono font-bold">NPR 500 (Fonepay QR)</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors"
                  >
                    Confirm & Reserve Match Slot
                  </button>
                </div>

                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 space-y-2 text-xs text-emerald-900">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    Need an online futsal reservation system?
                  </p>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Lumniscate configures this high-speed slot reservation platform with Fonepay QR deposit locks starting at NPR 30,000.
                  </p>
                  <Link
                    to="/solutions/futsal-court-booking/customize"
                    className="inline-flex items-center gap-1 font-semibold text-emerald-950 hover:underline pt-1"
                  >
                    <span>Configure your arena system →</span>
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ADMIN CONSOLE VIEW */}
      {viewMode === 'admin' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Today's Matches</span>
              <p className="text-2xl font-bold font-mono text-neutral-900">
                {todayMatches.length}
              </p>
              <span className="text-[11px] text-neutral-500">
                {todayMatches.filter((m) => m.status === 'Completed').length} completed
              </span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Projected Turf Revenue</span>
              <Currency amount={todayRevenue} className="text-2xl font-bold text-neutral-900 block" />
              <span className="text-[11px] text-neutral-500">From today's court bookings</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Active Pitches</span>
              <p className="text-2xl font-bold font-mono text-neutral-900">2 / 2</p>
              <span className="text-[11px] text-neutral-500">All floodlights operational</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Peak Hour Utilization</span>
              <p className="text-2xl font-bold font-mono text-neutral-900">82%</p>
              <span className="text-[11px] text-neutral-500">5:00 PM – 10:00 PM slots</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Pitch Daily Reservation Grid</h3>
                <p className="text-xs text-neutral-500">
                  Live occupancy list across Court 1 and Court 2.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto p-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500">
                    <th className="pb-3 font-semibold">Match Code</th>
                    <th className="pb-3 font-semibold">Pitch</th>
                    <th className="pb-3 font-semibold">Team & Captain</th>
                    <th className="pb-3 font-semibold">Time Slot</th>
                    <th className="pb-3 font-semibold">Addons</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {matches.map((m) => (
                    <tr key={m.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 font-mono font-bold text-neutral-900">{m.matchCode}</td>
                      <td className="py-3 font-medium text-neutral-800">{m.court}</td>
                      <td className="py-3">
                        <p className="font-semibold text-neutral-900">{m.teamName}</p>
                        <p className="text-[11px] text-neutral-500">Capt: {m.captainName} · {m.phone}</p>
                      </td>
                      <td className="py-3">
                        <span className="font-mono text-neutral-700">{m.date}</span>
                        <span className="block text-[11px] text-neutral-500">{m.slot}</span>
                      </td>
                      <td className="py-3 text-[11px] text-neutral-600">
                        {m.rentalBibs ? 'Bibs ' : ''}
                        {m.rentalBall ? 'Ball' : ''}
                        {!m.rentalBibs && !m.rentalBall ? 'None' : ''}
                      </td>
                      <td className="py-3">
                        <Currency amount={m.totalNPR} className="font-semibold text-neutral-900" />
                        <span className="block text-[10px] text-emerald-700">Dep: NPR {m.depositPaidNPR}</span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                            m.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : m.status === 'In Play'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : m.status === 'Confirmed'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {m.status === 'Confirmed' && (
                            <button
                              onClick={() => handleStatusChange(m.id, 'In Play')}
                              className="px-2 py-1 text-[11px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded border border-blue-200"
                            >
                              Kick Off
                            </button>
                          )}
                          {m.status === 'In Play' && (
                            <button
                              onClick={() => handleStatusChange(m.id, 'Completed')}
                              className="px-2 py-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200"
                            >
                              Full Time
                            </button>
                          )}
                          {m.status !== 'Cancelled' && m.status !== 'Completed' && (
                            <button
                              onClick={() => handleStatusChange(m.id, 'Cancelled')}
                              className="px-2 py-1 text-[11px] font-medium text-neutral-600 hover:text-red-700 hover:bg-red-50 rounded"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
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
