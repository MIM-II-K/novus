import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { BUSINESS_INFO } from '../config/solutionsData';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState('Salon / Spa');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Inquiries & Consultations
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 mt-1">
          Speak with a Solution Architect
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 mt-2 leading-relaxed">
          Whether you want to schedule a personalized demo walkthrough or discuss a customized business workflow, our engineering team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-neutral-200 p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">Message Received</h2>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                Thank you, {name}. A member of our technical team will review your inquiry and follow up within one business day.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Binod Shrestha"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="binod@example.com"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Phone Number (Nepal)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Industry / Business Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md bg-white focus:border-neutral-900 focus:outline-hidden"
                  >
                    <option value="Salon / Spa">Salon, Beauty & Spa</option>
                    <option value="Futsal / Sports Arena">Futsal / Sports Complex</option>
                    <option value="Retail / Boutique">Retail Store / POS</option>
                    <option value="Restaurant / Lounge">Restaurant / Cafe</option>
                    <option value="Healthcare / Clinic">Doctor / Dental Clinic</option>
                    <option value="Other">Other Custom Workflow</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Your Message or Requirements *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what software problems your business is experiencing..."
                  className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors"
              >
                Submit Consultation Request
              </button>
            </form>
          )}
        </div>

        {/* Business Info Strip */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 text-xs text-neutral-700">
            <h2 className="text-sm font-bold text-neutral-900">Direct Office Contact</h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-neutral-900">Development Desk:</span>
                  <span>{BUSINESS_INFO.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-neutral-900">Telephone / Mobile:</span>
                  <span>{BUSINESS_INFO.phone} / {BUSINESS_INFO.mobile}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-neutral-900">Direct Email:</span>
                  <span>{BUSINESS_INFO.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-neutral-900">Operational Hours:</span>
                  <span>{BUSINESS_INFO.operatingHours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
