import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Lock, LogIn, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Kullanıcı adı ("@" içermeyen) girildiyse, admin panelden kullanıcı
    // oluştururken kullanılan dahili alan adını burada da tamamlıyoruz.
    const normalizedEmail = email.includes('@')
      ? email.trim().toLowerCase()
      : `${email.trim().toLowerCase()}@mutlukal-admin.local`;
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError('Giriş başarısız — kullanıcı adı/e-posta veya şifre hatalı.');
    }
  };

  return (
    <div className="min-h-screen bg-[#1B2A3A] flex items-center justify-center p-6 font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 border border-[#C89438]/30"
      >
        <div className="w-12 h-12 rounded-xl bg-[#FAF3E3] border border-[#C89438]/40 text-[#C89438] flex items-center justify-center mb-5">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#1B2A3A] mb-1">MUTLUKAL Admin</h1>
        <p className="text-xs text-[#5C6B73] mb-6">Sadece yetkili personel içindir.</p>

        <label className="block text-xs font-bold text-[#C89438] mb-1">E-posta veya Kullanıcı Adı</label>
        <input
          type="text"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 mb-4 rounded-xl bg-[#FAF3E3] border border-[#C89438]/30 text-[#1B2A3A] focus:outline-none focus:border-[#C89438]"
          placeholder="admin@mutlukal.com.tr veya kullanıcı adınız"
        />

        <label className="block text-xs font-bold text-[#C89438] mb-1">Şifre</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 mb-5 rounded-xl bg-[#FAF3E3] border border-[#C89438]/30 text-[#1B2A3A] focus:outline-none focus:border-[#C89438]"
          placeholder="••••••••"
        />

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#1B2A3A] text-white font-bold text-sm hover:bg-[#C89438] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
}
