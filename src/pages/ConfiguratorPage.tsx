import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Sliders,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { INITIAL_SOLUTIONS, HOSTING_OPTIONS } from '../config/solutionsData';
import { calculateEstimate } from '../services/pricingEngine';
import { storageService } from '../services/storageService';
import { Currency } from '../components/common/Currency';
import { HostingOptionId } from '../types';

export const ConfiguratorPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const solution = INITIAL_SOLUTIONS.find((s) => s.slug === slug) || INITIAL_SOLUTIONS[0];

  const initialPkg = (searchParams.get('pkg') as any) || 'starter';

  // Step Tracker (1 to 7)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [packageId, setPackageId] = useState<'starter' | 'professional' | 'custom'>(initialPkg);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [businessName, setBusinessName] = useState('');
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessCategory, setBusinessCategory] = useState(solution.category);
  const [staffCount, setStaffCount] = useState<number>(4);
  const [branchCount, setBranchCount] = useState<number>(1);
  const [preferredLanguage, setPreferredLanguage] = useState('English / Nepali');
  const [primaryColor, setPrimaryColor] = useState('#171717');
  const [logoUrl, setLogoUrl] = useState('');
  const [preferredDomain, setPreferredDomain] = useState('');
  const [existingWebsite, setExistingWebsite] = useState('');
  const [hostingOptionId, setHostingOptionId] = useState<HostingOptionId>('managed-cloud');
  const [customRequirements, setCustomRequirements] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Real-time Pricing Calculation
  const priceEstimate = useMemo(() => {
    return calculateEstimate({
      solutionId: solution.id,
      packageId,
      selectedAddonIds,
      hostingOptionId,
    });
  }, [solution, packageId, selectedAddonIds, hostingOptionId]);

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const stepsList = [
    'Package',
    'Add-Ons',
    'Business Info',
    'Branding',
    'Hosting & SLA',
    'Custom Scope',
    'Review & Estimate',
  ];

  const handleNext = () => {
    if (currentStep === 3) {
      if (!businessName.trim() || !clientName.trim() || !email.trim() || !phone.trim()) {
        setErrorMessage('Please fill in business name, contact person, email, and phone number.');
        return;
      }
      setErrorMessage('');
    }
    setCurrentStep((s) => Math.min(s + 1, 7));
  };

  const handleBack = () => {
    setErrorMessage('');
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !phone.trim() || !clientName.trim() || !businessName.trim()) {
      setErrorMessage('Please ensure contact details are filled in Step 3.');
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const selectedPkgObj = solution.packages.find((p) => p.id === packageId);

      const request = storageService.createRequest({
        clientName,
        businessName,
        email,
        phone,
        businessCategory,
        staffCount,
        branchCount,
        preferredLanguage,
        primaryColor,
        logoUrl: logoUrl || undefined,
        preferredDomain: preferredDomain || undefined,
        existingWebsite: existingWebsite || undefined,
        solutionId: solution.id,
        solutionSlug: solution.slug,
        solutionTitle: solution.title,
        packageId,
        packageName: selectedPkgObj?.name || 'Starter',
        selectedAddonIds,
        hostingOptionId,
        customRequirements: customRequirements || undefined,
        status: 'New',
      });

      // Redirect to unique request page
      navigate(`/request/${request.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while creating project request.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <Link to={`/solutions/${solution.slug}`} className="hover:text-neutral-900">
            {solution.title}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-neutral-900 font-medium">Interactive Configurator</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-950">
          Configure Your Implementation
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          Select features, branding preferences, and hosting requirements. Receive a transparent price breakdown with no obligation.
        </p>
      </div>

      {/* Progress Steps Header */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4 overflow-x-auto">
        <div className="flex items-center min-w-[700px] justify-between">
          {stepsList.map((stepName, idx) => {
            const stepNum = idx + 1;
            const isCompleted = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;

            return (
              <button
                key={stepName}
                onClick={() => {
                  if (stepNum < currentStep) setCurrentStep(stepNum);
                }}
                className={`flex items-center gap-2 text-xs transition-colors ${
                  isCurrent
                    ? 'font-bold text-neutral-950'
                    : isCompleted
                    ? 'text-neutral-600 font-medium'
                    : 'text-neutral-400 cursor-not-allowed'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] ${
                    isCurrent
                      ? 'bg-neutral-950 text-white'
                      : isCompleted
                      ? 'bg-neutral-200 text-neutral-800'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {isCompleted ? '✓' : stepNum}
                </span>
                <span className="whitespace-nowrap">{stepName}</span>
                {idx < stepsList.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-300 mx-1 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-800 text-xs rounded-md border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Dual-Column: Step Content (Left) & Sticky Live Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Step Details */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 space-y-6">
          {/* STEP 1: Choose Package */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Step 1 of 7
                </span>
                <h2 className="text-xl font-bold text-neutral-950 mt-1">
                  Choose a Base Implementation Package
                </h2>
                <p className="text-xs text-neutral-600 mt-1">
                  Select the tier that matches your initial scale. All packages are deployed as production applications.
                </p>
              </div>

              <div className="space-y-4">
                {solution.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setPackageId(pkg.id)}
                    className={`p-5 rounded-lg border cursor-pointer transition-all ${
                      packageId === pkg.id
                        ? 'border-neutral-950 bg-neutral-50/70 ring-1 ring-neutral-950'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-950">{pkg.name}</span>
                        {pkg.isPopular && (
                          <span className="text-[10px] font-semibold bg-neutral-900 text-white px-2 py-0.5 rounded">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-neutral-500">Implementation: </span>
                        <Currency amount={pkg.basePriceNPR} className="text-sm font-bold text-neutral-950" />
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 mb-3">{pkg.tagline}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-neutral-700 pt-2 border-t border-neutral-100">
                      {pkg.featuresIncluded.slice(0, 6).map((feat, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Add-Ons */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Step 2 of 7
                </span>
                <h2 className="text-xl font-bold text-neutral-950 mt-1">
                  Select Add-On Modules & Integrations
                </h2>
                <p className="text-xs text-neutral-600 mt-1">
                  Optional components to connect local payment gateways, notification channels, or multi-branch features.
                </p>
              </div>

              <div className="space-y-3">
                {solution.addons.map((addon) => {
                  const isChecked = selectedAddonIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                        isChecked
                          ? 'border-neutral-950 bg-neutral-50/70 ring-1 ring-neutral-950'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 rounded text-neutral-900 focus:ring-0"
                        />
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-neutral-950 block">
                            {addon.name}
                          </span>
                          <p className="text-xs text-neutral-600 leading-relaxed">
                            {addon.description}
                          </p>
                          {addon.requiresExternalAccount && (
                            <p className="text-[11px] text-neutral-500">
                              ℹ {addon.externalProviderNote}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {addon.isCustomQuote ? (
                          <span className="text-xs font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                            Quote Required
                          </span>
                        ) : (
                          <Currency amount={addon.priceNPR} className="text-xs font-bold text-neutral-950" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Business Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Step 3 of 7
                </span>
                <h2 className="text-xl font-bold text-neutral-950 mt-1">
                  Business & Contact Details
                </h2>
                <p className="text-xs text-neutral-600 mt-1">
                  Tell us about your organization so we can size your database and configure preliminary business records.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Royal Crown Salon & Spa"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Rajesh Khadka"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rajesh@royalcrown.com.np"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Phone Number (Nepal) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+977 98XXXXXXXX"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Number of Staff
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={staffCount}
                      onChange={(e) => setStaffCount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Number of Branches
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={branchCount}
                      onChange={(e) => setBranchCount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Preferred Language
                    </label>
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden bg-white"
                    >
                      <option value="English">English</option>
                      <option value="Nepali">Nepali</option>
                      <option value="English / Nepali">Bilingual (English & Nepali)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Branding */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Step 4 of 7
                </span>
                <h2 className="text-xl font-bold text-neutral-950 mt-1">
                  Branding & Visual Identity
                </h2>
                <p className="text-xs text-neutral-600 mt-1">
                  Customize the look and feel of the customer booking interface and administrative dashboards.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-2">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded border border-neutral-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-28 px-3 py-2 font-mono border border-neutral-200 rounded-md"
                    />
                    <div className="flex items-center gap-1.5">
                      {['#0f172a', '#832729', '#059669', '#2563eb', '#d97706'].map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => setPrimaryColor(hex)}
                          style={{ backgroundColor: hex }}
                          className="w-6 h-6 rounded-full border border-neutral-200"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Logo URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                    />
                    <span className="text-[11px] text-neutral-400">
                      Or send high-res SVG/PNG to our architect after proposal confirmation.
                    </span>
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Target Domain (.np or .com)
                    </label>
                    <input
                      type="text"
                      value={preferredDomain}
                      onChange={(e) => setPreferredDomain(e.target.value)}
                      placeholder="e.g. book.royalcrown.com.np"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                    />
                    <span className="text-[11px] text-neutral-400">
                      We configure DNS and SSL certificates at no extra charge.
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Existing Website or Instagram Page
                  </label>
                  <input
                    type="text"
                    value={existingWebsite}
                    onChange={(e) => setExistingWebsite(e.target.value)}
                    placeholder="e.g. instagram.com/royalcrownktm"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Hosting & SLA */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Step 5 of 7
                </span>
                <h2 className="text-xl font-bold text-neutral-950 mt-1">
                  Hosting & Support Plan
                </h2>
                <p className="text-xs text-neutral-600 mt-1">
                  Choose between self-hosting on your server (NPR 0/mo) or worry-free managed cloud hosting by LumniscateSolutions.
                </p>
              </div>

              <div className="space-y-4">
                {HOSTING_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setHostingOptionId(opt.id)}
                    className={`p-5 rounded-lg border cursor-pointer transition-all ${
                      hostingOptionId === opt.id
                        ? 'border-neutral-950 bg-neutral-50/70 ring-1 ring-neutral-950'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <span className="text-sm font-bold text-neutral-950">{opt.name}</span>
                      <div className="text-left sm:text-right">
                        {opt.monthlyNPR === 0 ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                            NPR 0 / month (Self-Hosted)
                          </span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Currency amount={opt.monthlyNPR} className="text-sm font-bold text-neutral-950" />
                            <span className="text-xs text-neutral-500"> / month</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 mb-3">{opt.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-neutral-700 pt-2 border-t border-neutral-100">
                      {opt.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Custom Requirements */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Step 6 of 7
                </span>
                <h2 className="text-xl font-bold text-neutral-950 mt-1">
                  Custom Requirements & Specific Workflows
                </h2>
                <p className="text-xs text-neutral-600 mt-1">
                  Do you have unique booking policies, customer questionnaire requirements, or existing software to integrate?
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Custom Business Logic or Requirements
                  </label>
                  <textarea
                    rows={6}
                    value={customRequirements}
                    onChange={(e) => setCustomRequirements(e.target.value)}
                    placeholder="e.g. We require clients to choose a specific treatment room. We also need daily sales totals exported automatically to our accountant's email every evening."
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden leading-relaxed"
                  />
                  <p className="text-[11px] text-neutral-500 mt-1.5">
                    Our lead software architect will review these notes and address them in the technical proposal.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Review & Final Breakdown */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Step 7 of 7
                </span>
                <h2 className="text-xl font-bold text-neutral-950 mt-1">
                  Review Selections & Submit Request
                </h2>
                <p className="text-xs text-neutral-600 mt-1">
                  Verify your configuration before submitting. No payment card required. We will prepare your official proposal.
                </p>
              </div>

              {/* Review summary cards */}
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                  <span className="font-bold text-neutral-900 block">Organization Profile:</span>
                  <p className="text-neutral-700">
                    <strong>{businessName || 'Your Business'}</strong> · Contact: {clientName || 'N/A'} ({phone || 'N/A'}, {email || 'N/A'})
                  </p>
                  <p className="text-neutral-500">
                    Staff: {staffCount} · Branches: {branchCount} · Language: {preferredLanguage}
                  </p>
                </div>

                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                  <span className="font-bold text-neutral-900 block">Scope & Add-Ons:</span>
                  <p className="text-neutral-700">
                    <strong>Package:</strong> {priceEstimate.packageName} (Implementation: <Currency amount={priceEstimate.basePackageNPR} />)
                  </p>
                  {priceEstimate.addonsList.length > 0 ? (
                    <ul className="space-y-1 text-neutral-600 pl-3 list-disc">
                      {priceEstimate.addonsList.map((a) => (
                        <li key={a.id}>
                          {a.name} — {a.isCustomQuote ? 'Custom Scoped' : <Currency amount={a.priceNPR} />}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-neutral-500">No additional add-ons selected.</p>
                  )}
                </div>

                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                  <span className="font-bold text-neutral-900 block">Hosting Selection:</span>
                  <p className="text-neutral-700">
                    {priceEstimate.hostingName} —{' '}
                    {priceEstimate.hostingMonthlyNPR === 0 ? (
                      'NPR 0/mo (Self-Hosted)'
                    ) : (
                      <>
                        <Currency amount={priceEstimate.hostingMonthlyNPR} /> / month
                      </>
                    )}
                  </p>
                </div>

                {priceEstimate.itemsRequiringQuote.length > 0 && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 space-y-1">
                    <span className="font-bold block">Items Scoped Separately:</span>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {priceEstimate.itemsRequiringQuote.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-neutral-200 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitRequest}
                className="px-8 py-3 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors shadow-xs flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Generating Reference...</span>
                ) : (
                  <>
                    <span>Submit Implementation Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Sticky Pricing Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-neutral-200 p-6 space-y-6 sticky top-24">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Live Price Estimate
            </span>
            <h3 className="text-base font-bold text-neutral-950 mt-0.5">
              Cost Summary (NPR)
            </h3>
            <p className="text-[11px] text-neutral-500">
              Calculated dynamically via Lumniscate Pricing Engine.
            </p>
          </div>

          <div className="space-y-3 text-xs border-y border-neutral-100 py-4">
            <div className="flex justify-between text-neutral-700">
              <span>{priceEstimate.packageName} Package:</span>
              <Currency amount={priceEstimate.basePackageNPR} className="font-semibold text-neutral-900" />
            </div>

            {priceEstimate.addonsTotalNPR > 0 && (
              <div className="flex justify-between text-neutral-700">
                <span>Add-Ons ({priceEstimate.addonsList.length}):</span>
                <Currency amount={priceEstimate.addonsTotalNPR} className="font-semibold text-neutral-900" />
              </div>
            )}

            <div className="flex justify-between pt-2 border-t border-neutral-100 text-sm font-bold text-neutral-950">
              <span>One-Time Total:</span>
              <Currency amount={priceEstimate.oneTimeTotalNPR} />
            </div>

            <div className="flex justify-between pt-2 text-xs text-neutral-600">
              <span>Recurring Hosting:</span>
              {priceEstimate.hostingMonthlyNPR === 0 ? (
                <span className="font-semibold text-emerald-700">NPR 0 / mo</span>
              ) : (
                <span className="font-semibold text-neutral-900">
                  <Currency amount={priceEstimate.hostingMonthlyNPR} /> / mo
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2 text-[11px] text-neutral-500">
            <p className="font-semibold text-neutral-700">Commercial Terms:</p>
            <ul className="space-y-1 list-disc pl-3">
              <li>30% deposit upon proposal confirmation</li>
              <li>40% upon staging demo approval</li>
              <li>30% upon final production deployment</li>
              <li>Includes 30–60 days technical warranty</li>
            </ul>
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-[11px] text-neutral-600 space-y-1">
            <p className="font-semibold text-neutral-900">Next Step:</p>
            <p>
              Submitting creates a unique reference tracking ID. Our lead architect will follow up within 24 hours to review your requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
