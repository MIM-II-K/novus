import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle2, Layers } from 'lucide-react';
import { SolutionItem } from '../../types';
import { Currency } from '../common/Currency';

interface SolutionCardProps {
  solution: SolutionItem;
}

export const SolutionCard: React.FC<SolutionCardProps> = ({ solution }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Solution Image with Fallback */}
        <div className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden border-b border-neutral-100">
          {!imageError ? (
            <img
              src={solution.imagePath}
              alt={solution.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 text-neutral-400 p-6 text-center">
              <Layers className="w-8 h-8 mb-2 stroke-[1.5]" />
              <span className="text-xs font-medium text-neutral-600">{solution.title}</span>
            </div>
          )}

          {/* Quiet Status Marker */}
          <div className="absolute top-3 right-3">
            <span
              className={`text-xs font-medium px-2 py-1 rounded bg-white/95 backdrop-blur-sm border shadow-xs ${
                solution.status === 'Available'
                  ? 'border-emerald-200 text-emerald-800'
                  : solution.status === 'In Development'
                  ? 'border-amber-200 text-amber-800'
                  : 'border-neutral-200 text-neutral-600'
              }`}
            >
              {solution.status}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Metadata Row: Category and Delivery Timeline (Zero-Pill) */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <span>{solution.category}</span>
            <span aria-hidden="true">·</span>
            <span>Est. {solution.estimatedDeliveryWeeks}</span>
          </div>

          <h3 className="text-lg font-bold text-neutral-900 tracking-tight mb-2 group-hover:text-neutral-700 transition-colors">
            <Link to={`/solutions/${solution.slug}`}>{solution.title}</Link>
          </h3>

          <p className="text-sm text-neutral-600 leading-relaxed mb-4 line-clamp-2">
            {solution.shortDescription}
          </p>

          {/* Key Capabilities */}
          <ul className="space-y-1.5 mb-6 text-xs text-neutral-600">
            {solution.mainBenefits.slice(0, 3).map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Strip with Pricing & Actions */}
      <div className="p-6 pt-0 border-t border-neutral-100 flex flex-col gap-3">
        <div className="flex items-baseline justify-between pt-4">
          <span className="text-xs text-neutral-500">Starting implementation</span>
          <Currency amount={solution.startingPriceNPR} className="text-base text-neutral-900" />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {solution.demoAvailable ? (
            <Link
              to={solution.demoPath || `/solutions/${solution.slug}/demo`}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap"
            >
              <Play className="w-3 h-3 fill-neutral-900" />
              Try Demo
            </Link>
          ) : (
            <span className="inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-neutral-400 bg-neutral-50 rounded-md border border-neutral-100 cursor-not-allowed whitespace-nowrap">
              Demo Soon
            </span>
          )}

          <Link
            to={`/solutions/${solution.slug}`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors whitespace-nowrap"
          >
            <span>Explore</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
};
