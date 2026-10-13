import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { BUSINESS_INFO } from '../../config/solutionsData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link to="/" className="inline-block">
              {BUSINESS_INFO.logoUrl ? (
                <img
                  src={BUSINESS_INFO.logoUrl}
                  alt={BUSINESS_INFO.companyName}
                  style={{ height: BUSINESS_INFO.logoHeight, width: BUSINESS_INFO.logoWidth }}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <span className="font-logo text-xl font-bold text-neutral-900 block">
                  {BUSINESS_INFO.companyName}
                </span>
              )}
            </Link>

            {/* Redesigned Description Section */}
            <p className="text-xs text-neutral-600 leading-relaxed border-l-2 border-neutral-300 pl-3 text-left max-w-sm sm:max-w-none font-normal">
              Configurable business software tailored for real operational requirements. We deploy, customize, and maintain production software systems.
            </p>

            {/* Enhanced Contact Info */}
            <div className="text-xs text-neutral-500 space-y-2 pt-1 font-medium">
              {BUSINESS_INFO.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{BUSINESS_INFO.location}</span>
                </div>
              )}
              {BUSINESS_INFO.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-neutral-800 transition-colors">
                    {BUSINESS_INFO.phone}
                  </a>
                </div>
              )}
              {BUSINESS_INFO.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-neutral-800 transition-colors">
                    {BUSINESS_INFO.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Solutions links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
              Solutions
            </p>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <Link to="/solutions/salon-appointment-management" className="hover:text-neutral-900 transition-colors">
                  Salon & Spa Booking
                </Link>
              </li>
              <li>
                <Link to="/solutions/futsal-court-booking" className="hover:text-neutral-900 transition-colors">
                  Futsal Court Booking
                </Link>
              </li>
              <li>
                <Link to="/solutions/inventory-sales-management" className="hover:text-neutral-900 transition-colors">
                  Retail Inventory & POS
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-neutral-900 transition-colors font-medium">
                  All Software Solutions →
                </Link>
              </li>
            </ul>
          </div>

          {/* Commercial Process */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
              Commercial Process
            </p>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <Link to="/how-it-works" className="hover:text-neutral-900 transition-colors">
                  How Purchasing Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-neutral-900 transition-colors">
                  NPR Pricing & Estimates
                </Link>
              </li>
              <li>
                <Link to="/solutions/salon-appointment-management/demo" className="hover:text-neutral-900 transition-colors">
                  Interactive Salon Demo
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-neutral-900 transition-colors">
                  About Our Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Portal */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
              Support & Portal
            </p>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-live-chat'))}
                  className="hover:text-neutral-900 text-left inline-flex items-center gap-1.5 font-medium text-neutral-900 group"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="group-hover:underline">Live Chat with Sales Desk</span>
                </button>
              </li>
              <li>
                <Link to="/contact" className="hover:text-neutral-900 transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-neutral-900 transition-colors">
                  Admin Lead Console
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-neutral-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-neutral-900 transition-colors">
                  Terms of Implementation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {BUSINESS_INFO.companyName}. All rights reserved. Registered software implementation provider in Nepal.
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/privacy" className="hover:text-neutral-800 transition-colors">
              Privacy
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms" className="hover:text-neutral-800 transition-colors">
              Terms
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/admin" className="hover:text-neutral-800 font-mono transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};