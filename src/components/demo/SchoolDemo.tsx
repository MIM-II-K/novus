import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Receipt,
  CheckCircle2,
  Send,
  Users,
  LayoutDashboard,
  RotateCcw,
  Sparkles,
  Phone,
  AlertTriangle,
} from 'lucide-react';
import { Currency } from '../common/Currency';

interface StudentRecord {
  id: string;
  rollNo: string;
  name: string;
  grade: string;
  parentName: string;
  parentPhone: string;
  tuitionFeeNPR: number;
  labFeeNPR: number;
  busFeeNPR: number;
  mealFeeNPR: number;
  status: 'Paid' | 'Pending Dues' | 'Late Warning';
  challanNo: string;
}

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 'stu-1',
    rollNo: '8A-14',
    name: 'Aaryan Shrestha',
    grade: 'Grade 8 — Section A',
    parentName: 'Ramesh Shrestha',
    parentPhone: '+977 9841339900',
    tuitionFeeNPR: 4500,
    labFeeNPR: 800,
    busFeeNPR: 1500,
    mealFeeNPR: 1200,
    status: 'Pending Dues',
    challanNo: 'CHL-2026-8812',
  },
  {
    id: 'stu-2',
    rollNo: '10B-08',
    name: 'Sneha Thapa',
    grade: 'Grade 10 — Section B',
    parentName: 'Binod Thapa',
    parentPhone: '+977 9851098765',
    tuitionFeeNPR: 5200,
    labFeeNPR: 1200,
    busFeeNPR: 1800,
    mealFeeNPR: 0,
    status: 'Paid',
    challanNo: 'CHL-2026-8813',
  },
  {
    id: 'stu-3',
    rollNo: '4C-21',
    name: 'Rohan Maharjan',
    grade: 'Grade 4 — Section C',
    parentName: 'Pooja Maharjan',
    parentPhone: '+977 9801224466',
    tuitionFeeNPR: 3800,
    labFeeNPR: 500,
    busFeeNPR: 1400,
    mealFeeNPR: 1000,
    status: 'Late Warning',
    challanNo: 'CHL-2026-8814',
  },
];

export const SchoolDemo: React.FC = () => {
  const [viewMode, setViewMode] = useState<'parent' | 'accountant'>('parent');
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    const raw = localStorage.getItem('buildwise_school_demo_v1');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return INITIAL_STUDENTS;
      }
    }
    return INITIAL_STUDENTS;
  });

  const [selectedStudentId, setSelectedStudentId] = useState(students[0].id);
  const [paymentSuccessSlip, setPaymentSuccessSlip] = useState<StudentRecord | null>(null);
  const [smsSentAlert, setSmsSentAlert] = useState<string | null>(null);

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const totalDue =
    activeStudent.tuitionFeeNPR +
    activeStudent.labFeeNPR +
    activeStudent.busFeeNPR +
    activeStudent.mealFeeNPR;

  const handlePayFee = () => {
    const updated = students.map((s) =>
      s.id === activeStudent.id ? { ...s, status: 'Paid' as const } : s
    );
    setStudents(updated);
    localStorage.setItem('buildwise_school_demo_v1', JSON.stringify(updated));
    setPaymentSuccessSlip({ ...activeStudent, status: 'Paid' });
  };

  const handleSendSmsReminder = (student: StudentRecord) => {
    setSmsSentAlert(`SMS reminder sent to parent ${student.parentName} (${student.parentPhone})`);
    setTimeout(() => setSmsSentAlert(null), 3500);
  };

  const handleReset = () => {
    if (confirm('Reset student fee records?')) {
      setStudents(INITIAL_STUDENTS);
      localStorage.setItem('buildwise_school_demo_v1', JSON.stringify(INITIAL_STUDENTS));
      setPaymentSuccessSlip(null);
    }
  };

  const collectedFees = students
    .filter((s) => s.status === 'Paid')
    .reduce((sum, s) => sum + (s.tuitionFeeNPR + s.labFeeNPR + s.busFeeNPR + s.mealFeeNPR), 0);

  const pendingDues = students
    .filter((s) => s.status !== 'Paid')
    .reduce((sum, s) => sum + (s.tuitionFeeNPR + s.labFeeNPR + s.busFeeNPR + s.mealFeeNPR), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-neutral-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900 text-sm">St. Andrew's Academy & High School</span>
            <span className="text-neutral-300" aria-hidden="true">·</span>
            <span className="text-xs text-neutral-500">Student Fee Billing & Portal Demo</span>
          </div>
          <p className="text-xs text-neutral-500">
            Interactive demo: digital fee challan payment, parent SMS alerts, and accountant dues register.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-neutral-100 rounded-lg border border-neutral-200">
            <button
              onClick={() => setViewMode('parent')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                viewMode === 'parent'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Parent Fee Portal
            </button>
            <button
              onClick={() => setViewMode('accountant')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                viewMode === 'accountant'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Accountant Ledger Console
            </button>
          </div>

          <button
            onClick={handleReset}
            title="Reset sample school records"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {smsSentAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
          <Send className="w-3.5 h-3.5" />
          <span>{smsSentAlert}</span>
        </div>
      )}

      {/* PARENT VIEW */}
      {viewMode === 'parent' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-neutral-500 uppercase">Parent Online Portal</span>
              <h2 className="text-lg font-bold text-neutral-900 mt-0.5">
                St. Andrew's Academy — Monthly Fee Challan
              </h2>
              <p className="text-xs text-neutral-500">
                View student vouchers and settle fees without standing in school administration queues.
              </p>
            </div>
            <GraduationCap className="w-8 h-8 text-neutral-400 stroke-[1.5]" />
          </div>

          {/* Student Selector */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Select Student Profile:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {students.map((stu) => (
                <div
                  key={stu.id}
                  onClick={() => setSelectedStudentId(stu.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all text-xs ${
                    selectedStudentId === stu.id
                      ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <span className="font-bold text-neutral-900 block">{stu.name}</span>
                  <span className="text-[11px] text-neutral-500 block">{stu.grade}</span>
                  <span
                    className={`inline-block mt-2 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      stu.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {stu.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Voucher Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="font-mono text-neutral-400 block text-[11px]">Challan #{activeStudent.challanNo}</span>
                <h3 className="text-sm font-bold text-neutral-950">
                  Billing Period: Kartik / Mangsir 2026
                </h3>
              </div>
              <span
                className={`px-2 py-1 rounded font-bold text-xs ${
                  activeStudent.status === 'Paid'
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {activeStudent.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-neutral-600">
                <span>Tuition & Instructional Fee:</span>
                <Currency amount={activeStudent.tuitionFeeNPR} className="font-semibold text-neutral-900" />
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Computer Science & STEM Lab:</span>
                <Currency amount={activeStudent.labFeeNPR} className="font-semibold text-neutral-900" />
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>School Bus Route Transport:</span>
                <Currency amount={activeStudent.busFeeNPR} className="font-semibold text-neutral-900" />
              </div>
              {activeStudent.mealFeeNPR > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Day Boarding & Tiffin Program:</span>
                  <Currency amount={activeStudent.mealFeeNPR} className="font-semibold text-neutral-900" />
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-neutral-200 text-sm font-bold text-neutral-950">
                <span>Total Fee Amount:</span>
                <Currency amount={totalDue} />
              </div>
            </div>

            {activeStudent.status !== 'Paid' ? (
              <div className="pt-2">
                <button
                  onClick={handlePayFee}
                  className="w-full py-3 font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors"
                >
                  Pay via eSewa / Bank Deposit (Simulated)
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 text-center font-medium">
                ✓ Dues cleared. Digital receipt issued on student record.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACCOUNTANT CONSOLE VIEW */}
      {viewMode === 'accountant' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Total Enrolled Students</span>
              <p className="text-2xl font-bold font-mono text-neutral-900">{students.length}</p>
              <span className="text-[11px] text-neutral-500">Sample active roll</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Total Fees Collected</span>
              <Currency amount={collectedFees} className="text-2xl font-bold text-emerald-700 block" />
              <span className="text-[11px] text-neutral-500">Cleared through portal & bank</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Outstanding Dues</span>
              <Currency amount={pendingDues} className="text-2xl font-bold text-amber-700 block" />
              <span className="text-[11px] text-neutral-500">Awaiting parent clearance</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">SMS Gateway Status</span>
              <p className="text-2xl font-bold font-mono text-neutral-900">Online</p>
              <span className="text-[11px] text-neutral-500">Sparrow SMS connected</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="p-5 border-b border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-900">Student Monthly Fee Roll</h3>
              <p className="text-xs text-neutral-500">Click "Send SMS Reminder" to ping parents of pending students.</p>
            </div>

            <div className="overflow-x-auto p-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500">
                    <th className="pb-3 font-semibold">Roll #</th>
                    <th className="pb-3 font-semibold">Student Name</th>
                    <th className="pb-3 font-semibold">Grade</th>
                    <th className="pb-3 font-semibold">Parent & Contact</th>
                    <th className="pb-3 font-semibold">Total Fee</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {students.map((s) => {
                    const fee = s.tuitionFeeNPR + s.labFeeNPR + s.busFeeNPR + s.mealFeeNPR;
                    return (
                      <tr key={s.id} className="hover:bg-neutral-50/50">
                        <td className="py-3 font-mono font-bold text-neutral-900">{s.rollNo}</td>
                        <td className="py-3 font-semibold text-neutral-900">{s.name}</td>
                        <td className="py-3 text-neutral-600">{s.grade}</td>
                        <td className="py-3">
                          <span className="text-neutral-900 block">{s.parentName}</span>
                          <span className="text-[11px] text-neutral-500">{s.parentPhone}</span>
                        </td>
                        <td className="py-3">
                          <Currency amount={fee} className="font-semibold text-neutral-900" />
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                              s.status === 'Paid'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          {s.status !== 'Paid' && (
                            <button
                              onClick={() => handleSendSmsReminder(s)}
                              className="px-2.5 py-1 text-[11px] font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200 inline-flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>SMS Reminder</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
