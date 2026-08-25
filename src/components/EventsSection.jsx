import React, { useEffect, useState } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    supabase
      .from('events')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (cancelled) return;
        setEvents(data || []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Nothing to show and nothing coming — don't render an empty section.
  if (!loading && events.length === 0) return null;

  return (
    <section id="etkinlikler" className="py-24 bg-[#F4EAD5]/60 text-[#1B2A3A] relative border-t border-[#C89438]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#C89438]/35 text-[#C89438] text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <CalendarDays className="w-3.5 h-3.5 text-[#C89438]" />
            <span>ETKİNLİKLER</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1B2A3A] tracking-tight mb-4">
            Etkinliklerimiz
          </h2>
          <p className="text-base text-[#5C6B73] font-normal">
            Fuarlar, lansmanlar ve kurumsal etkinliklerimiz için bizi takip edin.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-sm text-[#5C6B73]">Yükleniyor…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="glass-card rounded-2xl overflow-hidden border border-[#C89438]/20 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Poster-style image with title overlaid on a dark gradient scrim */}
                <div className="relative h-64 bg-[#1B2A3A] flex items-end overflow-hidden">
                  {ev.image_url ? (
                    <img src={ev.image_url} alt={ev.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <CalendarDays className="w-10 h-10 text-[#C89438]/40 absolute top-5 left-5" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A3A] via-[#1B2A3A]/40 to-transparent" />
                  <div className="relative p-5">
                    {ev.event_date && (
                      <span className="inline-block px-2.5 py-1 rounded-full bg-[#C89438] text-[#1B2A3A] text-[10px] font-bold uppercase tracking-wider mb-2">
                        {new Date(ev.event_date).toLocaleDateString('tr-TR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                    <h3 className="font-serif font-bold text-2xl text-white leading-tight drop-shadow-md">
                      {ev.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5">
                  {ev.description && (
                    <p className="text-sm text-[#1B2A3A]/90 leading-relaxed mb-3 whitespace-pre-line">
                      {ev.description}
                    </p>
                  )}
                  {ev.location && (
                    <div className="flex items-center gap-1.5 text-xs text-[#5C6B73] font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#C89438]" />
                      {ev.location}
                    </div>
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
