import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill,
  Search,
  ShoppingCart,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Printer,
  Calendar,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import { Currency } from '../common/Currency';

interface MedicineItem {
  id: string;
  brandName: string;
  genericSalt: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  isExpiringSoon?: boolean;
  unitPriceNPR: number;
  stockUnits: number;
  ddaSchedule: 'General' | 'Schedule H (Rx Required)' | 'Narcotic / Controlled';
}

interface CartItem {
  medicine: MedicineItem;
  quantity: number;
}

const MEDICINE_CATALOG: MedicineItem[] = [
  {
    id: 'med-1',
    brandName: 'Niko 500mg Tablet',
    genericSalt: 'Paracetamol IP 500mg',
    manufacturer: 'Nepal Pharmaceuticals Lab (NPL)',
    batchNumber: 'B-NPL-8891',
    expiryDate: 'Dec 2027',
    unitPriceNPR: 2.5,
    stockUnits: 450,
    ddaSchedule: 'General',
  },
  {
    id: 'med-2',
    brandName: 'Pantocid 40mg Tablet',
    genericSalt: 'Pantoprazole Sodium 40mg',
    manufacturer: 'Sun Pharma Nepal',
    batchNumber: 'B-SUN-4120',
    expiryDate: 'Aug 2027',
    unitPriceNPR: 14.0,
    stockUnits: 180,
    ddaSchedule: 'General',
  },
  {
    id: 'med-3',
    brandName: 'Mox 500mg Capsule',
    genericSalt: 'Amoxicillin Trihydrate 500mg',
    manufacturer: 'Deurali-Janta Pharmaceuticals',
    batchNumber: 'B-DJP-2094',
    expiryDate: 'Nov 2026',
    unitPriceNPR: 18.5,
    stockUnits: 95,
    ddaSchedule: 'Schedule H (Rx Required)',
  },
  {
    id: 'med-4',
    brandName: 'Cetzine 10mg Tablet',
    genericSalt: 'Cetirizine Hydrochloride 10mg',
    manufacturer: 'National Healthcare',
    batchNumber: 'B-NHC-3011',
    expiryDate: 'Jan 2027',
    unitPriceNPR: 6.0,
    stockUnits: 320,
    ddaSchedule: 'General',
  },
  {
    id: 'med-5',
    brandName: 'Azithral 500mg Tablet',
    genericSalt: 'Azithromycin 500mg',
    manufacturer: 'Alembic Pharmaceuticals',
    batchNumber: 'B-ALM-1029',
    expiryDate: 'Dec 2024',
    isExpiringSoon: true,
    unitPriceNPR: 42.0,
    stockUnits: 24,
    ddaSchedule: 'Schedule H (Rx Required)',
  },
  {
    id: 'med-6',
    brandName: 'Alprax 0.5mg (Restricted)',
    genericSalt: 'Alprazolam 0.5mg',
    manufacturer: 'Torrent Pharma',
    batchNumber: 'B-TOR-0044',
    expiryDate: 'Jun 2027',
    unitPriceNPR: 8.0,
    stockUnits: 60,
    ddaSchedule: 'Narcotic / Controlled',
  },
];

export const PharmacyDemo: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([
    { medicine: MEDICINE_CATALOG[0], quantity: 20 },
    { medicine: MEDICINE_CATALOG[1], quantity: 10 },
  ]);
  const [patientName, setPatientName] = useState('Bishal Sharma');
  const [doctorName, setDoctorName] = useState('Dr. S. K. Upadhyay (NMC: 14092)');
  const [discountPercent, setDiscountPercent] = useState(5);
  const [invoicePrinted, setInvoicePrinted] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const filteredMedicines = MEDICINE_CATALOG.filter(
    (m) =>
      m.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.genericSalt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (med: MedicineItem) => {
    if (med.isExpiringSoon) {
      showToast(`Warning: ${med.brandName} batch ${med.batchNumber} is near expiry! Dispense with caution.`);
    }
    const existing = cart.find((item) => item.medicine.id === med.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.medicine.id === med.id ? { ...item, quantity: item.quantity + 10 } : item
        )
      );
    } else {
      setCart([...cart, { medicine: med, quantity: 10 }]);
    }
    showToast(`Added ${med.brandName} to dispense bill.`);
  };

  const updateQuantity = (medId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.medicine.id === medId) {
            const nextQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (medId: string) => {
    setCart(cart.filter((item) => item.medicine.id !== medId));
  };

  const subtotalNPR = cart.reduce((sum, item) => sum + item.medicine.unitPriceNPR * item.quantity, 0);
  const discountAmount = (subtotalNPR * discountPercent) / 100;
  const grandTotalNPR = subtotalNPR - discountAmount;

  const handlePrintInvoice = () => {
    setInvoicePrinted(true);
    showToast('Tax invoice generated and dispatched to thermal ESC/POS printer.');
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3 rounded-lg shadow-xl border border-neutral-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-medium">{toastMsg}</p>
        </div>
      )}

      {/* Brand Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">Aarogya Lifecare Pharmacy</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  DDA Compliant Dispensary Sandbox
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Batch number tracking, drug expiry alerts, Schedule H prescription controls, and instant POS tax billing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Counter:</span>
            <span className="text-xs font-semibold px-2 py-1 bg-neutral-100 rounded text-neutral-800">
              Terminal POS-01 (Main Gate)
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Medicine Search Catalog + Active Prescription Dispense Counter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Medicine Search & Inventory Stock (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search brand name, generic salt (e.g. Paracetamol, Pantoprazole), or batch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-300 rounded-md focus:ring-1 focus:ring-neutral-900 focus:outline-none"
              />
            </div>

            <div className="text-[11px] text-neutral-500 flex items-center justify-between">
              <span>Showing {filteredMedicines.length} matching pharmaceutical products</span>
              <span className="text-emerald-700 font-medium">Real-time stock locked</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredMedicines.map((med) => (
              <div
                key={med.id}
                className={`bg-white border rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  med.isExpiringSoon ? 'border-amber-300 bg-amber-50/20' : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-neutral-900">{med.brandName}</h4>
                    {med.isExpiringSoon && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Near Expiry: {med.expiryDate}</span>
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        med.ddaSchedule === 'Schedule H (Rx Required)'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : med.ddaSchedule === 'Narcotic / Controlled'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {med.ddaSchedule}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 font-mono">Salt: {med.genericSalt}</p>

                  <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                    <span>Mfr: {med.manufacturer}</span>
                    <span>·</span>
                    <span>Batch: <span className="font-mono text-neutral-700 font-medium">{med.batchNumber}</span></span>
                    <span>·</span>
                    <span>Stock: <strong className="text-neutral-800">{med.stockUnits} units</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-bold text-neutral-900">
                      रू {med.unitPriceNPR.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-neutral-400">per unit/tab</div>
                  </div>

                  <button
                    onClick={() => addToCart(med)}
                    className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded-md transition-colors inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Dispense</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Cashier Dispensing Register (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-neutral-900">Patient Dispense Bill</h3>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-neutral-100 rounded text-neutral-700">
                INV-2026-9812
              </span>
            </div>

            {/* Patient & Doctor metadata */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-neutral-400 block">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full text-xs border border-neutral-200 rounded p-1.5 font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block">Prescribing Physician</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full text-xs border border-neutral-200 rounded p-1.5 font-medium"
                />
              </div>
            </div>

            {/* Dispense Lines */}
            <div className="divide-y divide-neutral-100 max-h-64 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  No medicine selected. Click "Dispense" from catalog.
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.medicine.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="font-semibold text-neutral-900 truncate">
                        {item.medicine.brandName}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        {item.medicine.batchNumber} · रू {item.medicine.unitPriceNPR.toFixed(2)}/u
                      </div>
                    </div>

                    {/* Qty changer */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.medicine.id, -5)}
                        className="w-5 h-5 rounded bg-neutral-100 text-neutral-700 flex items-center justify-center hover:bg-neutral-200"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold w-7 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.medicine.id, 5)}
                        className="w-5 h-5 rounded bg-neutral-100 text-neutral-700 flex items-center justify-center hover:bg-neutral-200"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right font-bold w-16 shrink-0">
                      रू {(item.medicine.unitPriceNPR * item.quantity).toFixed(2)}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.medicine.id)}
                      className="text-neutral-300 hover:text-rose-600 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Pricing Summary */}
            <div className="pt-3 border-t border-neutral-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal (MRP Gross)</span>
                <span>रू {subtotalNPR.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-600">
                <span>Senior/Regular Patient Discount ({discountPercent}%)</span>
                <span className="text-emerald-700 font-medium">- रू {discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-100">
                <span>Net Payable NPR</span>
                <span className="text-base text-emerald-800">रू {grandTotalNPR.toFixed(2)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handlePrintInvoice}
                disabled={cart.length === 0}
                className="w-full py-2.5 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-md transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                <Printer className="w-4 h-4" />
                <span>Print Tax Invoice & Dispense</span>
              </button>

              <button
                onClick={() => {
                  setCart([]);
                  showToast('Counter cleared.');
                }}
                className="w-full py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Reset Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
