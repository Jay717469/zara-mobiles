import React from 'react';
import { X, PhoneCall, MapPin, Clock, MessageCircle, ExternalLink, Mail, ShieldCheck } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const phone1 = "6379367629";
  const phone2 = "6385533138";

  const handleOpenWhatsApp = (num) => {
    const text = encodeURIComponent("Hello ZARA MOBILES Support, I would like to inquire about phone availability and offers.");
    window.open(`https://wa.me/91${num}?text=${text}`, '_blank');
  };

  const stores = [
    {
      name: 'Flagship Store — Indiranagar',
      city: 'Bengaluru, Karnataka',
      address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
      phone: '+91 63793 67629',
      hours: '10:00 AM - 09:30 PM (All 7 Days)',
    },
    {
      name: 'Experience Store — Bandra West',
      city: 'Mumbai, Maharashtra',
      address: 'Linking Road, Near Khar Telephone Exchange, Bandra West, Mumbai 400052',
      phone: '+91 63855 33138',
      hours: '10:30 AM - 10:00 PM (All 7 Days)',
    },
    {
      name: 'Boutique — Connaught Place',
      city: 'New Delhi',
      address: 'Block B, Inner Circle, Connaught Place, New Delhi 110001',
      phone: '+91 63793 67629',
      hours: '10:00 AM - 09:00 PM (All 7 Days)',
    },
    {
      name: 'Retail Store — T. Nagar',
      city: 'Chennai, Tamil Nadu',
      address: 'Usman Road, Near Panagal Park, T. Nagar, Chennai 600017',
      phone: '+91 63855 33138',
      hours: '09:30 AM - 09:30 PM (All 7 Days)',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Orange/Red Gradient */}
        <div className="bg-gradient-to-r from-[#ff5722] via-[#ff4500] to-[#e64a19] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-white/20 backdrop-blur-xs">
              <PhoneCall className="w-5 h-5 text-white" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full">
              Customer Support &amp; WhatsApp
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Contact ZARA MOBILES
          </h2>
          <p className="text-white/80 text-xs mt-0.5">
            Connect directly via WhatsApp or call our support lines.
          </p>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* WhatsApp Direct Contacts Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
              Official WhatsApp Contacts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* WhatsApp Line 1 */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-emerald-200/70 text-emerald-800 rounded">
                    WhatsApp Line 1
                  </span>
                  <p className="font-black text-sm text-gray-900 mt-1">+91 63793 67629</p>
                  <p className="text-[10px] text-gray-500">Sales, Inquiries &amp; Orders</p>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => handleOpenWhatsApp(phone1)}
                    className="flex-1 py-1.5 px-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
                    Chat Now
                  </button>
                  <a
                    href={`tel:+91${phone1}`}
                    className="py-1.5 px-2.5 bg-white hover:bg-gray-100 border border-emerald-300 text-emerald-800 text-[11px] font-bold rounded-xl flex items-center justify-center transition-colors"
                    title="Call Line 1"
                  >
                    <PhoneCall className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* WhatsApp Line 2 */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-emerald-200/70 text-emerald-800 rounded">
                    WhatsApp Line 2
                  </span>
                  <p className="font-black text-sm text-gray-900 mt-1">+91 63855 33138</p>
                  <p className="text-[10px] text-gray-500">Trade-In, Exchange &amp; Support</p>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => handleOpenWhatsApp(phone2)}
                    className="flex-1 py-1.5 px-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
                    Chat Now
                  </button>
                  <a
                    href={`tel:+91${phone2}`}
                    className="py-1.5 px-2.5 bg-white hover:bg-gray-100 border border-emerald-300 text-emerald-800 text-[11px] font-bold rounded-xl flex items-center justify-center transition-colors"
                    title="Call Line 2"
                  >
                    <PhoneCall className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Stores Section */}
          <div className="pt-2 border-t border-gray-100 space-y-3">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#ff5722]" />
              Physical Retail Branches
            </h3>

            {stores.map((store, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                <span className="p-2 rounded-xl bg-orange-50 text-[#ff5722] flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-gray-900 text-xs sm:text-sm">
                    {store.name}
                  </h4>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                    {store.address}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1 text-gray-700">
                      <PhoneCall className="w-3 h-3 text-[#ff5722]" />
                      <a href={`tel:${store.phone.replace(/\s+/g, '')}`} className="hover:underline font-bold">
                        {store.phone}
                      </a>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {store.hours}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            support@zaramobiles.com
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#ff5722] hover:bg-[#e64a19] text-white font-bold text-xs rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
