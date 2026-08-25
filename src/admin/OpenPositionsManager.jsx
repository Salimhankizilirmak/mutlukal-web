import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Trash2, Eye, EyeOff, Briefcase } from 'lucide-react';

// Common roles at Mutlukal — quick-add shortcuts. HR can still type any
// custom title in the free-text field below.
const QUICK_TITLES = ['Üretim Personeli', 'Hamurhane Personeli', 'Paketleme Personeli', 'Kolileme Personeli'];

export default function OpenPositionsManager() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customTitle, setCustomTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase.from('open_positions').select('*').order('sort_order');
    if (err) setError(err.message);
    else setPositions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const addPosition = async (title) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setAdding(true);
    setError('');
    const { error: err } = await supabase.from('open_positions').insert({
      title: trimmed,
      sort_order: positions.length,
    });
    setAdding(false);
    if (err) {
      setError('Eklenemedi: ' + err.message);
      return;
    }
    setCustomTitle('');
    load();
  };

  const toggleActive = async (pos) => {
    const { error: err } = await supabase.from('open_positions').update({ is_active: !pos.is_active }).eq('id', pos.id);
    if (err) setError('Güncellenemedi: ' + err.message);
    else load();
  };

  const removePosition = async (pos) => {
    if (!confirm(`"${pos.title}" pozisyonunu kaldırmak istediğinize emin misiniz?`)) return;
    const { error: err } = await supabase.from('open_positions').delete().eq('id', pos.id);
    if (err) setError('Silinemedi: ' + err.message);
    else load();
  };

  const activeExistingTitles = new Set(positions.map((p) => p.title.toLowerCase()));

  return (
    <div className="bg-white rounded-2xl border border-[#C89438]/25 shadow-sm p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="w-4 h-4 text-[#C89438]" />
        <h3 className="font-serif text-lg font-bold">Açık Pozisyonlar</h3>
      </div>
      <p className="text-xs text-[#5C6B73] mb-4">
        Burada eklediğiniz ve <strong>aktif</strong> bıraktığınız pozisyonlar "Bize Katılın" sayfasında görünür ve
        başvuru formunda seçilebilir hale gelir.
      </p>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

      {/* Quick-add buttons for common roles */}
      <div className="flex flex-wrap gap-2 mb-3">
        {QUICK_TITLES.map((t) => (
          <button
            key={t}
            type="button"
            disabled={adding || activeExistingTitles.has(t.toLowerCase())}
            onClick={() => addPosition(t)}
            className="px-3 py-1.5 rounded-lg bg-[#FAF3E3] border border-[#C89438]/30 text-xs font-bold text-[#1B2A3A] hover:border-[#C89438] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            + {t}
          </button>
        ))}
      </div>

      {/* Custom title input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addPosition(customTitle);
        }}
        className="flex gap-2 mb-6"
      >
        <input
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          placeholder="Kendi pozisyon adınızı yazın..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF3E3] border border-[#C89438]/30 text-sm text-[#1B2A3A]"
        />
        <button
          type="submit"
          disabled={adding || !customTitle.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1B2A3A] text-white font-bold text-sm hover:bg-[#C89438] transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Ekle
        </button>
      </form>

      {/* List */}
      {loading ? (
        <div className="text-sm text-[#5C6B73]">Yükleniyor…</div>
      ) : positions.length === 0 ? (
        <div className="text-sm text-[#5C6B73]">Henüz pozisyon eklenmedi.</div>
      ) : (
        <div className="space-y-2">
          {positions.map((pos) => (
            <div
              key={pos.id}
              className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border ${
                pos.is_active ? 'bg-[#FAF3E3] border-[#C89438]/25' : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <span className="text-sm font-semibold text-[#1B2A3A]">{pos.title}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => toggleActive(pos)}
                  title={pos.is_active ? 'Pasife al (siteden kaldır)' : 'Aktif et (sitede göster)'}
                  className="p-2 rounded-lg bg-white border border-[#C89438]/25 hover:border-[#C89438] cursor-pointer"
                >
                  {pos.is_active ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-[#5C6B73]" />}
                </button>
                <button
                  onClick={() => removePosition(pos)}
                  className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
