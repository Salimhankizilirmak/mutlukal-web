-- ============================================================================
-- MUTLUKAL WEBSITE — v6: KRİTİK GÜVENLİK DÜZELTMESİ
-- ============================================================================
-- ACİL — bu dosyayı diğerlerinden ÖNCE, hemen çalıştırın.
--
-- SORUN: has_permission() fonksiyonumuz "admin_permissions tablosunda hiç
-- satırı olmayan kullanıcı = tam yetkili admin" kuralını kullanıyordu. Bu,
-- SADECE sizin ilk hesabınız için pratik olsun diye düşünülmüştü — ama
-- Supabase projelerinde varsayılan olarak HERKES kendi hesabını
-- oluşturabildiği için (public sign-up), siteyle hiç ilgisi olmayan biri
-- kendi hesabını açıp otomatik olarak "tam yetkili admin" sayılabiliyordu.
-- Bu yüzden ürünler tablosuna yetkisiz ekleme yapılabildi.
--
-- ÇÖZÜM: Kuralı tersine çeviriyoruz — artık "satırı olmayan kullanıcı =
-- YETKİSİZ" (varsayılan red). Bunu yapmadan önce, GERÇEK admin hesabınıza
-- (aşağıda e-postasını değiştirin) açıkça tam yetkili bir satır veriyoruz
-- ki siz dışarıda kalmayasınız.
--
-- ÖNCE ŞUNU YAPIN (bu SQL'den bağımsız, ayrıca ve hemen):
--   Supabase Dashboard > Authentication > Sign In / Providers > Email
--   "Allow new users to sign up" seçeneğini KAPATIN. Bu, yeni birinin kendi
--   hesabını açmasını anında engeller.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) GERÇEK ADMIN HESABINIZA AÇIKÇA TAM YETKİ VER
-- ----------------------------------------------------------------------------
-- Aşağıdaki e-postayı, panelde giriş yaptığınız kendi hesabınızla değiştirin
-- (birden fazla "asıl admin" hesabınız varsa bu bloğu her biri için tekrarlayın).
insert into public.admin_permissions (user_id, can_products, can_gallery, can_applications, can_leads, can_events, can_users, can_ads)
select id, true, true, true, true, true, true, true
from auth.users
where email = 'salimhankizilirmak@gmail.com' -- << başka bir e-posta ile giriş yapıyorsanız değiştirin
on conflict (user_id) do update set
  can_products = true,
  can_gallery = true,
  can_applications = true,
  can_leads = true,
  can_events = true,
  can_users = true,
  can_ads = true;

-- ----------------------------------------------------------------------------
-- 2) has_permission() FONKSİYONUNU "VARSAYILAN RED" OLACAK ŞEKİLDE DÜZELT
-- ----------------------------------------------------------------------------
-- Artık admin_permissions'ta satırı olmayan HİÇBİR kullanıcı hiçbir şeye
-- erişemez. Sadece açıkça izin verilen satırlar (1. adımdaki gibi) yetkili.
create or replace function public.has_permission(perm text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
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
