import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Scissors,
  Trophy,
  Package,
  Utensils,
  Stethoscope,
  BedDouble,
  GraduationCap,
  Dumbbell,
  Wrench,
  Building2,
  Pill,
  Briefcase,
  UtensilsCrossed,
  ChevronRight,
  Sliders,
  ExternalLink,
  LayoutGrid,
  Search,
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { INITIAL_SOLUTIONS } from '../config/solutionsData';
import { Currency } from '../components/common/Currency';
import { SalonDemo } from '../components/demo/SalonDemo';
import { FutsalDemo } from '../components/demo/FutsalDemo';
import { InventoryDemo } from '../components/demo/InventoryDemo';
import { RestaurantDemo } from '../components/demo/RestaurantDemo';
import { ClinicDemo } from '../components/demo/ClinicDemo';
import { HotelDemo } from '../components/demo/HotelDemo';
import { SchoolDemo } from '../components/demo/SchoolDemo';
import { GymDemo } from '../components/demo/GymDemo';
import { AutoDemo } from '../components/demo/AutoDemo';
import { RealEstateDemo } from '../components/demo/RealEstateDemo';
import { PharmacyDemo } from '../components/demo/PharmacyDemo';
import { ProfessionalServiceDemo } from '../components/demo/ProfessionalServiceDemo';
import { HospitalityReservationDemo } from '../components/demo/HospitalityReservationDemo';

interface DemoTabConfig {
  slug: string;
  label: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  summary: string;
}

const DEMO_TABS: DemoTabConfig[] = [
  {
    slug: 'salon-appointment-management',
    label: 'Salon & Beauty',
    category: 'Booking & Appointments',
    icon: Scissors,
    tagline: 'Velvet Studio · Booking & Stylist Shifts',
    summary: 'Interactive client slot reservation, barber chair assignment, and SMS reminder simulation.',
  },
  {
    slug: 'professional-service-management',
    label: 'Professional Services',
    category: 'Business Operations',
    icon: Briefcase,
    tagline: 'Veritas Advisory · Billable Hours & Retainer Invoicing',
    summary: 'Client engagement workspace, consultant timesheet logger, milestone sign-offs, and VAT invoices.',
  },
  {
    slug: 'hospitality-reservation-system',
    label: 'Hospitality & Banquet',
    category: 'Hospitality',
    icon: UtensilsCrossed,
    tagline: 'Himalayan Grand · Banquet Halls & Catering Roster',
    summary: 'Multi-resource booking for banquet halls and chalets, per-plate catering menu calculator, and event roster.',
  },
  {
    slug: 'futsal-court-booking',
    label: 'Futsal Arena',
    category: 'Booking & Appointments',
    icon: Trophy,
    tagline: 'Kathmandu Sports Arena · Court & Peak Pricing',
    summary: 'High-speed court booking grid with dynamic morning vs evening peak-rate calculation and match hold locks.',
  },
  {
    slug: 'inventory-sales-management',
    label: 'Retail POS & Stock',
    category: 'Retail & Inventory',
    icon: Package,
    tagline: 'The Oak & Thread · Register & Stock Alerts',
    summary: 'Barcode scanner checkout counter, low-stock threshold triggers, and cash register reconciliation.',
  },
  {
    slug: 'restaurant-qr-kitchen-ops',
    label: 'Restaurant QR & KDS',
    category: 'Restaurant Management',
    icon: Utensils,
    tagline: 'Himalayan Bistro · Table QR & Chef Tickets',
    summary: 'Guest table QR digital menu ordering directly connected to live chef Kitchen Display System (KDS).',
  },
  {
    slug: 'clinic-patient-appointment-portal',
    label: 'Clinic & Doctor Tokens',
    category: 'Healthcare & Wellness',
    icon: Stethoscope,
    tagline: 'Aura Polyclinic · OPD Chamber Queue',
    summary: 'OPD doctor consultation schedules, real-time token counter queue, and receptionist check-in.',
  },
  {
    slug: 'hotel-resort-reservation-system',
    label: 'Boutique Hotel & Resort',
    category: 'Hospitality',
    icon: BedDouble,
    tagline: 'Annapurna Vista Resort · Room Nights & Housekeeping',
    summary: 'Direct zero-commission room booking engine, seasonal peak tariffs, and front-desk housekeeping board.',
  },
  {
    slug: 'school-student-fee-portal',
    label: 'School Fee & Attendance',
    category: 'Education',
    icon: GraduationCap,
    tagline: 'Kathmandu Academy · Fee Challan & Parent SMS',
    summary: 'Student roster, 1-click batch monthly fee challan generator, and parent SMS payment reminder dispatch.',
  },
  {
    slug: 'gym-membership-access-management',
    label: 'Gym & Fitness Passes',
    category: 'Business Operations',
    icon: Dumbbell,
    tagline: 'Apex Fitness Club · Member Expiry & Check-in',
    summary: 'Membership pass tier manager, kiosk check-in terminal, and automated renewal expiry warnings.',
  },
  {
    slug: 'vehicle-service-workshop-management',
    label: 'Auto Workshop & Jobs',
    category: 'Business Operations',
    icon: Wrench,
    tagline: 'Precision Auto Garage · Bay Job Cards & Invoices',
    summary: 'License plate vehicle intake, mechanic job card dispatch, spare parts storeroom deduction, and tax invoices.',
  },
  {
    slug: 'real-estate-crm-lead-manager',
    label: 'Real Estate Developer CRM',
    category: 'Customer Management',
    icon: Building2,
    tagline: 'Himalaya Heights · Unit Inventory & Site Visits',
    summary: 'Apartment & penthouse unit inventory availability matrix, buyer site visit scheduler, and deal pipeline.',
  },
  {
    slug: 'pharmacy-expiry-stock-billing',
    label: 'Pharmacy Expiry & POS',
    category: 'Retail & Inventory',
    icon: Pill,
    tagline: 'Aarogya Lifecare · Batch Expiry & DDA Billing',
    summary: 'Medicine batch number tracking, 60-day expiry loss alerts, generic salt substitution, and DDA billing.',
  },
];

export const InteractiveDemoPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const currentSlug = slug || 'salon-appointment-management';
  const currentSolution =
    INITIAL_SOLUTIONS.find((s) => s.slug === currentSlug) || INITIAL_SOLUTIONS[0];

  const activeTabConfig =
    DEMO_TABS.find((t) => t.slug === currentSlug) || DEMO_TABS[0];

  const filteredDemos = DEMO_TABS.filter(
    (tab) =>
      tab.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tab.tagline.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tab.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tab.summary.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const renderActiveDemo = () => {
    switch (currentSlug) {
      case 'professional-service-management':
        return <ProfessionalServiceDemo />;
      case 'hospitality-reservation-system':
        return <HospitalityReservationDemo />;
      case 'futsal-court-booking':
        return <FutsalDemo />;
      case 'inventory-sales-management':
        return <InventoryDemo />;
      case 'restaurant-qr-kitchen-ops':
        return <RestaurantDemo />;
      case 'clinic-patient-appointment-portal':
        return <ClinicDemo />;
      case 'hotel-resort-reservation-system':
        return <HotelDemo />;
      case 'school-student-fee-portal':
        return <SchoolDemo />;
      case 'gym-membership-access-management':
        return <GymDemo />;
      case 'vehicle-service-workshop-management':
        return <AutoDemo />;
      case 'real-estate-crm-lead-manager':
        return <RealEstateDemo />;
      case 'pharmacy-expiry-stock-billing':
        return <PharmacyDemo />;
      case 'salon-appointment-management':
      default:
        return <SalonDemo />;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Breadcrumb & Switcher Header */}
      <section className="bg-neutral-900 text-white border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <nav className="flex items-center gap-2 text-xs text-neutral-400">
                <Link to="/solutions" className="hover:text-white">
                  Catalog
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
                <Link to={`/solutions/${currentSolution.slug}`} className="hover:text-white">
                  {currentSolution.title}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
                <span className="text-white font-medium">Live Interactive Sandbox</span>
              </nav>

              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Interactive Software Demos
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  13 Working Sandboxes
                </span>
              </div>
              <p className="text-xs text-neutral-400 max-w-xl">
                Test working customer self-service interfaces and business administration consoles across all available software solutions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCatalogModal(true)}
                className="px-3.5 py-2 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-md transition-colors inline-flex items-center gap-2 border border-neutral-700 shadow-xs shrink-0"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-neutral-300" />
                <span>All 13 Demos Directory</span>
              </button>

              <Link
                to={`/solutions/${currentSolution.slug}/customize`}
                className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 rounded-md transition-colors inline-flex items-center gap-1.5 shadow-xs shrink-0"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Customize This Solution</span>
              </Link>
            </div>
          </div>

          {/* Interactive Demos Switcher Tabs */}
          <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {DEMO_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentSlug === tab.slug;

              return (
                <button
                  key={tab.slug}
                  onClick={() => navigate(`/solutions/${tab.slug}/demo`)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-white text-neutral-950 font-bold shadow-xs'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Container rendering active demo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderActiveDemo()}
      </div>

      {/* Modal: All 13 Demos Directory */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-5 h-5 text-neutral-800" />
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    All Available Solution Demos (13)
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Switch directly between all functional prototypes and operational dashboards
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCatalogModal(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 rounded-md transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-neutral-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter demos by industry, keywords, or feature (e.g. salon, qr, futsal, hospital, real estate)..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-neutral-900 bg-neutral-50 focus:bg-white"
                  autoFocus
                />
              </div>
            </div>

            {/* Demos Grid */}
            <div className="p-5 overflow-y-auto max-h-[60vh] grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredDemos.map((tab) => {
                const Icon = tab.icon;
                const isSelected = tab.slug === currentSlug;
                const solutionItem = INITIAL_SOLUTIONS.find((s) => s.slug === tab.slug);

                return (
                  <button
                    key={tab.slug}
                    onClick={() => {
                      setShowCatalogModal(false);
                      navigate(`/solutions/${tab.slug}/demo`);
                    }}
                    className={`text-left p-4 rounded-lg border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-400 bg-white hover:bg-neutral-50/80 text-neutral-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isSelected ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {tab.category}
                        </span>
                        {solutionItem && (
                          <span
                            className={`text-[11px] font-semibold ${
                              isSelected ? 'text-neutral-300' : 'text-neutral-700'
                            }`}
                          >
                            रू {solutionItem.startingPriceNPR.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 font-bold text-sm mb-1">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isSelected ? 'text-white' : 'text-neutral-800'
                          }`}
                        />
                        <span>{tab.label}</span>
                      </div>

                      <p
                        className={`text-xs mb-2 ${
                          isSelected ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      >
                        {tab.tagline}
                      </p>

                      <p
                        className={`text-xs line-clamp-2 leading-relaxed ${
                          isSelected ? 'text-neutral-200' : 'text-neutral-600'
                        }`}
                      >
                        {tab.summary}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold">
                      <span className={isSelected ? 'text-neutral-300' : 'text-neutral-500'}>
                        {isSelected ? 'Currently Viewing' : 'Launch Sandbox'}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500">
              <span>Showing {filteredDemos.length} of {DEMO_TABS.length} interactive software sandboxes</span>
              <button
                onClick={() => setShowCatalogModal(false)}
                className="px-4 py-1.5 text-xs font-medium bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
