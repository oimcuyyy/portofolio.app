-- ============================================================================
-- SUPABASE ROW-LEVEL SECURITY (RLS) & DATABASE HARDENING SCRIPT
-- Menutup celah pengambilalihan akun & modifikasi database secara ilegal
-- ============================================================================

-- 0. BERSIHKAN POLICY LAMA (LEGACY / DUPLIKAT DENGAN NAMA APAPUN)
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


-- 1. HARDENING TABEL 'projects'
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public (anon & authenticated) hanya boleh MEMBACA (SELECT) daftar proyek
CREATE POLICY "Public can view projects" 
ON projects FOR SELECT 
TO anon, authenticated 
USING (true);

-- HANYA ADMIN SPESIFIK (Email admin terverifikasi atau role admin di app_metadata) yang boleh MENAMBAH proyek
CREATE POLICY "Admin can insert projects" 
ON projects FOR INSERT 
TO authenticated 
WITH CHECK (
  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  OR (
    (auth.jwt() ->> 'email' = 'belajarmandiri03034@gmail.com')
    AND ((auth.jwt() ->> 'email_verified')::boolean = true OR (auth.jwt() -> 'user_metadata' ->> 'email_verified')::boolean = true)
  )
);

-- HANYA ADMIN SPESIFIK yang boleh MENGUBAH proyek
CREATE POLICY "Admin can update projects" 
ON projects FOR UPDATE 
TO authenticated 
USING (
  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  OR (
    (auth.jwt() ->> 'email' = 'belajarmandiri03034@gmail.com')
    AND ((auth.jwt() ->> 'email_verified')::boolean = true OR (auth.jwt() -> 'user_metadata' ->> 'email_verified')::boolean = true)
  )
)
WITH CHECK (
  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  OR (
    (auth.jwt() ->> 'email' = 'belajarmandiri03034@gmail.com')
    AND ((auth.jwt() ->> 'email_verified')::boolean = true OR (auth.jwt() -> 'user_metadata' ->> 'email_verified')::boolean = true)
  )
);

-- HANYA ADMIN SPESIFIK yang boleh MENGHAPUS proyek
CREATE POLICY "Admin can delete projects" 
ON projects FOR DELETE 
TO authenticated 
USING (
  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  OR (
    (auth.jwt() ->> 'email' = 'belajarmandiri03034@gmail.com')
    AND ((auth.jwt() ->> 'email_verified')::boolean = true OR (auth.jwt() -> 'user_metadata' ->> 'email_verified')::boolean = true)
  )
);


-- 2. HARDENING TABEL 'messages'
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Database-Level CHECK Constraints untuk mencegah bypass langsung via REST API
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_name_length_check;
ALTER TABLE messages ADD CONSTRAINT messages_name_length_check 
  CHECK (char_length(trim(name)) > 0 AND char_length(name) <= 100);

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_email_format_check;
ALTER TABLE messages ADD CONSTRAINT messages_email_format_check 
  CHECK (char_length(trim(email)) > 0 AND char_length(email) <= 120 AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_real_email_domain_check;
ALTER TABLE messages ADD CONSTRAINT messages_real_email_domain_check
  CHECK (
    NOT (email ~* '@(mailinator\.com|tempmail\.com|temp-mail\.org|temp-mail\.io|guerrillamail\.com|guerrillamail\.org|yopmail\.com|10minutemail\.com|trashmail\.com|throwawaymail\.com|getnada\.com|maildrop\.cc|dispostable\.com|sharklasers\.com|fakeinbox\.com|mohmal\.com|example\.com|example\.org|example\.net|test\.com|test\.org|fake\.com|palsu\.com|domain\.com|invalid\.com|localhost)$')
    AND NOT (email ~* '\.(local|localhost|test|invalid|example)$')
  );

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_message_length_check;
ALTER TABLE messages ADD CONSTRAINT messages_message_length_check 
  CHECK (char_length(trim(message)) > 0 AND char_length(message) <= 2000);

-- Pengunjung umum (anon) boleh MENGIRIM (INSERT) pesan jika lolos validasi panjang karakter, format & domain non-disposable
CREATE POLICY "Anyone can insert messages" 
ON messages FOR INSERT 
TO anon, authenticated 
WITH CHECK (
  char_length(trim(name)) > 0 AND char_length(name) <= 100 AND
  char_length(trim(email)) > 0 AND char_length(email) <= 120 AND
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
  NOT (email ~* '@(mailinator\.com|tempmail\.com|temp-mail\.org|temp-mail\.io|guerrillamail\.com|guerrillamail\.org|yopmail\.com|10minutemail\.com|trashmail\.com|throwawaymail\.com|getnada\.com|maildrop\.cc|dispostable\.com|sharklasers\.com|fakeinbox\.com|mohmal\.com|example\.com|example\.org|example\.net|test\.com|test\.org|fake\.com|palsu\.com|domain\.com|invalid\.com|localhost)$') AND
  char_length(trim(message)) > 0 AND char_length(message) <= 2000
);

-- HANYA ADMIN SPESIFIK yang boleh MEMBACA pesan masuk (Inbox)
CREATE POLICY "Only admin can view messages" 
ON messages FOR SELECT 
TO authenticated 
USING (
  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  OR (
    (auth.jwt() ->> 'email' = 'belajarmandiri03034@gmail.com')
    AND ((auth.jwt() ->> 'email_verified')::boolean = true OR (auth.jwt() -> 'user_metadata' ->> 'email_verified')::boolean = true)
  )
);

-- HANYA ADMIN SPESIFIK yang boleh MENGHAPUS pesan masuk
CREATE POLICY "Only admin can delete messages" 
ON messages FOR DELETE 
TO authenticated 
USING (
  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  OR (
    (auth.jwt() ->> 'email' = 'belajarmandiri03034@gmail.com')
    AND ((auth.jwt() ->> 'email_verified')::boolean = true OR (auth.jwt() -> 'user_metadata' ->> 'email_verified')::boolean = true)
  )
);


-- 3. TABEL 'security_logs' (AUDIT TRAIL INTRUSION DETECTION SYSTEM)
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

-- Database-Level CHECK Constraints untuk mencegah flooding / payload berukuran raksasa pada security_logs
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

-- Pengunjung (anon & authenticated) boleh MENCATAT insiden (INSERT) dengan batasan panjang karakter ketat
CREATE POLICY "Allow anon insert security logs"
ON security_logs FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(trim(incident_id)) > 0 AND char_length(incident_id) <= 40 AND
  char_length(trim(threat_type)) > 0 AND char_length(threat_type) <= 50 AND
  (field_name IS NULL OR char_length(field_name) <= 60) AND
  (client_ip IS NULL OR char_length(client_ip) <= 64) AND
  (user_agent IS NULL OR char_length(user_agent) <= 500) AND
  (payload_preview IS NULL OR char_length(payload_preview) <= 500)
);

-- HANYA ADMIN SPESIFIK yang boleh MEMBACA daftar log serangan (SELECT)
CREATE POLICY "Only admin can view security logs"
ON security_logs FOR SELECT
TO authenticated
USING (
  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  OR (
    (auth.jwt() ->> 'email' = 'belajarmandiri03034@gmail.com')
    AND ((auth.jwt() ->> 'email_verified')::boolean = true OR (auth.jwt() -> 'user_metadata' ->> 'email_verified')::boolean = true)
  )
);

-- HANYA ADMIN SPESIFIK yang boleh MENGHAPUS log serangan (DELETE)
CREATE POLICY "Only admin can delete security logs"
ON security_logs FOR DELETE
TO authenticated
USING (
  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  OR (
    (auth.jwt() ->> 'email' = 'belajarmandiri03034@gmail.com')
    AND ((auth.jwt() ->> 'email_verified')::boolean = true OR (auth.jwt() -> 'user_metadata' ->> 'email_verified')::boolean = true)
  )
);


-- ============================================================================
-- 4. SERVER-SIDE RATE LIMITING & ANTI-SPOOF TRIGGERS (POSTGRESQL LEVEL)
-- Mencegah bypass REST API langsung via PostgREST / cURL / skrip bot
-- Memakai SET search_path = public, pg_temp untuk kepatuhan Security Advisor
-- ============================================================================

-- A. Rate Limiting (Per-Email & Global Anti-Rotation) + Timestamp Anti-Spoofing untuk Tabel 'messages'
CREATE OR REPLACE FUNCTION trg_rate_limit_messages()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  recent_email_count INTEGER;
  global_count INTEGER;
BEGIN
  -- Paksa timestamp created_at selalu waktu server PostgreSQL (mencegah pemalsuan waktu oleh client)
  NEW.created_at := NOW();

  -- 1. Batas per-email: maksimal 3 pesan dalam 5 menit
  SELECT COUNT(*) INTO recent_email_count
  FROM public.messages
  WHERE LOWER(TRIM(email)) = LOWER(TRIM(NEW.email))
    AND created_at > (NOW() - INTERVAL '5 minutes');

  IF recent_email_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Terlalu banyak pesan dari email ini. Coba lagi dalam 5 menit.'
      USING ERRCODE = '23514'; -- check_violation
  END IF;

  -- 2. Batas global: maksimal 20 pesan dalam 5 menit (mencegah bot bypass dengan rotasi email acak)
  SELECT COUNT(*) INTO global_count
  FROM public.messages
  WHERE created_at > (NOW() - INTERVAL '5 minutes');

  IF global_count >= 20 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Sistem sedang sibuk menerima pesan. Coba lagi dalam beberapa menit.'
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


-- B. Rate Limiting & Anti-Flood untuk Tabel 'security_logs'
CREATE OR REPLACE FUNCTION trg_rate_limit_security_logs()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  ip_count INTEGER;
  global_count INTEGER;
BEGIN
  -- Paksa timestamp created_at selalu waktu server PostgreSQL
  NEW.created_at := NOW();

  -- Batasi flood per IP spesifik (maksimal 10 log insiden per menit dari 1 IP)
  IF NEW.client_ip IS NOT NULL 
     AND TRIM(NEW.client_ip) <> '' 
     AND NEW.client_ip NOT IN ('Unavailable', 'Unknown (Proxy/Shielded)', 'Detecting...') THEN
    SELECT COUNT(*) INTO ip_count
    FROM public.security_logs
    WHERE client_ip = NEW.client_ip
      AND created_at > (NOW() - INTERVAL '1 minute');

    IF ip_count >= 10 THEN
      RAISE EXCEPTION 'Rate limit exceeded: Terlalu banyak log dari IP ini.'
        USING ERRCODE = '23514';
    END IF;
  END IF;

  -- Batasi total insiden global (maksimal 30 log per menit ke database untuk cegah storage exhaustion)
  SELECT COUNT(*) INTO global_count
  FROM public.security_logs
  WHERE created_at > (NOW() - INTERVAL '1 minute');

  IF global_count >= 30 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Global security log capacity reached.'
      USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_security_logs_rate_limit ON public.security_logs;
CREATE TRIGGER trg_enforce_security_logs_rate_limit
BEFORE INSERT ON public.security_logs
FOR EACH ROW
EXECUTE FUNCTION public.trg_rate_limit_security_logs();

