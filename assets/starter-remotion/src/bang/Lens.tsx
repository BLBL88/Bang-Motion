/* =========================================================
   LAPISAN LENSA — di LUAR <World>: light leak, vignette, grain hidup.
   Cahaya di depan lensa bukan bagian dunia, jadi tidak ikut zoom.
   ========================================================= */
import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { keys, tw, useT } from './time';

/** Light leak sekali sapu (jatah: komponen kanonik — pakai hanya bila konsep menuntut) */
export const LightLeak: React.FC<{ at: number; dur?: number; side?: 1 | -1; color: string }> = ({
  at, dur = 1, side = 1, color,
}) => {
  const t = useT();
  if (t < at || t > at + dur) return null;
  const x = tw(t, at, dur, side * 1500, side * 330, 'sine.out');
  const y = tw(t, at, dur, -240, 130, 'sine.out');
  const s = tw(t, at, dur, 0.85, 1.12, 'sine.out');
  const o = keys(t, [[at, 0], [at + dur * 0.4, 0.85, 'sine.in'], [at + dur, 0, 'sine.out']]);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      <div
        style={{
          position: 'absolute', left: '50%', top: '50%', width: 2400, height: 2400,
          margin: '-1200px 0 0 -1200px', borderRadius: '50%', filter: 'blur(64px)',
          background: `radial-gradient(circle, color-mix(in srgb, ${color} 85%, white), color-mix(in srgb, ${color} 55%, transparent) 34%, transparent 74%)`,
          translate: `${x}px ${y}px`, scale: String(s), opacity: o,
        }}
      />
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none', opacity: strength,
      background:
        'linear-gradient(180deg,rgba(0,0,0,.45),transparent 30%),radial-gradient(ellipse 78% 68% at 50% 52%,transparent 40%,rgba(0,0,0,.55) 86%,rgba(0,0,0,.9) 100%)',
    }}
  />
);

/**
 * Grain hidup — pola noise SVG yang bergeser per frame (deterministik: seed = frame).
 * Periksa di MP4 hasil encode: grain harus masih terlihat (crf rendah, bukan dihaluskan encoder).
 */
export const Grain: React.FC<{ opacity?: number; size?: number }> = ({ opacity = 0.12, size = 1.6 }) => {
  const t = useT();
  const { fps } = useVideoConfig();
  const seed = Math.floor(t * fps) % 12;   // 12 varian bergantian: kelip tanpa Math.random()
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity, mixBlendMode: 'overlay' }}>
      <svg width="100%" height="100%">
        <filter id={`grain${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency={size / 2} numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
