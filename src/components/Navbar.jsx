import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, PhoneCall, ChevronRight, ChevronDown } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar({ onOpenContact }) {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [corporateOpen, setCorporateOpen] = useState(false);
  const corporateRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the "Kurumsal" dropdown when clicking anywhere outside it.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (corporateRef.current && !corporateRef.current.contains(e.target)) {
        setCorporateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary links stay directly in the bar; secondary ones live under
  // "Kurumsal" so the header doesn't overflow/wrap with 8 top-level items.
  const primaryLinks = [
    { name: t('nav.home'), href: '#hero' },
    { name: t('nav.products'), href: '#urunler' },
    { name: t('nav.certifications'), href: '#sertifikalar' },
    { name: t('nav.contact'), href: '#iletisim' },
  ];

  const corporateLinks = [
    { name: t('nav.about'), href: '#hakkimizda' },
    { name: t('nav.quality'), href: '#kalite' },
    { name: t('nav.ads'), href: '#reklamlar' },
    { name: t('nav.events'), href: '#etkinlikler' },
    { name: t('nav.careers'), href: '#kariyer' },
    { name: t('nav.social'), href: '#sosyal-medya' },
  ];

  const allLinksForMobile = [
    primaryLinks[0],
    corporateLinks[0],
    corporateLinks[1],
    primaryLinks[1],
    primaryLinks[2],
    corporateLinks[2],
    corporateLinks[3],
    corporateLinks[4],
    corporateLinks[5],
    primaryLinks[3],
  ];

  const linkClass =
    'whitespace-nowrap text-sm font-semibold text-[#1B2A3A]/85 hover:text-[#C89438] transition-colors relative py-1 after:content-[\'\'] after:absolute after:bottom-0 ltr:after:left-0 rtl:after:right-0 after:w-0 after:h-0.5 after:bg-[#C89438] hover:after:w-full after:transition-all after:duration-300';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#FAF3E3]/95 backdrop-blur-md border-b border-[#C89438]/25 py-3 shadow-lg shadow-[#1B2A3A]/5'
          : 'bg-gradient-to-b from-[#FAF3E3]/95 via-[#FAF3E3]/70 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo - MUTLUKAL Only */}
          <a href="#" className="flex items-center gap-3 group shrink-0">
            <img
              src="/logo.png"
              alt="MUTLUKAL"
              className="h-12 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-serif text-2xl font-bold tracking-wide text-[#1B2A3A] group-hover:text-[#C89438] transition-colors">
              MUTLUKAL
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            {primaryLinks.map((link) => (
              <a key={link.name} href={link.href} className={linkClass}>
                {link.name}
              </a>
            ))}

            {/* "Kurumsal" dropdown groups the secondary links */}
            <div className="relative" ref={corporateRef}>
              <button
                onClick={() => setCorporateOpen((o) => !o)}
                className={`${linkClass} flex items-center gap-1 cursor-pointer after:hidden`}
              >
                {t('nav.corporate')}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${corporateOpen ? 'rotate-180' : ''}`} />
              </button>

              {corporateOpen && (
                <div className="absolute top-full ltr:left-1/2 rtl:right-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 mt-3 w-56 rounded-xl bg-white border border-[#C89438]/30 shadow-xl overflow-hidden py-1.5 animate-fadeIn">
                  {corporateLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setCorporateOpen(false)}
                      className="block px-4 py-2.5 text-sm font-semibold text-[#1B2A3A]/85 hover:bg-[#FAF3E3] hover:text-[#C89438] transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <LanguageSwitcher />
          </nav>

          {/* CTA & Official Phone */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
            <a
              href="tel:+903642549054"
              className="hidden xl:flex items-center gap-2 text-xs font-bold text-[#1B2A3A] hover:text-[#C89438] transition-colors px-3.5 py-2 rounded-xl bg-white/80 border border-[#C89438]/30 shadow-sm whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#C89438]" />
              <span>{t('nav.phone')}</span>
            </a>
            <button
              onClick={onOpenContact}
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1B2A3A] via-[#2A3E52] to-[#1B2A3A] text-white font-bold text-sm shadow-md hover:shadow-xl hover:shadow-[#1B2A3A]/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <span>{t('nav.offerButton')}</span>
                <ChevronRight className="w-4 h-4 text-[#E2B45F] group-hover:translate-x-1 rtl:rotate-180 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white border border-[#C89438]/30 text-[#1B2A3A] hover:text-[#C89438] focus:outline-none shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF3E3]/98 backdrop-blur-xl border-b border-[#C89438]/25 px-6 py-6 transition-all max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="flex flex-col gap-4">
            {allLinksForMobile.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#1B2A3A] hover:text-[#C89438] py-2 border-b border-[#1B2A3A]/10"
              >
                {link.name}
              </a>
            ))}
            <a
              href="tel:+903642549054"
              className="flex items-center gap-2 text-sm font-bold text-[#1B2A3A]"
            >
              <PhoneCall className="w-4 h-4 text-[#C89438]" />
              {t('nav.phone')}
            </a>
            <LanguageSwitcher compact />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="mt-2 w-full py-3 rounded-xl bg-[#1B2A3A] text-white font-bold text-center shadow-lg cursor-pointer"
            >
              {t('nav.offerButtonMobile')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
