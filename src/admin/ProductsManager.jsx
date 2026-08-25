import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Pencil, Trash2, X, Save, UploadCloud, Loader2, Languages } from 'lucide-react';

const LANGS = [
  { code: 'tr', label: 'Türkçe', suffix: '' },
  { code: 'en', label: 'English', suffix: '_en' },
  { code: 'ru', label: 'Русский', suffix: '_ru' },
  { code: 'ar', label: 'العربية', suffix: '_ar' },
];

const emptyForm = {
  id: null,
  slug: '',
  category: 'sade',
  image_url: '',
  badge: '',
  sizes: '',       // comma-separated in the form, array in DB
  pack_count: '',
  box_count: '',
  sort_order: 0,
  // Per-language fields (base = Turkish, no suffix)
  title: '', subtitle: '', description: '', features: '',
  title_en: '', subtitle_en: '', description_en: '', features_en: '',
  title_ru: '', subtitle_ru: '', description_ru: '', features_ru: '',
  title_ar: '', subtitle_ar: '', description_ar: '', features_ar: '',
};

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = list view, object = form open
  const [activeLang, setActiveLang] = useState('tr');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase.from('products').select('*').order('sort_order');
    if (err) setError(err.message);
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing({ ...emptyForm });
    setActiveLang('tr');
  };
  const openEdit = (p) => {
    const next = { ...emptyForm, ...p };
    LANGS.forEach(({ suffix }) => {
      next[`features${suffix}`] = (p[`features${suffix}`] || []).join('\n');
    });
    next.sizes = (p.sizes || []).join(', ');
    setEditing(next);
    setActiveLang('tr');
  };
  const closeForm = () => setEditing(null);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    const path = `products/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      slug: editing.slug.trim(),
      category: editing.category,
      image_url: editing.image_url,
      badge: editing.badge,
      sizes: editing.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      pack_count: editing.pack_count,
      box_count: editing.box_count,
      sort_order: Number(editing.sort_order) || 0,
      updated_at: new Date().toISOString(),
    };
    LANGS.forEach(({ suffix }) => {
      payload[`title${suffix}`] = editing[`title${suffix}`] || null;
      payload[`subtitle${suffix}`] = editing[`subtitle${suffix}`] || null;
      payload[`description${suffix}`] = editing[`description${suffix}`] || null;
      payload[`features${suffix}`] = (editing[`features${suffix}`] || '').split('\n').map((s) => s.trim()).filter(Boolean);
    });
    // Turkish fields are required (base content) — never null.
    payload.title = editing.title;
    payload.subtitle = editing.subtitle;
    payload.description = editing.description;

    const query = editing.id
      ? supabase.from('products').update(payload).eq('id', editing.id)
      : supabase.from('products').insert(payload);

    const { error: saveErr } = await query;
    setSaving(false);
    if (saveErr) {
      setError('Kaydedilemedi: ' + saveErr.message);
      return;
    }
    setEditing(null);
    load();
  };

  const handleDelete = async (p) => {
    if (!confirm(`"${p.title}" ürününü silmek istediğinize emin misiniz?`)) return;
    const { error: delErr } = await supabase.from('products').delete().eq('id', p.id);
    if (delErr) setError('Silinemedi: ' + delErr.message);
    else load();
  };

  if (editing) {
    const suffix = LANGS.find((l) => l.code === activeLang).suffix;
    const isTr = activeLang === 'tr';
    return (
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold">
            {editing.id ? 'Ürünü Düzenle' : 'Yeni Ürün'}
          </h2>
          <button onClick={closeForm} className="p-2 rounded-lg bg-white border border-[#C89438]/30 hover:border-[#C89438] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

        <form onSubmit={handleSave} className="space-y-4 bg-white p-6 rounded-2xl border border-[#C89438]/25 shadow-sm">
          {/* Language-independent fields */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug (benzersiz, url-uyumlu) *">
              <input required value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="input" placeholder="sade-tortilla-lavas" />
            </Field>
            <Field label="Kategori">
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="input">
                <option value="sade">Sade</option>
                <option value="tambugday">Tam Buğday</option>
                <option value="aromali">Çeşnili</option>
                <option value="pizza">Pizza</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Rozet (badge)">
              <input value={editing.badge} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} className="input" placeholder="En Çok Satan" />
            </Field>
            <Field label="Sıralama">
              <input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })} className="input" />
            </Field>
          </div>

          <Field label="Ürün Görseli">
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

          <Field label="Boyutlar (virgülle ayırın)">
            <input value={editing.sizes} onChange={(e) => setEditing({ ...editing, sizes: e.target.value })} className="input" placeholder="15 cm, 20 cm, 25 cm" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Paket İçi Adet Aralığı">
              <input value={editing.pack_count} onChange={(e) => setEditing({ ...editing, pack_count: e.target.value })} className="input" placeholder="10 - 18 Adet / Paket" />
            </Field>
            <Field label="Koli İçi Paket Aralığı">
              <input value={editing.box_count} onChange={(e) => setEditing({ ...editing, box_count: e.target.value })} className="input" placeholder="12 - 18 Paket / Koli" />
            </Field>
          </div>

          {/* Language tabs — everything below is translatable */}
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
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </Field>

              <Field label="Alt Başlık">
                <input
                  value={editing[`subtitle${suffix}`]}
                  onChange={(e) => setEditing({ ...editing, [`subtitle${suffix}`]: e.target.value })}
                  className="input"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </Field>

              <Field label="Açıklama">
                <textarea
                  rows={3}
                  value={editing[`description${suffix}`]}
                  onChange={(e) => setEditing({ ...editing, [`description${suffix}`]: e.target.value })}
                  className="input"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </Field>

              <Field label="Özellikler (her satıra bir tane)">
                <textarea
                  rows={3}
                  value={editing[`features${suffix}`]}
                  onChange={(e) => setEditing({ ...editing, [`features${suffix}`]: e.target.value })}
                  className="input"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </Field>
            </div>
          </div>

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
        <h2 className="font-serif text-2xl font-bold">Ürünler</h2>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B2A3A] text-white font-bold text-sm hover:bg-[#C89438] transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
          Yeni Ürün
        </button>
      </div>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

      {loading ? (
        <div className="text-sm text-[#5C6B73]">Yükleniyor…</div>
      ) : products.length === 0 ? (
        <div className="text-sm text-[#5C6B73] bg-white p-6 rounded-2xl border border-[#C89438]/25">Henüz ürün yok.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-[#C89438]/25 p-4 shadow-sm">
              <div className="h-32 bg-[#FAF3E3] rounded-xl flex items-center justify-center mb-3 overflow-hidden">
                {p.image_url ? <img src={p.image_url} alt={p.title} className="max-h-full max-w-full object-contain" /> : <span className="text-xs text-[#5C6B73]">Görsel yok</span>}
              </div>
              <div className="text-[10px] font-bold text-[#C89438] uppercase tracking-wider">{p.category}</div>
              <div className="font-serif font-bold text-sm mb-1 truncate">{p.title}</div>
              <div className="flex items-center gap-1 mb-3">
                {LANGS.filter((l) => l.code !== 'tr').map((l) => (
                  <span
                    key={l.code}
                    title={p[`title${l.suffix}`] ? `${l.label}: çevrildi` : `${l.label}: çeviri yok`}
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      p[`title${l.suffix}`] ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {l.code.toUpperCase()}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF3E3] border border-[#C89438]/30 text-xs font-bold hover:border-[#C89438] cursor-pointer">
                  <Pencil className="w-3.5 h-3.5" /> Düzenle
                </button>
                <button onClick={() => handleDelete(p)} className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-bold hover:bg-red-100 cursor-pointer">
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
