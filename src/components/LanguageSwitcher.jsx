import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n';

export default function LanguageSwitcher({ compact = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) || SUPPORTED_LANGUAGES[0];

  const selectLanguage = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  if (compact) {
    // Flat list for the mobile drawer — no dropdown needed there.
    return (
      <div className="flex flex-wrap items-center gap-2">
        {SUPPORTED_LANGUAGES.map((lng) => (
          <button
            key={lng.code}
            onClick={() => selectLanguage(lng.code)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              lng.code === current.code
                ? 'bg-[#1B2A3A] text-white border-[#1B2A3A]'
                : 'bg-white text-[#1B2A3A] border-[#C89438]/30 hover:border-[#C89438]'
            }`}
          >
            {lng.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-sm font-semibold text-[#1B2A3A]/85 hover:text-[#C89438] transition-colors cursor-pointer whitespace-nowrap"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span>{current.code.toUpperCase()}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-3 w-40 rounded-xl bg-white border border-[#C89438]/30 shadow-xl overflow-hidden py-1.5 z-50 ltr:right-0 rtl:left-0">
          {SUPPORTED_LANGUAGES.map((lng) => (
            <button
              key={lng.code}
              onClick={() => selectLanguage(lng.code)}
              className={`block w-full text-start px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                lng.code === current.code
                  ? 'text-[#C89438] bg-[#FAF3E3]'
                  : 'text-[#1B2A3A]/85 hover:bg-[#FAF3E3] hover:text-[#C89438]'
              }`}
            >
              {lng.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
