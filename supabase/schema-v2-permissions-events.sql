-- ============================================================================
-- MUTLUKAL WEBSITE — v2: Kullanıcı Yetkileri (RBAC) + Etkinlikler
-- ============================================================================
-- Bu dosyayı SQL Editor'de, schema.sql'i zaten çalıştırdıktan SONRA çalıştırın.
-- Güvenle birden fazla kez çalıştırılabilir (idempotent).
--
-- Bu dosya ne yapar:
--   1) "events" (Etkinlikler) tablosunu oluşturur.
--   2) "admin_permissions" tablosunu oluşturur — hangi kullanıcının hangi
--      admin sayfasına erişebileceğini burada siz belirlersiniz.
--   3) Mevcut tüm admin tablolarının (products, gallery_images,
--      job_applications, contact_leads) yazma/okuma izinlerini artık
--      "herkes admin girişi yaptıysa her şeyi yapabilir" yerine
--      "sadece o sayfaya izni olan kullanıcı yapabilir" şekline çevirir.
--
-- ÖNEMLİ — Kendi hesabınız (Authentication > Users'dan elle oluşturduğunuz
-- ilk hesap) admin_permissions tablosunda hiç satırı olmadığı için
-- otomatik olarak TAM YETKİLİ sayılır (aşağıdaki has_permission()
-- fonksiyonuna bakın). Yani siz hiçbir şey yapmadan tüm sayfalara
-- erişebilirsiniz. Kullanıcılar sekmesinden oluşturduğunuz her yeni
-- kullanıcı içinse mutlaka bir admin_permissions satırı oluşturulur ve
-- SADECE seçtiğiniz kutucuklardaki sayfalara erişebilir.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1) ETKİNLİKLER
-- ----------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date,
  location text,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;

-- ----------------------------------------------------------------------------
-- 2) KULLANICI YETKİLERİ
-- ----------------------------------------------------------------------------
create table if not exists public.admin_permissions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  can_products boolean not null default false,      -- Ürünler
  can_gallery boolean not null default false,        -- Ambalaj Galerisi
  can_applications boolean not null default false,   -- İş Başvuruları
  can_leads boolean not null default false,          -- Teklif Talepleri
  can_events boolean not null default false,         -- Etkinlikler
  can_users boolean not null default false,          -- Kullanıcılar
  created_at timestamptz not null default now()
);

alter table public.admin_permissions enable row level security;

-- ----------------------------------------------------------------------------
-- 3) YETKİ KONTROL FONKSİYONU
-- ----------------------------------------------------------------------------
-- Kural: admin_permissions'ta hiç satırı olmayan bir kullanıcı (örn. sizin
-- Authentication > Users'dan elle oluşturduğunuz ilk hesap) TAM YETKİLİ
-- sayılır. Bir satırı olan kullanıcı ise SADECE o satırdaki true olan
-- alanlara erişebilir.
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
        )
    );
$$;

-- ----------------------------------------------------------------------------
-- 4) admin_permissions POLİTİKALARI
-- ----------------------------------------------------------------------------
-- Her kullanıcı sadece KENDİ satırını okuyabilir (panelde hangi sekmeleri
-- göreceğini belirlemek için). Yazma işlemi hiçbir client'a açık değil —
-- sadece Edge Function (service_role ile) yeni kullanıcı satırı ekleyebilir.
drop policy if exists "admin_permissions_self_read" on public.admin_permissions;
create policy "admin_permissions_self_read" on public.admin_permissions
  for select to authenticated using (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- 5) events POLİTİKALARI
-- ----------------------------------------------------------------------------
drop policy if exists "events_public_read" on public.events;
drop policy if exists "events_admin_write" on public.events;
drop policy if exists "events_admin_update" on public.events;
drop policy if exists "events_admin_delete" on public.events;

create policy "events_public_read" on public.events
  for select using (true);
create policy "events_admin_write" on public.events
  for insert to authenticated with check (public.has_permission('events'));
create policy "events_admin_update" on public.events
  for update to authenticated using (public.has_permission('events')) with check (public.has_permission('events'));
create policy "events_admin_delete" on public.events
  for delete to authenticated using (public.has_permission('events'));

-- ----------------------------------------------------------------------------
-- 6) MEVCUT TABLOLARIN POLİTİKALARINI YETKİYE GÖRE GÜNCELLE
-- ----------------------------------------------------------------------------
drop policy if exists "products_public_read" on public.products;
drop policy if exists "products_admin_write" on public.products;
drop policy if exists "products_admin_update" on public.products;
drop policy if exists "products_admin_delete" on public.products;

create policy "products_public_read" on public.products
  for select using (true);
create policy "products_admin_write" on public.products
  for insert to authenticated with check (public.has_permission('products'));
create policy "products_admin_update" on public.products
  for update to authenticated using (public.has_permission('products')) with check (public.has_permission('products'));
create policy "products_admin_delete" on public.products
  for delete to authenticated using (public.has_permission('products'));

drop policy if exists "gallery_public_read" on public.gallery_images;
drop policy if exists "gallery_admin_write" on public.gallery_images;
drop policy if exists "gallery_admin_update" on public.gallery_images;
drop policy if exists "gallery_admin_delete" on public.gallery_images;

create policy "gallery_public_read" on public.gallery_images
  for select using (true);
create policy "gallery_admin_write" on public.gallery_images
  for insert to authenticated with check (public.has_permission('gallery'));
create policy "gallery_admin_update" on public.gallery_images
  for update to authenticated using (public.has_permission('gallery')) with check (public.has_permission('gallery'));
create policy "gallery_admin_delete" on public.gallery_images
  for delete to authenticated using (public.has_permission('gallery'));

drop policy if exists "job_applications_public_insert" on public.job_applications;
drop policy if exists "job_applications_admin_read" on public.job_applications;
drop policy if exists "job_applications_admin_delete" on public.job_applications;

create policy "job_applications_public_insert" on public.job_applications
  for insert to anon, authenticated with check (true);
create policy "job_applications_admin_read" on public.job_applications
  for select to authenticated using (public.has_permission('applications'));
create policy "job_applications_admin_delete" on public.job_applications
  for delete to authenticated using (public.has_permission('applications'));

drop policy if exists "contact_leads_public_insert" on public.contact_leads;
drop policy if exists "contact_leads_admin_read" on public.contact_leads;
drop policy if exists "contact_leads_admin_delete" on public.contact_leads;

create policy "contact_leads_public_insert" on public.contact_leads
  for insert to anon, authenticated with check (true);
create policy "contact_leads_admin_read" on public.contact_leads
  for select to authenticated using (public.has_permission('leads'));
create policy "contact_leads_admin_delete" on public.contact_leads
  for delete to authenticated using (public.has_permission('leads'));

-- ----------------------------------------------------------------------------
-- 7) GÖRSEL YÜKLEME (Storage) İZİNLERİNİ DE YETKİYE BAĞLA
-- ----------------------------------------------------------------------------
drop policy if exists "product_images_admin_upload" on storage.objects;
drop policy if exists "product_images_admin_delete" on storage.objects;
drop policy if exists "product_images_admin_update" on storage.objects;

create policy "product_images_admin_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and (public.has_permission('products') or public.has_permission('gallery') or public.has_permission('events'))
  );

create policy "product_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and (public.has_permission('products') or public.has_permission('gallery') or public.has_permission('events'))
  );

create policy "product_images_admin_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and (public.has_permission('products') or public.has_permission('gallery') or public.has_permission('events'))
  )
  with check (
    bucket_id = 'product-images'
    and (public.has_permission('products') or public.has_permission('gallery') or public.has_permission('events'))
  );

-- ----------------------------------------------------------------------------
-- 8) ÖRNEK ETKİNLİK (opsiyonel — istemiyorsanız bu bloğu atlayın)
-- ----------------------------------------------------------------------------
insert into public.events (title, description, event_date, location, sort_order)
select 'Foodex Türkiye 2026', 'Standımızı ziyaret edin, yeni ürünlerimizi tanıyın.', '2026-11-15', 'İstanbul Fuar Merkezi', 1
where not exists (select 1 from public.events limit 1);
