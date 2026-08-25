import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Pencil, Trash2, X, Save, UploadCloud, Loader2, Clapperboard } from 'lucide-react';

const emptyForm = {
  id: null,
  title: '',
  description: '',
  video_url: '',
  sort_order: 0,
};

// Supabase Free Plan'da sabit 50 MB yükleme sınırı var (Storage > Settings >
// Global file size limit) — Pro'ya geçmeden değiştirilemiyor.
const MAX_VIDEO_MB = 50;

export default function AdsManager() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase.from('ads').select('*').order('sort_order');
    if (err) setError(err.message);
    else setAds(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => setEditing({ ...emptyForm });
  const openEdit = (ad) => setEditing({ ...ad });
  const closeForm = () => setEditing(null);

  const handleUpload = async (file) => {
    if (!file) return;
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setError(`Video ${MAX_VIDEO_MB} MB'tan büyük olamaz. Dosyayı sıkıştırıp tekrar deneyin.`);
      return;
    }
    setUploading(true);
    setError('');
    const path = `ads/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error: upErr } = await supabase.storage.from('ad-videos').upload(path, file);
    if (upErr) {
      setError('Video yüklenemedi: ' + upErr.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('ad-videos').getPublicUrl(path);
    setEditing((prev) => ({ ...prev, video_url: data.publicUrl }));
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editing.video_url) {
      setError('Önce bir video yüklemelisiniz.');
      return;
    }
    setSaving(true);
    setError('');

    const payload = {
      title: editing.title,
      description: editing.description,
      video_url: editing.video_url,
      sort_order: Number(editing.sort_order) || 0,
      updated_at: new Date().toISOString(),
    };

    const query = editing.id
      ? supabase.from('ads').update(payload).eq('id', editing.id)
      : supabase.from('ads').insert(payload);

    const { error: saveErr } = await query;
    setSaving(false);
    if (saveErr) {
      setError('Kaydedilemedi: ' + saveErr.message);
      return;
    }
    setEditing(null);
    load();
  };

  const handleDelete = async (ad) => {
    if (!confirm(`"${ad.title}" reklamını silmek istediğinize emin misiniz?`)) return;
    const { error: delErr } = await supabase.from('ads').delete().eq('id', ad.id);
    if (delErr) setError('Silinemedi: ' + delErr.message);
    else load();
  };

  if (editing) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold">{editing.id ? 'Reklamı Düzenle' : 'Yeni Reklam'}</h2>
          <button onClick={closeForm} className="p-2 rounded-lg bg-white border border-[#C89438]/30 hover:border-[#C89438] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

        <form onSubmit={handleSave} className="space-y-4 bg-white p-6 rounded-2xl border border-[#C89438]/25 shadow-sm">
          <Field label="Başlık *">
            <input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input" placeholder="Örn: 2026 Tanıtım Filmi" />
          </Field>

          <Field label="Açıklama">
            <textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input" />
          </Field>

          <Field label={`Video (en fazla ${MAX_VIDEO_MB} MB) *`}>
            <div className="space-y-3">
              {editing.video_url && (
                <video src={editing.video_url} controls preload="metadata" className="w-full max-h-56 rounded-xl bg-black" />
              )}
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF3E3] border border-[#C89438]/30 text-sm font-semibold cursor-pointer hover:border-[#C89438]">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                {uploading ? 'Yükleniyor…' : editing.video_url ? 'Videoyu Değiştir' : 'Video Yükle'}
                <input type="file" accept="video/*" className="hidden" onChange={(e) => handleUpload(e.target.files[0])} />
              </label>
            </div>
          </Field>

          <Field label="Sıralama (küçük sayı önce gösterilir)">
            <input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })} className="input w-32" />
          </Field>

          <button type="submit" disabled={saving || uploading} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1B2A3A] text-white font-bold text-sm hover:bg-[#C89438] transition-colors disabled:opacity-60 cursor-pointer">
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
        <h2 className="font-serif text-2xl font-bold">Reklamlar</h2>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B2A3A] text-white font-bold text-sm hover:bg-[#C89438] transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
          Yeni Reklam
        </button>
      </div>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

      {loading ? (
        <div className="text-sm text-[#5C6B73]">Yükleniyor…</div>
      ) : ads.length === 0 ? (
        <div className="text-sm text-[#5C6B73] bg-white p-6 rounded-2xl border border-[#C89438]/25">Henüz reklam videosu yok.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-white rounded-2xl border border-[#C89438]/25 p-4 shadow-sm">
              <div className="h-32 bg-black rounded-xl flex items-center justify-center mb-3 overflow-hidden">
                {ad.video_url ? (
                  <video src={ad.video_url} preload="metadata" className="w-full h-full object-cover" />
                ) : (
                  <Clapperboard className="w-8 h-8 text-white/40" />
                )}
              </div>
              <div className="font-serif font-bold text-sm mb-1 truncate">{ad.title}</div>
              <div className="text-[11px] text-[#5C6B73] mb-3 truncate">{ad.description || '—'}</div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(ad)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF3E3] border border-[#C89438]/30 text-xs font-bold hover:border-[#C89438] cursor-pointer">
                  <Pencil className="w-3.5 h-3.5" /> Düzenle
                </button>
                <button onClick={() => handleDelete(ad)} className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-bold hover:bg-red-100 cursor-pointer">
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
