// Supabase Edge Function: send-lead-notification
//
// Ne işe yarar?
// "job_applications" (İş Başvuruları) veya "contact_leads" (Toptan Teklif
// Talepleri) tablosuna yeni bir kayıt eklendiğinde, Supabase'in Database
// Webhook özelliği bu fonksiyonu otomatik çağırır. Fonksiyon, kaydın hangi
// tablodan geldiğine bakıp ilgili departmana (İK ya da Pazarlama) + size
// bir bildirim e-postası gönderir.
//
// GÜVENLİK NOTU: Bu fonksiyon SADECE veritabanına gerçekten eklenmiş bir
// satırın bilgilerini e-postaya döker — çağıranın gönderdiği serbest metni
// e-postaya basmaz. Ayrıca aşağıdaki paylaşılan gizli anahtar (WEBHOOK_SECRET)
// kontrolü sayesinde, sadece Supabase'in kendi Database Webhook'u bu
// fonksiyonu tetikleyebilir — rastgele biri bu adrese istek atıp şirket
// Gmail hesabından spam e-posta gönderemez.
//
// Nasıl deploy edilir (Supabase Dashboard üzerinden, CLI gerekmez):
//   1) Supabase Dashboard > Edge Functions > "Deploy a new function"
//   2) İsim: send-lead-notification
//   3) Bu dosyanın TAMAMINI kod editörüne yapıştırın, Deploy edin.
//
// GEREKLİ SECRETS (Edge Functions > send-lead-notification > Secrets):
//   GMAIL_USER          — gönderen Gmail adresi (örn: xxxxx@gmail.com)
//   GMAIL_APP_PASSWORD  — Google Hesabı > Güvenlik > Uygulama Şifreleri'nden
//                         alınan 16 haneli uygulama şifresi (boşluksuz da olur)
//   WEBHOOK_SECRET      — kendiniz belirlediğiniz rastgele bir metin (örn.
//                         bir şifre üretici ile 32 karakterlik rastgele dize)
//
// Database Webhook kurulurken bu WEBHOOK_SECRET'ı "x-webhook-secret" adlı
// bir HTTP header olarak eklemeniz gerekiyor — kurulum adımları ayrıca
// anlatılacak.

import nodemailer from 'npm:nodemailer@6.9.16';

const IK_EMAIL = 'ik@mutlukal.com.tr';
const PAZARLAMA_EMAIL = 'marketing@mutlukal.com.tr';
const OWNER_EMAIL = 'salimhankizilirmak@gmail.com';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(value: unknown): string {
  return String(value ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildJobApplicationEmail(record: Record<string, unknown>) {
  const subject = `Yeni İş Başvurusu: ${record.full_name ?? ''}`;
  const html = `
    <h2>Yeni İş Başvurusu</h2>
    <p><b>Ad Soyad:</b> ${escapeHtml(record.full_name)}</p>
    <p><b>Pozisyon:</b> ${escapeHtml(record.position)}</p>
    <p><b>E-posta:</b> ${escapeHtml(record.email)}</p>
    <p><b>Telefon:</b> ${escapeHtml(record.phone)}</p>
    <p><b>Mesaj:</b><br>${escapeHtml(record.message).replace(/\n/g, '<br>')}</p>
    <hr>
    <p style="color:#888;font-size:12px;">Bu e-posta mutlukal.com.tr üzerindeki "Bize Katılın" formundan otomatik gönderilmiştir.</p>
  `;
  return { subject, html, to: [IK_EMAIL], bcc: [OWNER_EMAIL] };
}

function buildContactLeadEmail(record: Record<string, unknown>) {
  const subject = `Yeni Toptan Teklif Talebi: ${record.name ?? ''}`;
  const html = `
    <h2>Yeni Toptan Teklif Talebi</h2>
    <p><b>Ad Soyad:</b> ${escapeHtml(record.name)}</p>
    <p><b>Firma:</b> ${escapeHtml(record.company)}</p>
    <p><b>E-posta:</b> ${escapeHtml(record.email)}</p>
    <p><b>Telefon:</b> ${escapeHtml(record.phone)}</p>
    <p><b>İlgilenilen Ürün:</b> ${escapeHtml(record.product)}</p>
    <p><b>Mesaj:</b><br>${escapeHtml(record.message).replace(/\n/g, '<br>')}</p>
    <hr>
    <p style="color:#888;font-size:12px;">Bu e-posta mutlukal.com.tr üzerindeki "Toptan Fiyat & Numune Talebi" formundan otomatik gönderilmiştir.</p>
  `;
  return { subject, html, to: [PAZARLAMA_EMAIL], bcc: [OWNER_EMAIL] };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  // Sadece Supabase'in kendi Database Webhook'u bu paylaşılan anahtarı bilir.
  const expectedSecret = Deno.env.get('WEBHOOK_SECRET');
  const providedSecret = req.headers.get('x-webhook-secret');
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return json({ error: 'Yetkisiz.' }, 401);
  }

  try {
    const payload = await req.json();
    const table = payload.table as string;
    const record = payload.record as Record<string, unknown>;

    if (!record) {
      return json({ error: 'Kayıt bulunamadı.' }, 400);
    }

    let mail: { subject: string; html: string; to: string[]; bcc: string[] } | null = null;
    if (table === 'job_applications') {
      mail = buildJobApplicationEmail(record);
    } else if (table === 'contact_leads') {
      mail = buildContactLeadEmail(record);
    } else {
      return json({ error: `Bilinmeyen tablo: ${table}` }, 400);
    }

    const gmailUser = Deno.env.get('GMAIL_USER')!;
    const gmailPass = Deno.env.get('GMAIL_APP_PASSWORD')!;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `Mutlukal Web Bildirim <${gmailUser}>`,
      to: mail.to.join(', '),
      bcc: mail.bcc.join(', '),
      subject: mail.subject,
      html: mail.html,
    });

    return json({ ok: true });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : 'Beklenmeyen hata.' }, 500);
  }
});
