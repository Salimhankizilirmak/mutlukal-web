-- ============================================================================
-- MUTLUKAL WEBSITE — Supabase şema kurulumu
-- ============================================================================
-- Nasıl çalıştırılır:
--   1) https://supabase.com üzerinde ücretsiz bir proje oluşturun.
--   2) Sol menüden "SQL Editor" > "New query" açın.
--   3) Bu dosyanın TAMAMINI yapıştırıp "Run" tuşuna basın.
--   4) Ardından "Authentication" > "Users" > "Add user" ile KENDİNİZE bir admin
--      girişi oluşturun (e-posta + şifre) — admin panele bu bilgilerle
--      giriş yapacaksınız. Başka hiçbir kullanıcı admin paneline giremez.
--   5) "Storage" sekmesinden "product-images" adında YENİ BİR PUBLIC bucket
--      oluşturun (ürün/galeri görselleri buraya yüklenecek).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1) ÜRÜNLER (Ürünlerimiz bölümündeki 4 ana ürün kartı)
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null,              -- sade | tambugday | aromali | pizza
  title text not null,
  subtitle text,
  image_url text,
  badge text,
  sizes text[] default '{}',           -- ['15 cm','20 cm','25 cm', ...]
  pack_count text,
  box_count text,
  shelf_life text,
  description text,
  features text[] default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2) AMBALAJ GALERİSİ (Katalog bölümündeki büyüteçli ürün kartları)
-- ----------------------------------------------------------------------------
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  image_url text not null,
  boyut text,                          -- '25 cm'
  pack_options jsonb not null default '[]', -- [{"adet":"10 Adet","gramaj":"650 g"}, ...]
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 3) İŞ BAŞVURULARI ("Bize Katılın" formu)
-- ----------------------------------------------------------------------------
create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  position text,
  message text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 4) TOPTAN TEKLİF TALEPLERİ (mevcut "Toptan Fiyat & Numune Talebi" formu —
--    şu anda hiçbir yere kaydedilmiyor, admin panelden görülebilmesi için)
-- ----------------------------------------------------------------------------
create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  phone text,
  product text,
  message text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Herkes (anon) ürün/galeri verisini OKUYABİLİR (site bu şekilde çalışır).
-- Sadece giriş yapmış admin (authenticated) EKLEYEBİLİR / DEĞİŞTİREBİLİR / SİLEBİLİR.
-- Form gönderileri (job_applications, contact_leads) herkes tarafından
-- EKLENEBİLİR ama sadece admin OKUYABİLİR (ziyaretçi mahremiyeti için).
-- ============================================================================

alter table public.products enable row level security;
alter table public.gallery_images enable row level security;
alter table public.job_applications enable row level security;
alter table public.contact_leads enable row level security;

-- Bu dosyayı güvenle birden fazla kez çalıştırabilmeniz için önce varsa
-- eski policy'leri siliyoruz.
drop policy if exists "products_public_read" on public.products;
drop policy if exists "products_admin_write" on public.products;
drop policy if exists "products_admin_update" on public.products;
drop policy if exists "products_admin_delete" on public.products;
drop policy if exists "gallery_public_read" on public.gallery_images;
drop policy if exists "gallery_admin_write" on public.gallery_images;
drop policy if exists "gallery_admin_update" on public.gallery_images;
drop policy if exists "gallery_admin_delete" on public.gallery_images;
drop policy if exists "job_applications_public_insert" on public.job_applications;
drop policy if exists "job_applications_admin_read" on public.job_applications;
drop policy if exists "job_applications_admin_delete" on public.job_applications;
drop policy if exists "contact_leads_public_insert" on public.contact_leads;
drop policy if exists "contact_leads_admin_read" on public.contact_leads;
drop policy if exists "contact_leads_admin_delete" on public.contact_leads;

-- products: herkes okur, sadece admin yazar
create policy "products_public_read" on public.products
  for select using (true);
create policy "products_admin_write" on public.products
  for insert to authenticated with check (true);
create policy "products_admin_update" on public.products
  for update to authenticated using (true) with check (true);
create policy "products_admin_delete" on public.products
  for delete to authenticated using (true);

-- gallery_images: herkes okur, sadece admin yazar
create policy "gallery_public_read" on public.gallery_images
  for select using (true);
create policy "gallery_admin_write" on public.gallery_images
  for insert to authenticated with check (true);
create policy "gallery_admin_update" on public.gallery_images
  for update to authenticated using (true) with check (true);
create policy "gallery_admin_delete" on public.gallery_images
  for delete to authenticated using (true);

-- job_applications: herkes ekler, sadece admin okur/siler
create policy "job_applications_public_insert" on public.job_applications
  for insert to anon, authenticated with check (true);
create policy "job_applications_admin_read" on public.job_applications
  for select to authenticated using (true);
create policy "job_applications_admin_delete" on public.job_applications
  for delete to authenticated using (true);

-- contact_leads: herkes ekler, sadece admin okur/siler
create policy "contact_leads_public_insert" on public.contact_leads
  for insert to anon, authenticated with check (true);
create policy "contact_leads_admin_read" on public.contact_leads
  for select to authenticated using (true);
create policy "contact_leads_admin_delete" on public.contact_leads
  for delete to authenticated using (true);

-- ============================================================================
-- BAŞLANGIÇ VERİSİ (opsiyonel) — sitede şu an hardcoded olan 4 ürünü ve
-- 9 galeri kartını admin panelden düzenleyebilmeniz için burada da oluşturuyoruz.
-- Bu INSERT'leri istemiyorsanız aşağıdaki bloğu çalıştırmadan atlayabilirsiniz.
-- ============================================================================

insert into public.products (slug, category, title, subtitle, image_url, badge, sizes, pack_count, box_count, shelf_life, description, features, sort_order)
values
  ('sade-tortilla-lavas', 'sade', 'Sade Tortilla', 'Klasik Unlu Mamul Serisi', '/images/products/sade.png', 'En Çok Satan',
    array['15 cm','20 cm','25 cm','26 cm','30 cm'], '10 - 18 Adet / Paket', '12 - 18 Paket / Koli', null,
    'Kafe, restoran ve dürüm işletmeleri için ürettiğimiz yüksek kaliteli sade tortilla.',
    array['Tost makinesinde ve fırında altın sarısı kızarma','HoReCa & perakende paket ambalaj seçenekleri'], 1),
  ('tam-bugday-tortilla', 'tambugday', 'Tam Buğday Tortilla', 'Yüksek Lifli & Kepekli Seri', '/images/products/tambugday.png', 'Kepekli & Diyet',
    array['15 cm','20 cm','25 cm','30 cm'], '12 - 18 Adet / Paket', '12 - 20 Paket / Koli', null,
    'Doğal kepekli ve tam buğday unundan hazırlanan, zengin lif içeriğine sahip, besleyici ve diyet menüler için özel tercih edilen tortilla.',
    array['Zengin doğal buğday lifi kaynağı','Düşük glisemik indeks ile uzun süre tok tutar','Fitness ve sağlıklı yaşam konseptlerine uygun'], 2),
  ('aromali-tortilla', 'aromali', 'Domatesli / Ispanaklı / Peynirli Tortilla', 'Sebze & Çeşni Katkılı Özel Seri', '/images/products/domatesli.png', 'Özel Reçete',
    array['15 cm','20 cm','25 cm','30 cm'], '10 - 18 Adet / Paket', '12 - 18 Paket / Koli', null,
    'Gerçek domates, taze ıspanak ve zengin peynir katkılarıyla renklenen, premium sunumlar ve özel sandviçler için geliştirilmiş seri.',
    array['Doğal içerik ile canlı renk ve hoş lezzet','Wraps ve özel sandviçler için renkli seçenek','Restoran menülerinde tercih edilir'], 3),
  ('pizza-tabani', 'pizza', 'Pizza Tabanı', 'Ön Pişirilmiş Pizza Tabanı', '/images/products/pizza.png', 'Hızlı Servis Seri',
    array['26 cm'], '4 - 6 Adet / Paket', '6 - 8 Paket / Koli', null,
    'Mayalanmış hamurdan özel fırınlarda yarı pişirilmiş, zaman ve işçilik tasarrufu sağlayan, çıtır kenarlı profesyonel pizza tabanları.',
    array['Ön pişirilmiş, dakikalar içinde servise hazır','Çıtır kenar ve dengeli gözenekli iç yapı','İşletmeler için düşük fire ve öngörülebilir maliyet'], 4)
on conflict (slug) do nothing;

insert into public.gallery_images (title, category, image_url, boyut, pack_options, sort_order)
values
  ('Sade Unlu Tortilla (25cm)', 'Unlu Mamul Çeşidi', '/images/products/sade.png', '25 cm',
    '[{"adet":"4 Adet","gramaj":"260 g"},{"adet":"6 Adet","gramaj":"390 g"},{"adet":"8 Adet","gramaj":"520 g"},{"adet":"10 Adet","gramaj":"650 g"},{"adet":"12 Adet","gramaj":"780 g"},{"adet":"18 Adet","gramaj":"1170 g"}]'::jsonb, 1),
  ('Domatesli Tortilla (25cm)', 'Domatesli Çeşit', '/images/products/domatesli.png', '25 cm',
    '[{"adet":"4 Adet","gramaj":"250 g"},{"adet":"6 Adet","gramaj":"390 g"},{"adet":"10 Adet","gramaj":"650 g"}]'::jsonb, 2),
  ('Ispanaklı Tortilla (25cm)', 'Ispanaklı Çeşit', '/images/products/ispanakli.png', '25 cm',
    '[{"adet":"4 Adet","gramaj":"250 g"},{"adet":"6 Adet","gramaj":"390 g"},{"adet":"10 Adet","gramaj":"650 g"}]'::jsonb, 3),
  ('Peynirli Tortilla (25cm)', 'Peynirli Çeşit', '/images/products/peynirli.png', '25 cm',
    '[{"adet":"4 Adet","gramaj":"250 g"},{"adet":"6 Adet","gramaj":"390 g"},{"adet":"12 Adet","gramaj":"780 g"}]'::jsonb, 4),
  ('Tam Buğday Tortilla (25cm)', 'Yüksek Lifli Çeşit', '/images/products/tambugday.png', '25 cm',
    '[{"adet":"4 Adet","gramaj":"260 g"},{"adet":"6 Adet","gramaj":"390 g"},{"adet":"8 Adet","gramaj":"520 g"},{"adet":"10 Adet","gramaj":"650 g"},{"adet":"18 Adet","gramaj":"1170 g"}]'::jsonb, 5),
  ('Pizza Tabanı (26cm)', 'Ön Pişirilmiş Çeşit', '/images/products/pizza.png', '26 cm',
    '[{"adet":"2 Adet","gramaj":"240 g"},{"adet":"4 Adet","gramaj":"480 g"}]'::jsonb, 6),
  ('Proteinli Tortilla (20cm)', 'Proteinli Çeşit', '/images/products/proteinli.png', '20 cm',
    '[{"adet":"4 Adet","gramaj":"166 g"}]'::jsonb, 7),
  ('Sade Unlu Tortilla (15cm Mini)', 'Mini Boy Çeşit', '/images/products/taco.png', '15 cm',
    '[{"adet":"6 Adet","gramaj":"150 g"},{"adet":"10 Adet","gramaj":"250 g"},{"adet":"18 Adet","gramaj":"450 g"}]'::jsonb, 8)
on conflict do nothing;
