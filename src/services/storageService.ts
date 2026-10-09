import { DemoAppointment, DemoService, DemoStaff, ProjectRequest, RequestStatus } from '../types';
import { INITIAL_SOLUTIONS } from '../config/solutionsData';
import { calculateEstimate } from './pricingEngine';

const STORAGE_KEYS = {
  REQUESTS: 'buildwise_project_requests_v1',
  ADMIN_AUTH: 'buildwise_admin_session_v1',
  DEMO_BOOKINGS: 'buildwise_demo_bookings_v1',
  SOLUTIONS_OVERRIDE: 'buildwise_solutions_v1',
};

// Seed realistic initial demo appointments for Velvet Studio
export const INITIAL_DEMO_SERVICES: DemoService[] = [
  {
    id: 'srv-1',
    name: 'Signature Haircut & Blowdry Styling',
    durationMinutes: 45,
    priceNPR: 1200,
    category: 'Hair',
    description: 'Bespoke consultation, clarifying shampoo, master cut, and blowout finish.',
  },
  {
    id: 'srv-2',
    name: 'Deluxe Hydrafacial & Glow Treatment',
    durationMinutes: 60,
    priceNPR: 3500,
    category: 'Skincare',
    description: 'Deep pore extraction, hyaluronic infusion, gentle LED therapy, and soothing mask.',
  },
  {
    id: 'srv-3',
    name: 'Ayurvedic Botanical Hair Spa & Oil Massage',
    durationMinutes: 50,
    priceNPR: 2200,
    category: 'Spa & Wellness',
    description: 'Herbal steam therapy, scalp tension release massage, and organic protein pack.',
  },
  {
    id: 'srv-4',
    name: 'Gel Nail Artistry & Russian Manicure',
    durationMinutes: 60,
    priceNPR: 1800,
    category: 'Nails',
    description: 'Precision cuticle treatment, strengthening base coat, and bespoke hand-painted nail art.',
  },
  {
    id: 'srv-5',
    name: 'Balayage Color & Gloss Finish',
    durationMinutes: 120,
    priceNPR: 6500,
    category: 'Hair',
    description: 'Hand-painted dimensional highlighting with bond rebuilder and conditioning toner.',
  },
];

export const INITIAL_DEMO_STAFF: DemoStaff[] = [
  {
    id: 'stf-1',
    name: 'Aayush Sharma',
    role: 'Senior Master Stylist',
    rating: 4.9,
    servicesOffered: ['srv-1', 'srv-3', 'srv-5'],
    avatarInitial: 'AS',
  },
  {
    id: 'stf-2',
    name: 'Pooja Thapa',
    role: 'Aesthetic Skincare Specialist',
    rating: 4.95,
    servicesOffered: ['srv-2', 'srv-4'],
    avatarInitial: 'PT',
  },
  {
    id: 'stf-3',
    name: 'Suman Rai',
    role: 'Creative Colorist & Nail Artist',
    rating: 4.85,
    servicesOffered: ['srv-1', 'srv-4', 'srv-5'],
    avatarInitial: 'SR',
  },
];

function getTodayString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

const SEED_REQUESTS: ProjectRequest[] = [
  {
    id: 'req-001',
    referenceNumber: 'BW-REQ-2026-0812',
    createdAt: '2026-10-06T10:15:00Z',
    updatedAt: '2026-10-07T14:20:00Z',
    status: 'Proposal Sent',
    clientName: 'Sunita Shakya',
    businessName: 'Luxe Locks Studio & Spa',
    email: 'sunita@luxelocks.com.np',
    phone: '+977 9841234567',
    businessCategory: 'Beauty & Wellness',
    staffCount: 8,
    branchCount: 2,
    preferredLanguage: 'English / Nepali',
    primaryColor: '#832729',
    preferredDomain: 'luxelocks.com.np',
    existingWebsite: 'https://instagram.com/luxelockskathmandu',
    solutionId: 'sol-salon',
    solutionSlug: 'salon-appointment-management',
    solutionTitle: 'Salon & Beauty Appointment Management',
    packageId: 'professional',
    packageName: 'Professional',
    selectedAddonIds: ['addon-whatsapp', 'addon-payment'],
    hostingOptionId: 'managed-maintenance',
    customRequirements: 'Need staff commission summary exportable to Excel every 15 days.',
    costBreakdown: {
      basePackageNPR: 40000,
      addonsTotalNPR: 17000,
      hostingMonthlyNPR: 4500,
      oneTimeTotalNPR: 57000,
      itemsRequiringQuote: [],
      currency: 'NPR',
    },
    internalNotes: [
      {
        id: 'n-1',
        timestamp: '2026-10-06T11:00:00Z',
        author: 'Lead Architect',
        text: 'Initial enquiry verified via WhatsApp. Client currently uses paper book and loses bookings on busy Saturdays.',
      },
      {
        id: 'n-2',
        timestamp: '2026-10-07T14:20:00Z',
        author: 'Sales Team',
        text: 'Walkthrough completed using Velvet Studio demo. Client loved the WhatsApp 2-hour reminder feature. Proposal PDF sent with NPR 57,000 one-time + NPR 4,500/mo maintenance.',
      },
    ],
    nextFollowUpDate: '2026-10-10',
    finalQuotedPriceNPR: 57000,
    assignedArchitect: 'Bikash Adhikari',
  },
  {
    id: 'req-002',
    referenceNumber: 'BW-REQ-2026-0925',
    createdAt: '2026-10-07T16:45:00Z',
    updatedAt: '2026-10-08T09:30:00Z',
    status: 'Contacted',
    clientName: 'Rabin Shrestha',
    businessName: 'Kathmandu Arena Futsal',
    email: 'rabin.futsal@gmail.com',
    phone: '+977 9812987654',
    businessCategory: 'Sports & Recreation',
    staffCount: 5,
    branchCount: 1,
    preferredLanguage: 'Nepali',
    primaryColor: '#059669',
    preferredDomain: 'ktmarenafutsal.np',
    solutionId: 'sol-futsal',
    solutionSlug: 'futsal-court-booking',
    solutionTitle: 'Futsal Court Booking & Slot Management',
    packageId: 'starter',
    packageName: 'Starter',
    selectedAddonIds: ['addon-futsal-qr'],
    hostingOptionId: 'managed-cloud',
    customRequirements: 'Wants Khalti QR scanning for 500 NPR advance deposit lock.',
    costBreakdown: {
      basePackageNPR: 30000,
      addonsTotalNPR: 9000,
      hostingMonthlyNPR: 2500,
      oneTimeTotalNPR: 39000,
      itemsRequiringQuote: [],
      currency: 'NPR',
    },
    internalNotes: [
      {
        id: 'n-3',
        timestamp: '2026-10-08T09:30:00Z',
        author: 'Lead Architect',
        text: 'Spoke with Rabin. Needs delivery within 3 weeks before upcoming winter league. Futsal demo preview shared.',
      },
    ],
    nextFollowUpDate: '2026-10-11',
    finalQuotedPriceNPR: 39000,
    assignedArchitect: 'Bikash Adhikari',
  },
  {
    id: 'req-003',
    referenceNumber: 'BW-REQ-2026-1004',
    createdAt: '2026-10-08T18:10:00Z',
    updatedAt: '2026-10-08T18:10:00Z',
    status: 'New',
    clientName: 'Prashant Maharjan',
    businessName: 'Artisan Thread Boutique',
    email: 'prashant@artisanthread.com',
    phone: '+977 9851029384',
    businessCategory: 'Retail & Fashion',
    staffCount: 6,
    branchCount: 1,
    preferredLanguage: 'English',
    primaryColor: '#0f172a',
    solutionId: 'sol-inventory',
    solutionSlug: 'inventory-sales-management',
    solutionTitle: 'Retail Inventory & Point of Sale Management',
    packageId: 'professional',
    packageName: 'Professional',
    selectedAddonIds: ['addon-receipt-printer'],
    hostingOptionId: 'managed-maintenance',
    customRequirements: 'Need thermal printer integration for 80mm ESC/POS cash slips.',
    costBreakdown: {
      basePackageNPR: 55000,
      addonsTotalNPR: 7000,
      hostingMonthlyNPR: 4500,
      oneTimeTotalNPR: 62000,
      itemsRequiringQuote: [],
      currency: 'NPR',
    },
    internalNotes: [
      {
        id: 'n-4',
        timestamp: '2026-10-08T18:10:00Z',
        author: 'System',
        text: 'Enquiry received through storefront configurator. Awaiting preliminary review.',
      },
    ],
    nextFollowUpDate: '2026-10-09',
    finalQuotedPriceNPR: 62000,
  },
];

export const storageService = {
  // REQUESTS / LEADS
  getRequests(): ProjectRequest[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(SEED_REQUESTS));
      return SEED_REQUESTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_REQUESTS;
    }
  },

  getRequestById(idOrRef: string): ProjectRequest | undefined {
    const requests = this.getRequests();
    return requests.find((r) => r.id === idOrRef || r.referenceNumber === idOrRef);
  },

  createRequest(data: Omit<ProjectRequest, 'id' | 'referenceNumber' | 'createdAt' | 'updatedAt' | 'internalNotes' | 'costBreakdown'>): ProjectRequest {
    const requests = this.getRequests();

    // Prevent accidental duplicate submissions (e.g. within last 60 seconds with same email + solution)
    const recentDuplicate = requests.find((r) => {
      const isSameEmail = r.email.toLowerCase() === data.email.toLowerCase();
      const isSameSolution = r.solutionId === data.solutionId;
      const diffSecs = (Date.now() - new Date(r.createdAt).getTime()) / 1000;
      return isSameEmail && isSameSolution && diffSecs < 60;
    });

    if (recentDuplicate) {
      return recentDuplicate;
    }

    // Authoritatively calculate cost on backend logic
    const calc = calculateEstimate({
      solutionId: data.solutionId,
      packageId: data.packageId,
      selectedAddonIds: data.selectedAddonIds,
      hostingOptionId: data.hostingOptionId,
    });

    const now = new Date().toISOString();
    const seq = String(requests.length + 101).padStart(4, '0');
    const referenceNumber = `BW-REQ-2026-${seq}`;

    const newRequest: ProjectRequest = {
      ...data,
      id: `req-${Date.now()}`,
      referenceNumber,
      createdAt: now,
      updatedAt: now,
      costBreakdown: {
        basePackageNPR: calc.basePackageNPR,
        addonsTotalNPR: calc.addonsTotalNPR,
        hostingMonthlyNPR: calc.hostingMonthlyNPR,
        oneTimeTotalNPR: calc.oneTimeTotalNPR,
        itemsRequiringQuote: calc.itemsRequiringQuote,
        currency: 'NPR',
      },
      internalNotes: [
        {
          id: `note-${Date.now()}`,
          timestamp: now,
          author: 'System Intake',
          text: `Enquiry submitted via web configurator. Estimated one-time NPR ${calc.oneTimeTotalNPR.toLocaleString()} + NPR ${calc.hostingMonthlyNPR.toLocaleString()}/mo hosting.`,
        },
      ],
    };

    requests.unshift(newRequest);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    return newRequest;
  },

  updateRequestStatus(requestId: string, status: RequestStatus, noteText?: string): ProjectRequest | null {
    const requests = this.getRequests();
    const idx = requests.findIndex((r) => r.id === requestId);
    if (idx === -1) return null;

    const req = requests[idx];
    req.status = status;
    req.updatedAt = new Date().toISOString();

    if (noteText) {
      req.internalNotes.push({
        id: `note-${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: 'Administrator',
        text: noteText,
      });
    }

    requests[idx] = req;
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    return req;
  },

  addRequestNote(requestId: string, noteText: string, author = 'Administrator'): ProjectRequest | null {
    const requests = this.getRequests();
    const idx = requests.findIndex((r) => r.id === requestId);
    if (idx === -1) return null;

    const req = requests[idx];
    req.updatedAt = new Date().toISOString();
    req.internalNotes.push({
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author,
      text: noteText,
    });

    requests[idx] = req;
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    return req;
  },

  updateRequestQuotedPrice(requestId: string, priceNPR: number): ProjectRequest | null {
    const requests = this.getRequests();
    const idx = requests.findIndex((r) => r.id === requestId);
    if (idx === -1) return null;

    const req = requests[idx];
    req.finalQuotedPriceNPR = priceNPR;
    req.updatedAt = new Date().toISOString();
    req.internalNotes.push({
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author: 'Administrator',
      text: `Official quoted price recorded: NPR ${priceNPR.toLocaleString()}`,
    });

    requests[idx] = req;
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    return req;
  },

  // DEMO APPOINTMENTS
  getDemoAppointments(): DemoAppointment[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DEMO_BOOKINGS);
    const today = getTodayString();
    if (!raw) {
      const seeded: DemoAppointment[] = [
        {
          id: 'demo-apt-1',
          bookingRef: 'VEL-8192',
          customerName: 'Samikshya Gurung',
          customerPhone: '+977 9841882233',
          customerEmail: 'samikshya@gmail.com',
          serviceId: 'srv-1',
          serviceName: 'Signature Haircut & Blowdry Styling',
          staffId: 'stf-1',
          staffName: 'Aayush Sharma',
          date: today,
          timeSlot: '11:00 AM',
          status: 'Completed',
          totalPriceNPR: 1200,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'demo-apt-2',
          bookingRef: 'VEL-8240',
          customerName: 'Dipendra Malla',
          customerPhone: '+977 9851144778',
          customerEmail: 'dipendra.m@outlook.com',
          serviceId: 'srv-2',
          serviceName: 'Deluxe Hydrafacial & Glow Treatment',
          staffId: 'stf-2',
          staffName: 'Pooja Thapa',
          date: today,
          timeSlot: '01:30 PM',
          status: 'In Progress',
          totalPriceNPR: 3500,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'demo-apt-3',
          bookingRef: 'VEL-8315',
          customerName: 'Nirupa Basnet',
          customerPhone: '+977 9801993344',
          customerEmail: 'nirupa.b@gmail.com',
          serviceId: 'srv-4',
          serviceName: 'Gel Nail Artistry & Russian Manicure',
          staffId: 'stf-3',
          staffName: 'Suman Rai',
          date: today,
          timeSlot: '03:00 PM',
          status: 'Confirmed',
          totalPriceNPR: 1800,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'demo-apt-4',
          bookingRef: 'VEL-8402',
          customerName: 'Roshan Karki',
          customerPhone: '+977 9849556677',
          customerEmail: 'roshan.karki@gmail.com',
          serviceId: 'srv-3',
          serviceName: 'Ayurvedic Botanical Hair Spa & Oil Massage',
          staffId: 'stf-1',
          staffName: 'Aayush Sharma',
          date: today,
          timeSlot: '04:30 PM',
          status: 'Confirmed',
          totalPriceNPR: 2200,
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_KEYS.DEMO_BOOKINGS, JSON.stringify(seeded));
      return seeded;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addDemoAppointment(appointment: Omit<DemoAppointment, 'id' | 'bookingRef' | 'createdAt' | 'status'>): DemoAppointment {
    const list = this.getDemoAppointments();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `VEL-${randomSuffix}`;

    const newApt: DemoAppointment = {
      ...appointment,
      id: `demo-${Date.now()}`,
      bookingRef,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    list.unshift(newApt);
    localStorage.setItem(STORAGE_KEYS.DEMO_BOOKINGS, JSON.stringify(list));
    return newApt;
  },

  updateDemoAppointmentStatus(id: string, status: DemoAppointment['status']): void {
    const list = this.getDemoAppointments();
    const idx = list.findIndex((a) => a.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      localStorage.setItem(STORAGE_KEYS.DEMO_BOOKINGS, JSON.stringify(list));
    }
  },

  resetDemoAppointments(): void {
    localStorage.removeItem(STORAGE_KEYS.DEMO_BOOKINGS);
  },

  // ADMIN AUTH
  isAdminAuthenticated(): boolean {
    const session = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    if (!session) return false;
    try {
      const data = JSON.parse(session);
      return data.authenticated === true && Date.now() < data.expiresAt;
    } catch {
      return false;
    }
  },

  loginAdmin(passcode: string): boolean {
    // Valid passcodes for demo evaluator and admin
    if (passcode === 'buildwise2026' || passcode === 'admin123' || passcode === '9042') {
      const session = {
        authenticated: true,
        email: 'admin@buildwise.np',
        role: 'super_admin',
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(session));
      return true;
    }
    return false;
  },

  logoutAdmin(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  },
};
