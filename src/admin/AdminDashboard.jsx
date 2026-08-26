import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Package, Image as ImageIcon, Briefcase, MessageSquare, CalendarDays, Users, LogOut, Clapperboard, Menu, X } from 'lucide-react';
import ProductsManager from './ProductsManager';
import GalleryManager from './GalleryManager';
import LeadsManager from './LeadsManager';
import UsersManager from './UsersManager';
import EventsManager from './EventsManager';
import AdsManager from './AdsManager';
import JobApplicationsManager from './JobApplicationsManager';
import usePermissions from './usePermissions';

const ALL_TABS = [
  { id: 'products', label: 'Ürünler', icon: Package, perm: 'products' },
  { id: 'gallery', label: 'Ambalaj Galerisi', icon: ImageIcon, perm: 'gallery' },
  { id: 'events', label: 'Etkinlikler', icon: CalendarDays, perm: 'events' },
  { id: 'ads', label: 'Reklamlar', icon: Clapperboard, perm: 'ads' },
  { id: 'applications', label: 'İş Başvuruları', icon: Briefcase, perm: 'applications' },
  { id: 'leads', label: 'Teklif Talepleri', icon: MessageSquare, perm: 'leads' },
  { id: 'users', label: 'Kullanıcılar', icon: Users, perm: 'users' },
];

export default function AdminDashboard({ session }) {
  const perms = usePermissions(session?.user?.id);
  const visibleTabs = perms ? ALL_TABS.filter((t) => perms[t.perm]) : [];
  const [tab, setTab] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (perms && !tab && visibleTabs.length > 0) {
      setTab(visibleTabs[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perms]);

  if (perms === null) {
    return (
      <div className="min-h-screen bg-[#FAF3E3] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#C89438] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selectTab = (id) => {
    setTab(id);
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF3E3] text-[#1B2A3A] font-sans lg:flex">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#1B2A3A] text-white shadow-md">
        <div>
          <span className="font-serif text-lg font-bold">MUTLUKAL</span>
          <span className="block text-[9px] font-bold text-[#E2B45F] uppercase tracking-widest">
            Admin Panel
          </span>
        </div>
        <button
          onClick={() => setMobileNavOpen(true)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer"
          aria-label="Menüyü aç"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Backdrop behind the mobile drawer */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Sidebar — static column on desktop, slide-in drawer on mobile */}
      <aside
        className={`w-64 shrink-0 bg-[#1B2A3A] text-white flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="font-serif text-xl font-bold">MUTLUKAL</span>
            <span className="block text-[10px] font-bold text-[#E2B45F] uppercase tracking-widest mt-0.5">
              Admin Panel
            </span>
          </div>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
            aria-label="Menüyü kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleTabs.length === 0 && (
            <p className="px-4 py-3 text-xs text-white/50 leading-relaxed">
              Hesabınıza henüz hiçbir sayfa için yetki tanımlanmamış. Lütfen sizi oluşturan
              yöneticiyle iletişime geçin.
            </p>
          )}
          {visibleTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                tab === t.id
                  ? 'bg-[#C89438] text-[#1B2A3A]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="px-4 py-2 text-[11px] text-white/50 truncate">{session?.user?.email}</div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-10">
        {tab === 'products' && <ProductsManager />}
        {tab === 'gallery' && <GalleryManager />}
        {tab === 'events' && <EventsManager />}
        {tab === 'ads' && <AdsManager />}
        {tab === 'applications' && <JobApplicationsManager />}
        {tab === 'leads' && <LeadsManager table="contact_leads" title="Toptan Teklif Talepleri" />}
        {tab === 'users' && <UsersManager />}
      </main>
    </div>
  );
}
