import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  CheckCircle2,
  FileText,
  Clock,
  Car,
  LayoutDashboard,
  RotateCcw,
  Sparkles,
  Phone,
  Send,
} from 'lucide-react';
import { Currency } from '../common/Currency';

interface ServiceItem {
  id: string;
  name: string;
  priceNPR: number;
}

interface JobCard {
  id: string;
  jobNumber: string;
  plateNumber: string;
  vehicleModel: string;
  ownerName: string;
  ownerPhone: string;
  services: ServiceItem[];
  totalNPR: number;
  assignedMechanic: string;
  status: 'Intake' | 'In Bay Service' | 'Ready for Pickup' | 'Completed';
}

const SERVICE_ITEMS: ServiceItem[] = [
  { id: 'srv-oil', name: 'Synthetic Engine Oil 5W-30 (4 Liters)', priceNPR: 4200 },
  { id: 'srv-filter', name: 'OEM Certified Engine Oil Filter', priceNPR: 650 },
  { id: 'srv-brake', name: 'Front Ceramic Brake Pads & Rotor Polish', priceNPR: 3800 },
  { id: 'srv-scan', name: 'Full OBD-II Computer ECU Diagnostic Scan', priceNPR: 1500 },
  { id: 'srv-labor', name: 'General Bay Labor & Underbody Pressure Wash', priceNPR: 1200 },
];

const INITIAL_JOBS: JobCard[] = [
  {
    id: 'job-1',
    jobNumber: 'JOB-2026-441',
    plateNumber: 'BA 12 PA 4892',
    vehicleModel: 'Hyundai Creta 1.5 SX (2022)',
    ownerName: 'Bikash Adhikari',
    ownerPhone: '+977 9841889911',
    services: [SERVICE_ITEMS[0], SERVICE_ITEMS[1], SERVICE_ITEMS[4]],
    totalNPR: 6050,
    assignedMechanic: 'Raju Magar (Master Tech)',
    status: 'In Bay Service',
  },
  {
    id: 'job-2',
    jobNumber: 'JOB-2026-442',
    plateNumber: 'PRA 03-01 PA 9042',
    vehicleModel: 'Suzuki Vitara Brezza (2021)',
    ownerName: 'Nabin Khadka',
    ownerPhone: '+977 9851144002',
    services: [SERVICE_ITEMS[2], SERVICE_ITEMS[3]],
    totalNPR: 5300,
    assignedMechanic: 'Sanjay Thapa (Brake Tech)',
    status: 'Ready for Pickup',
  },
];

export const AutoDemo: React.FC = () => {
  const [viewMode, setViewMode] = useState<'intake' | 'bay'>('intake');
  const [jobs, setJobs] = useState<JobCard[]>(() => {
    const raw = localStorage.getItem('lumniscate_auto_demo_v1');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return INITIAL_JOBS;
      }
    }
    return INITIAL_JOBS;
  });

  const [plateNumber, setPlateNumber] = useState('BA 14 PA 7721');
  const [vehicleModel, setVehicleModel] = useState('Toyota RAV4 Hybrid');
  const [ownerName, setOwnerName] = useState('Kamal Shrestha');
  const [ownerPhone, setOwnerPhone] = useState('+977 9801223344');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([
    'srv-oil',
    'srv-filter',
  ]);
  const [generatedJobCard, setGeneratedJobCard] = useState<JobCard | null>(null);
  const [pickupSmsAlert, setPickupSmsAlert] = useState<string | null>(null);

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedServices = SERVICE_ITEMS.filter((s) => selectedServiceIds.includes(s.id));
  const estimatedCost = selectedServices.reduce((sum, s) => sum + s.priceNPR, 0);

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      alert('Please select at least one repair service.');
      return;
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newJob: JobCard = {
      id: `job-${Date.now()}`,
      jobNumber: `JOB-2026-${randomSuffix}`,
      plateNumber,
      vehicleModel,
      ownerName,
      ownerPhone,
      services: selectedServices,
      totalNPR: estimatedCost,
      assignedMechanic: 'Raju Magar (Master Tech)',
      status: 'Intake',
    };

    const updated = [newJob, ...jobs];
    setJobs(updated);
    localStorage.setItem('lumniscate_auto_demo_v1', JSON.stringify(updated));
    setGeneratedJobCard(newJob);
  };

  const handleStatusProgress = (id: string, status: JobCard['status']) => {
    const updated = jobs.map((j) => (j.id === id ? { ...j, status } : j));
    setJobs(updated);
    localStorage.setItem('lumniscate_auto_demo_v1', JSON.stringify(updated));
  };

  const handleNotifyCustomerPickup = (job: JobCard) => {
    setPickupSmsAlert(
      `SMS notification dispatched to ${job.ownerName} (${job.ownerPhone}): "Your vehicle ${job.plateNumber} is ready for collection at Elite Apex Auto Care."`
    );
    setTimeout(() => setPickupSmsAlert(null), 4000);
  };

  const handleReset = () => {
    if (confirm('Reset workshop job cards?')) {
      setJobs(INITIAL_JOBS);
      localStorage.setItem('lumniscate_auto_demo_v1', JSON.stringify(INITIAL_JOBS));
      setGeneratedJobCard(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-neutral-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900 text-sm">Elite Apex Auto Care</span>
            <span className="text-neutral-300" aria-hidden="true">·</span>
            <span className="text-xs text-neutral-500">Auto Workshop & Job Card Demo</span>
          </div>
          <p className="text-xs text-neutral-500">
            Interactive demo: digital vehicle job card intake, spare parts billing, and bay technician dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-neutral-100 rounded-lg border border-neutral-200">
            <button
              onClick={() => setViewMode('intake')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                viewMode === 'intake'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Vehicle Intake Job Card
            </button>
            <button
              onClick={() => setViewMode('bay')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                viewMode === 'bay'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Service Bay Board
            </button>
          </div>

          <button
            onClick={handleReset}
            title="Reset sample workshop jobs"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {pickupSmsAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
          <Send className="w-3.5 h-3.5" />
          <span>{pickupSmsAlert}</span>
        </div>
      )}

      {/* INTAKE VIEW */}
      {viewMode === 'intake' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-neutral-500 uppercase">Vehicle Entry Gate</span>
              <h2 className="text-lg font-bold text-neutral-900 mt-0.5">
                Elite Apex Auto — Vehicle Job Card
              </h2>
              <p className="text-xs text-neutral-500">
                Log customer complaints, assign technicians, and link spare parts from the storeroom.
              </p>
            </div>
            <Wrench className="w-8 h-8 text-neutral-400 stroke-[1.5]" />
          </div>

          {generatedJobCard ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center space-y-5">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                  Job Card Created
                </span>
                <h3 className="text-2xl font-bold text-neutral-950 font-mono pt-1">
                  {generatedJobCard.jobNumber}
                </h3>
                <p className="text-xs text-neutral-500">
                  Vehicle: {generatedJobCard.plateNumber} ({generatedJobCard.vehicleModel})
                </p>
              </div>

              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-xs space-y-2 max-w-sm mx-auto text-left">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Owner:</span>
                  <span className="font-semibold text-neutral-900">{generatedJobCard.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Assigned Tech:</span>
                  <span className="font-semibold text-neutral-900">{generatedJobCard.assignedMechanic}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200 font-bold">
                  <span>Estimated Total:</span>
                  <Currency amount={generatedJobCard.totalNPR} />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setViewMode('bay')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md"
                >
                  View in Workshop Bay Board →
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateJob} className="space-y-6">
              {/* Vehicle & Owner Info */}
              <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 text-xs">
                <h3 className="text-sm font-bold text-neutral-900">Vehicle Identification & Client</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium text-neutral-700 block mb-1">
                      License Plate Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                      placeholder="e.g. BA 14 PA 7721"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md font-mono text-sm focus:border-neutral-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-neutral-700 block mb-1">
                      Vehicle Model *
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      placeholder="e.g. Toyota RAV4"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium text-neutral-700 block mb-1">Owner Name *</label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Kamal Shrestha"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-neutral-700 block mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      placeholder="+977 98XXXXXXXX"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Service Operations Checklist */}
              <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 text-xs">
                <h3 className="text-sm font-bold text-neutral-900">Requested Repairs & Parts</h3>

                <div className="space-y-2.5">
                  {SERVICE_ITEMS.map((srv) => (
                    <label
                      key={srv.id}
                      className="p-3 rounded-lg border border-neutral-200 flex items-center justify-between cursor-pointer hover:bg-neutral-50"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={selectedServiceIds.includes(srv.id)}
                          onChange={() => toggleService(srv.id)}
                          className="rounded text-neutral-900"
                        />
                        <span className="font-medium text-neutral-800">{srv.name}</span>
                      </div>
                      <Currency amount={srv.priceNPR} className="font-semibold text-neutral-900" />
                    </label>
                  ))}
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between font-bold text-sm">
                  <span>Estimated Total:</span>
                  <Currency amount={estimatedCost} />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors text-xs"
                >
                  Generate Intake Job Card
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* SERVICE BAY BOARD VIEW */}
      {viewMode === 'bay' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Active Job Cards</span>
              <p className="text-2xl font-bold font-mono text-neutral-900">{jobs.length}</p>
              <span className="text-[11px] text-neutral-500">Vehicles in garage</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Service Bay Utilization</span>
              <p className="text-2xl font-bold font-mono text-neutral-900">3 / 4 Bays</p>
              <span className="text-[11px] text-neutral-500">Hydraulic lifts loaded</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Ready for Collection</span>
              <p className="text-2xl font-bold font-mono text-emerald-700">
                {jobs.filter((j) => j.status === 'Ready for Pickup').length}
              </p>
              <span className="text-[11px] text-neutral-500">Awaiting customer collection</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Mechanic Staff</span>
              <p className="text-2xl font-bold font-mono text-neutral-900">4 Techs</p>
              <span className="text-[11px] text-neutral-500">All shifts covered</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="p-5 border-b border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-900">Workshop Floor Job Register</h3>
              <p className="text-xs text-neutral-500">Update bay progress and notify customers when work is done.</p>
            </div>

            <div className="overflow-x-auto p-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500">
                    <th className="pb-3 font-semibold">Job Card #</th>
                    <th className="pb-3 font-semibold">Vehicle</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Mechanic</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Bay Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {jobs.map((j) => (
                    <tr key={j.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 font-mono font-bold text-neutral-900">{j.jobNumber}</td>
                      <td className="py-3">
                        <span className="font-mono font-semibold text-neutral-900 block">{j.plateNumber}</span>
                        <span className="text-[11px] text-neutral-500">{j.vehicleModel}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-neutral-900 block">{j.ownerName}</span>
                        <span className="text-[11px] text-neutral-500">{j.ownerPhone}</span>
                      </td>
                      <td className="py-3 text-neutral-700">{j.assignedMechanic}</td>
                      <td className="py-3">
                        <Currency amount={j.totalNPR} className="font-semibold text-neutral-900" />
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                            j.status === 'Ready for Pickup'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                              : j.status === 'In Bay Service'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {j.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {j.status === 'Intake' && (
                            <button
                              onClick={() => handleStatusProgress(j.id, 'In Bay Service')}
                              className="px-2 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                            >
                              Start Bay
                            </button>
                          )}
                          {j.status === 'In Bay Service' && (
                            <button
                              onClick={() => handleStatusProgress(j.id, 'Ready for Pickup')}
                              className="px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                            >
                              Ready
                            </button>
                          )}
                          {j.status === 'Ready for Pickup' && (
                            <button
                              onClick={() => handleNotifyCustomerPickup(j)}
                              className="px-2 py-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 inline-flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>SMS Pickup</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
