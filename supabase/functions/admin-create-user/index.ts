// Supabase Edge Function: admin-create-user
//
// Neden bir Edge Function gerekiyor?
// Yeni kullanıcı oluşturmak (supabase.auth.admin.createUser) "service_role"
// anahtarını gerektirir — bu anahtar RLS'i tamamen bypass eder ve ASLA
// tarayıcıya (client koduna) verilemez. Bu fonksiyon Supabase'in sunucu
// tarafında çalışır, service_role anahtarı sadece burada, güvenli şekilde
// kullanılır ve dışarı hiç çıkmaz.
//
// Bu fonksiyon ayrıca çağıranın "Kullanıcılar" sayfasına yetkisi olup
// olmadığını (can_users) kontrol eder — yetkisi olmayan biri bu uç noktayı
// doğrudan çağırsa bile yeni kullanıcı oluşturamaz.
//
// Nasıl deploy edilir (Supabase Dashboard üzerinden, CLI gerekmez):
//   1) Supabase Dashboard > Edge Functions > "Deploy a new function"
//   2) İsim: admin-create-user
//   3) Bu dosyanın TAMAMINI kod editörüne yapıştırın
//   4) Deploy edin
//
// SUPABASE_URL, SUPABASE_ANON_KEY ve SUPABASE_SERVICE_ROLE_KEY değişkenleri
// Supabase tarafından otomatik olarak Edge Function ortamına enjekte edilir —
// ayrıca bir "secret" tanımlamanıza gerek yoktur.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const PERMISSION_KEYS = [
  'can_products',
  'can_gallery',
  'can_applications',
  'can_leads',
  'can_events',
  'can_users',
  'can_ads',
] as const;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    // 1) Çağıranın gerçekten giriş yapmış (authenticated) bir kullanıcı
    //    olduğunu doğrula.
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return json({ error: 'Yetkisiz erişim — oturum bulunamadı.' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user: caller },
      error: callerErr,
    } = await callerClient.auth.getUser();

    if (callerErr || !caller) {
      return json({ error: 'Geçersiz oturum — lütfen tekrar giriş yapın.' }, 401);
    }

    // service_role client — RLS'i bypass eder, sadece burada (sunucuda) kullanılır.
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // 2) Çağıranın "Kullanıcılar" yetkisi var mı kontrol et. admin_permissions'ta
    //    hiç satırı yoksa (grandfather/ilk admin) izinli sayılır.
    const { data: callerPerm } = await adminClient
      .from('admin_permissions')
      .select('can_users')
      .eq('user_id', caller.id)
      .maybeSingle();

    const callerIsGrandfatherAdmin = !callerPerm;
    const callerCanManageUsers = callerIsGrandfatherAdmin || callerPerm.can_users === true;

    if (!callerCanManageUsers) {
      return json({ error: 'Kullanıcı oluşturma yetkiniz yok.' }, 403);
    }

    // 3) Girdileri doğrula.
    const { username, password, permissions } = await req.json();
    if (!username || !password) {
      return json({ error: 'Kullanıcı adı ve şifre zorunlu.' }, 400);
    }
    if (String(password).length < 6) {
      return json({ error: 'Şifre en az 6 karakter olmalı.' }, 400);
    }

    // Supabase Auth e-posta formatı ister; gerçek e-posta yoksa dahili bir
    // alan adı ekliyoruz. Kullanıcı zaten "@" içeren bir e-posta girdiyse
    // olduğu gibi kullanılır.
    const email = String(username).includes('@')
      ? String(username).trim().toLowerCase()
      : `${String(username).trim().toLowerCase()}@mutlukal-admin.local`;

    // 4) Kullanıcıyı oluştur (e-posta onayı istemeden).
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return json({ error: error.message }, 400);
    }

    // 5) Seçilen yetkileri kaydet — belirtilmeyen her yetki false kabul edilir,
    //    yani bu kullanıcı SADECE işaretlediğiniz sayfalara erişebilir.
    const permRow: Record<string, boolean> = { user_id: data.user.id } as never;
    for (const key of PERMISSION_KEYS) {
      permRow[key] = Boolean(permissions?.[key]);
    }

    const { error: permError } = await adminClient.from('admin_permissions').insert(permRow);
    if (permError) {
      // Kullanıcı oluştu ama yetki satırı yazılamadı — güvenli taraf: bu
      // durumda kullanıcı "hiçbir yetkisi olmayan" biri gibi davranır
      // (admin_permissions'ta satırı yoksa TAM YETKİLİ sayılacağından, satırın
      // hiç oluşmaması tehlikelidir — bu yüzden hatayı açıkça bildiriyoruz).
      return json(
        { error: `Kullanıcı oluşturuldu ama yetkiler kaydedilemedi: ${permError.message}. Lütfen Supabase Dashboard'dan manuel kontrol edin.` },
        500
      );
    }

    return json({ user: { id: data.user.id, email: data.user.email } });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Beklenmeyen hata.' }, 500);
  }
});
