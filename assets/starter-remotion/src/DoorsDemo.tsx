/* =========================================================
   PERAGA — katalog 8 pintu teks + angka hidup + kamera shot + jembatan GSAP.
   Ini daftar PERKAKAS, bukan urutan adegan. Jangan dijadikan kerangka.
   ========================================================= */
import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { DriftingBlobs } from './bang/Background';
import { Shot, World } from './bang/Camera';
import { Grain, Vignette } from './bang/Lens';
import { Counter, DoorIn, DoorOut, Line } from './bang/Text';
import { useGsapTimeline } from './bang/useGsap';
import { C, DISPLAY } from './theme';

const PAIRS: Array<[DoorIn, DoorOut]> = [
  ['up', 'up'], ['down', 'down'], ['left', 'left'], ['right', 'right'],
  ['depth', 'depth'], ['mask', 'depth'], ['words', 'up'], ['type', 'left'],
];
const STEP = 1.9;
export const DEMO_DURATION = PAIRS.length * STEP + 3 + 3;

const GsapBridge: React.FC = () => {
  // resep GSAP apa adanya: detik absolut (lokal Sequence), timeline di-seek per frame
  const ref = useGsapTimeline((tl, root) => {
    const dots = root.querySelectorAll('.dot');
    tl.fromTo(dots, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)', stagger: 0.08 }, 0.2);
    tl.to(dots, { y: -80, duration: 0.8, ease: 'power2.inOut', stagger: { each: 0.06, yoyo: true, repeat: 1 } }, 1);
  });
  return (
    <AbsoluteFill ref={ref} style={{ alignItems: 'center', justifyContent: 'center', gap: 36, flexDirection: 'row' }}>
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className="dot" style={{ width: 64, height: 64, borderRadius: 32, background: C.accentLit, opacity: 0 }} />
      ))}
    </AbsoluteFill>
  );
};

export const DoorsDemo: React.FC = () => {
  const { width: W, height: H, fps } = useVideoConfig();
  const tCount = PAIRS.length * STEP;
  const shots: Shot[] = [
    { at: 0, s: 1, fx: W / 2, fy: H / 2 },
    { at: tCount + 0.2, s: 1, fx: W / 2, fy: H / 2 },
    { at: tCount + 1.0, s: 1.7, fx: W / 2, fy: H / 2 }, // medium close-up ke angka
    { at: tCount + 2.6, s: 1, fx: W / 2, fy: H / 2 }, // mundur ke wide
  ];
  return (
    <AbsoluteFill style={{ background: C.base, color: C.ink, fontFamily: DISPLAY }}>
      <World shots={shots}>
        <DriftingBlobs
          base={C.base}
          a={`color-mix(in srgb, ${C.accentLit} 22%, transparent)`}
          b={`color-mix(in srgb, ${C.accent} 18%, transparent)`}
        />
        {PAIRS.map(([pin, pout], i) => (
          <Sequence key={pin} from={Math.round(i * STEP * fps)} durationInFrames={Math.round(STEP * fps)} name={`Pintu ${pin}`}>
            <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Line
                text={`Pintu ${pin} dipilih dari arti`}
                at={0.2}
                door={pin}
                outAt={1.35}
                outDoor={pout}
                style={{ fontSize: W < H ? 86 : 110, fontWeight: 500, letterSpacing: '-0.01em' }}
              />
            </AbsoluteFill>
          </Sequence>
        ))}
        <Sequence from={Math.round(tCount * fps)} durationInFrames={3 * fps} name="Angka hidup">
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', fontSize: 160, fontWeight: 600 }}>
            <Counter from={0} to={12480} at={0.2} dur={1.6} />
          </AbsoluteFill>
        </Sequence>
        <Sequence from={Math.round((tCount + 3) * fps)} durationInFrames={3 * fps} name="Jembatan GSAP">
          <GsapBridge />
        </Sequence>
      </World>
      <Vignette strength={0.8} />
      <Grain opacity={0.08} />
    </AbsoluteFill>
  );
};
