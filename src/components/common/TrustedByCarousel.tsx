import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Trophy,
  Scissors,
  BedDouble,
  Briefcase,
  Stethoscope,
  Utensils,
  Package,
  GraduationCap,
  Dumbbell,
  Wrench,
  Pill,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ExternalLink,
  CheckCircle2,
  MapPin,
  TrendingUp,
  X,
  Sliders,
  Sparkles,
} from 'lucide-react';

export interface ClientPartner {
  id: string;
  name: string;
  category: 'Hospitality' | 'Health & Beauty' | 'Sports & Fitness' | 'Corporate & Legal' | 'Retail & Auto';
  tagline: string;
  location: string;
  solutionSlug: string;
  solutionTitle: string;
  metric: string;
  deploymentTime: string;
  activeSince: string;
  description: string;
  modules: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const PARTNERS: ClientPartner[] = [
  {
    id: 'partner-velvet',
    name: 'Velvet & Co. Beauty Lounge',
    category: 'Health & Beauty',
    tagline: 'Luxury Day Spa & Hair Studio',
    location: 'Jhamsikhel, Lalitpur',
    solutionSlug: 'salon-appointment-management',
    solutionTitle: 'Salon & Beauty Appointment Management',
    metric: '68% No-Show Reduction',
    deploymentTime: '10 calendar days',
    activeSince: 'August 2026',
    description:
      'Replaced handwritten notebooks and WhatsApp chaos with real-time chair availability, automated SMS booking receipts, and staff commission calculations.',
    modules: ['Customer Self-Service Calendar', 'Staff Shift Dispatch', 'Sparrow SMS Hook', 'eSewa QR Deposit'],
    icon: Scissors,
  },
  {
    id: 'partner-valley-sports',
    name: 'Valley Sports Arena',
    category: 'Sports & Fitness',
    tagline: 'Multi-Turf Futsal & Badminton Complex',
    location: 'Baluwatar, Kathmandu',
    solutionSlug: 'futsal-court-booking',
    solutionTitle: 'Futsal Court Booking & Slot Management',
    metric: 'Zero Overbooked Slots',
    deploymentTime: '14 calendar days',
    activeSince: 'July 2026',
    description:
      'Eliminated evening double-booking calls across 3 grounds with an automated slot hold lock, dynamic peak-rate calculations, and attendant tablet checkout.',
    modules: ['Peak vs Off-Peak Engine', 'Real-Time Slot Lock', 'Fonepay Dynamic QR', 'Daily Cash Reconciliation'],
    icon: Trophy,
  },
  {
    id: 'partner-annapurna-lodge',
    name: 'Annapurna Vista Resort & Suites',
    category: 'Hospitality',
    tagline: 'Mountain Eco-Lodge & Boutique Hotel',
    location: 'Lakeside, Pokhara',
    solutionSlug: 'hotel-resort-reservation-system',
    solutionTitle: 'Boutique Hotel & Resort Reservation System',
    metric: 'रू 1,85,000 Saved / Mo in OTAs',
    deploymentTime: '12 calendar days',
    activeSince: 'September 2026',
    description:
      'Shifted 45% of international trekker bookings from 20% foreign commission portals to direct zero-fee reservations with seasonal rate calendars.',
    modules: ['Seasonal Dynamic Tariffs', 'Housekeeping Board', 'Foreign Visa / Domestic QR Gateway', 'Front-Desk Room Rack'],
    icon: BedDouble,
  },
  {
    id: 'partner-malla-legal',
    name: 'Malla & Legal Corporate Advisory',
    category: 'Corporate & Legal',
    tagline: 'Cross-Border Corporate & Tax Law Practice',
    location: 'Babarmahal, Kathmandu',
    solutionSlug: 'professional-service-management',
    solutionTitle: 'Professional Service Management & Client Portal',
    metric: '24+ Billable Hours Recouped',
    deploymentTime: '15 calendar days',
    activeSince: 'August 2026',
    description:
      'Connected senior partner billable timesheets directly to corporate retainer burn calculations and official 13% IRD-compliant VAT invoice generation.',
    modules: ['Associate Timesheet Logger', 'Retainer Burn Alert', '13% VAT Invoice Generator', 'Client Milestone Review'],
    icon: Briefcase,
  },
  {
    id: 'partner-aura-clinic',
    name: 'Aura Polyclinic & Diagnostic Labs',
    category: 'Health & Beauty',
    tagline: 'Multi-Specialty OPD & Dental Center',
    location: 'Maharajgunj, Kathmandu',
    solutionSlug: 'clinic-patient-appointment-portal',
    solutionTitle: 'Clinic & Doctor Appointment Portal',
    metric: '92% Patient Queue Satisfaction',
    deploymentTime: '14 calendar days',
    activeSince: 'June 2026',
    description:
      'Replaced congested reception waiting rooms with SMS patient tokens, specialist doctor shift blocks, and secure prescription records.',
    modules: ['Doctor Chamber Roster', 'Automated Token Queue', 'Digital Prescription Archiving', 'Receptionist Check-in'],
    icon: Stethoscope,
  },
  {
    id: 'partner-himalayan-bistro',
    name: 'The Himalayan Bistro & Bar',
    category: 'Hospitality',
    tagline: 'Fast-Casual Dining & Rooftop Lounge',
    location: 'Thamel, Kathmandu',
    solutionSlug: 'restaurant-qr-kitchen-ops',
    solutionTitle: 'Restaurant Table QR & Kitchen Display System',
    metric: '35% Faster Order Turnaround',
    deploymentTime: '9 calendar days',
    activeSince: 'July 2026',
    description:
      'Equipped 28 dining tables with visual QR ordering routed directly to chef kitchen display tablets, reducing waitstaff trips and billing errors.',
    modules: ['Table QR Digital Menu', 'Kitchen Display System (KDS)', 'Split-Bill Cashier Terminal', 'Inventory Item Lock'],
    icon: Utensils,
  },
  {
    id: 'partner-oak-thread',
    name: 'The Oak & Thread Boutiques',
    category: 'Retail & Auto',
    tagline: 'Multi-Outlet Apparel & Footwear Retail',
    location: 'Jhamsikhel & Durbarmarg',
    solutionSlug: 'inventory-sales-management',
    solutionTitle: 'Retail Inventory & Point of Sale Management',
    metric: 'Zero Stock Discrepancy',
    deploymentTime: '16 calendar days',
    activeSince: 'May 2026',
    description:
      'Replaced manual paper ledgers with high-speed barcode checkout, automated reorder triggers for low-stock sizes, and multi-location transfers.',
    modules: ['Barcode Scanner Hook', 'Low Stock Threshold Warnings', 'Supplier Purchase Orders', 'Daily Gross Margin Ledger'],
    icon: Package,
  },
  {
    id: 'partner-ktm-academy',
    name: 'Kathmandu Academy & Montessori',
    category: 'Corporate & Legal',
    tagline: 'Private K-12 & Early Learning Academy',
    location: 'Baneshwor, Kathmandu',
    solutionSlug: 'school-student-fee-portal',
    solutionTitle: 'School Student Attendance & Fee Billing Portal',
    metric: '98% On-Time Fee Collections',
    deploymentTime: '18 calendar days',
    activeSince: 'June 2026',
    description:
      'Digitized student monthly fee vouchers with 1-click batch challan generation, automated parent SMS reminders, and daily attendance records.',
    modules: ['Batch Challan Generator', 'Parent Sparrow SMS Gateway', 'Defaulter Tracking Table', 'Cash Counter Reconciliation'],
    icon: GraduationCap,
  },
  {
    id: 'partner-apex-fitness',
    name: 'Apex Fitness & Crossfit Studio',
    category: 'Sports & Fitness',
    tagline: 'Premium Health & Strength Gym',
    location: 'Sanepa, Lalitpur',
    solutionSlug: 'gym-membership-access-management',
    solutionTitle: 'Gym & Fitness Center Membership Manager',
    metric: '42% Renewal Rate Uplift',
    deploymentTime: '11 calendar days',
    activeSince: 'July 2026',
    description:
      'Automated 3-day WhatsApp renewal alerts before membership expiration and streamlined personal trainer session logs from a front-desk iPad.',
    modules: ['Member QR Check-in Terminal', 'Automated Renewal Alerts', 'Personal Trainer Commission Log', 'Tier Expiry Engine'],
    icon: Dumbbell,
  },
  {
    id: 'partner-precision-auto',
    name: 'Precision Auto Garage & Detailing',
    category: 'Retail & Auto',
    tagline: 'Multi-Bay 4-Wheeler Workshop',
    location: 'Teku, Kathmandu',
    solutionSlug: 'vehicle-service-workshop-management',
    solutionTitle: 'Vehicle Service & Auto Workshop Management',
    metric: '40 Min Saved per Job Card',
    deploymentTime: '13 calendar days',
    activeSince: 'August 2026',
    description:
      'Streamlined vehicle entry with license plate history lookup, spare parts storeroom deduction, and automated customer SMS ready-for-pickup pings.',
    modules: ['Digital Job Card Intake', 'Spare Parts Storeroom Deduct', 'Mechanic Bay Roster', 'SMS Pickup Trigger'],
    icon: Wrench,
  },
  {
    id: 'partner-aarogya-pharma',
    name: 'Aarogya Lifecare Pharmacy Network',
    category: 'Health & Beauty',
    tagline: 'Retail Dispensaries & Ayurvedic Supplies',
    location: 'Chabahil & Kalanki, Kathmandu',
    solutionSlug: 'pharmacy-expiry-stock-billing',
    solutionTitle: 'Pharmacy Batch Expiry & POS Billing System',
    metric: '100% Zero Expired Stock Waste',
    deploymentTime: '12 calendar days',
    activeSince: 'September 2026',
    description:
      'Prevented expired medicine losses with 60-day visual batch alerts, generic salt substitution search, and Department of Drug Administration compliance.',
    modules: ['Batch Expiry 60-Day Warning', 'Generic Salt Search', 'DDA Schedule H Registry', 'Thermal POS Receipt Bridge'],
    icon: Pill,
  },
  {
    id: 'partner-himalaya-realty',
    name: 'Himalaya Heights Developments',
    category: 'Corporate & Legal',
    tagline: 'Residential Towers & Commercial Plaza',
    location: 'Lazimpat, Kathmandu',
    solutionSlug: 'real-estate-crm-lead-manager',
    solutionTitle: 'Real Estate Developer CRM & Property Portal',
    metric: '85+ Site Visits Managed',
    deploymentTime: '15 calendar days',
    activeSince: 'August 2026',
    description:
      'Eliminated double-token booking conflicts with live apartment unit inventory grids, buyer qualification Kanban stages, and site visit schedules.',
    modules: ['Unit Availability Matrix', 'Lead Qualification Pipeline', 'Site Visit Calendar', 'Token Contract Generator'],
    icon: Building2,
  },
];

const CATEGORIES = [
  'All Sectors',
  'Hospitality',
  'Health & Beauty',
  'Sports & Fitness',
  'Corporate & Legal',
  'Retail & Auto',
] as const;

export const TrustedByCarousel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Sectors');
  const [isPaused, setIsPaused] = useState(false);
  const [activePartnerModal, setActivePartnerModal] = useState<ClientPartner | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredPartners = PARTNERS.filter((partner) => {
    if (selectedCategory === 'All Sectors') return true;
    return partner.category === selectedCategory;
  });

  // Duplicate for seamless infinite marquee loop when not filtered, or use filtered list
  const displayPartners =
    selectedCategory === 'All Sectors'
      ? [...filteredPartners, ...filteredPartners]
      : filteredPartners;

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-white border-b border-neutral-200 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Top Header: Clean Typography & Zero-Pill Design */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              <Building2 className="w-4 h-4 text-neutral-800 shrink-0" />
              <span>Commercial Implementations</span>
              <span aria-hidden="true">·</span>
              <span>Proven Operational Track Record</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
              Trusted by 40+ Industry Leaders Across Nepal
            </h2>
            <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
              From luxury day spas in Jhamsikhel to busy multi-turf futsal grounds and corporate law chambers in Kathmandu, businesses run everyday mission-critical operations on our tailored software.
            </p>
          </div>

          {/* Controls: Segmented Category Selector & Manual Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Scroll Navigation & Pause Toggle */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto bg-neutral-100 p-1 rounded-lg border border-neutral-200">
              <button
                type="button"
                onClick={() => handleManualScroll('left')}
                aria-label="Scroll left"
                className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-white rounded transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                aria-label={isPaused ? 'Resume auto scroll' : 'Pause auto scroll'}
                className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-white rounded transition-colors"
                title={isPaused ? 'Resume auto-scrolling' : 'Pause auto-scrolling'}
              >
                {isPaused ? <Play className="w-4 h-4 fill-neutral-700" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => handleManualScroll('right')}
                aria-label="Scroll right"
                className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-white rounded transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Industry Category Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-[11px] text-neutral-400 pl-2 whitespace-nowrap hidden sm:inline">
            Click any client card for deployment case specs
          </span>
        </div>

        {/* Logo Carousel Marquee Track */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
          {/* Subtle Gradient Fade Edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

          <div
            ref={scrollContainerRef}
            className={`overflow-x-auto scrollbar-none py-3 px-4 sm:px-6 lg:px-8 ${
              selectedCategory === 'All Sectors' && !isPaused ? 'animate-marquee' : 'flex gap-4'
            }`}
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {displayPartners.map((partner, index) => {
              const IconComp = partner.icon;
              return (
                <div
                  key={`${partner.id}-${index}`}
                  onClick={() => setActivePartnerModal(partner)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActivePartnerModal(partner);
                    }
                  }}
                  className="w-[280px] sm:w-[310px] shrink-0 bg-neutral-50/70 hover:bg-white rounded-xl border border-neutral-200/90 hover:border-neutral-400 p-5 transition-all duration-200 shadow-2xs hover:shadow-sm cursor-pointer group text-left flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Brand Mark and Category */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-xs">
                        <IconComp className="w-5 h-5 text-neutral-100" />
                      </div>
                      <span className="text-[11px] text-neutral-500 font-medium">
                        {partner.category}
                      </span>
                    </div>

                    {/* Partner Name & Tagline */}
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-950 transition-colors line-clamp-1">
                        {partner.name}
                      </h3>
                      <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                        {partner.tagline}
                      </p>
                    </div>

                    {/* Operational Impact Metric Highlight */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 bg-white/90 p-2 rounded-md border border-neutral-200/80 group-hover:border-neutral-300">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{partner.metric}</span>
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="pt-3 mt-3 border-t border-neutral-200/70 flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="flex items-center gap-1 truncate max-w-[170px]">
                      <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                      <span className="truncate">{partner.location}</span>
                    </span>
                    <span className="text-neutral-800 font-medium group-hover:underline inline-flex items-center gap-0.5 whitespace-nowrap">
                      Case Specs
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Trust Sub-Strip */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% client data isolation on dedicated servers or self-hosted hardware.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/solutions"
              className="text-neutral-800 font-semibold hover:text-neutral-950 transition-colors inline-flex items-center gap-1"
            >
              <span>Explore All Solution Blueprints</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Partner Production Case Modal */}
      {activePartnerModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActivePartnerModal(null)}
        >
          <div
            className="bg-white rounded-xl border border-neutral-200 shadow-xl max-w-lg w-full p-6 space-y-5 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
                  {React.createElement(activePartnerModal.icon, { className: 'w-6 h-6 text-white' })}
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-950">
                    {activePartnerModal.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                    <span>{activePartnerModal.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      {activePartnerModal.location}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivePartnerModal(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
                aria-label="Close case specs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Implementation Details */}
            <div className="space-y-3 bg-neutral-50 p-4 rounded-lg border border-neutral-200/70 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60">
                <span className="text-neutral-500">Deployed Software System:</span>
                <span className="font-semibold text-neutral-900 text-right">
                  {activePartnerModal.solutionTitle}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60">
                <span className="text-neutral-500">Implementation SLA:</span>
                <span className="font-semibold text-neutral-900">
                  {activePartnerModal.deploymentTime}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60">
                <span className="text-neutral-500">Key Operational Win:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  {activePartnerModal.metric}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Production Since:</span>
                <span className="font-medium text-neutral-700">
                  {activePartnerModal.activeSince}
                </span>
              </div>
            </div>

            {/* Narrative Case Description */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Implementation Summary
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {activePartnerModal.description}
              </p>
            </div>

            {/* Active Modules Configured */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Active Modules & Integrations
              </span>
              <div className="grid grid-cols-2 gap-2">
                {activePartnerModal.modules.map((mod, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 text-xs text-neutral-700 bg-white p-2 rounded border border-neutral-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                    <span className="truncate">{mod}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setActivePartnerModal(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
              >
                Close
              </button>
              <Link
                to={`/solutions/${activePartnerModal.solutionSlug}/demo`}
                onClick={() => setActivePartnerModal(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Test Live Demo Sandbox</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
