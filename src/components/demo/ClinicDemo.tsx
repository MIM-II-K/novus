import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Clock,
  CheckCircle2,
  Calendar,
  Users,
  LayoutDashboard,
  RotateCcw,
  Sparkles,
  Phone,
} from 'lucide-react';
import { Currency } from '../common/Currency';

interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  roomNo: string;
  feeNPR: number;
}

interface PatientToken {
  id: string;
  tokenNumber: number;
  patientName: string;
  age: number;
  phone: string;
  doctorName: string;
  roomNo: string;
  timeSlot: string;
  status: 'Waiting' | 'In Consultation' | 'Completed';
}

const DOCTORS: DoctorProfile[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sandeep Sharma, MD',
    specialty: 'Internal Medicine & Physician',
    qualifications: 'MBBS, MD (T.U. Teaching Hospital)',
    roomNo: 'Room 101',
    feeNPR: 800,
  },
  {
    id: 'doc-2',
    name: 'Dr. Anjana Basnet, MDS',
    specialty: 'Dental Surgeon & Orthodontist',
    qualifications: 'BDS, MDS (Kathmandu University)',
    roomNo: 'Dental Bay 1',
    feeNPR: 600,
  },
  {
    id: 'doc-3',
    name: 'Dr. Roshni Joshi, MD',
    specialty: 'Consultant Dermatologist & Cosmetologist',
    qualifications: 'MBBS, MD Dermatology (BPKIHS)',
    roomNo: 'Room 204',
    feeNPR: 900,
  },
];

const INITIAL_TOKENS: PatientToken[] = [
  {
    id: 'tok-1',
    tokenNumber: 11,
    patientName: 'Gita Subedi',
    age: 44,
    phone: '+977 9841334455',
    doctorName: 'Dr. Sandeep Sharma, MD',
    roomNo: 'Room 101',
    timeSlot: '10:30 AM',
    status: 'Completed',
  },
  {
    id: 'tok-2',
    tokenNumber: 12,
    patientName: 'Subash Shrestha',
    age: 32,
    phone: '+977 9851122334',
    doctorName: 'Dr. Sandeep Sharma, MD',
    roomNo: 'Room 101',
    timeSlot: '11:00 AM',
    status: 'In Consultation',
  },
  {
    id: 'tok-3',
    tokenNumber: 13,
    patientName: 'Manita Rai',
    age: 26,
    phone: '+977 9801889900',
    doctorName: 'Dr. Sandeep Sharma, MD',
    roomNo: 'Room 101',
    timeSlot: '11:30 AM',
    status: 'Waiting',
  },
];

export const ClinicDemo: React.FC = () => {
  const [viewMode, setViewMode] = useState<'patient' | 'reception'>('patient');
  const [tokens, setTokens] = useState<PatientToken[]>(INITIAL_TOKENS);
  const [selectedDocId, setSelectedDocId] = useState(DOCTORS[0].id);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState(28);
  const [patientPhone, setPatientPhone] = useState('');
  const [confirmedToken, setConfirmedToken] = useState<PatientToken | null>(null);

  const activeDoc = DOCTORS.find((d) => d.id === selectedDocId) || DOCTORS[0];

  const handleBookToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      alert('Please enter patient name and contact number.');
      return;
    }

    const nextTokenNum = tokens.length + 11;
    const newToken: PatientToken = {
      id: `tok-${Date.now()}`,
      tokenNumber: nextTokenNum,
      patientName,
      age: patientAge,
      phone: patientPhone,
      doctorName: activeDoc.name,
      roomNo: activeDoc.roomNo,
      timeSlot: '12:00 PM',
      status: 'Waiting',
    };

    setTokens([...tokens, newToken]);
    setConfirmedToken(newToken);
  };

  const handleProgressToken = (id: string, nextStatus: PatientToken['status']) => {
    setTokens((prev) => prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)));
  };

  const handleReset = () => {
    if (confirm('Reset OPD queue tokens?')) {
      setTokens(INITIAL_TOKENS);
      setConfirmedToken(null);
    }
  };

  const currentCalling = tokens.find((t) => t.status === 'In Consultation');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-neutral-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900 text-sm">Aura Polyclinic & Diagnostic Care</span>
            <span className="text-neutral-300" aria-hidden="true">·</span>
            <span className="text-xs text-neutral-500">Doctor Appointment & Queue Demo</span>
          </div>
          <p className="text-xs text-neutral-500">
            Simulate digital patient consultation tokens and real-time OPD reception queue dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-neutral-100 rounded-lg border border-neutral-200">
            <button
              onClick={() => setViewMode('patient')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                viewMode === 'patient'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              Patient Token Booking
            </button>
            <button
              onClick={() => setViewMode('reception')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                viewMode === 'reception'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              OPD Queue Display
            </button>
          </div>

          <button
            onClick={handleReset}
            title="Reset OPD tokens"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PATIENT VIEW */}
      {viewMode === 'patient' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Aura Polyclinic — OPD Consultation Token
              </h2>
              <p className="text-xs text-neutral-500">
                Book consultation without long hospital waiting queues. Pay fee at clinic reception.
              </p>
            </div>
            <Stethoscope className="w-8 h-8 text-neutral-400 stroke-[1.5]" />
          </div>

          {confirmedToken ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center space-y-5">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                  Token Confirmed
                </span>
                <h3 className="text-3xl font-extrabold text-neutral-950 font-mono pt-2">
                  OPD TOKEN #{confirmedToken.tokenNumber}
                </h3>
                <p className="text-xs text-neutral-500">
                  Patient: {confirmedToken.patientName} (Age: {confirmedToken.age})
                </p>
              </div>

              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-xs space-y-2 max-w-sm mx-auto text-left">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Consultant:</span>
                  <span className="font-semibold text-neutral-900">{confirmedToken.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Consulting Room:</span>
                  <span className="font-semibold text-neutral-900">{confirmedToken.roomNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Expected Time:</span>
                  <span className="font-semibold text-neutral-900">{confirmedToken.timeSlot}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setViewMode('reception')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md"
                >
                  View Live OPD Queue Status →
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookToken} className="space-y-6">
              {/* Doctor Selection */}
              <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-3">
                <h3 className="text-sm font-bold text-neutral-900">Select Specialist Doctor</h3>
                <div className="grid grid-cols-1 gap-3">
                  {DOCTORS.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                        selectedDocId === doc.id
                          ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-neutral-900 text-sm block">{doc.name}</span>
                        <span className="text-neutral-600 block">{doc.specialty}</span>
                        <span className="text-[11px] text-neutral-400">{doc.qualifications} · {doc.roomNo}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-500 block">Consultation Fee</span>
                        <Currency amount={doc.feeNPR} className="font-bold text-neutral-950 text-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patient Information */}
              <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 text-xs">
                <h3 className="text-sm font-bold text-neutral-900">Patient Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="font-medium text-neutral-700 block mb-1">Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Rameshwor Pandey"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-neutral-700 block mb-1">Age *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={110}
                      value={patientAge}
                      onChange={(e) => setPatientAge(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Mobile Contact *</label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors"
                >
                  Generate Digital OPD Token
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* OPD QUEUE VIEW */}
      {viewMode === 'reception' && (
        <div className="space-y-6">
          {/* Active Calling Box */}
          <div className="bg-neutral-900 text-white rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                ● Now Calling in Doctor Chamber
              </span>
              <h3 className="text-3xl font-extrabold font-mono text-white">
                TOKEN #{currentCalling ? currentCalling.tokenNumber : '--'}
              </h3>
              <p className="text-xs text-neutral-400">
                Patient: {currentCalling ? currentCalling.patientName : 'No active patient'} · Room: {currentCalling ? currentCalling.roomNo : '101'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {currentCalling && (
                <button
                  onClick={() => handleProgressToken(currentCalling.id, 'Completed')}
                  className="px-4 py-2 font-semibold text-neutral-900 bg-emerald-400 hover:bg-emerald-300 rounded-md text-xs transition-colors"
                >
                  Mark Attended & Complete
                </button>
              )}
            </div>
          </div>

          {/* Tokens Queue Table */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="p-5 border-b border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-900">OPD Patient Queue ({tokens.length})</h3>
              <p className="text-xs text-neutral-500">Live reception desk queue management.</p>
            </div>

            <div className="overflow-x-auto p-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500">
                    <th className="pb-3 font-semibold">Token</th>
                    <th className="pb-3 font-semibold">Patient Name</th>
                    <th className="pb-3 font-semibold">Consultant Doctor</th>
                    <th className="pb-3 font-semibold">Chamber</th>
                    <th className="pb-3 font-semibold">Time</th>
                    <th className="pb-3 font-semibold">Queue Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {tokens.map((t) => (
                    <tr key={t.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 font-mono font-extrabold text-sm text-neutral-950">
                        #{t.tokenNumber}
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-neutral-900 block">{t.patientName}</span>
                        <span className="text-[11px] text-neutral-500">Age: {t.age} · {t.phone}</span>
                      </td>
                      <td className="py-3 font-medium text-neutral-800">{t.doctorName}</td>
                      <td className="py-3 font-mono text-neutral-600">{t.roomNo}</td>
                      <td className="py-3 text-neutral-600">{t.timeSlot}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                            t.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : t.status === 'In Consultation'
                              ? 'bg-blue-50 text-blue-800 border-blue-200 font-bold'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {t.status === 'Waiting' && (
                          <button
                            onClick={() => handleProgressToken(t.id, 'In Consultation')}
                            className="px-2.5 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                          >
                            Call Next
                          </button>
                        )}
                        {t.status === 'In Consultation' && (
                          <button
                            onClick={() => handleProgressToken(t.id, 'Completed')}
                            className="px-2.5 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                          >
                            Finish
                          </button>
                        )}
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
