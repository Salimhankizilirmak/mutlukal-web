-- ============================================================================
-- MUTLUKAL WEBSITE — v4: Çok Dilli İçerik (Ürünler & Ambalaj Galerisi)
-- ============================================================================
-- Daha önceki tüm schema-*.sql dosyalarından SONRA çalıştırın.
-- Güvenle birden fazla kez çalıştırılabilir (idempotent).
--
-- Bu dosya, "Ürünler" ve "Ambalaj Galerisi" sayfalarındaki içeriğin
-- İngilizce / Rusça / Arapça çevirilerini saklayabilmeniz için mevcut
-- tablolara yeni sütunlar ekler. Türkçe alanlar (title, description, vb.)
-- olduğu gibi kalır — bu sadece ek sütunlardır, mevcut veriniz silinmez.
--
-- Bir dil için çeviri girmezseniz (boş bırakırsanız), site otomatik olarak
-- Türkçe içeriği gösterir — hiçbir ürün "boş" görünmez.
--
-- NOT: "Bize Katılın" (iş başvuruları, açık pozisyonlar) ve "Etkinlikler"
-- kasıtlı olarak bu çok dilli sisteme dahil edilmedi — onlar her zaman
-- Türkçe kalacak.
-- ============================================================================

alter table public.products
  add column if not exists title_en text,
  add column if not exists subtitle_en text,
  add column if not exists description_en text,
  add column if not exists features_en text[],
  add column if not exists title_ru text,
  add column if not exists subtitle_ru text,
  add column if not exists description_ru text,
  add column if not exists features_ru text[],
  add column if not exists title_ar text,
  add column if not exists subtitle_ar text,
  add column if not exists description_ar text,
  add column if not exists features_ar text[];

alter table public.gallery_images
  add column if not exists title_en text,
  add column if not exists category_en text,
  add column if not exists title_ru text,
  add column if not exists category_ru text,
  add column if not exists title_ar text,
  add column if not exists category_ar text;

-- ============================================================================
-- Mevcut 4 ürün ve 8 galeri kartı için hazır çeviriler (opsiyonel).
-- İsterseniz bu bloğu atlayıp çevirileri admin panelden kendiniz de
-- girebilirsiniz — "Kullanıcılar" gibi "Ürünler" ve "Ambalaj Galerisi"
-- sayfalarında artık dil sekmeleri göreceksiniz.
-- ============================================================================

update public.products set
  title_en = 'Plain Tortilla', subtitle_en = 'Classic Flour Product Series',
  description_en = 'A high-quality plain tortilla made specifically for cafés, restaurants and wrap businesses, with a flexible texture that holds up well when wrapping.',
  features_en = array['Flexible texture, holds up well when folding and wrapping', 'Toasts to a golden brown in a press or oven', 'HoReCa & retail packaging options'],
  title_ru = 'Тортилья классическая', subtitle_ru = 'Классическая серия мучных изделий',
  description_ru = 'Высококачественная классическая тортилья, изготовленная специально для кафе, ресторанов и заведений с шаурмой/дюрюмом, с эластичной текстурой, устойчивой при заворачивании.',
  features_ru = array['Эластичная текстура, не рвётся при складывании и заворачивании', 'Золотистая румяная корочка при поджаривании в прессе или духовке', 'Варианты упаковки для HoReCa и розницы'],
  title_ar = 'تورتيلا سادة', subtitle_ar = 'السلسلة الكلاسيكية من منتجات الدقيق',
  description_ar = 'تورتيلا سادة عالية الجودة مصنوعة خصيصًا للمقاهي والمطاعم ومحلات اللفائف، بقوام مرن يتحمل اللف دون أن يتمزق.',
  features_ar = array['قوام مرن يتحمل الطي واللف', 'تحمّر ذهبي عند التحمير في الفرن أو الشواية', 'خيارات تعبئة لقطاع الفنادق والمطاعم والتجزئة']
where slug = 'sade-tortilla-lavas';

update public.products set
  title_en = 'Whole Wheat Tortilla', subtitle_en = 'High-Fiber Whole Wheat Series',
  description_en = 'Made with natural whole wheat flour, rich in fiber and specially preferred for nutritious, diet-friendly menus.',
  features_en = array['A rich source of natural wheat fiber', 'Low glycemic index keeps you full longer', 'Suited to fitness and healthy-living concepts'],
  title_ru = 'Цельнозерновая тортилья', subtitle_ru = 'Высоковолокнистая цельнозерновая серия',
  description_ru = 'Изготовлена из натуральной цельнозерновой муки, богата клетчаткой, специально предпочитается для питательных и диетических меню.',
  features_ru = array['Богатый источник натуральной пшеничной клетчатки', 'Низкий гликемический индекс дольше сохраняет чувство сытости', 'Подходит для фитнес- и здорового образа жизни'],
  title_ar = 'تورتيلا القمح الكامل', subtitle_ar = 'سلسلة القمح الكامل الغنية بالألياف',
  description_ar = 'مُعدّة من دقيق القمح الكامل الطبيعي، غنية بالألياف، ومفضّلة خصيصًا للقوائم الغذائية الصحية والحِمية.',
  features_ar = array['مصدر غني بألياف القمح الطبيعية', 'مؤشر جلايسيمي منخفض يمنح شبعًا أطول', 'مناسبة لأسلوب الحياة الرياضي والصحي']
where slug = 'tam-bugday-tortilla';

update public.products set
  title_en = 'Tomato / Spinach / Cheese Tortilla', subtitle_en = 'Special Series with Vegetable & Flavor Additions',
  description_en = 'A series developed for premium presentations and specialty sandwiches, colored with real tomato, fresh spinach and rich cheese additions.',
  features_en = array['Vibrant color and pleasant taste from natural ingredients', 'A colorful option for wraps and specialty sandwiches', 'A popular choice on restaurant menus'],
  title_ru = 'Тортилья с томатом / шпинатом / сыром', subtitle_ru = 'Особая серия с овощными и вкусовыми добавками',
  description_ru = 'Серия, разработанная для премиальной подачи и особых сэндвичей, окрашенная с добавлением настоящего томата, свежего шпината и насыщенного сыра.',
  features_ru = array['Яркий цвет и приятный вкус за счёт натуральных ингредиентов', 'Красочный вариант для роллов и особых сэндвичей', 'Востребована в ресторанных меню'],
  title_ar = 'تورتيلا بالطماطم / السبانخ / الجبن', subtitle_ar = 'سلسلة خاصة بإضافات الخضار والنكهات',
  description_ar = 'سلسلة طُوّرت للتقديم الفاخر والسندويشات الخاصة، ملوّنة بإضافات حقيقية من الطماطم والسبانخ الطازج والجبن الغني.',
  features_ar = array['لون زاهٍ ونكهة لذيذة من مكونات طبيعية', 'خيار ملون للفّات والسندويشات الخاصة', 'مفضّلة في قوائم طعام المطاعم']
where slug = 'aromali-tortilla';

update public.products set
  title_en = 'Pizza Base', subtitle_en = 'Pre-Baked Pizza Base',
  description_en = 'Professional, crispy-edged pizza bases, par-baked from leavened dough in special ovens to save time and labor.',
  features_en = array['Par-baked, ready to serve in minutes', 'Crispy edge with an evenly porous interior', 'Low waste and predictable cost for businesses'],
  title_ru = 'Основа для пиццы', subtitle_ru = 'Основа для пиццы предварительной выпечки',
  description_ru = 'Профессиональные основы для пиццы с хрустящим краем, частично выпеченные из дрожжевого теста в специальных печах — экономия времени и труда.',
  features_ru = array['Частично выпечена, готова к подаче за считанные минуты', 'Хрустящий край и равномерно пористая структура', 'Низкие потери и предсказуемая себестоимость для бизнеса'],
  title_ar = 'قاعدة بيتزا', subtitle_ar = 'قاعدة بيتزا مخبوزة مسبقًا',
  description_ar = 'قواعد بيتزا احترافية بحواف مقرمشة، مخبوزة جزئيًا من عجين مخمّر في أفران خاصة، لتوفير الوقت والجهد.',
  features_ar = array['مخبوزة جزئيًا وجاهزة للتقديم خلال دقائق', 'حواف مقرمشة وقوام داخلي متجانس المسامية', 'هدر منخفض وتكلفة يمكن التنبؤ بها للأعمال']
where slug = 'pizza-tabani';

-- Ambalaj galerisi çevirileri (title_en/ru/ar, category_en/ru/ar)
update public.gallery_images set title_en = 'Plain Tortilla (25cm)', category_en = 'Flour Product Variety', title_ru = 'Тортилья классическая (25см)', category_ru = 'Мучное изделие', title_ar = 'تورتيلا سادة (25 سم)', category_ar = 'منتج دقيق' where title = 'Sade Unlu Tortilla (25cm)';
update public.gallery_images set title_en = 'Tomato Tortilla (25cm)', category_en = 'Tomato Variety', title_ru = 'Тортилья с томатом (25см)', category_ru = 'С томатом', title_ar = 'تورتيلا بالطماطم (25 سم)', category_ar = 'بالطماطم' where title = 'Domatesli Tortilla (25cm)';
update public.gallery_images set title_en = 'Spinach Tortilla (25cm)', category_en = 'Spinach Variety', title_ru = 'Тортилья со шпинатом (25см)', category_ru = 'Со шпинатом', title_ar = 'تورتيلا بالسبانخ (25 سم)', category_ar = 'بالسبانخ' where title = 'Ispanaklı Tortilla (25cm)';
update public.gallery_images set title_en = 'Cheese Tortilla (25cm)', category_en = 'Cheese Variety', title_ru = 'Тортилья с сыром (25см)', category_ru = 'С сыром', title_ar = 'تورتيلا بالجبن (25 سم)', category_ar = 'بالجبن' where title = 'Peynirli Tortilla (25cm)';
update public.gallery_images set title_en = 'Whole Wheat Tortilla (25cm)', category_en = 'High-Fiber Variety', title_ru = 'Цельнозерновая тортилья (25см)', category_ru = 'Высоковолокнистая', title_ar = 'تورتيلا القمح الكامل (25 سم)', category_ar = 'غنية بالألياف' where title = 'Tam Buğday Tortilla (25cm)';
update public.gallery_images set title_en = 'Pizza Base (26cm)', category_en = 'Par-Baked Variety', title_ru = 'Основа для пиццы (26см)', category_ru = 'Предварительной выпечки', title_ar = 'قاعدة بيتزا (26 سم)', category_ar = 'مخبوزة مسبقًا' where title = 'Pizza Tabanı (26cm)';
update public.gallery_images set title_en = 'Protein Tortilla (20cm)', category_en = 'Protein Variety', title_ru = 'Протеиновая тортилья (20см)', category_ru = 'Протеиновая', title_ar = 'تورتيلا بروتينية (20 سم)', category_ar = 'بروتينية' where title = 'Proteinli Tortilla (20cm)';
update public.gallery_images set title_en = 'Plain Tortilla (15cm Mini)', category_en = 'Mini Size Variety', title_ru = 'Тортилья классическая (мини 15см)', category_ru = 'Мини-размер', title_ar = 'تورتيلا سادة (ميني 15 سم)', category_ar = 'مقاس ميني' where title = 'Sade Unlu Tortilla (15cm Mini)';
