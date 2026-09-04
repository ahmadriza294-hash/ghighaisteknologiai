# Ghighais Dashboard Pro

Buatkan sebuah landing page SaaS interaktif berstandar internasional untuk "Ghighais Teknologi" (badan usaha pengembang aplikasi yang berdiri sejak 2022, melayani personal, UMKM, institusi pendidikan, dan korporasi, dengan fokus kemudahan penggunaan dan pengelolaan data). Landing page ini harus menggunakan tema dark mode mewah dengan sentuhan glassmorphism, aksen gradien (deep indigo, electric cyan, neon violet), serta tipografi bersih (Inter / Plus Jakarta Sans).

SISTEM UTAMA & KONTROL ADMIN (SANGAT PENTING):
1. Tampilan Publik vs Admin yang Menyatu (Seamless In-Context Editing):
   - Secara default (tampilan publik), website tampil normal tanpa ada panel admin yang mencolok.
   - Sembunyikan tombol login. Pintu masuk admin dilakukan melalui "Secret Trigger": Pengguna harus mengklik Logo Ghighais di bagian Navbar (misalnya diklik 3 kali berturut-turut).
   - Saat terpicu, tampilkan popup modal Login Admin yang bersih:
     * Username: "ghighais"
     * Password: "gh1gh415"
   - Setelah login berhasil, aktifkan **"Admin Edit Mode" (Mode Edit Langsung)**. Ketika mode ini aktif, seluruh teks, logo, tombol, dan gambar di halaman utama bisa langsung diedit, diubah, atau diklik oleh admin tanpa harus membuka halaman panel terpisah.

2. Fitur Spesifik yang Wajib Bisa Dilakukan oleh Admin:
   - **Ubah Teks & Narasi:** Admin dapat mengklik langsung bagian teks (judul, sub-judul, tentang kami) untuk langsung mengetik dan mengubah isinya (Inline Editing / ContentEditable).
   - **Upload / Ganti Logo Ghighais & Logo Aplikasi:** Admin dapat mengklik area logo untuk mengunggah file gambar logo baru dari perangkat lokal yang otomatis mengganti logo lama di navbar dan hero section.
   - **Manajemen Link Download Aplikasi:** Admin dapat mengklik area tombol App Store & Google Play untuk memasukkan/mengubah URL link download aplikasi secara langsung.
   - **Manajemen Logo Klien / Perusahaan Partner (Trusted By):** Di bagian bawah (Trusted By), berikan tombol interaktif bagi admin untuk "Tambah Logo Klien Baru" (upload gambar logo perusahaan partner), serta tombol hapus pada setiap logo klien yang sudah ada.
   - **Tombol Keluar (Exit Admin Mode):** Sediakan tombol kecil mengapung bertuliskan "Keluar Mode Admin" untuk kembali mengunci halaman ke mode publik biasa.

STRUKTUR KONTEN UTAMA HALAMAN:
1. Navbar: Berisi Logo Ghighais (sebagai tombol rahasia login admin), menu navigasi (Solusi, Fitur, Ekosistem, Tentang Kami, Kontak), dan tombol "Minta Demo".
2. Hero Section: Badge ("🚀 Solusi Teknologi Generasi Terbaru • Est. 2022"), Headline ("Memberdayakan Pendidikan, UMKM, & Korporasi dengan Teknologi Tanpa Batas"), Sub-headline tentang kemudahan penggunaan & manajemen data, serta tombol aksi dan area pratinjau link unduh aplikasi.
3. About Section: Narasi profil perusahaan sejak tahun 2022 yang melayani individu, UMKM, pendidikan, hingga korporasi.
4. Features Section: Grid 3 kolom glassmorphism (Fokus Pendidikan/Korporasi, Keamanan Data, Kemudahan Penggunaan).
5. Contact Section: Informasi kontak resmi perusahaan yaitu email ghighais@proton.me beserta form pesan interaktif.
6. Trusted By (Logo Klien): Grid logo perusahaan partner yang dinamis dan bisa ditambah/dihapus oleh admin.
7. Footer: Hak cipta (© 2022-2026 Ghighais Teknologi), email kontak, dan tautan privasi.


Buatkan juga ubah password pada halaman admin

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ghighaisteknologiai.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fc26d926-d998-4627-9679-1a1046d11299).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
