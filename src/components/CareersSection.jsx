import React, { useEffect, useState } from 'react';
import { Users, Send, CheckCircle2, HeartHandshake, TrendingUp, GraduationCap, Briefcase } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const perks = [
  {
    icon: HeartHandshake,
    title: 'Aile Kültürü',
    desc: 'Yılların getirdiği tecrübeyi paylaşan, birbirine değer veren bir ekip.',
  },
  {
    icon: TrendingUp,
    title: 'Gelişim Fırsatları',
    desc: 'Endüstriyel gıda üretiminde kariyerinizi büyütebileceğiniz açık pozisyonlar.',
  },
  {
    icon: GraduationCap,
    title: 'Eğitim & Sertifikasyon',
    desc: 'ISO, HACCP ve gıda güvenliği alanlarında sürekli eğitim desteği.',
  },
];

const CUSTOM_OPTION = '__custom__';

export default function CareersSection() {
  const [positions, setPositions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [customPosition, setCustomPosition] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    position: '',
    message: '',
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    supabase
      .from('open_positions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        if (cancelled) return;
        setPositions(data || []);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const resolvedPosition = formData.position === CUSTOM_OPTION ? customPosition.trim() : formData.position;

    if (!isSupabaseConfigured) {
      setError('Başvuru sistemi şu anda bakımda — lütfen bize doğrudan (0364) 254 90 54 numaralı hattan ulaşın.');
      return;
    }

    setSubmitting(true);
    const { error: insertErr } = await supabase
      .from('job_applications')
      .insert({ ...formData, position: resolvedPosition });
    setSubmitting(false);

    if (insertErr) {
      setError('Başvurunuz gönderilemedi, lütfen tekrar deneyin.');
      return;
    }

    setSubmitted(true);
    setFormData({ full_name: '', email: '', phone: '', position: '', message: '' });
    setCustomPosition('');
  };

  return (
    <section id="kariyer" className="py-24 bg-[#F4EAD5]/60 text-[#1B2A3A] relative border-t border-[#C89438]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#C89438]/35 text-[#C89438] text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <Users className="w-3.5 h-3.5 text-[#C89438]" />
            <span>İNSAN KAYNAKLARI</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1B2A3A] tracking-tight mb-4">
            Bize Katılın
          </h2>
          <p className="text-base text-[#5C6B73] font-normal">
            Ekibimizin bir parçası olmak ister misiniz?
            Açık pozisyonlarımız için aşağıdaki formu doldurun, ekibimiz sizinle iletişime geçsin.
          </p>
        </div>

        {/* Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {perks.map((p, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl border border-[#C89438]/20 bg-white shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#FAF3E3] border border-[#C89438]/35 flex items-center justify-center text-[#C89438] mb-4">
                <p.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg mb-1.5">{p.title}</h3>
              <p className="text-xs text-[#5C6B73] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Open Positions Showcase */}
        {positions.length > 0 && (
          <div className="max-w-2xl mx-auto mb-10 text-center">
            <span className="text-xs font-bold text-[#C89438] uppercase tracking-widest block mb-3">
              Şu An Açık Pozisyonlarımız
            </span>
            <div className="flex flex-wrap justify-center gap-2.5">
              {positions.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#C89438]/35 text-sm font-bold text-[#1B2A3A] shadow-sm"
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#C89438]" />
                  {p.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Application Form */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#C89438]/25 shadow-lg p-6 sm:p-8">
          {submitted ? (
            <div className="py-10 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#1B2A3A]">Başvurunuz Alındı!</h3>
              <p className="text-sm text-[#5C6B73] font-medium max-w-md">
                İnsan Kaynakları ekibimiz özgeçmişinizi inceleyip uygun pozisyonlar için sizinle iletişime geçecektir.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm font-bold text-[#C89438] hover:text-[#1B2A3A] cursor-pointer"
              >
                Yeni başvuru gönder
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#C89438] mb-1 font-bold">Ad Soyad *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ahmet Yılmaz"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF3E3] border border-[#C89438]/35 text-[#1B2A3A] placeholder-[#1B2A3A]/40 focus:outline-none focus:border-[#C89438]"
                  />
                </div>
                <div>
                  <label className="block text-[#C89438] mb-1 font-bold">Başvurulan Pozisyon</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF3E3] border border-[#C89438]/35 text-[#1B2A3A] focus:outline-none focus:border-[#C89438]"
                  >
                    <option value="">Pozisyon seçin...</option>
                    {positions.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                    <option value={CUSTOM_OPTION}>Diğer (elle yazacağım)</option>
                  </select>
                  {formData.position === CUSTOM_OPTION && (
                    <input
                      type="text"
                      required
                      placeholder="İlgilendiğiniz pozisyonu yazın"
                      value={customPosition}
                      onChange={(e) => setCustomPosition(e.target.value)}
                      className="w-full mt-2 px-4 py-2.5 rounded-xl bg-[#FAF3E3] border border-[#C89438]/35 text-[#1B2A3A] placeholder-[#1B2A3A]/40 focus:outline-none focus:border-[#C89438]"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#C89438] mb-1 font-bold">E-posta *</label>
                  <input
                    type="email"
                    required
                    placeholder="ornek@eposta.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF3E3] border border-[#C89438]/35 text-[#1B2A3A] placeholder-[#1B2A3A]/40 focus:outline-none focus:border-[#C89438]"
                  />
                </div>
                <div>
                  <label className="block text-[#C89438] mb-1 font-bold">Telefon *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+90 (555) 000 00 00"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF3E3] border border-[#C89438]/35 text-[#1B2A3A] placeholder-[#1B2A3A]/40 focus:outline-none focus:border-[#C89438]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#C89438] mb-1 font-bold">Kendinizden Bahsedin</label>
                <textarea
                  rows={3}
                  placeholder="Tecrübeniz, ilgilendiğiniz alan veya özgeçmiş linkiniz..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF3E3] border border-[#C89438]/35 text-[#1B2A3A] placeholder-[#1B2A3A]/40 focus:outline-none focus:border-[#C89438]"
                />
              </div>

              {error && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-[#1B2A3A] text-white font-bold text-sm shadow-xl hover:bg-[#C89438] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Send className="w-4 h-4 text-[#E2B45F]" />
                <span>{submitting ? 'Gönderiliyor…' : 'Başvurumu Gönder'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
