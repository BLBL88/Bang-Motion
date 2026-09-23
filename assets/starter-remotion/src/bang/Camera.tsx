/* =========================================================
   RIG KAMERA #world — padanan applyCam() di starter HTML.
   Seluruh dunia (latar + teks + objek) ada DI DALAM <World>, jadi saat
   kamera zoom yang ikut membesar adalah dunianya, bukan layer teks saja.
   HUD (label, caption, light leak, vignette, grain) diletakkan DI LUAR <World>.

   Ukuran shot (techniques.md §3b): wide ↔ medium close-up ↔ close-up ke
   elemen yang sedang bercerita. Kamera = daftar keyframe shot, bukan tween.
   ========================================================= */
import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { EaseName, keys, useT } from './time';

/** satu keyframe kamera: di detik `at` kamera SUDAH berada di shot ini */
export type Shot = {
  at: number;
  s: number;        // skala (1 = wide)
  fx: number;       // titik fokus x, koordinat dunia (px)
  fy: number;       // titik fokus y
  ease?: EaseName;  // ease untuk perpindahan MENUJU shot ini
  cut?: boolean;    // true = lompat di titik cut (tanpa tween), padanan cutTo()
};

/** Kotak elemen di koordinat dunia → [s, fx, fy]; fill ≈ bagian frame yang diisi target */
export const frameOn = (
  r: { x: number; y: number; w: number; h: number },
  fill: number,
  W: number,
  H: number,
): Pick<Shot, 's' | 'fx' | 'fy'> => ({
  s: Math.max(1, Math.min((W * fill) / r.w, (H * fill) / r.h)),
  fx: r.x + r.w / 2,
  fy: r.y + r.h / 2,
});

const camAt = (t: number, shots: Shot[], key: 's' | 'fx' | 'fy'): number => {
  // cut = dua keyframe di detik yang sama (tahan nilai lama sampai tepat di cut)
  const kf: Array<[number, number, EaseName?]> = [];
  shots.forEach((sh, i) => {
    if (sh.cut && i > 0) kf.push([sh.at - 1e-4, camAt(sh.at - 1e-4, shots.slice(0, i), key)]);
    kf.push([sh.at, sh[key], sh.ease ?? 'power2.inOut']);
  });
  return keys(t, kf);
};

export const World: React.FC<{
  shots?: Shot[];
  breathe?: number;          // amplitudo napas halus di atas shot (0.01 = 1 %); 0 = mati
  clampEdges?: boolean;      // tepi dunia tidak tersingkap (butuh overscan bila false)
  children: React.ReactNode;
}> = ({ shots = [{ at: 0, s: 1, fx: 0, fy: 0 }], breathe = 0.01, clampEdges = true, children }) => {
  const t = useT();
  const { width: W, height: H } = useVideoConfig();
  const norm = shots.map((sh) => ({ ...sh, fx: sh.fx || W / 2, fy: sh.fy || H / 2 }));
  const s = camAt(t, norm, 's') * (1 + breathe * Math.sin(t * 0.7));
  const fx = camAt(t, norm, 'fx');
  const fy = camAt(t, norm, 'fy');
  let tx = W / 2 - fx * s;
  let ty = H / 2 - fy * s;
  if (clampEdges) {
    tx = Math.min(0, Math.max(W - W * s, tx));
    ty = Math.min(0, Math.max(H - H * s, ty));
  }
  return (
    <AbsoluteFill
      style={{ transformOrigin: '0 0', translate: `${tx}px ${ty}px`, scale: String(s), willChange: 'transform' }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Push-through (techniques.md §3): dorong masuk ke subjek lama, cut, tarik mundur dari subjek baru.
 * Kembalikan skala tambahan — kalikan ke pembungkus lokal, JANGAN ke <World> yang sudah memakai shots
 * (satu sistem skala per pembungkus).
 */
export const pushThrough = (
  t: number,
  atCut: number,
  { push = 2, from = 1.5, inDur = 0.5, outDur = 0.95 } = {},
): number =>
  t < atCut
    ? keys(t, [[atCut - inDur, 1], [atCut, push, 'power2.in']])
    : keys(t, [[atCut, from], [atCut + outDur, 1, 'power3.out']]);
