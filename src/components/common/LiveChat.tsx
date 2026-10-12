import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Minimize2,
  Maximize2,
  CheckCircle2,
  User,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { INITIAL_SOLUTIONS, BUSINESS_INFO } from '../../config/solutionsData';
import { storageService } from '../../services/storageService';

interface ChatMessage {
  id: string;
  sender: 'rep' | 'client' | 'system';
  text: string;
  time: string;
  referenceNumber?: string;
}

export const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome-1',
      sender: 'rep',
      text: `Namaste! I'm Sunil from the Lumniscate architecture & sales desk in Kathmandu.`,
      time: 'Just now',
    },
    {
      id: 'msg-welcome-2',
      sender: 'rep',
      text: `Are you looking to automate bookings, retail inventory, hospitality, or need a custom business software estimate? Let me know what your business needs!`,
      time: 'Just now',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  // Inquiry form fields
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedSolutionSlug, setSelectedSolutionSlug] = useState(INITIAL_SOLUTIONS[0].slug);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, messages]);

  // Listen for global open event (e.g. from Footer or CTA buttons)
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setHasUnread(false);
    };
    window.addEventListener('open-live-chat', handleOpenChat);
    return () => window.removeEventListener('open-live-chat', handleOpenChat);
  }, []);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `client-${Date.now()}`,
      sender: 'client',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    // If user hasn't submitted their contact info yet, prompt the inquiry intake
    setTimeout(() => {
      let repReplyText = '';
      if (text.toLowerCase().includes('price') || text.toLowerCase().includes('cost') || text.toLowerCase().includes('estimate')) {
        repReplyText = `Our solutions start from NPR 25,000–48,000 one-time depending on the tier, with optional hosting from NPR 2,500/mo. Would you like me to log your requirements and send a customized quote?`;
      } else if (text.toLowerCase().includes('demo') || text.toLowerCase().includes('walkthrough')) {
        repReplyText = `All our solutions feature interactive sandboxes on our website. You can also test customer booking and admin panels live. Would you like to schedule a 15-minute remote walkthrough?`;
      } else if (text.toLowerCase().includes('esewa') || text.toLowerCase().includes('khalti') || text.toLowerCase().includes('payment')) {
        repReplyText = `Yes! We integrate native Nepali payment gateways (eSewa Merchant, Khalti, Fonepay Dynamic QR) so clients can pay deposits upfront.`;
      } else {
        repReplyText = `Got it! To ensure our solution architect prepares an accurate proposal for your workflow, please drop your name and phone/WhatsApp number below.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `rep-${Date.now()}`,
          sender: 'rep',
          text: repReplyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setShowInquiryForm(true);
    }, 700);
  };

  const handleQuickPreset = (presetText: string) => {
    handleSendMessage(presetText);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;

    setIsSubmitting(true);

    try {
      const savedRequest = storageService.createLiveChatInquiry({
        clientName: clientName.trim(),
        phone: clientPhone.trim(),
        businessName: businessName.trim(),
        solutionSlug: selectedSolutionSlug,
        inquiryMessage: inputMessage.trim() || 'Inquiry initiated via Live Sales Chat desk.',
      });

      setShowInquiryForm(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: 'rep',
          text: `Thank you, ${clientName}! Your project inquiry has been officially registered with reference #${savedRequest.referenceNumber}. Our solution architect Sunil will review your requirements and reach out via WhatsApp or phone at ${clientPhone} within 15 minutes during business hours.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          referenceNumber: savedRequest.referenceNumber,
        },
      ]);
      setClientName('');
      setClientPhone('');
      setBusinessName('');
    } catch (err) {
      console.error('Error saving chat inquiry', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && hasUnread && (
          <div className="hidden sm:flex items-center gap-2 bg-white text-neutral-900 px-3.5 py-2 rounded-full shadow-lg border border-neutral-200 text-xs font-medium animate-in fade-in slide-in-from-right-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Chat with Sales Desk</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close Live Chat' : 'Open Live Chat with Sales'}
          className="relative w-14 h-14 rounded-full bg-neutral-950 text-white hover:bg-neutral-800 shadow-xl flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 group hover:scale-105"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-200" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
              {/* Online Pulse Dot */}
              <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-neutral-950" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* Live Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[560px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-neutral-950 text-white p-4 flex items-center justify-between shrink-0 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-sm text-neutral-200">
                  SB
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-neutral-950" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight text-white">Sunil Bajracharya</h3>
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300">
                    Lead Architect
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Lumniscate Sales Desk · Online</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-neutral-50/50">
            {/* Timestamp Notice */}
            <div className="text-center">
              <span className="text-[10px] text-neutral-400 bg-white px-2 py-0.5 rounded-full border border-neutral-200 font-mono">
                Today · Typically replies in &lt; 5 mins
              </span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'client' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'client'
                      ? 'bg-neutral-900 text-white rounded-tr-xs'
                      : 'bg-white text-neutral-800 border border-neutral-200 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.referenceNumber && (
                    <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono font-semibold text-emerald-700">
                      <span>REF: {msg.referenceNumber}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-neutral-400 mt-1 px-1 font-mono">
                  {msg.time}
                </span>
              </div>
            ))}

            {/* Quick Action Chips (when no pending form) */}
            {!showInquiryForm && (
              <div className="pt-2 space-y-1.5">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                  Quick Inquiries
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleQuickPreset('I want a customized price estimate for my business')}
                    className="text-[11px] bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-lg px-2.5 py-1 text-left transition-colors"
                  >
                    💰 Get pricing estimate
                  </button>
                  <button
                    onClick={() => handleQuickPreset('Can I schedule a 15-minute live demo walkthrough?')}
                    className="text-[11px] bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-lg px-2.5 py-1 text-left transition-colors"
                  >
                    📅 Book demo walkthrough
                  </button>
                  <button
                    onClick={() => handleQuickPreset('How do payment gateway deposits work (eSewa / Khalti)?')}
                    className="text-[11px] bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-lg px-2.5 py-1 text-left transition-colors"
                  >
                    💳 Local payment gateways
                  </button>
                  <button
                    onClick={() => handleQuickPreset('How fast can you deploy our customized solution?')}
                    className="text-[11px] bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-lg px-2.5 py-1 text-left transition-colors"
                  >
                    ⏱️ Implementation timeline
                  </button>
                </div>
              </div>
            )}

            {/* Quick Intake Form within Chat */}
            {showInquiryForm && (
              <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-sm space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-neutral-600" />
                    <span className="font-bold text-neutral-900 text-xs">Direct Sales Callback Intake</span>
                  </div>
                  <button
                    onClick={() => setShowInquiryForm(false)}
                    className="text-[10px] text-neutral-400 hover:text-neutral-700"
                  >
                    Skip
                  </button>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-2.5">
                  <div>
                    <label className="text-[10px] font-semibold text-neutral-600 block mb-0.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bipin Shrestha"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full text-xs border border-neutral-200 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-neutral-600 block mb-0.5">
                        WhatsApp / Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+977 98XXXXXXXX"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full text-xs border border-neutral-200 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-neutral-600 block mb-0.5">
                        Business Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Salon & Spa"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full text-xs border border-neutral-200 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-neutral-600 block mb-0.5">
                      Software Solution of Interest
                    </label>
                    <select
                      value={selectedSolutionSlug}
                      onChange={(e) => setSelectedSolutionSlug(e.target.value)}
                      className="w-full text-xs border border-neutral-200 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    >
                      {INITIAL_SOLUTIONS.map((s) => (
                        <option key={s.id} value={s.slug}>
                          {s.title} (from रू {s.startingPriceNPR.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 bg-neutral-900 text-white hover:bg-neutral-800 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    <span>Request Architect Callback</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Direct Communication Channels Strip */}
          <div className="bg-neutral-100/90 border-t border-neutral-200 px-3 py-1.5 flex items-center justify-between text-[11px] text-neutral-600 shrink-0">
            <span className="text-[10px] text-neutral-500">Need instant reach?</span>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/9779801234567?text=${encodeURIComponent(
                  'Hello Lumniscate, I have an inquiry about business software implementation.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                <span>WhatsApp</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span className="text-neutral-300">·</span>
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="text-neutral-700 hover:text-neutral-900 font-semibold flex items-center gap-1"
              >
                <Phone className="w-2.5 h-2.5" />
                <span>Call Desk</span>
              </a>
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-neutral-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type your message or question..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 text-xs border border-neutral-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-40 transition-colors shrink-0"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
