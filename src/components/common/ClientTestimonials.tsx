import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Building2,
  MapPin,
  TrendingUp,
  ArrowRight,
  Play,
  Quote,
  CheckCircle2,
} from 'lucide-react';

export interface TestimonialItem {
  id: string;
  clientName: string;
  role: string;
  company: string;
  location: string;
  solutionSlug: string;
  solutionTitle: string;
  metricHighlight: string;
  content: string;
  rating: number;
  verifiedImplementation: boolean;
  implementedDate: string;
}

export const ClientTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Fetch from local JSON mock
    fetch('/src/data/testimonials.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch local testimonials mock`);
        return res.json();
      })
      .then((data: TestimonialItem[]) => {
        if (isMounted) {
          setTestimonials(data);
          setLoading(false);
        }
      })
      .catch((fetchErr) => {
        // Fallback to static module import to ensure zero broken preview states
        import('../../data/testimonials.json')
          .then((mod) => {
            if (isMounted) {
              const loaded = (mod.default || mod) as TestimonialItem[];
              setTestimonials(loaded);
              setLoading(false);
            }
          })
          .catch((importErr) => {
            if (isMounted) {
              setError('Unable to load client testimonials at this time.');
              setLoading(false);
            }
          });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { label: 'All Reviews', value: 'All' },
    { label: 'Booking & Salons', value: 'salon-appointment-management' },
    { label: 'Futsal & Sports', value: 'futsal-court-booking' },
    { label: 'Hospitality & Resorts', value: 'hotel-resort-reservation-system' },
    { label: 'Legal & Consulting', value: 'professional-service-management' },
    { label: 'Retail & Pharmacy', value: 'pharmacy-expiry-stock-billing' },
  ];

  const filteredTestimonials = testimonials.filter((item) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'salon-appointment-management') {
      return item.solutionSlug === 'salon-appointment-management';
    }
    if (selectedCategory === 'futsal-court-booking') {
      return item.solutionSlug === 'futsal-court-booking';
    }
    if (selectedCategory === 'hotel-resort-reservation-system') {
      return (
        item.solutionSlug === 'hotel-resort-reservation-system' ||
        item.solutionSlug === 'hospitality-reservation-system'
      );
    }
    if (selectedCategory === 'professional-service-management') {
      return item.solutionSlug === 'professional-service-management';
    }
    if (selectedCategory === 'pharmacy-expiry-stock-billing') {
      return item.solutionSlug === 'pharmacy-expiry-stock-billing';
    }
    return true;
  });

  return (
    <section className="bg-neutral-50/70 border-y border-neutral-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified Implementation Outcomes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
              Trusted by Growing Businesses in Nepal
            </h2>
            <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
              Real business owners who replaced spreadsheets, eliminated phone scheduling chaos, and launched custom software without costly agency retainers.
            </p>
          </div>

          {/* Social Proof Metric Highlights */}
          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-neutral-200 pt-4 md:pt-0 md:pl-8 text-neutral-800">
            <div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <div className="text-sm font-bold text-neutral-900 mt-1">4.9 / 5.0 Rating</div>
              <div className="text-[11px] text-neutral-500">Verified Client Feedback</div>
            </div>

            <div className="w-px h-10 bg-neutral-200 hidden sm:block" />

            <div>
              <div className="text-base font-bold text-neutral-900">10–14 Days</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Average Launch Time</div>
              <div className="text-[10px] text-emerald-600 font-medium">Turn-key delivery</div>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Content State: Loading, Error, or Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4 animate-pulse"
              >
                <div className="h-4 bg-neutral-200 rounded w-1/3" />
                <div className="h-6 bg-neutral-200 rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-neutral-100 rounded w-full" />
                  <div className="h-3 bg-neutral-100 rounded w-5/6" />
                  <div className="h-3 bg-neutral-100 rounded w-4/6" />
                </div>
                <div className="pt-4 border-t border-neutral-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-200" />
                  <div className="space-y-1 flex-1">
                    <div className="h-3 bg-neutral-200 rounded w-1/2" />
                    <div className="h-2.5 bg-neutral-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center text-xs text-neutral-500">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-neutral-300 transition-all flex flex-col justify-between shadow-xs space-y-5"
              >
                {/* Card Top: Stars & Metric Badge */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Client</span>
                    </div>
                  </div>

                  {/* Operational Metric Highlight */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item.metricHighlight}</span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs text-neutral-600 leading-relaxed italic">
                    "{item.content}"
                  </p>
                </div>

                {/* Card Bottom: Client Info & Solution Link */}
                <div className="pt-4 border-t border-neutral-100 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-neutral-900 leading-tight">
                        {item.clientName}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5 font-medium">
                        {item.role} · {item.company}
                      </div>
                      <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-neutral-300" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Solution association & Live Demo link */}
                  <div className="bg-neutral-50/80 rounded-md p-2 flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-neutral-500 truncate" title={item.solutionTitle}>
                      {item.solutionTitle}
                    </span>

                    <Link
                      to={`/solutions/${item.solutionSlug}/demo`}
                      className="text-neutral-900 hover:text-black font-semibold inline-flex items-center gap-1 shrink-0 group"
                    >
                      <span>Try Demo</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Social Proof Bar */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 font-bold shrink-0">
              <Quote className="w-4 h-4 text-neutral-500" />
            </div>
            <div>
              <span className="font-semibold text-neutral-900">Want to test before requesting an estimate?</span>
              <p className="text-[11px] text-neutral-500">
                All software solutions feature fully functioning interactive customer and admin sandboxes.
              </p>
            </div>
          </div>

          <Link
            to="/demo"
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <Play className="w-3 h-3" />
            <span>Launch Interactive Demo Sandbox</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
