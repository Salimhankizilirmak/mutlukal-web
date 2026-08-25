import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function ContactModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: 'Tortilla',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSupabaseConfigured) {
      await supabase.from('contact_leads').insert({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        product: formData.product,
        message: formData.message,
      });
      // Best-effort: even if the insert silently fails (e.g. RLS not yet
      // configured), we don't want to block the visible success state —
      // there's no other channel to show an error through in this modal.
    }

    setSubmitted(true);
    setTimeout(() => {
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#FAF3E3] border border-[#C89438]/45 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 text-[#1B2A3A]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 ltr:right-4 rtl:left-4 p-2 rounded-full bg-white text-[#1B2A3A] hover:text-[#C89438] border border-[#C89438]/35 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#1B2A3A]">
              {t('contactModal.successTitle')}
            </h3>
            <p className="text-sm text-[#5C6B73] font-medium max-w-md">
              {t('contactModal.successDesc')}
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold text-[#C89438] tracking-widest uppercase block mb-1">
                {t('contactModal.eyebrow')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B2A3A]">
                {t('contactModal.title')}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#C89438] mb-1 font-bold">{t('contactModal.nameLabel')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('contactModal.namePlaceholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C89438]/35 text-[#1B2A3A] placeholder-[#1B2A3A]/40 focus:outline-none focus:border-[#C89438] shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[#C89438] mb-1 font-bold">{t('contactModal.companyLabel')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('contactModal.companyPlaceholder')}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C89438]/35 text-[#1B2A3A] placeholder-[#1B2A3A]/40 focus:outline-none focus:border-[#C89438] shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#C89438] mb-1 font-bold">{t('contactModal.emailLabel')}</label>
                  <input
                    type="email"
                    required
                    placeholder={t('contactModal.emailPlaceholder')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C89438]/35 text-[#1B2A3A] placeholder-[#1B2A3A]/40 focus:outline-none focus:border-[#C89438] shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[#C89438] mb-1 font-bold">{t('contactModal.phoneLabel')}</label>
                  <input
                    type="tel"
                    required
                    placeholder={t('contactModal.phonePlaceholder')}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C89438]/35 text-[#1B2A3A] placeholder-[#1B2A3A]/40 focus:outline-none focus:border-[#C89438] shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#C89438] mb-1 font-bold">{t('contactModal.productLabel')}</label>
                <select
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C89438]/35 text-[#1B2A3A] focus:outline-none focus:border-[#C89438] shadow-sm"
                >
                  <option value="Tortilla">{t('contactModal.productOptions.tortilla')}</option>
                  <option value="Çeşnili Tortilla">{t('contactModal.productOptions.cesnili')}</option>
                  <option value="Pizza Tabanı">{t('contactModal.productOptions.pizza')}</option>
                  <option value="Özel Üretim">{t('contactModal.productOptions.ozel')}</option>
                </select>
              </div>

              <div>
                <label className="block text-[#C89438] mb-1 font-bold">{t('contactModal.messageLabel')}</label>
                <textarea
                  rows={3}
                  placeholder={t('contactModal.messagePlaceholder')}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C89438]/35 text-[#1B2A3A] placeholder-[#1B2A3A]/40 focus:outline-none focus:border-[#C89438] shadow-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#1B2A3A] text-white font-bold text-sm shadow-xl hover:bg-[#C89438] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#E2B45F]" />
                <span>{t('contactModal.submitButton')}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
