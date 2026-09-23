# Remotion — target output kedua

Bang Motion default-nya menyerahkan SATU `index.html` (diklik dua kali, tanpa instal).
Remotion adalah target kedua untuk user yang memang ingin hasilnya berupa **proyek
React yang dirender ke MP4** — dan starter-nya membawa perkakas yang sama: rig kamera
`#world`, ukuran shot, 8 pintu teks + motion blur berarah, angka hidup, footage, lensa.

Hukum anti-PPT, style brief, menu konsep, dan checklist di `SKILL.md` berlaku PENUH.
Yang berubah hanya mesinnya.

## Kapan memilih Remotion

| Pilih HTML satu-berkas (default) | Pilih Remotion |
|---|---|
| user ingin menonton langsung / membagikan berkas | user menyebut Remotion, React, atau sudah punya proyek Remotion |
| tidak ada Node di mesin user | MP4 adalah deliverable utama, bukan tambahan |
| iterasi cepat lewat `?debug=1` | render paralel/cepat, render di server/Lambda, atau video berparameter (data → banyak video) |
| WebGL/Three.js berat sebagai latar | tim ingin mengedit timeline di Remotion Studio |

Jangan memilih Remotion diam-diam: tanyakan dalam pertanyaan "Langkah nol" yang sama
bila tidak jelas ("HTML yang bisa diklik, atau proyek Remotion untuk dirender ke MP4?").
Remotion butuh Node + `npm install` — sebutkan itu. Lisensi Remotion gratis untuk
individu dan tim kecil; perusahaan tertentu butuh lisensi (remotion.dev/license) —
sebutkan satu kalimat bila user terlihat seperti perusahaan.

## Scaffold

Salin `assets/starter-remotion/` (tanpa `node_modules/`, `out/`, `snaps/`) ke folder proyek:

```bash
npm install
npm run dev          # Remotion Studio: scrub, lihat per frame (padanan ?debug=1)
npm run snap         # verifikasi: potret detik kunci + lembar kontak (padanan scripts/snap.mjs)
npm run render       # MP4 16:9 ke out/opener.mp4 — hanya bila diminta / saat penyerahan
npm run render:vertical   # 9:16
```

```
src/
  index.ts            registerRoot
  Root.tsx            <Composition> Opener (16:9), OpenerVertical (9:16), Perkakas/DoorsDemo
  theme.ts            STYLE BRIEF + token warna + font (PLACEHOLDER abu-abu)
  Opener.tsx          arsitektur lapisan; RUNDOWN ditulis di sini — tanpa adegan contoh
  DoorsDemo.tsx       peraga perkakas (bukan kerangka)
  bang/
    time.ts           useT() detik, tw/keys/prog (tween detik absolut), EASE bernama GSAP, wobble()
    Camera.tsx        <World shots> rig kamera + frameOn() + pushThrough()
    Text.tsx          <Line door outDoor> 8 pintu teks, sorotan opsional, <Counter>
    MotionBlur.tsx    <DirBlur> feGaussianBlur berarah
    Footage.tsx       <Footage at in out rate hold> — padanan clip()
    Lens.tsx          <LightLeak> <Vignette> <Grain> — di luar World
    Background.tsx    latar placeholder (gerak §7c + permukaan §7d)
    useGsap.ts        useGsapTimeline() — jembatan resep GSAP
scripts/snap.mjs      renderStill per detik → snaps/ + sheet.png
remotion.config.ts    jpeg 95, yuv420p, crf 16, ANGLE
```

## Padanan perkakas HTML → Remotion

| Starter HTML | Remotion starter | Catatan |
|---|---|---|
| `tl.time()` / `DURATION` | `useT()` (detik) / `DURATION` di `Opener.tsx` | satu jam: frame Remotion |
| `tl.fromTo(el,{…},{…},T)` | `tw(t, T, dur, from, to, 'power3.out')` inline di `style` | ease bernama sama dengan GSAP |
| rangkaian `tl.to` | `keys(t, [[t0,v0],[t1,v1,'ease'],…])` | |
| `tl.set(el,{autoAlpha:1},T)` | `<Sequence from={T*fps} durationInFrames=…>` atau `within(t,a,b)` | di dalam Sequence `useT()` mulai dari 0 |
| `shot()` / `cutTo()` / `applyCam()` | `<World shots={[{at,s,fx,fy,ease,cut}]}>` | klem tepi + napas sudah di dalam |
| `frameOn(el, fill)` | `frameOn({x,y,w,h}, fill, W, H)` | kotak ditulis dari layout (tidak ada pengukuran DOM saat render) |
| `camThrough()` | `pushThrough(t, atCut)` → kalikan ke pembungkus LOKAL | satu sistem skala per pembungkus |
| `splitChars` + `inUp/…/typeOn` + `outUp/…` | `<Line text at door outAt outDoor/>` | split saat render, tanpa flash |
| `blurTween()` | otomatis di `<Line>`; manual: `<DirBlur amount {...HORIZ}>` | |
| `mark(hl)` | `<Line hl={{word, render:p=>…}}/>` | sorotan tetap OPSIONAL |
| angka `tabular-nums` | `<Counter from to at dur/>` | |
| `clip(el,{at,in,out,rate,hold})` | `<Footage src at in out rate hold style/>` | berkas di `public/` |
| `sweep()` light leak | `<LightLeak at side color/>` | komponen kanonik — dijatah |
| `.vignette` `.grain` | `<Vignette/>` `<Grain/>` | di luar `<World>` |
| Google Fonts `<link>` | `loadFont()` dari `@remotion/google-fonts/NamaFont` | menahan render sampai font siap |
| `?debug=1` | `npm run dev` (Studio) | |
| `snap.mjs` / `export-frames.mjs` | `npm run snap` / `npm run render` | render paralel, tanpa puppeteer manual |
| autoplay + loop, R/Space | tidak relevan — outputnya MP4 | bila butuh player web: `@remotion/player` |

## Aturan khusus Remotion

1. **Semua gerak dari frame.** `useCurrentFrame()`/`useT()` → `interpolate`/`tw`/`keys`.
   CSS `transition`/`animation`/`@keyframes` dan kelas animasi Tailwind TIDAK dirender
   benar (tiap frame difoto di tab terpisah) — tulis ulang sebagai fungsi `t`.
   Hukum #2 tetap: nol `Math.random()`/`Date.now()` saat render; pakai `wobble(t, seed)`
   atau `random(seed)` dari `remotion`.
2. **Tulis interpolasi inline di `style`**, pakai properti `translate`/`scale`/`rotate`
   terpisah (bukan string `transform`) — Studio bisa membaca dan mengeditnya.
3. **Satu adegan = satu `<Sequence name="…">`** dengan detik rundown (`from={T*fps}`).
   Beri `name` agar timeline Studio terbaca seperti rundown. Adegan berganti karena
   kamera/dunia bergerak (Larangan struktural #1) — `<Sequence>` hanya wadah waktu,
   bukan izin mem-fade section. Transisi silang boleh lewat `@remotion/transitions`
   (`TransitionSeries`), tetap dipilih dari menu `techniques.md` §4c; `fade()` di semua
   batas = template PPT.
4. **GSAP boleh, lewat jembatan.** Resep `techniques.md` yang ditulis sebagai `tl.…`
   dipakai apa adanya di `useGsapTimeline((tl, root) => {…})`: timeline dibangun paused
   sekali, lalu di-seek ke `frame/fps` tiap frame. Jangan memanggil `tl.play()`,
   `gsap.to()` bebas, `gsap.ticker`, atau ScrollTrigger. Untuk adegan baru, lebih disukai
   komponen deklaratif (Studio bisa mengeditnya).
5. **Three.js** lewat `@remotion/three` (`<ThreeCanvas>`), state dari `t` — sama dengan
   pola "WebGL ber-state" di `architecture.md`. Jangan `requestAnimationFrame` sendiri.
   Render dengan `--gl=angle` (sudah di `remotion.config.ts`).
6. **Aset di `public/`** lewat `staticFile()`; gambar pakai `<Img>` (menunggu termuat);
   video/audio pakai `<Footage>`/`<Video>`/`<Audio>` dari `@remotion/media` — tanpa
   `autoplay`/`loop`. Musik/VO: `<Audio src={staticFile('vo.mp3')}/>` di Root komposisi.
7. **Ukuran dari `useVideoConfig()`**, bukan 1920/1080 hardcode — supaya satu komponen
   melayani `Opener` (16:9) dan `OpenerVertical` (9:16). Ukuran teks minimum tetap:
   tidak ada teks < 30 px pada sisi 1080.
8. **fps.** Starter 60 fps (sama dengan export HTML). Turunkan ke 30 di `Root.tsx` bila
   render terlalu lama; semua waktu ditulis dalam detik, jadi tidak ada yang bergeser.

## Verifikasi & penyerahan

- Verifikasi tetap FRAME, bukan "kode jalan": `npm run snap` (atau
  `COMP=Opener T="0.5 3 6.2 9" npm run snap`) lalu lihat `snaps/sheet.png` dengan
  heuristik `anti-ppt.md`. `npx tsc --noEmit` hanya memeriksa tipe.
- MP4 dirender sekali saat penyerahan (`npm run render`); jangan render penuh untuk
  mengecek.
- Pesan penutup memuat: `npm install`, `npm run dev` untuk membuka Studio,
  `npm run render` untuk MP4, lokasi aset (`public/`), dan — bila explainer — naskah VO
  seperti biasa (`explainer.md` "Penyerahan"). VO yang dikirim ulang dipasang sebagai
  `<Audio>` dan detik rundown di-retime sama seperti versi HTML.

## Memindahkan proyek HTML yang sudah jadi

1. Salin token warna/font dari `:root` ke `theme.ts` (font via `loadFont`).
2. Markup adegan → JSX di dalam `<Sequence>` per adegan; kelas CSS boleh tetap sebagai
   `<style>` global di `Opener.tsx`, KECUALI `transition`/`animation`.
3. Blok `tl.…` → `useGsapTimeline` (paling cepat), atau tulis ulang dengan `<Line>`/`tw`.
4. `shot()`/`cutTo()` → daftar `shots` di `<World>`.
5. `clip()` → `<Footage>`; berkas pindah dari `assets/` ke `public/`.
6. Snap detik yang sama di kedua versi dan bandingkan.
