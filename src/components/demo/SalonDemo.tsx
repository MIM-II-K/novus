import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Phone,
  Sparkles,
  LayoutDashboard,
  RotateCcw,
  Plus,
} from 'lucide-react';
import {
  storageService,
  INITIAL_DEMO_SERVICES,
  INITIAL_DEMO_STAFF,
} from '../../services/storageService';
import { DemoAppointment, DemoService } from '../../types';
import { Currency } from '../common/Currency';

export const SalonDemo: React.FC = () => {
  const [viewMode, setViewMode] = useState<'customer' | 'admin'>('customer');
  const [appointments, setAppointments] = useState<DemoAppointment[]>(() =>
    storageService.getDemoAppointments()
  );

  // Customer booking state
  const [selectedService, setSelectedService] = useState<DemoService>(INITIAL_DEMO_SERVICES[0]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('11:00 AM');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<DemoAppointment | null>(null);

  // Admin state
  const [adminTab, setAdminTab] = useState<'schedule' | 'services' | 'staff'>('schedule');
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinServiceId, setWalkinServiceId] = useState(INITIAL_DEMO_SERVICES[0].id);
  const [walkinStaffId, setWalkinStaffId] = useState(INITIAL_DEMO_STAFF[0].id);
  const [walkinSlot, setWalkinSlot] = useState('02:00 PM');

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

  const timeSlots = [
    '09:30 AM',
    '10:15 AM',
    '11:00 AM',
    '12:00 PM',
    '01:30 PM',
    '02:30 PM',
    '03:45 PM',
    '04:30 PM',
    '05:30 PM',
    '06:15 PM',
  ];

  const isSlotBooked = (slot: string) => {
    return appointments.some(
      (a) => a.date === selectedDate && a.timeSlot === slot && a.status !== 'Cancelled'
    );
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please fill in your name and phone number to complete demo booking.');
      return;
    }

    let staffName = 'Any Available Stylist';
    if (selectedStaffId !== 'any') {
      const stf = INITIAL_DEMO_STAFF.find((s) => s.id === selectedStaffId);
      if (stf) staffName = stf.name;
    } else {
      staffName = INITIAL_DEMO_STAFF[0].name;
    }

    const newApt = storageService.addDemoAppointment({
      customerName,
      customerPhone,
      customerEmail: customerEmail || 'demo.customer@lumniscate.np',
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      staffId: selectedStaffId,
      staffName,
      date: selectedDate,
      timeSlot: selectedSlot,
      totalPriceNPR: selectedService.priceNPR,
      specialNotes,
    });

    setAppointments(storageService.getDemoAppointments());
    setConfirmedBooking(newApt);
  };

  const handleResetDemoData = () => {
    if (confirm('Reset all demo appointments back to default seeded state?')) {
      storageService.resetDemoAppointments();
      setAppointments(storageService.getDemoAppointments());
      setConfirmedBooking(null);
    }
  };

  const handleStatusChange = (id: string, newStatus: DemoAppointment['status']) => {
    storageService.updateDemoAppointmentStatus(id, newStatus);
    setAppointments(storageService.getDemoAppointments());
  };

  const handleCreateWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim()) return;

    const srv = INITIAL_DEMO_SERVICES.find((s) => s.id === walkinServiceId) || INITIAL_DEMO_SERVICES[0];
    const stf = INITIAL_DEMO_STAFF.find((s) => s.id === walkinStaffId) || INITIAL_DEMO_STAFF[0];

    storageService.addDemoAppointment({
      customerName: walkinName,
      customerPhone: walkinPhone || '+977 9800000000',
      customerEmail: 'walkin@velvetstudio.np',
      serviceId: srv.id,
      serviceName: srv.name,
      staffId: stf.id,
      staffName: stf.name,
      date: selectedDate,
      timeSlot: walkinSlot,
      totalPriceNPR: srv.priceNPR,
    });

    setAppointments(storageService.getDemoAppointments());
    setShowWalkinModal(false);
    setWalkinName('');
    setWalkinPhone('');
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const todayRevenue = todayAppointments
    .filter((a) => a.status === 'Completed' || a.status === 'In Progress')
    .reduce((sum, a) => sum + a.totalPriceNPR, 0);

  return (
    <div className="space-y-6">
      {/* View Switcher Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-neutral-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900 text-sm">Velvet Studio (Lalitpur)</span>
            <span className="text-neutral-300" aria-hidden="true">·</span>
            <span className="text-xs text-neutral-500">Salon & Aesthetics Demo Sandbox</span>
          </div>
          <p className="text-xs text-neutral-500">
            Simulate real customer self-service reservations or switch to the operations schedule.
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
              Customer Booking View
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
              Salon Admin View
            </button>
          </div>

          <button
            onClick={handleResetDemoData}
            title="Reset sample appointments"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CUSTOMER VIEW */}
      {viewMode === 'customer' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-950 text-white flex items-center justify-center font-bold text-lg font-mono">
                V
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                  Velvet Studio — Hair & Aesthetic Spa
                </h2>
                <p className="text-xs text-neutral-500">
                  Jhamsikhel, Lalitpur · Open Daily: 10:00 AM – 7:30 PM
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-neutral-600">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>+977 1 5532100</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                <span>Verified Clean & Sanitized</span>
              </div>
            </div>
          </div>

          {confirmedBooking ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-8 max-w-2xl mx-auto text-center space-y-6">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                  Appointment Confirmed!
                </span>
                <h3 className="text-2xl font-bold text-neutral-950 mt-2">
                  We look forward to welcoming you, {confirmedBooking.customerName}!
                </h3>
                <p className="text-xs text-neutral-500">
                  A confirmation SMS & WhatsApp reminder has been simulated for {confirmedBooking.customerPhone}.
                </p>
              </div>

              <div className="bg-neutral-50 rounded-lg p-5 border border-neutral-200 text-left space-y-3 text-xs">
                <div className="flex justify-between pb-3 border-b border-neutral-200">
                  <span className="text-neutral-500">Booking Reference:</span>
                  <span className="font-mono font-bold text-neutral-900 text-sm">
                    {confirmedBooking.bookingRef}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Treatment:</span>
                  <span className="font-semibold text-neutral-900">
                    {confirmedBooking.serviceName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Stylist:</span>
                  <span className="font-semibold text-neutral-900">{confirmedBooking.staffName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Date & Slot:</span>
                  <span className="font-semibold text-neutral-900">
                    {confirmedBooking.date} at {confirmedBooking.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200">
                  <span className="text-neutral-500">Estimated Cost:</span>
                  <Currency amount={confirmedBooking.totalPriceNPR} className="font-bold text-neutral-900 text-sm" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setConfirmedBooking(null);
                    setCustomerName('');
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
                >
                  Book Another Service
                </button>
                <button
                  onClick={() => setViewMode('admin')}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>View in Business Admin View →</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                {/* Services */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                      <span className="font-mono text-neutral-400">01.</span>
                      Select Treatment / Service
                    </h3>
                    <span className="text-xs text-neutral-500">
                      {INITIAL_DEMO_SERVICES.length} Services
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {INITIAL_DEMO_SERVICES.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                          selectedService.id === service.id
                            ? 'border-neutral-900 bg-neutral-50/80 ring-1 ring-neutral-900'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-neutral-900">
                              {service.name}
                            </span>
                            <span className="text-[11px] text-neutral-500 font-mono">
                              ({service.durationMinutes} min)
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 line-clamp-1">{service.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <Currency amount={service.priceNPR} className="text-xs font-bold text-neutral-900" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stylist */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span className="font-mono text-neutral-400">02.</span>
                    Select Stylist or Specialist
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedStaffId('any')}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        selectedStaffId === 'any'
                          ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <span className="text-xs font-semibold text-neutral-900 block">
                        Any Available
                      </span>
                      <span className="text-[11px] text-neutral-500">Fastest booking</span>
                    </button>

                    {INITIAL_DEMO_STAFF.map((staff) => (
                      <button
                        key={staff.id}
                        type="button"
                        onClick={() => setSelectedStaffId(staff.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedStaffId === staff.id
                            ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <span className="text-xs font-semibold text-neutral-900 block truncate">
                          {staff.name}
                        </span>
                        <span className="text-[11px] text-neutral-500 block truncate">
                          ★ {staff.rating} · {staff.role.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Slot */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span className="font-mono text-neutral-400">03.</span>
                    Select Date & Time Slot
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

                  <div className="pt-2">
                    <span className="text-xs text-neutral-500 mb-2 block">
                      Slots for {selectedDate}:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {timeSlots.map((slot) => {
                        const booked = isSlotBooked(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={booked}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 px-1 text-center text-xs font-medium rounded-md border transition-all ${
                              booked
                                ? 'bg-neutral-100 text-neutral-400 border-neutral-100 line-through cursor-not-allowed'
                                : selectedSlot === slot
                                ? 'bg-neutral-900 text-white border-neutral-900'
                                : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Card */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 text-xs">
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span className="font-mono text-neutral-400">04.</span>
                    Guest Contact & Confirmation
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="font-medium text-neutral-700 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Ashmita Shrestha"
                        className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-medium text-neutral-700 block mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+977 98XXXXXXXX"
                          className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="font-medium text-neutral-700 block mb-1">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="ashmita@gmail.com"
                          className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-medium text-neutral-700 block mb-1">
                        Special Preferences or Requests
                      </label>
                      <textarea
                        rows={2}
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        placeholder="e.g. Sensitive scalp, quiet chair preferred"
                        className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200 space-y-2">
                    <div className="flex justify-between text-neutral-600">
                      <span>Service:</span>
                      <span className="font-semibold text-neutral-900">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Time:</span>
                      <span className="font-semibold text-neutral-900">{selectedDate} · {selectedSlot}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-bold text-neutral-950">
                      <span>Total Payable:</span>
                      <Currency amount={selectedService.priceNPR} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors"
                  >
                    Complete Simulated Booking
                  </button>

                  <p className="text-[11px] text-neutral-500 text-center">
                    Simulated mode: No live payment charged, no external SMS sent.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 space-y-2 text-xs text-amber-900">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    Want this customized for your salon?
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    We deploy this complete booking portal with your styling team and custom domain starting at NPR 25,000.
                  </p>
                  <Link
                    to="/solutions/salon-appointment-management/customize"
                    className="inline-flex items-center gap-1 font-semibold text-amber-950 hover:underline pt-1"
                  >
                    <span>Configure your salon package →</span>
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ADMIN VIEW */}
      {viewMode === 'admin' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Today's Appointments</span>
              <p className="text-2xl font-bold font-mono text-neutral-900">
                {todayAppointments.length}
              </p>
              <span className="text-[11px] text-neutral-500">
                {todayAppointments.filter((a) => a.status === 'Completed').length} completed
              </span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Revenue (Today)</span>
              <Currency amount={todayRevenue} className="text-2xl font-bold text-neutral-900 block" />
              <span className="text-[11px] text-neutral-500">From checked-out treatments</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Active Stylists</span>
              <p className="text-2xl font-bold font-mono text-neutral-900">
                {INITIAL_DEMO_STAFF.length}
              </p>
              <span className="text-[11px] text-neutral-500">3 stations staffed</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Service Treatments</span>
              <p className="text-2xl font-bold font-mono text-neutral-900">
                {INITIAL_DEMO_SERVICES.length}
              </p>
              <span className="text-[11px] text-neutral-500">Active catalog items</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 pt-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setAdminTab('schedule')}
                  className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
                    adminTab === 'schedule'
                      ? 'border-neutral-900 text-neutral-900'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Appointments Schedule ({appointments.length})
                </button>
                <button
                  onClick={() => setAdminTab('services')}
                  className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
                    adminTab === 'services'
                      ? 'border-neutral-900 text-neutral-900'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Treatment Catalog
                </button>
                <button
                  onClick={() => setAdminTab('staff')}
                  className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
                    adminTab === 'staff'
                      ? 'border-neutral-900 text-neutral-900'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Stylist Roster
                </button>
              </div>

              <button
                onClick={() => setShowWalkinModal(true)}
                className="mb-2 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Walk-in</span>
              </button>
            </div>

            {adminTab === 'schedule' && (
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500">
                      <th className="pb-3 font-semibold">Ref</th>
                      <th className="pb-3 font-semibold">Client</th>
                      <th className="pb-3 font-semibold">Treatment</th>
                      <th className="pb-3 font-semibold">Stylist</th>
                      <th className="pb-3 font-semibold">Date & Slot</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-neutral-50/50">
                        <td className="py-3 font-mono font-bold text-neutral-900">
                          {apt.bookingRef}
                        </td>
                        <td className="py-3">
                          <p className="font-semibold text-neutral-900">{apt.customerName}</p>
                          <p className="text-[11px] text-neutral-500">{apt.customerPhone}</p>
                        </td>
                        <td className="py-3 font-medium text-neutral-800">{apt.serviceName}</td>
                        <td className="py-3 text-neutral-600">{apt.staffName}</td>
                        <td className="py-3">
                          <span className="font-mono text-neutral-700">{apt.date}</span>
                          <span className="block text-[11px] text-neutral-500">{apt.timeSlot}</span>
                        </td>
                        <td className="py-3">
                          <Currency amount={apt.totalPriceNPR} className="font-semibold text-neutral-900" />
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                              apt.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : apt.status === 'In Progress'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : apt.status === 'Confirmed'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {apt.status === 'Confirmed' && (
                              <button
                                onClick={() => handleStatusChange(apt.id, 'In Progress')}
                                className="px-2 py-1 text-[11px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded border border-blue-200"
                              >
                                Start
                              </button>
                            )}
                            {apt.status === 'In Progress' && (
                              <button
                                onClick={() => handleStatusChange(apt.id, 'Completed')}
                                className="px-2 py-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200"
                              >
                                Finish
                              </button>
                            )}
                            {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                              <button
                                onClick={() => handleStatusChange(apt.id, 'Cancelled')}
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
            )}

            {adminTab === 'services' && (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {INITIAL_DEMO_SERVICES.map((srv) => (
                  <div key={srv.id} className="p-4 rounded-lg border border-neutral-200 flex justify-between items-start text-xs">
                    <div className="space-y-1">
                      <span className="font-bold text-neutral-900 block">{srv.name}</span>
                      <span className="text-neutral-500">
                        {srv.category} · {srv.durationMinutes} mins
                      </span>
                      <p className="text-neutral-600">{srv.description}</p>
                    </div>
                    <Currency amount={srv.priceNPR} className="font-bold text-neutral-900" />
                  </div>
                ))}
              </div>
            )}

            {adminTab === 'staff' && (
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {INITIAL_DEMO_STAFF.map((stf) => (
                  <div key={stf.id} className="p-4 rounded-lg border border-neutral-200 space-y-2 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold">
                        {stf.avatarInitial}
                      </div>
                      <div>
                        <span className="font-bold text-neutral-900 block">{stf.name}</span>
                        <span className="text-neutral-500">{stf.role}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-neutral-100 flex justify-between text-neutral-600">
                      <span>Rating: ★ {stf.rating}</span>
                      <span>Shift: 10am – 6pm</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Walk-in Modal */}
      {showWalkinModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-neutral-900">Add Walk-in Appointment</h3>
            <form onSubmit={handleCreateWalkin} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-neutral-700 block mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  placeholder="e.g. Ramesh Thapa"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-md"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  placeholder="+977 98XXXXXXXX"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-md"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Service</label>
                <select
                  value={walkinServiceId}
                  onChange={(e) => setWalkinServiceId(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-md bg-white"
                >
                  {INITIAL_DEMO_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (NPR {s.priceNPR.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Assigned Stylist</label>
                <select
                  value={walkinStaffId}
                  onChange={(e) => setWalkinStaffId(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-md bg-white"
                >
                  {INITIAL_DEMO_STAFF.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Time Slot</label>
                <input
                  type="text"
                  value={walkinSlot}
                  onChange={(e) => setWalkinSlot(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-md"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowWalkinModal(false)}
                  className="px-3 py-2 font-medium text-neutral-600 hover:bg-neutral-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md"
                >
                  Save Walk-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
