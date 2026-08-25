import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { AlertTriangle } from 'lucide-react';
import '../index.css';

export default function AdminApp() {
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSession(null);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-[#1B2A3A] text-white flex items-center justify-center p-6 font-sans">
        <div className="max-w-lg bg-white text-[#1B2A3A] rounded-2xl p-8 shadow-2xl border border-[#C89438]/30">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-2">Admin Paneli Henüz Bağlı Değil</h1>
          <p className="text-sm text-[#5C6B73] leading-relaxed mb-4">
            Bu paneli kullanabilmek için önce bir Supabase projesi oluşturup <code className="px-1.5 py-0.5 rounded bg-[#FAF3E3] text-[#C89438] font-mono text-xs">.env.local</code> dosyasına
            bağlantı bilgilerinizi eklemeniz gerekiyor.
          </p>
          <ol className="text-sm text-[#5C6B73] leading-relaxed list-decimal list-inside space-y-1.5">
            <li><code className="font-mono text-xs">supabase/schema.sql</code> dosyasını Supabase SQL Editor'de çalıştırın</li>
            <li><code className="font-mono text-xs">supabase/storage-policies.sql</code> dosyasını çalıştırın</li>
            <li><code className="font-mono text-xs">.env.local.example</code> dosyasını <code className="font-mono text-xs">.env.local</code> olarak kopyalayıp kendi Project URL / anon key değerlerinizi girin</li>
            <li>Authentication → Users bölümünden kendinize bir giriş oluşturun</li>
            <li>Sunucuyu yeniden başlatın</li>
          </ol>
        </div>
      </div>
    );
  }

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-[#1B2A3A] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#C89438] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return session ? <AdminDashboard session={session} /> : <AdminLogin />;
}
