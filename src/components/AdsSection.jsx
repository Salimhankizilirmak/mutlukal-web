import React, { useEffect, useState } from 'react';
import { Clapperboard } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// Reklam videoları — Bize Katılın ve Etkinlikler gibi bu bölüm de dil
// desteğinin dışında tutulur; hangi dil seçilirse seçilsin her zaman
// Türkçe görünür (bkz. supabase/schema-v5-ads.sql).
export default function AdsSection() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    supabase
      .from('ads')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (cancelled) return;
        setAds(data || []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Gösterilecek video yoksa (ve yüklenmesi bittiyse) boş bir bölüm
  // göstermek yerine hiç render etmiyoruz.
  if (!loading && ads.length === 0) return null;

  return (
    <section id="reklamlar" className="py-24 bg-[#FAF3E3] text-[#1B2A3A] relative border-t border-[#C89438]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#C89438]/35 text-[#C89438] text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <Clapperboard className="w-3.5 h-3.5 text-[#C89438]" />
            <span>REKLAMLARIMIZ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1B2A3A] tracking-tight mb-4">
            Reklam Filmlerimiz
          </h2>
          <p className="text-base text-[#5C6B73] font-normal">
            Tanıtım ve reklam çalışmalarımızdan seçmeler.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-sm text-[#5C6B73]">Yükleniyor…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className="glass-card rounded-2xl overflow-hidden border border-[#C89438]/20 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="bg-black">
                  <video
                    src={ad.video_url}
                    controls
                    preload="metadata"
                    className="w-full h-56 object-contain"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif font-bold text-lg text-[#1B2A3A] mb-1.5">
                    {ad.title}
                  </h3>
                  {ad.description && (
                    <p className="text-sm text-[#5C6B73] leading-relaxed whitespace-pre-line">
                      {ad.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
