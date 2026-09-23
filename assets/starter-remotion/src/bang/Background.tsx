/* =========================================================
   LATAR — PLACEHOLDER abu-abu. Gerak latar (techniques.md §7c) dan
   permukaan latar ≥ 2 lapis (§7d) WAJIB diganti dari style brief.
   Contoh di sini: gradien berlapis + blob yang mengambang pelan.
   Semua posisi = fungsi t (sinus), tidak ada akumulasi.
   ========================================================= */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useT } from './time';

export const DriftingBlobs: React.FC<{ base: string; a: string; b: string }> = ({ base, a, b }) => {
  const t = useT();
  const blob = (x: number, y: number, r: number, c: string, ph: number): React.CSSProperties => ({
    position: 'absolute',
    left: x + 80 * Math.sin(t * 0.21 + ph),
    top: y + 60 * Math.cos(t * 0.17 + ph),
    width: r, height: r, borderRadius: '50%',
    background: `radial-gradient(circle, ${c} 0%, transparent 66%)`,
  });
  return (
    <AbsoluteFill style={{ background: base, overflow: 'hidden' }}>
      <div style={blob(-260, -380, 1100, a, 0)} />
      <div style={blob(1180, 520, 1000, b, 2.1)} />
      <div style={blob(420, 700, 800, a, 4.2)} />
    </AbsoluteFill>
  );
};
