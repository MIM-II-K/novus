import { HOSTING_OPTIONS, INITIAL_SOLUTIONS } from '../config/solutionsData';
import { HostingOptionId } from '../types';

export interface CalculationInput {
  solutionId: string;
  packageId: 'starter' | 'professional' | 'custom';
  selectedAddonIds: string[];
  hostingOptionId: HostingOptionId;
}

export interface PricingBreakdown {
  currency: string;
  solutionTitle: string;
  packageName: string;
  basePackageNPR: number;
  addonsList: Array<{
    id: string;
    name: string;
    priceNPR: number;
    isCustomQuote: boolean;
  }>;
  addonsTotalNPR: number;
  hostingName: string;
  hostingMonthlyNPR: number;
  oneTimeTotalNPR: number;
  itemsRequiringQuote: string[];
  assumptions: string[];
  isAccurateEstimate: boolean;
}

/**
 * Authoritative pricing calculation engine.
 * Validates IDs against system data and computes complete breakdown.
 */
export function calculateEstimate(input: CalculationInput): PricingBreakdown {
  const solution = INITIAL_SOLUTIONS.find((s) => s.id === input.solutionId || s.slug === input.solutionId);
  if (!solution) {
    throw new Error(`Invalid solution identifier: ${input.solutionId}`);
  }

  const pkg = solution.packages.find((p) => p.id === input.packageId);
  if (!pkg) {
    throw new Error(`Invalid package tier: ${input.packageId}`);
  }

  const hosting = HOSTING_OPTIONS.find((h) => h.id === input.hostingOptionId) || HOSTING_OPTIONS[0];

  const itemsRequiringQuote: string[] = [];
  const assumptions: string[] = [
    'One-time implementation fee covers tailored deployment, branding alignment, and data setup.',
    'Hosting fees are billed separately on a monthly or annual cycle.',
    '30% deposit upon proposal confirmation; 40% upon staging milestone approval; 30% upon go-live.',
  ];

  if (input.packageId === 'custom') {
    itemsRequiringQuote.push('Custom enterprise modules and multi-branch workflow adjustments');
    assumptions.push('Custom tier starting price covers baseline framework; additional integrations scoped after technical discovery.');
  }

  const selectedAddons: PricingBreakdown['addonsList'] = [];
  let addonsTotal = 0;

  for (const addonId of input.selectedAddonIds) {
    const addon = solution.addons.find((a) => a.id === addonId);
    if (addon) {
      if (addon.isCustomQuote) {
        itemsRequiringQuote.push(addon.name);
      } else {
        addonsTotal += addon.priceNPR;
      }
      selectedAddons.push({
        id: addon.id,
        name: addon.name,
        priceNPR: addon.priceNPR,
        isCustomQuote: !!addon.isCustomQuote,
      });

      if (addon.requiresExternalAccount && addon.externalProviderNote) {
        assumptions.push(`${addon.name}: ${addon.externalProviderNote}`);
      }
    }
  }

  const oneTimeTotal = pkg.basePriceNPR + addonsTotal;

  return {
    currency: 'NPR',
    solutionTitle: solution.title,
    packageName: pkg.name,
    basePackageNPR: pkg.basePriceNPR,
    addonsList: selectedAddons,
    addonsTotalNPR: addonsTotal,
    hostingName: hosting.name,
    hostingMonthlyNPR: hosting.monthlyNPR,
    oneTimeTotalNPR: oneTimeTotal,
    itemsRequiringQuote,
    assumptions,
    isAccurateEstimate: itemsRequiringQuote.length === 0,
  };
}

/**
 * Currency formatter for Nepalese Rupee (NPR)
 */
export function formatNPR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
}
