import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Barcode,
  ShoppingCart,
  Package,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Receipt,
  LayoutDashboard,
  RotateCcw,
  Sparkles,
  Printer,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Currency } from '../common/Currency';

interface ProductItem {
  sku: string;
  name: string;
  category: 'Apparel' | 'Accessories' | 'Footwear';
  priceNPR: number;
  costNPR: number;
  stock: number;
  reorderLevel: number;
}

interface CartItem {
  product: ProductItem;
  quantity: number;
}

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    sku: 'APP-LIN-01',
    name: 'Pure Linen Mandarin Shirt',
    category: 'Apparel',
    priceNPR: 2400,
    costNPR: 1400,
    stock: 14,
    reorderLevel: 5,
  },
  {
    sku: 'APP-KTH-02',
    name: 'Raw Silk Ceremonial Kurtha',
    category: 'Apparel',
    priceNPR: 4800,
    costNPR: 2800,
    stock: 6,
    reorderLevel: 4,
  },
  {
    sku: 'APP-SWT-03',
    name: 'Fine Cashmere V-Neck Sweater',
    category: 'Apparel',
    priceNPR: 7500,
    costNPR: 4500,
    stock: 3, // Low stock trigger
    reorderLevel: 5,
  },
  {
    sku: 'APP-CHN-04',
    name: 'Tapered Cotton Chino Trouser',
    category: 'Apparel',
    priceNPR: 2200,
    costNPR: 1300,
    stock: 22,
    reorderLevel: 8,
  },
  {
    sku: 'ACC-BLT-05',
    name: 'Full-Grain Handcrafted Leather Belt',
    category: 'Accessories',
    priceNPR: 1600,
    costNPR: 900,
    stock: 11,
    reorderLevel: 5,
  },
  {
    sku: 'ACC-SHW-06',
    name: 'Handwoven Himalayan Wool Stole',
    category: 'Accessories',
    priceNPR: 3200,
    costNPR: 1800,
    stock: 4, // Low stock trigger
    reorderLevel: 5,
  },
];

export const InventoryDemo: React.FC = () => {
  const [viewMode, setViewMode] = useState<'pos' | 'inventory'>('pos');
  const [products, setProducts] = useState<ProductItem[]>(() => {
    const raw = localStorage.getItem('buildwise_inventory_stock_v1');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchBarcode, setSearchBarcode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [addTaxVat, setAddTaxVat] = useState<boolean>(true);
  const [completedReceipt, setCompletedReceipt] = useState<{
    receiptNo: string;
    items: CartItem[];
    subtotal: number;
    vat: number;
    discount: number;
    total: number;
    paymentMode: string;
    date: string;
  } | null>(null);

  // Cart operations
  const addToCart = (product: ProductItem) => {
    if (product.stock <= 0) {
      alert('This product is out of stock in inventory.');
      return;
    }

    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.sku === product.sku);
      if (idx !== -1) {
        if (prev[idx].quantity >= product.stock) {
          alert('Cannot add more than available stock.');
          return prev;
        }
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQty = (sku: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.sku === sku) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (sku: string) => {
    setCart((prev) => prev.filter((item) => item.product.sku !== sku));
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.priceNPR * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxableAmount = subtotal - discountAmount;
  const vatAmount = addTaxVat ? Math.round(taxableAmount * 0.13) : 0;
  const totalPayable = taxableAmount + vatAmount;

  const handleCheckout = (paymentMode: 'Cash' | 'eSewa QR' | 'Card') => {
    if (cart.length === 0) return;

    // Deduct stock in state & storage
    const updatedProducts = products.map((prod) => {
      const inCart = cart.find((c) => c.product.sku === prod.sku);
      if (inCart) {
        return { ...prod, stock: Math.max(0, prod.stock - inCart.quantity) };
      }
      return prod;
    });

    setProducts(updatedProducts);
    localStorage.setItem('buildwise_inventory_stock_v1', JSON.stringify(updatedProducts));

    const receiptNo = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    setCompletedReceipt({
      receiptNo,
      items: [...cart],
      subtotal,
      vat: vatAmount,
      discount: discountAmount,
      total: totalPayable,
      paymentMode,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setCart([]);
  };

  const handleRestock = (sku: string, qty: number) => {
    const updated = products.map((p) => (p.sku === sku ? { ...p, stock: p.stock + qty } : p));
    setProducts(updated);
    localStorage.setItem('buildwise_inventory_stock_v1', JSON.stringify(updated));
  };

  const handleReset = () => {
    if (confirm('Reset retail inventory items and stock levels to defaults?')) {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('buildwise_inventory_stock_v1', JSON.stringify(INITIAL_PRODUCTS));
      setCart([]);
      setCompletedReceipt(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const q = searchBarcode.toLowerCase().trim();
    const matchesQ = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    return matchesCat && matchesQ;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-neutral-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900 text-sm">The Oak & Thread Boutique</span>
            <span className="text-neutral-300" aria-hidden="true">·</span>
            <span className="text-xs text-neutral-500">Retail Inventory & POS Demo</span>
          </div>
          <p className="text-xs text-neutral-500">
            Simulate real cashier register transactions, thermal receipt generation, and warehouse stock tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-neutral-100 rounded-lg border border-neutral-200">
            <button
              onClick={() => setViewMode('pos')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                viewMode === 'pos'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Cashier POS Register
            </button>
            <button
              onClick={() => setViewMode('inventory')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                viewMode === 'inventory'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Inventory Stock Manager
            </button>
          </div>

          <button
            onClick={handleReset}
            title="Reset sample inventory"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* POS VIEW */}
      {viewMode === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Product Catalog */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-neutral-200 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Barcode className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchBarcode}
                    onChange={(e) => setSearchBarcode(e.target.value)}
                    placeholder="Scan barcode or type SKU / item name..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                  {['All', 'Apparel', 'Accessories'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                        activeCategory === cat
                          ? 'bg-neutral-900 text-white'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.sku}
                  onClick={() => addToCart(prod)}
                  className="p-3.5 bg-white rounded-xl border border-neutral-200 hover:border-neutral-900 cursor-pointer transition-all flex flex-col justify-between group shadow-2xs"
                >
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-neutral-400 block">{prod.sku}</span>
                    <h4 className="text-xs font-bold text-neutral-900 group-hover:text-neutral-700 line-clamp-2">
                      {prod.name}
                    </h4>
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
                    <Currency amount={prod.priceNPR} className="text-xs font-bold text-neutral-950" />
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        prod.stock <= prod.reorderLevel
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'text-neutral-500'
                      }`}
                    >
                      {prod.stock} in stock
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Checkout Terminal Cart */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 text-xs shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-neutral-500" />
                  Current Register Bill
                </h3>
                <span className="font-mono text-neutral-500">{cart.length} line items</span>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 space-y-2">
                  <ShoppingCart className="w-8 h-8 mx-auto stroke-[1.5]" />
                  <p>Cart is empty. Click any product or scan barcode to add.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-neutral-100 pr-1">
                  {cart.map((item) => (
                    <div key={item.product.sku} className="pt-2 flex items-center justify-between gap-3">
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <span className="font-semibold text-neutral-900 block truncate">
                          {item.product.name}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-500">
                          {item.product.sku} · NPR {item.product.priceNPR.toLocaleString()} each
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updateCartQty(item.product.sku, -1)}
                          className="p-1 text-neutral-500 hover:text-neutral-900 rounded bg-neutral-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.product.sku, 1)}
                          className="p-1 text-neutral-500 hover:text-neutral-900 rounded bg-neutral-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.sku)}
                          className="p-1 text-neutral-400 hover:text-red-600 rounded ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bill Totals */}
              {cart.length > 0 && (
                <div className="pt-4 border-t border-neutral-200 space-y-2">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal:</span>
                    <Currency amount={subtotal} className="font-semibold text-neutral-900" />
                  </div>

                  <div className="flex items-center justify-between text-neutral-600">
                    <span className="flex items-center gap-1.5">
                      <label htmlFor="tax-vat" className="cursor-pointer">Nepal VAT (13%):</label>
                      <input
                        id="tax-vat"
                        type="checkbox"
                        checked={addTaxVat}
                        onChange={(e) => setAddTaxVat(e.target.checked)}
                        className="rounded text-neutral-900"
                      />
                    </span>
                    <Currency amount={vatAmount} className="font-semibold text-neutral-900" />
                  </div>

                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Staff Discount:</span>
                    <select
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="px-2 py-0.5 border border-neutral-200 rounded text-xs bg-white"
                    >
                      <option value={0}>None (0%)</option>
                      <option value={5}>VIP 5%</option>
                      <option value={10}>Season Sale 10%</option>
                    </select>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-bold text-neutral-950">
                    <span>Grand Total:</span>
                    <Currency amount={totalPayable} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3">
                    <button
                      onClick={() => handleCheckout('Cash')}
                      className="py-2.5 px-2 bg-neutral-950 text-white font-semibold rounded-md hover:bg-neutral-800 text-center"
                    >
                      💵 Cash
                    </button>
                    <button
                      onClick={() => handleCheckout('eSewa QR')}
                      className="py-2.5 px-2 bg-emerald-700 text-white font-semibold rounded-md hover:bg-emerald-800 text-center"
                    >
                      📲 eSewa QR
                    </button>
                    <button
                      onClick={() => handleCheckout('Card')}
                      className="py-2.5 px-2 bg-neutral-800 text-white font-semibold rounded-md hover:bg-neutral-700 text-center"
                    >
                      💳 POS Card
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-neutral-100 rounded-lg border border-neutral-200 space-y-2 text-xs text-neutral-800">
              <p className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
                Want this POS for your retail boutique?
              </p>
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                Includes barcode scanning, receipt printer drivers, customer tabs, and sales reporting starting at NPR 35,000.
              </p>
              <Link
                to="/solutions/inventory-sales-management/customize"
                className="inline-flex items-center gap-1 font-semibold text-neutral-950 hover:underline pt-1"
              >
                <span>Customize retail solution →</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* INVENTORY MANAGER VIEW */}
      {viewMode === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Total Catalog SKUs</span>
              <p className="text-2xl font-bold font-mono text-neutral-900">{products.length}</p>
              <span className="text-[11px] text-neutral-500">Active retail items</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Low Stock Triggers</span>
              <p className="text-2xl font-bold font-mono text-amber-700">
                {products.filter((p) => p.stock <= p.reorderLevel).length}
              </p>
              <span className="text-[11px] text-neutral-500">Require supplier reorder</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Inventory Asset Value</span>
              <Currency
                amount={products.reduce((sum, p) => sum + p.costNPR * p.stock, 0)}
                className="text-2xl font-bold text-neutral-900 block"
              />
              <span className="text-[11px] text-neutral-500">At wholesale cost</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
              <span className="text-xs text-neutral-500">Average Profit Margin</span>
              <p className="text-2xl font-bold font-mono text-emerald-700">42.8%</p>
              <span className="text-[11px] text-neutral-500">Retail mark-up average</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="p-5 border-b border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-900">Live Stock & Reorder Register</h3>
              <p className="text-xs text-neutral-500">
                Real-time stock on hand. Click +5 or +10 to simulate receiving warehouse supplier deliveries.
              </p>
            </div>

            <div className="overflow-x-auto p-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500">
                    <th className="pb-3 font-semibold">SKU</th>
                    <th className="pb-3 font-semibold">Product Name</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Stock on Hand</th>
                    <th className="pb-3 font-semibold">Cost Price</th>
                    <th className="pb-3 font-semibold">Selling Price</th>
                    <th className="pb-3 font-semibold">Margin</th>
                    <th className="pb-3 font-semibold text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {products.map((p) => {
                    const isLow = p.stock <= p.reorderLevel;
                    const margin = Math.round(((p.priceNPR - p.costNPR) / p.priceNPR) * 100);

                    return (
                      <tr key={p.sku} className="hover:bg-neutral-50/50">
                        <td className="py-3 font-mono font-bold text-neutral-900">{p.sku}</td>
                        <td className="py-3 font-semibold text-neutral-900">{p.name}</td>
                        <td className="py-3 text-neutral-600">{p.category}</td>
                        <td className="py-3">
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                              isLow
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'text-neutral-900'
                            }`}
                          >
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3">
                          <Currency amount={p.costNPR} className="text-neutral-600" />
                        </td>
                        <td className="py-3">
                          <Currency amount={p.priceNPR} className="font-semibold text-neutral-900" />
                        </td>
                        <td className="py-3 font-mono text-emerald-700 font-semibold">{margin}%</td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleRestock(p.sku, 5)}
                              className="px-2 py-1 text-[11px] font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => handleRestock(p.sku, 10)}
                              className="px-2 py-1 text-[11px] font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded"
                            >
                              +10
                            </button>
                          </div>
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

      {/* Receipt Modal */}
      {completedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-neutral-200 text-xs font-mono">
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-neutral-300">
              <h4 className="font-bold text-sm text-neutral-950 font-sans">
                THE OAK & THREAD BOUTIQUE
              </h4>
              <p className="text-[11px] text-neutral-500">Durbar Marg, Kathmandu</p>
              <p className="text-[10px] text-neutral-400">PAN/VAT: 602391048</p>
            </div>

            <div className="space-y-1 text-[11px] text-neutral-600">
              <div className="flex justify-between">
                <span>Receipt: {completedReceipt.receiptNo}</span>
                <span>Time: {completedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Mode: {completedReceipt.paymentMode}</span>
                <span>Cashier: POS Terminal #1</span>
              </div>
            </div>

            <div className="border-y border-dashed border-neutral-300 py-2 space-y-1 text-[11px]">
              {completedReceipt.items.map((item) => (
                <div key={item.product.sku} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.product.name.slice(0, 18)}
                  </span>
                  <span>NPR {(item.product.priceNPR * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span>NPR {completedReceipt.subtotal.toLocaleString()}</span>
              </div>
              {completedReceipt.vat > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>VAT (13%):</span>
                  <span>NPR {completedReceipt.vat.toLocaleString()}</span>
                </div>
              )}
              {completedReceipt.discount > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Discount:</span>
                  <span>-NPR {completedReceipt.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-neutral-950 pt-1 border-t border-neutral-200">
                <span>TOTAL:</span>
                <span>NPR {completedReceipt.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 text-center text-[10px] text-neutral-400">
              <p>*** THANK YOU FOR VISITING ***</p>
              <p>Goods once sold exchangeable within 7 days with bill.</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200 font-sans">
              <button
                onClick={() => setCompletedReceipt(null)}
                className="w-full py-2 font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md text-xs"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
