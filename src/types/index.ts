export type SolutionCategory =
  | 'Booking & Appointments'
  | 'Retail & Inventory'
  | 'Hospitality'
  | 'Restaurant Management'
  | 'Customer Management'
  | 'Healthcare & Wellness'
  | 'Education'
  | 'Business Operations';

export type SolutionStatus = 'Available' | 'In Development' | 'Coming Soon';

export interface PackageTier {
  id: 'starter' | 'professional' | 'custom';
  name: string;
  tagline: string;
  basePriceNPR: number;
  isPopular?: boolean;
  featuresIncluded: string[];
  idealFor: string;
}

export interface SolutionAddon {
  id: string;
  name: string;
  description: string;
  priceNPR: number;
  category: 'core' | 'communication' | 'payment' | 'infrastructure';
  requiresExternalAccount?: boolean;
  externalProviderNote?: string;
  isCustomQuote?: boolean;
}

export interface SolutionItem {
  id: string;
  slug: string;
  title: string;
  category: SolutionCategory;
  shortDescription: string;
  longDescription: string;
  mainBenefits: string[];
  keyFeatures: string[];
  startingPriceNPR: number;
  status: SolutionStatus;
  demoAvailable: boolean;
  demoPath?: string;
  imagePath: string;
  packages: PackageTier[];
  addons: SolutionAddon[];
  targetAudience: string;
  estimatedDeliveryWeeks: string;
}

export type HostingOptionId = 'client-managed' | 'managed-cloud' | 'managed-maintenance' | 'enterprise-sla';

export interface HostingOption {
  id: HostingOptionId;
  name: string;
  description: string;
  monthlyNPR: number;
  features: string[];
}

export type RequestStatus =
  | 'New'
  | 'Contacted'
  | 'Requirements Review'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Accepted'
  | 'Rejected'
  | 'In Development'
  | 'Delivered';

export interface AdminLeadNote {
  id: string;
  timestamp: string;
  author: string;
  text: string;
}

export interface ProjectRequest {
  id: string;
  referenceNumber: string; // e.g., BW-REQ-2026-0812
  createdAt: string;
  updatedAt: string;
  status: RequestStatus;

  // Client Details
  clientName: string;
  businessName: string;
  email: string;
  phone: string;
  businessCategory: string;
  staffCount: number;
  branchCount: number;
  preferredLanguage: string;

  // Branding Preferences
  primaryColor: string;
  logoUrl?: string;
  preferredDomain?: string;
  existingWebsite?: string;

  // Selected Scope
  solutionId: string;
  solutionSlug: string;
  solutionTitle: string;
  packageId: 'starter' | 'professional' | 'custom';
  packageName: string;
  selectedAddonIds: string[];
  hostingOptionId: HostingOptionId;
  customRequirements?: string;

  // Verified Calculated Cost
  costBreakdown: {
    basePackageNPR: number;
    addonsTotalNPR: number;
    hostingMonthlyNPR: number;
    oneTimeTotalNPR: number;
    itemsRequiringQuote: string[];
    currency: string;
  };

  // Admin Management Fields
  internalNotes: AdminLeadNote[];
  nextFollowUpDate?: string;
  finalQuotedPriceNPR?: number;
  assignedArchitect?: string;
}

// Salon Interactive Demo Types
export interface DemoService {
  id: string;
  name: string;
  durationMinutes: number;
  priceNPR: number;
  category: 'Hair' | 'Skincare' | 'Spa & Wellness' | 'Nails';
  description: string;
}

export interface DemoStaff {
  id: string;
  name: string;
  role: string;
  rating: number;
  servicesOffered: string[];
  avatarInitial: string;
}

export interface DemoAppointment {
  id: string;
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM"
  status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  totalPriceNPR: number;
  specialNotes?: string;
  createdAt: string;
}
