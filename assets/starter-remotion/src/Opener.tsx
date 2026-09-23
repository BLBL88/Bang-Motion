/* =========================================================
   OPENER / PROMO / BUMPER / TYPOGRAPHY — komposisi Remotion.
   Ini ARSITEKTUR + PERKAKAS, bukan gaya dan bukan kerangka — sama seperti
   assets/starter-opener.html. SENGAJA TANPA URUTAN ADEGAN CONTOH:
   kerangka lahir dari references/opener-konsep.md.

   Struktur lapisan (architecture.md):
     <AbsoluteFill>            panggung W×H (1920×1080 atau 1080×1920)
       <World shots>           rig kamera: latar + adegan ikut zoom
         <Background/>         gerak latar §7c + permukaan §7d
         adegan…               <Sequence> per adegan, detik absolut
       </World>
       HUD                     label/caption layar (tidak ikut zoom)
       <LightLeak/> <Vignette/> <Grain/>   lensa
   ========================================================= */
import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { DriftingBlobs } from './bang/Background';
import { Shot, World } from './bang/Camera';
import { Grain, Vignette } from './bang/Lens';
import { C, DISPLAY } from './theme';

export const DURATION = 30; // detik — satu tempat, sama seperti rundown

export const Opener: React.FC = () => {
  const { width: W, height: H } = useVideoConfig();

  /* ================= KAMERA — ukuran shot dari rundown (techniques.md §3b) =================
     { at, s, fx, fy, ease?, cut? } — di detik `at` kamera SUDAH di shot itu.
     Contoh:  { at: 4, s: 1.8, fx: 640, fy: 420 }            dekat ke elemen A
              { at: 6.5, s: 1, fx: W/2, fy: H/2 }             mundur ke wide
              { at: 9, s: 2.2, fx: 1300, fy: 600, cut: true } adegan lahir dekat
     Hitung s/fx/fy dari kotak elemen dengan frameOn({x,y,w,h}, fill, W, H). */
  const shots: Shot[] = [{ at: 0, s: 1, fx: W / 2, fy: H / 2 }];

  return (
    <AbsoluteFill style={{ background: C.base, color: C.ink, fontFamily: DISPLAY }}>
      <World shots={shots}>
        <DriftingBlobs
          base={C.base}
          a={`color-mix(in srgb, ${C.accentLit} 22%, transparent)`}
          b={`color-mix(in srgb, ${C.accent} 18%, transparent)`}
        />

        {/* ================= RUNDOWN — tulis adegan dari KONSEP di sini =================
            Satu adegan = satu <Sequence from={detik*fps} durationInFrames={...} name="...">.
            Di dalamnya pakai <Line text at door outAt outDoor/>, <Counter/>, <Footage/>,
            atau useGsapTimeline() untuk memindahkan resep GSAP dari starter HTML.
            Di dalam <Sequence>, useT() dimulai dari 0 lagi (waktu lokal adegan).
            Adegan berganti karena DUNIA/KAMERA bergerak, bukan karena section di-fade
            (Larangan struktural #1). Peraga pintu teks: komposisi "DoorsDemo".
            ============================================================================== */}
      </World>

      {/* HUD: label/caption layar di sini (di luar rig, tidak ikut zoom) */}

      <Vignette strength={0.8} />
      <Grain opacity={0.08} />
    </AbsoluteFill>
  );
};
