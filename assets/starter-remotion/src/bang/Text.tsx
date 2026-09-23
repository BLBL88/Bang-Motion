/* =========================================================
   8 PINTU TEKS (techniques.md §1) — padanan inUp/inDown/inLeft/inRight/
   inDepth/inMask/inWords/typeOn + 5 pintu keluar di starter HTML.
   Tidak ada pintu default: pilih dari ARTI kalimat. Dua adegan berturut-turut
   tidak boleh sama dalam ukuran, arah masuk, dan posisi teks (Hukum #4).

   Split per huruf dilakukan saat render (React), jadi tidak ada pengukuran DOM
   dan tidak ada flash sebelum animasi: huruf yang belum waktunya = opacity 0.
   ========================================================= */
import React from 'react';
import { DirBlur, HORIZ, RADIAL, VERT } from './MotionBlur';
import { EaseName, prog, useT } from './time';

export type DoorIn = 'up' | 'down' | 'left' | 'right' | 'depth' | 'mask' | 'words' | 'type';
export type DoorOut = 'up' | 'down' | 'left' | 'right' | 'depth';
export type MaskFrom = 'left' | 'right' | 'up' | 'down';

type Char = { c: string; word: number; i: number };
const split = (text: string): { chars: Char[]; words: string[] } => {
  const words = text.split(' ');
  const chars: Char[] = [];
  words.forEach((w, wi) => {
    for (const c of w) chars.push({ c, word: wi, i: chars.length });
    if (wi < words.length - 1) chars.push({ c: ' ', word: wi, i: chars.length });
  });
  return { chars, words };
};

const IN_DEF: Record<DoorIn, { dur: number; st: number; ease: EaseName }> = {
  up: { dur: 0.8, st: 0.024, ease: 'power4.out' },
  down: { dur: 0.8, st: 0.024, ease: 'power4.out' },
  left: { dur: 0.75, st: 0.02, ease: 'power4.out' },
  right: { dur: 0.75, st: 0.02, ease: 'power4.out' },
  depth: { dur: 1, st: 0.018, ease: 'expo.out' },
  mask: { dur: 0.9, st: 0, ease: 'power3.out' },
  words: { dur: 0.6, st: 0.14, ease: 'power4.out' },
  type: { dur: 0, st: 1 / 18, ease: 'linear' },   // st = detik per huruf (18 cps)
};

/** urutan stagger per huruf: right = dari akhir, depth = dari tengah */
const order = (door: DoorIn | DoorOut, i: number, n: number): number =>
  door === 'right' ? n - 1 - i : door === 'depth' ? Math.abs(i - (n - 1) / 2) : i;

export type LineProps = {
  text: string;
  at: number;                    // detik masuk
  door: DoorIn;
  outAt?: number;                // detik keluar (opsional)
  outDoor?: DoorOut;
  dur?: number;
  st?: number;                   // stagger per huruf/kata
  maskFrom?: MaskFrom;
  className?: string;
  style?: React.CSSProperties;
  /** kata sorotan OPSIONAL (style brief): indeks kata + render lapisan sorotannya */
  hl?: { word: number; at?: number; render: (p: number) => React.ReactNode };
};

export const Line: React.FC<LineProps> = ({
  text, at, door, outAt, outDoor = 'up', dur, st, maskFrom = 'left', className, style, hl,
}) => {
  const t = useT();
  const def = IN_DEF[door];
  const D = dur ?? def.dur;
  const S = st ?? def.st;
  const { chars, words } = split(text);
  const n = chars.length;
  const outDur = 0.4;
  const leaving = outAt != null && t >= outAt;
  if (outAt != null && t > outAt + outDur + n * 0.01 + 0.1) return null;
  if (t < at) return null;

  // motion blur berarah untuk seluruh baris (masuk: 30→0, keluar: 0→45)
  const axes = door === 'up' || door === 'down' ? VERT : door === 'depth' ? RADIAL : HORIZ;
  const inBlurMax = door === 'left' || door === 'right' ? 50 : door === 'depth' ? 22 : door === 'mask' || door === 'type' || door === 'words' ? 0 : 30;
  let blur = inBlurMax * (1 - prog(t, at, D, def.ease));
  let bAxes = axes;
  if (leaving) {
    blur = 45 * prog(t, outAt!, outDur + 0.1, 'power2.in');
    bAxes = outDoor === 'up' || outDoor === 'down' ? VERT : outDoor === 'depth' ? RADIAL : HORIZ;
  }

  const clip =
    door === 'mask'
      ? (() => {
          const p = (1 - prog(t, at, D, def.ease)) * 100;
          return { left: `inset(0% ${p}% 0% 0%)`, right: `inset(0% 0% 0% ${p}%)`, up: `inset(${p}% 0% 0% 0%)`, down: `inset(0% 0% ${p}% 0%)` }[maskFrom];
        })()
      : undefined;

  const charStyle = (ch: Char): React.CSSProperties => {
    let o = 1, x = 0, y = 0, sc = 1, sy = 1;
    const k = order(door, ch.i, n);
    if (door === 'type') {
      o = t >= at + ch.i * S ? 1 : 0;
    } else if (door === 'words') {
      const p = prog(t, at + ch.word * S, D, def.ease);
      o = p; y = 40 * (1 - p);
    } else if (door !== 'mask') {
      const p = prog(t, at + k * S, D, def.ease);
      o = p;
      if (door === 'up') { y = 60 * (1 - p); sy = 1 + 0.45 * (1 - p); }
      if (door === 'down') { y = -60 * (1 - p); sy = 1 + 0.45 * (1 - p); }
      if (door === 'left') x = -45 * (1 - p);
      if (door === 'right') x = 45 * (1 - p);
      if (door === 'depth') sc = 1 + 1.4 * (1 - p);
    }
    if (leaving) {
      const q = prog(t, outAt! + order(outDoor, ch.i, n) * 0.01, outDur, 'power2.in');
      o *= 1 - q;
      if (outDoor === 'up') y += -70 * q;
      if (outDoor === 'down') y += 70 * q;
      if (outDoor === 'left') x += -60 * q;
      if (outDoor === 'right') x += 60 * q;
      if (outDoor === 'depth') sc *= 1 + 1.6 * q;
    }
    return {
      display: 'inline-block',
      opacity: o,
      translate: `${x}% ${y}%`,
      scale: sc === 1 && sy === 1 ? undefined : `${sc} ${sc * sy}`,
      whiteSpace: 'pre',
    };
  };

  return (
    <DirBlur amount={blur} {...bAxes} style={{ display: 'inline-block' }}>
      <span className={className} style={{ display: 'inline-block', whiteSpace: 'nowrap', clipPath: clip, ...style }}>
        {words.map((w, wi) => {
          const wordChars = chars.filter((c) => c.word === wi);
          const inner = wordChars.map((ch) => (
            <span key={ch.i} style={charStyle(ch)}>{ch.c}</span>
          ));
          if (hl && hl.word === wi) {
            const p = prog(t, hl.at ?? at + 0.5, 0.5, 'power3.out');
            return (
              <span key={wi} style={{ position: 'relative', display: 'inline-block' }}>
                {hl.render(p)}
                <span style={{ position: 'relative' }}>{inner}</span>
              </span>
            );
          }
          return <React.Fragment key={wi}>{inner}</React.Fragment>;
        })}
      </span>
    </DirBlur>
  );
};

/** Angka hidup deterministik (techniques.md §9): tabular-nums + min-width supaya wadah tidak bergetar */
export const Counter: React.FC<{
  from: number; to: number; at: number; dur: number;
  decimals?: number; prefix?: string; suffix?: string; locale?: string;
  style?: React.CSSProperties;
}> = ({ from, to, at, dur, decimals = 0, prefix = '', suffix = '', locale = 'id-ID', style }) => {
  const t = useT();
  const v = from + (to - from) * prog(t, at, dur, 'expo.out');
  const txt = v.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const w = to.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).length;
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', display: 'inline-block', minWidth: `${w}ch`, textAlign: 'right', ...style }}>
      {prefix}{txt}{suffix}
    </span>
  );
};
