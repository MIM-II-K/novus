import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  Clock,
  CheckCircle2,
  ChefHat,
  LayoutDashboard,
  RotateCcw,
  Sparkles,
  Flame,
  Plus,
} from 'lucide-react';
import { Currency } from '../common/Currency';

interface MenuItem {
  id: string;
  name: string;
  category: 'Appetizers' | 'Mains' | 'Beverages';
  priceNPR: number;
  description: string;
}

interface KitchenTicket {
  id: string;
  tableNo: number;
  ticketNo: string;
  items: Array<{ name: string; qty: number; note?: string }>;
  totalNPR: number;
  createdAt: string;
  status: 'Pending' | 'Cooking' | 'Ready' | 'Served';
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'food-1',
    name: 'Steamed Buff Kothey Momo',
    category: 'Appetizers',
    priceNPR: 320,
    description: '10 pieces hand-folded dumplings with roasted tomato and sesame timur chutney.',
  },
  {
    id: 'food-2',
    name: 'Woodfired Truffle Margherita Pizza',
    category: 'Mains',
    priceNPR: 750,
    description: 'Sourdough crust, san marzano sauce, yak mozzarella, fresh basil, truffle drizzle.',
  },
  {
    id: 'food-3',
    name: 'Charcoal Grilled Chicken Choila',
    category: 'Appetizers',
    priceNPR: 480,
    description: 'Smoky spiced chicken skewers marinated in mustard oil, fenugreek, and green chilies.',
  },
  {
    id: 'food-4',
    name: 'Artisan Himalayan Espresso Latte',
    category: 'Beverages',
    priceNPR: 250,
    description: 'Locally grown organic Arabica beans from Nuwakot with steamed creamy whole milk.',
  },
];

const INITIAL_KITCHEN_TICKETS: KitchenTicket[] = [
  {
    id: 'kt-1',
    tableNo: 4,
    ticketNo: 'KOT-104',
    items: [
      { name: 'Steamed Buff Kothey Momo', qty: 2, note: 'Extra spicy timur chutney' },
      { name: 'Artisan Himalayan Espresso Latte', qty: 2 },
    ],
    totalNPR: 1140,
    createdAt: '12 mins ago',
    status: 'Cooking',
  },
  {
    id: 'kt-2',
    tableNo: 7,
    ticketNo: 'KOT-105',
    items: [{ name: 'Woodfired Truffle Margherita Pizza', qty: 1 }],
    totalNPR: 750,
    createdAt: '4 mins ago',
    status: 'Pending',
  },
  {
    id: 'kt-3',
    tableNo: 2,
    ticketNo: 'KOT-103',
    items: [{ name: 'Charcoal Grilled Chicken Choila', qty: 1, note: 'Medium spice' }],
    totalNPR: 480,
    createdAt: '22 mins ago',
    status: 'Ready',
  },
];

export const RestaurantDemo: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'kitchen'>('table');
  const [tickets, setTickets] = useState<KitchenTicket[]>(INITIAL_KITCHEN_TICKETS);
  const [tableCart, setTableCart] = useState<Record<string, number>>({ 'food-1': 1 });
  const [spiceLevel, setSpiceLevel] = useState('Medium Spice');
  const [tableOrderPlaced, setTableOrderPlaced] = useState<KitchenTicket | null>(null);

  const updateTableCart = (id: string, delta: number) => {
    setTableCart((prev) => {
      const next = { ...prev, [id]: (prev[id] || 0) + delta };
      if (next[id] <= 0) delete next[id];
      return next;
    });
  };

  const handlePlaceTableOrder = () => {
    const items = Object.entries(tableCart).map(([id, qty]) => {
      const item = MENU_ITEMS.find((m) => m.id === id);
      return {
        name: item?.name || 'Item',
        qty,
        note: spiceLevel,
      };
    });

    if (items.length === 0) return;

    const total = Object.entries(tableCart).reduce((sum, [id, qty]) => {
      const item = MENU_ITEMS.find((m) => m.id === id);
      return sum + (item?.priceNPR || 0) * qty;
    }, 0);

    const newTicket: KitchenTicket = {
      id: `kt-${Date.now()}`,
      tableNo: 4,
      ticketNo: `KOT-${Math.floor(100 + Math.random() * 900)}`,
      items,
      totalNPR: total,
      createdAt: 'Just now',
      status: 'Pending',
    };

    setTickets([newTicket, ...tickets]);
    setTableOrderPlaced(newTicket);
    setTableCart({});
  };

  const handleStatusProgress = (id: string, nextStatus: KitchenTicket['status']) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)));
  };

  const handleReset = () => {
    if (confirm('Reset kitchen orders?')) {
      setTickets(INITIAL_KITCHEN_TICKETS);
      setTableOrderPlaced(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-neutral-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900 text-sm">Himalayan Bean & Bistro</span>
            <span className="text-neutral-300" aria-hidden="true">·</span>
            <span className="text-xs text-neutral-500">Restaurant QR & Kitchen KDS Demo</span>
          </div>
          <p className="text-xs text-neutral-500">
            Interactive demo: scan table QR, place dish orders, and view live kitchen chef tickets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-neutral-100 rounded-lg border border-neutral-200">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              Table 4 QR Menu
            </button>
            <button
              onClick={() => setViewMode('kitchen')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                viewMode === 'kitchen'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              Kitchen Display (KDS)
            </button>
          </div>

          <button
            onClick={handleReset}
            title="Reset orders"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TABLE QR CUSTOMER VIEW */}
      {viewMode === 'table' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Table #4
              </span>
              <h2 className="text-lg font-bold text-neutral-900 mt-1">
                Himalayan Bean & Bistro — Digital QR Menu
              </h2>
              <p className="text-xs text-neutral-500">
                Orders sent directly to kitchen chefs. Pay upon finishing.
              </p>
            </div>
            <Utensils className="w-8 h-8 text-neutral-400 stroke-[1.5]" />
          </div>

          {tableOrderPlaced ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">
                Order Sent to Kitchen!
              </h3>
              <p className="text-xs text-neutral-500">
                Ticket Reference: <strong className="font-mono">{tableOrderPlaced.ticketNo}</strong>. Kitchen is preparing your dishes.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setViewMode('kitchen')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md inline-flex items-center gap-1.5"
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Switch to Kitchen Display to view your ticket →</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden">
              {MENU_ITEMS.map((item) => {
                const count = tableCart[item.id] || 0;
                return (
                  <div key={item.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 text-sm">{item.name}</span>
                        <span className="text-[11px] text-neutral-400">· {item.category}</span>
                      </div>
                      <p className="text-neutral-500 leading-relaxed">{item.description}</p>
                      <Currency amount={item.priceNPR} className="font-bold text-neutral-900 block pt-1" />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {count > 0 ? (
                        <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-md">
                          <button
                            onClick={() => updateTableCart(item.id, -1)}
                            className="w-6 h-6 rounded bg-white font-bold flex items-center justify-center text-neutral-700"
                          >
                            -
                          </button>
                          <span className="font-bold w-4 text-center font-mono">{count}</span>
                          <button
                            onClick={() => updateTableCart(item.id, 1)}
                            className="w-6 h-6 rounded bg-white font-bold flex items-center justify-center text-neutral-700"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => updateTableCart(item.id, 1)}
                          className="px-3 py-1.5 font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-md"
                        >
                          Add +
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="p-4 bg-neutral-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-700">Spice Preference:</span>
                  <select
                    value={spiceLevel}
                    onChange={(e) => setSpiceLevel(e.target.value)}
                    className="px-2 py-1 border border-neutral-200 rounded bg-white"
                  >
                    <option value="Mild Spice">Mild Spice</option>
                    <option value="Medium Spice">Medium Spice</option>
                    <option value="Extra Hot (Nepali Fire)">Extra Hot (Nepali Fire)</option>
                  </select>
                </div>

                <button
                  disabled={Object.keys(tableCart).length === 0}
                  onClick={handlePlaceTableOrder}
                  className="px-4 py-2 font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md disabled:opacity-40"
                >
                  Send Order to Kitchen ({Object.values(tableCart).reduce((a, b) => a + b, 0)} items)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* KITCHEN DISPLAY KDS VIEW */}
      {viewMode === 'kitchen' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-neutral-900" />
              Live Kitchen Display Order Tickets ({tickets.length})
            </h3>
            <span className="text-xs text-neutral-500">Tablet terminal mounted at chef line</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tickets.map((t) => (
              <div
                key={t.id}
                className={`bg-white rounded-xl border p-4 flex flex-col justify-between text-xs space-y-4 ${
                  t.status === 'Cooking'
                    ? 'border-amber-400 ring-1 ring-amber-400'
                    : t.status === 'Ready'
                    ? 'border-emerald-400'
                    : 'border-neutral-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                    <span className="font-mono font-bold text-sm text-neutral-950">
                      Table {t.tableNo}
                    </span>
                    <span className="font-mono text-[11px] text-neutral-500">{t.ticketNo}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {t.createdAt}
                    </span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        t.status === 'Cooking'
                          ? 'bg-amber-100 text-amber-900'
                          : t.status === 'Ready'
                          ? 'bg-emerald-100 text-emerald-900'
                          : t.status === 'Served'
                          ? 'bg-neutral-100 text-neutral-600'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    {t.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-start">
                        <span className="font-medium text-neutral-900">
                          {it.qty}x {it.name}
                        </span>
                        {it.note && (
                          <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 rounded">
                            {it.note}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <Currency amount={t.totalNPR} className="font-semibold text-neutral-900" />

                  {t.status === 'Pending' && (
                    <button
                      onClick={() => handleStatusProgress(t.id, 'Cooking')}
                      className="px-3 py-1 font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded text-[11px]"
                    >
                      Start Cooking
                    </button>
                  )}
                  {t.status === 'Cooking' && (
                    <button
                      onClick={() => handleStatusProgress(t.id, 'Ready')}
                      className="px-3 py-1 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded text-[11px]"
                    >
                      Mark Food Ready
                    </button>
                  )}
                  {t.status === 'Ready' && (
                    <button
                      onClick={() => handleStatusProgress(t.id, 'Served')}
                      className="px-3 py-1 font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded text-[11px]"
                    >
                      Delivered to Table
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
