-- ============================================================================
-- MUTLUKAL WEBSITE — v7: İş Başvurusu / Teklif Talebi E-posta Bildirimleri
-- ============================================================================
-- Bu dosyayı SQL Editor'de çalıştırın. "pg_net" uzantısını kullanarak,
-- job_applications veya contact_leads tablosuna yeni bir satır eklendiğinde
-- "send-lead-notification" Edge Function'ını HTTP isteğiyle tetikleyen iki
-- küçük Postgres fonksiyonu oluşturur. Bu fonksiyonlar, Database > Triggers
-- ekranındaki "Pick a function" listesinde görünecek — trigger'ları bu
-- fonksiyonlara bağlayacaksınız (aşağıda anlatılıyor).
--
-- ÖNCE: Aşağıdaki "WEBHOOK_SECRET_BURAYA" yazan yeri, Edge Function'a
-- Secret olarak eklediğiniz WEBHOOK_SECRET değeriyle değiştirin.
-- ============================================================================

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_job_application()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform net.http_post(
    url := 'https://qfthvflxuifwmfmqqoll.supabase.co/functions/v1/send-lead-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', 'WEBHOOK_SECRET_BURAYA'
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'job_applications',
      'record', to_jsonb(new)
    )
  );
  return new;
end;
$$;

create or replace function public.notify_contact_lead()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform net.http_post(
    url := 'https://qfthvflxuifwmfmqqoll.supabase.co/functions/v1/send-lead-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', 'WEBHOOK_SECRET_BURAYA'
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'contact_leads',
      'record', to_jsonb(new)
    )
  );
  return new;
end;
$$;
