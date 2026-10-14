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
    { label: 'Live Demos', href: '/demo' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/solutions') {
      return location.pathname === '/solutions';
    }
    if (path === '/demo') {
      return location.pathname.includes('/demo');
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly compliant Top Bar Contract */}
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Logo / Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          >
            <img src="/logo.png" alt="lumniscate" className="h-8 sm:h-10 w-auto object-contain" />
          </Link>

          {/* Zone 2: Navigation Links (Visible only on lg screens and above so tablets don't cram) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-600">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  isActive(link.href)
                    ? 'text-neutral-950 font-semibold border-b-2 border-neutral-900 pb-0.5'
                    : 'hover:text-neutral-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Zone 3: Primary Action / Admin Portal (Visible only on lg screens and above) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
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
                to="/demo"
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Try Live Demos</span>
                <span className="px-1.5 py-0.5 bg-neutral-800 text-[10px] text-neutral-300 rounded font-mono">13</span>
              </Link>
            )}
          </div>

          {/* Tablet & Mobile hamburger trigger (Visible below lg screens) */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tablet & Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm py-2.5 px-3 rounded-md font-medium transition-colors ${
                  isActive(link.href) 
                    ? 'bg-neutral-100 text-neutral-950 font-semibold' 
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2.5">
            <Link
              to="/demo"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center px-4 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors"
            >
              Try Live Demos (13 Solutions)
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center px-4 py-2.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};