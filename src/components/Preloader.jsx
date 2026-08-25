import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function Preloader({ onComplete, totalFrames = 155, setLoadedImages }) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let loaded = 0;
    const images = new Array(totalFrames);

    const loadImage = (index) => {
      return new Promise((resolve) => {
        const img = new Image();
        const frameNum = index + 1;
        const src = `/images/mutlukal/image (${frameNum}).jpg`;
        img.src = src;

        img.onload = () => {
          images[index] = img;
          loaded++;
          setLoadedCount(loaded);
          const pct = Math.floor((loaded / totalFrames) * 100);
          setProgress(pct);
          resolve();
        };

        img.onerror = () => {
          images[index] = img;
          loaded++;
          setLoadedCount(loaded);
          const pct = Math.floor((loaded / totalFrames) * 100);
          setProgress(pct);
          resolve();
        };
      });
    };

    const loadAll = async () => {
      const batchSize = 15;
      for (let i = 0; i < totalFrames; i += batchSize) {
        const batch = [];
        for (let j = i; j < Math.min(i + batchSize, totalFrames); j++) {
          batch.push(loadImage(j));
        }
        await Promise.all(batch);
      }

      setLoadedImages(images);
      setTimeout(() => {
        setIsDone(true);
        setTimeout(() => {
          onComplete();
        }, 600);
      }, 300);
    };

    loadAll();
  }, [totalFrames]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF3E3] text-[#1B2A3A] transition-opacity duration-700 ${
        isDone ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Radial Gold Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,148,56,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        {/* Brand Logo & Badge - MUTLUKAL Only */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="MUTLUKAL"
            className="h-24 w-auto object-contain drop-shadow-[0_8px_16px_rgba(27,42,58,0.12)] mb-4 animate-pulse"
          />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#C89438]/40 text-[#C89438] text-xs font-bold tracking-widest uppercase shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#C89438]" />
            <span>MUTLUKAL</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-serif text-[#1B2A3A] font-bold tracking-wide mb-2">
          {t('preloader.title')}
        </h2>
        <p className="text-sm text-[#5C6B73] mb-8 font-medium">
          {t('preloader.subtitle')}
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-white h-3 rounded-full overflow-hidden p-0.5 border border-[#C89438]/30 mb-4 shadow-inner">
          <div
            className="bg-gradient-to-r from-[#C89438] via-[#E2B45F] to-[#1B2A3A] h-full rounded-full transition-all duration-150 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stats display */}
        <div className="w-full flex items-center justify-between text-xs text-[#5C6B73] font-mono font-semibold">
          <span>{t('preloader.frameLabel')} {loadedCount} / {totalFrames}</span>
          <span className="font-bold text-base text-[#1B2A3A]">{progress}%</span>
        </div>

        {isDone && (
          <div className="mt-6 flex items-center gap-2 text-xs text-emerald-600 font-bold animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('preloader.readyText')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
