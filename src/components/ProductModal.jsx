import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, ArrowRight, Search } from 'lucide-react';

function ImageMagnifierModal({ src, alt, t }) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);

  const handleMouseEnter = (e) => {
    const elem = e.currentTarget;
    const { width, height } = elem.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  const handleMouseMove = (e) => {
    const elem = e.currentTarget;
    const { top, left } = elem.getBoundingClientRect();
    const xPos = e.clientX - left;
    const yPos = e.clientY - top;
    setXY([xPos, yPos]);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const zoomLevel = 2.5;
  const lensSize = 110;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full my-2">
      {/* Left Container: Main Image & Lens Box */}
      <div
        className="relative w-full sm:w-1/2 h-64 bg-white rounded-xl p-3 flex items-center justify-center border border-[#C89438]/35 cursor-crosshair overflow-hidden group shadow-inner"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-full max-w-full object-contain drop-shadow-xl select-none"
        />

        {/* Hover Lens Box */}
        {showMagnifier && (
          <div
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              height: `${lensSize}px`,
              width: `${lensSize}px`,
              top: `${Math.max(0, Math.min(y - lensSize / 2, imgHeight - lensSize))}px`,
              left: `${Math.max(0, Math.min(x - lensSize / 2, imgWidth - lensSize))}px`,
              border: '2px solid #C89438',
              backgroundColor: 'rgba(200, 148, 56, 0.2)',
              boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
              borderRadius: '6px',
            }}
          />
        )}
      </div>

      {/* Right Container: Magnified High Resolution Viewport */}
      <div className="w-full sm:w-1/2 h-64 bg-white rounded-xl border-2 border-[#C89438]/40 overflow-hidden relative shadow-lg flex items-center justify-center">
        {showMagnifier ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url('${src}')`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
              backgroundPositionX: `${-x * zoomLevel + (imgWidth * zoomLevel) / 4}px`,
              backgroundPositionY: `${-y * zoomLevel + (imgHeight * zoomLevel) / 4}px`,
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center text-[#5C6B73]">
            <div className="w-10 h-10 rounded-full bg-[#FAF3E3] border border-[#C89438]/40 flex items-center justify-center text-[#C89438] mb-2 animate-pulse">
              <Search className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#1B2A3A]">
              {t('productModal.magnifierTitle')}
            </p>
            <p className="text-[11px] text-[#5C6B73] mt-1 max-w-xs">
              {t('productModal.magnifierHint')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductModal({ product, onClose, onOpenContact }) {
  const { t } = useTranslation();
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#FAF3E3] border border-[#C89438]/45 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-[#1B2A3A]">
        {/* Header */}
        <div className="p-6 bg-[#FAF3E3] border-b border-[#C89438]/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#C89438] tracking-widest uppercase block">
              {product.subtitle}
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#1B2A3A]">
              {product.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white text-[#1B2A3A] hover:text-[#C89438] border border-[#C89438]/40 shadow-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body with Magnifier */}
        <div className="p-6 overflow-y-auto space-y-6 bg-[#FAF3E3]">
          {/* Interactive Magnifier Component */}
          <ImageMagnifierModal src={product.image} alt={product.title} t={t} />

          <p className="text-xs sm:text-sm text-[#5C6B73] font-medium leading-relaxed">
            {product.description}
          </p>

          {/* Specs Table */}
          <div className="bg-white rounded-xl p-4 border border-[#C89438]/25 space-y-3 text-xs shadow-sm">
            <h4 className="font-serif font-bold text-sm text-[#1B2A3A] mb-2">
              {t('productModal.techSpecs')}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[#C89438] block text-[11px] font-bold">{t('productModal.diametersLabel')}</span>
                <span className="font-semibold text-[#1B2A3A]">{product.sizes.join(', ')}</span>
              </div>
              <div>
                <span className="text-[#C89438] block text-[11px] font-bold">{t('productModal.packCapacityLabel')}</span>
                <span className="font-semibold text-[#1B2A3A]">{product.packCount}</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#1B2A3A] mb-3">
              {t('productModal.featuresTitle')}
            </h4>
            <div className="space-y-2">
              {product.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#1B2A3A]/90 font-medium">
                  <Check className="w-4 h-4 text-[#C89438]" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#C89438]/25 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#5C6B73] hover:text-[#1B2A3A] cursor-pointer"
          >
            {t('productModal.close')}
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenContact();
            }}
            className="px-6 py-2.5 rounded-xl bg-[#1B2A3A] text-white font-bold text-xs shadow-lg hover:bg-[#C89438] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t('productModal.offerButton')}</span>
            <ArrowRight className="w-4 h-4 text-[#E2B45F] rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
