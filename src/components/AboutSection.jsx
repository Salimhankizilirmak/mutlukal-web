import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Factory, Users, PieChart, Target, Eye } from 'lucide-react';

const STAT_ICONS = [Building2, Factory, Users, PieChart];

export default function AboutSection() {
  const { t } = useTranslation();
  const stats = t('about.stats', { returnObjects: true });

  return (
    <section id="hakkimizda" className="py-24 bg-[#FAF3E3] text-[#1B2A3A] relative border-b border-[#C89438]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#C89438]/35 text-[#C89438] text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-[#C89438]" />
            <span>{t('about.eyebrow')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1B2A3A] tracking-tight mb-6">
            {t('about.title')}
          </h2>
          <p className="text-sm sm:text-base text-[#5C6B73] leading-relaxed mb-3">
            {t('about.paragraph1')}
          </p>
          <p className="text-sm sm:text-base text-[#5C6B73] leading-relaxed">
            {t('about.paragraph2')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {stats.map((s, i) => {
            const Icon = STAT_ICONS[i];
            return (
              <div key={i} className="glass-card p-5 sm:p-6 rounded-2xl border border-[#C89438]/20 text-center">
                <div className="w-10 h-10 mx-auto rounded-xl bg-[#FAF3E3] border border-[#C89438]/35 flex items-center justify-center text-[#C89438] mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="block text-xl sm:text-2xl font-bold font-serif text-[#1B2A3A] mb-1">{s.value}</span>
                <span className="text-xs text-[#5C6B73] font-semibold">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-8 rounded-2xl border border-[#C89438]/20">
            <div className="w-12 h-12 rounded-xl bg-[#FAF3E3] border border-[#C89438]/35 flex items-center justify-center text-[#C89438] mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1B2A3A] mb-3">{t('about.missionTitle')}</h3>
            <p className="text-sm text-[#5C6B73] leading-relaxed">{t('about.missionText')}</p>
          </div>
          <div className="glass-card p-8 rounded-2xl border border-[#C89438]/20">
            <div className="w-12 h-12 rounded-xl bg-[#FAF3E3] border border-[#C89438]/35 flex items-center justify-center text-[#C89438] mb-5">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1B2A3A] mb-3">{t('about.visionTitle')}</h3>
            <p className="text-sm text-[#5C6B73] leading-relaxed">{t('about.visionText')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
