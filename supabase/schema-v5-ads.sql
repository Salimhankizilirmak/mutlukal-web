-- ============================================================================
-- MUTLUKAL WEBSITE — v5: Reklam Videoları
-- ============================================================================
-- schema.sql ve schema-v2-permissions-events.sql'den SONRA çalıştırın.
-- Güvenle birden fazla kez çalıştırılabilir (idempotent).
--
-- ÖNCE şunu yapın (SQL Editor'e geçmeden önce):
--   Supabase Dashboard > Storage > "New bucket" > isim: ad-videos
--   "Public bucket" seçeneğini AÇIK bırakın (reklam videoları herkese açık
--   olmalı ki site ziyaretçileri izleyebilsin).
--
-- Bu dosya ne yapar:
--   1) "ads" (Reklam Videoları) tablosunu oluşturur.
--   2) admin_permissions'a "can_ads" yetkisini ekler ve has_permission()
--      fonksiyonunu bunu tanıyacak şekilde günceller.
--   3) "ads" tablosu ve "ad-videos" storage bucket'ı için RLS politikalarını
--      kurar (herkes izleyebilir, sadece can_ads yetkisi olan yükleyip
--      silebilir).
--
-- NOT: Reklam videoları — İK ve Etkinlikler gibi — dil desteğinin dışında
-- tutulur; hangi dil seçilirse seçilsin her zaman Türkçe görünür.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1) REKLAM VİDEOLARI
-- ----------------------------------------------------------------------------
create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  video_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ads enable row level security;

-- ----------------------------------------------------------------------------
-- 2) admin_permissions'A "can_ads" YETKİSİ EKLE
-- ----------------------------------------------------------------------------
alter table public.admin_permissions
  add column if not exists can_ads boolean not null default false;

create or replace function public.has_permission(perm text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    not exists (select 1 from public.admin_permissions where user_id = auth.uid())
    or exists (
      select 1 from public.admin_permissions
      where user_id = auth.uid()
        and (
          (perm = 'products' and can_products)
          or (perm = 'gallery' and can_gallery)
          or (perm = 'applications' and can_applications)
          or (perm = 'leads' and can_leads)
          or (perm = 'events' and can_events)
          or (perm = 'users' and can_users)
          or (perm = 'ads' and can_ads)
        )
    );
$$;

-- ----------------------------------------------------------------------------
-- 3) ads POLİTİKALARI
-- ----------------------------------------------------------------------------
drop policy if exists "ads_public_read" on public.ads;
drop policy if exists "ads_admin_write" on public.ads;
drop policy if exists "ads_admin_update" on public.ads;
drop policy if exists "ads_admin_delete" on public.ads;

create policy "ads_public_read" on public.ads
  for select using (true);
create policy "ads_admin_write" on public.ads
  for insert to authenticated with check (public.has_permission('ads'));
create policy "ads_admin_update" on public.ads
  for update to authenticated using (public.has_permission('ads')) with check (public.has_permission('ads'));
create policy "ads_admin_delete" on public.ads
  for delete to authenticated using (public.has_permission('ads'));

-- ----------------------------------------------------------------------------
-- 4) "ad-videos" STORAGE BUCKET POLİTİKALARI
-- ----------------------------------------------------------------------------
drop policy if exists "ad_videos_public_read" on storage.objects;
drop policy if exists "ad_videos_admin_upload" on storage.objects;
drop policy if exists "ad_videos_admin_delete" on storage.objects;
drop policy if exists "ad_videos_admin_update" on storage.objects;

create policy "ad_videos_public_read"
  on storage.objects for select
  using (bucket_id = 'ad-videos');

create policy "ad_videos_admin_upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'ad-videos' and public.has_permission('ads'));

create policy "ad_videos_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'ad-videos' and public.has_permission('ads'));

create policy "ad_videos_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'ad-videos' and public.has_permission('ads'))
  with check (bucket_id = 'ad-videos' and public.has_permission('ads'));
