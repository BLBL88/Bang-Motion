/* =========================================================
   JEMBATAN GSAP — pakai timeline GSAP (resep techniques.md apa adanya)
   di dalam Remotion tanpa kehilangan determinisme.

   Timeline dibangun SEKALI dalam keadaan paused, lalu tiap frame Remotion
   di-seek ke t = frame / fps. GSAP tidak pernah memakai jamnya sendiri,
   jadi render paralel Remotion (banyak tab Chrome) tetap identik per frame.

   Pakai ini untuk memindahkan adegan yang sudah jadi di starter HTML
   (tl.fromTo(...) dengan detik absolut). Untuk adegan baru, lebih disukai
   komponen deklaratif (Line, World, tw/keys) — Studio bisa membacanya.
   ========================================================= */
import { gsap } from 'gsap';
import { useLayoutEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const useGsapTimeline = <T extends HTMLElement = HTMLDivElement>(
  build: (tl: gsap.core.Timeline, root: T) => void,
) => {
  const root = useRef<T>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  useLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      build(tl, root.current!);
      tlRef.current = tl;
    }, root);
    return () => { ctx.revert(); tlRef.current = null; };
    // build sengaja tidak jadi dependensi: timeline dibangun sekali per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    tlRef.current?.time(frame / fps, false);   // seek sinkron, tanpa callback
  }, [frame, fps]);

  return root;
};
