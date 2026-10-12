import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { storageService } from '../../services/storageService';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isAdmin = storageService.isAdminAuthenticated();

  const navLinks = [
    { label: 'Solutions', href: '/solutions' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/solutions') {
      return location.pathname.startsWith('/solutions');
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly compliant 3-zone Top Bar Contract */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 hover:text-neutral-700 transition-colors"
          >
            Lumniscate
          </Link>

          {/* Zone 2: 4-5 single-line clean navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  isActive(link.href)
                    ? 'text-neutral-950 font-semibold border-b-2 border-neutral-900 pb-0.5'
                    : 'hover:text-neutral-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAdmin ? (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Portal
              </Link>
            ) : (
              <Link
                to="/solutions/salon-appointment-management"
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                Explore Salon Demo
              </Link>
            )}
          </div>

          {/* Mobile hamburger trigger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-neutral-600 hover:text-neutral-900"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm py-2 px-3 rounded-md font-medium transition-colors ${
                  isActive(link.href) ? 'bg-neutral-100 text-neutral-950 font-semibold' : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
            <Link
              to="/solutions/salon-appointment-management"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-md"
            >
              Explore Salon Demo
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 rounded-md"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
