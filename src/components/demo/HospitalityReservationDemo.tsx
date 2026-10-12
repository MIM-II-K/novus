import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  MapPin,
  Phone,
  ShieldCheck,
  RotateCcw,
  Plus,
  DollarSign,
  Coffee,
  Building,
} from 'lucide-react';
import { Currency } from '../common/Currency';

interface HospitalityResource {
  id: string;
  name: string;
  category: 'Banquet Ballroom' | 'Luxury Suite' | 'Lakeside Pavilion' | 'Conference Center';
  capacity: string;
  baseRateNPR: number;
  rateType: 'per event session' | 'per night';
  amenities: string[];
}

interface HospitalityBooking {
  id: string;
  bookingCode: string;
  guestName: string;
  phone: string;
  resourceName: string;
  eventDate: string;
  guestCount: number;
  cateringPackage: 'None (Room Only)' | 'Royal Buffet Banquet' | 'Corporate High Tea & Lunch';
  totalNPR: number;
  depositStatus: 'Deposit Secured' | 'Pending Advance' | 'Settled';
}

const RESOURCES: HospitalityResource[] = [
  {
    id: 'res-1',
    name: 'Sagarmatha Grand Banquet Ballroom',
    category: 'Banquet Ballroom',
    capacity: 'Up to 450 Guests',
    baseRateNPR: 85000,
    rateType: 'per event session',
    amenities: ['Central Acoustic Sound System', 'Bridal Suite', 'Valet Parking for 120 Cars', 'Dual Projector Screens'],
  },
  {
    id: 'res-2',
    name: 'Himalayan Panorama Forest Villa',
    category: 'Luxury Suite',
    capacity: '2–4 Guests',
    baseRateNPR: 14500,
    rateType: 'per night',
    amenities: ['Private Heated Jacuzzi', 'Fireplace Deck', 'Butler Service', 'Complimentary High Tea'],
  },
  {
    id: 'res-3',
    name: 'Phewa Lakeside Open Pavilion',
    category: 'Lakeside Pavilion',
    capacity: 'Up to 200 Guests',
    baseRateNPR: 55000,
    rateType: 'per event session',
    amenities: ['Open Garden Lawn', 'Live BBQ Counter Setup', 'Fairy Light Canopy', 'Stage Podium'],
  },
  {
    id: 'res-4',
    name: 'Executive Boardroom & Seminar Hall',
    category: 'Conference Center',
    capacity: 'Up to 60 Delegates',
    baseRateNPR: 35000,
    rateType: 'per event session',
    amenities: ['4K Video Conferencing', 'High-speed Fiber WiFi', 'Podium & Wireless Mics', 'Tea Break Station'],
  },
];

const INITIAL_BOOKINGS: HospitalityBooking[] = [
  {
    id: 'bk-1',
    bookingCode: 'HOSP-2026-901',
    guestName: 'Er. Rajesh & Sneha Koirala (Wedding Reception)',
    phone: '+977 9851022334',
    resourceName: 'Sagarmatha Grand Banquet Ballroom',
    eventDate: 'Nov 14, 2026 (Evening Gala)',
    guestCount: 350,
    cateringPackage: 'Royal Buffet Banquet',
    totalNPR: 585000,
    depositStatus: 'Deposit Secured',
  },
  {
    id: 'bk-2',
    bookingCode: 'HOSP-2026-902',
    guestName: 'Kathmandu Medical Association (Annual Meet)',
    phone: '+977 9841998877',
    resourceName: 'Executive Boardroom & Seminar Hall',
    eventDate: 'Oct 28, 2026 (Full Day)',
    guestCount: 55,
    cateringPackage: 'Corporate High Tea & Lunch',
    totalNPR: 95000,
    depositStatus: 'Deposit Secured',
  },
  {
    id: 'bk-3',
    bookingCode: 'HOSP-2026-903',
    guestName: 'Mr. David Wilson (International Honeymoon Suite)',
    phone: '+44 7911 123456',
    resourceName: 'Himalayan Panorama Forest Villa',
    eventDate: 'Oct 22–25, 2026 (3 Nights)',
    guestCount: 2,
    cateringPackage: 'None (Room Only)',
    totalNPR: 43500,
    depositStatus: 'Pending Advance',
  },
];

export const HospitalityReservationDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'venues' | 'reserve' | 'schedule'>('venues');
  const [bookings, setBookings] = useState<HospitalityBooking[]>(INITIAL_BOOKINGS);
  const [selectedResource, setSelectedResource] = useState<HospitalityResource>(RESOURCES[0]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Reservation form
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [eventDate, setEventDate] = useState('2026-11-20');
  const [guestCount, setGuestCount] = useState('150');
  const [cateringPackage, setCateringPackage] = useState<'None (Room Only)' | 'Royal Buffet Banquet' | 'Corporate High Tea & Lunch'>('Royal Buffet Banquet');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const calculateEstimatedTotal = () => {
    const count = parseInt(guestCount) || 1;
    let cateringRatePerHead = 0;
    if (cateringPackage === 'Royal Buffet Banquet') cateringRatePerHead = 1400;
    if (cateringPackage === 'Corporate High Tea & Lunch') cateringRatePerHead = 950;

    return selectedResource.baseRateNPR + cateringRatePerHead * count;
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim()) return;

    const total = calculateEstimatedTotal();
    const newBooking: HospitalityBooking = {
      id: `bk-${Date.now()}`,
      bookingCode: `HOSP-2026-${Math.floor(100 + Math.random() * 900)}`,
      guestName: guestName.trim(),
      phone: guestPhone.trim(),
      resourceName: selectedResource.name,
      eventDate: eventDate,
      guestCount: parseInt(guestCount) || 50,
      cateringPackage: cateringPackage,
      totalNPR: total,
      depositStatus: 'Deposit Secured',
    };

    setBookings([newBooking, ...bookings]);
    showToast(`Reservation confirmed for ${newBooking.guestName}! Advance deposit recorded.`);
    setGuestName('');
    setGuestPhone('');
    setActiveTab('schedule');
  };

  return (
    <div className="space-y-6">
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
            <div className="w-10 h-10 rounded-lg bg-amber-800 text-white flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">The Himalayan Grand Resort & Banquet</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Hospitality Reservation Sandbox
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Banquet halls, luxury chalets, catering packages, and front-desk event scheduling.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('venues')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'venues' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Venues & Suites ({RESOURCES.length})
            </button>
            <button
              onClick={() => setActiveTab('reserve')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'reserve' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Book Venue / Banquet
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'schedule' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Event Roster ({bookings.length})
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: VENUES & RESORT RESOURCES */}
      {activeTab === 'venues' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RESOURCES.map((res) => (
            <div key={res.id} className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-all space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {res.category}
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 mt-1.5">{res.name}</h3>
                  <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Capacity: {res.capacity}</span>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-base font-bold text-neutral-900">
                    रू {res.baseRateNPR.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">{res.rateType}</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                <span className="text-[11px] font-semibold text-neutral-700">Included Amenities & Hardware:</span>
                <div className="grid grid-cols-2 gap-1.5 text-xs text-neutral-600">
                  {res.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedResource(res);
                    setActiveTab('reserve');
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reserve This Venue</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: RESERVATION BOOKING ENGINE */}
      {activeTab === 'reserve' && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 max-w-2xl mx-auto shadow-xs space-y-5">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-base font-bold text-neutral-900">Banquet & Resort Booking Form</h3>
            <p className="text-xs text-neutral-500">
              Configure guest count, dates, and catering package to generate instant quote and lock dates.
            </p>
          </div>

          <form onSubmit={handleCreateReservation} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Target Venue / Suite</label>
              <select
                value={selectedResource.id}
                onChange={(e) => {
                  const target = RESOURCES.find((r) => r.id === e.target.value);
                  if (target) setSelectedResource(target);
                }}
                className="w-full text-xs border border-neutral-300 rounded-md p-2.5 focus:ring-1 focus:ring-neutral-900"
              >
                {RESOURCES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.category} (रू {r.baseRateNPR.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Organizer / Guest Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwor Pandey (Family Wedding)"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full text-xs border border-neutral-300 rounded-md p-2.5 focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+977 98XXXXXXXX"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full text-xs border border-neutral-300 rounded-md p-2.5 focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Event / Check-in Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full text-xs border border-neutral-300 rounded-md p-2.5 focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Expected Guest Count</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full text-xs border border-neutral-300 rounded-md p-2.5 focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Hospitality Catering Package</label>
              <select
                value={cateringPackage}
                onChange={(e) => setCateringPackage(e.target.value as any)}
                className="w-full text-xs border border-neutral-300 rounded-md p-2.5 focus:ring-1 focus:ring-neutral-900"
              >
                <option value="Royal Buffet Banquet">Royal Buffet Banquet (रू 1,400 / Head — Multi-course Gourmet)</option>
                <option value="Corporate High Tea & Lunch">Corporate High Tea & Lunch (रू 950 / Head — Seminar Catering)</option>
                <option value="None (Room Only)">None / Room Only (Beverages à la carte)</option>
              </select>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs space-y-1.5">
              <div className="flex justify-between text-neutral-700">
                <span>Venue Session Fee:</span>
                <span>रू {selectedResource.baseRateNPR.toLocaleString()}</span>
              </div>
              {cateringPackage !== 'None (Room Only)' && (
                <div className="flex justify-between text-neutral-700">
                  <span>Catering ({guestCount} Guests):</span>
                  <span>
                    रू {((parseInt(guestCount) || 0) * (cateringPackage === 'Royal Buffet Banquet' ? 1400 : 950)).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-amber-200">
                <span>Estimated Total NPR:</span>
                <span className="text-base text-amber-900">
                  रू {calculateEstimatedTotal().toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('venues')}
                className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded-md transition-colors"
              >
                Confirm & Dispatch to Roster
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 3: EVENT ROSTER & DISPATCH */}
      {activeTab === 'schedule' && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Hospitality & Banquet Event Calendar</h3>
              <p className="text-xs text-neutral-500">Live roster for hotel front-desk, banquet managers, and kitchen chefs.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4 font-medium">Ref Code</th>
                  <th className="py-3 px-4 font-medium">Organizer Details</th>
                  <th className="py-3 px-4 font-medium">Reserved Resource</th>
                  <th className="py-3 px-4 font-medium">Date & Pax</th>
                  <th className="py-3 px-4 font-medium">Catering Selection</th>
                  <th className="py-3 px-4 font-medium">Total (NPR)</th>
                  <th className="py-3 px-4 font-medium text-right">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4 font-mono font-semibold text-neutral-700">{b.bookingCode}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-900">{b.guestName}</div>
                      <div className="text-[11px] text-neutral-500">{b.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-amber-900">{b.resourceName}</td>
                    <td className="py-3 px-4">
                      <div className="text-neutral-900">{b.eventDate}</div>
                      <div className="text-[11px] text-neutral-500">{b.guestCount} Pax</div>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">{b.cateringPackage}</td>
                    <td className="py-3 px-4 font-bold text-neutral-900">
                      रू {b.totalNPR.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          b.depositStatus === 'Deposit Secured'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {b.depositStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
