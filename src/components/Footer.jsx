import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Instagram, Twitter, Facebook, ArrowUp } from 'lucide-react';

// Google Maps'in kendi "Yerleştir" (embed) özelliğinden alınan, işletmenin
// gerçek Google Maps kaydına (Place ID) bağlı gömme adresi — adres metnine
// göre arama yapan genel bir sorgudan çok daha isabetli.
const FACTORY_MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3034.7403757986467!2d34.84650817643008!3d40.48100835172402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4080d77ba1314431%3A0x17f275d6eca94131!2sMutlukal%20G%C4%B1da%20Sanayi%20Ticaret%20A.%C5%9E.!5e0!3m2!1str!2sus!4v1787665539947!5m2!1str!2sus';

export default function Footer({ onOpenContact }) {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const productLines = t('footer.productLineItems', { returnObjects: true });

  return (
    <footer id="iletisim" className="bg-[#FAF3E3] text-[#1B2A3A] pt-20 pb-10 border-t border-[#C89438]/25 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Info - MUTLUKAL Only */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="MUTLUKAL"
                className="h-14 w-auto object-contain drop-shadow-md"
              />
              <span className="font-serif text-2xl font-bold tracking-wide text-[#1B2A3A]">
                MUTLUKAL
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#5C6B73] leading-relaxed max-w-sm font-medium">
              {t('footer.description')}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Twitter, href: 'https://x.com/MutlukalGida', label: 'X (Twitter)' },
                { icon: Instagram, href: 'https://www.instagram.com/mutlukalgida/', label: 'Instagram' },
                { icon: Facebook, href: 'https://www.facebook.com/mutlukalgida/?locale=tr_TR', label: 'Facebook' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-xl bg-white border border-[#C89438]/35 flex items-center justify-center text-[#C89438] hover:text-white hover:bg-[#1B2A3A] transition-all duration-300 shadow-sm"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#1B2A3A] mb-4">
              {t('footer.quickAccess')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#5C6B73] font-medium">
              <li>
                <a href="#hero" className="hover:text-[#C89438] transition-colors">
                  {t('footer.links.home')}
                </a>
              </li>
              <li>
                <a href="#kalite" className="hover:text-[#C89438] transition-colors">
                  {t('footer.links.quality')}
                </a>
              </li>
              <li>
                <a href="#urunler" className="hover:text-[#C89438] transition-colors">
                  {t('footer.links.products')}
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-[#C89438] transition-colors">
                  {t('footer.links.catalog')}
                </a>
              </li>
              <li>
                <a href="#sertifikalar" className="hover:text-[#C89438] transition-colors">
                  {t('footer.links.certifications')}
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-[#C89438] transition-colors text-left rtl:text-right cursor-pointer"
                >
                  {t('footer.links.offer')}
                </button>
              </li>
            </ul>
          </div>

          {/* Product Lines */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#1B2A3A] mb-4">
              {t('footer.productLines')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#5C6B73] font-medium">
              {productLines.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>

          {/* Contact Details - Exact Official Address & Phone from User Screenshot */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#1B2A3A] mb-4">
              {t('footer.contactTitle')}
            </h4>
            <div className="space-y-3.5 text-xs text-[#5C6B73] font-medium">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C89438] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong className="text-[#1B2A3A] block">{t('footer.addressLabel')}</strong>
                  {t('footer.address')}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C89438] shrink-0" />
                <span>
                  <strong className="text-[#1B2A3A]">{t('footer.phoneLabel')}</strong> (0364) 254 90 54
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C89438] shrink-0" />
                <span>{t('footer.email')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Factory Location & Video */}
        <div className="mb-16">
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B2A3A] mb-6">
            {t('footer.factoryTitle')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 sm:h-80 rounded-2xl overflow-hidden border border-[#C89438]/25 shadow-sm">
              <iframe
                title={t('footer.factoryTitle')}
                src={FACTORY_MAP_SRC}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <div className="h-64 sm:h-80 rounded-2xl overflow-hidden border border-[#C89438]/25 shadow-sm bg-black">
              <video
                src="/videos/fabrika.mp4"
                controls
                preload="metadata"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#C89438]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C6B73]">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex items-center gap-6 font-medium">
            <a href="#" className="hover:text-[#C89438]">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-[#C89438]">{t('footer.kvkk')}</a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white text-[#1B2A3A] hover:text-[#C89438] border border-[#C89438]/35 transition-colors cursor-pointer shadow-sm"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
