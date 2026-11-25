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


-- 1. HARDENING TABEL 'projects'
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public (anon & authenticated) hanya boleh MEMBACA (SELECT) daftar proyek
CREATE POLICY "Public can view projects" 
ON projects FOR SELECT 
TO anon, authenticated 
USING (true);

-- HANYA ADMIN SPESIFIK (Email admin atau role admin di app_metadata) yang boleh MENAMBAH proyek
CREATE POLICY "Admin can insert projects" 
ON projects FOR INSERT 
TO authenticated 
WITH CHECK (
  (auth.jwt() ->> 'email' = 'belajarmandiri03034@gmail.com')
  OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
);

-- HANYA ADMIN SPESIFIK yang boleh MENGUBAH proyek
CREATE POLICY "Admin can update projects" 
ON projects FOR UPDATE 
TO authenticated 
USING (
  (auth.jwt() ->> 'email' = 'belajarmandiri03034@gmail.com')
  OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
)
WITH CHECK (
  (auth.jwt() ->> 'email' = 'belajarmandiri03034@gmail.com')
  OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
);

-- HANYA ADMIN SPESIFIK yang boleh MENGHAPUS proyek
CREATE POLICY "Admin can delete projects" 
ON projects FOR DELETE 
TO authenticated 
USING (
  (auth.jwt() ->> 'email' = 'belajarmandiri03034@gmail.com')
  OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
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

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_message_length_check;
ALTER TABLE messages ADD CONSTRAINT messages_message_length_check 
  CHECK (char_length(trim(message)) > 0 AND char_length(message) <= 2000);

-- Pengunjung umum (anon) boleh MENGIRIM (INSERT) pesan jika lolos validasi panjang karakter & format
CREATE POLICY "Anyone can insert messages" 
ON messages FOR INSERT 
TO anon, authenticated 
WITH CHECK (
  char_length(trim(name)) > 0 AND char_length(name) <= 100 AND
  char_length(trim(email)) > 0 AND char_length(email) <= 120 AND
  char_length(trim(message)) > 0 AND char_length(message) <= 2000
);

-- HANYA ADMIN SPESIFIK yang boleh MEMBACA pesan masuk (Inbox)
CREATE POLICY "Only admin can view messages" 
ON messages FOR SELECT 
TO authenticated 
USING (
  (auth.jwt() ->> 'email' = 'belajarmandiri03034@gmail.com')
  OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
);

-- HANYA ADMIN SPESIFIK yang boleh MENGHAPUS pesan masuk
CREATE POLICY "Only admin can delete messages" 
ON messages FOR DELETE 
TO authenticated 
USING (
  (auth.jwt() ->> 'email' = 'belajarmandiri03034@gmail.com')
  OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
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

-- Pengunjung (anon & authenticated) boleh MENCATAT insiden (INSERT) saat terdeteksi WAF
DROP POLICY IF EXISTS "Allow anon insert security logs" ON security_logs;
CREATE POLICY "Allow anon insert security logs"
ON security_logs FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- HANYA ADMIN SPESIFIK yang boleh MEMBACA daftar log serangan (SELECT)
DROP POLICY IF EXISTS "Only admin can view security logs" ON security_logs;
CREATE POLICY "Only admin can view security logs"
ON security_logs FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'email' = 'belajarmandiri03034@gmail.com')
  OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
);

-- HANYA ADMIN SPESIFIK yang boleh MENGHAPUS log serangan (DELETE)
DROP POLICY IF EXISTS "Only admin can delete security logs" ON security_logs;
CREATE POLICY "Only admin can delete security logs"
ON security_logs FOR DELETE
TO authenticated
USING (
  (auth.jwt() ->> 'email' = 'belajarmandiri03034@gmail.com')
  OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
);
