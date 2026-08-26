import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Box, ChevronRight, Search, Ruler, Package } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// Interactive Magnifier Zoom Lens Component (Photo 2 Style)
function ImageMagnifier({ src, alt, specs, t }) {
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
  const lensSize = 120;

  const packOptions = specs?.packOptions || [];

  return (
    <div className="flex flex-col md:flex-row items-stretch gap-6 w-full my-4">
      {/* Left Container: Main Image & Lens Box */}
      <div
        className="relative w-full md:w-1/2 h-80 bg-[#FAF3E3] rounded-2xl p-4 flex items-center justify-center border border-[#C89438]/35 cursor-crosshair overflow-hidden group shadow-inner"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-full max-w-full object-contain drop-shadow-2xl select-none"
        />

        {/* Hover Lens Rectangle */}
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
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.35)',
              borderRadius: '8px',
            }}
          />
        )}
      </div>

      {/* Right Container: Product Specs + Magnified Viewport */}
      <div className="w-full md:w-1/2 min-h-80 bg-white rounded-2xl border-2 border-[#C89438]/40 overflow-hidden relative shadow-2xl">
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
          <div className="flex flex-col h-full p-6 sm:p-7 overflow-y-auto">
            <span className="text-[11px] font-bold text-[#C89438] uppercase tracking-widest block mb-4">
              {t('catalog.specsLabel')}
            </span>

            {/* Fixed diameter */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF3E3] border border-[#C89438]/25 mb-4">
              <div className="w-9 h-9 shrink-0 rounded-lg bg-white border border-[#C89438]/30 flex items-center justify-center text-[#C89438]">
                <Ruler className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-[#5C6B73] uppercase tracking-wider">
                  {t('catalog.diameterLabel')}
                </div>
                <div className="text-sm font-bold text-[#1B2A3A]">{specs?.boyut || '—'}</div>
              </div>
            </div>

            {/* Real pack size options — this product ships in multiple pack counts, not a single fixed one */}
            <div className="text-[10px] font-bold text-[#5C6B73] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-[#C89438]" />
              {t('catalog.packOptionsLabel')}
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {packOptions.length > 0 ? (
                packOptions.map((opt, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 rounded-lg bg-[#FAF3E3] border border-[#C89438]/30 text-center"
                  >
                    <div className="text-xs font-bold text-[#1B2A3A]">{opt.adet}</div>
                    <div className="text-[10px] font-semibold text-[#C89438]">{opt.gramaj}</div>
                  </div>
                ))
              ) : (
                <span className="text-sm text-[#5C6B73]">—</span>
              )}
            </div>
            <p className="text-[11px] text-[#5C6B73] leading-relaxed">
              {t('catalog.packOptionsHint')}
            </p>

            <p className="text-[11px] text-[#5C6B73] mt-4 pt-4 border-t border-[#C89438]/15 leading-relaxed flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#C89438] shrink-0" />
              {t('catalog.magnifierHint')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Fields that don't change with language — index-matched to the translated
// "catalog.items" array in the locale files.
const GALLERY_META = [
  { image: '/images/products/sade.png', specs: { boyut: '25 cm', packOptions: [{ adet: '4 Adet', gramaj: '260 g' }, { adet: '6 Adet', gramaj: '390 g' }, { adet: '8 Adet', gramaj: '520 g' }, { adet: '10 Adet', gramaj: '650 g' }, { adet: '12 Adet', gramaj: '780 g' }, { adet: '18 Adet', gramaj: '1170 g' }] } },
  { image: '/images/products/domatesli.png', specs: { boyut: '25 cm', packOptions: [{ adet: '4 Adet', gramaj: '250 g' }, { adet: '6 Adet', gramaj: '390 g' }, { adet: '10 Adet', gramaj: '650 g' }] } },
  { image: '/images/products/ispanakli.png', specs: { boyut: '25 cm', packOptions: [{ adet: '4 Adet', gramaj: '250 g' }, { adet: '6 Adet', gramaj: '390 g' }, { adet: '10 Adet', gramaj: '650 g' }] } },
  { image: '/images/products/peynirli.png', specs: { boyut: '25 cm', packOptions: [{ adet: '4 Adet', gramaj: '250 g' }, { adet: '6 Adet', gramaj: '390 g' }, { adet: '12 Adet', gramaj: '780 g' }] } },
  { image: '/images/products/tambugday.png', specs: { boyut: '25 cm', packOptions: [{ adet: '4 Adet', gramaj: '260 g' }, { adet: '6 Adet', gramaj: '390 g' }, { adet: '8 Adet', gramaj: '520 g' }, { adet: '10 Adet', gramaj: '650 g' }, { adet: '18 Adet', gramaj: '1170 g' }] } },
  { image: '/images/products/pizza.png', specs: { boyut: '26 cm', packOptions: [{ adet: '2 Adet', gramaj: '240 g' }, { adet: '4 Adet', gramaj: '480 g' }] } },
  { image: '/images/products/proteinli.png', specs: { boyut: '20 cm', packOptions: [{ adet: '4 Adet', gramaj: '166 g' }] } },
  { image: '/images/products/taco.png', specs: { boyut: '15 cm', packOptions: [{ adet: '6 Adet', gramaj: '150 g' }, { adet: '10 Adet', gramaj: '250 g' }, { adet: '18 Adet', gramaj: '450 g' }] } },
];

const LANG_SUFFIX = { tr: '', en: '_en', ru: '_ru', ar: '_ar' };

function pickLang(row, field, lang) {
  const suffix = LANG_SUFFIX[lang] || '';
  const value = suffix ? row[`${field}${suffix}`] : row[field];
  return value ? value : row[field];
}

export default function CatalogSpecSection({ onOpenContact }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || 'tr';

  const [selectedMockup, setSelectedMockup] = useState(null);

  const translatedItems = t('catalog.items', { returnObjects: true });
  const DEFAULT_GALLERY = GALLERY_META.map((meta, i) => ({ ...meta, ...translatedItems[i] }));

  const [productMockups, setProductMockups] = useState(DEFAULT_GALLERY);
  const [dbRows, setDbRows] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;
    supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order')
      .then(({ data, error }) => {
        if (cancelled || error || !data || data.length === 0) return;
        setDbRows(data);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!dbRows) {
      setProductMockups(DEFAULT_GALLERY);
      return;
    }
    setProductMockups(
      dbRows.map((g) => ({
        title: pickLang(g, 'title', lang),
        category: pickLang(g, 'category', lang),
        image: g.image_url,
        specs: { boyut: g.boyut, packOptions: g.pack_options || [] },
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbRows, lang]);

  return (
    <section id="katalog" className="py-24 bg-[#FAF3E3] text-[#1B2A3A] relative border-t border-[#C89438]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 border-b border-[#C89438]/20 pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#C89438]/35 text-[#C89438] text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <FileText className="w-3.5 h-3.5 text-[#C89438]" />
            <span>{t('catalog.eyebrow')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1B2A3A] tracking-tight">
            {t('catalog.title')}
          </h2>
          <p className="text-sm sm:text-base text-[#5C6B73] max-w-2xl mt-2 font-medium">
            {t('catalog.subtitle')}
          </p>
        </div>

        {/* Product Gallery with Smooth Hover Zoom */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1B2A3A] flex items-center gap-2">
                <Box className="w-5 h-5 text-[#C89438]" />
                <span>{t('catalog.galleryTitle')}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#5C6B73] font-medium mt-1">
                {t('catalog.gallerySubtitle')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productMockups.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedMockup(item)}
                className="group glass-card rounded-2xl overflow-hidden border border-[#C89438]/25 hover:border-[#C89438]/60 bg-white transition-all duration-500 hover:-translate-y-2 cursor-pointer shadow-md hover:shadow-2xl flex flex-col justify-between"
              >
                {/* Image Frame */}
                <div className="relative h-56 overflow-hidden bg-[#FAF3E3] flex items-center justify-center p-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                  />
                  <div className="absolute inset-0 bg-[#1B2A3A]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3.5 py-2 rounded-xl bg-white text-[#1B2A3A] font-bold text-xs shadow-lg flex items-center gap-1.5 border border-[#C89438]/40">
                      <Search className="w-4 h-4 text-[#C89438]" /> {t('catalog.zoomHint')}
                    </span>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="p-4 bg-white border-t border-[#C89438]/15">
                  <span className="text-[10px] font-bold text-[#C89438] uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#1B2A3A] group-hover:text-[#C89438] transition-colors truncate">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Inspector with Magnifier Lens (Photo 2 Style) */}
        {selectedMockup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-4xl bg-white border border-[#C89438]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-left rtl:text-right">
              <div className="flex items-center justify-between mb-4 border-b border-[#C89438]/20 pb-4">
                <div>
                  <span className="text-xs font-bold text-[#C89438] uppercase tracking-widest block">
                    {t('catalog.modalEyebrow')}
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-[#1B2A3A]">
                    {selectedMockup.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedMockup(null)}
                  className="px-4 py-2 rounded-xl bg-[#FAF3E3] text-[#1B2A3A] font-bold text-xs border border-[#C89438]/40 hover:bg-[#1B2A3A] hover:text-white transition-colors cursor-pointer shadow-sm"
                >
                  {t('catalog.close')}
                </button>
              </div>

              {/* Magnifier Component + Spec Panel */}
              <ImageMagnifier src={selectedMockup.image} alt={selectedMockup.title} specs={selectedMockup.specs} t={t} />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#C89438]/20">
                <p className="text-xs text-[#5C6B73] font-medium">
                  💡 {t('catalog.tipText')}
                </p>
                <button
                  onClick={() => {
                    setSelectedMockup(null);
                    onOpenContact();
                  }}
                  className="px-6 py-3 rounded-xl bg-[#1B2A3A] text-white font-bold text-xs hover:bg-[#C89438] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
                >
                  <span>{t('catalog.requestButton')}</span>
                  <ChevronRight className="w-4 h-4 text-[#E2B45F] rtl:rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
