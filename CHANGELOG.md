# Changelog

## 1.20.0 — 2026-09-23

**Remotion sebagai target output kedua**
- Selain `index.html` satu-berkas (tetap default), skill kini bisa menyerahkan proyek Remotion
  yang dirender ke MP4 (`assets/starter-remotion/`, Remotion 4 + React 19 + TypeScript).
- Perkakas yang sama dalam bentuk komponen: `<World shots>` (rig kamera + ukuran shot + klem
  tepi + napas), `<Line>` 8 pintu teks masuk/keluar dengan motion blur berarah, `<Counter>`,
  `<Footage>` (padanan `clip()`), `<LightLeak>`/`<Vignette>`/`<Grain>`, tween detik absolut
  dengan ease bernama GSAP, dan `useGsapTimeline()` untuk memakai resep GSAP apa adanya.
- Komposisi 16:9 dan 9:16 dari satu komponen, peraga `DoorsDemo`, `npm run snap` (potret detik
  kunci + lembar kontak) dan `npm run render`.
- Panduan kapan memilih Remotion, padanan HTML → Remotion, aturan khusus, dan cara memindahkan
  proyek HTML yang sudah jadi (`references/remotion.md`).

## 1.19.0 — 2026-09-15

**Ukuran shot — kamera ke elemen**
- "Zoom in-out" dirumuskan sebagai pergantian ukuran shot (wide ↔ medium close-up ↔ close-up) ke
  elemen yang sedang bercerita, bukan napas kamera beberapa persen yang hampir tak terlihat.
- Panduan memilih target dan waktu, dua tempo gerak, rig kamera dengan skala dari ukuran elemen
  dan klem tepi dunia, label di lapisan layar (`references/techniques.md` §3b).

## 1.18.0 — 2026-09-15

**Video sebagai layer footage**
- Semua starter membawa helper `clip(el, {at, in, out, rate, hold})`: klip video mengikuti jam
  timeline — sinkron saat diputar, tepat saat scrub — dan bisa dipotong, diperlambat, ditahan,
  di-mask, serta dianimasikan bersama elemen lain.
- `scripts/snap.mjs` dan `scripts/export-frames.mjs` menunggu frame klip siap, sehingga ekspor MP4
  tetap presisi frame.
- Panduan pemakaian, sumber klip (file sendiri, generate lewat MCP, stok berlisensi), format, dan
  pola layout di `references/techniques.md` §9b.
- Deliverable tetap `index.html` (+ `assets/` bila memakai klip atau audio), tanpa file peluncur.

## 1.17.0 — 2026-09-14

**Opener dan promo**
- Kerangka dipilih, bukan diwarisi: tiga kandidat konsep dari menu 19 konsep, sidik jari
  struktur yang dibandingkan dengan proyek sebelumnya, komponen kanonik paling banyak dua,
  dan starter opener tanpa urutan adegan contoh (`references/opener-konsep.md`,
  `assets/starter-opener.html`).
- Contoh urutan tiap konsep adalah prinsip, bukan naskah: pembuka/penutup dan momen khas
  tidak disalin; palet, bentuk, dan properti diturunkan dari brand, tiap warna menyebut
  sumbernya.
- Panduan animasi UI untuk app/SaaS, kamera yang mengikuti klik penting, dan foto dalam
  opener (foto user, generate lewat MCP, atau stok berlisensi).

**Tipografi, latar, render**
- Sorotan kata opsional; judul dan klaim tanpa titik otomatis.
- Latar tidak pernah statis; warna latar boleh berganti kapan dibutuhkan dengan pemicu
  terlihat. Grainy gradient dengan jaga-jaga encode. Menu gaya render objek.

**Explainer**
- Enam gaya: aksi kontinu, kartun kolase, jurnalisme visual, katalog putih, sketsa vintage,
  dan kartun panggung (`references/explainer.md`, `references/kartun-panggung.md`).

**After Effects**
- Dibangun langsung lewat bridge/MCP Higgsfield (`references/ae-bridge-higgsfield.md`,
  `scripts/ae/bridge/`).

**Alat kerja**
- Verifikasi visual per detik kunci (`scripts/snap.mjs`), ekspor MP4
  (`scripts/export-frames.mjs`), pemotong jeda VO (`scripts/vo-pauses.html`).
