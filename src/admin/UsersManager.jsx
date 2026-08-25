import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { UserPlus, CheckCircle2, AlertCircle, Package, Image as ImageIcon, CalendarDays, Briefcase, MessageSquare, Users, Clapperboard } from 'lucide-react';

const PERMISSION_FIELDS = [
  { key: 'can_products', label: 'Ürünler', icon: Package },
  { key: 'can_gallery', label: 'Ambalaj Galerisi', icon: ImageIcon },
  { key: 'can_events', label: 'Etkinlikler', icon: CalendarDays },
  { key: 'can_ads', label: 'Reklamlar', icon: Clapperboard },
  { key: 'can_applications', label: 'İş Başvuruları', icon: Briefcase },
  { key: 'can_leads', label: 'Teklif Talepleri', icon: MessageSquare },
  { key: 'can_users', label: 'Kullanıcılar', icon: Users },
];

const EMPTY_PERMS = PERMISSION_FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: false }), {});

// Hızlı başlangıç şablonları — istediğiniz gibi kutucukları elle de
// değiştirebilirsiniz, bunlar sadece pratik bir başlangıç noktası.
const PRESETS = [
  { label: 'İK', perms: { ...EMPTY_PERMS, can_applications: true, can_events: true } },
  { label: 'Pazarlama', perms: { ...EMPTY_PERMS, can_leads: true, can_gallery: true, can_ads: true } },
  { label: 'Genel Müdür', perms: { ...EMPTY_PERMS, can_products: true, can_gallery: true, can_events: true, can_ads: true, can_applications: true, can_leads: true } },
  { label: 'Temizle', perms: { ...EMPTY_PERMS } },
];

export default function UsersManager() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [perms, setPerms] = useState(EMPTY_PERMS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const togglePerm = (key) => setPerms((p) => ({ ...p, [key]: !p[key] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı.');
      return;
    }
    if (!Object.values(perms).some(Boolean)) {
      setError('En az bir sayfaya erişim vermelisiniz, aksi halde kullanıcı hiçbir şey göremez.');
      return;
    }

    setLoading(true);
    const { data, error: fnError } = await supabase.functions.invoke('admin-create-user', {
      body: { username, password, permissions: perms },
    });
    setLoading(false);

    if (fnError || data?.error) {
      setError(data?.error || fnError.message || 'Kullanıcı oluşturulamadı.');
      return;
    }

    setSuccess(data.user);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setPerms(EMPTY_PERMS);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="font-serif text-2xl font-bold mb-2">Yeni Kullanıcı Ekle</h2>
      <p className="text-sm text-[#5C6B73] mb-6">
        Oluşturduğunuz kullanıcı, sadece belirlediğiniz kullanıcı adı ve şifre ile{' '}
        <code className="px-1.5 py-0.5 rounded bg-[#FAF3E3] text-[#C89438] font-mono text-xs">/admin</code>{' '}
        panelinden giriş yapabilir ve <strong>sadece aşağıda işaretlediğiniz sayfalara</strong> erişebilir.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl border border-[#C89438]/25 shadow-sm">
        <div>
          <label className="block text-xs font-bold text-[#C89438] mb-1">Kullanıcı Adı *</label>
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            placeholder="ornek: ahmet"
          />
          <p className="text-[11px] text-[#5C6B73] mt-1">
            "@" içermiyorsa otomatik olarak dahili bir hesaba dönüştürülür — gerçek bir e-posta girmenize gerek yok.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#C89438] mb-1">Şifre *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="En az 6 karakter"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#C89438] mb-1">Şifre (Tekrar) *</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-[#C89438]">Erişebileceği Sayfalar *</label>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setPerms(preset.perms)}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF3E3] border border-[#C89438]/30 text-[10px] font-bold text-[#1B2A3A] hover:border-[#C89438] cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PERMISSION_FIELDS.map((f) => (
              <label
                key={f.key}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${
                  perms[f.key]
                    ? 'bg-[#1B2A3A] border-[#1B2A3A] text-white'
                    : 'bg-[#FAF3E3] border-[#C89438]/30 text-[#1B2A3A] hover:border-[#C89438]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={perms[f.key]}
                  onChange={() => togglePerm(f.key)}
                  className="sr-only"
                />
                <f.icon className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs font-bold">{f.label}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Kullanıcı oluşturuldu: <strong>{success.email}</strong> — artık bu bilgilerle giriş yapabilir.
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1B2A3A] text-white font-bold text-sm hover:bg-[#C89438] transition-colors disabled:opacity-60 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          {loading ? 'Oluşturuluyor…' : 'Kullanıcı Oluştur'}
        </button>
      </form>

      <style>{`.input { width: 100%; padding: 0.6rem 1rem; border-radius: 0.75rem; background: #FAF3E3; border: 1px solid rgba(200,148,56,0.3); color: #1B2A3A; }`}</style>
    </div>
  );
}
