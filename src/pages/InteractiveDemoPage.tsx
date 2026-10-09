import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Scissors,
  Trophy,
  Package,
  Utensils,
  Stethoscope,
  ChevronRight,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { INITIAL_SOLUTIONS } from '../config/solutionsData';
import { SalonDemo } from '../components/demo/SalonDemo';
import { FutsalDemo } from '../components/demo/FutsalDemo';
import { InventoryDemo } from '../components/demo/InventoryDemo';
import { RestaurantDemo } from '../components/demo/RestaurantDemo';
import { ClinicDemo } from '../components/demo/ClinicDemo';

interface DemoTabConfig {
  slug: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
}

const DEMO_TABS: DemoTabConfig[] = [
  {
    slug: 'salon-appointment-management',
    label: 'Salon & Beauty',
    icon: Scissors,
    tagline: 'Velvet Studio · Booking & Stylist Shifts',
  },
  {
    slug: 'futsal-court-booking',
    label: 'Futsal Arena',
    icon: Trophy,
    tagline: 'Kathmandu Sports Arena · Court & Peak Pricing',
  },
  {
    slug: 'inventory-sales-management',
    label: 'Retail POS & Inventory',
    icon: Package,
    tagline: 'The Oak & Thread · Register & Stock Alerts',
  },
  {
    slug: 'restaurant-qr-kitchen-ops',
    label: 'Restaurant QR & KDS',
    icon: Utensils,
    tagline: 'Himalayan Bistro · Table QR & Chef Tickets',
  },
  {
    slug: 'clinic-patient-appointment-portal',
    label: 'Clinic & Doctor Tokens',
    icon: Stethoscope,
    tagline: 'Aura Polyclinic · OPD Chamber Queue',
  },
];

export const InteractiveDemoPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const currentSlug = slug || 'salon-appointment-management';
  const currentSolution =
    INITIAL_SOLUTIONS.find((s) => s.slug === currentSlug) || INITIAL_SOLUTIONS[0];

  const renderActiveDemo = () => {
    switch (currentSlug) {
      case 'futsal-court-booking':
        return <FutsalDemo />;
      case 'inventory-sales-management':
        return <InventoryDemo />;
      case 'restaurant-qr-kitchen-ops':
        return <RestaurantDemo />;
      case 'clinic-patient-appointment-portal':
        return <ClinicDemo />;
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

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Interactive Software Demos
              </h1>
              <p className="text-xs text-neutral-400 max-w-xl">
                Test working customer self-service interfaces and business administration consoles across all available software solutions.
              </p>
            </div>

            <div className="flex items-center gap-3">
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
    </div>
  );
};
