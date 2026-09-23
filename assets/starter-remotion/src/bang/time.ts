/* =========================================================
   WAKTU — satu-satunya jam: frame Remotion.
   Hukum #2 Bang Motion (deterministik) otomatis terpenuhi selama
   semua nilai visual adalah fungsi dari t = frame / fps.
   Di sini ditulis dalam DETIK absolut (sama seperti rundown), bukan frame,
   supaya angka di kode = angka di tabel rundown.
   ========================================================= */
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

/** detik saat ini (frame / fps) */
export const useT = (): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** Padanan ease GSAP yang dipakai di starter HTML — nama sama, supaya resep techniques.md tetap terbaca. */
export const EASE = {
  linear: Easing.linear,
  'power2.in': Easing.bezier(0.55, 0.085, 0.68, 0.53),
  'power2.out': Easing.bezier(0.25, 0.46, 0.45, 0.94),
  'power2.inOut': Easing.bezier(0.45, 0, 0.55, 1),
  'power3.out': Easing.bezier(0.215, 0.61, 0.355, 1),
  'power4.out': Easing.bezier(0.165, 0.84, 0.44, 1),
  'expo.out': Easing.bezier(0.16, 1, 0.3, 1),
  'expo.inOut': Easing.bezier(0.87, 0, 0.13, 1),
  'sine.in': Easing.bezier(0.12, 0, 0.39, 0),
  'sine.out': Easing.bezier(0.61, 1, 0.88, 1),
  'sine.inOut': Easing.bezier(0.37, 0, 0.63, 1),
  'back.out': Easing.bezier(0.34, 1.56, 0.64, 1),
} as const;
export type EaseName = keyof typeof EASE;

/** progres 0→1 dari detik `at` selama `dur`, di-clamp dan di-ease */
export const prog = (t: number, at: number, dur: number, ease: EaseName = 'power3.out'): number =>
  interpolate(t, [at, at + Math.max(dur, 1e-4)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE[ease],
  });

/** tween satu angka: from → to antara detik at dan at+dur (padanan tl.fromTo) */
export const tw = (t: number, at: number, dur: number, from: number, to: number, ease: EaseName = 'power3.out'): number =>
  from + (to - from) * prog(t, at, dur, ease);

/**
 * Keyframe beruntun seperti tl.to berantai: [[detik, nilai, ease?], ...].
 * Nilai sebelum keyframe pertama = nilai pertama; setelah terakhir = nilai terakhir.
 */
export const keys = (t: number, kf: Array<[number, number, EaseName?]>): number => {
  if (t <= kf[0][0]) return kf[0][1];
  for (let i = 1; i < kf.length; i++) {
    const [t1, v1, e] = kf[i];
    const [t0, v0] = kf[i - 1];
    if (t <= t1) return tw(t, t0, t1 - t0, v0, v1, e ?? 'power2.inOut');
  }
  return kf[kf.length - 1][1];
};

/** Apakah t berada di rentang [from, to) — pengganti tl.set(el,{autoAlpha}) */
export const within = (t: number, from: number, to = Infinity): boolean => t >= from && t < to;

/** getar/kelip deterministik: sinus frekuensi tinggi, BUKAN Math.random() */
export const wobble = (t: number, seed = 0, freq = 1): number =>
  Math.sin(t * 137.2 * freq + seed * 12.9898) * 0.5 + Math.sin(t * 71.7 * freq + seed * 78.233) * 0.5;
