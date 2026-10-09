import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, Calendar, Mail, Phone, ArrowRight, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import { storageService } from '../services/storageService';
import { ProjectRequest, RequestStatus } from '../types';
import { Currency } from '../components/common/Currency';

const PIPELINE_STEPS: RequestStatus[] = [
  'New',
  'Contacted',
  'Requirements Review',
  'Proposal Sent',
  'Accepted',
  'In Development',
  'Delivered',
];

export const RequestStatusPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = useState<ProjectRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestId) {
      const found = storageService.getRequestById(requestId);
      setRequest(found || null);
    }
    setLoading(false);
  }, [requestId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-sm text-neutral-500">Loading project enquiry details...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-xl font-bold text-neutral-900">Enquiry Not Found</h1>
        <p className="text-xs text-neutral-600">
          We could not find an implementation request matching reference "{requestId}".
        </p>
        <Link
          to="/solutions"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-md"
        >
          Explore Solutions
        </Link>
      </div>
    );
  }

  const currentStepIdx = PIPELINE_STEPS.indexOf(request.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Success / Status Banner */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold font-mono tracking-wider text-neutral-500 uppercase">
            Request Reference: {request.referenceNumber}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 mt-1">
            Implementation Request Registered
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
            Thank you, {request.clientName}. Your configuration for <strong>{request.businessName}</strong> has been logged in our system.
          </p>
        </div>

        {/* Current Status Pill */}
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-900 border border-neutral-200">
            <span>Status:</span>
            <span className="font-semibold text-neutral-950">{request.status}</span>
          </span>
        </div>
      </div>

      {/* Pipeline Visual Stepper */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Delivery Pipeline Tracking
        </h2>

        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {PIPELINE_STEPS.map((step, idx) => {
            const isPassed = currentStepIdx >= idx;
            const isCurrent = request.status === step;

            return (
              <div key={step} className="flex items-center gap-2 shrink-0">
                <div
                  className={`flex items-center gap-1.5 text-xs ${
                    isCurrent
                      ? 'font-bold text-neutral-950'
                      : isPassed
                      ? 'text-neutral-700 font-medium'
                      : 'text-neutral-400'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                      isCurrent
                        ? 'bg-neutral-950 text-white'
                        : isPassed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    {isPassed ? '✓' : idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
                {idx < PIPELINE_STEPS.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-300 mx-2 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scope & Cost Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Solution Details */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-neutral-950">Configured Solution Scope</h2>

          <div className="space-y-2.5">
            <div className="flex justify-between border-b border-neutral-100 pb-2">
              <span className="text-neutral-500">Solution:</span>
              <span className="font-semibold text-neutral-900">{request.solutionTitle}</span>
            </div>

            <div className="flex justify-between border-b border-neutral-100 pb-2">
              <span className="text-neutral-500">Package Tier:</span>
              <span className="font-semibold text-neutral-900">{request.packageName}</span>
            </div>

            <div className="flex justify-between border-b border-neutral-100 pb-2">
              <span className="text-neutral-500">Hosting Selection:</span>
              <span className="font-semibold text-neutral-900">{request.hostingOptionId}</span>
            </div>

            <div className="flex justify-between border-b border-neutral-100 pb-2">
              <span className="text-neutral-500">Target Domain:</span>
              <span className="font-semibold text-neutral-900">{request.preferredDomain || 'To be decided'}</span>
            </div>

            {request.customRequirements && (
              <div className="pt-2">
                <span className="text-neutral-500 block mb-1">Custom Notes:</span>
                <p className="p-2.5 bg-neutral-50 rounded border border-neutral-200 text-neutral-700 leading-relaxed">
                  {request.customRequirements}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-neutral-950">Verified Price Breakdown</h2>

          <div className="space-y-2.5">
            <div className="flex justify-between border-b border-neutral-100 pb-2">
              <span className="text-neutral-500">Implementation Package:</span>
              <Currency amount={request.costBreakdown.basePackageNPR} className="font-semibold text-neutral-900" />
            </div>

            <div className="flex justify-between border-b border-neutral-100 pb-2">
              <span className="text-neutral-500">Add-On Modules:</span>
              <Currency amount={request.costBreakdown.addonsTotalNPR} className="font-semibold text-neutral-900" />
            </div>

            <div className="flex justify-between border-b border-neutral-100 pb-2 pt-1 font-bold text-sm text-neutral-950">
              <span>One-Time Total:</span>
              <Currency amount={request.costBreakdown.oneTimeTotalNPR} />
            </div>

            <div className="flex justify-between pt-1 text-neutral-700">
              <span className="text-neutral-500">Recurring Cloud Fee:</span>
              <span className="font-semibold">
                {request.costBreakdown.hostingMonthlyNPR === 0 ? (
                  'NPR 0 / month (Self-Hosted)'
                ) : (
                  <>
                    <Currency amount={request.costBreakdown.hostingMonthlyNPR} /> / month
                  </>
                )}
              </span>
            </div>

            {request.finalQuotedPriceNPR && (
              <div className="p-3 bg-neutral-900 text-white rounded-lg mt-3 flex justify-between items-center">
                <span>Official Quoted Proposal:</span>
                <Currency amount={request.finalQuotedPriceNPR} className="text-base text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Steps Card */}
      <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 text-xs text-neutral-700">
        <h3 className="text-sm font-bold text-neutral-900">What Happens Next?</h3>
        <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
          <li>
            <strong>Architecture Review:</strong> A software architect reviews your required modules and integrations within 24 hours.
          </li>
          <li>
            <strong>Discovery & Walkthrough:</strong> We reach out via phone/WhatsApp to demo key flows and confirm your business branding.
          </li>
          <li>
            <strong>Formal Proposal & Milestone Agreement:</strong> You receive an official written scope, milestone schedule, and 30% initial deposit invoice.
          </li>
          <li>
            <strong>Staging Access & Delivery:</strong> Within 1–2 weeks, you test your dedicated system on our staging server before going live.
          </li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-200 text-xs">
        <span className="text-neutral-500">
          Need immediate assistance? Call our project desk at +977 1 4528900
        </span>
        <div className="flex items-center gap-3">
          <Link
            to="/solutions"
            className="px-4 py-2 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md font-medium"
          >
            Browse Other Solutions
          </Link>
          <Link
            to="/solutions/salon-appointment-management/demo"
            className="px-4 py-2 text-white bg-neutral-900 hover:bg-neutral-800 rounded-md font-semibold"
          >
            Test Live Demo
          </Link>
        </div>
      </div>
    </div>
  );
};
