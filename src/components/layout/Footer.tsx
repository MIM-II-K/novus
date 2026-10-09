import React from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '../../config/solutionsData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <span className="text-base font-bold tracking-tight text-neutral-900 block">
              {BUSINESS_INFO.companyName}
            </span>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Configurable business software tailored for real operational requirements. We deploy, customize, and maintain production software systems.
            </p>
            <div className="text-xs text-neutral-500 space-y-1 pt-2">
              <p>{BUSINESS_INFO.location}</p>
              <p>{BUSINESS_INFO.phone}</p>
              <p>{BUSINESS_INFO.email}</p>
            </div>
          </div>

          {/* Solutions links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
              Solutions
            </p>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <Link to="/solutions/salon-appointment-management" className="hover:text-neutral-900">
                  Salon & Spa Booking
                </Link>
              </li>
              <li>
                <Link to="/solutions/futsal-court-booking" className="hover:text-neutral-900">
                  Futsal Court Booking
                </Link>
              </li>
              <li>
                <Link to="/solutions/inventory-sales-management" className="hover:text-neutral-900">
                  Retail Inventory & POS
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-neutral-900">
                  All Software Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Process & Transparency */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
              Commercial Process
            </p>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <Link to="/how-it-works" className="hover:text-neutral-900">
                  How Purchasing Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-neutral-900">
                  NPR Pricing & Estimates
                </Link>
              </li>
              <li>
                <Link to="/solutions/salon-appointment-management/demo" className="hover:text-neutral-900">
                  Interactive Salon Demo
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-neutral-900">
                  About Our Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Business & Support */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
              Support & Portal
            </p>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <Link to="/contact" className="hover:text-neutral-900">
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-neutral-900">
                  Admin Lead Console
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-neutral-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-neutral-900">
                  Terms of Implementation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiet divider and copyright */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © {new Date().getFullYear()} Buildwise Solutions. All rights reserved. Registered software implementation provider in Nepal.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-neutral-800">
              Privacy
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms" className="hover:text-neutral-800">
              Terms
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/admin" className="hover:text-neutral-800 font-mono">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
