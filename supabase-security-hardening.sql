-- ============================================================================
-- SUPABASE ROW-LEVEL SECURITY (RLS) & DATABASE HARDENING SCRIPT
-- Menutup celah privilege escalation (user_metadata), anon flooding, & log forgery
-- ============================================================================

-- 0. BERSIHKAN POLICY LAMA (LEGACY / DUPLIKAT)
DROP POLICY IF EXISTS "Public can view projects" ON projects;
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
DROP POLICY IF EXISTS "Allow all" ON projects;
DROP POLICY IF EXISTS "Admin can insert projects" ON projects;
DROP POLICY IF EXISTS "Admin can update projects" ON projects;
DROP POLICY IF EXISTS "Admin can delete projects" ON projects;

DROP POLICY IF EXISTS "Anyone can insert messages" ON messages;
DROP POLICY IF EXISTS "Enable insert for all users" ON messages;
DROP POLICY IF EXISTS "Allow insert" ON messages;
DROP POLICY IF EXISTS "Only admin can view messages" ON messages;
DROP POLICY IF EXISTS "Only admin can delete messages" ON messages;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON messages;

DROP POLICY IF EXISTS "Allow anon insert security logs" ON security_logs;
DROP POLICY IF EXISTS "Only admin can view security logs" ON security_logs;
DROP POLICY IF EXISTS "Only admin can delete security logs" ON security_logs;


-- 0.5. HELPER OTORISASI ADMIN OTORITATIF (BEBAS DARI user_metadata)
-- Mengunci search_path ke public, auth, pg_temp dan memverifikasi:
-- 1) app_metadata.role = 'admin' (hanya bisa diset oleh service_role), ATAU
-- 2) auth.users.email_confirmed_at IS NOT NULL (status verifikasi resmi di tabel auth.users)
CREATE OR REPLACE FUNCTION public.is_verified_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
  SELECT (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
    OR EXISTS (
      SELECT 1
      FROM auth.users u
      WHERE u.id = auth.uid()
        AND LOWER(u.email) = 'belajarmandiri03034@gmail.com'
        AND u.email_confirmed_at IS NOT NULL
    )
  );
$$;

REVOKE ALL ON FUNCTION public.is_verified_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_verified_admin() TO authenticated;


-- 1. HARDENING TABEL 'projects'
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public (anon & authenticated) hanya boleh MEMBACA (SELECT) daftar proyek
CREATE POLICY "Public can view projects" 
ON projects FOR SELECT 
TO anon, authenticated 
USING (true);

-- HANYA ADMIN TERVERIFIKASI yang boleh MENAMBAH / MENGUBAH / MENGHAPUS proyek
CREATE POLICY "Admin can insert projects" 
ON projects FOR INSERT 
TO authenticated 
WITH CHECK (public.is_verified_admin());

CREATE POLICY "Admin can update projects" 
ON projects FOR UPDATE 
TO authenticated 
USING (public.is_verified_admin())
WITH CHECK (public.is_verified_admin());

CREATE POLICY "Admin can delete projects" 
ON projects FOR DELETE 
TO authenticated 
USING (public.is_verified_admin());


-- 2. HARDENING TABEL 'messages'
-- Pengiriman pesan publik kini melalui Vercel Serverless Function (/api/contact)
-- menggunakan SUPABASE_SERVICE_ROLE_KEY setelah validasi WAF, disposable, & MX DNS.
-- Oleh karena itu, INSERT langsung dari browser (anon) dicabut total.
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Database-Level CHECK Constraints (Defense-in-Depth)
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_name_length_check;
ALTER TABLE messages ADD CONSTRAINT messages_name_length_check 
  CHECK (char_length(trim(name)) > 0 AND char_length(name) <= 100);

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_email_format_check;
ALTER TABLE messages ADD CONSTRAINT messages_email_format_check 
  CHECK (char_length(trim(email)) > 0 AND char_length(email) <= 120 AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_real_email_domain_check;
ALTER TABLE messages ADD CONSTRAINT messages_real_email_domain_check
  CHECK (
    NOT (email ~* '@(mailinator\.com|tempmail\.com|temp-mail\.org|temp-mail\.io|guerrillamail\.com|guerrillamail\.org|guerrillamail\.net|guerrillamail\.biz|guerrillamail\.de|sharklasers\.com|grr\.la|yopmail\.com|yopmail\.fr|yopmail\.net|10minutemail\.com|10minutemail\.net|10minmail\.com|trashmail\.com|trashmail\.net|throwawaymail\.com|getnada\.com|nada\.email|maildrop\.cc|dispostable\.com|mohmal\.com|emailondeck\.com|burnermail\.io|fakemailgenerator\.com|fakeinbox\.com|mailnesia\.com|mintemail\.com|mytemp\.email|tempinbox\.com|harakirimail\.com|discard\.email|spamgourmet\.com|mailcatch\.com|inboxbear\.com|dropmail\.me|moakt\.com|crazymailing\.com|mailsac\.com|tempr\.email|mailtemp\.net|wegwerfmail\.de|example\.com|example\.org|example\.net|test\.com|test\.org|test\.net|fake\.com|palsu\.com|domain\.com|email\.com|invalid\.com|localhost|asd\.com|abc\.com|xyz\.xyz)$')
    AND NOT (email ~* '\.(local|localhost|test|invalid|example|internal|arpa|onion)$')
  );

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_message_length_check;
ALTER TABLE messages ADD CONSTRAINT messages_message_length_check 
  CHECK (char_length(trim(message)) > 0 AND char_length(message) <= 2000);

-- HANYA ADMIN TERVERIFIKASI yang boleh MEMBACA & MENGHAPUS pesan masuk (Inbox)
CREATE POLICY "Only admin can view messages" 
ON messages FOR SELECT 
TO authenticated 
USING (public.is_verified_admin());

CREATE POLICY "Only admin can delete messages" 
ON messages FOR DELETE 
TO authenticated 
USING (public.is_verified_admin());


-- 3. TABEL 'security_logs' (AUDIT TRAIL INTRUSION DETECTION SYSTEM)
-- Pencatatan insiden hanya melalui server endpoint (/api/security-log atau /api/contact)
-- menggunakan service_role dengan IP asli dari header server.
-- INSERT langsung dari anon dicabut total untuk menutup celah log forgery & DoS.
CREATE TABLE IF NOT EXISTS security_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  incident_id TEXT NOT NULL,
  threat_type TEXT NOT NULL,
  field_name TEXT,
  client_ip TEXT,
  user_agent TEXT,
  payload_preview TEXT
);

ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- Database-Level CHECK Constraints (Defense-in-Depth)
ALTER TABLE security_logs DROP CONSTRAINT IF EXISTS security_logs_incident_id_check;
ALTER TABLE security_logs ADD CONSTRAINT security_logs_incident_id_check
  CHECK (char_length(trim(incident_id)) > 0 AND char_length(incident_id) <= 40);

ALTER TABLE security_logs DROP CONSTRAINT IF EXISTS security_logs_threat_type_check;
ALTER TABLE security_logs ADD CONSTRAINT security_logs_threat_type_check
  CHECK (char_length(trim(threat_type)) > 0 AND char_length(threat_type) <= 50);

ALTER TABLE security_logs DROP CONSTRAINT IF EXISTS security_logs_field_name_check;
ALTER TABLE security_logs ADD CONSTRAINT security_logs_field_name_check
  CHECK (field_name IS NULL OR char_length(field_name) <= 60);

ALTER TABLE security_logs DROP CONSTRAINT IF EXISTS security_logs_client_ip_check;
ALTER TABLE security_logs ADD CONSTRAINT security_logs_client_ip_check
  CHECK (client_ip IS NULL OR char_length(client_ip) <= 64);

ALTER TABLE security_logs DROP CONSTRAINT IF EXISTS security_logs_user_agent_check;
ALTER TABLE security_logs ADD CONSTRAINT security_logs_user_agent_check
  CHECK (user_agent IS NULL OR char_length(user_agent) <= 500);

ALTER TABLE security_logs DROP CONSTRAINT IF EXISTS security_logs_payload_check;
ALTER TABLE security_logs ADD CONSTRAINT security_logs_payload_check
  CHECK (payload_preview IS NULL OR char_length(payload_preview) <= 500);

-- HANYA ADMIN TERVERIFIKASI yang boleh MEMBACA & MENGHAPUS daftar log serangan
CREATE POLICY "Only admin can view security logs"
ON security_logs FOR SELECT
TO authenticated
USING (public.is_verified_admin());

CREATE POLICY "Only admin can delete security logs"
ON security_logs FOR DELETE
TO authenticated
USING (public.is_verified_admin());


-- ============================================================================
-- 4. POSTGRESQL TRIGGER HARDENING (ANTI-TIMESTAMP SPOOFING & PER-EMAIL GUARD)
-- Memakai SET search_path = public, pg_temp untuk kepatuhan Security Advisor.
-- Catatan: Batas global cross-user dihapus agar penyerang tidak bisa me-lockout
-- seluruh pengunjung lain (global DoS); rate limit per-IP berjalan di server API.
-- ============================================================================

-- A. Anti-Timestamp Spoofing & Per-Email Throttle untuk Tabel 'messages'
CREATE OR REPLACE FUNCTION public.trg_rate_limit_messages()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  recent_email_count INTEGER;
BEGIN
  -- Paksa timestamp created_at selalu waktu server PostgreSQL
  NEW.created_at := NOW();

  -- Batas per-email: maksimal 3 pesan dalam 5 menit
  SELECT COUNT(*) INTO recent_email_count
  FROM public.messages
  WHERE LOWER(TRIM(email)) = LOWER(TRIM(NEW.email))
    AND created_at > (NOW() - INTERVAL '5 minutes');

  IF recent_email_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Terlalu banyak pesan dari email ini. Coba lagi dalam 5 menit.'
      USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_message_rate_limit ON public.messages;
CREATE TRIGGER trg_enforce_message_rate_limit
BEFORE INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.trg_rate_limit_messages();


-- B. Anti-Timestamp Spoofing & Per-IP Guard untuk Tabel 'security_logs'
CREATE OR REPLACE FUNCTION public.trg_rate_limit_security_logs()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  ip_count INTEGER;
BEGIN
  -- Paksa timestamp created_at selalu waktu server PostgreSQL
  NEW.created_at := NOW();

  -- Batas flood per IP spesifik (maksimal 10 log insiden per menit dari 1 IP)
  IF NEW.client_ip IS NOT NULL AND TRIM(NEW.client_ip) <> '' THEN
    SELECT COUNT(*) INTO ip_count
    FROM public.security_logs
    WHERE client_ip = NEW.client_ip
      AND created_at > (NOW() - INTERVAL '1 minute');

    IF ip_count >= 10 THEN
      RAISE EXCEPTION 'Rate limit exceeded: Terlalu banyak log dari IP ini.'
        USING ERRCODE = '23514';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_security_logs_rate_limit ON public.security_logs;
CREATE TRIGGER trg_enforce_security_logs_rate_limit
BEFORE INSERT ON public.security_logs
FOR EACH ROW
EXECUTE FUNCTION public.trg_rate_limit_security_logs();


-- ============================================================================
-- VERIFIKASI MANUAL DI SUPABASE SQL EDITOR (Jalankan query di bawah jika perlu):
-- SELECT tablename, policyname, cmd, roles FROM pg_policies WHERE schemaname = 'public';
-- Pastikan TIDAK ADA policy INSERT untuk role anon/public pada messages atau security_logs,
-- dan pastikan tidak ada policy lama dengan nama berbeda.
-- ============================================================================
