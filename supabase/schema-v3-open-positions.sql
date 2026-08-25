-- ============================================================================
-- MUTLUKAL WEBSITE — v3: Açık Pozisyonlar (İK)
-- ============================================================================
-- schema.sql ve schema-v2-permissions-events.sql'den SONRA çalıştırın.
-- Güvenle birden fazla kez çalıştırılabilir (idempotent).
--
-- Bu tablo, İK yetkisi olan kullanıcıların ("İş Başvuruları" sayfasına
-- erişimi olanlar) "Bize Katılın" bölümünde yayınlanacak açık pozisyonları
-- yönetmesini sağlar. Aynı yetki (can_applications) burayı da kapsar —
-- ayrı bir yetki eklemeye gerek yok.
-- ============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.open_positions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.open_positions enable row level security;

drop policy if exists "open_positions_public_read" on public.open_positions;
drop policy if exists "open_positions_admin_write" on public.open_positions;
drop policy if exists "open_positions_admin_update" on public.open_positions;
drop policy if exists "open_positions_admin_delete" on public.open_positions;

-- Herkes (site ziyaretçileri) aktif/pasif fark etmeksizin okuyabilir —
-- pasif olanları site tarafında filtreliyoruz; admin panelde ikisini de
-- görüp yönetebilmeniz gerekiyor.
create policy "open_positions_public_read" on public.open_positions
  for select using (true);

create policy "open_positions_admin_write" on public.open_positions
  for insert to authenticated with check (public.has_permission('applications'));
create policy "open_positions_admin_update" on public.open_positions
  for update to authenticated using (public.has_permission('applications')) with check (public.has_permission('applications'));
create policy "open_positions_admin_delete" on public.open_positions
  for delete to authenticated using (public.has_permission('applications'));

-- Örnek başlangıç pozisyonları (opsiyonel — istemiyorsanız bu bloğu atlayın)
insert into public.open_positions (title, sort_order)
select v.title, v.sort_order
from (values
  ('Üretim Personeli', 1),
  ('Hamurhane Personeli', 2),
  ('Paketleme Personeli', 3),
  ('Kolileme Personeli', 4)
) as v(title, sort_order)
where not exists (select 1 from public.open_positions limit 1);
