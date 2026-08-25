-- ============================================================================
-- MUTLUKAL WEBSITE — Storage (görsel yükleme) izinleri
-- ============================================================================
-- ÖNCE şunu yapın:
--   Supabase Dashboard > Storage > "New bucket" > isim: product-images
--   "Public bucket" seçeneğini AÇIK bırakın (site görselleri herkese açık
--   olmalı ki müşteriler ürün fotoğraflarını görebilsin).
--
-- SONRA bu dosyayı SQL Editor'de çalıştırın.
-- Bu dosya güvenle birden fazla kez çalıştırılabilir (idempotent) —
-- önce varsa eski policy'yi siler, sonra yeniden oluşturur.
-- ============================================================================

drop policy if exists "product_images_public_read" on storage.objects;
drop policy if exists "product_images_admin_upload" on storage.objects;
drop policy if exists "product_images_admin_delete" on storage.objects;
drop policy if exists "product_images_admin_update" on storage.objects;

-- Herkes bucket içindeki görselleri görebilir (public bucket zaten bunu sağlar,
-- bu politika ekstra güvence içindir).
create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Sadece giriş yapmış admin görsel yükleyebilir.
create policy "product_images_admin_upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

-- Sadece giriş yapmış admin görsel silebilir / değiştirebilir.
create policy "product_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

create policy "product_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');
