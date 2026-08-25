import React from 'react';
import { useTranslation } from 'react-i18next';
import { Award, FileText, ExternalLink, ArrowUpRight } from 'lucide-react';

// Real PDF certificates — file paths never change with language, only the
// displayed labels do (translated separately below).
const DOC_HREFS = [
  '/EVRAK/MUTLUKAL%20GIDA%20ISO%2022000.PDF',
  '/EVRAK/MUTLUKAL%20GIDA%20ISO%209001..PDF',
  '/EVRAK/MUTLUKAL%20GIDA%20FSSC%201%20TR.pdf',
  '/EVRAK/Sedex%20Certificate%202026.pdf',
  '/EVRAK/TRK%20STANDARTLARINA%20UYGUNLUK%20BELGES%2002.12.2026.PDF',
  '/EVRAK/Tortillas%20038016-HG-0102%20Helal%20Belgesi.PDF',
  '/EVRAK/Tortillove%20038016-HG-0202%20Helal%20Belgesi.PDF',
  '/EVRAK/Happylla%20038016-HG-0302%20Helal%20Belgesi.PDF',
];

export default function Certifications() {
  const { t } = useTranslation();
  const docs = t('certifications.docs', { returnObjects: true });

  return (
    <section id="sertifikalar" className="py-24 bg-[#FAF3E3] text-[#1B2A3A] relative border-t border-[#C89438]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#C89438]/35 text-[#C89438] text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <Award className="w-3.5 h-3.5 text-[#C89438]" />
            <span>{t('certifications.eyebrow')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1B2A3A] tracking-tight mb-4">
            {t('certifications.title')}
          </h2>
          <p className="text-base text-[#5C6B73] font-normal">
            {t('certifications.subtitle')}
          </p>
        </div>

        {/* Certificate & Document Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {docs.map((doc, i) => (
            <a
              key={i}
              href={DOC_HREFS[i]}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-6 rounded-2xl border border-[#C89438]/20 hover:border-[#C89438]/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group bg-white shadow-sm"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FAF3E3] border border-[#C89438]/35 flex items-center justify-center text-[#C89438] group-hover:scale-110 group-hover:bg-[#C89438] group-hover:text-white transition-all mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-[#C89438] block mb-1">
                  {doc.code}
                </span>
                <h3 className="text-lg font-serif font-bold text-[#1B2A3A] mb-2 group-hover:text-[#C89438] transition-colors">
                  {doc.title}
                </h3>
                <p className="text-xs text-[#5C6B73] leading-relaxed mb-4">
                  {doc.desc}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold border-t border-[#C89438]/20 pt-3">
                <span className="text-emerald-700">{t('certifications.activeLabel')}</span>
                <span className="flex items-center gap-1 text-[#C89438] opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('certifications.viewLabel')} <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Featured: Kalite ve Gıda Güvenliği Politikası */}
        <div className="mt-8">
          <a
            href="/kalite-politikasi.html"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-7 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1B2A3A] via-[#22354a] to-[#1B2A3A] border border-[#C89438]/40 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#1B2A3A]/20 transition-all duration-300"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 85% 20%, rgba(200,148,56,0.5), transparent 55%)',
              }}
            />
            <div className="relative flex items-start gap-4">
              <div className="w-14 h-14 shrink-0 rounded-xl bg-[#C89438]/15 border border-[#C89438]/50 flex items-center justify-center text-[#E2B45F] group-hover:scale-110 group-hover:bg-[#C89438]/25 transition-all">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#E2B45F] mb-1 block">
                  {t('certifications.featuredEyebrow')}
                </span>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1.5">
                  {t('certifications.featuredTitle')}
                </h4>
                <p className="text-sm text-white/70 max-w-xl leading-relaxed">
                  {t('certifications.featuredDesc')}
                </p>
              </div>
            </div>
            <div className="relative shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C89438] text-[#1B2A3A] font-bold text-sm group-hover:bg-[#E2B45F] transition-colors">
              <span>{t('certifications.featuredButton')}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform rtl:-scale-x-100" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
