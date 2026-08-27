import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Award, Globe2, Sparkles, CheckCircle } from 'lucide-react';

const ICONS = [Cpu, Award, Globe2];

export default function QualitySection() {
  const { t } = useTranslation();
  const cards = t('quality.cards', { returnObjects: true });

  return (
    <section id="kalite" className="relative py-28 bg-[#FAF3E3] text-[#1B2A3A] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C89438]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FAF3E3] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#C89438]/35 text-[#C89438] text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C89438]" />
            <span>{t('quality.eyebrow')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1B2A3A] tracking-tight mb-6">
            {t('quality.title')}
          </h2>
          <p className="text-base sm:text-lg text-[#5C6B73] leading-relaxed font-normal">
            {t('quality.subtitle')}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {cards.map((item, idx) => {
            const Icon = ICONS[idx];
            return (
              <div
                key={idx}
                className="group glass-card p-8 rounded-2xl border border-[#C89438]/20 hover:border-[#C89438]/50 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  {/* Icon Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-[#FAF3E3] border border-[#C89438]/35 flex items-center justify-center text-[#C89438] group-hover:scale-110 group-hover:bg-[#1B2A3A] group-hover:text-[#FAF3E3] transition-all duration-300 mb-6 shadow-sm">
                    <Icon className="w-7 h-7" />
                  </div>

                  <span className="text-xs font-bold text-[#C89438] tracking-widest uppercase mb-1 block">
                    {item.subtitle}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#1B2A3A] mb-4 group-hover:text-[#C89438] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#5C6B73] leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="border-t border-[#C89438]/20 pt-5 space-y-2.5">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-[#1B2A3A]/90 font-medium">
                      <CheckCircle className="w-4 h-4 text-[#C89438] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Statistics Banner */}
        <div className="glass-panel p-8 sm:p-10 rounded-2xl border border-[#C89438]/30 grid grid-cols-2 gap-6 text-center shadow-lg">
          <div className="p-4 border-r rtl:border-r-0 rtl:border-l border-[#C89438]/20 last:border-0">
            <span className="block text-3xl sm:text-4xl font-bold font-serif text-[#1B2A3A] mb-1">
              {t('quality.statCountriesValue')}
            </span>
            <span className="text-xs sm:text-sm text-[#5C6B73] font-semibold">{t('quality.statCountriesLabel')}</span>
          </div>

          <div className="p-4">
            <span className="block text-3xl sm:text-4xl font-bold font-serif text-[#1B2A3A] mb-1">
              {t('quality.statAutomationValue')}
            </span>
            <span className="text-xs sm:text-sm text-[#5C6B73] font-semibold">{t('quality.statAutomationLabel')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
