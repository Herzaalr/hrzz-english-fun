# Deploy HRZZ English Fun ke GitHub Pages (offline-first PWA)

Panduan ini membuat aplikasi bisa dipasang di Android/desktop **dan dipakai tanpa internet**.
Yang kamu butuhkan: akun GitHub, Git terpasang, dan folder sumber ini.

## Cara kerja singkat
- `build.py` merakit folder `dist/`: rute `pages/<route>/index.html` dipindah ke root, ikon lokal dipasang, `manifest.webmanifest` di-link, service worker diaktifkan (`data-sw="true"`), dan versi cache diberi stempel waktu build.
- `pwa/sw.js` (jadi `/sw.js` di `dist/`) menyimpan seluruh *app shell* saat pertama dibuka. Setelah itu semua halaman, CSS, JS, ikon, font, dan Chart.js dilayani dari cache. Data belajar tetap di IndexedDB (tidak disentuh service worker). Permintaan ke proxy AI (POST) tidak pernah di-cache.
- Workflow `.github/workflows/pages.yml` menjalankan build dan menerbitkan `dist/` setiap kali kamu push ke `main`.

## Langkah 0 — Pakai domain sendiri (disarankan)
1. Ganti nama `CNAME.example` menjadi `CNAME` dan isi dengan domainmu, satu baris, tanpa `https://` (mis. `app.domainmu.com`). `build.py` menyalinnya ke setiap build sehingga pengaturan domain tidak ter-reset saat deploy.
2. DNS di penyedia domain:
   - Subdomain (`app.domainmu.com`): record **CNAME** `app` → `<username>.github.io`
   - Domain utama (`domainmu.com`): record **A** `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, plus CNAME `www` → `<username>.github.io`
   - Cloudflare: set **DNS only** (awan abu-abu) sampai HTTPS GitHub aktif.
3. Setelah push & workflow sukses: GitHub **Settings → Pages → Custom domain** → isi domain → Save → tunggu centang hijau → centang **Enforce HTTPS**. HTTPS wajib untuk mikrofon, IndexedDB, dan mode offline.
Dengan domain sendiri, nama repo bebas (Langkah 1 tidak wajib).

## Langkah 1 — Pilih nama repo (jika TANPA domain sendiri)
Aplikasi memakai path absolut (`/assets/...`, `/speak/`), jadi situs harus berada di **root domain**, bukan di sub-path `/nama-repo/`.
Pilih salah satu:
- **Repo bernama `<username>.github.io`** → URL `https://<username>.github.io/` (paling mudah), atau
- repo dengan nama apa pun **plus custom domain** (Settings → Pages → Custom domain).

## Langkah 2 — Push kode
```bash
unzip hrzz-english-fun-source-v2.3.zip
cd hrzz-english-fun
git init -b main
git add .
git commit -m "HRZZ English Fun: offline-first PWA"
git remote add origin https://github.com/<username>/<username>.github.io.git
git push -u origin main
```

## Langkah 3 — Aktifkan GitHub Pages lewat Actions
Di GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Buka tab **Actions**; workflow "Deploy to GitHub Pages" berjalan otomatis (±1 menit). URL situs muncul di ringkasan job `deploy`.

## Langkah 4 — Uji
1. Buka URL di Chrome Android. Banner "Mode sesi saja" harus **tidak** muncul.
2. Pengaturan → "Pasang di layar utama" (atau menu ⋮ → Instal aplikasi).
3. Tutup aplikasi, **matikan data/Wi-Fi**, buka lagi dari ikon di layar utama: semua halaman harus tetap terbuka. (Pengenalan suara tetap butuh internet karena itu layanan browser; TTS dan semua latihan ketik bekerja offline.)
4. Desktop: F12 → Application → Service Workers harus menampilkan `sw.js` berstatus *activated*.

## Memperbarui aplikasi
Cukup `git push` ke `main`. Build baru memberi versi cache baru; service worker lama mengunduh shell baru di latar belakang dan aktif saat semua tab aplikasi ditutup dan dibuka kembali (atau segera setelah refresh dua kali).

## Opsional: ikon PNG
Chrome Android menampilkan ikon paling rapi dari PNG. Taruh file `assets/icon-512.png` (512×512, kotak ungu `#5b47f5` dengan huruf H putih, mengikuti `assets/icon.svg`), lalu push; `build.py` mendeteksinya otomatis dan `manifest.webmanifest` sudah merujuknya.

## Uji build secara lokal (tanpa GitHub)
```bash
python3 build.py
python3 -m http.server 8080 --directory dist
# buka http://localhost:8080  (service worker aktif di localhost)
```

## Host lain
`dist/` adalah situs statis biasa: unggah ke Netlify, Cloudflare Pages, Vercel (static), atau server apa pun yang menyajikan `index.html` per folder dari root domain.
