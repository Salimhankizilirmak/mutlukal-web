import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Pencil, Trash2, X, Save, UploadCloud, Loader2, PlusCircle, MinusCircle, Languages } from 'lucide-react';

const LANGS = [
  { code: 'tr', label: 'Türkçe', suffix: '' },
  { code: 'en', label: 'English', suffix: '_en' },
  { code: 'ru', label: 'Русский', suffix: '_ru' },
  { code: 'ar', label: 'العربية', suffix: '_ar' },
];

const emptyForm = {
  id: null,
  image_url: '',
  boyut: '',
  pack_options: [{ adet: '', gramaj: '' }],
  sort_order: 0,
  title: '', category: '',
  title_en: '', category_en: '',
  title_ru: '', category_ru: '',
  title_ar: '', category_ar: '',
};

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [activeLang, setActiveLang] = useState('tr');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase.from('gallery_images').select('*').order('sort_order');
    if (err) setError(err.message);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing({ ...emptyForm, pack_options: [{ adet: '', gramaj: '' }] });
    setActiveLang('tr');
  };
  const openEdit = (g) => {
    setEditing({
      ...emptyForm,
      ...g,
      pack_options: g.pack_options && g.pack_options.length ? g.pack_options : [{ adet: '', gramaj: '' }],
    });
    setActiveLang('tr');
  };
  const closeForm = () => setEditing(null);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    const path = `gallery/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error: upErr } = await supabase.storage.from('product-images').upload(path, file);
    if (upErr) {
      setError('Görsel yüklenemedi: ' + upErr.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    setEditing((prev) => ({ ...prev, image_url: data.publicUrl }));
    setUploading(false);
  };

  const updateOption = (idx, key, value) => {
    const next = [...editing.pack_options];
    next[idx] = { ...next[idx], [key]: value };
    setEditing({ ...editing, pack_options: next });
  };
  const addOption = () => setEditing({ ...editing, pack_options: [...editing.pack_options, { adet: '', gramaj: '' }] });
  const removeOption = (idx) => setEditing({ ...editing, pack_options: editing.pack_options.filter((_, i) => i !== idx) });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      image_url: editing.image_url,
      boyut: editing.boyut,
      pack_options: editing.pack_options.filter((o) => o.adet && o.gramaj),
      sort_order: Number(editing.sort_order) || 0,
      updated_at: new Date().toISOString(),
    };
    LANGS.forEach(({ suffix }) => {
      payload[`title${suffix}`] = editing[`title${suffix}`] || null;
      payload[`category${suffix}`] = editing[`category${suffix}`] || null;
    });
    payload.title = editing.title;
    payload.category = editing.category;

    const query = editing.id
      ? supabase.from('gallery_images').update(payload).eq('id', editing.id)
      : supabase.from('gallery_images').insert(payload);

    const { error: saveErr } = await query;
    setSaving(false);
    if (saveErr) {
      setError('Kaydedilemedi: ' + saveErr.message);
      return;
    }
    setEditing(null);
    load();
  };

  const handleDelete = async (g) => {
    if (!confirm(`"${g.title}" kartını silmek istediğinize emin misiniz?`)) return;
    const { error: delErr } = await supabase.from('gallery_images').delete().eq('id', g.id);
    if (delErr) setError('Silinemedi: ' + delErr.message);
    else load();
  };

  if (editing) {
    const suffix = LANGS.find((l) => l.code === activeLang).suffix;
    const isTr = activeLang === 'tr';
    return (
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold">{editing.id ? 'Galeri Kartını Düzenle' : 'Yeni Galeri Kartı'}</h2>
          <button onClick={closeForm} className="p-2 rounded-lg bg-white border border-[#C89438]/30 hover:border-[#C89438] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

        <form onSubmit={handleSave} className="space-y-4 bg-white p-6 rounded-2xl border border-[#C89438]/25 shadow-sm">
          <Field label="Boyut / Çap">
            <input value={editing.boyut} onChange={(e) => setEditing({ ...editing, boyut: e.target.value })} className="input" placeholder="25 cm" />
          </Field>

          <Field label="Görsel">
            <div className="flex items-center gap-3">
              {editing.image_url && (
                <img src={editing.image_url} alt="" className="w-16 h-16 object-contain bg-[#FAF3E3] rounded-lg border border-[#C89438]/25" />
              )}
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF3E3] border border-[#C89438]/30 text-sm font-semibold cursor-pointer hover:border-[#C89438]">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                {uploading ? 'Yükleniyor…' : 'Görsel Yükle'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files[0])} />
              </label>
            </div>
          </Field>

          <div>
            <label className="block text-xs font-bold text-[#C89438] mb-2">Paket İçi Seçenekleri (gerçek, farklı paket boyutlarını ekleyin)</label>
            <div className="space-y-2">
              {editing.pack_options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={opt.adet} onChange={(e) => updateOption(i, 'adet', e.target.value)} className="input" placeholder="10 Adet" />
                  <input value={opt.gramaj} onChange={(e) => updateOption(i, 'gramaj', e.target.value)} className="input" placeholder="650 g" />
                  <button type="button" onClick={() => removeOption(i)} className="p-2 text-red-500 hover:text-red-700 cursor-pointer">
                    <MinusCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addOption} className="flex items-center gap-1.5 mt-2 text-xs font-bold text-[#C89438] hover:text-[#1B2A3A] cursor-pointer">
              <PlusCircle className="w-4 h-4" /> Paket Seçeneği Ekle
            </button>
            <p className="text-[11px] text-[#5C6B73] mt-1.5">Adet/gramaj sayıları tüm dillerde ortaktır, ayrıca çevirmenize gerek yok.</p>
          </div>

          {/* Language tabs — title & category are translatable */}
          <div className="pt-2 border-t border-[#C89438]/20">
            <div className="flex items-center gap-2 mb-1 mt-3">
              <Languages className="w-4 h-4 text-[#C89438]" />
              <span className="text-xs font-bold text-[#C89438] uppercase tracking-wider">Dil Bazlı İçerik</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setActiveLang(l.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    activeLang === l.code ? 'bg-[#1B2A3A] text-white' : 'bg-[#FAF3E3] text-[#1B2A3A] border border-[#C89438]/30 hover:border-[#C89438]'
                  }`}
                >
                  {l.label}
                  {l.code !== 'tr' && !editing[`title${l.suffix}`] && (
                    <span className="ml-1.5 text-[9px] opacity-60">boş</span>
                  )}
                </button>
              ))}
            </div>

            {!isTr && (
              <p className="text-[11px] text-[#5C6B73] mb-3 -mt-2">
                Boş bırakırsanız sitede bu dil seçiliyken otomatik olarak Türkçe içerik gösterilir.
              </p>
            )}

            <div className="space-y-4">
              <Field label={isTr ? 'Başlık *' : 'Başlık'}>
                <input
                  required={isTr}
                  value={editing[`title${suffix}`]}
                  onChange={(e) => setEditing({ ...editing, [`title${suffix}`]: e.target.value })}
                  className="input"
                  placeholder="Sade Unlu Tortilla (25cm)"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </Field>

              <Field label="Kategori Etiketi">
                <input
                  value={editing[`category${suffix}`]}
                  onChange={(e) => setEditing({ ...editing, [`category${suffix}`]: e.target.value })}
                  className="input"
                  placeholder="Unlu Mamul Çeşidi"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </Field>
            </div>
          </div>

          <Field label="Sıralama (küçük sayı önce gösterilir)">
            <input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })} className="input w-32" />
          </Field>

          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1B2A3A] text-white font-bold text-sm hover:bg-[#C89438] transition-colors disabled:opacity-60 cursor-pointer">
            <Save className="w-4 h-4" />
            {saving ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
        </form>

        <style>{`.input { width: 100%; padding: 0.6rem 1rem; border-radius: 0.75rem; background: #FAF3E3; border: 1px solid rgba(200,148,56,0.3); color: #1B2A3A; }`}</style>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold">Ambalaj Galerisi</h2>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B2A3A] text-white font-bold text-sm hover:bg-[#C89438] transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
          Yeni Kart
        </button>
      </div>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

      {loading ? (
        <div className="text-sm text-[#5C6B73]">Yükleniyor…</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-[#5C6B73] bg-white p-6 rounded-2xl border border-[#C89438]/25">Henüz galeri kartı yok.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((g) => (
            <div key={g.id} className="bg-white rounded-2xl border border-[#C89438]/25 p-4 shadow-sm">
              <div className="h-28 bg-[#FAF3E3] rounded-xl flex items-center justify-center mb-3 overflow-hidden">
                {g.image_url ? <img src={g.image_url} alt={g.title} className="max-h-full max-w-full object-contain" /> : <span className="text-xs text-[#5C6B73]">Görsel yok</span>}
              </div>
              <div className="text-[10px] font-bold text-[#C89438] uppercase tracking-wider">{g.category}</div>
              <div className="font-serif font-bold text-sm mb-1 truncate">{g.title}</div>
              <div className="flex items-center gap-1 mb-2">
                {LANGS.filter((l) => l.code !== 'tr').map((l) => (
                  <span
                    key={l.code}
                    title={g[`title${l.suffix}`] ? `${l.label}: çevrildi` : `${l.label}: çeviri yok`}
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      g[`title${l.suffix}`] ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {l.code.toUpperCase()}
                  </span>
                ))}
              </div>
              <div className="text-[11px] text-[#5C6B73] mb-3">
                {(g.pack_options || []).map((o) => `${o.adet} (${o.gramaj})`).join(' · ') || '—'}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(g)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF3E3] border border-[#C89438]/30 text-xs font-bold hover:border-[#C89438] cursor-pointer">
                  <Pencil className="w-3.5 h-3.5" /> Düzenle
                </button>
                <button onClick={() => handleDelete(g)} className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-bold hover:bg-red-100 cursor-pointer">
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

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#C89438] mb-1">{label}</label>
      {children}
    </div>
  );
}
