import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LiveChat } from './components/common/LiveChat';
import { HomePage } from './pages/HomePage';
import { SolutionsPage } from './pages/SolutionsPage';
import { SolutionDetailPage } from './pages/SolutionDetailPage';
import { InteractiveDemoPage } from './pages/InteractiveDemoPage';
import { ConfiguratorPage } from './pages/ConfiguratorPage';
import { RequestStatusPage } from './pages/RequestStatusPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PricingPage } from './pages/PricingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage, TermsPage } from './pages/LegalPages';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage';
import { AdminSolutionsPage } from './pages/admin/AdminSolutionsPage';
import { AdminPricingPage } from './pages/admin/AdminPricingPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Scroll to top upon navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Wrapper for public storefront pages
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <LiveChat />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Storefront Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/solutions"
          element={
            <PublicLayout>
              <SolutionsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/solutions/:slug"
          element={
            <PublicLayout>
              <SolutionDetailPage />
            </PublicLayout>
          }
        />
        <Route
          path="/solutions/:slug/demo"
          element={
            <PublicLayout>
              <InteractiveDemoPage />
            </PublicLayout>
          }
        />
        <Route
          path="/demo"
          element={
            <PublicLayout>
              <InteractiveDemoPage />
            </PublicLayout>
          }
        />
        <Route
          path="/solutions/:slug/customize"
          element={
            <PublicLayout>
              <ConfiguratorPage />
            </PublicLayout>
          }
        />
        <Route
          path="/request/:requestId"
          element={
            <PublicLayout>
              <RequestStatusPage />
            </PublicLayout>
          }
        />
        <Route
          path="/how-it-works"
          element={
            <PublicLayout>
              <HowItWorksPage />
            </PublicLayout>
          }
        />
        <Route
          path="/pricing"
          element={
            <PublicLayout>
              <PricingPage />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <AboutPage />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <ContactPage />
            </PublicLayout>
          }
        />
        <Route
          path="/privacy"
          element={
            <PublicLayout>
              <PrivacyPage />
            </PublicLayout>
          }
        />
        <Route
          path="/terms"
          element={
            <PublicLayout>
              <TermsPage />
            </PublicLayout>
          }
        />

        {/* Admin Console Routes (Dedicated Layout & Auth Protected) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/leads" element={<AdminLeadsPage />} />
        <Route path="/admin/requests" element={<AdminLeadsPage />} />
        <Route path="/admin/solutions" element={<AdminSolutionsPage />} />
        <Route path="/admin/pricing" element={<AdminPricingPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
                <h1 className="text-2xl font-bold text-neutral-900">Page Not Found</h1>
                <p className="text-xs text-neutral-600">The requested page does not exist.</p>
                <a
                  href="/"
                  className="inline-block px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-md"
                >
                  Return to Home
                </a>
              </div>
            </PublicLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
