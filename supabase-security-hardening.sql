-- ============================================================================
-- SUPABASE ROW-LEVEL SECURITY (RLS) HARDENING SCRIPT
-- Menutup celah pengambilalihan akun & modifikasi database secara ilegal
-- ============================================================================

-- 1. HARDENING TABEL 'projects'
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public hanya boleh MEMBACA (SELECT) daftar proyek
DROP POLICY IF EXISTS "Public can view projects" ON projects;
CREATE POLICY "Public can view projects" 
ON projects FOR SELECT 
TO anon, authenticated 
USING (true);

-- Hanya ADMIN yang sudah login (authenticated) yang boleh MENAMBAH proyek
DROP POLICY IF EXISTS "Admin can insert projects" ON projects;
CREATE POLICY "Admin can insert projects" 
ON projects FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Hanya ADMIN yang boleh MENGUBAH proyek
DROP POLICY IF EXISTS "Admin can update projects" ON projects;
CREATE POLICY "Admin can update projects" 
ON projects FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Hanya ADMIN yang boleh MENGHAPUS proyek
DROP POLICY IF EXISTS "Admin can delete projects" ON projects;
CREATE POLICY "Admin can delete projects" 
ON projects FOR DELETE 
TO authenticated 
USING (true);


-- 2. HARDENING TABEL 'messages'
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Pengunjung umum (anon) hanya boleh MENGIRIM (INSERT) pesan
DROP POLICY IF EXISTS "Anyone can insert messages" ON messages;
CREATE POLICY "Anyone can insert messages" 
ON messages FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- HANYA ADMIN yang sudah login yang boleh MEMBACA pesan masuk (Inbox)
DROP POLICY IF EXISTS "Only admin can view messages" ON messages;
CREATE POLICY "Only admin can view messages" 
ON messages FOR SELECT 
TO authenticated 
USING (true);

-- HANYA ADMIN yang boleh MENGHAPUS pesan masuk
DROP POLICY IF EXISTS "Only admin can delete messages" ON messages;
CREATE POLICY "Only admin can delete messages" 
ON messages FOR DELETE 
TO authenticated 
USING (true);
