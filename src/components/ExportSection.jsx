import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe2, Sparkles, Award, Truck, ChevronRight, ShieldCheck } from 'lucide-react';

const STAT_ICONS = [Globe2, Award, Truck];

export default function ExportSection({ onOpenContact }) {
  const { t } = useTranslation();
  const stats = t('export.stats', { returnObjects: true });
  const pillars = t('export.pillars', { returnObjects: true });

  return (
    <section id="ihracat" className="relative py-12 sm:py-16 min-h-screen flex flex-col justify-center overflow-hidden bg-[#0A1018] text-white">
      {/* Background Video Element - Full Viewport Cover.
          The clip is an ultra-wide panorama (~2.35:1); on a tall mobile
          section (this one grows past 1300px with the stats/pillars below)
          stretching it with h-full would force a 2x+ upscale past its native
          resolution and blur badly. Capping the video's own box to a shorter
          band on mobile keeps it within its native resolution — the dark
          gradient overlay already fades to solid color beneath it. */}
      <video
        src="/videos/map-export.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-x-0 top-0 sm:inset-0 w-full h-[50vh] sm:h-full object-cover z-0 opacity-90 filter brightness-95 saturate-125"
      />

      {/* Subtle Vignette Overlay for High Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1018] via-black/25 to-black/50 z-10 pointer-events-none" />

      {/* Main Compact Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-20 w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#E2B45F]/40 text-[#E2B45F] text-[11px] font-bold uppercase tracking-widest mb-3 shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-[#E2B45F]" />
            <span>{t('export.eyebrow')}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight mb-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            {t('export.titlePrefix')}{' '}
            <span className="text-[#E2B45F] inline-block drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              {t('export.titleHighlight')}
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-[#FAF3E3] font-medium leading-relaxed max-w-lg mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            {t('export.subtitle')}
          </p>
        </div>

        {/* Stats Counter Grid - Compact & Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {stats.map((item, idx) => {
            const Icon = STAT_ICONS[idx];
            return (
              <div
                key={idx}
                className="p-5 text-center flex flex-col items-center justify-center group"
              >
                <div className="w-11 h-11 rounded-xl bg-black/50 backdrop-blur-md border border-[#E2B45F]/40 flex items-center justify-center text-[#E2B45F] group-hover:scale-110 group-hover:bg-[#E2B45F] group-hover:text-[#0A1018] transition-all duration-300 mb-3 shadow-xl">
                  <Icon className="w-5 h-5" />
                </div>

                <span className="block text-3xl sm:text-4xl font-serif font-bold text-[#E2B45F] mb-1 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                  {item.value}
                </span>

                <h3 className="text-lg font-serif font-bold text-white mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  {item.label}
                </h3>

                <p className="text-xs text-[#FAF3E3] leading-normal font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] max-w-xs">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Corporate Regional Logistics Standards - Compact Grid */}
        <div className="pt-5 border-t border-[#E2B45F]/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <span className="text-[10px] font-bold text-[#E2B45F] tracking-widest uppercase block drop-shadow-md">
                {t('export.regionsEyebrow')}
              </span>
              <h4 className="font-serif font-bold text-lg sm:text-xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                {t('export.regionsTitle')}
              </h4>
            </div>
            <button
              onClick={onOpenContact}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A24C] via-[#E2B45F] to-[#B88432] text-[#0E1722] font-bold text-xs shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>{t('export.distributorCta')}</span>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-black/40 backdrop-blur-md border border-[#E2B45F]/30 hover:border-[#E2B45F]/70 transition-all duration-300 space-y-1 shadow-lg"
              >
                <div className="flex items-center gap-1.5 text-[#E2B45F]">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <h5 className="font-serif font-bold text-xs text-white drop-shadow-md">
                    {p.region}
                  </h5>
                </div>
                <p className="text-[11px] text-[#FAF3E3] leading-snug font-normal drop-shadow-md">
                  {p.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
