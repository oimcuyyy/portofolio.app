<div align="center">

# 🌐 Muhammad Rochimuloh — Personal Portfolio

**Full-Stack Developer & Software Engineering Student at SMKN 20 Jakarta**

Sebuah website portofolio modern yang dirancang dengan estetika editorial premium, interaksi mikro dinamis, serta integrasi backend berbasis Supabase untuk pengelolaan data proyek dan pesan kontak secara real-time.

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Website-10B981?style=for-the-badge&logo=vercel&logoColor=white)](https://portofolio-app-fawn.vercel.app/)
[![React 19](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 📌 Sekilas Tentang Proyek

Website ini dibangun untuk memamerkan perjalanan keahlian rekayasa perangkat lunak, kurasi karya/proyek digital, serta layanan pengembangan web. Dibuat dengan arsitektur frontend modern yang cepat, berbobot visual tinggi, dan responsif di berbagai perangkat.

### 🔗 Live Preview
👉 **[portofolio-app-fawn.vercel.app](https://portofolio-app-fawn.vercel.app/)**

---

## ✨ Fitur Utama

- 🎨 **Desain Editorial & Haptic Experience**:
  - Tema ganda (**Dark Mode & Light Mode**) dengan transisi halus.
  - Latar belakang interaktif berbasis **Canvas Particle Network**.
  - Efek hover **Spotlight Cards**, custom glow cursor, dan transisi elemen menggunakan **Framer Motion** & **AOS**.
- 💼 **Showcase Proyek Terkurasi (Bento Grid)**:
  - Tampilan grid responsif untuk setiap karya digital.
  - Modal detail proyek lengkap dengan deskripsi, teknologi yang dipakai, tautan repositori GitHub, serta demo langsung.
- 🛠️ **Peta Keahlian (Tech Stack & Services)**:
  - Kategorisasi terstruktur (Frontend, Backend, Database, Language, Tools) disertai tingkat keahlian (*Proficiency Level*).
- 📩 **Formulir Kontak Real-Time**:
  - Formulir pengiriman pesan yang terhubung langsung dengan tabel database Supabase tanpa perlu server backend terpisah.
- 🔐 **Admin Management & Secret Shortcut**:
  - Akses modal login admin tersembunyi menggunakan kombinasi tombol keyboard: `Ctrl + Shift + L`.
  - Autentikasi aman melalui **Supabase Auth**.
  - Fitur admin: Tambah proyek baru secara dinamis dan melihat **Admin Inbox** (pesan masuk dari formulir kontak).
- 🔍 **SEO & Structured Data Teroptimasi**:
  - Meta tags Open Graph, Twitter Cards, dan **JSON-LD Schema (`Person` & `WebSite`)** untuk indeks Googlebot yang optimal.

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
|---|---|
| **Core & Framework** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 8](https://vitejs.dev/) |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/), `@tailwindcss/vite`, CSS Variables |
| **Animasi & Interaktivitas** | [Framer Motion](https://www.framer.com/motion/), [AOS (Animate on Scroll)](https://michalsnik.github.io/aos/) |
| **Backend / BaaS** | [Supabase](https://supabase.com/) (PostgreSQL, Realtime, Auth, Storage) |
| **Ikonografi & Tipografi** | [Lucide React](https://lucide.dev/), Plus Jakarta Sans, JetBrains Mono |
| **Linter** | [Oxlint](https://oxc.rs/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Struktur Direktori

```text
portofolio-app/
├── public/                 # Asset statis, favicon, logo
├── src/
│   ├── assets/             # Asset gambar & foto profil (profile.jpg)
│   ├── components/         # Komponen UI modular
│   │   ├── AdminInbox.tsx      # Komponen inbox pesan masuk admin
│   │   ├── Contact.tsx         # Formulir kontak & integrasi pesan
│   │   ├── Experience.tsx      # Timeline pendidikan vokasi & riwayat belajar
│   │   ├── Footer.tsx          # Navigasi bawah, kredit, & sosmed
│   │   ├── Hero.tsx            # Headline utama, bio, status ketersediaan & CTA
│   │   ├── Interactive.tsx     # SpotlightCard, CustomCursor, dll.
│   │   ├── Navbar.tsx          # Navigasi sticky responsif & theme toggle
│   │   ├── ParticleNetwork.tsx # Animasi canvas partikel interaktif
│   │   ├── Projects.tsx        # Grid & modal showcase proyek
│   │   ├── Services.tsx        # Penawaran layanan web development
│   │   └── TechStack.tsx       # Daftar keahlian teknis & kategori
│   ├── lib/
│   │   └── supabase.ts     # Inisialisasi Supabase client
│   ├── types/              # Definisi interface TypeScript (Project, Skill, dll)
│   ├── App.tsx             # State orchestration, auth listener & shortcuts
│   ├── index.css           # Styling dasar, font import & tailwind
│   └── main.tsx            # Entry point aplikasi
├── .env.local              # Konfigurasi environment variables (Supabase)
├── index.html              # HTML shell & SEO JSON-LD schema
├── package.json            # Daftar dependensi & scripts
└── vite.config.ts          # Konfigurasi bundler Vite
```

---

## 🚀 Memulai Proyek Secara Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek di komputer lokal:

### 1. Clone Repositori
```bash
git clone https://github.com/oimcuyyy/portofolio.app.git
cd portofolio.app
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env.local` di root direktori dan masukkan kredensial Supabase Anda:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Skema Database Supabase (Opsional)
Pastikan Anda memiliki tabel-tabel berikut di Supabase:
- **`projects`**:
  - `id` (uuid / int, primary key)
  - `title` (text)
  - `description` (text)
  - `image_url` (text)
  - `tech_stack` (text / array)
  - `github_url` (text)
  - `demo_url` (text)
  - `created_at` (timestamp)
- **`messages`**:
  - `id` (uuid / int, primary key)
  - `name` (text)
  - `email` (text)
  - `message` (text)
  - `created_at` (timestamp)

### 5. Jalankan Local Dev Server
```bash
npm run dev
```
Buka browser di `http://localhost:5173` untuk melihat hasilnya.

### 6. Build untuk Produksi
```bash
npm run build
```

---

## 🔑 Fitur Admin & Rahasia

- **Membuka Panel Login Admin**: Tekan kombinasi tombol `Ctrl + Shift + L` di halaman web.
- Masukkan kredensial email & password admin yang telah didaftarkan di Supabase Auth untuk mengakses manajemen penambahan proyek dan membaca pesan masuk.

---

## 📬 Kontak & Sosial Media

- **Nama**: Muhammad Rochimuloh
- **Institusi**: Siswa Rekayasa Perangkat Lunak (RPL), SMKN 20 Jakarta
- **Email**: [belajarmandiri03034@gmail.com](mailto:belajarmandiri03034@gmail.com)
- **GitHub**: [@oimcuyyy](https://github.com/oimcuyyy)
- **Instagram**: [@lunarxoim](https://www.instagram.com/lunarxoim/)
- **Website**: [portofolio-app-fawn.vercel.app](https://portofolio-app-fawn.vercel.app/)

---

<div align="center">
  <sub>Dibuat dengan ❤️ & dedikasi oleh <b>Muhammad Rochimuloh</b>. Dilindungi lisensi MIT.</sub>
</div>
