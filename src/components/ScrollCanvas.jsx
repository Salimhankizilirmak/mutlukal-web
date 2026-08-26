import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowDown, ShieldCheck, Wheat, Factory, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollCanvas({ loadedImages = [], onOpenContact }) {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  useEffect(() => {
    if (!loadedImages || loadedImages.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const renderFrame = (index) => {
      const img = loadedImages[index];
      if (!img || !img.complete) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const imgRatio = img.width / img.height;
      const canvasRatio = w / h;

      let drawW, drawH, offsetX, offsetY;

      if (canvasRatio > imgRatio) {
        drawW = w;
        drawH = w / imgRatio;
        offsetX = 0;
        offsetY = (h - drawH) / 2;
      } else {
        drawW = h * imgRatio;
        drawH = h;
        offsetX = (w - drawW) / 2;
        offsetY = 0;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    };

    renderFrame(0);

    const frameObj = { frame: 0 };
    const totalFrames = loadedImages.length - 1;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=350%',
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          totalFrames,
          Math.floor(self.progress * totalFrames)
        );
        frameObj.frame = frameIndex;
        setCurrentFrameIndex(frameIndex);
        renderFrame(frameIndex);
      },
    });

    const handleResize = () => {
      renderFrame(frameObj.frame);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      trigger.kill();
      window.removeEventListener('resize', handleResize);
    };
  }, [loadedImages]);

  const total = loadedImages.length > 0 ? loadedImages.length : 155;
  const progressRatio = currentFrameIndex / total;

  return (
    <section ref={containerRef} id="hero" className="relative w-full h-screen overflow-hidden bg-[#FAF3E3]">
      {/* HTML5 Canvas Element */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Subtle vignette shadow to ensure total legibility without box overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF3E3] via-black/20 to-black/40 z-10 pointer-events-none" />

      {/* OVERLAY SECTION 1: HERO OVERLAY (Frames 0% - 30%) */}
      <div
        className={`absolute inset-0 z-20 flex flex-col justify-center items-center px-4 sm:px-6 transition-all duration-700 ${
          progressRatio <= 0.32
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-12 pointer-events-none'
        }`}
      >
        <div className="max-w-4xl mx-auto text-center px-4">
          {/* Glass Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-[#E2B45F] text-xs sm:text-sm font-bold uppercase tracking-widest mb-6 shadow-xl border border-[#E2B45F]/40">
            <Sparkles className="w-4 h-4 text-[#E2B45F]" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15] mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            {t('hero.titlePrefix')}{' '}
            <span className="text-[#E2B45F] block mt-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              {t('hero.titleHighlight')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-[#FAF3E3] max-w-2xl mx-auto font-medium leading-relaxed mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {t('hero.subtitle')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#urunler"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1B2A3A] hover:bg-[#C89438] text-white font-bold text-base shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-[#E2B45F]/30"
            >
              <span>{t('hero.ctaExplore')}</span>
              <ChevronRight className="w-5 h-5 text-[#E2B45F] rtl:rotate-180" />
            </a>

            <button
              onClick={onOpenContact}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-black/60 backdrop-blur-md text-white font-bold text-base border border-white/40 hover:bg-black/80 shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('hero.ctaOrder')}</span>
            </button>
          </div>
        </div>

        {/* Scroll indicator prompt */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white font-bold animate-bounce drop-shadow-md">
          <span className="text-xs font-mono tracking-widest uppercase bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">{t('hero.scrollDown')}</span>
          <ArrowDown className="w-4 h-4 text-[#E2B45F]" />
        </div>
      </div>

      {/* OVERLAY SECTION 2: HYGIENE & AUTOMATION (Frames 35% - 65%) */}
      <div
        className={`absolute inset-0 z-20 flex items-center justify-start rtl:justify-end px-6 sm:px-12 lg:px-24 transition-all duration-700 ${
          progressRatio > 0.32 && progressRatio <= 0.65
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-12 pointer-events-none'
        }`}
      >
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-3 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-[#E2B45F]/40 text-[#E2B45F] shadow-lg">
            <Factory className="w-5 h-5 text-[#E2B45F]" />
            <span className="text-xs font-bold tracking-widest uppercase">
              {t('hero.hygieneBadge')}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            {t('hero.hygieneTitle')}
          </h2>

          <p className="text-base sm:text-lg text-[#FAF3E3] font-medium leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {t('hero.hygieneDesc')}
          </p>

          <div className="pt-2">
            <div className="inline-block bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl">
              <span className="block font-bold text-2xl text-[#E2B45F]">{t('hero.statIsoValue')}</span>
              <span className="text-xs text-white font-medium">{t('hero.statIsoLabel')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY SECTION 3: PREMIUM FLOUR & FLAVOR (Frames 68% - 95%) */}
      <div
        className={`absolute inset-0 z-20 flex items-center justify-end rtl:justify-start px-6 sm:px-12 lg:px-24 transition-all duration-700 ${
          progressRatio > 0.65
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-12 pointer-events-none'
        }`}
      >
        <div className="max-w-xl space-y-4 text-right rtl:text-left">
          <div className="inline-flex items-center gap-3 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-[#E2B45F]/40 text-[#E2B45F] shadow-lg ml-auto rtl:ml-0 rtl:mr-auto">
            <Wheat className="w-5 h-5 text-[#E2B45F]" />
            <span className="text-xs font-bold tracking-widest uppercase">
              {t('hero.wheatBadge')}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            {t('hero.wheatTitle')}
          </h2>

          <p className="text-base sm:text-lg text-[#FAF3E3] font-medium leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {t('hero.wheatDesc')}
          </p>

          <div className="inline-flex items-center gap-3 bg-black/50 backdrop-blur-md p-3.5 rounded-xl border border-[#E2B45F]/40 shadow-xl ml-auto rtl:ml-0 rtl:mr-auto">
            <ShieldCheck className="w-5 h-5 text-[#E2B45F] shrink-0" />
            <span className="text-xs font-bold text-white">
              {t('hero.halalBadge')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
