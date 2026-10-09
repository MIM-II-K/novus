import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { BUSINESS_INFO } from '../../config/solutionsData';
import { Save, Check } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [companyName, setCompanyName] = useState(BUSINESS_INFO.companyName);
  const [phone, setPhone] = useState(BUSINESS_INFO.phone);
  const [mobile, setMobile] = useState(BUSINESS_INFO.mobile);
  const [email, setEmail] = useState(BUSINESS_INFO.email);
  const [location, setLocation] = useState(BUSINESS_INFO.location);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout
      title="Storefront & Business Settings"
      subtitle="Manage public company contact information, brand settings, and notification destinations."
    >
      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Settings updated.</span>
          </div>
        )}

        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-neutral-900">Brand Identity & Contact</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-neutral-800 block mb-1">Company Trade Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-md"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-800 block mb-1">Inquiry Intake Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-md"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-800 block mb-1">Office Telephone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-md"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-800 block mb-1">Mobile / WhatsApp Hotline</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-md"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-neutral-800 block mb-1">Registered Physical Address</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-md"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Configuration</span>
        </button>
      </form>
    </AdminLayout>
  );
};
