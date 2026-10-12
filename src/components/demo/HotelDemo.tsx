import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BedDouble,
  Calendar,
  CheckCircle2,
  Sparkles,
  LayoutDashboard,
  RotateCcw,
  Users,
  Compass,
  Phone,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Currency } from '../common/Currency';

interface RoomType {
  id: string;
  name: string;
  bed: string;
  pricePerNightNPR: number;
  view: string;
  maxGuests: number;
}

interface HotelReservation {
  id: string;
  resCode: string;
  guestName: string;
  phone: string;
  roomName: string;
  nights: number;
  checkInDate: string;
  checkOutDate: string;
  totalNPR: number;
  airportPickup: boolean;
  status: 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled';
}

const ROOMS: RoomType[] = [
  {
    id: 'room-deluxe',
    name: 'Deluxe Himalayan Mountain Suite',
    bed: '1 King Bed + Balcony',
    pricePerNightNPR: 6500,
    view: 'Panoramic Langtang & Annapurna Range',
    maxGuests: 2,
  },
  {
    id: 'room-villa',
    name: 'Heritage Pine Wood Villa',
    bed: '2 Queen Beds + Fireplace',
    pricePerNightNPR: 9500,
    view: 'Private Forest & Sunrise Mountain Deck',
    maxGuests: 4,
  },
  {
    id: 'room-cottage',
    name: 'Cozy Stone Garden Cottage',
    bed: '1 Queen Bed',
    pricePerNightNPR: 4200,
    view: 'Organic Apple Orchard & Garden',
    maxGuests: 2,
  },
];

const INITIAL_RESERVATIONS: HotelReservation[] = [
  {
    id: 'res-1',
    resCode: 'HH-RES-401',
    guestName: 'Marcus & Elena Vance',
    phone: '+44 7911 123456',
    roomName: 'Deluxe Himalayan Mountain Suite',
    nights: 3,
    checkInDate: '2026-10-09',
    checkOutDate: '2026-10-12',
    totalNPR: 22500,
    airportPickup: true,
    status: 'Checked In',
  },
  {
    id: 'res-2',
    resCode: 'HH-RES-402',
    guestName: 'Anupama & Suman Karki',
    phone: '+977 9841882299',
    roomName: 'Heritage Pine Wood Villa',
    nights: 2,
    checkInDate: '2026-10-10',
    checkOutDate: '2026-10-12',
    totalNPR: 19000,
    airportPickup: false,
    status: 'Confirmed',
  },
  {
    id: 'res-3',
    resCode: 'HH-RES-403',
    guestName: 'Dr. Hiroshi Tanaka',
    phone: '+81 90 1234 5678',
    roomName: 'Cozy Stone Garden Cottage',
    nights: 4,
    checkInDate: '2026-10-08',
    checkOutDate: '2026-10-12',
    totalNPR: 16800,
    airportPickup: false,
    status: 'Checked In',
  },
];

export const HotelDemo: React.FC = () => {
  const [viewMode, setViewMode] = useState<'guest' | 'frontdesk'>('guest');
  const [reservations, setReservations] = useState<HotelReservation[]>(() => {
    const raw = localStorage.getItem('buildwise_hotel_demo_v1');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return INITIAL_RESERVATIONS;
      }
    }
    return INITIAL_RESERVATIONS;
  });

  // Guest booking form
  const [selectedRoomId, setSelectedRoomId] = useState(ROOMS[0].id);
  const [nights, setNights] = useState(2);
  const [airportPickup, setAirportPickup] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [confirmedRes, setConfirmedRes] = useState<HotelReservation | null>(null);

  const selectedRoom = ROOMS.find((r) => r.id === selectedRoomId) || ROOMS[0];
  const roomCost = selectedRoom.pricePerNightNPR * nights;
  const pickupCost = airportPickup ? 3000 : 0;
  const totalCost = roomCost + pickupCost;

  const handleBookDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim()) {
      alert('Please fill in guest name and contact number.');
      return;
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newRes: HotelReservation = {
      id: `res-${Date.now()}`,
      resCode: `HH-RES-${randomSuffix}`,
      guestName,
      phone: guestPhone,
      roomName: selectedRoom.name,
      nights,
      checkInDate: '2026-10-12',
      checkOutDate: '2026-10-14',
      totalNPR: totalCost,
      airportPickup,
      status: 'Confirmed',
    };

    const updated = [newRes, ...reservations];
    setReservations(updated);
    localStorage.setItem('buildwise_hotel_demo_v1', JSON.stringify(updated));
    setConfirmedRes(newRes);
  };

  const handleStatusChange = (id: string, status: HotelReservation['status']) => {
    const updated = reservations.map((r) => (r.id === id ? { ...r, status } : r));
    setReservations(updated);
    localStorage.setItem('buildwise_hotel_demo_v1', JSON.stringify(updated));
  };

  const handleReset = () => {
    if (confirm('Reset hotel room reservations to initial sample state?')) {
      setReservations(INITIAL_RESERVATIONS);
      localStorage.setItem('buildwise_hotel_demo_v1', JSON.stringify(INITIAL_RESERVATIONS));
      setConfirmedRes(null);
    }
  };

  const totalRevenue = reservations.reduce((sum, r) => sum + r.totalNPR, 0);
  const otaCommissionSaved = Math.round(totalRevenue * 0.20); // 20% OTA fee eliminated

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-neutral-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900 text-sm">The Himalayan Haven Resort</span>
            <span className="text-neutral-300" aria-hidden="true">·</span>
            <span className="text-xs text-neutral-500">Nagarkot, Nepal</span>
          </div>
          <p className="text-xs text-neutral-500">
            Interactive demo: zero-commission direct guest bookings & front-desk room status management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-neutral-100 rounded-lg border border-neutral-200">
            <button
              onClick={() => setViewMode('guest')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                viewMode === 'guest'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <BedDouble className="w-3.5 h-3.5" />
              Direct Guest Booking
            </button>
            <button
              onClick={() => setViewMode('frontdesk')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                viewMode === 'frontdesk'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Front Desk Room Rack
            </button>
          </div>

          <button
            onClick={handleReset}
            title="Reset sample reservations"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* GUEST DIRECT BOOKING VIEW */}
      {viewMode === 'guest' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  Direct Guest Rate Guarantee
                </span>
                <span className="text-xs text-neutral-500">Best Price Guaranteed</span>
              </div>
              <h2 className="text-xl font-bold text-neutral-900">
                The Himalayan Haven Resort & Spa
              </h2>
              <p className="text-xs text-neutral-500">
                Ridge Point, Nagarkot · 360° Himalayan Sunrises · Free Organic Breakfast Included
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-neutral-600">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Commission Booking</span>
              </div>
            </div>
          </div>

          {confirmedRes ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-8 max-w-2xl mx-auto text-center space-y-6">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                  Room Reserved Directly!
                </span>
                <h3 className="text-2xl font-bold text-neutral-950 mt-2">
                  Welcome to The Himalayan Haven, {confirmedRes.guestName}!
                </h3>
                <p className="text-xs text-neutral-500">
                  Confirmation receipt simulated for {confirmedRes.phone}. Your mountain suite is locked.
                </p>
              </div>

              <div className="bg-neutral-50 rounded-lg p-5 border border-neutral-200 text-left space-y-3 text-xs">
                <div className="flex justify-between pb-3 border-b border-neutral-200">
                  <span className="text-neutral-500">Reservation Reference:</span>
                  <span className="font-mono font-bold text-neutral-900 text-sm">{confirmedRes.resCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Reserved Suite:</span>
                  <span className="font-semibold text-neutral-900">{confirmedRes.roomName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Duration:</span>
                  <span className="font-semibold text-neutral-900">{confirmedRes.nights} Nights</span>
                </div>
                {confirmedRes.airportPickup && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Airport Transfer:</span>
                    <span className="font-semibold text-neutral-900">Kathmandu Airport 4x4 Jeep</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-bold text-neutral-950">
                  <span>Grand Total:</span>
                  <Currency amount={confirmedRes.totalNPR} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setConfirmedRes(null);
                    setGuestName('');
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md"
                >
                  Book Another Stay
                </button>
                <button
                  onClick={() => setViewMode('frontdesk')}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md inline-flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>View in Front Desk Room Rack →</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookDirect} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Rooms Selection */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span className="font-mono text-neutral-400">01.</span>
                    Select Guest Room / Suite
                  </h3>

                  <div className="space-y-3">
                    {ROOMS.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                          selectedRoomId === room.id
                            ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-neutral-950 block">{room.name}</span>
                          <p className="text-[11px] text-neutral-500">{room.bed} · {room.view}</p>
                          <span className="text-[11px] text-emerald-700 block">Up to {room.maxGuests} Guests</span>
                        </div>
                        <div className="text-right shrink-0">
                          <Currency amount={room.pricePerNightNPR} className="text-sm font-bold text-neutral-950" />
                          <span className="text-[11px] text-neutral-400 block">per night</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stay Parameters */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 text-xs">
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span className="font-mono text-neutral-400">02.</span>
                    Length of Stay & Add-Ons
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-neutral-800 block mb-1">Number of Nights</label>
                      <select
                        value={nights}
                        onChange={(e) => setNights(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-md bg-white font-mono"
                      >
                        {[1, 2, 3, 4, 5, 7, 10].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Night' : 'Nights'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-neutral-800 block mb-1">Add-On Services</label>
                      <label className="flex items-center gap-2 p-2 border border-neutral-200 rounded-md cursor-pointer hover:bg-neutral-50">
                        <input
                          type="checkbox"
                          checked={airportPickup}
                          onChange={(e) => setAirportPickup(e.target.checked)}
                          className="rounded text-neutral-900"
                        />
                        <span>Airport 4x4 Transfer (+NPR 3,000)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Details Checkout */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 text-xs">
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span className="font-mono text-neutral-400">03.</span>
                    Guest Information
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="font-medium text-neutral-700 block mb-1">Lead Guest Full Name *</label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. David Miller"
                        className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-medium text-neutral-700 block mb-1">Mobile / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+977 98XXXXXXXX or +44..."
                        className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-medium text-neutral-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="david@example.com"
                        className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200 space-y-2">
                    <div className="flex justify-between text-neutral-600">
                      <span>{selectedRoom.name}:</span>
                      <Currency amount={roomCost} className="font-semibold text-neutral-900" />
                    </div>
                    {airportPickup && (
                      <div className="flex justify-between text-neutral-600">
                        <span>4x4 Airport Transfer:</span>
                        <Currency amount={3000} className="font-semibold text-neutral-900" />
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-neutral-100 text-sm font-bold text-neutral-950">
                      <span>Total Due at Check-In:</span>
                      <Currency amount={totalCost} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors"
                  >
                    Confirm Direct Reservation
                  </button>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 space-y-2 text-xs text-amber-900">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    Need a direct booking system for your resort?
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Stop paying 20% to Booking.com. Buildwise Solutions deploys direct hotel booking engines starting at NPR 42,000.
                  </p>
                  <Link
                    to="/solutions/hotel-resort-reservation-system/customize"
                    className="inline-flex items-center gap-1 font-semibold text-amber-950 hover:underline pt-1"
                  >
                    <span>Configure resort solution →</span>
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* FRONT DESK ROOM RACK VIEW */}
      {viewMode === 'frontdesk' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Active Bookings</span>
              <p className="text-2xl font-bold font-mono text-neutral-900">{reservations.length}</p>
              <span className="text-[11px] text-neutral-500">Direct booking engine</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Direct Bookings Revenue</span>
              <Currency amount={totalRevenue} className="text-2xl font-bold text-neutral-900 block" />
              <span className="text-[11px] text-neutral-500">Without third-party portal cut</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">OTA Commission Saved (20%)</span>
              <Currency amount={otaCommissionSaved} className="text-2xl font-bold text-emerald-700 block" />
              <span className="text-[11px] text-emerald-800">Retained in hotel revenue</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Room Clean Status</span>
              <p className="text-2xl font-bold font-mono text-neutral-900">8 / 10</p>
              <span className="text-[11px] text-neutral-500">Housekeeping verified</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="p-5 border-b border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-900">Front Desk Guest Ledger</h3>
              <p className="text-xs text-neutral-500">Check-in and check-out dispatch console.</p>
            </div>

            <div className="overflow-x-auto p-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500">
                    <th className="pb-3 font-semibold">Res #</th>
                    <th className="pb-3 font-semibold">Guest</th>
                    <th className="pb-3 font-semibold">Room Suite</th>
                    <th className="pb-3 font-semibold">Dates</th>
                    <th className="pb-3 font-semibold">Nights</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {reservations.map((r) => (
                    <tr key={r.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 font-mono font-bold text-neutral-900">{r.resCode}</td>
                      <td className="py-3">
                        <span className="font-semibold text-neutral-900 block">{r.guestName}</span>
                        <span className="text-[11px] text-neutral-500">{r.phone}</span>
                      </td>
                      <td className="py-3 font-medium text-neutral-800">{r.roomName}</td>
                      <td className="py-3 text-neutral-600">
                        {r.checkInDate} → {r.checkOutDate}
                      </td>
                      <td className="py-3 font-mono">{r.nights}</td>
                      <td className="py-3">
                        <Currency amount={r.totalNPR} className="font-semibold text-neutral-900" />
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                            r.status === 'Checked In'
                              ? 'bg-blue-50 text-blue-800 border-blue-200 font-bold'
                              : r.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {r.status === 'Confirmed' && (
                          <button
                            onClick={() => handleStatusChange(r.id, 'Checked In')}
                            className="px-2.5 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                          >
                            Check-In
                          </button>
                        )}
                        {r.status === 'Checked In' && (
                          <button
                            onClick={() => handleStatusChange(r.id, 'Checked Out')}
                            className="px-2.5 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                          >
                            Check-Out
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
