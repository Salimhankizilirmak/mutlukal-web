-- ============================================================================
-- Ürün içeriklerini son haline getirir — tek dosyada toplandı.
-- (fix-aroma-wording.sql, fix-marketing-tone.sql ve fix-tortilla-only.sql
--  dosyalarının YERİNE geçer — onları ayrıca çalıştırmanıza gerek yok.)
--
-- İçerdiği düzeltmeler:
--   • "Lavaş" kaldırıldı (sadece Tortilla üretiyoruz)
--   • "Aroma" kelimesi kaldırıldı
--   • Aşırı iddialı pazarlama dili (mükemmel, sıfır fire vb.) sadeleştirildi
--   • "Yırtılmayan doku" iddiası kaldırıldı (gerçek değil)
--   • Sade Tortilla'da olmayan 33 cm ölçüsü kaldırıldı
--   • Pizza Tabanı'nda olmayan 30 cm ölçüsü kaldırıldı
--   • Kullanılmayan "Donuk -18°C" raf ömrü verisi temizlendi
-- ============================================================================

update public.products
set
  title = 'Sade Tortilla',
  sizes = array['15 cm','20 cm','25 cm','26 cm','30 cm'],
  description = 'Kafe, restoran ve dürüm işletmeleri için ürettiğimiz yüksek kaliteli sade tortilla.',
  features = array[
    'Tost makinesinde ve fırında altın sarısı kızarma',
    'HoReCa & perakende paket ambalaj seçenekleri'
  ],
  shelf_life = null
where slug = 'sade-tortilla-lavas';

update public.products
set shelf_life = null
where slug = 'tam-bugday-tortilla';

update public.products
set
  description = 'Gerçek domates, taze ıspanak ve zengin peynir katkılarıyla renklenen, premium sunumlar ve özel sandviçler için geliştirilmiş seri.',
  features = array[
    'Doğal içerik ile canlı renk ve hoş lezzet',
    'Wraps ve özel sandviçler için renkli seçenek',
    'Restoran menülerinde tercih edilir'
  ],
  shelf_life = null
where slug = 'aromali-tortilla';

update public.products
set
  sizes = array['26 cm'],
  features = array[
    'Ön pişirilmiş, dakikalar içinde servise hazır',
    'Çıtır kenar ve dengeli gözenekli iç yapı',
    'İşletmeler için düşük fire ve öngörülebilir maliyet'
  ],
  shelf_life = null
where slug = 'pizza-tabani';
