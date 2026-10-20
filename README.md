<div align="center">

# Muhammad Rochimuloh — Personal Portfolio
### `rochim.dev` • Full-Stack Developer & Software Engineering Student

Sebuah website portofolio modern yang dirancang dengan estetika editorial premium, navigasi floating dock bergaya macOS, dukungan bilingual dinamis (ID/EN), interaksi haptic & partikel kanvas, serta integrasi backend berbasis Supabase untuk pengelolaan data proyek dan formulir kontak secara real-time.

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Website-10B981?style=for-the-badge&logo=vercel&logoColor=white)](https://portofolio-app-fawn.vercel.app/)
[![React 19](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[**Lihat Website Live**](https://portofolio-app-fawn.vercel.app/) • [**Fitur Utama**](#fitur-utama) • [**Tech Stack**](#teknologi-yang-digunakan) • [**Struktur Direktori**](#struktur-direktori-proyek) • [**Kontak**](#kontak--sosial-media)

</div>

---

## Sekilas Tentang Proyek

Website ini adalah representasi digital dan portofolio resmi milik **Muhammad Rochimuloh**, siswa kejuruan Rekayasa Perangkat Lunak (RPL) di **SMKN 20 Jakarta**. Dirancang khusus untuk memamerkan keahlian teknis dalam rekayasa perangkat lunak, kurasi karya digital, perjalanan edukasi vokasi, serta penawaran layanan profesional pengembangan web.

Dibangun dengan arsitektur frontend mutakhir berbasis **React 19**, **TypeScript**, dan **Tailwind CSS v4**, aplikasi ini mengedepankan performa tinggi, animasi mikro haptic, pengalaman pengguna responsif di semua perangkat, serta sistem manajemen konten dinamis melalui **Supabase**.

### Tautan Langsung (Live URL)
[https://portofolio-app-fawn.vercel.app/](https://portofolio-app-fawn.vercel.app/)

---

## Fitur Utama

- **Dukungan Bilingual Dinamis (ID / EN)**:
  - Language Context switcher instan antara Bahasa Indonesia dan English langsung dari navigation dock.
  - Seluruh teks antarmuka (navigasi, headline, deskripsi, modal proyek, form kontak, hingga footer) bertransisi seketika tanpa reload halaman.
- **Floating Left Dock & Glass Drawer Navigation**:
  - Navigasi melayang modern bergaya dock macOS di sisi kiri layar dengan quick indicator, tombol toggle tema (Dark/Light Mode), dan pemilih bahasa (ID/EN).
  - Glassmorphic drawer interaktif lengkap dengan avatar profil, status ketersediaan kerja (*Available for work*), lokasi (Jakarta, ID), dan tautan media sosial.
- **Desain Editorial & Haptic Experience**:
  - Tema ganda (Dark Mode & Light Mode) dengan persistensi preferensi di `localStorage`.
  - Latar belakang interaktif berbasis Canvas Particle Network yang merespons pergerakan kursor.
  - Kartu interaktif Spotlight Cards, custom glow cursor, dan transisi elemen menggunakan Framer Motion & AOS (Animate on Scroll).
- **Showcase Proyek Terkurasi (Bento Grid)**:
  - Tampilan grid responsif bento-style dengan simulasi *browser top-bar window*.
  - Modal detail proyek interaktif dengan gambar pratinjau, deskripsi lengkap, tech stack badges, tautan repositori GitHub, serta demo live.
- **Koleksi Tech Stack Autentik (Brand Icons)**:
  - Logo merek resmi menggunakan Tabler Icons (`@tabler/icons-react`) & React Icons (React, Next.js, TypeScript, Tailwind CSS, PHP, Laravel, Supabase, PostgreSQL, MySQL, Docker, Git, Figma, dll.).
  - Kategorisasi terstruktur (Frontend, Backend, Database, Language, Tools) disertai tingkat keahlian (*Proficiency Level*).
- **Riwayat Pendidikan & Vokasi (Experience)**:
  - Timeline edukasi vokasi di SMKN 20 Jakarta (Konsentrasi Rekayasa Perangkat Lunak) beserta fokus pembelajaran.
- **Penawaran Layanan (Services)**:
  - Kartu layanan pengembangan: Frontend Architecture, Full-Stack System, dan API & Database Design.
- **Formulir Kontak Real-Time & Perlindungan Anti-Spam**:
  - Terhubung langsung ke tabel database Supabase tanpa perlu server backend terpisah.
  - Proteksi anti-spam cooldown 20 detik, sanitasi input terhadap XSS, validasi format email regex, dan fitur Quick Copy Email dengan notifikasi visual.
- **Admin Management & Secret Shortcut (`Ctrl + Shift + L`)**:
  - Shortcut tersembunyi `Ctrl + Shift + L` untuk membuka modal login admin.
  - Autentikasi aman melalui Supabase Auth dengan proteksi brute-force lockout dan pembersihan state password otomatis.
  - Akses manajemen untuk menambah proyek baru secara dinamis dan membaca pesan masuk (Admin Inbox) secara real-time.
- **SEO & Structured Data**:
  - Meta tags Open Graph, Twitter Cards, Google Site Verification, sitemap XML, robots.txt, dan JSON-LD Schema (`Person` & `WebSite`) untuk indeks mesin pencari yang optimal.

---

## Teknologi yang Digunakan

| Kategori | Teknologi | Deskripsi |
|---|---|---|
| **Core & UI** | [React 19](https://react.dev/) | Library antarmuka komponen modern |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Type-safety untuk keandalan dan skalabilitas kode |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Framework utilitas CSS generasi terbaru dengan `@tailwindcss/vite` |
| **Build Tool** | [Vite 8](https://vitejs.dev/) | Bundler modern super cepat |
| **BaaS / Backend** | [Supabase](https://supabase.com/) | PostgreSQL, Realtime, Storage, & Supabase Auth |
| **Animasi & Motion** | [Framer Motion](https://www.framer.com/motion/), [AOS](https://michalsnik.github.io/aos/) | Micro-interactions dan transisi scroll halus |
| **Ikonografi** | [Tabler Icons](https://tabler.io/icons), [Lucide React](https://lucide.dev/) | Ikon brand teknologi resmi dan UI icons |
| **Tipografi** | Plus Jakarta Sans, Inter, JetBrains Mono | Tipografi modern & editorial |
| **Linter** | [Oxlint](https://oxc.rs/) | Linter performa tinggi |
| **Deployment** | [Vercel](https://vercel.com/) | Hosting edge network global |

---

## Struktur Direktori Proyek

```text
portofolio-app/
├── public/                     # Aset statis publik (favicon, logo.svg, sitemap.xml, robots.txt)
├── src/
│   ├── assets/                 # Aset internal (foto profil)
│   ├── components/             # Komponen UI modular
│   │   ├── AdminInbox.tsx      # Komponen inbox pesan masuk admin
│   │   ├── Contact.tsx         # Formulir kontak real-time & anti-spam
│   │   ├── Experience.tsx      # Timeline pendidikan vokasi SMKN 20 Jakarta
│   │   ├── Footer.tsx          # Navigasi bawah, kredit, & tautan sosmed
│   │   ├── Hero.tsx            # Headline utama, bio, status ketersediaan & CTA
│   │   ├── Interactive.tsx     # SpotlightCard, CustomCursor, dll.
│   │   ├── Navbar.tsx          # Floating Left Dock & Drawer interaktif
│   │   ├── ParticleNetwork.tsx # Animasi canvas partikel interaktif
│   │   ├── Projects.tsx        # Bento Grid & modal detail proyek
│   │   ├── Services.tsx        # Penawaran layanan web development
│   │   └── TechStack.tsx       # Tech stack dengan authentic brand icons
│   ├── context/
│   │   └── LanguageContext.tsx # Context bilingual (ID/EN) switcher & kamus terjemahan
│   ├── lib/
│   │   └── supabase.ts         # Inisialisasi Supabase client
│   ├── types/
│   │   └── index.ts            # Definisi interface TypeScript (Project, Skill, Message)
│   ├── App.css                 # Styling tambahan
│   ├── App.tsx                 # State orchestration, keyboard shortcut & data handler
│   ├── index.css               # Styling dasar, font variables & Tailwind CSS v4
│   └── main.tsx                # Entry point aplikasi React
├── index.html                  # HTML shell & SEO JSON-LD schema
├── package.json                # Daftar dependensi & npm scripts
├── tsconfig.json               # Konfigurasi TypeScript
└── vite.config.ts              # Konfigurasi bundler Vite
```

---

## Fitur Admin & Keamanan

Portofolio ini dilengkapi dengan panel administrasi tersembunyi untuk mengelola konten secara aman:

- **Membuka Modal Login Admin**: Tekan kombinasi keyboard `Ctrl + Shift + L` di halaman web.
- **Autentikasi Aman**: Terhubung langsung dengan Supabase Auth melalui koneksi terenkripsi (HTTPS/TLS).
- **Proteksi Brute-Force**: Dilengkapi dengan pembatasan percobaan login (lockout cooldown 30 detik setelah 5 kali gagal) untuk mencegah serangan kamus atau brute-force.
- **Pembersihan Kredensial Otomatis**: Input password dan email langsung di-reset dan dibersihkan saat modal ditutup atau saat login gagal/berhasil.
- **Sanitasi Data**: Semua masukan penambahan proyek disanitasi terhadap potensi XSS sebelum dikirimkan ke database.
- **Fitur Khusus**:
  - Penambahan proyek baru langsung ke database Supabase.
  - Akses ke Admin Inbox untuk membaca pesan masuk secara real-time.

---

## Kontak & Sosial Media

- **Nama**: Muhammad Rochimuloh
- **Institusi**: Siswa Rekayasa Perangkat Lunak (RPL), **SMKN 20 Jakarta**
- **Email**: [belajarmandiri03034@gmail.com](mailto:belajarmandiri03034@gmail.com)
- **GitHub**: [@oimcuyyy](https://github.com/oimcuyyy)
- **Instagram**: [@lunarxoim](https://www.instagram.com/lunarxoim/)
- **Website Resmi**: [portofolio-app-fawn.vercel.app](https://portofolio-app-fawn.vercel.app/)

---

<div align="center">
  <sub>Dibuat dengan dedikasi oleh <b>Muhammad Rochimuloh</b>. Dilindungi lisensi MIT.</sub>
</div>
