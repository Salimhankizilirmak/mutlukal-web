import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowRight, Layers, Check, Info } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// Fields that don't change with language — these stay index-matched to the
// translated "products.items" array in the locale files.
const PRODUCT_META = [
  { id: 'sade-tortilla-lavas', category: 'sade', image: '/images/products/sade.png', sizes: ['15 cm', '20 cm', '25 cm', '26 cm', '30 cm'], packCount: '10 - 18 Adet / Paket', boxCount: '12 - 18 Paket / Koli' },
  { id: 'tam-bugday-tortilla', category: 'tambugday', image: '/images/products/tambugday.png', sizes: ['15 cm', '20 cm', '25 cm', '30 cm'], packCount: '12 - 18 Adet / Paket', boxCount: '12 - 20 Paket / Koli' },
  { id: 'aromali-tortilla', category: 'aromali', image: '/images/products/domatesli.png', sizes: ['15 cm', '20 cm', '25 cm', '30 cm'], packCount: '10 - 18 Adet / Paket', boxCount: '12 - 18 Paket / Koli' },
  { id: 'pizza-tabani', category: 'pizza', image: '/images/products/pizza.png', sizes: ['26 cm'], packCount: '4 - 6 Adet / Paket', boxCount: '6 - 8 Paket / Koli' },
];

// Supabase column suffixes per language — Turkish has no suffix (base column).
const LANG_SUFFIX = { tr: '', en: '_en', ru: '_ru', ar: '_ar' };

function pickLang(row, field, lang) {
  const suffix = LANG_SUFFIX[lang] || '';
  const value = suffix ? row[`${field}${suffix}`] : row[field];
  // Fall back to Turkish if this product has no translation filled in yet.
  return value && (!Array.isArray(value) || value.length > 0) ? value : row[field];
}

export default function ProductsGrid({ onSelectProduct, onOpenContact }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || 'tr';

  const translatedItems = t('products.items', { returnObjects: true });
  const DEFAULT_PRODUCTS = PRODUCT_META.map((meta, i) => ({ ...meta, ...translatedItems[i] }));

  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [activeTab, setActiveTab] = useState('all');
  const [dbRows, setDbRows] = useState(null); // raw Supabase rows, re-mapped whenever language changes

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;
    supabase
      .from('products')
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

  // Re-derive display products whenever the DB rows OR the language changes.
  useEffect(() => {
    if (!dbRows) {
      setProducts(DEFAULT_PRODUCTS);
      return;
    }
    setProducts(
      dbRows.map((p) => ({
        id: p.slug,
        category: p.category,
        title: pickLang(p, 'title', lang),
        subtitle: pickLang(p, 'subtitle', lang),
        image: p.image_url,
        badge: p.badge,
        sizes: p.sizes || [],
        packCount: p.pack_count,
        boxCount: p.box_count,
        description: pickLang(p, 'description', lang),
        features: pickLang(p, 'features', lang) || [],
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbRows, lang]);

  const filteredProducts =
    activeTab === 'all'
      ? products
      : products.filter((p) => p.category === activeTab);

  const tabs = [
    { id: 'all', label: t('products.tabs.all') },
    { id: 'sade', label: t('products.tabs.sade') },
    { id: 'tambugday', label: t('products.tabs.tambugday') },
    { id: 'aromali', label: t('products.tabs.aromali') },
    { id: 'pizza', label: t('products.tabs.pizza') },
  ];

  return (
    <section id="urunler" className="py-28 bg-[#F4EAD5]/60 text-[#1B2A3A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#C89438]/35 text-[#C89438] text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C89438]" />
              <span>{t('products.eyebrow')}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1B2A3A] tracking-tight">
              {t('products.title')}
            </h2>
            <p className="text-sm text-[#5C6B73] max-w-xl mt-2 font-medium">
              {t('products.subtitle')}
            </p>
          </div>

          {/* Filter Tabs - 4 Exact Excel Categories */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-white border border-[#C89438]/25 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#1B2A3A] text-white shadow-md'
                    : 'text-[#1B2A3A]/75 hover:text-[#1B2A3A] hover:bg-[#FAF3E3]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid - 4 Exact Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group glass-card rounded-2xl overflow-hidden border border-[#C89438]/20 hover:border-[#C89438]/50 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between"
            >
              {/* Product Image Frame */}
              <div className="relative h-64 overflow-hidden bg-[#FAF3E3] p-4 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] via-transparent to-transparent opacity-60" />
                <span className="absolute top-4 ltr:left-4 rtl:right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#C89438]/40 text-[#1B2A3A] text-xs font-bold shadow-md">
                  {product.badge}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <span className="text-xs font-bold text-[#C89438] tracking-wider uppercase block mb-1">
                    {product.subtitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1B2A3A] mb-3 group-hover:text-[#C89438] transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6B73] leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Specs Pill List */}
                  <div className="space-y-3 mb-6 bg-[#FAF3E3]/70 p-4 rounded-xl border border-[#C89438]/20 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[#C89438] flex items-center gap-1.5 font-bold">
                        <Layers className="w-3.5 h-3.5" />
                        {t('products.sizesLabel')}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded bg-white border border-[#C89438]/35 text-[#1B2A3A] font-mono text-[11px] font-semibold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Features Bullet List */}
                  <div className="space-y-2 mb-6">
                    {product.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#1B2A3A]/90 font-medium">
                        <Check className="w-3.5 h-3.5 text-[#C89438] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <button
                  onClick={() => onSelectProduct(product)}
                  className="w-full py-3 rounded-xl bg-[#FAF3E3] hover:bg-[#1B2A3A] text-[#1B2A3A] hover:text-white border border-[#C89438]/35 font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Info className="w-4 h-4" />
                  <span>{t('products.specButton')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Wholesale Callout Banner */}
        <div className="mt-16 glass-panel p-8 sm:p-12 rounded-3xl border border-[#C89438]/35 flex flex-col md:flex-row items-center justify-between gap-8 bg-white shadow-xl">
          <div className="space-y-2 text-center md:text-left rtl:md:text-right">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B2A3A]">
              {t('products.ctaTitle')}
            </h3>
            <p className="text-sm text-[#5C6B73] max-w-2xl font-medium">
              {t('products.ctaDesc')}
            </p>
          </div>
          <button
            onClick={onOpenContact}
            className="px-8 py-4 rounded-xl bg-[#1B2A3A] text-white font-bold text-sm shadow-xl hover:bg-[#C89438] transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <span>{t('products.ctaButton')}</span>
            <ArrowRight className="w-4 h-4 text-[#E2B45F] rtl:rotate-180" />
          </button>
        </div>
      </div>
    </section>
  );
}
